/**
 * Growth Playbook — Floekie (floekie.dog)
 * Gegenereerd: 2026-02-19
 * Fase: MVP Validatie
 * Budget: €500-2000/maand ads + development tijd
 * Doelmarkt: België + Nederland (Nederlandstalig)
 *
 * Verdienmodel:
 * - Ras-quiz: GRATIS (geen login nodig) — funnel entry
 * - Hondenprofiel: €4.95/maand (registratie + login vereist)
 *   → Dashboard, voedingsplan (RER/MER), gewichttracker,
 *     productaanbevelingen (Maxizoo affiliate), tips per levensfase,
 *     dierenarts zoeker (Vlaanderen), rasprofielen
 * - Affiliate: Maxizoo commissie op productaanbevelingen
 *
 * Funnel:
 * L1 (Acquisition): Gratis quiz traffic genereren → quiz completions
 * L2 (Activatie): Quiz-completers converteren naar betaald profiel (€4.95/maand)
 * L3 (Revenue): Subscribers behouden + Maxizoo affiliate revenue maximaliseren
 *
 * ICP Segmenten:
 * 1. Toekomstige hondeneigenaren — quiz als instap, profiel na rasmatch
 * 2. Puppy-eigenaars — voedingsplan + gewichttracker als key value
 * 3. Volwassen/senior hond eigenaars — producten + levensfase-tips als value
 */

// ============================================================
// EXPERIMENTEN
// ============================================================

export const floekieExperiments = [
  // ──────────────────────────────────────────────────────────
  // L1 — ACQUISITION (Cold → gratis quiz traffic)
  // ──────────────────────────────────────────────────────────
  {
    experimentCode: "GH1",
    name: "Ras-Quiz Viral Campagne",
    description:
      "Meta Ads campagne met de gratis ras-quiz als hook. 'Welk hondenras past bij jou? Doe de gratis quiz!' Doel: maximaal quiz traffic genereren als top-of-funnel. Na quiz → value preview van betaald profiel (voedingsplan, gewicht, producten) → conversie naar €4.95/maand.",
    hypothesis:
      "Een interactieve ras-quiz ad op Meta genereert quiz completions voor <€3 CPE, waarvan 8-15% converteert naar een betaald profiel (€4.95/maand), resulterend in een CAC van €20-35 per subscriber.",
    tier: "L1",
    funnelLayer: 1,
    offerType: "quiz",
    audienceType: "cold",
    channels: ["meta-ads"],
    targetSegment: "Toekomstige hondeneigenaren",
    aarrStage: "acquisition",
    status: "draft",
    timeline: "Week 1-4",
    sprint: 1,
    cost: "€500/maand",
    expectedEffect: "600+ quiz starts, 400+ completions, 40-60 profielconversies/maand (€200-300 MRR)",
    successMetric: "Quiz completion rate >60%, CPE <€3, quiz-to-profile >10%, CAC <€30",
    guardrailMetric: "Bounce rate <50%, frequency <3 per 2 weken, quiz abandonment <40%",
    implementationSteps: [
      "Landing page optimaliseren: 'Doe de gratis quiz' als primaire CTA",
      "3 ad varianten (AIDA): pijn-variant ('Twijfel je?'), resultaat-variant ('Ontdek je match'), vraag-variant ('Welk ras past bij jou?')",
      "Audience: 18-45 jaar, BE+NL, interesses: honden, puppy, hondenrassen, dierenliefhebber",
      "Pixel events: quiz_start, quiz_complete, profile_page_view, signup_start, payment_complete",
      "Na quiz resultaten: blurred voedingsplan + productaanbevelingen als teaser voor profiel",
      "A/B test: video ad (Imen met Floekie) vs static image (ras-collage)",
      "Na 2 weken: evalueer CPE en profile conversie, schaal winnende variant op",
    ],
    projectionInputs: {
      monthlyBudget: 500,
    },
    audienceSpecs: {
      "meta-ads": {
        targeting:
          "18-45 jaar, België + Nederland, interesses: honden, puppy, hondenrassen, dierenliefhebber, hondentraining",
        estimatedSize: "800.000-1.200.000",
        budget: "€500/maand",
        placement: "Instagram Feed, Instagram Reels, Facebook Feed",
        exclusions:
          "Bestaande profielhouders (custom audience), dierenartsen, hondenfokkers, dierenwinkels",
      },
    },
    designBriefing: {
      "meta-ads": [
        {
          format: "meta-ad-single-image",
          specs: "1080x1080 (1:1) of 1080x1350 (4:5)",
          description:
            "Aantrekkelijke visual met schattige hond + quiz-vraag als overlay tekst. Warm kleurenpalet (amber/oranje). Badge: 'GRATIS QUIZ'. Imen branding.",
        },
        {
          format: "meta-ad-video-reel",
          specs: "1080x1920 (9:16), 15-30 sec",
          description:
            "Imen met Floekie, swipe-through van rasopties, eindigend met quiz CTA. Ondertiteld. Hook in eerste 3 sec.",
        },
        {
          format: "meta-ad-carousel",
          specs: "1080x1080 per kaart, 4-6 kaarten",
          description:
            "Kaart 1: hook-vraag. Kaart 2-5: hondenrassen met 'past bij jou als...' tekst. Kaart 6: CTA 'Doe de gratis quiz'.",
        },
      ],
    },
    riseInputs: {
      peopleReached: 4,
      channelReach: 3,
      isNewChannel: true,
      changeSize: 3,
      isAboveFold: true,
      isNoticeable5s: true,
      changeType: 2,
      hasUserFeedback: false,
      hasCompetitorData: true,
      hasAnalyticsData: false,
      hasBestPractices: true,
      timeToSetup: 3,
      dependencyLevel: 0,
    },
  },

  {
    experimentCode: "GH2",
    name: "Puppy Starter Gids — Lead Magnet",
    description:
      "Downloadbare lead magnet 'De Complete Puppy Gids — 15 dingen die je moet regelen' via Meta Ads. Email capture bij download → nurture sequence → quiz CTA → profiel conversie. Gericht op puppy-eigenaars die de hoogste bereidheid hebben om te betalen voor voedingsplan + gewichttracker.",
    hypothesis:
      "Een puppy gids als lead magnet genereert email subscribers voor <€3 CPL. 25%+ doet daarna de quiz en 15%+ van quiz-doers converteert naar een betaald profiel, omdat puppy-eigenaars de meeste waarde halen uit voedingsplan + gewichttracker.",
    tier: "L1",
    funnelLayer: 1,
    offerType: "lead-magnet",
    audienceType: "cold",
    channels: ["meta-ads"],
    targetSegment: "Puppy-eigenaars + toekomstige eigenaars",
    aarrStage: "acquisition",
    status: "draft",
    timeline: "Week 3-6",
    sprint: 1,
    cost: "€300/maand",
    expectedEffect:
      "100+ downloads/maand, 25+ quiz completions, 4-8 profielconversies/maand",
    successMetric:
      "CPL <€3, download-to-quiz >25%, quiz-to-profile >15%, email open rate >40%",
    guardrailMetric: "Unsubscribe <1%, bounce rate op landing <40%",
    implementationSteps: [
      "Puppy gids PDF ontwerpen (15 items, visueel, Imen branding, met app-verwijzingen)",
      "Landing page: headline + 3 bullets + email form + instant download",
      "In de gids: 3x verwijzing naar Floekie app ('Bereken het exacte voedingsplan in de app')",
      "3 Meta ad varianten (pijn/resultaat/vraag)",
      "Audience: 22-40 jaar, interesse puppy + hondentraining + huisdieren",
      "Email automation: (1) instant download, (2) dag 2: quiz CTA, (3) dag 5: profiel-waarde email",
      "Track: download → quiz_start → quiz_complete → profile_purchase",
    ],
    projectionInputs: {
      monthlyBudget: 300,
    },
    audienceSpecs: {
      "meta-ads": {
        targeting:
          "22-40 jaar, België + Nederland, interesses: puppy, hondentraining, huisdieren, dierenwinkel",
        estimatedSize: "500.000-800.000",
        budget: "€300/maand",
        placement: "Instagram Feed, Facebook Feed, Instagram Stories",
        exclusions: "Bestaande email subscribers, profielhouders",
      },
    },
    designBriefing: {
      "meta-ads": [
        {
          format: "meta-ad-single-image",
          specs: "1080x1080 (1:1)",
          description:
            "Schattige puppy foto + checklist preview (3-4 items zichtbaar). Badge: 'GRATIS DOWNLOAD'. Amber/warm kleuren.",
        },
        {
          format: "meta-ad-video-reel",
          specs: "1080x1920 (9:16), 15 sec",
          description:
            "Quick scroll door de gids items, eindigend met download CTA. Muziek: warm, vrolijk.",
        },
      ],
    },
    riseInputs: {
      peopleReached: 3,
      channelReach: 3,
      isNewChannel: false,
      changeSize: 2,
      isAboveFold: true,
      isNoticeable5s: true,
      changeType: 2,
      hasUserFeedback: false,
      hasCompetitorData: true,
      hasAnalyticsData: false,
      hasBestPractices: true,
      timeToSetup: 3,
      dependencyLevel: 0,
    },
  },

  {
    experimentCode: "GH3",
    name: "Hondenvoeding Zoekcampagne",
    description:
      "Google Ads op hoge-intent keywords: 'hoeveel voer hond', 'voedingsschema puppy', 'hondenvoer berekenen'. Landing page toont een preview van het voedingsplan (generieke voorbeeld) + CTA: 'Bereken het exacte plan voor jouw hond — maak een profiel'. Vangt zoekintentie op van mensen met een direct probleem.",
    hypothesis:
      "Hoge-intent zoekverkeer op voedingswoorden converteert >3% naar profiel (€4.95/maand), omdat deze zoekers een urgent probleem hebben en Floekie de enige Nederlandstalige tool is die een wetenschappelijk voedingsplan biedt.",
    tier: "L1",
    funnelLayer: 1,
    offerType: "tool",
    audienceType: "cold",
    channels: ["google-ads"],
    targetSegment: "Alle hondeneigenaren (hoge intent voeding)",
    aarrStage: "acquisition",
    status: "draft",
    timeline: "Week 2-5",
    sprint: 1,
    cost: "€200/maand",
    expectedEffect:
      "250+ clicks/maand, 8-15 directe profielconversies/maand (€40-75 MRR)",
    successMetric: "CPC <€0.80, CTR >4%, click-to-profile >3%, landing page engagement >60%",
    guardrailMetric: "Bounce rate <55%, quality score >6",
    implementationSteps: [
      "Keyword research: voedingsplan hond, hondenvoer berekenen, hoeveel voer puppy, dagportie hond",
      "Landing page bouwen: voedingsplan preview (voorbeeld Labrador) + feature uitleg + profiel CTA",
      "RSA ads schrijven: 15 headlines + 4 descriptions, focus op 'bereken gratis'",
      "Negative keywords: hondenvoer kopen, bestellen, winkel, merknamen, recepten",
      "Track: landing_page_view → quiz_or_signup_start → payment_complete",
      "Na 2 weken: keyword performance review, pause laag-performers",
    ],
    projectionInputs: {
      monthlyBudget: 200,
    },
    audienceSpecs: {
      "google-ads": {
        targeting: "België + Nederland, Nederlandse taal, alle leeftijden",
        estimatedSize: "5.000-15.000 maandelijkse zoekopdrachten (cluster)",
        budget: "€200/maand",
        matchTypes:
          "Phrase match + Exact match voor core keywords, Broad match voor long-tail",
        exclusions:
          "Negatieve keywords: kopen, bestellen, winkel, merknamen, recepten, zelf maken",
      },
    },
    designBriefing: {
      "google-ads": [
        {
          format: "google-search-responsive",
          specs: "15 headlines (max 30 chars), 4 descriptions (max 90 chars)",
          description:
            "Focus op directe waarde: 'Voedingsplan voor jouw hond', 'Bereken de juiste portie', 'Op basis van ras + gewicht'. Display paths: /voedingsplan /hond",
        },
      ],
    },
    riseInputs: {
      peopleReached: 2,
      channelReach: 2,
      isNewChannel: true,
      changeSize: 2,
      isAboveFold: true,
      isNoticeable5s: true,
      changeType: 2,
      hasUserFeedback: false,
      hasCompetitorData: false,
      hasAnalyticsData: false,
      hasBestPractices: true,
      timeToSetup: 3,
      dependencyLevel: 0,
    },
  },

  {
    experimentCode: "GH4",
    name: "Imen's Hondentips — Organic Social",
    description:
      "Instagram Reels + TikTok content strategie: 3-4 posts per week. Content pillars: (1) Floekie Moments — dagelijks leven met Floekie, (2) Ras Weetjes — 'Wist je dat...' over hondenrassen, (3) Voedingstips — praktische voer-adviezen, (4) 'Mijn Hond Deed Dit' — herkenbare momenten. Bio link → quiz. Elke post = soft CTA naar gratis quiz.",
    hypothesis:
      "Consistente organic content (3-4x/week) bouwt 1.000+ volgers in 3 maanden, waarvan 5%+ de quiz doet en 10%+ van quiz-doers een profiel koopt, omdat hondencontent hoge engagement genereert en Imen's authentieke verhaal vertrouwen wekt.",
    tier: "L1",
    funnelLayer: 1,
    offerType: "content",
    audienceType: "cold",
    channels: ["organic-social"],
    targetSegment: "Alle hondenliefhebbers",
    aarrStage: "acquisition",
    status: "draft",
    timeline: "Doorlopend",
    sprint: 1,
    cost: "€0 (alleen tijd: ~4 uur/week)",
    expectedEffect:
      "1.000+ volgers in 3 maanden, 50+ quiz completions/maand, 5-8 profielconversies/maand",
    successMetric:
      "Engagement rate >5%, volgers groei >80/week, bio link clicks >25/week, quiz starts vanuit social >15/week",
    guardrailMetric: "Posting frequentie min 3x/week, unfollow rate <5%",
    implementationSteps: [
      "Instagram business account aanmaken (bijv. @floekie.dog of @imensehondentips)",
      "TikTok account met zelfde branding",
      "Content kalender: 4 pillars, 3-4 posts/week, quiz-verwijzing in elke 3e post",
      "Bio: 'Gratis ras-quiz 👇' + link naar floekie.dog",
      "Hashtag strategie: #hondentips #puppyleven #hondenliefde + niche tags",
      "Community engagement: 15 min/dag reageren + hondenaccounts volgen",
      "Na 4 weken: top-performing content analyseren, winnende formats opschalen",
    ],
    projectionInputs: {
      monthlyImpressions: 50000,
    },
    audienceSpecs: {
      "organic-social": {
        targeting:
          "Organisch bereik via hashtags, Reels algorithm, community engagement",
        estimatedSize: "Onbeperkt (algorithm-driven)",
        budget: "€0 (tijd-investering ~4 uur/week)",
        platforms: "Instagram Reels + TikTok",
      },
    },
    designBriefing: {
      "organic-social": [
        {
          format: "instagram-reel",
          specs: "1080x1920 (9:16), 15-60 sec",
          description:
            "Korte, snappy video's met Imen en/of Floekie. Trending audio. Tekst overlays voor tips. Warm, persoonlijk, niet overgeproduceerd.",
        },
        {
          format: "instagram-carousel",
          specs: "1080x1080, 5-10 slides",
          description:
            "Educatieve carousels: '5 dingen die je niet wist over [ras]', '3 fouten met puppy voeding'. Imen branding kleuren. Laatste slide = quiz CTA.",
        },
      ],
    },
    riseInputs: {
      peopleReached: 3,
      channelReach: 4,
      isNewChannel: true,
      changeSize: 2,
      isAboveFold: true,
      isNoticeable5s: true,
      changeType: 2,
      hasUserFeedback: false,
      hasCompetitorData: true,
      hasAnalyticsData: false,
      hasBestPractices: true,
      timeToSetup: 2,
      dependencyLevel: 0,
    },
  },

  // ──────────────────────────────────────────────────────────
  // L2 — ACTIVATIE (Warm → quiz completers converteren naar profiel)
  // ──────────────────────────────────────────────────────────
  {
    experimentCode: "GH5",
    name: "Retargeting Quiz Completers → Profiel",
    description:
      "Meta retargeting ads voor mensen die de quiz hebben afgemaakt maar geen profiel hebben gekocht. Toon de waarde die ze missen: 'Je rasmatch is [ras] — ontdek het voedingsplan, gewichttracker en persoonlijke producttips.' Focus op de specifieke features die het profiel biedt.",
    hypothesis:
      "Retargeting van quiz-completers met feature-specifieke ads converteert 5-10% naar een betaald profiel (€4.95/maand), tegen een CPA <€15, omdat ze al interesse hebben getoond door de quiz af te maken.",
    tier: "L2",
    funnelLayer: 2,
    offerType: "retargeting",
    audienceType: "warm",
    channels: ["meta-ads"],
    targetSegment: "Quiz completers zonder profiel",
    aarrStage: "activation",
    status: "draft",
    timeline: "Week 5-8",
    sprint: 2,
    cost: "€150/maand",
    expectedEffect:
      "10-20 profielconversies/maand vanuit retargeting (€50-100 MRR)",
    successMetric:
      "Retargeting CTR >3%, quiz-completer-to-profile >8%, CPA <€15",
    guardrailMetric:
      "Frequency <4 per 2 weken, geen negatieve feedback/hides",
    implementationSteps: [
      "Custom audience: quiz_complete event MINUS payment_complete event (Pixel)",
      "3 ad varianten: (A) voedingsplan-angle, (B) productaanbevelingen-angle, (C) Imen persoonlijk",
      "Dynamic: als mogelijk, rasnaam in ad copy ('Je match was een Golden Retriever!')",
      "Frequency cap: max 1x/dag, max 4x/2 weken",
      "Exclusie: bestaande profielhouders",
      "Na 2 weken: winnende angle opschalen, verliezers pauzeren",
    ],
    projectionInputs: {
      monthlyBudget: 150,
    },
    audienceSpecs: {
      "meta-ads": {
        targeting:
          "Custom audience: quiz_complete (30 dagen) MINUS payment_complete. Minimum: 100+ personen.",
        estimatedSize:
          "Afhankelijk van L1 traffic (verwacht: 300-600 quiz completers/maand na maand 1)",
        budget: "€150/maand",
        placement: "Instagram Feed, Facebook Feed, Instagram Stories",
        exclusions: "Bestaande profielhouders, mensen die quiz niet afmaakten",
      },
    },
    designBriefing: {
      "meta-ads": [
        {
          format: "meta-ad-single-image",
          specs: "1080x1080 (1:1)",
          description:
            "Feature showcase: voedingsplan of producten preview. 'Je rasmatch wacht op je!' Warm, persoonlijk. Imen als afzender.",
        },
        {
          format: "meta-ad-carousel",
          specs: "1080x1080 per kaart, 3 kaarten",
          description:
            "Kaart 1: Voedingsplan preview. Kaart 2: Productaanbevelingen preview. Kaart 3: 'Alles voor €4.95/maand' CTA.",
        },
      ],
    },
    riseInputs: {
      peopleReached: 2,
      channelReach: 3,
      isNewChannel: false,
      changeSize: 2,
      isAboveFold: true,
      isNoticeable5s: true,
      changeType: 1,
      hasUserFeedback: false,
      hasCompetitorData: false,
      hasAnalyticsData: true,
      hasBestPractices: true,
      timeToSetup: 2,
      dependencyLevel: 1,
    },
  },

  {
    experimentCode: "GH6",
    name: "Quiz-to-Profile Nurture Email Sequence",
    description:
      "5-email nurture sequence voor quiz-completers die hun email hebben achtergelaten maar geen profiel kochten. Elke email benadrukt een andere profiel-feature: (1) Welkom + quiz recap, (2) Voedingsplan uitleg, (3) Gewichttracker + Imen's verhaal, (4) Productaanbevelingen preview, (5) Laatste kans + social proof. Doel: conversie naar €4.95/maand.",
    hypothesis:
      "Een 5-email nurture sequence converteert 10-20% van email-subscribers naar een betaald profiel, omdat elke email een andere waarde-angle benadrukt en het druppelsgewijs vertrouwen opbouwt.",
    tier: "L2",
    funnelLayer: 2,
    offerType: "email-sequence",
    audienceType: "warm",
    channels: ["email-warm"],
    targetSegment: "Quiz completers met email, zonder profiel",
    aarrStage: "activation",
    status: "draft",
    timeline: "Week 3-6",
    sprint: 1,
    cost: "€30/maand (Mailchimp/Brevo free tier)",
    expectedEffect:
      "10-20% email-to-profile conversie, 15-30 profielconversies/maand bij 150+ subscribers",
    successMetric:
      "Open rate >45%, CTR >8%, email-to-profile >12%",
    guardrailMetric: "Unsubscribe <2%, spam complaints <0.1%",
    implementationSteps: [
      "Email tool configureren (Mailchimp of Brevo free tier)",
      "Email capture toevoegen na quiz resultaten ('Wil je je resultaten bewaren?')",
      "5 emails schrijven met elk een andere feature-angle (zie content file)",
      "Automation flow: trigger = quiz_complete + email_captured + NOT payment_complete",
      "Cadans: dag 0, dag 2, dag 5, dag 8, dag 12",
      "Track: open, click, profile_page_view, payment_complete per email",
      "A/B test email 1 subject line na 100 subscribers",
    ],
    projectionInputs: {
      monthlyVisitors: 200,
    },
    audienceSpecs: {
      "email-warm": {
        targeting:
          "Quiz completers die email hebben achtergelaten maar geen profiel hebben gekocht",
        estimatedSize:
          "100-300/maand (afhankelijk van quiz traffic en email capture rate)",
        segmentatie:
          "Optioneel: segment op quiz-resultaat ras voor gepersonaliseerde subject lines",
      },
    },
    designBriefing: {
      "email-warm": [
        {
          format: "email-html",
          specs: "600px breed, mobile-responsive, max 2 afbeeldingen per email",
          description:
            "Warme, persoonlijke emails van 'Imen van Floekie'. Amber/oranje accenten. Eén CTA-button per email ('Maak je profiel aan'). Preview van locked features als teaser.",
        },
      ],
    },
    riseInputs: {
      peopleReached: 2,
      channelReach: 4,
      isNewChannel: true,
      changeSize: 2,
      isAboveFold: true,
      isNoticeable5s: true,
      changeType: 2,
      hasUserFeedback: false,
      hasCompetitorData: false,
      hasAnalyticsData: false,
      hasBestPractices: true,
      timeToSetup: 3,
      dependencyLevel: 1,
    },
  },

  // ──────────────────────────────────────────────────────────
  // L3 — REVENUE (Hot → MRR maximaliseren + retentie)
  // ──────────────────────────────────────────────────────────
  {
    experimentCode: "GH7",
    name: "In-App Profile Upgrade Optimalisatie",
    description:
      "Optimaliseer de quiz-to-profile conversie pagina in de app. Na quiz resultaten: toon blurred previews van voedingsplan + productaanbevelingen + gewichttracker. Test verschillende CTA-teksten, value propositions en pricing presentaties. Dit is de kern van het verdienmodel — elke % verbetering hier heeft directe MRR impact.",
    hypothesis:
      "Door de profielwaarde visueel te tonen (blurred previews) direct na de quiz, stijgt de quiz-to-profile conversie van baseline naar >12%, wat bij 400+ quiz completions/maand resulteert in €200+ MRR.",
    tier: "L3",
    funnelLayer: 3,
    offerType: "subscription",
    audienceType: "hot",
    channels: [],
    targetSegment: "Quiz completers op het conversie-moment",
    aarrStage: "revenue",
    status: "draft",
    timeline: "Doorlopend",
    sprint: 2,
    cost: "€0 (development time only)",
    expectedEffect:
      "Quiz-to-profile conversie optimaliseren van 8% → 15%+, directe MRR impact",
    successMetric:
      "Quiz-to-profile >12%, average revenue per quiz completer >€0.50, trial-to-paid >80%",
    guardrailMetric:
      "Quiz completion rate daalt niet, NPS >30, churn <15%/maand",
    implementationSteps: [
      "Registratie flow: email + wachtwoord (of Apple/Google login)",
      "Stripe integratie: €4.95/maand recurring, 7-dagen gratis trial optioneel",
      "Profile upgrade pagina: 4 feature cards (voedingsplan, gewicht, producten, tips)",
      "Blurred preview: toon een voedingsplan voor het quiz-resultaat ras (locked)",
      "A/B test 1: 'Maak een profiel' vs '7 dagen gratis proberen'",
      "A/B test 2: Prijs boven fold vs onder fold",
      "Track volledige funnel: quiz_complete → profile_view → signup_start → payment → active_day_7",
    ],
    projectionInputs: {},
    audienceSpecs: {},
    designBriefing: {
      "in-app": [
        {
          format: "profile-upgrade-page",
          specs: "Full-page, mobile-first, scrollable",
          description:
            "Na quiz resultaten: feature showcase. Blurred voedingsplan + producten als teaser. Imen's quote: 'Ik gebruik dit ook voor Floekie'. CTA: 'Maak een profiel — €4.95/maand'. Warm design, geen druk.",
        },
        {
          format: "value-locked-preview",
          specs: "Card component met blur overlay",
          description:
            "Blurred content card: voedingsplan voor [quiz ras] achter overlay. 'Ontgrendel met een profiel' CTA. Toont genoeg om waarde te communiceren, niet genoeg om nuttig te zijn.",
        },
      ],
    },
    riseInputs: {
      peopleReached: 3,
      channelReach: 5,
      isNewChannel: false,
      changeSize: 3,
      isAboveFold: true,
      isNoticeable5s: true,
      changeType: 2,
      hasUserFeedback: false,
      hasCompetitorData: true,
      hasAnalyticsData: false,
      hasBestPractices: true,
      timeToSetup: 4,
      dependencyLevel: 1,
    },
  },

  {
    experimentCode: "GH8",
    name: "Subscriber Retentie — Feature Adoption Emails",
    description:
      "Onboarding email sequence voor betalende profielhouders. 5 emails over 21 dagen die elke feature uitlichten: (1) Welkom + dashboard tour, (2) Voedingsplan instellen, (3) Gewicht bijhouden, (4) Productaanbevelingen ontdekken (Maxizoo), (5) Tips personaliseren. Doel: feature adoption verhogen → retentie verhogen → churn verlagen.",
    hypothesis:
      "Een feature adoption email sequence verlaagt 30-day churn van 15% naar <10% en verhoogt gemiddelde feature usage van 2 naar 4+ features, waardoor LTV stijgt van €20 naar €30+.",
    tier: "L3",
    funnelLayer: 3,
    offerType: "email-sequence",
    audienceType: "hot",
    channels: ["email-warm"],
    targetSegment: "Betalende profielhouders (eerste 30 dagen)",
    aarrStage: "retention",
    status: "draft",
    timeline: "Week 9-12",
    sprint: 3,
    cost: "€0 (zelfde email tool als GH6)",
    expectedEffect:
      "Feature adoption +50%, 30-day churn <10%, LTV >€30",
    successMetric:
      "Open rate >50%, feature adoption rate >60% (3+ features), 30-day retention >85%",
    guardrailMetric: "Unsubscribe <1%, support tickets niet stijgend",
    implementationSteps: [
      "5 onboarding emails schrijven (zie content file)",
      "Automation trigger: payment_complete",
      "Cadans: dag 0 (welkom), dag 2 (voedingsplan), dag 5 (gewicht), dag 10 (producten), dag 18 (tips)",
      "Personalisatie: hondnaam + ras in subject lines en body",
      "Track: email_open → feature_used per email (welke email triggert welke feature?)",
      "Na 4 weken: analyseer welke feature de sterkste retentie-driver is",
    ],
    projectionInputs: {
      monthlyVisitors: 50,
    },
    audienceSpecs: {
      "email-warm": {
        targeting: "Betalende profielhouders, eerste 21 dagen na aanmelding",
        estimatedSize: "30-60/maand (afhankelijk van profiel conversies)",
        segmentatie:
          "Per ras-grootte (klein/middel/groot) voor relevant voedingsadvies",
      },
    },
    designBriefing: {
      "email-warm": [
        {
          format: "email-html",
          specs: "600px breed, mobile-responsive",
          description:
            "Warme, persoonlijke emails. Elke email = 1 feature uitgelegd met screenshot/visual. CTA: deep link naar die feature in de app. Imen als afzender.",
        },
      ],
    },
    riseInputs: {
      peopleReached: 1,
      channelReach: 4,
      isNewChannel: false,
      changeSize: 2,
      isAboveFold: true,
      isNoticeable5s: true,
      changeType: 2,
      hasUserFeedback: false,
      hasCompetitorData: false,
      hasAnalyticsData: false,
      hasBestPractices: true,
      timeToSetup: 3,
      dependencyLevel: 2,
    },
  },
];

// ============================================================
// SPRINTS (16 weken roadmap)
// ============================================================

export const floekieSprints = [
  {
    number: 1,
    name: "Bouw & Launch",
    weeks: "Week 1-4",
    focus:
      "Registratie/login + betaling bouwen, eerste L1 campagnes live, organic starten",
    activities: [
      "Registratie/login flow bouwen (Supabase Auth)",
      "Stripe integratie: €4.95/maand recurring",
      "Profile upgrade pagina ontwerpen (blurred previews)",
      "GH1 (Quiz Meta Ads) live zetten — hoofdcampagne",
      "GH4 (Instagram/TikTok) starten — eerste 12 posts",
      "Email capture toevoegen na quiz resultaten",
      "Pixel events configureren voor volledige funnel tracking",
      "GH3 (Google Ads voeding) opzetten en lanceren",
    ],
    successCriteria: [
      "Betaalflow live en werkend (min 5 test-transacties)",
      "GH1 live met min 200 quiz starts",
      "Instagram: min 12 posts gepubliceerd",
      "Pixel tracking geverifieerd op alle funnel stappen",
    ],
  },
  {
    number: 2,
    name: "Optimaliseer & Converteer",
    weeks: "Week 5-8",
    focus:
      "L1 ads optimaliseren, L2 activatie starten, eerste profiel conversies",
    activities: [
      "GH1: winnende ad variant opschalen, verliezers pauzeren",
      "GH2 (Puppy Gids) live zetten op Meta",
      "GH5 (Retargeting quiz completers) starten zodra audience >100",
      "GH6 (Nurture email sequence) activeren",
      "GH7 (Profile upgrade pagina) eerste A/B test starten",
      "GH4: content kalender bijstellen op basis van engagement data",
      "Eerste gebruikers-interviews (5-10 gesprekken met profielhouders)",
    ],
    successCriteria: [
      "Min 400 quiz completions totaal",
      "Min 30 betaalde profielen (€150 MRR)",
      "Email list: 100+ subscribers",
      "Quiz-to-profile conversie baseline vastgesteld",
      "Instagram: 200+ volgers",
    ],
  },
  {
    number: 3,
    name: "Schaal & Retentie",
    weeks: "Week 9-12",
    focus:
      "Winnende kanalen opschalen, retentie optimaliseren, affiliate revenue starten",
    activities: [
      "Budget verschuiven naar best-performing L1 kanaal",
      "GH8 (Subscriber retentie emails) activeren",
      "Maxizoo affiliate tracking implementeren",
      "Instagram: collab met 2-3 micro-influencers (hondenniche)",
      "Share-knop bij quiz resultaten ('Deel je rasmatch!')",
      "Churn analyse: waarom cancelen mensen? Feature requests verzamelen",
      "GH7: A/B test 2 — pricing presentatie of gratis trial",
    ],
    successCriteria: [
      "€300+ MRR (60+ actieve profielen)",
      "30-day retention >85%",
      "Churn <15%/maand",
      "Quiz-to-profile >10%",
      "Eerste Maxizoo affiliate clicks",
    ],
  },
  {
    number: 4,
    name: "Validatie & Schaal-Beslissing",
    weeks: "Week 13-16",
    focus: "Volledige funnel data analyseren, unit economics, go/no-go beslissing",
    activities: [
      "Volledige funnel analyse: ad → quiz → email → profile → retain → affiliate",
      "Unit economics: CAC, LTV, payback period, blended CPA",
      "Gebruikers-survey (NPS, feature satisfaction)",
      "Kill/scale beslissing per experiment op basis van 12 weken data",
      "Revenue projectie: wanneer breakeven? Schaalpad naar €1000+ MRR?",
      "Roadmap voor Q2 op basis van validatie",
    ],
    successCriteria: [
      "€500+ MRR (100+ actieve profielen)",
      "Blended CAC <€25",
      "LTV >€20 (gemiddeld >4 maanden retentie)",
      "Duidelijke go/no-go met data onderbouwing",
      "Product-market fit indicatie (NPS >30, retentie >70%)",
    ],
  },
];

// ============================================================
// BUDGET VERDELING
// ============================================================

export const floekieBudget = {
  totaalPerMaand: "€1.150 (mid-range van €500-2000 budget)",
  verdeling: [
    {
      experiment: "GH1 — Ras-Quiz Meta Ads",
      budget: 500,
      percentage: "43%",
      note: "Primaire traffic driver — meeste budget",
    },
    {
      experiment: "GH2 — Puppy Gids Meta Ads",
      budget: 300,
      percentage: "26%",
      note: "Lead magnet voor highest-LTV segment",
    },
    {
      experiment: "GH3 — Voeding Google Ads",
      budget: 200,
      percentage: "17%",
      note: "Hoge intent traffic",
    },
    {
      experiment: "GH5 — Retargeting Meta Ads",
      budget: 150,
      percentage: "13%",
      note: "Start week 5 na voldoende audience",
    },
  ],
  gratis: [
    "GH4 — Organic Social (alleen tijd: ~4 uur/week)",
    "GH6 — Nurture Email Sequence (free tier email tool)",
    "GH7 — In-App Profile Upgrade (development time)",
    "GH8 — Subscriber Retentie Emails (zelfde email tool)",
  ],
  verwachteRevenue: {
    maand1: "€100-200 MRR (20-40 profielen × €4.95)",
    maand2: "€250-400 MRR (50-80 profielen, minus churn)",
    maand3: "€400-600 MRR (80-120 profielen, minus churn)",
    maand4: "€500-800 MRR (100-160 profielen, stabilisering)",
    breakeven:
      "Verwacht maand 3-4 bij €1.150/maand adspend als quiz-to-profile >10% en churn <15%",
  },
  notities: [
    "Start met GH1 + GH4 in week 1, voeg overige toe in week 2-4",
    "Budget flexibel: verschuif naar best-performing kanaal na 2 weken data",
    "Bij budget <€600: focus op GH1 (quiz ads) + GH4 (organic) + GH6 (email)",
    "Bij budget >€1500: verhoog GH1 + voeg Instagram influencer budget toe (€200-300)",
    "Revenue uit profielen compenseert adspend — doel is cash flow positief in maand 3-4",
  ],
};

// ============================================================
// UNIT ECONOMICS (Projectie)
// ============================================================

export const floekieUnitEconomics = {
  pricing: {
    monthlyPrice: 4.95,
    currency: "EUR",
    model: "subscription",
    billingCycle: "monthly",
  },
  projectedMetrics: {
    averageRetentionMonths: {
      pessimistic: 3,
      realistic: 5,
      optimistic: 8,
    },
    ltv: {
      pessimistic: 14.85, // 3 × €4.95
      realistic: 24.75, // 5 × €4.95
      optimistic: 39.6, // 8 × €4.95
    },
    quizToProfileRate: {
      pessimistic: 0.05,
      realistic: 0.1,
      optimistic: 0.15,
    },
    costPerQuizComplete: {
      pessimistic: 5.0,
      realistic: 3.0,
      optimistic: 1.5,
    },
    cac: {
      pessimistic: 100, // €5 CPE / 5% conversie
      realistic: 30, // €3 CPE / 10% conversie
      optimistic: 10, // €1.50 CPE / 15% conversie
    },
    ltvCacRatio: {
      pessimistic: 0.15, // €14.85 / €100
      realistic: 0.83, // €24.75 / €30
      optimistic: 3.96, // €39.60 / €10
    },
  },
  affiliateRevenue: {
    maxizoo: {
      estimatedCommission: "5-10% per aankoop",
      averageOrderValue: "€30-50",
      estimatedRevenuePerUser: "€1-3/maand",
      note: "Additionele revenue bovenop subscription — niet meegenomen in LTV berekening",
    },
  },
  breakeven: {
    monthlyAdspend: 1150,
    profilesNeededForBreakeven: 233, // €1150 / €4.95
    monthlyNewProfilesNeeded: 60, // bij 15% churn, groei naar 233 actief
    timeToBreakeven: "3-6 maanden (afhankelijk van conversie en churn)",
  },
};

// ============================================================
// CONSUMER APP BENCHMARKS (Estimated — Pet/Lifestyle BE+NL)
// ============================================================

export const consumerAppBenchmarks = {
  metaAds: {
    cpc: {
      pessimistic: 0.8,
      realistic: 0.45,
      optimistic: 0.25,
      unit: "EUR",
    },
    ctr: { pessimistic: 1.2, realistic: 2.5, optimistic: 4.0, unit: "%" },
    cpe: {
      pessimistic: 8,
      realistic: 3,
      optimistic: 1.5,
      unit: "EUR",
      note: "Cost per quiz completion",
    },
    cpm: { pessimistic: 12, realistic: 7, optimistic: 4, unit: "EUR" },
  },
  googleAds: {
    cpc: {
      pessimistic: 1.5,
      realistic: 0.6,
      optimistic: 0.3,
      unit: "EUR",
    },
    ctr: { pessimistic: 3.0, realistic: 5.5, optimistic: 8.0, unit: "%" },
  },
  email: {
    openRate: {
      pessimistic: 30,
      realistic: 45,
      optimistic: 60,
      unit: "%",
      note: "Pet niche = hoge engagement",
    },
    clickRate: { pessimistic: 3, realistic: 8, optimistic: 15, unit: "%" },
  },
  subscription: {
    quizToProfile: {
      pessimistic: 5,
      realistic: 10,
      optimistic: 15,
      unit: "%",
      note: "Quiz completer → betaald profiel",
    },
    monthlyChurn: {
      pessimistic: 20,
      realistic: 12,
      optimistic: 7,
      unit: "%",
      note: "Consumer subscription churn",
    },
    retentionDay30: {
      pessimistic: 70,
      realistic: 85,
      optimistic: 92,
      unit: "%",
    },
  },
  sources: [
    "Appsflyer 2025 — Lifestyle app benchmarks EMEA",
    "Adjust 2025 — Pet app retention benchmarks",
    "WordStream 2025 — Consumer Meta Ads benchmarks",
    "Mailchimp 2025 — Consumer email benchmarks (hobbies/pets)",
    "Recurly 2025 — Consumer subscription churn benchmarks",
    "Lenny Rachitsky 2025 — Subscription app conversion benchmarks",
  ],
};
