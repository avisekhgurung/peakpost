import type {
  IGAccount,
  PeakSlot,
  PostAnalytic,
  ScheduledPost,
  User,
} from "@/types";

export const mockUser: User = {
  email: "avisekh@peakpost.app",
  name: "Avisekh Gurung",
  plan: "free",
  avatar: "https://i.pravatar.cc/120?img=12",
};

export const mockAccount: IGAccount = {
  username: "avisekh.creates",
  fullName: "Avisekh — design + dev",
  followers: 12_843,
  following: 412,
  postsCount: 187,
  profilePicture: "https://i.pravatar.cc/200?img=12",
};

// Top 3 non-adjacent peak slots
export const mockSlots: PeakSlot[] = [
  {
    day: 3,
    hour: 20,
    minute: 45,
    score: 94,
    audienceOnlinePct: 87,
    reason: "87% of your followers are online and your last 4 Wednesday posts averaged 4.9× reach.",
  },
  {
    day: 5,
    hour: 18,
    minute: 30,
    score: 88,
    audienceOnlinePct: 79,
    reason: "Friday evenings drive your highest save rate (12.4%) for aesthetic content.",
  },
  {
    day: 0,
    hour: 11,
    minute: 0,
    score: 81,
    audienceOnlinePct: 71,
    reason: "Sunday late-morning posts get 2.3× more shares than your weekly average.",
  },
];

// 24x7 audience heatmap (7 days × 24 hours of audience-online %)
export const mockAudienceHeatmap: number[][] = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => {
    const peak = day === 3 ? 20 : day === 5 ? 18 : day === 0 ? 11 : 19;
    const dist = Math.abs(hour - peak);
    const base = Math.max(8, 90 - dist * 7 - Math.abs(day - 3) * 2);
    return Math.min(95, Math.round(base + (Math.sin(day + hour) * 6)));
  })
);

const thumbs = [
  "https://images.unsplash.com/photo-1503066211613-c17ebc9daef0?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1488376739366-2c00ff916ff7?w=400&h=400&fit=crop",
];

export const mockScheduled: ScheduledPost[] = [
  {
    id: "sp_1",
    caption: "morning coffee + sunday slowness ☕️ which mug should i use today?",
    mediaType: "REELS",
    thumbnailUrl: thumbs[0],
    contentType: "aesthetic",
    trendingAudio: true,
    withFace: false,
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 22).toISOString(),
    status: "pending",
    autoPublish: false,
    estimatedReach: 4900,
  },
  {
    id: "sp_2",
    caption: "3 lightroom presets I use on every single reel",
    mediaType: "REELS",
    thumbnailUrl: thumbs[1],
    contentType: "tutorial",
    trendingAudio: false,
    withFace: true,
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 50).toISOString(),
    status: "pending",
    autoPublish: false,
    estimatedReach: 3200,
  },
  {
    id: "sp_3",
    caption: "POV: monsoon hits the himalayas at 4am",
    mediaType: "REELS",
    thumbnailUrl: thumbs[2],
    contentType: "aesthetic",
    trendingAudio: true,
    withFace: false,
    scheduledAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    status: "published",
    autoPublish: true,
    estimatedReach: 6100,
  },
];

const captions = [
  "morning coffee shot",
  "behind the lens — kalimpong",
  "preset pack 04",
  "trying that trending audio",
  "sunday reset routine",
  "1 minute travel edit",
  "color grading explained",
  "hot take on phone vs camera",
  "POV: golden hour in nepal",
  "what's in my edit bag",
];

export const mockAnalytics: PostAnalytic[] = Array.from({ length: 30 }, (_, i) => {
  const daysAgo = i + 1;
  const isAesthetic = i % 3 === 0;
  const trending = i % 4 !== 0;
  const baseReach = trending ? 4200 : 1800;
  const reach = Math.round(baseReach + Math.random() * 3000);
  return {
    id: `pa_${i}`,
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * daysAgo).toISOString(),
    thumbnailUrl: thumbs[i % thumbs.length],
    caption: captions[i % captions.length],
    reach,
    impressions: Math.round(reach * 1.4),
    saves: Math.round(reach * (isAesthetic ? 0.12 : 0.04)),
    shares: Math.round(reach * 0.03),
    likes: Math.round(reach * 0.18),
    comments: Math.round(reach * 0.018),
    contentType: (
      ["aesthetic", "tutorial", "talking", "dance", "funny", "other"] as const
    )[i % 6],
    trendingAudio: trending,
  };
});

export const contentTypes = [
  { id: "aesthetic", label: "Aesthetic", emoji: "🎨" },
  { id: "tutorial", label: "Tutorial", emoji: "📚" },
  { id: "dance", label: "Dance", emoji: "💃" },
  { id: "talking", label: "Talking", emoji: "🎙️" },
  { id: "funny", label: "Funny", emoji: "😂" },
  { id: "other", label: "Other", emoji: "✨" },
] as const;
