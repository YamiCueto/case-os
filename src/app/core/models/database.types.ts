export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          display_name: string;
          avatar_url: string | null;
          role: 'student' | 'instructor' | 'issuer' | 'admin';
          preferred_language: string;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name?: string;
          avatar_url?: string | null;
          role?: 'student' | 'instructor' | 'issuer' | 'admin';
          preferred_language?: string;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          display_name?: string;
          avatar_url?: string | null;
          role?: 'student' | 'instructor' | 'issuer' | 'admin';
          preferred_language?: string;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_preferences: {
        Row: {
          user_id: string;
          favorites: Json;
          history: Json;
          theme: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          favorites?: Json;
          history?: Json;
          theme?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          favorites?: Json;
          history?: Json;
          theme?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      program_versions: {
        Row: {
          id: string;
          slug: string;
          version: string;
          title: string;
          status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
          published_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          version: string;
          title: string;
          status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
          published_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          version?: string;
          title?: string;
          status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
          published_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      learning_units: {
        Row: {
          id: string;
          module_id: string;
          type: 'LESSON' | 'DEMO' | 'LAB' | 'CAPSTONE';
          created_at: string;
        };
        Insert: {
          id: string;
          module_id: string;
          type: 'LESSON' | 'DEMO' | 'LAB' | 'CAPSTONE';
          created_at?: string;
        };
        Update: {
          id?: string;
          module_id?: string;
          type?: 'LESSON' | 'DEMO' | 'LAB' | 'CAPSTONE';
          created_at?: string;
        };
        Relationships: [];
      };
      learning_unit_versions: {
        Row: {
          id: string;
          unit_id: string;
          version: string;
          path: string;
          title: string;
          git_commit_hash: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          unit_id: string;
          version?: string;
          path: string;
          title: string;
          git_commit_hash?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          unit_id?: string;
          version?: string;
          path?: string;
          title?: string;
          git_commit_hash?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      program_units: {
        Row: {
          program_version_id: string;
          unit_version_id: string;
          display_order: number;
          prerequisites: string[];
        };
        Insert: {
          program_version_id: string;
          unit_version_id: string;
          display_order: number;
          prerequisites?: string[];
        };
        Update: {
          program_version_id?: string;
          unit_version_id?: string;
          display_order?: number;
          prerequisites?: string[];
        };
        Relationships: [];
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          program_version_id: string;
          status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
          enrolled_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          program_version_id: string;
          status?: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
          enrolled_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          program_version_id?: string;
          status?: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
          enrolled_at?: string;
        };
        Relationships: [];
      };
      unit_progress: {
        Row: {
          id: string;
          enrollment_id: string;
          unit_version_id: string;
          declared_completed: boolean;
          declared_at: string | null;
          imported_from_guest: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          enrollment_id: string;
          unit_version_id: string;
          declared_completed?: boolean;
          declared_at?: string | null;
          imported_from_guest?: boolean;
          updated_at?: string;
        };
        Update: {
          id?: string;
          enrollment_id?: string;
          unit_version_id?: string;
          declared_completed?: boolean;
          declared_at?: string | null;
          imported_from_guest?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      learning_state: {
        Row: {
          enrollment_id: string;
          last_visited_unit_version_id: string | null;
          last_visited_path: string | null;
          updated_at: string;
        };
        Insert: {
          enrollment_id: string;
          last_visited_unit_version_id?: string | null;
          last_visited_path?: string | null;
          updated_at?: string;
        };
        Update: {
          enrollment_id?: string;
          last_visited_unit_version_id?: string | null;
          last_visited_path?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      learning_activities: {
        Row: {
          id: string;
          user_id: string;
          activity_type: 'ACADEMY' | 'LIBRARY' | 'LABS' | 'DASHBOARD' | 'OTHER';
          entity_id: string;
          title: string;
          route: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          activity_type: 'ACADEMY' | 'LIBRARY' | 'LABS' | 'DASHBOARD' | 'OTHER';
          entity_id: string;
          title: string;
          route: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          activity_type?: 'ACADEMY' | 'LIBRARY' | 'LABS' | 'DASHBOARD' | 'OTHER';
          entity_id?: string;
          title?: string;
          route?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      publish_program_version: {
        Args: {
          p_program_version_id: string;
        };
        Returns: void;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
