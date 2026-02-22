export const MOCK_ANALYTICS = {
  overview: {
    channelName: "CryptoWithYC",
    totalTipsReceived: 1847,
    totalSolEarned: 284.72,
    totalTimeSpentSeconds: 892400,
    highestTipReceived: 8.5,
    totalViewsOnTippedVideos: 924300,
    totalLikesOnTippedVideos: 41200,
    averageTipAmount: 0.154,
  },
  videoBreakdown: [
    { videoId: "v1", videoLink: "#", title: "Solana DeFi Deep Dive", views: 184000, likes: 12400, tipsCount: 342, totalSolEarned: 52.4, totalTimeSpent: 3820000, topTip: 8.5, memos: [] },
    { videoId: "v2", videoLink: "#", title: "Yield Farming Basics", views: 97000, likes: 8100, tipsCount: 210, totalSolEarned: 31.1, totalTimeSpent: 2210000, topTip: 4.0, memos: [] },
    { videoId: "v3", videoLink: "#", title: "How Liquidity Pools Work", views: 143000, likes: 9800, tipsCount: 185, totalSolEarned: 26.8, totalTimeSpent: 1890000, topTip: 3.2, memos: [] },
  ],
  rawTips: [
    { id: "1", created_at: new Date(Date.now() - 120000).toISOString(),   tipper_address: "7xKpQmNvLtR2uWsY", creator_address: "abc", sol_amount: 2.5,  memo: "dude this video saved me so much time honestly",    duration_spent: 872  },
    { id: "2", created_at: new Date(Date.now() - 1080000).toISOString(),  tipper_address: "4mTrBcZpXqNvLsK8", creator_address: "abc", sol_amount: 1.0,  memo: "been waiting for this breakdown for weeks lol",    duration_spent: 1203 },
    { id: "3", created_at: new Date(Date.now() - 2040000).toISOString(),  tipper_address: "9nHjWdQrPfMvKtY3", creator_address: "abc", sol_amount: 0.5,  memo: null,                                                duration_spent: 432  },
    { id: "4", created_at: new Date(Date.now() - 3600000).toISOString(),  tipper_address: "2sVwXcLmBqZpNkR6", creator_address: "abc", sol_amount: 3.2,  memo: "best defi content out there no cap 🔥",             duration_spent: 2100 },
    { id: "5", created_at: new Date(Date.now() - 7200000).toISOString(),  tipper_address: "5fRtYgNmKpBvQsL1", creator_address: "abc", sol_amount: 0.75, memo: "keep it up fr",                                      duration_spent: 678  },
  ],
  wordCloud: [],
};

// Synthetic timeline — replace with real per-video data from videoBreakdown.totalTimeSpent
export const TIMELINE_DATA = Array.from({ length: 48 }, (_, i) => ({
  second: i * 40,
  tips: Math.round(Math.max(0, Math.sin(i / 5) * 18 + Math.sin(i / 2.2) * 8 + 12 + (Math.random() - 0.5) * 6)),
  sol:  Math.max(0, +(Math.sin(i / 6 + 1) * 1.2 + 0.8 + (Math.random() - 0.5) * 0.4).toFixed(2)),
}));

// Weekly SOL totals — derive from rawTips grouped by day in production
export const WEEKLY = [
  { day: "Mon", sol: 18.4 }, { day: "Tue", sol: 12.1 }, { day: "Wed", sol: 31.7 },
  { day: "Thu", sol: 26.3 }, { day: "Fri", sol: 44.5 }, { day: "Sat", sol: 52.1 }, { day: "Sun", sol: 27.8 },
];

