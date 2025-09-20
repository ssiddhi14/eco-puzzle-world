import { useState, useEffect, useRef } from "react";
import { ArrowLeft, RotateCcw, CheckCircle, Star, Shuffle, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PuzzleCategory, UserStats } from "@/pages/Index";
import { toast } from "sonner";

// Import puzzle images
import forestImage from "@/assets/forest-puzzle.jpg";
import oceanImage from "@/assets/ocean-puzzle.jpg";
import wildlifeImage from "@/assets/wildlife-puzzle.jpg";
import climateImage from "@/assets/climate-puzzle.jpg";

interface PuzzlePiece {
  id: number;
  correctX: number;
  correctY: number;
  currentX: number;
  currentY: number;
  placed: boolean;
  imageData: string;
}

interface PuzzleGameProps {
  category: PuzzleCategory;
  onComplete: (points: number) => void;
  onBack: () => void;
  onCategoryChange: (category: PuzzleCategory) => void;
  userStats: UserStats;
}

const categoryData = {
  forest: {
    image: forestImage,
    name: "Lush Forest",
    fact: "🌳 Forests absorb about 2.6 billion tons of CO₂ annually, making them crucial for fighting climate change!",
    points: 100
  },
  ocean: {
    image: oceanImage,
    name: "Ocean Depths", 
    fact: "🌊 Oceans produce over 50% of the world's oxygen and absorb 30% of CO₂ emissions!",
    points: 100
  },
  wildlife: {
    image: wildlifeImage,
    name: "Majestic Wildlife",
    fact: "🐅 We share our planet with over 8.7 million species, but we're losing them 1,000x faster than natural rates!",
    points: 100
  },
  climate: {
    image: climateImage,
    name: "Climate Reality",
    fact: "🧊 Arctic sea ice is melting at a rate of 13% per decade, affecting global weather patterns!",
    points: 100
  }
};

export const PuzzleGame = ({ category, onComplete, onBack, onCategoryChange, userStats }: PuzzleGameProps) => {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const GRID_SIZE = 4;
  const PIECE_SIZE = 120;
  const CANVAS_SIZE = GRID_SIZE * PIECE_SIZE;

  const currentPuzzle = categoryData[category];

  // Initialize puzzle pieces
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      generatePuzzlePieces(img);
      setImageLoaded(true);
    };
    img.src = currentPuzzle.image;
  }, [category]);

  const generatePuzzlePieces = (img: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const newPieces: PuzzlePiece[] = [];
    const pieceWidth = img.width / GRID_SIZE;
    const pieceHeight = img.height / GRID_SIZE;

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const pieceCanvas = document.createElement('canvas');
        const pieceCtx = pieceCanvas.getContext('2d');
        if (!pieceCtx) continue;

        pieceCanvas.width = PIECE_SIZE;
        pieceCanvas.height = PIECE_SIZE;

        // Draw piece from original image
        pieceCtx.drawImage(
          img,
          col * pieceWidth,
          row * pieceHeight,
          pieceWidth,
          pieceHeight,
          0,
          0,
          PIECE_SIZE,
          PIECE_SIZE
        );

        // Add border
        pieceCtx.strokeStyle = '#22c55e';
        pieceCtx.lineWidth = 2;
        pieceCtx.strokeRect(0, 0, PIECE_SIZE, PIECE_SIZE);

        newPieces.push({
          id: row * GRID_SIZE + col,
          correctX: col * PIECE_SIZE,
          correctY: row * PIECE_SIZE,
          currentX: Math.random() * (window.innerWidth - 200),
          currentY: Math.random() * (window.innerHeight - 200) + 200,
          placed: false,
          imageData: pieceCanvas.toDataURL()
        });
      }
    }

    // Shuffle pieces
    setPieces(newPieces.sort(() => Math.random() - 0.5));
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, pieceId: number) => {
    setDraggedPiece(pieceId);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedPiece === null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dropX = e.clientX - rect.left;
    const dropY = e.clientY - rect.top;

    // Find the grid position
    const gridX = Math.floor(dropX / PIECE_SIZE) * PIECE_SIZE;
    const gridY = Math.floor(dropY / PIECE_SIZE) * PIECE_SIZE;

    // Update piece position
    setPieces(prev => prev.map(piece => {
      if (piece.id === draggedPiece) {
        const isCorrectPosition = gridX === piece.correctX && gridY === piece.correctY;
        
        if (isCorrectPosition && !piece.placed) {
          toast.success("Perfect fit! 🎉");
        }

        return {
          ...piece,
          currentX: gridX,
          currentY: gridY,
          placed: isCorrectPosition
        };
      }
      return piece;
    }));

    setDraggedPiece(null);
  };

  // Update progress
  useEffect(() => {
    const placedCount = pieces.filter(p => p.placed).length;
    const newProgress = (placedCount / pieces.length) * 100;
    setProgress(newProgress);

    if (placedCount === pieces.length && pieces.length > 0 && !isComplete) {
      setIsComplete(true);
      onComplete(currentPuzzle.points);
      toast.success("Congratulations! Puzzle completed! 🎊");
    }
  }, [pieces, isComplete, onComplete, currentPuzzle.points]);

  // Reset puzzle
  const handleReset = () => {
    setPieces(prev => prev.map(piece => ({
      ...piece,
      currentX: Math.random() * (window.innerWidth - 200),
      currentY: Math.random() * (window.innerHeight - 200) + 200,
      placed: false
    })));
    setIsComplete(false);
    setProgress(0);
  };

  // Change to random image
  const handleChangeImage = () => {
    const categories: PuzzleCategory[] = ['forest', 'ocean', 'wildlife', 'climate'];
    const otherCategories = categories.filter(cat => cat !== category);
    const randomCategory = otherCategories[Math.floor(Math.random() * otherCategories.length)];
    onCategoryChange(randomCategory);
  };

  if (!imageLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading puzzle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Selection
          </Button>
          
          <div className="flex items-center gap-4">
            {/* Change Image Button */}
            <Button onClick={handleChangeImage} variant="outline" size="sm">
              <ImageIcon className="w-4 h-4 mr-2" />
              Change Image
            </Button>
            
            {/* Category Switcher */}
            <div className="flex items-center gap-2">
              <Shuffle className="w-4 h-4 text-muted-foreground" />
              <select 
                value={category}
                onChange={(e) => onCategoryChange(e.target.value as PuzzleCategory)}
                className="bg-background border border-border rounded-md px-3 py-1 text-sm"
              >
                <option value="forest">🌳 Forest</option>
                <option value="ocean">🌊 Ocean</option>
                <option value="wildlife">🐅 Wildlife</option>
                <option value="climate">🧊 Climate</option>
              </select>
            </div>
            
            <Button onClick={handleReset} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <span className="text-sm text-muted-foreground">
              Eco Points: <strong className="text-primary">{userStats.ecoPoints}</strong>
            </span>
          </div>
        </div>

        {/* Puzzle Info */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">{currentPuzzle.name}</h1>
          <div className="flex items-center justify-center gap-4 mb-4">
            <Progress value={progress} className="w-64" />
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex flex-col xl:flex-row gap-8 items-start justify-center">
          {/* Reference Image */}
          <div className="min-w-[300px]">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Reference Image</h3>
              <div className="relative">
                <img
                  src={currentPuzzle.image}
                  alt={`${currentPuzzle.name} reference`}
                  className="w-full max-w-[280px] rounded-lg shadow-md"
                />
                <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div
                      key={i}
                      className="border border-white/20"
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3 text-center">
                {currentPuzzle.name}
              </p>
            </Card>
          </div>

          {/* Puzzle Canvas */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              className="border-2 border-dashed border-muted-foreground bg-muted/20 rounded-2xl"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
            
            {/* Placed pieces overlay */}
            {pieces.filter(p => p.placed).map(piece => (
              <img
                key={piece.id}
                src={piece.imageData}
                alt={`Piece ${piece.id}`}
                className="absolute pointer-events-none"
                style={{
                  left: piece.currentX,
                  top: piece.currentY,
                  width: PIECE_SIZE,
                  height: PIECE_SIZE
                }}
              />
            ))}
          </div>

          {/* Pieces Panel */}
          <div className="min-w-[300px]">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Puzzle Pieces</h3>
              <div className="grid grid-cols-2 gap-4 max-h-[480px] overflow-y-auto">
                {pieces.filter(p => !p.placed).map(piece => (
                  <img
                    key={piece.id}
                    src={piece.imageData}
                    alt={`Piece ${piece.id}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, piece.id)}
                    className="cursor-grab active:cursor-grabbing hover:shadow-lg transition-shadow rounded-lg"
                    style={{ width: 80, height: 80 }}
                  />
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Completion Modal */}
        {isComplete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="p-8 text-center max-w-md">
              <div className="mb-6">
                <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Puzzle Complete!</h2>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-warning" />
                  <span className="font-semibold">+{currentPuzzle.points} Eco Points</span>
                </div>
              </div>
              
              <div className="bg-muted rounded-2xl p-4 mb-6">
                <p className="text-sm font-medium">{currentPuzzle.fact}</p>
              </div>
              
              <Button onClick={onBack} className="w-full">
                Continue Learning
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};