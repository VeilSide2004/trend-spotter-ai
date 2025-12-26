import { useState, useCallback } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header.jsx";
import InputForm from "@/components/InputForm.jsx";
import TrendTable from "@/components/TrendTable.jsx";
import LoadingState from "@/components/LoadingState.jsx";
import EmptyState from "@/components/EmptyState.jsx";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [progress, setProgress] = useState({ current: 0, total: 0, status: "" });
  const { toast } = useToast();

  const handleAnalyze = useCallback(async (appUrl, targetDate) => {
    setIsLoading(true);
    setReportData(null);
    setProgress({ current: 0, total: 31, status: "Initializing analysis..." });

    try {
      // Extract app ID from URL
      const appIdMatch = appUrl.match(/id=([^&]+)/);
      const appId = appIdMatch ? appIdMatch[1] : appUrl;

      setProgress({ current: 1, total: 31, status: "Fetching reviews..." });

      const { data, error } = await supabase.functions.invoke("analyze-reviews", {
        body: { appId, targetDate }
      });

      if (error) {
        throw new Error(error.message || "Failed to analyze reviews");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setReportData(data);
      setProgress({ current: 31, total: 31, status: "Analysis complete!" });

      toast({
        title: "Analysis Complete",
        description: `Found ${data.topics?.length || 0} topics across ${data.dates?.length || 0} days`,
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
              <TrendTable data={reportData} />
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Index;
