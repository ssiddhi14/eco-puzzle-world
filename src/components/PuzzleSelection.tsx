import { ArrowLeft, Trees, Waves, PawPrint, Snowflake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PuzzleCategory, UserStats } from "@/pages/Index";

interface PuzzleSelectionProps {
  onCategorySelect: (category: PuzzleCategory) => void;
  onBack: () => void;
  userStats: UserStats;
}

const categories = [
  {
    id: 'forest' as PuzzleCategory,
    name: 'Forests',
    description: 'Explore lush green forests and learn about their vital role in our ecosystem',
    icon: Trees,
    gradient: 'gradient-forest',
    fact: 'Forests absorb about 2.6 billion tons of CO₂ annually'
  },
  {
    id: 'ocean' as PuzzleCategory,
    name: 'Oceans',
    description: 'Dive into the depths of our oceans and discover marine life',
    icon: Waves,
    gradient: 'gradient-ocean',
    fact: 'Oceans produce over 50% of the world\'s oxygen'
  },
  {
    id: 'wildlife' as PuzzleCategory,
    name: 'Wildlife',
    description: 'Meet amazing animals and learn about biodiversity conservation',
    icon: PawPrint,
    gradient: 'gradient-nature',
    fact: 'We share our planet with over 8.7 million species'
  },
  {
    id: 'climate' as PuzzleCategory,
    name: 'Climate Change',
    description: 'Understand climate patterns and environmental challenges',
    icon: Snowflake,
    gradient: 'gradient-earth',
    fact: 'Arctic ice is melting at a rate of 13% per decade'
  }
];

export const PuzzleSelection = ({ onCategorySelect, onBack, userStats }: PuzzleSelectionProps) => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </Button>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>Eco Points: <strong className="text-primary">{userStats.ecoPoints}</strong></span>
            <span>Completed: <strong className="text-secondary">{userStats.puzzlesCompleted}</strong></span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Choose Your Adventure</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select a category to start your environmental puzzle journey
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            
            return (
              <Card
                key={category.id}
                className="card-puzzle p-8 cursor-pointer group"
                onClick={() => onCategorySelect(category.id)}
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  {/* Icon */}
                  <div className={`p-6 ${category.gradient} rounded-3xl shadow-nature group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-12 h-12 text-white" />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {category.description}
                    </p>
                    
                    {/* Fun Fact */}
                    <div className="bg-muted rounded-2xl p-4">
                      <p className="text-sm font-medium text-foreground">
                        💡 Did you know? {category.fact}
                      </p>
                    </div>
                  </div>

                  {/* Difficulty Info */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      🧩 4x4 pieces
                    </span>
                    <span className="flex items-center gap-1">
                      ⭐ 100 points
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Coming Soon */}
        <div className="text-center mt-12 p-8 bg-muted/50 rounded-3xl">
          <h3 className="text-xl font-semibold text-foreground mb-2">Coming Soon</h3>
          <p className="text-muted-foreground">
            6x6 Advanced puzzles • Timer challenges • Custom image uploads
          </p>
        </div>
      </div>
    </div>
  );
};