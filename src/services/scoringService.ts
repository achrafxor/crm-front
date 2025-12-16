import type { ScoreClassification, SellerScore } from '../types';

export interface QuestionnaireAnswers {
    timeframe: 'IMMEDIATE' | '3_MONTHS' | '6_MONTHS' | 'UNCERTAIN';
    motivation: 'MUST_SELL' | 'WANT_SELL' | 'curious';
    priceExpectation: 'MARKET' | 'ABOVE_MARKET' | 'UNREALISTIC';
    exclusivity: 'YES' | 'NO' | 'MAYBE';
}

const WEIGHTS = {
    timeframe: {
        IMMEDIATE: 30,
        '3_MONTHS': 20,
        '6_MONTHS': 10,
        UNCERTAIN: 0,
    },
    motivation: {
        MUST_SELL: 30,
        WANT_SELL: 15,
        curious: 0,
    },
    priceExpectation: {
        MARKET: 20,
        ABOVE_MARKET: 10,
        UNREALISTIC: 0,
    },
    exclusivity: {
        YES: 20,
        MAYBE: 10,
        NO: 0,
    }
};

export const calculateScore = (answers: QuestionnaireAnswers): SellerScore => {
    const motivationScore = WEIGHTS.timeframe[answers.timeframe] + WEIGHTS.motivation[answers.motivation];
    const priceScore = WEIGHTS.priceExpectation[answers.priceExpectation];
    const legalScore = WEIGHTS.exclusivity[answers.exclusivity];

    const totalScore = motivationScore + priceScore + legalScore; // Max 100

    let classification: ScoreClassification = 'FROID';
    if (totalScore >= 80) classification = 'CHAUD';
    else if (totalScore >= 50) classification = 'TIÈDE';

    return {
        totalScore,
        classification,
        breakdown: {
            motivation: motivationScore,
            priceRealism: priceScore,
            legal: legalScore,
        }
    };
};
