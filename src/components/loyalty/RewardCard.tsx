
import { useState } from "react";
import { Reward } from "@/types/loyalty";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Ticket, Coffee, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface RewardCardProps {
  reward: Reward;
  customerPoints: number;
  onRedeem: (rewardId: string) => Promise<void>;
}

const RewardCard = ({ reward, customerPoints, onRedeem }: RewardCardProps) => {
  const [isRedeeming, setIsRedeeming] = useState(false);
  
  const canRedeem = customerPoints >= reward.cost;
  
  const handleRedeem = async () => {
    if (!canRedeem) return;
    
    setIsRedeeming(true);
    try {
      await onRedeem(reward.id);
    } finally {
      setIsRedeeming(false);
    }
  };
  
  const getRewardIcon = () => {
    switch(reward.type) {
      case 'discount':
        return <Ticket className="h-5 w-5 text-purple-500" />;
      case 'freeItem':
        return <Coffee className="h-5 w-5 text-amber-500" />;
      case 'experience':
        return <Gift className="h-5 w-5 text-pink-500" />;
      case 'merchandise':
        return <ShoppingBag className="h-5 w-5 text-indigo-500" />;
      default:
        return <Gift className="h-5 w-5 text-primary" />;
    }
  };
  
  const getTypeBadge = () => {
    switch(reward.type) {
      case 'discount':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Discount</Badge>;
      case 'freeItem':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Free Item</Badge>;
      case 'experience':
        return <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">Experience</Badge>;
      case 'merchandise':
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Merchandise</Badge>;
      default:
        return <Badge variant="outline">Reward</Badge>;
    }
  };

  return (
    <Card className={cn(
      "h-full flex flex-col overflow-hidden transition-all", 
      canRedeem ? "hover:shadow-md" : "opacity-70"
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base flex items-center gap-2">
            {getRewardIcon()}
            <span>{reward.name}</span>
          </CardTitle>
          {getTypeBadge()}
        </div>
        <CardDescription>
          {reward.cost} loyalty points
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm">{reward.description}</p>
        
        {reward.type === 'discount' && reward.discountAmount && (
          <div className="mt-2 text-sm font-medium text-purple-600">
            {reward.discountAmount}% off
          </div>
        )}
        
        {reward.expiryDate && (
          <p className="mt-2 text-xs text-muted-foreground">
            Valid until {new Date(reward.expiryDate).toLocaleDateString()}
          </p>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          onClick={handleRedeem}
          disabled={!canRedeem || isRedeeming}
          className="w-full"
          variant={canRedeem ? "default" : "outline"}
        >
          {isRedeeming ? "Redeeming..." : canRedeem ? "Redeem Reward" : `Need ${reward.cost - customerPoints} more points`}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RewardCard;
