
import apiClient from './api';
import { Badge, Challenge, Reward, CustomerLoyalty } from '@/types/loyalty';

// Mock data for development (would be replaced with actual API calls)
const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'First Visit',
    description: 'Awarded for your first visit to our restaurant',
    image: '/badges/first-visit.png',
    type: 'bronze',
    dateEarned: '2023-06-10'
  },
  {
    id: '2',
    name: 'Gourmet Explorer',
    description: 'Try 5 different menu items',
    image: '/badges/gourmet-explorer.png',
    type: 'silver',
    dateEarned: '2023-07-15'
  },
  {
    id: '3',
    name: 'Social Foodie',
    description: 'Share 3 meals on social media',
    image: '/badges/social-foodie.png',
    type: 'gold'
  },
  {
    id: '4',
    name: 'Loyal Patron',
    description: 'Visit our restaurant 10 times',
    image: '/badges/loyal-patron.png',
    type: 'platinum'
  },
  {
    id: '5',
    name: 'VIP Diner',
    description: 'Spend over ₹10,000 at our restaurant',
    image: '/badges/vip-diner.png',
    type: 'diamond'
  }
];

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Try Our Signature Dish',
    description: 'Order our chef\'s signature Beef Wellington',
    reward: {
      points: 50,
      badgeId: '6'
    },
    criteria: {
      type: 'specificItems',
      target: 1,
      items: ['Beef Wellington']
    },
    progress: 0,
    status: 'available',
    startDate: '2023-01-01',
    endDate: '2025-12-31',
    isRecurring: false
  },
  {
    id: '2',
    title: 'Weekend Warrior',
    description: 'Visit us 3 weekends in a row',
    reward: {
      points: 100
    },
    criteria: {
      type: 'orderCount',
      target: 3
    },
    progress: 1,
    status: 'inProgress',
    startDate: '2023-01-01',
    endDate: '2025-12-31',
    isRecurring: true
  },
  {
    id: '3',
    title: 'Social Media Star',
    description: 'Share your meal on social media and tag us',
    reward: {
      points: 25,
      badgeId: '3'
    },
    criteria: {
      type: 'socialShare',
      target: 1
    },
    progress: 0,
    status: 'available',
    startDate: '2023-01-01',
    endDate: '2025-12-31',
    isRecurring: true
  },
  {
    id: '4',
    title: 'Dessert Connoisseur',
    description: 'Try all our dessert items',
    reward: {
      points: 75
    },
    criteria: {
      type: 'specificItems',
      target: 4,
      items: ['Chocolate Lava Cake', 'Tiramisu', 'Cheesecake', 'Apple Pie']
    },
    progress: 2,
    status: 'inProgress',
    startDate: '2023-01-01',
    endDate: '2025-12-31',
    isRecurring: false
  },
  {
    id: '5',
    title: 'Feedback Champion',
    description: 'Provide detailed feedback for 5 visits',
    reward: {
      points: 150
    },
    criteria: {
      type: 'feedback',
      target: 5
    },
    progress: 3,
    status: 'inProgress',
    startDate: '2023-01-01',
    endDate: '2025-12-31',
    isRecurring: false
  }
];

const mockRewards: Reward[] = [
  {
    id: '1',
    name: '10% Off Your Next Order',
    description: 'Get 10% off your next order',
    image: '/rewards/discount.png',
    cost: 100,
    type: 'discount',
    discountAmount: 10,
    discountCode: 'LOYAL10',
    isAvailable: true
  },
  {
    id: '2',
    name: 'Free Dessert',
    description: 'Enjoy a free dessert of your choice',
    image: '/rewards/dessert.png',
    cost: 150,
    type: 'freeItem',
    freeItem: 'Any dessert item',
    isAvailable: true
  },
  {
    id: '3',
    name: 'Chef\'s Table Experience',
    description: 'Exclusive dining experience at the chef\'s table',
    image: '/rewards/chef-table.png',
    cost: 500,
    type: 'experience',
    isAvailable: true
  },
  {
    id: '4',
    name: 'Restaurant Branded Mug',
    description: 'Take home our limited edition branded coffee mug',
    image: '/rewards/mug.png',
    cost: 200,
    type: 'merchandise',
    isAvailable: true
  },
  {
    id: '5',
    name: '25% Off Any Premium Dish',
    description: 'Get 25% off any premium dish on our menu',
    image: '/rewards/premium-discount.png',
    cost: 300,
    type: 'discount',
    discountAmount: 25,
    discountCode: 'PREMIUM25',
    isAvailable: true
  }
];

const mockCustomerLoyalty: CustomerLoyalty = {
  customerId: '1',
  points: 275,
  tier: 'silver',
  badges: mockBadges.slice(0, 2),
  completedChallenges: [],
  availableChallenges: mockChallenges.filter(c => c.status === 'available'),
  inProgressChallenges: mockChallenges.filter(c => c.status === 'inProgress'),
  redeemedRewards: []
};

// Service functions
export const loyaltyService = {
  // Get all badges for a customer
  getCustomerBadges: async (customerId: string): Promise<Badge[]> => {
    try {
      // For mock data, just return customer's earned badges
      return mockCustomerLoyalty.badges;
      
      // Real implementation:
      // const response = await apiClient.get<Badge[]>(`/customers/${customerId}/badges`);
      // return response.data;
    } catch (error) {
      console.error('Error fetching customer badges:', error);
      throw error;
    }
  },

  // Get all available badges in the system
  getAllBadges: async (): Promise<Badge[]> => {
    try {
      // For mock data:
      return mockBadges;
      
      // Real implementation:
      // const response = await apiClient.get<Badge[]>('/loyalty/badges');
      // return response.data;
    } catch (error) {
      console.error('Error fetching all badges:', error);
      throw error;
    }
  },

  // Get challenges for a customer
  getCustomerChallenges: async (customerId: string): Promise<{
    available: Challenge[];
    inProgress: Challenge[];
    completed: Challenge[];
  }> => {
    try {
      // For mock data:
      return {
        available: mockCustomerLoyalty.availableChallenges,
        inProgress: mockCustomerLoyalty.inProgressChallenges,
        completed: mockChallenges.filter(c => c.status === 'completed')
      };
      
      // Real implementation:
      // const response = await apiClient.get<{
      //   available: Challenge[];
      //   inProgress: Challenge[];
      //   completed: Challenge[];
      // }>(`/customers/${customerId}/challenges`);
      // return response.data;
    } catch (error) {
      console.error('Error fetching customer challenges:', error);
      throw error;
    }
  },

  // Get all available challenges
  getAllChallenges: async (): Promise<Challenge[]> => {
    try {
      // For mock data:
      return mockChallenges;
      
      // Real implementation:
      // const response = await apiClient.get<Challenge[]>('/loyalty/challenges');
      // return response.data;
    } catch (error) {
      console.error('Error fetching all challenges:', error);
      throw error;
    }
  },

  // Start a challenge
  startChallenge: async (customerId: string, challengeId: string): Promise<Challenge> => {
    try {
      // For mock data:
      const challenge = mockChallenges.find(c => c.id === challengeId);
      if (!challenge) throw new Error('Challenge not found');
      
      const updatedChallenge = { ...challenge, status: 'inProgress' as const };
      return updatedChallenge;
      
      // Real implementation:
      // const response = await apiClient.post<Challenge>(`/customers/${customerId}/challenges/${challengeId}/start`);
      // return response.data;
    } catch (error) {
      console.error('Error starting challenge:', error);
      throw error;
    }
  },

  // Update challenge progress
  updateChallengeProgress: async (
    customerId: string, 
    challengeId: string, 
    progress: number
  ): Promise<Challenge> => {
    try {
      // For mock data:
      const challenge = mockChallenges.find(c => c.id === challengeId);
      if (!challenge) throw new Error('Challenge not found');
      
      const updatedChallenge = { 
        ...challenge, 
        progress,
        status: progress >= challenge.criteria.target ? 'completed' as const : 'inProgress' as const
      };
      return updatedChallenge;
      
      // Real implementation:
      // const response = await apiClient.put<Challenge>(
      //   `/customers/${customerId}/challenges/${challengeId}/progress`,
      //   { progress }
      // );
      // return response.data;
    } catch (error) {
      console.error('Error updating challenge progress:', error);
      throw error;
    }
  },

  // Get available rewards
  getAvailableRewards: async (): Promise<Reward[]> => {
    try {
      // For mock data:
      return mockRewards.filter(r => r.isAvailable);
      
      // Real implementation:
      // const response = await apiClient.get<Reward[]>('/loyalty/rewards');
      // return response.data;
    } catch (error) {
      console.error('Error fetching available rewards:', error);
      throw error;
    }
  },

  // Get customer loyalty profile
  getCustomerLoyalty: async (customerId: string): Promise<CustomerLoyalty> => {
    try {
      // For mock data:
      return mockCustomerLoyalty;
      
      // Real implementation:
      // const response = await apiClient.get<CustomerLoyalty>(`/customers/${customerId}/loyalty`);
      // return response.data;
    } catch (error) {
      console.error('Error fetching customer loyalty profile:', error);
      throw error;
    }
  },

  // Redeem a reward
  redeemReward: async (customerId: string, rewardId: string): Promise<{ 
    success: boolean; 
    reward: Reward; 
    pointsRemaining: number;
    code?: string;
  }> => {
    try {
      // For mock data:
      const reward = mockRewards.find(r => r.id === rewardId);
      if (!reward) throw new Error('Reward not found');
      
      if (mockCustomerLoyalty.points < reward.cost) {
        throw new Error('Insufficient points');
      }
      
      const pointsRemaining = mockCustomerLoyalty.points - reward.cost;
      
      // Real implementation:
      // const response = await apiClient.post<{ 
      //   success: boolean; 
      //   reward: Reward; 
      //   pointsRemaining: number;
      //   code?: string;
      // }>(`/customers/${customerId}/rewards/${rewardId}/redeem`);
      // return response.data;
      
      return {
        success: true,
        reward,
        pointsRemaining,
        code: reward.discountCode
      };
    } catch (error) {
      console.error('Error redeeming reward:', error);
      throw error;
    }
  },

  // Log a social share
  logSocialShare: async (
    customerId: string, 
    platform: 'facebook' | 'instagram' | 'twitter' | 'other',
    content?: string
  ): Promise<{ 
    pointsEarned: number; 
    totalPoints: number;
    challengesUpdated?: Challenge[];
  }> => {
    try {
      // Mock implementation
      const socialChallenge = mockChallenges.find(
        c => c.criteria.type === 'socialShare' && 
        (c.status === 'available' || c.status === 'inProgress')
      );
      
      const pointsEarned = socialChallenge ? 25 : 10; // Base points for sharing
      const totalPoints = mockCustomerLoyalty.points + pointsEarned;
      
      // Real implementation:
      // const response = await apiClient.post<{ 
      //   pointsEarned: number; 
      //   totalPoints: number;
      //   challengesUpdated?: Challenge[];
      // }>(`/customers/${customerId}/social-share`, { platform, content });
      // return response.data;
      
      return {
        pointsEarned,
        totalPoints,
        challengesUpdated: socialChallenge ? [
          { 
            ...socialChallenge,
            progress: Math.min(socialChallenge.progress + 1, socialChallenge.criteria.target),
            status: (socialChallenge.progress + 1) >= socialChallenge.criteria.target 
              ? 'completed' as const 
              : 'inProgress' as const
          }
        ] : undefined
      };
    } catch (error) {
      console.error('Error logging social share:', error);
      throw error;
    }
  },
  
  // Create a new challenge (admin function)
  createChallenge: async (challenge: Omit<Challenge, 'id'>): Promise<Challenge> => {
    try {
      // Real implementation:
      // const response = await apiClient.post<Challenge>('/loyalty/challenges', challenge);
      // return response.data;
      
      // Mock implementation
      const newChallenge: Challenge = {
        ...challenge,
        id: `ch_${Date.now()}`
      };
      
      return newChallenge;
    } catch (error) {
      console.error('Error creating challenge:', error);
      throw error;
    }
  },
  
  // Create a new reward (admin function)
  createReward: async (reward: Omit<Reward, 'id'>): Promise<Reward> => {
    try {
      // Real implementation:
      // const response = await apiClient.post<Reward>('/loyalty/rewards', reward);
      // return response.data;
      
      // Mock implementation
      const newReward: Reward = {
        ...reward,
        id: `rw_${Date.now()}`
      };
      
      return newReward;
    } catch (error) {
      console.error('Error creating reward:', error);
      throw error;
    }
  }
};

export default loyaltyService;
