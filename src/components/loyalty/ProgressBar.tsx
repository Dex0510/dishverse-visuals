
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  points: number;
  className?: string;
}

const ProgressBar = ({ tier, points, className }: ProgressBarProps) => {
  const tierThresholds = {
    bronze: 0,
    silver: 500,
    gold: 1500,
    platinum: 5000,
    diamond: 10000
  };
  
  const tierColors = {
    bronze: "from-amber-700 to-amber-600",
    silver: "from-slate-400 to-slate-300",
    gold: "from-yellow-500 to-yellow-400",
    platinum: "from-indigo-400 to-indigo-300",
    diamond: "from-cyan-400 to-cyan-300"
  };
  
  const nextTier = (): { name: string; threshold: number } => {
    switch (tier) {
      case "bronze":
        return { name: "Silver", threshold: tierThresholds.silver };
      case "silver":
        return { name: "Gold", threshold: tierThresholds.gold };
      case "gold":
        return { name: "Platinum", threshold: tierThresholds.platinum };
      case "platinum":
        return { name: "Diamond", threshold: tierThresholds.diamond };
      case "diamond":
        return { name: "Diamond", threshold: tierThresholds.diamond };
    }
  };
  
  const currentTierThreshold = tierThresholds[tier];
  const next = nextTier();
  
  // Calculate progress percentage to next tier
  const progressToNextTier = tier === "diamond" 
    ? 100 
    : ((points - currentTierThreshold) / (next.threshold - currentTierThreshold)) * 100;
  
  // Points needed for next tier
  const pointsNeeded = tier === "diamond" ? 0 : next.threshold - points;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-primary" />
          <span className="text-sm font-medium capitalize">{tier} Tier</span>
        </div>
        <span className="text-sm font-medium">{points} points</span>
      </div>
      
      <Progress 
        value={progressToNextTier} 
        className={cn("h-2.5 bg-muted/50", className)}
      />
      
      {tier !== "diamond" && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Current: {tier.charAt(0).toUpperCase() + tier.slice(1)}</span>
          <span>Next: {next.name} ({pointsNeeded} points needed)</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
