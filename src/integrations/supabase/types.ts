export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      equipment: {
        Row: {
          brand: string | null
          environment: string | null
          id: string
          image_url: string | null
          name: string
        }
        Insert: {
          brand?: string | null
          environment?: string | null
          id: string
          image_url?: string | null
          name: string
        }
        Update: {
          brand?: string | null
          environment?: string | null
          id?: string
          image_url?: string | null
          name?: string
        }
        Relationships: []
      }
      exercise_logs: {
        Row: {
          created_at: string | null
          exercise_id: string | null
          form_feedback: string | null
          id: string
          reps_completed: number[] | null
          sets_completed: number | null
          soreness_rating: number | null
          video_url: string | null
          weights_used: number[] | null
          workout_session_id: string | null
        }
        Insert: {
          created_at?: string | null
          exercise_id?: string | null
          form_feedback?: string | null
          id?: string
          reps_completed?: number[] | null
          sets_completed?: number | null
          soreness_rating?: number | null
          video_url?: string | null
          weights_used?: number[] | null
          workout_session_id?: string | null
        }
        Update: {
          created_at?: string | null
          exercise_id?: string | null
          form_feedback?: string | null
          id?: string
          reps_completed?: number[] | null
          sets_completed?: number | null
          soreness_rating?: number | null
          video_url?: string | null
          weights_used?: number[] | null
          workout_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_logs_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_logs_workout_session_id_fkey"
            columns: ["workout_session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          created_at: string | null
          demonstration_video_url: string | null
          description: string | null
          difficulty_level: string | null
          environment: string
          equipment: string[] | null
          equipment_id: string | null
          id: string
          muscle_groups: string[] | null
          name: string
          target_muscles: string | null
        }
        Insert: {
          created_at?: string | null
          demonstration_video_url?: string | null
          description?: string | null
          difficulty_level?: string | null
          environment?: string
          equipment?: string[] | null
          equipment_id?: string | null
          id?: string
          muscle_groups?: string[] | null
          name: string
          target_muscles?: string | null
        }
        Update: {
          created_at?: string | null
          demonstration_video_url?: string | null
          description?: string | null
          difficulty_level?: string | null
          environment?: string
          equipment?: string[] | null
          equipment_id?: string | null
          id?: string
          muscle_groups?: string[] | null
          name?: string
          target_muscles?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercises_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      form_analyses: {
        Row: {
          analysis_status: string | null
          created_at: string | null
          detected_issues: string[] | null
          exercise_log_id: string | null
          feedback: string | null
          form_score: number | null
          id: string
          improvement_suggestions: string[] | null
          joint_angles: Json | null
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          analysis_status?: string | null
          created_at?: string | null
          detected_issues?: string[] | null
          exercise_log_id?: string | null
          feedback?: string | null
          form_score?: number | null
          id?: string
          improvement_suggestions?: string[] | null
          joint_angles?: Json | null
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          analysis_status?: string | null
          created_at?: string | null
          detected_issues?: string[] | null
          exercise_log_id?: string | null
          feedback?: string | null
          form_score?: number | null
          id?: string
          improvement_suggestions?: string[] | null
          joint_angles?: Json | null
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_analyses_exercise_log_id_fkey"
            columns: ["exercise_log_id"]
            isOneToOne: false
            referencedRelation: "exercise_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          birthdate: string
          created_at: string | null
          fitness_level: string | null
          full_name: string | null
          goals: string[] | null
          height: number | null
          id: string
          updated_at: string | null
          user_type: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          birthdate: string
          created_at?: string | null
          fitness_level?: string | null
          full_name?: string | null
          goals?: string[] | null
          height?: number | null
          id: string
          updated_at?: string | null
          user_type?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          birthdate?: string
          created_at?: string | null
          fitness_level?: string | null
          full_name?: string | null
          goals?: string[] | null
          height?: number | null
          id?: string
          updated_at?: string | null
          user_type?: string | null
          username?: string | null
        }
        Relationships: []
      }
      progress_metrics: {
        Row: {
          created_at: string | null
          id: string
          metric_type: string | null
          metric_value: number | null
          notes: string | null
          recorded_date: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metric_type?: string | null
          metric_value?: number | null
          notes?: string | null
          recorded_date?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metric_type?: string | null
          metric_value?: number | null
          notes?: string | null
          recorded_date?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "progress_metrics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_plan_exercises: {
        Row: {
          created_at: string | null
          day_of_week: string | null
          environment: string
          exercise_id: string | null
          id: string
          notes: string | null
          order_index: number | null
          reps: string | null
          rest_seconds: number | null
          sets: number | null
          workout_plan_id: string | null
        }
        Insert: {
          created_at?: string | null
          day_of_week?: string | null
          environment?: string
          exercise_id?: string | null
          id?: string
          notes?: string | null
          order_index?: number | null
          reps?: string | null
          rest_seconds?: number | null
          sets?: number | null
          workout_plan_id?: string | null
        }
        Update: {
          created_at?: string | null
          day_of_week?: string | null
          environment?: string
          exercise_id?: string | null
          id?: string
          notes?: string | null
          order_index?: number | null
          reps?: string | null
          rest_seconds?: number | null
          sets?: number | null
          workout_plan_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_plan_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_plan_exercises_workout_plan_id_fkey"
            columns: ["workout_plan_id"]
            isOneToOne: false
            referencedRelation: "workout_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_plans: {
        Row: {
          created_at: string | null
          description: string | null
          duration_weeks: number | null
          frequency: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_weeks?: number | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_weeks?: number | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_sessions: {
        Row: {
          created_at: string | null
          end_time: string | null
          id: string
          notes: string | null
          overall_feeling: string | null
          start_time: string | null
          user_id: string | null
          workout_plan_id: string | null
        }
        Insert: {
          created_at?: string | null
          end_time?: string | null
          id?: string
          notes?: string | null
          overall_feeling?: string | null
          start_time?: string | null
          user_id?: string | null
          workout_plan_id?: string | null
        }
        Update: {
          created_at?: string | null
          end_time?: string | null
          id?: string
          notes?: string | null
          overall_feeling?: string | null
          start_time?: string | null
          user_id?: string | null
          workout_plan_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_sessions_workout_plan_id_fkey"
            columns: ["workout_plan_id"]
            isOneToOne: false
            referencedRelation: "workout_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
