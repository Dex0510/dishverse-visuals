
import { useState } from "react";
import { Challenge } from "@/types/loyalty";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Share2, Clock, CheckCircle, CircleEllipsis } from "lucide-react";
import { toast } from "sonner";
import { loyaltyService } from "@/services/loyaltyService";

interface ChallengeCardProps {
  challenge: Challenge;
  customerId: string;
  onChallengeUpdate?: (updatedChallenge: Challenge) => void;
}

const ChallengeCard = ({ challenge, customerId, onChallengeUpdate }: ChallengeCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const progressPercentage = Math.min(100, (challenge.progress / challenge.criteria.target) * 100);
  
  const handleStartChallenge = async () => {
    setIsLoading(true);
    try {
      const updatedChallenge = await loyaltyService.startChallenge(customerId, challenge.id);
      if (onChallengeUpdate) {
        onChallengeUpdate(updatedChallenge);
      }
      toast.success(`Started challenge: ${challenge.title}`);
    } catch (error) {
      console.error("Error starting challenge:", error);
      toast.error("Failed to start challenge");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSocialShare = async () => {
    if (challenge.criteria.type !== 'socialShare') return;
    
    setIsLoading(true);
    try {
      const result = await loyaltyService.logSocialShare(customerId, 'instagram');
      
      if (result.challengesUpdated && result.challengesUpdated.length > 0) {
        const updatedChallenge = result.challengesUpdated[0];
        if (onChallengeUpdate) {
          onChallengeUpdate(updatedChallenge);
        }
      }
      
      toast.success(`Shared! You earned ${result.pointsEarned} points`);
    } catch (error) {
      console.error("Error logging social share:", error);
      toast.error("Failed to log social share");
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderCriteriaText = () => {
    switch (challenge.criteria.type) {
      case 'orderCount':
        return `Place ${challenge.criteria.target} orders`;
      case 'spendAmount':
        return `Spend ₹${challenge.criteria.target}`;
      case 'specificItems':
        return `Order ${challenge.criteria.items?.join(', ')}`;
      case 'socialShare':
        return `Share ${challenge.criteria.target} time${challenge.criteria.target > 1 ? 's' : ''} on social media`;
      case 'feedback':
        return `Provide ${challenge.criteria.target} feedback`;
      case 'referral':
        return `Refer ${challenge.criteria.target} friend${challenge.criteria.target > 1 ? 's' : ''}`;
      default:
        return 'Complete challenge criteria';
    }
  };
  
  const getStatusIcon = () => {
    switch (challenge.status) {
      case 'available':
        return <Clock className="h-5 w-5 text-muted-foreground" />;
      case 'inProgress':
        return <CircleEllipsis className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };
  
  const renderActionButton = () => {
    if (challenge.status === 'available') {
      return (
        <Button onClick={handleStartChallenge} disabled={isLoading} className="w-full">
          Start Challenge
        </Button>
      );
    }
    
    if (challenge.status === 'inProgress' && challenge.criteria.type === 'socialShare') {
      return (
        <Button 
          onClick={handleSocialShare} 
          disabled={isLoading} 
          variant="outline" 
          className="w-full"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share to Complete
        </Button>
      );
    }
    
    if (challenge.status === 'completed') {
      return (
        <Button disabled variant="outline" className="w-full bg-green-50">
          <CheckCircle className="mr-2 h-4 w-4" />
          Completed
        </Button>
      );
    }
    
    return null;
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base flex items-center">
              {challenge.title}
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              {getStatusIcon()}
              <span className="ml-1">{renderCriteriaText()}</span>
            </CardDescription>
          </div>
          <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
            <Trophy className="h-3 w-3" />
            <span>+{challenge.reward.points} pts</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm">{challenge.description}</p>
        
        {challenge.status !== 'available' && (
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{challenge.progress} / {challenge.criteria.target}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}
      </CardContent>
      <CardFooter className="mt-auto pt-2">
        {renderActionButton()}
      </CardFooter>
    </Card>
  );
};

export default ChallengeCard;
