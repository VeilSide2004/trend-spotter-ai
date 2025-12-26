import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Play, Link as LinkIcon, Info } from "lucide-react";
import { format, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const EXAMPLE_APPS = [
  { name: "Swiggy", url: "https://play.google.com/store/apps/details?id=in.swiggy.android" },
  { name: "Zomato", url: "https://play.google.com/store/apps/details?id=com.application.zomato" },
  { name: "Blinkit", url: "https://play.google.com/store/apps/details?id=com.grofers.customerapp" },
];

const InputForm = ({ onAnalyze, isLoading }) => {
  const [appUrl, setAppUrl] = useState("");
  const [targetDate, setTargetDate] = useState(new Date());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!appUrl.trim()) return;
    onAnalyze(appUrl, format(targetDate, "yyyy-MM-dd"));
  };

  const handleExampleClick = (url) => {
    setAppUrl(url);
  };

  // Limit date selection - earliest is June 1, 2024
  const minDate = new Date(2024, 5, 1);
  const maxDate = new Date();

  return (
    <Card className="glass-card">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-heading">Analyze App Reviews</CardTitle>
            <CardDescription className="mt-1">
              Enter a Google Play Store app link and target date to generate a 30-day trend analysis
            </CardDescription>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">
                The AI agent analyzes daily review batches, extracts topics, and consolidates similar issues into unified categories for accurate trend tracking.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="appUrl" className="text-sm font-medium">
                Google Play Store Link
              </Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="appUrl"
                  type="url"
                  placeholder="https://play.google.com/store/apps/details?id=..."
                  value={appUrl}
                  onChange={(e) => setAppUrl(e.target.value)}
                  className="pl-10 font-mono text-sm"
                  required
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground">Try:</span>
                {EXAMPLE_APPS.map((app) => (
                  <button
                    key={app.name}
                    type="button"
                    onClick={() => handleExampleClick(app.url)}
                    className="text-xs text-accent hover:text-accent/80 underline underline-offset-2 transition-colors"
                  >
                    {app.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Target Date (T)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-mono text-sm",
                      !targetDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {targetDate ? format(targetDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={targetDate}
                    onSelect={(date) => date && setTargetDate(date)}
                    disabled={(date) => date < minDate || date > maxDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                Report will show trends from {format(subDays(targetDate, 30), "MMM d")} to {format(targetDate, "MMM d, yyyy")}
              </p>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isLoading || !appUrl.trim()}
            className="w-full md:w-auto"
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Analyzing...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start Analysis
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default InputForm;
