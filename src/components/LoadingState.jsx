import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, Sparkles, TrendingUp, Loader2, CheckCircle } from "lucide-react";

const LoadingState = ({ progress }) => {
  const { current, total, status } = progress;
  const percentage = total > 0 ? (current / total) * 100 : 0;

  const steps = [
    { id: 1, label: "Fetching Reviews", icon: Loader2, done: current > 0 },
    { id: 2, label: "AI Extraction", icon: Brain, done: percentage > 33 },
    { id: 3, label: "Consolidating", icon: TrendingUp, done: percentage > 66 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Main Loading Card */}
      <Card className="glass-card overflow-hidden">
        <CardContent className="py-10">
          <div className="flex flex-col items-center text-center max-w-md mx-auto">
            {/* Animated Brain Icon */}
            <div className="relative mb-6">
              <div className="p-5 rounded-2xl bg-primary/10 nvidia-glow">
                <Brain className="h-10 w-10 text-primary animate-pulse-slow" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-5 w-5 text-primary animate-bounce" />
              </div>
            </div>

            <h3 className="text-xl font-heading font-bold text-foreground mb-2">
              AI Agent Processing
            </h3>
            
            <p className="text-sm text-muted-foreground mb-8">
              {status || "Analyzing reviews and extracting topics..."}
            </p>

            {/* Progress Section */}
            <div className="w-full space-y-3">
              <div className="relative">
                <Progress value={percentage} className="h-3 bg-secondary" />
                <div 
                  className="absolute top-0 left-0 h-3 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${percentage}%`,
                    background: 'linear-gradient(90deg, hsl(83 100% 40%), hsl(83 100% 55%))',
                    boxShadow: '0 0 10px hsl(83 100% 45% / 0.5)'
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>Day {current} of {total}</span>
                <span className="text-primary font-semibold">{Math.round(percentage)}%</span>
              </div>
            </div>

            {/* Step Indicators */}
            <div className="mt-10 grid grid-cols-3 gap-4 w-full">
              {steps.map((step, index) => {
                const Icon = step.done ? CheckCircle : step.icon;
                const isActive = !step.done && (index === 0 || steps[index - 1].done);
                
                return (
                  <div 
                    key={step.id}
                    className={`flex flex-col items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      step.done 
                        ? 'bg-primary/10' 
                        : isActive 
                          ? 'bg-secondary' 
                          : 'bg-muted/50'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl transition-all duration-300 ${
                      step.done 
                        ? 'bg-primary text-primary-foreground nvidia-glow' 
                        : isActive
                          ? 'bg-secondary-foreground/10 text-foreground'
                          : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon 
                        className={`h-5 w-5 ${
                          isActive && !step.done ? 'animate-spin' : ''
                        }`} 
                      />
                    </div>
                    <span className={`text-xs font-medium ${
                      step.done ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skeleton Preview */}
      <Card className="glass-card overflow-hidden">
        <CardContent className="py-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-48 skeleton-shimmer" />
              <Skeleton className="h-8 w-24 skeleton-shimmer" />
            </div>
            
            {/* Table Skeleton */}
            <div className="space-y-3">
              <div className="flex gap-4">
                <Skeleton className="h-10 w-full skeleton-shimmer" />
              </div>
              {[1, 2, 3, 4, 5].map((row) => (
                <div key={row} className="flex gap-4" style={{ animationDelay: `${row * 0.1}s` }}>
                  <Skeleton className="h-12 w-1/4 skeleton-shimmer" />
                  <Skeleton className="h-12 w-1/6 skeleton-shimmer" />
                  <Skeleton className="h-12 w-1/6 skeleton-shimmer" />
                  <Skeleton className="h-12 w-1/6 skeleton-shimmer" />
                  <Skeleton className="h-12 w-1/6 skeleton-shimmer" />
                  <Skeleton className="h-12 w-1/6 skeleton-shimmer" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingState;