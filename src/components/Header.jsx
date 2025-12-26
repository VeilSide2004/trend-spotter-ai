import { TrendingUp, Sparkles } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const Header = () => {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-heading font-bold text-foreground">
                Review Trend Analyzer
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                AI-Powered Analysis
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Powered by Agentic AI</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
