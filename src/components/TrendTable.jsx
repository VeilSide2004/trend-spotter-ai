import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, Search, ArrowUpDown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

const getHeatClass = (value, maxValue) => {
  if (value === 0) return "heat-cell-0";
  const ratio = value / maxValue;
  if (ratio >= 0.75) return "heat-cell-critical";
  if (ratio >= 0.5) return "heat-cell-high";
  if (ratio >= 0.25) return "heat-cell-medium";
  return "heat-cell-low";
};

const getTrend = (values) => {
  if (!values || values.length < 7) return "neutral";
  const recent = values.slice(-7).reduce((a, b) => a + b, 0);
  const previous = values.slice(-14, -7).reduce((a, b) => a + b, 0);
  if (recent > previous * 1.2) return "up";
  if (recent < previous * 0.8) return "down";
  return "neutral";
};

const TrendIcon = ({ trend }) => {
  if (trend === "up") return <TrendingUp className="h-3.5 w-3.5 text-destructive" />;
  if (trend === "down") return <TrendingDown className="h-3.5 w-3.5 text-success" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
};

const TopicBadge = ({ type }) => {
  const variants = {
    issue: "bg-destructive/10 text-destructive border-destructive/20",
    request: "bg-info/10 text-info border-info/20",
    feedback: "bg-success/10 text-success border-success/20",
  };
  return (
    <span className={cn("inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider border", variants[type] || variants.feedback)}>
      {type}
    </span>
  );
};

const TrendTable = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("total");
  const [sortOrder, setSortOrder] = useState("desc");

  const { topics, dates, matrix, appName } = data || {};

  const maxValue = useMemo(() => {
    if (!matrix) return 1;
    return Math.max(...matrix.flat(), 1);
  }, [matrix]);

  const processedTopics = useMemo(() => {
    if (!topics || !matrix) return [];

    return topics.map((topic, idx) => ({
      ...topic,
      values: matrix[idx] || [],
      total: (matrix[idx] || []).reduce((a, b) => a + b, 0),
      trend: getTrend(matrix[idx]),
    }));
  }, [topics, matrix]);

  const filteredAndSortedTopics = useMemo(() => {
    let filtered = processedTopics;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((t) => t.name.toLowerCase().includes(term));
    }

    filtered.sort((a, b) => {
      const aVal = sortBy === "total" ? a.total : a.name;
      const bVal = sortBy === "total" ? b.total : b.name;
      if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    return filtered;
  }, [processedTopics, searchTerm, sortBy, sortOrder]);

  const handleExport = () => {
    if (!dates || !filteredAndSortedTopics.length) return;

    const headers = ["Topic", "Type", "Total", ...dates];
    const rows = filteredAndSortedTopics.map((t) => [
      t.name,
      t.type,
      t.total,
      ...t.values,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `review-trends-${format(new Date(), "yyyy-MM-dd")}.csv`;
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
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="border-b border-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-heading">
              Trend Analysis Report
              {appName && <span className="text-muted-foreground font-normal"> — {appName}</span>}
            </CardTitle>
            <CardDescription className="mt-1 font-mono text-xs">
              {dates?.length} days • {topics.length} topics • {format(parseISO(dates[0]), "MMM d")} – {format(parseISO(dates[dates.length - 1]), "MMM d, yyyy")}
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
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-table-header min-w-[200px]">
                  <button
                    onClick={() => toggleSort("name")}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Topic
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="w-16">Type</th>
                <th className="w-16">Trend</th>
                <th className="w-16">
                  <button
                    onClick={() => toggleSort("total")}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Total
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                {dates?.map((date) => (
                  <th key={date} className="text-center w-12">
                    <div className="flex flex-col">
                      <span>{format(parseISO(date), "MMM")}</span>
                      <span className="font-semibold">{format(parseISO(date), "d")}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedTopics.map((topic, idx) => (
                <tr key={topic.name} className="group">
                  <td className="sticky left-0 z-10 bg-card group-hover:bg-table-hover font-medium">
                    {topic.name}
                  </td>
                  <td>
                    <TopicBadge type={topic.type} />
                  </td>
                  <td className="text-center">
                    <TrendIcon trend={topic.trend} />
                  </td>
                  <td className="text-center font-mono font-semibold">
                    {topic.total}
                  </td>
                  {topic.values.map((value, i) => (
                    <td key={i} className="text-center p-1">
                      <div className={cn("heat-cell", getHeatClass(value, maxValue))}>
                        {value > 0 ? value : "–"}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Heat scale:</span>
            <div className="flex items-center gap-2">
              <span className="heat-cell heat-cell-low px-2">Low</span>
              <span className="heat-cell heat-cell-medium px-2">Med</span>
              <span className="heat-cell heat-cell-high px-2">High</span>
              <span className="heat-cell heat-cell-critical px-2">Critical</span>
            </div>
          </div>
          <span>
            Showing {filteredAndSortedTopics.length} of {topics.length} topics
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendTable;
