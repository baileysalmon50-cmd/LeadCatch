export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          bay: number
          created_at: string
          created_source: Database["public"]["Enums"]["appointment_source"]
          customer_email: string | null
          customer_name: string
          customer_phone: string
          ends_at: string
          id: string
          lead_id: string | null
          notes: string | null
          payment_link_url: string | null
          payment_status: string | null
          service_name: string
          service_type_id: string | null
          starts_at: string
          status: Database["public"]["Enums"]["appointment_status"]
          updated_at: string
          user_id: string
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_year: string | null
        }
        Insert: {
          bay?: number
          created_at?: string
          created_source?: Database["public"]["Enums"]["appointment_source"]
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          ends_at: string
          id?: string
          lead_id?: string | null
          notes?: string | null
          payment_link_url?: string | null
          payment_status?: string | null
          service_name: string
          service_type_id?: string | null
          starts_at: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
          user_id: string
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_year?: string | null
        }
        Update: {
          bay?: number
          created_at?: string
          created_source?: Database["public"]["Enums"]["appointment_source"]
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          ends_at?: string
          id?: string
          lead_id?: string | null
          notes?: string | null
          payment_link_url?: string | null
          payment_status?: string | null
          service_name?: string
          service_type_id?: string | null
          starts_at?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
          user_id?: string
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_type_id_fkey"
            columns: ["service_type_id"]
            isOneToOne: false
            referencedRelation: "service_types"
            referencedColumns: ["id"]
          },
        ]
      }
      business_hours: {
        Row: {
          break_end: string | null
          break_start: string | null
          close_time: string | null
          day_of_week: number
          id: string
          is_open: boolean
          open_time: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          break_end?: string | null
          break_start?: string | null
          close_time?: string | null
          day_of_week: number
          id?: string
          is_open?: boolean
          open_time?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          break_end?: string | null
          break_start?: string | null
          close_time?: string | null
          day_of_week?: number
          id?: string
          is_open?: boolean
          open_time?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          business_need: string | null
          call_id: string | null
          callback_time: string | null
          created_at: string
          email: string | null
          id: string
          locked: boolean
          name: string
          notes: string | null
          phone: string | null
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          business_need?: string | null
          call_id?: string | null
          callback_time?: string | null
          created_at?: string
          email?: string | null
          id?: string
          locked?: boolean
          name?: string
          notes?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          business_need?: string | null
          call_id?: string | null
          callback_time?: string | null
          created_at?: string
          email?: string | null
          id?: string
          locked?: boolean
          name?: string
          notes?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          assigned_phone: string
          business_name: string
          created_at: string
          email: string
          forward_phone: string | null
          id: string
          onboarded: boolean
          timezone: string
          updated_at: string
        }
        Insert: {
          assigned_phone: string
          business_name?: string
          created_at?: string
          email: string
          forward_phone?: string | null
          id: string
          onboarded?: boolean
          timezone?: string
          updated_at?: string
        }
        Update: {
          assigned_phone?: string
          business_name?: string
          created_at?: string
          email?: string
          forward_phone?: string | null
          id?: string
          onboarded?: boolean
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      service_types: {
        Row: {
          created_at: string
          duration_minutes: number
          id: string
          is_active: boolean
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_minutes: number
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          ai_greeting: string
          bays_count: number
          callback_hours_end: string
          callback_hours_start: string
          notifications_email: boolean
          notifications_slack: boolean
          notifications_sms: boolean
          notifications_sms_phone: string | null
          timezone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_greeting?: string
          bays_count?: number
          callback_hours_end?: string
          callback_hours_start?: string
          notifications_email?: boolean
          notifications_slack?: boolean
          notifications_sms?: boolean
          notifications_sms_phone?: string | null
          timezone?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_greeting?: string
          bays_count?: number
          callback_hours_end?: string
          callback_hours_start?: string
          notifications_email?: boolean
          notifications_slack?: boolean
          notifications_sms?: boolean
          notifications_sms_phone?: string | null
          timezone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          billing_date: string | null
          call_period_start: string | null
          cancel_at_period_end: boolean
          current_period_end: string | null
          current_period_start: string | null
          environment: string | null
          plan: Database["public"]["Enums"]["plan_tier"]
          price_id: string | null
          product_id: string | null
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_date?: string | null
          call_period_start?: string | null
          cancel_at_period_end?: boolean
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string | null
          plan?: Database["public"]["Enums"]["plan_tier"]
          price_id?: string | null
          product_id?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_date?: string | null
          call_period_start?: string | null
          cancel_at_period_end?: boolean
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string | null
          plan?: Database["public"]["Enums"]["plan_tier"]
          price_id?: string | null
          product_id?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_assigned_phone: { Args: never; Returns: string }
    }
    Enums: {
      appointment_source: "ai_agent" | "manual"
      appointment_status:
        | "new"
        | "confirmed"
        | "checked_in"
        | "in_service"
        | "completed"
        | "cancelled"
        | "no_show"
      lead_status: "new" | "called" | "converted"
      plan_tier: "free" | "pro" | "business"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      appointment_source: ["ai_agent", "manual"],
      appointment_status: [
        "new",
        "confirmed",
        "checked_in",
        "in_service",
        "completed",
        "cancelled",
        "no_show",
      ],
      lead_status: ["new", "called", "converted"],
      plan_tier: ["free", "pro", "business"],
    },
  },
} as const
