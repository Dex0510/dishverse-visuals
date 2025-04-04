
import { Badge } from "@/types/loyalty";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeCardProps {
  badge: Badge;
  isLocked?: boolean;
  className?: string;
}

const BadgeCard = ({ badge, isLocked = false, className }: BadgeCardProps) => {
  const typeColors = {
    bronze: "bg-amber-700",
    silver: "bg-slate-400",
    gold: "bg-yellow-400",
    platinum: "bg-indigo-300",
    diamond: "bg-cyan-300"
  };
  
  const typeIcons = {
    bronze: <Trophy className="h-8 w-8 text-amber-600" />,
    silver: <Trophy className="h-8 w-8 text-slate-300" />,
    gold: <Trophy className="h-8 w-8 text-yellow-300" />,
    platinum: <Award className="h-8 w-8 text-indigo-200" />,
    diamond: <Award className="h-8 w-8 text-cyan-200" />
  };

  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", 
      isLocked ? "opacity-60" : "",
      className)}>
      <div className={cn("h-2", typeColors[badge.type])} />
      <CardHeader className="relative">
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-t-lg">
            <Lock className="h-8 w-8 text-white/70" />
          </div>
        )}
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{badge.name}</CardTitle>
          <div className="rounded-full p-2 bg-muted">
            {typeIcons[badge.type]}
          </div>
        </div>
        <CardDescription className="text-xs">
          {badge.type.charAt(0).toUpperCase() + badge.type.slice(1)} Badge
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{badge.description}</p>
      </CardContent>
      {badge.dateEarned && (
        <CardFooter className="pt-0">
          <p className="text-xs text-muted-foreground">
            Earned on {new Date(badge.dateEarned).toLocaleDateString()}
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

export default BadgeCard;
