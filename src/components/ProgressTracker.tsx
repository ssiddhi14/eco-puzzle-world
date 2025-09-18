import { Trophy, Star, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UserStats } from "@/pages/Index";

interface ProgressTrackerProps {
  userStats: UserStats;
  currentProgress?: number;
}

export const ProgressTracker = ({ userStats, currentProgress = 0 }: ProgressTrackerProps) => {
  const getLevel = (points: number) => {
    return Math.floor(points / 100) + 1;
  };

  const getPointsToNextLevel = (points: number) => {
    const currentLevel = getLevel(points);
    const pointsForNextLevel = currentLevel * 100;
    return pointsForNextLevel - points;
  };

  const getLevelProgress = (points: number) => {
    const currentLevel = getLevel(points);
    const pointsInCurrentLevel = points - ((currentLevel - 1) * 100);
    return (pointsInCurrentLevel / 100) * 100;
  };

  const currentLevel = getLevel(userStats.ecoPoints);
  const pointsToNext = getPointsToNextLevel(userStats.ecoPoints);
  const levelProgress = getLevelProgress(userStats.ecoPoints);

  return (
    <div className="space-y-6">
      {/* Current Puzzle Progress */}
      {currentProgress > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Current Puzzle</h3>
            <span className="text-2xl font-bold text-primary">{Math.round(currentProgress)}%</span>
          </div>
          <Progress value={currentProgress} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">
            Keep going! You're making great progress.
          </p>
        </Card>
      )}

      {/* Level Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-warning" />
            <h3 className="font-semibold text-foreground">Level {currentLevel}</h3>
          </div>
          <span className="text-sm text-muted-foreground">
            {pointsToNext} pts to next level
          </span>
        </div>
        <Progress value={levelProgress} className="h-3 mb-2" />
        <p className="text-sm text-muted-foreground">
          Eco Champion Level - Keep solving puzzles to level up!
        </p>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <Star className="w-6 h-6 text-primary mx-auto mb-2" />
          <div className="text-lg font-bold text-primary">{userStats.ecoPoints}</div>
          <div className="text-sm text-muted-foreground">Total Points</div>
        </Card>
        
        <Card className="p-4 text-center">
          <Target className="w-6 h-6 text-secondary mx-auto mb-2" />
          <div className="text-lg font-bold text-secondary">{userStats.puzzlesCompleted}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </Card>
        
        <Card className="p-4 text-center">
          <Trophy className="w-6 h-6 text-accent mx-auto mb-2" />
          <div className="text-lg font-bold text-accent">{userStats.badges.length}</div>
          <div className="text-sm text-muted-foreground">Badges</div>
        </Card>
      </div>

      {/* Achievements */}
      {userStats.badges.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Recent Achievements</h3>
          <div className="grid grid-cols-2 gap-3">
            {userStats.badges.slice(-4).map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-muted rounded-lg"
              >
                <div className="w-8 h-8 bg-gradient-nature rounded-full flex items-center justify-center">
                  🏆
                </div>
                <div>
                  <div className="text-sm font-medium capitalize">
                    {badge.replace('_', ' ')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Puzzle Master
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};