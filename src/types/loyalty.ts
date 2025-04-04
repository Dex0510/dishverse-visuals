
export type BadgeType = "bronze" | "silver" | "gold" | "platinum" | "diamond";

export type ChallengeStatus = "available" | "inProgress" | "completed";

export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  type: BadgeType;
  dateEarned?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: {
    points: number;
    badgeId?: string;
  };
  criteria: {
    type: "orderCount" | "spendAmount" | "specificItems" | "socialShare" | "feedback" | "referral";
    target: number;
    items?: string[];
  };
  progress: number;
  status: ChallengeStatus;
  startDate: string;
  endDate: string;
  isRecurring: boolean;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  image?: string;
  cost: number;
  type: "discount" | "freeItem" | "experience" | "merchandise";
  discountAmount?: number;
  discountCode?: string;
  freeItem?: string;
  expiryDate?: string;
  isAvailable: boolean;
}

export interface CustomerLoyalty {
  customerId: string;
  points: number;
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  badges: Badge[];
  completedChallenges: string[];
  availableChallenges: Challenge[];
  inProgressChallenges: Challenge[];
  redeemedRewards: { rewardId: string; redeemedDate: string }[];
}
