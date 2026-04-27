export type Plan = "free" | "pro";
export type MediaType = "IMAGE" | "VIDEO" | "REELS";
export type ContentType = "aesthetic" | "tutorial" | "dance" | "talking" | "funny" | "other";
export type PostStatus = "pending" | "published" | "failed" | "cancelled";

export interface PeakSlot {
  day: number; // 0-6 (Sun-Sat)
  hour: number; // 0-23
  minute: number; // 0-59
  score: number; // 0-100
  reason: string;
  audienceOnlinePct: number;
}

export interface IGAccount {
  username: string;
  fullName: string;
  followers: number;
  following: number;
  profilePicture: string;
  postsCount: number;
}

export interface ScheduledPost {
  id: string;
  caption: string;
  mediaType: MediaType;
  thumbnailUrl: string;
  contentType: ContentType;
  trendingAudio: boolean;
  withFace: boolean;
  scheduledAt: string; // ISO
  status: PostStatus;
  autoPublish: boolean;
  estimatedReach?: number;
}

export interface PostAnalytic {
  id: string;
  postedAt: string;
  thumbnailUrl: string;
  caption: string;
  reach: number;
  impressions: number;
  saves: number;
  shares: number;
  likes: number;
  comments: number;
  contentType: ContentType;
  trendingAudio: boolean;
}

export interface User {
  email: string;
  name: string;
  plan: Plan;
  avatar: string;
}
