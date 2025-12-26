import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, Search, ArrowUpDown, TrendingUp, TrendingDown, AlertCircle, MessageSquare, Lightbulb } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

const getTypeIcon = (type) => {
  switch (type) {
    case "issue": return AlertCircle;
    case "request": return Lightbulb;
    default: return MessageSquare;
  }
};

const getTypeColor = (type) => {
  switch (type) {
    case "issue": return "bg-destructive/10 text-destructive border-destructive/20";
    case "request": return "bg-info/10 text-info border-info/20";
    default: return "bg-success/10 text-success border-success/20";
  }
};

const SingleDayView = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("count");
  const [sortOrder, setSortOrder] = useState("desc");

  const { topics, matrix, appName, dates } = data || {};
  const targetDate = dates?.[0];

  const processedTopics = useMemo(() => {
    if (!topics || !matrix) return [];

    return topics.map((topic, idx) => ({
      ...topic,
      count: matrix[idx]?.[0] || 0,
    }));
  }, [topics, matrix]);

  const filteredAndSortedTopics = useMemo(() => {
    let filtered = processedTopics;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((t) => t.name.toLowerCase().includes(term));
    }

    filtered.sort((a, b) => {
      const aVal = sortBy === "count" ? a.count : a.name;
      const bVal = sortBy === "count" ? b.count : b.name;
      if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    return filtered;
  }, [processedTopics, searchTerm, sortBy, sortOrder]);

  const totalMentions = useMemo(() => {
    return filteredAndSortedTopics.reduce((sum, t) => sum + t.count, 0);
  }, [filteredAndSortedTopics]);

  const handleExport = () => {
    if (!filteredAndSortedTopics.length) return;

    const headers = ["Topic", "Type", "Count"];
    const rows = filteredAndSortedTopics.map((t) => [t.name, t.type, t.count]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `review-analysis-${targetDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  if (!data || !topics?.length) {
    return (
      <Card className="glass-card">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No data available for this date</p>
        </CardContent>
      </Card>
    );
  }

  // Group topics by type
  const issueTopics = filteredAndSortedTopics.filter(t => t.type === "issue");
  const requestTopics = filteredAndSortedTopics.filter(t => t.type === "request");
  const feedbackTopics = filteredAndSortedTopics.filter(t => t.type === "feedback");

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="glass-card hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/20 backdrop-blur-md border border-primary/30">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono">{totalMentions}</p>
                <p className="text-xs text-muted-foreground">Total Mentions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card hover:border-destructive/30 transition-all duration-300 hover:-translate-y-0.5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-destructive/20 backdrop-blur-md border border-destructive/30">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono">{issueTopics.length}</p>
                <p className="text-xs text-muted-foreground">Issues Found</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card hover:border-info/30 transition-all duration-300 hover:-translate-y-0.5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-info/20 backdrop-blur-md border border-info/30">
                <Lightbulb className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono">{requestTopics.length}</p>
                <p className="text-xs text-muted-foreground">Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card hover:border-success/30 transition-all duration-300 hover:-translate-y-0.5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-success/20 backdrop-blur-md border border-success/30">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono">{feedbackTopics.length}</p>
                <p className="text-xs text-muted-foreground">Feedback</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card className="glass-card overflow-hidden">
        <CardHeader className="border-b border-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-heading">
                Single Day Analysis
                {appName && <span className="text-muted-foreground font-normal"> — {appName}</span>}
              </CardTitle>
              <CardDescription className="mt-1 font-mono text-xs">
                {targetDate && format(parseISO(targetDate), "EEEE, MMMM d, yyyy")} • {topics.length} topics • {data.totalReviews} reviews
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-48 text-sm"
                />
              </div>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th className="min-w-[250px]">
                    <button
                      onClick={() => toggleSort("name")}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      Topic
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="w-24">Type</th>
                  <th className="w-32">
                    <button
                      onClick={() => toggleSort("count")}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      Mentions
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="w-48">Distribution</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedTopics.map((topic) => {
                  const Icon = getTypeIcon(topic.type);
                  const percentage = totalMentions > 0 ? (topic.count / totalMentions) * 100 : 0;
                  
                  return (
                    <tr key={topic.name} className="group">
                      <td className="font-medium">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          {topic.name}
                        </div>
                      </td>
                      <td>
                        <span className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider border",
                          getTypeColor(topic.type)
                        )}>
                          {topic.type}
                        </span>
                      </td>
                      <td className="font-mono font-semibold text-center">
                        {topic.count}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-accent rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono text-muted-foreground w-12">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-border text-xs text-muted-foreground text-center">
            Showing {filteredAndSortedTopics.length} of {topics.length} topics
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SingleDayView;
