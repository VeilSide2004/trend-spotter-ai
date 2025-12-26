import { useState, useCallback } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header.jsx";
import InputForm from "@/components/InputForm.jsx";
import TrendTable from "@/components/TrendTable.jsx";
import SingleDayView from "@/components/SingleDayView.jsx";
import LoadingState from "@/components/LoadingState.jsx";
import EmptyState from "@/components/EmptyState.jsx";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [viewMode, setViewMode] = useState("30day");
  const [progress, setProgress] = useState({ current: 0, total: 0, status: "" });
  const { toast } = useToast();

  const handleAnalyze = useCallback(async (appUrl, targetDate, mode) => {
    setIsLoading(true);
    setReportData(null);
    setViewMode(mode);
    setProgress({ current: 0, total: mode === "single" ? 1 : 31, status: "Initializing analysis..." });

    try {
      const appIdMatch = appUrl.match(/id=([^&]+)/);
      const appId = appIdMatch ? appIdMatch[1] : appUrl;

      setProgress({ current: 1, total: mode === "single" ? 1 : 31, status: "Fetching reviews..." });

      const { data, error } = await supabase.functions.invoke("analyze-reviews", {
        body: { appId, targetDate, mode }
      });

      if (error) {
        throw new Error(error.message || "Failed to analyze reviews");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setReportData(data);
      setProgress({ current: mode === "single" ? 1 : 31, total: mode === "single" ? 1 : 31, status: "Analysis complete!" });

      toast({
        title: "Analysis Complete",
        description: mode === "single" 
          ? `Found ${data.topics?.length || 0} topics for ${targetDate}`
          : `Found ${data.topics?.length || 0} topics across ${data.dates?.length || 0} days`,
      });

    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Something went wrong during analysis",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return (
    <>
      <Helmet>
        <title>Review Trend Analyzer | AI-Powered App Store Review Analysis</title>
        <meta name="description" content="Analyze Google Play Store reviews with AI. Discover trending topics, issues, and feedback patterns with intelligent topic consolidation." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8 animate-fade-in">
            <InputForm onAnalyze={handleAnalyze} isLoading={isLoading} />
          </div>

          {isLoading && (
            <div className="animate-fade-in">
              <LoadingState progress={progress} />
            </div>
          )}

          {!isLoading && !reportData && (
            <div className="animate-fade-in">
              <EmptyState />
            </div>
          )}

          {!isLoading && reportData && (
            <div className="animate-slide-up">
              {viewMode === "single" ? (
                <SingleDayView data={reportData} />
              ) : (
                <TrendTable data={reportData} />
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Index;
