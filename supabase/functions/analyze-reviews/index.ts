import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Topic {
  name: string;
  type: string;
  keywords?: string[];
  count?: number;
  isNew?: boolean;
}

interface Review {
  date: string;
  text: string;
  rating: number;
  topics: string[];
}

const SEED_TOPICS: Topic[] = [
  { name: "Delivery delay", type: "issue", keywords: ["late", "delay", "waiting", "hours", "slow delivery"] },
  { name: "Food quality issues", type: "issue", keywords: ["cold", "stale", "spilled", "soggy", "bad quality"] },
  { name: "Delivery partner behavior", type: "issue", keywords: ["rude", "impolite", "behavior", "unprofessional"] },
  { name: "Wrong order", type: "issue", keywords: ["wrong order", "wrong item", "missing item", "incomplete"] },
  { name: "App crashes", type: "issue", keywords: ["crash", "not working", "bug", "freeze", "hang"] },
  { name: "GPS/Location issues", type: "issue", keywords: ["gps", "location", "address", "map", "navigation"] },
  { name: "Payment issues", type: "issue", keywords: ["payment", "refund", "charged", "money", "transaction"] },
  { name: "Poor customer support", type: "issue", keywords: ["support", "help", "customer care", "no response"] },
  { name: "High prices", type: "feedback", keywords: ["expensive", "price", "costly", "charges", "overpriced"] },
  { name: "Good delivery experience", type: "feedback", keywords: ["fast delivery", "on time", "quick"] },
  { name: "Great food quality", type: "feedback", keywords: ["delicious", "tasty", "fresh", "good food"] },
  { name: "Request: More restaurants", type: "request", keywords: ["add restaurant", "more options", "include"] },
  { name: "Request: Better offers", type: "request", keywords: ["discount", "offer", "coupon", "promo"] },
];

function generateMockReviews(appId: string, startDate: Date, endDate: Date): Review[] {
  const reviews: Review[] = [];
  const templates = [
    { text: "Delivery was very late today, waited for 2 hours", topics: ["Delivery delay"] },
    { text: "Food arrived cold and stale", topics: ["Food quality issues"] },
    { text: "Delivery guy was very rude", topics: ["Delivery partner behavior"] },
    { text: "Got wrong order", topics: ["Wrong order"] },
    { text: "App keeps crashing", topics: ["App crashes"] },
    { text: "GPS shows wrong location", topics: ["GPS/Location issues"] },
    { text: "Payment failed but money deducted", topics: ["Payment issues"] },
    { text: "Customer support is useless", topics: ["Poor customer support"] },
    { text: "Prices have increased too much", topics: ["High prices"] },
    { text: "Amazing fast delivery!", topics: ["Good delivery experience"] },
    { text: "Food was delicious and fresh", topics: ["Great food quality"] },
    { text: "Please add more restaurants", topics: ["Request: More restaurants"] },
    { text: "Need better discount offers", topics: ["Request: Better offers"] },
  ];

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const numReviews = Math.floor(Math.random() * 50) + 10;
    
    for (let i = 0; i < numReviews; i++) {
      const template = templates[Math.floor(Math.random() * templates.length)];
      reviews.push({ date: dateStr, text: template.text, rating: Math.floor(Math.random() * 5) + 1, topics: template.topics });
    }
  }
  return reviews;
}

function extractTopicsRuleBased(reviews: Review[], existingTopics: Topic[]): Topic[] {
  const topicCounts: Record<string, Topic & { count: number }> = {};
  
  for (const topic of existingTopics) {
    topicCounts[topic.name] = { ...topic, count: 0 };
  }
  
  for (const review of reviews) {
    const text = review.text.toLowerCase();
    for (const topic of existingTopics) {
      for (const keyword of topic.keywords || []) {
        if (text.includes(keyword.toLowerCase())) {
          topicCounts[topic.name].count++;
          break;
        }
      }
    }
  }
  
  return Object.values(topicCounts).filter(t => t.count > 0).map(t => ({ name: t.name, type: t.type, count: t.count, isNew: false }));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { appId, targetDate } = await req.json();
    
    if (!appId || !targetDate) {
      return new Response(JSON.stringify({ error: "appId and targetDate are required" }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const endDate = new Date(targetDate);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 30);

    const dates: string[] = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
    }

    const allReviews = generateMockReviews(appId, startDate, endDate);
    const reviewsByDate: Record<string, Review[]> = {};
    for (const date of dates) {
      reviewsByDate[date] = allReviews.filter(r => r.date === date);
    }

    const topicMap = new Map<string, { name: string; type: string; values: number[] }>();
    for (const topic of SEED_TOPICS) {
      topicMap.set(topic.name, { name: topic.name, type: topic.type, values: new Array(dates.length).fill(0) });
    }

    for (let i = 0; i < dates.length; i++) {
      const dayReviews = reviewsByDate[dates[i]] || [];
      if (dayReviews.length === 0) continue;
      const extracted = extractTopicsRuleBased(dayReviews, SEED_TOPICS);
      for (const topic of extracted) {
        if (topicMap.has(topic.name)) {
          topicMap.get(topic.name)!.values[i] = topic.count || 0;
        }
      }
    }

    const topics = Array.from(topicMap.values()).filter(t => t.values.some(v => v > 0)).sort((a, b) => b.values.reduce((x, y) => x + y, 0) - a.values.reduce((x, y) => x + y, 0));
    const matrix = topics.map(t => t.values);
    const appName = appId.split('.').pop() || appId;

    return new Response(JSON.stringify({ appName: appName.charAt(0).toUpperCase() + appName.slice(1), appId, dates, topics: topics.map(t => ({ name: t.name, type: t.type })), matrix, totalReviews: allReviews.length, analyzedDays: dates.length }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Analysis failed" }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
