
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge as BadgeUI } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Award, Trophy, Gift, Share2, History, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { loyaltyService } from "@/services/loyaltyService";
import { Badge, Challenge, Reward, CustomerLoyalty } from "@/types/loyalty";
import BadgeCard from "@/components/loyalty/BadgeCard";
import ChallengeCard from "@/components/loyalty/ChallengeCard";
import RewardCard from "@/components/loyalty/RewardCard";
import ProgressBar from "@/components/loyalty/ProgressBar";

const Rewards = () => {
  const { user } = useAuth();
  const customerId = user?.id || "1"; // Use actual user ID or fallback for demo
  
  const [customerLoyalty, setCustomerLoyalty] = useState<CustomerLoyalty | null>(null);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [availableRewards, setAvailableRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rewardCodeDialog, setRewardCodeDialog] = useState<{open: boolean; code?: string; reward?: Reward}>({
    open: false
  });
  
  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [loyalty, badges, rewards] = await Promise.all([
          loyaltyService.getCustomerLoyalty(customerId),
          loyaltyService.getAllBadges(),
          loyaltyService.getAvailableRewards()
        ]);
        
        setCustomerLoyalty(loyalty);
        setAllBadges(badges);
        setAvailableRewards(rewards);
      } catch (error) {
        console.error("Error fetching loyalty data:", error);
        toast.error("Failed to load loyalty data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [customerId]);
  
  // Handle challenge update
  const handleChallengeUpdate = (updatedChallenge: Challenge) => {
    if (!customerLoyalty) return;
    
    const availableChallenges = customerLoyalty.availableChallenges.filter(
      c => c.id !== updatedChallenge.id
    );
    
    const inProgressChallenges = [...customerLoyalty.inProgressChallenges];
    const inProgressIndex = inProgressChallenges.findIndex(c => c.id === updatedChallenge.id);
    
    if (updatedChallenge.status === 'inProgress') {
      // If the challenge was available and is now in progress
      if (inProgressIndex === -1) {
        inProgressChallenges.push(updatedChallenge);
      } else {
        // Update the in-progress challenge
        inProgressChallenges[inProgressIndex] = updatedChallenge;
      }
    } else if (updatedChallenge.status === 'completed') {
      // Remove from in-progress if it's completed
      if (inProgressIndex !== -1) {
        inProgressChallenges.splice(inProgressIndex, 1);
      }
      
      // Add to completed challenges
      const completedChallenges = [...customerLoyalty.completedChallenges, updatedChallenge.id];
      
      // Update points (reward from challenge)
      const updatedPoints = customerLoyalty.points + updatedChallenge.reward.points;
      
      setCustomerLoyalty({
        ...customerLoyalty,
        availableChallenges,
        inProgressChallenges,
        completedChallenges,
        points: updatedPoints
      });
      
      toast.success(`Challenge completed! You earned ${updatedChallenge.reward.points} points`);
      return;
    }
    
    setCustomerLoyalty({
      ...customerLoyalty,
      availableChallenges,
      inProgressChallenges
    });
  };
  
  // Handle reward redemption
  const handleRedeemReward = async (rewardId: string) => {
    if (!customerLoyalty) return;
    
    try {
      const result = await loyaltyService.redeemReward(customerId, rewardId);
      
      if (result.success) {
        setCustomerLoyalty({
          ...customerLoyalty,
          points: result.pointsRemaining,
          redeemedRewards: [
            ...customerLoyalty.redeemedRewards,
            { rewardId, redeemedDate: new Date().toISOString() }
          ]
        });
        
        toast.success("Reward redeemed successfully!");
        
        // Show reward code dialog if there's a code
        if (result.code) {
          setRewardCodeDialog({
            open: true,
            code: result.code,
            reward: result.reward
          });
        }
      }
    } catch (error) {
      console.error("Error redeeming reward:", error);
      toast.error("Failed to redeem reward");
    }
  };
  
  // Handle social sharing
  const handleSocialShare = async () => {
    try {
      const result = await loyaltyService.logSocialShare(customerId, 'instagram');
      
      // Update customer loyalty points
      if (customerLoyalty) {
        setCustomerLoyalty({
          ...customerLoyalty,
          points: result.totalPoints
        });
      }
      
      // Update challenges if any were affected
      if (result.challengesUpdated) {
        result.challengesUpdated.forEach(challenge => {
          handleChallengeUpdate(challenge);
        });
      }
      
      toast.success(`Post shared! You earned ${result.pointsEarned} points`);
    } catch (error) {
      console.error("Error logging social share:", error);
      toast.error("Failed to share post");
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rewards & Challenges</h1>
          <p className="text-muted-foreground">Loading your rewards and challenges...</p>
        </div>
      </div>
    );
  }
  
  // If no loyalty data
  if (!customerLoyalty) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rewards & Challenges</h1>
          <p className="text-muted-foreground">Failed to load loyalty data</p>
        </div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rewards & Challenges</h1>
          <p className="text-muted-foreground">Earn points, complete challenges, and redeem rewards</p>
        </div>
        
        <Button onClick={handleSocialShare} className="sm:self-start">
          <Share2 className="mr-2 h-4 w-4" />
          Share & Earn Points
        </Button>
      </div>
      
      {/* Loyalty Summary Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Your Loyalty Status</CardTitle>
          <CardDescription>
            Keep earning points to unlock more rewards and reach higher tiers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2">
              <ProgressBar 
                tier={customerLoyalty.tier} 
                points={customerLoyalty.points} 
              />
            </div>
            
            <div className="flex flex-col justify-center items-center border rounded-md p-4 bg-muted/10">
              <Trophy className="h-6 w-6 text-primary mb-2" />
              <div className="text-2xl font-bold">{customerLoyalty.points}</div>
              <div className="text-sm text-muted-foreground">Available Points</div>
            </div>
          </div>
          
          {/* User Tier Benefits */}
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-3">Your {customerLoyalty.tier.charAt(0).toUpperCase() + customerLoyalty.tier.slice(1)} Tier Benefits</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {customerLoyalty.tier === "bronze" && (
                <>
                  <div className="flex items-center p-3 bg-muted/30 rounded-md">
                    <div className="mr-3 bg-primary/10 p-2 rounded-full">
                      <Trophy className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-sm">5% off birthday treat</div>
                  </div>
                  <div className="flex items-center p-3 bg-muted/30 rounded-md">
                    <div className="mr-3 bg-primary/10 p-2 rounded-full">
                      <Gift className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-sm">Earn 10 points per ₹100</div>
                  </div>
                </>
              )}
              
              {(customerLoyalty.tier === "silver" || customerLoyalty.tier === "gold" || customerLoyalty.tier === "platinum" || customerLoyalty.tier === "diamond") && (
                <>
                  <div className="flex items-center p-3 bg-muted/30 rounded-md">
                    <div className="mr-3 bg-primary/10 p-2 rounded-full">
                      <Trophy className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-sm">10% off birthday treat</div>
                  </div>
                  <div className="flex items-center p-3 bg-muted/30 rounded-md">
                    <div className="mr-3 bg-primary/10 p-2 rounded-full">
                      <Gift className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-sm">Earn 15 points per ₹100</div>
                  </div>
                </>
              )}
              
              {(customerLoyalty.tier === "gold" || customerLoyalty.tier === "platinum" || customerLoyalty.tier === "diamond") && (
                <>
                  <div className="flex items-center p-3 bg-muted/30 rounded-md">
                    <div className="mr-3 bg-primary/10 p-2 rounded-full">
                      <Trophy className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-sm">Priority seating</div>
                  </div>
                </>
              )}
              
              {(customerLoyalty.tier === "platinum" || customerLoyalty.tier === "diamond") && (
                <>
                  <div className="flex items-center p-3 bg-muted/30 rounded-md">
                    <div className="mr-3 bg-primary/10 p-2 rounded-full">
                      <Gift className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-sm">Free dessert with meals</div>
                  </div>
                </>
              )}
              
              {customerLoyalty.tier === "diamond" && (
                <>
                  <div className="flex items-center p-3 bg-muted/30 rounded-md">
                    <div className="mr-3 bg-primary/10 p-2 rounded-full">
                      <Trophy className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-sm">Chef's special treatment</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tabs for Challenges, Badges, and Rewards */}
      <Tabs defaultValue="challenges" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full sm:w-auto">
          <TabsTrigger value="challenges" className="flex items-center">
            <Trophy className="h-4 w-4 mr-2" />
            <span>Challenges</span>
          </TabsTrigger>
          <TabsTrigger value="badges" className="flex items-center">
            <Award className="h-4 w-4 mr-2" />
            <span>Badges</span>
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center">
            <Gift className="h-4 w-4 mr-2" />
            <span>Rewards</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Challenges Tab */}
        <TabsContent value="challenges" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Trophy className="mr-2 h-5 w-5" />
              In-Progress Challenges
            </h2>
            
            {customerLoyalty.inProgressChallenges.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">
                    You don't have any challenges in progress. Start a challenge below!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customerLoyalty.inProgressChallenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    customerId={customerId}
                    onChallengeUpdate={handleChallengeUpdate}
                  />
                ))}
              </div>
            )}
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Available Challenges
            </h2>
            
            {customerLoyalty.availableChallenges.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">
                    You've started all available challenges. Check back later for more!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customerLoyalty.availableChallenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    customerId={customerId}
                    onChallengeUpdate={handleChallengeUpdate}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-center mt-6">
            <Button variant="outline" className="flex items-center">
              <History className="mr-2 h-4 w-4" />
              View Completed Challenges
            </Button>
          </div>
        </TabsContent>
        
        {/* Badges Tab */}
        <TabsContent value="badges" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Award className="mr-2 h-5 w-5" />
              Your Badges
            </h2>
            
            {customerLoyalty.badges.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">
                    You haven't earned any badges yet. Complete challenges to earn badges!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {customerLoyalty.badges.map((badge) => (
                  <BadgeCard
                    key={badge.id}
                    badge={badge}
                  />
                ))}
              </div>
            )}
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Available Badges
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allBadges
                .filter(badge => !customerLoyalty.badges.find(b => b.id === badge.id))
                .map((badge) => (
                  <BadgeCard
                    key={badge.id}
                    badge={badge}
                    isLocked={true}
                  />
                ))}
            </div>
          </div>
        </TabsContent>
        
        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center">
                <Gift className="mr-2 h-5 w-5" />
                Available Rewards
              </h2>
              
              <BadgeUI variant="outline" className="py-1">
                {customerLoyalty.points} points available
              </BadgeUI>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {availableRewards.map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  customerPoints={customerLoyalty.points}
                  onRedeem={handleRedeemReward}
                />
              ))}
            </div>
          </div>
          
          <div className="flex justify-center mt-6">
            <Button variant="outline" className="flex items-center">
              <History className="mr-2 h-4 w-4" />
              View Redemption History
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Reward Code Dialog */}
      <Dialog open={rewardCodeDialog.open} onOpenChange={(open) => setRewardCodeDialog({ open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your Reward Code</DialogTitle>
            <DialogDescription>
              Use this code during checkout to redeem your {rewardCodeDialog.reward?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center space-x-2 mt-4">
            <div className="grid flex-1 gap-2">
              <Input
                value={rewardCodeDialog.code}
                readOnly
                className="text-center text-lg font-medium"
              />
              <p className="text-xs text-muted-foreground">
                This code has been saved to your account and can be used any time.
              </p>
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <Button 
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(rewardCodeDialog.code || '');
                  toast.success('Code copied to clipboard');
                }
              }}
              className="sm:w-auto w-full"
            >
              Copy Code
            </Button>
            <Button 
              onClick={() => setRewardCodeDialog({ open: false })}
              variant="outline"
              className="sm:w-auto w-full"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rewards;
