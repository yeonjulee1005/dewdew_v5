export type Json
  = | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type ResumeDatabase = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '11.2.0 (c820efb)'
  }
  resume: {
    Tables: {
      ai_settings: {
        Row: {
          created_at: string | null
          deleted: boolean | null
          description: string | null
          id: string
          setting_key: string
          setting_value: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted?: boolean | null
          description?: string | null
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted?: boolean | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      certifications: {
        Row: {
          created_at: string | null
          credential_url: string | null
          deleted: boolean | null
          description: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          issuer: string | null
          order_index: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credential_url?: string | null
          deleted?: boolean | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string | null
          order_index?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credential_url?: string | null
          deleted?: boolean | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string | null
          order_index?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      chat_history: {
        Row: {
          created_at: string
          deleted: boolean
          id: string
          request_message: string
          updated_at: string
          user_agent: string
        }
        Insert: {
          created_at?: string
          deleted?: boolean
          id?: string
          request_message: string
          updated_at?: string
          user_agent: string
        }
        Update: {
          created_at?: string
          deleted?: boolean
          id?: string
          request_message?: string
          updated_at?: string
          user_agent?: string
        }
        Relationships: []
      }
      document_embeddings: {
        Row: {
          content: string
          created_at: string | null
          document_id: string
          document_type: string
          embedding: string | null
          id: string
          metadata: Json | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          document_id: string
          document_type: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          document_id?: string
          document_type?: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string | null
          degree: string | null
          deleted: boolean | null
          description: string | null
          end_date: string | null
          id: string
          image_url: string | null
          major: string | null
          order_index: number | null
          school_name: string
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          degree?: string | null
          deleted?: boolean | null
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          major?: string | null
          order_index?: number | null
          school_name: string
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          degree?: string | null
          deleted?: boolean | null
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          major?: string | null
          order_index?: number | null
          school_name?: string
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      experience: {
        Row: {
          company_logo_url: string | null
          company_name: string
          created_at: string | null
          deleted: boolean | null
          description: string | null
          end_date: string | null
          id: string
          is_current: boolean | null
          location: string | null
          order_index: number | null
          position: string
          start_date: string
          updated_at: string | null
        }
        Insert: {
          company_logo_url?: string | null
          company_name: string
          created_at?: string | null
          deleted?: boolean | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          location?: string | null
          order_index?: number | null
          position: string
          start_date: string
          updated_at?: string | null
        }
        Update: {
          company_logo_url?: string | null
          company_name?: string
          created_at?: string | null
          deleted?: boolean | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          location?: string | null
          order_index?: number | null
          position?: string
          start_date?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      hobbies: {
        Row: {
          created_at: string | null
          deleted: boolean | null
          description: string | null
          icon_url: string | null
          id: string
          order_index: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted?: boolean | null
          description?: string | null
          icon_url?: string | null
          id?: string
          order_index?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted?: boolean | null
          description?: string | null
          icon_url?: string | null
          id?: string
          order_index?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      image_archive: {
        Row: {
          category: string | null
          created_at: string | null
          deleted: boolean | null
          id: string
          image_url: string
          order_index: number | null
          season: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          year: number
          year_description: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          deleted?: boolean | null
          id?: string
          image_url: string
          order_index?: number | null
          season?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          year: number
          year_description?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          deleted?: boolean | null
          id?: string
          image_url?: string
          order_index?: number | null
          season?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          year?: number
          year_description?: string | null
        }
        Relationships: []
      }
      profile: {
        Row: {
          ai_personality_data: Json | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          deleted: boolean | null
          detailed_bio: string | null
          email: string | null
          full_name: string
          id: string
          location: string | null
          phone: string | null
          title: string | null
          updated_at: string | null
          weaknesses: string[] | null
        }
        Insert: {
          ai_personality_data?: Json | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          deleted?: boolean | null
          detailed_bio?: string | null
          email?: string | null
          full_name: string
          id?: string
          location?: string | null
          phone?: string | null
          title?: string | null
          updated_at?: string | null
          weaknesses?: string[] | null
        }
        Update: {
          ai_personality_data?: Json | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          deleted?: boolean | null
          detailed_bio?: string | null
          email?: string | null
          full_name?: string
          id?: string
          location?: string | null
          phone?: string | null
          title?: string | null
          updated_at?: string | null
          weaknesses?: string[] | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          deleted: boolean | null
          description: string | null
          description_image_url: string | null
          end_date: string | null
          github_url: string | null
          highlights: string[] | null
          id: string
          order_index: number | null
          project_url: string | null
          start_date: string | null
          tech_stack: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted?: boolean | null
          description?: string | null
          description_image_url?: string | null
          end_date?: string | null
          github_url?: string | null
          highlights?: string[] | null
          id?: string
          order_index?: number | null
          project_url?: string | null
          start_date?: string | null
          tech_stack?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted?: boolean | null
          description?: string | null
          description_image_url?: string | null
          end_date?: string | null
          github_url?: string | null
          highlights?: string[] | null
          id?: string
          order_index?: number | null
          project_url?: string | null
          start_date?: string | null
          tech_stack?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          created_at: string | null
          deleted: boolean | null
          icon_url: string | null
          id: string
          name: string
          order_index: number | null
          proficiency: number | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          deleted?: boolean | null
          icon_url?: string | null
          id?: string
          name: string
          order_index?: number | null
          proficiency?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          deleted?: boolean | null
          icon_url?: string | null
          id?: string
          name?: string
          order_index?: number | null
          proficiency?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string | null
          deleted: boolean | null
          icon_url: string | null
          id: string
          order_index: number | null
          platform: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          deleted?: boolean | null
          icon_url?: string | null
          id?: string
          order_index?: number | null
          platform: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          deleted?: boolean | null
          icon_url?: string | null
          id?: string
          order_index?: number | null
          platform?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      threejs: {
        Row: {
          created_at: string | null
          deleted: boolean | null
          description: string | null
          id: string
          order_index: number | null
          title: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          deleted?: boolean | null
          description?: string | null
          id?: string
          order_index?: number | null
          title: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          deleted?: boolean | null
          description?: string | null
          id?: string
          order_index?: number | null
          title?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_documents: {
        Args: {
          filter_document_type?: string
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          content: string
          document_id: string
          document_type: string
          id: string
          metadata: Json
          similarity: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<ResumeDatabase, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof ResumeDatabase, 'resume'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
      & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
      ? R
      : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables']
    & DefaultSchema['Views'])
    ? (DefaultSchema['Tables']
      & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
        ? R
        : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema['Tables']
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Insert: infer I
  }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I
    }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema['Tables']
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Update: infer U
  }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U
    }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema['Enums']
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema['CompositeTypes']
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  resume: {
    Enums: {},
  },
} as const
