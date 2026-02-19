import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { floekieExperiments, floekieSprints } from "./floekie-playbook";
import { floekieContent } from "./floekie-content";
import { benchmarkData } from "./benchmark-data";
import { getChannelMetricsForContentType, getChannelMetricsForExperiment } from "../src/lib/benchmark-mapping";
import { calculateRise } from "../src/lib/rise-utils";
import { generateUtmSets } from "../src/lib/utm-utils";
import type { RiseInputs } from "../src/types";

const prisma = new PrismaClient();

// Transform playbook audienceSpecs format to dashboard format
function transformAudienceSpecs(raw: any): any {
  if (!raw || Object.keys(raw).length === 0) return null;
  const channels = Object.entries(raw).map(([channel, spec]: [string, any]) => ({
    channel,
    targeting: {
      ...(spec.targeting ? { interests: [spec.targeting] } : {}),
      ...(spec.keywords ? { keywords: Array.isArray(spec.keywords) ? spec.keywords : [spec.keywords] } : {}),
      ...(spec.interests ? { interests: Array.isArray(spec.interests) ? spec.interests : [spec.interests] } : {}),
      ...(spec.behaviors ? { behaviors: Array.isArray(spec.behaviors) ? spec.behaviors : [spec.behaviors] } : {}),
      ...(spec.retargeting ? { retargeting: { source: spec.retargeting, window: "30 days", excludeConverted: false } } : {}),
    },
    estimatedSize: spec.estimatedSize || spec.audienceSize || null,
    budget: spec.budget || null,
    notes: spec.platforms || spec.notes || null,
  }));
  return { channels };
}

// Transform playbook designBriefing format to dashboard format
function transformDesignBriefing(raw: any): any {
  if (!raw || Object.keys(raw).length === 0) return null;
  const assets: any[] = [];
  for (const [channel, items] of Object.entries(raw)) {
    if (!Array.isArray(items)) continue;
    for (const item of items) {
      assets.push({
        type: `${channel} — ${item.format || "asset"}`,
        format: item.specs || item.format || "TBD",
        description: item.description || "",
        copyOnAsset: item.copyOnAsset || item.cta || "Zie content tab",
        style: item.style || null,
        variants: item.variants || null,
      });
    }
  }
  return assets.length > 0 ? { assets } : null;
}

function riseFields(inputs: RiseInputs) {
  const scores = calculateRise(inputs);
  return {
    riseReach: scores.reach,
    riseImpact: scores.impact,
    riseConfidence: scores.confidence,
    riseEase: scores.ease,
    riseTotal: scores.total,
    riseInputs: inputs as any,
  };
}

async function main() {
  // Delete existing data
  await prisma.deliverable.deleteMany();
  await prisma.experimentTarget.deleteMany();
  await prisma.benchmark.deleteMany();
  await prisma.experiment.deleteMany();
  await prisma.growthLoop.deleteMany();
  await prisma.sprint.deleteMany();
  await prisma.client.deleteMany();

  // ============================================================
  // FLOEKIE — Consumer Pet App (floekie.dog)
  // ============================================================

  const floekiePasswordHash = await bcrypt.hash("floekie2026", 12);

  const floekie = await prisma.client.create({
    data: {
      name: "Floekie",
      slug: "floekie",
      passwordHash: floekiePasswordHash,
      brandPrimary: "#F59E0B",
      brandGradient: "#F59E0B,#D97706,#92400E",
      industry: "consumer-pet-app",
      context: {
        company: {
          name: "Floekie",
          description:
            "Floekie is een Nederlandstalige honden-app gebouwd door Imen, een gepassioneerde hondeneigenares met 4 honden (waarvan 2 rescue). De app helpt toekomstige en huidige hondeneigenaren met een gratis ras-quiz, gepersonaliseerd voedingsplan, gewichttracker en productaanbevelingen via Maxizoo.",
          valueProp:
            "Gratis ras-quiz in 7 vragen + betaald hondenprofiel (€4.95/maand) met voedingsplan op basis van veterinaire formules, gewichttracker, Maxizoo productaanbevelingen en tips per levensfase.",
          founder: "Imen — 4 honden (waarvan 2 rescue), 11+ jaar ervaring met Floekie de teckel",
          website: "floekie.dog",
        },
        market: {
          tam: "4.2M huishoudens met hond (BE+NL)",
          sam: "800K actieve online hondeneigenaren (18-45, BE+NL)",
          som: "50K-100K (eerste jaar target, quiz-gebruikers)",
          trends: [
            "Groeiende 'pet humanization' trend — honden als gezinslid",
            "Stijgende vraag naar gepersonaliseerde dierenvoeding",
            "Pet tech markt groeit 25%+ per jaar",
            "Instagram/TikTok hondencontent = extreme engagement",
          ],
        },
        icp: {
          segments: [
            {
              name: "Toekomstige hondeneigenaren",
              description: "18-45 jaar, overweegt een hond maar twijfelt over het ras. Quiz als instap, profiel na rasmatch.",
              estimatedSize: "200K-400K (BE+NL)",
              priority: 1,
            },
            {
              name: "Puppy-eigenaars",
              description: "22-40 jaar, net een puppy of binnenkort. Voedingsplan + gewichttracker = key value. Hoogste LTV segment.",
              estimatedSize: "150K-250K (BE+NL)",
              priority: 2,
            },
            {
              name: "Volwassen/senior hond eigenaars",
              description: "25-55 jaar, bestaande hondeneigenaar. Productaanbevelingen en levensfase-tips als value.",
              estimatedSize: "500K-800K (BE+NL)",
              priority: 3,
            },
          ],
        },
        pricing: {
          quiz: "Gratis — geen login nodig, funnel entry",
          profile: "€4.95/maand — registratie + login vereist, maandelijks opzegbaar",
          affiliate: "Maxizoo commissie op productaanbevelingen (5-10% per aankoop)",
        },
        funnel: {
          l1: "Acquisition: Gratis quiz traffic via Meta Ads, Google Ads en organic social",
          l2: "Activatie: Quiz-completers converteren naar betaald profiel via retargeting en email nurture",
          l3: "Revenue: Subscribers behouden via feature adoption emails + Maxizoo affiliate revenue",
        },
      },
    },
  });

  console.log(`Client created: ${floekie.name} (${floekie.slug})`);

  // Floekie Experiments
  let sortOrder = 1;
  for (const exp of floekieExperiments) {
    const { riseInputs: ri, targetSegment, tier, audienceSpecs, designBriefing, ...expData } = exp as any;
    const tierNum = tier === "L1" ? 1 : tier === "L2" ? 2 : 3;
    const contentData = floekieContent[sortOrder];

    await prisma.experiment.create({
      data: {
        clientId: floekie.id,
        ...expData,
        tier: tierNum,
        sortOrder,
        ...(audienceSpecs ? { audienceSpecs: transformAudienceSpecs(audienceSpecs) } : {}),
        ...(designBriefing ? { designBriefing: transformDesignBriefing(designBriefing) } : {}),
        ...(contentData ? { contentType: contentData.contentType, content: contentData.content as any } : {}),
        ...riseFields(ri),
      },
    });
    sortOrder++;
  }

  console.log(`Experiments created: ${floekieExperiments.length}`);

  // Assign experiment codes + UTM sets
  const floekieExps = await prisma.experiment.findMany({
    where: { clientId: floekie.id },
    orderBy: { sortOrder: "asc" },
  });

  for (const exp of floekieExps) {
    const code = `GH${exp.sortOrder}`;
    const utmSets = generateUtmSets({
      experimentCode: code,
      name: exp.name,
      channels: exp.channels,
    });
    await prisma.experiment.update({
      where: { id: exp.id },
      data: { experimentCode: code, utmSets: utmSets as any },
    });
  }

  console.log("UTM sets generated");

  // Floekie Sprints
  for (const sprint of floekieSprints) {
    await prisma.sprint.create({
      data: {
        clientId: floekie.id,
        number: sprint.number,
        name: sprint.name,
        weeks: sprint.weeks,
        focus: sprint.focus,
        activities: sprint.activities as any,
        successCriteria: sprint.successCriteria as any,
        status: sprint.number === 1 ? "active" : "upcoming",
      },
    });
  }

  console.log(`Sprints created: ${floekieSprints.length}`);

  // Growth Loops
  const floekieLoops = [
    {
      name: "Quiz Viral Loop",
      description: "Gratis quiz resultaat delen op social media trekt nieuwe quiz-gebruikers aan. Elke share genereert 2-5 nieuwe quiz starts.",
      steps: ["Gebruiker doet gratis ras-quiz", "Resultaat: 'Jouw match is een Golden Retriever!'", "Deel-knop op resultaatpagina", "Gedeeld op Instagram/WhatsApp/Facebook", "Vrienden klikken en doen zelf de quiz", "Quiz completers worden email subscribers en profiel-kopers"],
      keyMetric: "Viral coefficient (shares per quiz completion)",
      timeToImpact: "2-4 weken",
      priority: 1,
    },
    {
      name: "Content to Quiz to Profile Loop",
      description: "Organic social content bouwt audience, bio link stuurt naar quiz, quiz completers worden via email nurture geconverteerd naar betaalde profielen.",
      steps: ["Imen post hondencontent (3-4x/week)", "Volgers groeien via algorithm + engagement", "Bio link naar gratis quiz", "Quiz completers geven email", "Nurture sequence duwt naar profiel", "Profiel gebruikers kopen via Maxizoo"],
      keyMetric: "Bio link clicks per week",
      timeToImpact: "4-8 weken",
      priority: 2,
    },
    {
      name: "Subscriber Value Loop",
      description: "Betaalde profielhouders adopteren features, kopen via Maxizoo affiliate links, genereren extra revenue die herinvesteerd wordt in acquisitie.",
      steps: ["Nieuwe subscriber (€4.95/maand)", "Onboarding emails triggeren feature adoption", "Voedingsplan + gewichttracker gebruik", "Productaanbevelingen leiden tot Maxizoo aankopen", "Affiliate commissie = extra revenue per user", "Hogere LTV = meer acquisitie-budget"],
      keyMetric: "Feature adoption rate + Maxizoo conversion",
      timeToImpact: "4-12 weken",
      priority: 3,
    },
  ];

  let loopOrder = 1;
  for (const loop of floekieLoops) {
    await prisma.growthLoop.create({
      data: {
        clientId: floekie.id,
        ...loop,
        steps: loop.steps as any,
        sortOrder: loopOrder++,
      },
    });
  }

  console.log(`Growth loops created: ${floekieLoops.length}`);

  // ============================================================
  // BENCHMARKS
  // ============================================================

  for (const bm of benchmarkData) {
    await prisma.benchmark.create({ data: bm });
  }

  console.log(`\nBenchmarks seeded: ${benchmarkData.length} rows`);

  // ============================================================
  // AUTO-MAP TARGETS
  // ============================================================

  const allExperiments = await prisma.experiment.findMany({
    where: {
      OR: [
        { contentType: { not: null } },
        { offerType: { not: null } },
      ],
    },
    include: { client: { select: { industry: true } } },
  });

  let targetCount = 0;

  for (const exp of allExperiments) {
    const industry = exp.client.industry;
    if (!industry) continue;

    const targetPairs = new Map<string, { channel: string; offerType: string | null; metricName: string }>();

    if (exp.offerType) {
      for (const ch of exp.channels) {
        const cms = getChannelMetricsForExperiment(exp.offerType, ch);
        for (const cm of cms) {
          for (const m of cm.metrics) {
            targetPairs.set(`${cm.channel}:${m}`, { channel: cm.channel, offerType: cm.offerType, metricName: m });
          }
        }
      }
      if (!exp.channels.includes("landing-page")) {
        const lpCms = getChannelMetricsForExperiment(exp.offerType, "landing-page");
        for (const cm of lpCms) {
          for (const m of cm.metrics) {
            targetPairs.set(`${cm.channel}:${m}`, { channel: cm.channel, offerType: cm.offerType, metricName: m });
          }
        }
      }
    }

    if (targetPairs.size === 0 && exp.contentType) {
      const cms = getChannelMetricsForContentType(exp.contentType);
      for (const cm of cms) {
        for (const m of cm.metrics) {
          targetPairs.set(`${cm.channel}:${m}`, { channel: cm.channel, offerType: cm.offerType, metricName: m });
        }
      }
    }

    for (const tp of targetPairs.values()) {
      const benchmark = await prisma.benchmark.findFirst({
        where: {
          industry,
          channel: tp.channel,
          offerType: tp.offerType,
          metricName: tp.metricName,
          region: "eu",
        },
      });

      if (!benchmark) continue;

      await prisma.experimentTarget.upsert({
        where: {
          experimentId_channel_metricName: {
            experimentId: exp.id,
            channel: tp.channel,
            metricName: tp.metricName,
          },
        },
        create: {
          experimentId: exp.id,
          benchmarkId: benchmark.id,
          channel: tp.channel,
          metricName: tp.metricName,
          unit: benchmark.unit,
          pessimistic: benchmark.pessimistic,
          realistic: benchmark.realistic,
          optimistic: benchmark.optimistic,
          direction: benchmark.direction,
        },
        update: {},
      });

      targetCount++;
    }
  }

  console.log(`Experiment targets auto-mapped: ${targetCount} targets`);
  console.log("\nSeed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
