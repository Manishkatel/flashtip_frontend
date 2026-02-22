// Type definitions for the FlashTip Dashboard

export interface AnalyticsData {
  overview: {
    channelName: string;
    totalTipsReceived: number;
    totalSolEarned: number;
    totalTimeSpentSeconds: number;
    highestTipReceived: number;
    totalViewsOnTippedVideos: number;
    totalLikesOnTippedVideos: number;
    averageTipAmount: number;
  };
  videoBreakdown: Array<{
    videoId: string;
    videoLink: string;
    title: string;
    views: number;
    likes: number;
    tipsCount: number;
    totalSolEarned: number;
    totalTimeSpent: number;
    topTip: number;
    memos: any[];
  }>;
  rawTips: Array<{
    id: string;
    created_at: string;
    tipper_address: string;
    creator_address: string;
    sol_amount: number | string;
    memo: string | null;
    duration_spent: number;
  }>;
  wordCloud: any[];
}

export interface AuthContextType {
  isLoggedIn: boolean;
  channelName: string;
  analyticsData: AnalyticsData | null;
  logout: () => void;
}

export interface Tip {
  id: string;
  created_at: string;
  tipper_address: string;
  creator_address: string;
  sol_amount: number | string;
  memo: string | null;
  duration_spent: number;
}

export interface Video {
  videoId: string;
  videoLink: string;
  title: string;
  views: number;
  likes: number;
  tipsCount: number;
  totalSolEarned: number;
  totalTimeSpent: number;
  topTip: number;
  memos: any[];
}

export interface TimelineDataPoint {
  second: number;
  tips: number;
  sol: number;
}

export interface WeeklyDataPoint {
  day: string;
  sol: number;
}

export interface Message {
  role: "user" | "ai";
  content: string;
}
