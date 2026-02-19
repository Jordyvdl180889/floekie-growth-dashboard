import type { RiseInputs, RiseScores } from "@/types";

export function calculateRise(inputs: RiseInputs): RiseScores {
  const reach = inputs.peopleReached + inputs.channelReach;

  const impactRaw =
    (inputs.isNewChannel ? 2 : 0) +
    inputs.changeSize +
    (inputs.isAboveFold ? 2 : 0) +
    (inputs.isNoticeable5s ? 1 : 0) +
    inputs.changeType;
  const impact = impactRaw * 2;

  const confidence =
    (inputs.hasUserFeedback ? 4 : 0) +
    (inputs.hasCompetitorData ? 2 : 0) +
    (inputs.hasAnalyticsData ? 2 : 0) +
    (inputs.hasBestPractices ? 2 : 0);

  const depMultipliers = [2, 1.5, 1];
  const ease = (6 - inputs.timeToSetup) * depMultipliers[inputs.dependencyLevel];

  const total = reach + impact + confidence + ease;

  return { reach, impact, confidence, ease, total };
}

export interface RiseExplanation {
  reach: { score: number; max: number; lines: string[] };
  impact: { score: number; max: number; lines: string[] };
  confidence: { score: number; max: number; lines: string[] };
  ease: { score: number; max: number; lines: string[] };
}

const PEOPLE_REACHED_LABELS: Record<number, string> = {
  1: "Niemand",
  2: "Specifiek segment",
  3: "Meerdere segmenten",
  4: "Groot deel",
  5: "Iedereen",
};

const CHANNEL_REACH_LABELS: Record<number, string> = {
  1: "Intern",
  2: "Niche kanaal",
  3: "Social media",
  4: "Email+site",
  5: "Paid breed",
};

const CHANGE_SIZE_LABELS: Record<number, string> = {
  1: "Micro copy",
  2: "Hele sectie",
  3: "Volledige pagina",
};

const CHANGE_TYPE_LABELS: Record<number, string> = {
  0: "Copy",
  1: "Navigatie",
  2: "Design",
};

const TIME_TO_SETUP_LABELS: Record<number, string> = {
  1: "<1 uur",
  2: "Halve dag",
  3: "Volle dag",
  4: "Week",
  5: "Meer dan week",
};

const DEPENDENCY_LABELS: Record<number, string> = {
  0: "Zelf",
  1: "Dev nodig",
  2: "Extern",
};

export function generateRiseExplanation(
  inputs: RiseInputs,
  scores: RiseScores
): RiseExplanation {
  return {
    reach: {
      score: scores.reach,
      max: 10,
      lines: [
        `${PEOPLE_REACHED_LABELS[inputs.peopleReached]} (${inputs.peopleReached})`,
        `${CHANNEL_REACH_LABELS[inputs.channelReach]} (${inputs.channelReach})`,
      ],
    },
    impact: {
      score: scores.impact,
      max: 20,
      lines: [
        `Nieuw kanaal: ${inputs.isNewChannel ? "Ja (+2)" : "Nee (+0)"}`,
        `Wijziging: ${CHANGE_SIZE_LABELS[inputs.changeSize]} (${inputs.changeSize})`,
        `Above fold: ${inputs.isAboveFold ? "Ja (+2)" : "Nee (+0)"}`,
        `Opvallend <5s: ${inputs.isNoticeable5s ? "Ja (+1)" : "Nee (+0)"}`,
        `Type: ${CHANGE_TYPE_LABELS[inputs.changeType]} (+${inputs.changeType})`,
        `Raw ${scores.impact / 2} × 2 = ${scores.impact}`,
      ],
    },
    confidence: {
      score: scores.confidence,
      max: 10,
      lines: [
        `User feedback: ${inputs.hasUserFeedback ? "+4" : "+0"}`,
        `Competitie data: ${inputs.hasCompetitorData ? "+2" : "+0"}`,
        `Analytics data: ${inputs.hasAnalyticsData ? "+2" : "+0"}`,
        `Best practices: ${inputs.hasBestPractices ? "+2" : "+0"}`,
      ],
    },
    ease: {
      score: scores.ease,
      max: 10,
      lines: [
        `Tijd: ${TIME_TO_SETUP_LABELS[inputs.timeToSetup]} (score ${6 - inputs.timeToSetup})`,
        `Dependency: ${DEPENDENCY_LABELS[inputs.dependencyLevel]} (×${[2, 1.5, 1][inputs.dependencyLevel]})`,
        `${6 - inputs.timeToSetup} × ${[2, 1.5, 1][inputs.dependencyLevel]} = ${scores.ease}`,
      ],
    },
  };
}
