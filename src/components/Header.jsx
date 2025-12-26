import { TrendingUp, Sparkles, FlaskConical } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const Header = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-heading font-semibold text-foreground">
                Review Trend Analyzer
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                AI-Powered Analysis
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/test-components">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FlaskConical className="h-4 w-4" />
                    <span className="hidden sm:inline">Test Components</span>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Test converted JSX components</p>
              </TooltipContent>
            </Tooltip>
            
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>Powered by Agentic AI</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
