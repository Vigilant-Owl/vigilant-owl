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
          password_hash: string;
          full_name: string;
          user_type: "parent" | "child";
          phone_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["users"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      parent_child_relationships: {
        Row: {
          id: string;
          parent_id: string;
          child_id: string;
          status: "active" | "inactive" | "pending";
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["parent_child_relationships"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["parent_child_relationships"]["Insert"]
        >;
      };
      whatsapp_groups: {
        Row: {
          id: string;
          group_id: string;
          group_name: string;
          group_description: string | null;
          member_count: number;
          is_monitored: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["whatsapp_groups"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["whatsapp_groups"]["Insert"]
        >;
      };
      messages: {
        Row: {
          id: string;
          group_id: string;
          sender_id: string;
          message_type: "text" | "image" | "video" | "audio" | "document";
          content: string | null;
          media_url: string | null;
          timestamp: string;
          is_deleted: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["messages"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
      };
      message_analysis: {
        Row: {
          id: string;
          message_id: string;
          sentiment_score: number | null;
          tone_categories: Json;
          flags: Json;
          confidence_score: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["message_analysis"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["message_analysis"]["Insert"]
        >;
      };
      group_analysis_reports: {
        Row: {
          id: string;
          group_id: string;
          report_period_start: string;
          report_period_end: string;
          overall_sentiment_score: number | null;
          message_count: number;
          active_participants_count: number;
          tone_summary: Json;
          flags_summary: Json;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["group_analysis_reports"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["group_analysis_reports"]["Insert"]
        >;
      };
      notification_settings: {
        Row: {
          id: string;
          parent_id: string;
          notification_type: string;
          is_enabled: boolean;
          threshold_value: number | null;
          notification_method: "email" | "sms" | "push";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["notification_settings"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["notification_settings"]["Insert"]
        >;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
