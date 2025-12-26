import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, Sparkles, TrendingUp, Loader2 } from "lucide-react";

const LoadingState = ({ progress }) => {
  const { current, total, status } = progress;
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <Card className="glass-card">
      <CardContent className="py-12">
        <div className="flex flex-col items-center text-center max-w-md mx-auto">
          <div className="relative mb-6">
            <div className="p-4 rounded-full bg-primary/10">
              <Brain className="h-8 w-8 text-primary animate-pulse-slow" />
            </div>
            <div className="absolute -top-1 -right-1">
              <Sparkles className="h-5 w-5 text-accent animate-bounce" />
            </div>
          </div>

          <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
            AI Agent Processing
          </h3>
          
          <p className="text-sm text-muted-foreground mb-6">
            {status || "Analyzing reviews and extracting topics..."}
          </p>

          <div className="w-full space-y-3">
            <Progress value={percentage} className="h-2" />
            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>Day {current} of {total}</span>
              <span>{Math.round(percentage)}%</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-6 w-full">
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 rounded-lg bg-secondary">
                <Loader2 className="h-4 w-4 text-secondary-foreground animate-spin" />
              </div>
              <span className="text-xs text-muted-foreground">Fetching</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 rounded-lg bg-secondary">
                <Brain className="h-4 w-4 text-secondary-foreground" />
              </div>
              <span className="text-xs text-muted-foreground">Extracting</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 rounded-lg bg-secondary">
                <TrendingUp className="h-4 w-4 text-secondary-foreground" />
              </div>
              <span className="text-xs text-muted-foreground">Consolidating</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingState;
