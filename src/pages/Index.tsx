import { useState } from "react";
import { Leaf, Play, Award, Puzzle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PuzzleSelection } from "@/components/PuzzleSelection";
import { PuzzleGame } from "@/components/PuzzleGame";
import { ProgressTracker } from "@/components/ProgressTracker";

export type GameState = 'menu' | 'selection' | 'playing';
export type PuzzleCategory = 'forest' | 'ocean' | 'wildlife' | 'climate';

export interface UserStats {
  ecoPoints: number;
  puzzlesCompleted: number;
  badges: string[];
}

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [selectedCategory, setSelectedCategory] = useState<PuzzleCategory | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    ecoPoints: 0,
    puzzlesCompleted: 0,
    badges: []
  });

  const handleStartGame = () => {
    setGameState('selection');
  };

  const handleCategorySelect = (category: PuzzleCategory) => {
    setSelectedCategory(category);
    setGameState('playing');
  };

  const handleCategoryChange = (category: PuzzleCategory) => {
    setSelectedCategory(category);
  };

  const handlePuzzleComplete = (category: PuzzleCategory, points: number) => {
    setUserStats(prev => ({
      ecoPoints: prev.ecoPoints + points,
      puzzlesCompleted: prev.puzzlesCompleted + 1,
      badges: [...prev.badges, `${category}_master`]
    }));
  };

  const handleBackToMenu = () => {
    setGameState('menu');
    setSelectedCategory(null);
  };

  const handleBackToSelection = () => {
    setGameState('selection');
    setSelectedCategory(null);
  };

  if (gameState === 'playing' && selectedCategory) {
    return (
      <PuzzleGame 
        category={selectedCategory}
        onComplete={(points) => handlePuzzleComplete(selectedCategory, points)}
        onBack={handleBackToSelection}
        onCategoryChange={handleCategoryChange}
        userStats={userStats}
      />
    );
  }

  if (gameState === 'selection') {
    return (
      <PuzzleSelection 
        onCategorySelect={handleCategorySelect}
        onBack={handleBackToMenu}
        userStats={userStats}
      />
    );
  }

  return (
    <div className="min-h-screen gradient-nature flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Puzzle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-6xl font-bold text-white tracking-wide">
              Climate Puzzle
            </h1>
          </div>
          <p className="text-2xl text-white/90 font-medium mb-8 max-w-2xl mx-auto">
            Assemble the pieces, learn about the planet.
          </p>
          <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
            Discover the beauty of our Earth through interactive puzzles. Each completed puzzle reveals fascinating facts about our environment and earns you Eco Points!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="card-puzzle p-6 text-center">
            <Leaf className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">{userStats.ecoPoints}</div>
            <div className="text-muted-foreground">Eco Points</div>
          </Card>
          <Card className="card-puzzle p-6 text-center">
            <Puzzle className="w-8 h-8 text-secondary mx-auto mb-2" />
            <div className="text-2xl font-bold text-secondary">{userStats.puzzlesCompleted}</div>
            <div className="text-muted-foreground">Puzzles Completed</div>
          </Card>
          <Card className="card-puzzle p-6 text-center">
            <Award className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-accent">{userStats.badges.length}</div>
            <div className="text-muted-foreground">Badges Earned</div>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button
            onClick={handleStartGame}
            className="btn-nature text-xl px-12 py-6 mb-6"
          >
            <Play className="w-6 h-6 mr-3" />
            Start Playing
          </Button>
          <div className="text-white/70 text-sm">
            Choose from 4 environmental categories • Earn points and badges • Learn amazing facts
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;