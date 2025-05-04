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
        profiles: {
            Row: {
                id: string
                username: string | null
                full_name: string | null
                avatar_url: string | null
                height: number | null
                weight: number | null
                fitness_level: string | null
                goals: string[] | null
                environment: string
                created_at: string
                updated_at: string | null
            }
            Insert: {
                id: string
                username?: string | null
                full_name?: string | null
                avatar_url?: string | null
                height?: number | null
                weight?: number | null
                fitness_level?: string | null
                goals?: string[] | null
                environment?: string
                created_at?: string
                updated_at?: string | null
            }
            Update: {
                id?: string
                username?: string | null
                full_name?: string | null
                avatar_url?: string | null
                height?: number | null
                weight?: number | null
                fitness_level?: string | null
                goals?: string[] | null
                environment?: string
                created_at?: string
                updated_at?: string | null
            }
        }
        exercises: {
            Row: {
                id: string
                name: string
                description: string | null
                muscle_groups: string[] | null
                equipment: string[] | null
                difficulty_level: string | null
                demonstration_video_url: string | null
                environment: string
                created_at: string
            }
            Insert: {
                id?: string
                name: string
                description?: string | null
                muscle_groups?: string[] | null
                equipment?: string[] | null
                difficulty_level?: string | null
                demonstration_video_url?: string | null
                environment?: string
                created_at?: string
            }
            Update: {
                id?: string
                name?: string
                description?: string | null
                muscle_groups?: string[] | null
                equipment?: string[] | null
                difficulty_level?: string | null
                demonstration_video_url?: string | null
                environment?: string
                created_at?: string
            }
        }
        workout_plans: {
            Row: {
                id: string
                user_id: string
                name: string
                description: string | null
                frequency: string | null
                duration_weeks: number | null
                is_active: boolean | null
                environment: string
                created_at: string
                updated_at: string
            }
            Insert: {
                id?: string
                user_id: string
                name: string
                description?: string | null
                frequency?: string | null
                duration_weeks?: number | null
                is_active?: boolean | null
                environment?: string
                created_at?: string
                updated_at?: string
            }
            Update: {
                id?: string
                user_id?: string
                name?: string
                description?: string | null
                frequency?: string | null
                duration_weeks?: number | null
                is_active?: boolean | null
                environment?: string
                created_at?: string
                updated_at?: string
            }
        }
        workout_plan_exercises: {
            Row: {
                id: string
                workout_plan_id: string
                exercise_id: string
                day_of_week: string | null
                sets: number | null
                reps: string | null
                rest_seconds: number | null
                notes: string | null
                order_index: number | null
                environment: string
                created_at: string
            }
            Insert: {
                id?: string
                workout_plan_id: string
                exercise_id: string
                day_of_week?: string | null
                sets?: number | null
                reps?: string | null
                rest_seconds?: number | null
                notes?: string | null
                order_index?: number | null
                environment?: string
                created_at?: string
            }
            Update: {
                id?: string
                workout_plan_id?: string
                exercise_id?: string
                day_of_week?: string | null
                sets?: number | null
                reps?: string | null
                rest_seconds?: number | null
                notes?: string | null
                order_index?: number | null
                environment?: string
                created_at?: string
            }
        }
        workout_sessions: {
            Row: {
                id: string
                user_id: string
                workout_plan_id: string | null
                start_time: string
                end_time: string | null
                notes: string | null
                overall_feeling: string | null
                environment: string
                created_at: string
            }
            Insert: {
                id?: string
                user_id: string
                workout_plan_id?: string | null
                start_time?: string
                end_time?: string | null
                notes?: string | null
                overall_feeling?: string | null
                environment?: string
                created_at?: string
            }
            Update: {
                id?: string
                user_id?: string
                workout_plan_id?: string | null
                start_time?: string
                end_time?: string | null
                notes?: string | null
                overall_feeling?: string | null
                environment?: string
                created_at?: string
            }
        }
        exercise_logs: {
            Row: {
                id: string
                workout_session_id: string
                exercise_id: string | null
                sets_completed: number | null
                reps_completed: number[] | null
                weights_used: number[] | null
                video_url: string | null
                form_feedback: string | null
                soreness_rating: number | null
                environment: string
                created_at: string
            }
            Insert: {
                id?: string
                workout_session_id: string
                exercise_id?: string | null
                sets_completed?: number | null
                reps_completed?: number[] | null
                weights_used?: number[] | null
                video_url?: string | null
                form_feedback?: string | null
                soreness_rating?: number | null
                environment?: string
                created_at?: string
            }
            Update: {
                id?: string
                workout_session_id?: string
                exercise_id?: string | null
                sets_completed?: number | null
                reps_completed?: number[] | null
                weights_used?: number[] | null
                video_url?: string | null
                form_feedback?: string | null
                soreness_rating?: number | null
                environment?: string
                created_at?: string
            }
        }
        form_analyses: {
            Row: {
                id: string
                exercise_log_id: string
                video_url: string | null
                analysis_status: string | null
                form_score: number | null
                feedback: string | null
                detected_issues: string[] | null
                improvement_suggestions: string[] | null
                joint_angles: Json | null
                environment: string
                created_at: string
                updated_at: string
            }
            Insert: {
                id?: string
                exercise_log_id: string
                video_url?: string | null
                analysis_status?: string | null
                form_score?: number | null
                feedback?: string | null
                detected_issues?: string[] | null
                improvement_suggestions?: string[] | null
                joint_angles?: Json | null
                environment?: string
                created_at?: string
                updated_at?: string
            }
            Update: {
                id?: string
                exercise_log_id?: string
                video_url?: string | null
                analysis_status?: string | null
                form_score?: number | null
                feedback?: string | null
                detected_issues?: string[] | null
                improvement_suggestions?: string[] | null
                joint_angles?: Json | null
                environment?: string
                created_at?: string
                updated_at?: string
            }
        }
        progress_metrics: {
            Row: {
                id: string
                user_id: string
                metric_type: string | null
                metric_value: number | null
                recorded_date: string | null
                notes: string | null
                environment: string
                created_at: string
            }
            Insert: {
                id?: string
                user_id: string
                metric_type?: string | null
                metric_value?: number | null
                recorded_date?: string | null
                notes?: string | null
                environment?: string
                created_at?: string
            }
            Update: {
                id?: string
                user_id?: string
                metric_type?: string | null
                metric_value?: number | null
                recorded_date?: string | null
                notes?: string | null
                environment?: string
                created_at?: string
            }
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
