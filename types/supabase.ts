// Hand-written types matching supabase/migrations/001_init.sql
// Regenerate with `npx supabase gen types typescript` once Supabase CLI is set up.

export type UserPlan = 'free' | 'pro';
export type PostStatus = 'pending' | 'published' | 'failed' | 'cancelled';
export type MediaType = 'IMAGE' | 'VIDEO' | 'REELS';
export type ContentType =
  | 'aesthetic'
  | 'tutorial'
  | 'dance'
  | 'talking'
  | 'funny'
  | 'other';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          plan: UserPlan;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          plan?: UserPlan;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          plan?: UserPlan;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      ig_accounts: {
        Row: {
          id: string;
          user_id: string;
          ig_user_id: string;
          username: string;
          access_token_enc: string;
          token_expires_at: string | null;
          profile_picture_url: string | null;
          followers_count: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          ig_user_id: string;
          username: string;
          access_token_enc: string;
          token_expires_at?: string | null;
          profile_picture_url?: string | null;
          followers_count?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          ig_user_id?: string;
          username?: string;
          access_token_enc?: string;
          token_expires_at?: string | null;
          profile_picture_url?: string | null;
          followers_count?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
      scheduled_posts: {
        Row: {
          id: string;
          user_id: string;
          ig_account_id: string;
          caption: string | null;
          storage_path: string | null;
          public_url: string | null;
          media_type: MediaType;
          content_type: ContentType | null;
          trending_audio: boolean;
          with_face: boolean;
          scheduled_at: string;
          status: PostStatus;
          auto_publish: boolean;
          ig_post_id: string | null;
          error_message: string | null;
          reminder_sent: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          ig_account_id: string;
          caption?: string | null;
          storage_path?: string | null;
          public_url?: string | null;
          media_type: MediaType;
          content_type?: ContentType | null;
          trending_audio?: boolean;
          with_face?: boolean;
          scheduled_at: string;
          status?: PostStatus;
          auto_publish?: boolean;
          ig_post_id?: string | null;
          error_message?: string | null;
          reminder_sent?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          ig_account_id?: string;
          caption?: string | null;
          storage_path?: string | null;
          public_url?: string | null;
          media_type?: MediaType;
          content_type?: ContentType | null;
          trending_audio?: boolean;
          with_face?: boolean;
          scheduled_at?: string;
          status?: PostStatus;
          auto_publish?: boolean;
          ig_post_id?: string | null;
          error_message?: string | null;
          reminder_sent?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      post_analytics: {
        Row: {
          id: string;
          ig_account_id: string;
          ig_post_id: string;
          posted_at: string;
          reach: number;
          impressions: number;
          saves: number;
          shares: number;
          likes: number;
          comments: number;
          media_type: MediaType | null;
          content_type: ContentType | null;
          trending_audio: boolean;
          hashtag_count: number;
          synced_at: string;
        };
        Insert: {
          id?: string;
          ig_account_id: string;
          ig_post_id: string;
          posted_at: string;
          reach?: number;
          impressions?: number;
          saves?: number;
          shares?: number;
          likes?: number;
          comments?: number;
          media_type?: MediaType | null;
          content_type?: ContentType | null;
          trending_audio?: boolean;
          hashtag_count?: number;
          synced_at?: string;
        };
        Update: {
          id?: string;
          ig_account_id?: string;
          ig_post_id?: string;
          posted_at?: string;
          reach?: number;
          impressions?: number;
          saves?: number;
          shares?: number;
          likes?: number;
          comments?: number;
          media_type?: MediaType | null;
          content_type?: ContentType | null;
          trending_audio?: boolean;
          hashtag_count?: number;
          synced_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      user_plan: UserPlan;
      post_status: PostStatus;
      media_type: MediaType;
      content_type: ContentType;
    };
    CompositeTypes: { [_ in never]: never };
  };
}
