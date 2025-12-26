import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, ArrowRight, Sparkles, Target, Layers } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Extraction",
    description: "Uses agentic AI to intelligently extract and categorize topics from reviews",
  },
  {
    icon: Target,
    title: "Topic Consolidation",
    description: "Deduplicates similar topics like 'delivery guy rude' and 'delivery partner impolite' into unified categories",
  },
  {
    icon: Layers,
    title: "Evolving Taxonomy",
    description: "Automatically discovers new emerging topics while maintaining consistent categorization",
  },
];

const EmptyState = () => {
  return (
    <Card className="glass-card">
      <CardContent className="py-16">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <div className="p-4 rounded-2xl bg-primary/10 backdrop-blur-md border border-primary/20 mb-6">
            <BarChart3 className="h-10 w-10 text-primary" />
          </div>

          <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
            Start Your Review Analysis
          </h3>
          
          <p className="text-muted-foreground mb-8 max-w-md">
            Enter a Google Play Store app URL and select a target date to generate a comprehensive 30-day trend report of user feedback topics.
          </p>

          <div className="grid md:grid-cols-3 gap-6 w-full mb-8">
            {features.map((feature, idx) => (
              <div
                key={feature.title}
                className="p-4 rounded-xl bg-card/40 backdrop-blur-md border border-border/30 text-left hover:bg-card/60 hover:border-primary/20 transition-all duration-300 hover:-translate-y-0.5"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="p-2.5 rounded-lg bg-primary/10 backdrop-blur-sm border border-primary/20 w-fit mb-3">
                  <feature.icon className="h-4 w-4 text-primary" />
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-1">
                  {feature.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Ready
            </span>
            <ArrowRight className="h-3 w-3" />
            <span>Enter app URL above to begin</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
