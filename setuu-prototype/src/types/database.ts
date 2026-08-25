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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      acknowledgements: {
        Row: {
          client_id: string
          created_at: string
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["ack_status"]
          update_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          notes?: string | null
          status: Database["public"]["Enums"]["ack_status"]
          update_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["ack_status"]
          update_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "acknowledgements_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "acknowledgements_update_id_fkey"
            columns: ["update_id"]
            isOneToOne: false
            referencedRelation: "updates"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          created_at: string
          event_type: string
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          resource_id: string
          table_name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          resource_id: string
          table_name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          resource_id?: string
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      batch_upload_jobs: {
        Row: {
          created_at: string | null
          id: string
          processed_pages: number | null
          project_id: string | null
          status: string | null
          total_pages: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          processed_pages?: number | null
          project_id?: string | null
          status?: string | null
          total_pages?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          processed_pages?: number | null
          project_id?: string | null
          status?: string | null
          total_pages?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "batch_upload_jobs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      bim_clashes: {
        Row: {
          clash_xyz: Json
          id: string
          issue_id: string | null
          model_urn: string
          project_id: string | null
        }
        Insert: {
          clash_xyz: Json
          id?: string
          issue_id?: string | null
          model_urn: string
          project_id?: string | null
        }
        Update: {
          clash_xyz?: Json
          id?: string
          issue_id?: string | null
          model_urn?: string
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bim_clashes_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "project_issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bim_clashes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      break_glass_logs: {
        Row: {
          created_at: string
          id: string
          reason: string
          super_admin_id: string
          target_org_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reason: string
          super_admin_id: string
          target_org_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string
          super_admin_id?: string
          target_org_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "break_glass_logs_target_org_id_fkey"
            columns: ["target_org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      change_requests: {
        Row: {
          approval_workflow: Json | null
          approved_by: string | null
          cost_impact: number | null
          created_at: string | null
          created_by: string | null
          custom_data: Json | null
          description: string | null
          display_id: string | null
          id: string
          project_id: string
          status: string
          time_impact_days: number | null
          title: string
        }
        Insert: {
          approval_workflow?: Json | null
          approved_by?: string | null
          cost_impact?: number | null
          created_at?: string | null
          created_by?: string | null
          custom_data?: Json | null
          description?: string | null
          display_id?: string | null
          id?: string
          project_id: string
          status?: string
          time_impact_days?: number | null
          title: string
        }
        Update: {
          approval_workflow?: Json | null
          approved_by?: string | null
          cost_impact?: number | null
          created_at?: string | null
          created_by?: string | null
          custom_data?: Json | null
          description?: string | null
          display_id?: string | null
          id?: string
          project_id?: string
          status?: string
          time_impact_days?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "change_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "change_requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "change_requests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_change_requests_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      change_requests_history: {
        Row: {
          change_id: string | null
          changed_at: string | null
          changed_by: string | null
          id: string
          snapshot_data: Json
        }
        Insert: {
          change_id?: string | null
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          snapshot_data: Json
        }
        Update: {
          change_id?: string | null
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          snapshot_data?: Json
        }
        Relationships: [
          {
            foreignKeyName: "change_requests_history_change_id_fkey"
            columns: ["change_id"]
            isOneToOne: false
            referencedRelation: "change_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "change_requests_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
        ]
      }
      change_signatures: {
        Row: {
          change_id: string | null
          esign_envelope_id: string | null
          id: string
          ip_address: string | null
          role: string | null
          signed_at: string | null
          signer_id: string | null
        }
        Insert: {
          change_id?: string | null
          esign_envelope_id?: string | null
          id?: string
          ip_address?: string | null
          role?: string | null
          signed_at?: string | null
          signer_id?: string | null
        }
        Update: {
          change_id?: string | null
          esign_envelope_id?: string | null
          id?: string
          ip_address?: string | null
          role?: string | null
          signed_at?: string | null
          signer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "change_signatures_change_id_fkey"
            columns: ["change_id"]
            isOneToOne: false
            referencedRelation: "change_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "change_signatures_signer_id_fkey"
            columns: ["signer_id"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
        ]
      }
      client_approvals: {
        Row: {
          actioned_at: string | null
          approval_timeline: Json | null
          approved_by: string | null
          attached_documents: Json | null
          comments: string | null
          created_at: string | null
          created_by: string | null
          display_id: string | null
          document_title: string
          document_url: string | null
          final_authority: Json | null
          id: string
          milestone_name: string | null
          project_id: string
          status: string
        }
        Insert: {
          actioned_at?: string | null
          approval_timeline?: Json | null
          approved_by?: string | null
          attached_documents?: Json | null
          comments?: string | null
          created_at?: string | null
          created_by?: string | null
          display_id?: string | null
          document_title: string
          document_url?: string | null
          final_authority?: Json | null
          id?: string
          milestone_name?: string | null
          project_id: string
          status?: string
        }
        Update: {
          actioned_at?: string | null
          approval_timeline?: Json | null
          approved_by?: string | null
          attached_documents?: Json | null
          comments?: string | null
          created_at?: string | null
          created_by?: string | null
          display_id?: string | null
          document_title?: string
          document_url?: string | null
          final_authority?: Json | null
          id?: string
          milestone_name?: string | null
          project_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_approvals_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_approvals_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_approvals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_client_approvals_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      client_meeting_agendas: {
        Row: {
          created_at: string | null
          duration: string | null
          id: string
          meeting_id: string
          topic: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          duration?: string | null
          id?: string
          meeting_id: string
          topic: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          duration?: string | null
          id?: string
          meeting_id?: string
          topic?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_meeting_agendas_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "client_meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      client_meetings: {
        Row: {
          action_items: string | null
          action_items_list: Json | null
          agenda_minutes: Json | null
          attendees: string | null
          attendees_list: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          key_attributes: Json | null
          meeting_date: string
          minutes_url: string | null
          project_id: string
          status: string | null
          title: string
        }
        Insert: {
          action_items?: string | null
          action_items_list?: Json | null
          agenda_minutes?: Json | null
          attendees?: string | null
          attendees_list?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          key_attributes?: Json | null
          meeting_date: string
          minutes_url?: string | null
          project_id: string
          status?: string | null
          title: string
        }
        Update: {
          action_items?: string | null
          action_items_list?: Json | null
          agenda_minutes?: Json | null
          attendees?: string | null
          attendees_list?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          key_attributes?: Json | null
          meeting_date?: string
          minutes_url?: string | null
          project_id?: string
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_meetings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_meetings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_client_meetings_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_mentions: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          mentioned_user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          mentioned_user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          mentioned_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_mentions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_mentions_mentioned_user_id_fkey"
            columns: ["mentioned_user_id"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          update_id: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          update_id: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          update_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_update_id_fkey"
            columns: ["update_id"]
            isOneToOne: false
            referencedRelation: "updates"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_mentions: {
        Row: {
          communication_id: string
          created_at: string | null
          id: string
          is_read: boolean | null
          mentioned_user_id: string
        }
        Insert: {
          communication_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          mentioned_user_id: string
        }
        Update: {
          communication_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          mentioned_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "communication_mentions_communication_id_fkey"
            columns: ["communication_id"]
            isOneToOne: false
            referencedRelation: "project_communications"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_reads: {
        Row: {
          communication_id: string
          id: string
          read_at: string | null
          user_id: string
        }
        Insert: {
          communication_id: string
          id?: string
          read_at?: string | null
          user_id: string
        }
        Update: {
          communication_id?: string
          id?: string
          read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "communication_reads_communication_id_fkey"
            columns: ["communication_id"]
            isOneToOne: false
            referencedRelation: "project_communications"
            referencedColumns: ["id"]
          },
        ]
      }
      company_skills_tags: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      custom_fields_schema: {
        Row: {
          entity_type: string
          field_name: string
          field_type: string
          id: string
        }
        Insert: {
          entity_type: string
          field_name: string
          field_type: string
          id?: string
        }
        Update: {
          entity_type?: string
          field_name?: string
          field_type?: string
          id?: string
        }
        Relationships: []
      }
      data_retention_policies: {
        Row: {
          action: string | null
          days_to_keep: number
          entity_type: string
          id: string
        }
        Insert: {
          action?: string | null
          days_to_keep: number
          entity_type: string
          id?: string
        }
        Update: {
          action?: string | null
          days_to_keep?: number
          entity_type?: string
          id?: string
        }
        Relationships: []
      }
      drawing_hyperlinks: {
        Row: {
          bounding_box_json: Json
          id: string
          source_drawing_id: string | null
          target_drawing_id: string | null
        }
        Insert: {
          bounding_box_json: Json
          id?: string
          source_drawing_id?: string | null
          target_drawing_id?: string | null
        }
        Update: {
          bounding_box_json?: Json
          id?: string
          source_drawing_id?: string | null
          target_drawing_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drawing_hyperlinks_source_drawing_id_fkey"
            columns: ["source_drawing_id"]
            isOneToOne: false
            referencedRelation: "drawing_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drawing_hyperlinks_target_drawing_id_fkey"
            columns: ["target_drawing_id"]
            isOneToOne: false
            referencedRelation: "drawing_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      drawing_pins: {
        Row: {
          drawing_id: string | null
          id: string
          linked_entity_id: string | null
          linked_entity_type: string | null
          x_coord: number
          y_coord: number
        }
        Insert: {
          drawing_id?: string | null
          id?: string
          linked_entity_id?: string | null
          linked_entity_type?: string | null
          x_coord: number
          y_coord: number
        }
        Update: {
          drawing_id?: string | null
          id?: string
          linked_entity_id?: string | null
          linked_entity_type?: string | null
          x_coord?: number
          y_coord?: number
        }
        Relationships: [
          {
            foreignKeyName: "drawing_pins_drawing_id_fkey"
            columns: ["drawing_id"]
            isOneToOne: false
            referencedRelation: "drawing_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      drawing_versions: {
        Row: {
          approved_by: string | null
          created_at: string
          custom_data: Json | null
          description: string | null
          drawing_id: string | null
          drawing_name: string
          file_size_bytes: number | null
          file_url: string
          id: string
          project_id: string
          status: string
          uploaded_by: string | null
          version_number: number
        }
        Insert: {
          approved_by?: string | null
          created_at?: string
          custom_data?: Json | null
          description?: string | null
          drawing_id?: string | null
          drawing_name: string
          file_size_bytes?: number | null
          file_url: string
          id?: string
          project_id: string
          status?: string
          uploaded_by?: string | null
          version_number?: number
        }
        Update: {
          approved_by?: string | null
          created_at?: string
          custom_data?: Json | null
          description?: string | null
          drawing_id?: string | null
          drawing_name?: string
          file_size_bytes?: number | null
          file_url?: string
          id?: string
          project_id?: string
          status?: string
          uploaded_by?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "drawing_versions_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drawing_versions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drawing_versions_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
        ]
      }
      duplicate_files: {
        Row: {
          duplicate_file_id: string
          id: string
          original_file_id: string
          similarity_score: number
          status: string
        }
        Insert: {
          duplicate_file_id: string
          id?: string
          original_file_id: string
          similarity_score: number
          status: string
        }
        Update: {
          duplicate_file_id?: string
          id?: string
          original_file_id?: string
          similarity_score?: number
          status?: string
        }
        Relationships: []
      }
      employee_timesheets: {
        Row: {
          created_at: string | null
          end_time: string
          hours_logged: number
          id: string
          notes: string | null
          organization_id: string
          project_id: string
          start_time: string
          status: string | null
          updated_at: string | null
          user_id: string
          work_date: string
        }
        Insert: {
          created_at?: string | null
          end_time: string
          hours_logged: number
          id?: string
          notes?: string | null
          organization_id: string
          project_id: string
          start_time: string
          status?: string | null
          updated_at?: string | null
          user_id: string
          work_date: string
        }
        Update: {
          created_at?: string | null
          end_time?: string
          hours_logged?: number
          id?: string
          notes?: string | null
          organization_id?: string
          project_id?: string
          start_time?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
          work_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_timesheets_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_timesheets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_timesheets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_telemetry: {
        Row: {
          engine_hours: number | null
          equipment_id: string | null
          id: string
          last_ping: string | null
          lat: number | null
          lng: number | null
        }
        Insert: {
          engine_hours?: number | null
          equipment_id?: string | null
          id?: string
          last_ping?: string | null
          lat?: number | null
          lng?: number | null
        }
        Update: {
          engine_hours?: number | null
          equipment_id?: string | null
          id?: string
          last_ping?: string | null
          lat?: number | null
          lng?: number | null
        }
        Relationships: []
      }
      financial_retentions: {
        Row: {
          id: string
          project_id: string | null
          retention_percentage: number | null
          status: string | null
          vendor_id: string | null
        }
        Insert: {
          id?: string
          project_id?: string | null
          retention_percentage?: number | null
          status?: string | null
          vendor_id?: string | null
        }
        Update: {
          id?: string
          project_id?: string | null
          retention_percentage?: number | null
          status?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_retentions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_retentions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          due_date: string | null
          id: string
          invoice_number: string
          project_id: string
          status: string
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          project_id: string
          status: string
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          project_id?: string
          status?: string
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: []
      }
      issue_inspections: {
        Row: {
          checklist_json: Json
          conducted_at: string | null
          id: string
          inspector_id: string | null
          issue_id: string | null
        }
        Insert: {
          checklist_json: Json
          conducted_at?: string | null
          id?: string
          inspector_id?: string | null
          issue_id?: string | null
        }
        Update: {
          checklist_json?: Json
          conducted_at?: string | null
          id?: string
          inspector_id?: string | null
          issue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "issue_inspections_inspector_id_fkey"
            columns: ["inspector_id"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issue_inspections_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "project_issues"
            referencedColumns: ["id"]
          },
        ]
      }
      issue_root_causes: {
        Row: {
          category: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      lessons_learned: {
        Row: {
          category: string
          created_at: string | null
          created_by: string | null
          description: string
          display_id: string | null
          id: string
          impact: string | null
          project_id: string
          recommendation: string | null
          related_media: Json | null
          root_cause: string | null
          title: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by?: string | null
          description: string
          display_id?: string | null
          id?: string
          impact?: string | null
          project_id: string
          recommendation?: string | null
          related_media?: Json | null
          root_cause?: string | null
          title?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string
          display_id?: string | null
          id?: string
          impact?: string | null
          project_id?: string
          recommendation?: string | null
          related_media?: Json | null
          root_cause?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_lessons_learned_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_learned_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_learned_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      material_waste_logs: {
        Row: {
          financial_loss: number | null
          id: string
          logged_at: string | null
          material_id: string | null
          quantity_wasted: number
          reason: string | null
        }
        Insert: {
          financial_loss?: number | null
          id?: string
          logged_at?: string | null
          material_id?: string | null
          quantity_wasted: number
          reason?: string | null
        }
        Update: {
          financial_loss?: number | null
          id?: string
          logged_at?: string | null
          material_id?: string | null
          quantity_wasted?: number
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "material_waste_logs_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "project_materials"
            referencedColumns: ["id"]
          },
        ]
      }
      media_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_size_bytes: number | null
          id: string
          mime_type: string | null
          type: Database["public"]["Enums"]["media_type"]
          update_id: string
          uploaded_by: string | null
          url: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size_bytes?: number | null
          id?: string
          mime_type?: string | null
          type: Database["public"]["Enums"]["media_type"]
          update_id: string
          uploaded_by?: string | null
          url: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size_bytes?: number | null
          id?: string
          mime_type?: string | null
          type?: Database["public"]["Enums"]["media_type"]
          update_id?: string
          uploaded_by?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_attachments_update_id_fkey"
            columns: ["update_id"]
            isOneToOne: false
            referencedRelation: "updates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_minutes: {
        Row: {
          ai_transcript: string | null
          audio_url: string | null
          created_at: string | null
          id: string
          project_id: string | null
        }
        Insert: {
          ai_transcript?: string | null
          audio_url?: string | null
          created_at?: string | null
          id?: string
          project_id?: string | null
        }
        Update: {
          ai_transcript?: string | null
          audio_url?: string | null
          created_at?: string | null
          id?: string
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meeting_minutes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      milestone_checklist_items: {
        Row: {
          created_at: string
          created_by: string | null
          display_order: number
          id: string
          is_complete: boolean
          milestone_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          display_order?: number
          id?: string
          is_complete?: boolean
          milestone_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          display_order?: number
          id?: string
          is_complete?: boolean
          milestone_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestone_checklist_items_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "milestone_checklist_items_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
        ]
      }
      milestone_status_history: {
        Row: {
          entered_at: string | null
          exited_at: string | null
          id: string
          milestone_id: string | null
          status_name: string
        }
        Insert: {
          entered_at?: string | null
          exited_at?: string | null
          id?: string
          milestone_id?: string | null
          status_name: string
        }
        Update: {
          entered_at?: string | null
          exited_at?: string | null
          id?: string
          milestone_id?: string | null
          status_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestone_status_history_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          baseline_end_date: string | null
          baseline_start_date: string | null
          completion_status: boolean | null
          created_at: string | null
          custom_data: Json | null
          department: string | null
          description: string | null
          display_order: number | null
          id: string
          is_exterior: boolean | null
          project_id: string
          sov_value: number | null
          target_date: string | null
          title: string
          wbs_code: string | null
          weight_percent: number | null
        }
        Insert: {
          baseline_end_date?: string | null
          baseline_start_date?: string | null
          completion_status?: boolean | null
          created_at?: string | null
          custom_data?: Json | null
          department?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_exterior?: boolean | null
          project_id: string
          sov_value?: number | null
          target_date?: string | null
          title: string
          wbs_code?: string | null
          weight_percent?: number | null
        }
        Update: {
          baseline_end_date?: string | null
          baseline_start_date?: string | null
          completion_status?: boolean | null
          created_at?: string | null
          custom_data?: Json | null
          department?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_exterior?: boolean | null
          project_id?: string
          sov_value?: number | null
          target_date?: string | null
          title?: string
          wbs_code?: string | null
          weight_percent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      muster_events: {
        Row: {
          id: string
          initiated_by: string | null
          project_id: string | null
          started_at: string | null
        }
        Insert: {
          id?: string
          initiated_by?: string | null
          project_id?: string | null
          started_at?: string | null
        }
        Update: {
          id?: string
          initiated_by?: string | null
          project_id?: string | null
          started_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "muster_events_initiated_by_fkey"
            columns: ["initiated_by"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "muster_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      muster_responses: {
        Row: {
          event_id: string
          responded_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          event_id: string
          responded_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          event_id?: string
          responded_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "muster_responses_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "muster_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "muster_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
        ]
      }
      muster_roll_events: {
        Row: {
          created_at: string | null
          id: string
          initiated_by: string | null
          project_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          initiated_by?: string | null
          project_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          initiated_by?: string | null
          project_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "muster_roll_events_initiated_by_fkey"
            columns: ["initiated_by"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "muster_roll_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      muster_roll_responses: {
        Row: {
          event_id: string
          id: string
          responded_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          responded_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          responded_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "muster_roll_responses_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "muster_roll_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "muster_roll_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          is_read: boolean
          reference_id: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          is_read?: boolean
          reference_id?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_read?: boolean
          reference_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      org_vendors: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_vendors_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          max_projects: number
          name: string
          status: string | null
          subscription_tier: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          max_projects?: number
          name: string
          status?: string | null
          subscription_tier?: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          max_projects?: number
          name?: string
          status?: string | null
          subscription_tier?: string
          type?: string
        }
        Relationships: []
      }
      personnel_certifications: {
        Row: {
          cert_name: string
          created_at: string | null
          expiry_date: string
          id: string
          is_verified: boolean | null
          user_id: string
        }
        Insert: {
          cert_name: string
          created_at?: string | null
          expiry_date: string
          id?: string
          is_verified?: boolean | null
          user_id: string
        }
        Update: {
          cert_name?: string
          created_at?: string | null
          expiry_date?: string
          id?: string
          is_verified?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "personnel_certifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          global_announcement: string | null
          id: string
          maintenance_mode: boolean
          min_android_version: string | null
        }
        Insert: {
          global_announcement?: string | null
          id?: string
          maintenance_mode?: boolean
          min_android_version?: string | null
        }
        Update: {
          global_announcement?: string | null
          id?: string
          maintenance_mode?: boolean
          min_android_version?: string | null
        }
        Relationships: []
      }
      project_assets: {
        Row: {
          asset_tag: string
          id: string
          name: string
          om_manual_url: string | null
          project_id: string | null
          warranty_end: string | null
        }
        Insert: {
          asset_tag: string
          id?: string
          name: string
          om_manual_url?: string | null
          project_id?: string | null
          warranty_end?: string | null
        }
        Update: {
          asset_tag?: string
          id?: string
          name?: string
          om_manual_url?: string | null
          project_id?: string | null
          warranty_end?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_assets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_communications: {
        Row: {
          audio_url: string | null
          created_at: string | null
          custom_data: Json | null
          drawing_id: string | null
          id: string
          is_broadcast: boolean | null
          is_transmittal: boolean | null
          issue_id: string | null
          message: string
          project_id: string
          sender_id: string
          translated_message_es: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string | null
          custom_data?: Json | null
          drawing_id?: string | null
          id?: string
          is_broadcast?: boolean | null
          is_transmittal?: boolean | null
          issue_id?: string | null
          message: string
          project_id: string
          sender_id: string
          translated_message_es?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string | null
          custom_data?: Json | null
          drawing_id?: string | null
          id?: string
          is_broadcast?: boolean | null
          is_transmittal?: boolean | null
          issue_id?: string | null
          message?: string
          project_id?: string
          sender_id?: string
          translated_message_es?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_communications_drawing_id_fkey"
            columns: ["drawing_id"]
            isOneToOne: false
            referencedRelation: "drawing_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_communications_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "project_issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_communications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_config: {
        Row: {
          id: string
          is_enabled: boolean
          module_name: string
          project_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          is_enabled?: boolean
          module_name: string
          project_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          is_enabled?: boolean
          module_name?: string
          project_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_config_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_config_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
        ]
      }
      project_granular_permissions: {
        Row: {
          can_view_drawings: boolean | null
          can_view_financials: boolean | null
          id: string
          project_id: string
          user_id: string
        }
        Insert: {
          can_view_drawings?: boolean | null
          can_view_financials?: boolean | null
          id?: string
          project_id: string
          user_id: string
        }
        Update: {
          can_view_drawings?: boolean | null
          can_view_financials?: boolean | null
          id?: string
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_granular_permissions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_granular_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
        ]
      }
      project_handovers: {
        Row: {
          client_signature_url: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          display_id: string | null
          document_url: string | null
          id: string
          key_attributes: Json | null
          package_contents: Json | null
          package_name: string
          project_id: string
          sign_off_status: Json | null
          status: string
          warranty_expiry: string | null
        }
        Insert: {
          client_signature_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          display_id?: string | null
          document_url?: string | null
          id?: string
          key_attributes?: Json | null
          package_contents?: Json | null
          package_name: string
          project_id: string
          sign_off_status?: Json | null
          status?: string
          warranty_expiry?: string | null
        }
        Update: {
          client_signature_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          display_id?: string | null
          document_url?: string | null
          id?: string
          key_attributes?: Json | null
          package_contents?: Json | null
          package_name?: string
          project_id?: string
          sign_off_status?: Json | null
          status?: string
          warranty_expiry?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_project_handovers_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_handovers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_handovers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_issues: {
        Row: {
          assigned_to: string | null
          cost_impact: string | null
          created_at: string | null
          created_by: string | null
          custom_data: Json | null
          description: string | null
          display_id: string | null
          estimated_rework_cost: number | null
          id: string
          linked_milestones: Json | null
          project_id: string
          resolution_plan: Json | null
          resolved_at: string | null
          root_cause: string | null
          root_cause_id: string | null
          severity: string
          sla_deadline: string | null
          status: string
          timeline_impact: string | null
          title: string
        }
        Insert: {
          assigned_to?: string | null
          cost_impact?: string | null
          created_at?: string | null
          created_by?: string | null
          custom_data?: Json | null
          description?: string | null
          display_id?: string | null
          estimated_rework_cost?: number | null
          id?: string
          linked_milestones?: Json | null
          project_id: string
          resolution_plan?: Json | null
          resolved_at?: string | null
          root_cause?: string | null
          root_cause_id?: string | null
          severity?: string
          sla_deadline?: string | null
          status?: string
          timeline_impact?: string | null
          title: string
        }
        Update: {
          assigned_to?: string | null
          cost_impact?: string | null
          created_at?: string | null
          created_by?: string | null
          custom_data?: Json | null
          description?: string | null
          display_id?: string | null
          estimated_rework_cost?: number | null
          id?: string
          linked_milestones?: Json | null
          project_id?: string
          resolution_plan?: Json | null
          resolved_at?: string | null
          root_cause?: string | null
          root_cause_id?: string | null
          severity?: string
          sla_deadline?: string | null
          status?: string
          timeline_impact?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_pi_root_cause"
            columns: ["root_cause_id"]
            isOneToOne: false
            referencedRelation: "issue_root_causes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_issues_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_issues_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_issues_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_materials: {
        Row: {
          actual_delivery: string | null
          created_at: string | null
          created_by: string | null
          current_stock: number | null
          custom_data: Json | null
          estimated_delivery: string | null
          expected_arrival_date: string | null
          id: string
          item_name: string
          lead_time: string | null
          location_id: string | null
          po_number: string | null
          project_id: string
          qr_uuid: string | null
          quantity: number
          reorder_threshold: number | null
          spec_id: string | null
          status: string
          submittal_id: string | null
          supplier_name: string | null
          tracking_timeline: Json | null
          unit_cost: number | null
          vendor_id: string | null
        }
        Insert: {
          actual_delivery?: string | null
          created_at?: string | null
          created_by?: string | null
          current_stock?: number | null
          custom_data?: Json | null
          estimated_delivery?: string | null
          expected_arrival_date?: string | null
          id?: string
          item_name: string
          lead_time?: string | null
          location_id?: string | null
          po_number?: string | null
          project_id: string
          qr_uuid?: string | null
          quantity: number
          reorder_threshold?: number | null
          spec_id?: string | null
          status?: string
          submittal_id?: string | null
          supplier_name?: string | null
          tracking_timeline?: Json | null
          unit_cost?: number | null
          vendor_id?: string | null
        }
        Update: {
          actual_delivery?: string | null
          created_at?: string | null
          created_by?: string | null
          current_stock?: number | null
          custom_data?: Json | null
          estimated_delivery?: string | null
          expected_arrival_date?: string | null
          id?: string
          item_name?: string
          lead_time?: string | null
          location_id?: string | null
          po_number?: string | null
          project_id?: string
          qr_uuid?: string | null
          quantity?: number
          reorder_threshold?: number | null
          spec_id?: string | null
          status?: string
          submittal_id?: string | null
          supplier_name?: string | null
          tracking_timeline?: Json | null
          unit_cost?: number | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_pm_location"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "site_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_materials_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_materials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_reports: {
        Row: {
          generated_at: string | null
          id: string
          project_id: string | null
          report_data: string
        }
        Insert: {
          generated_at?: string | null
          id?: string
          project_id?: string | null
          report_data: string
        }
        Update: {
          generated_at?: string | null
          id?: string
          project_id?: string | null
          report_data?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_reports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_resources: {
        Row: {
          actual_hours: number | null
          allocated_hours: number | null
          created_at: string | null
          created_by: string | null
          current_assignment: string | null
          id: string
          name: string
          notes: string | null
          productivity_score: number | null
          project_id: string
          resource_type: string
        }
        Insert: {
          actual_hours?: number | null
          allocated_hours?: number | null
          created_at?: string | null
          created_by?: string | null
          current_assignment?: string | null
          id?: string
          name: string
          notes?: string | null
          productivity_score?: number | null
          project_id: string
          resource_type: string
        }
        Update: {
          actual_hours?: number | null
          allocated_hours?: number | null
          created_at?: string | null
          created_by?: string | null
          current_assignment?: string | null
          id?: string
          name?: string
          notes?: string | null
          productivity_score?: number | null
          project_id?: string
          resource_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_project_resources_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_resources_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_resources_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_submittals: {
        Row: {
          created_at: string | null
          id: string
          project_id: string
          spec_section: string | null
          status: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id: string
          spec_section?: string | null
          status?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string
          spec_section?: string | null
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_submittals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_vendors: {
        Row: {
          created_at: string
          id: string
          project_id: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_vendors_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          assigned_pm_id: string | null
          client_org_id: string | null
          client_visibility: string | null
          contingency_amount: number | null
          contract_value: number | null
          created_at: string | null
          description: string | null
          id: string
          is_archived: boolean | null
          name: string
          po_reference: string | null
          start_date: string | null
          status: string
          tags: string[] | null
          target_date: string | null
          type: Database["public"]["Enums"]["project_type"] | null
        }
        Insert: {
          assigned_pm_id?: string | null
          client_org_id?: string | null
          client_visibility?: string | null
          contingency_amount?: number | null
          contract_value?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_archived?: boolean | null
          name: string
          po_reference?: string | null
          start_date?: string | null
          status?: string
          tags?: string[] | null
          target_date?: string | null
          type?: Database["public"]["Enums"]["project_type"] | null
        }
        Update: {
          assigned_pm_id?: string | null
          client_org_id?: string | null
          client_visibility?: string | null
          contingency_amount?: number | null
          contract_value?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_archived?: boolean | null
          name?: string
          po_reference?: string | null
          start_date?: string | null
          status?: string
          tags?: string[] | null
          target_date?: string | null
          type?: Database["public"]["Enums"]["project_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_assigned_pm_id_fkey"
            columns: ["assigned_pm_id"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_client_org_id_fkey"
            columns: ["client_org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      public_shares: {
        Row: {
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          id: string
          project_id: string | null
          secure_token: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          project_id?: string | null
          secure_token: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          project_id?: string | null
          secure_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_shares_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_shares_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          created_at: string | null
          id: string
          material_id: string | null
          po_number: string | null
          project_id: string
          status: string | null
          total_amount: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          material_id?: string | null
          po_number?: string | null
          project_id: string
          status?: string | null
          total_amount?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          material_id?: string | null
          po_number?: string | null
          project_id?: string
          status?: string | null
          total_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_material"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "project_materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      push_tokens: {
        Row: {
          created_at: string
          id: string
          platform: string
          token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          platform: string
          token: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          platform?: string
          token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      role_default_views: {
        Row: {
          default_module_path: string
          role_name: string
        }
        Insert: {
          default_module_path: string
          role_name: string
        }
        Update: {
          default_module_path?: string
          role_name?: string
        }
        Relationships: []
      }
      scheduled_reports: {
        Row: {
          created_at: string | null
          created_by: string | null
          format: string
          id: string
          name: string
          next_run: string | null
          parameters: Json | null
          project_id: string | null
          schedule: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          format: string
          id?: string
          name: string
          next_run?: string | null
          parameters?: Json | null
          project_id?: string | null
          schedule: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          format?: string
          id?: string
          name?: string
          next_run?: string | null
          parameters?: Json | null
          project_id?: string | null
          schedule?: string
        }
        Relationships: []
      }
      site_access_logs: {
        Row: {
          direction: string | null
          id: string
          project_id: string | null
          scanned_at: string | null
          user_id: string | null
        }
        Insert: {
          direction?: string | null
          id?: string
          project_id?: string | null
          scanned_at?: string | null
          user_id?: string | null
        }
        Update: {
          direction?: string | null
          id?: string
          project_id?: string | null
          scanned_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_access_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_access_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
        ]
      }
      site_locations: {
        Row: {
          id: string
          name: string
          project_id: string | null
          zone: string | null
        }
        Insert: {
          id?: string
          name: string
          project_id?: string | null
          zone?: string | null
        }
        Update: {
          id?: string
          name?: string
          project_id?: string | null
          zone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_locations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_tiers: {
        Row: {
          max_projects: number
          max_storage_gb: number
          tier_name: string
        }
        Insert: {
          max_projects: number
          max_storage_gb: number
          tier_name: string
        }
        Update: {
          max_projects?: number
          max_storage_gb?: number
          tier_name?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string
          description: string
          id: string
          priority: string
          resolution_notes: string | null
          status: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          priority?: string
          resolution_notes?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          priority?: string
          resolution_notes?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assignee_id: string | null
          created_at: string
          created_by: string
          description: string | null
          due_date: string | null
          id: string
          priority: string
          project_id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          project_id: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          project_id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_dependencies: {
        Row: {
          dep_type: Database["public"]["Enums"]["dependency_type"] | null
          id: string
          lag_days: number | null
          predecessor_id: string | null
          successor_id: string | null
        }
        Insert: {
          dep_type?: Database["public"]["Enums"]["dependency_type"] | null
          id?: string
          lag_days?: number | null
          predecessor_id?: string | null
          successor_id?: string | null
        }
        Update: {
          dep_type?: Database["public"]["Enums"]["dependency_type"] | null
          id?: string
          lag_days?: number | null
          predecessor_id?: string | null
          successor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timeline_dependencies_predecessor_id_fkey"
            columns: ["predecessor_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_dependencies_successor_id_fkey"
            columns: ["successor_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_scenarios: {
        Row: {
          created_at: string | null
          id: string
          name: string
          payload: Json | null
          project_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          payload?: Json | null
          project_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          payload?: Json | null
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timeline_scenarios_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      transmittal_recipients: {
        Row: {
          legally_binding: boolean | null
          read_at: string | null
          recipient_id: string
          transmittal_id: string
        }
        Insert: {
          legally_binding?: boolean | null
          read_at?: string | null
          recipient_id: string
          transmittal_id: string
        }
        Update: {
          legally_binding?: boolean | null
          read_at?: string | null
          recipient_id?: string
          transmittal_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transmittal_recipients_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transmittal_recipients_transmittal_id_fkey"
            columns: ["transmittal_id"]
            isOneToOne: false
            referencedRelation: "transmittals"
            referencedColumns: ["id"]
          },
        ]
      }
      transmittals: {
        Row: {
          id: string
          payload: Json | null
          project_id: string | null
          sender_id: string | null
          sent_at: string | null
          subject: string
        }
        Insert: {
          id?: string
          payload?: Json | null
          project_id?: string | null
          sender_id?: string | null
          sent_at?: string | null
          subject: string
        }
        Update: {
          id?: string
          payload?: Json | null
          project_id?: string | null
          sender_id?: string | null
          sent_at?: string | null
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "transmittals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transmittals_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
        ]
      }
      turnstile_logs: {
        Row: {
          created_at: string | null
          entry_time: string
          exit_time: string | null
          id: string
          project_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          entry_time?: string
          exit_time?: string | null
          id?: string
          project_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          entry_time?: string
          exit_time?: string | null
          id?: string
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "turnstile_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "turnstile_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
        ]
      }
      union_compliance_rules: {
        Row: {
          id: string
          max_hours: number | null
          required_break_mins: number | null
          trade_name: string
        }
        Insert: {
          id?: string
          max_hours?: number | null
          required_break_mins?: number | null
          trade_name: string
        }
        Update: {
          id?: string
          max_hours?: number | null
          required_break_mins?: number | null
          trade_name?: string
        }
        Relationships: []
      }
      updates: {
        Row: {
          ai_analysis_flags: Json | null
          approval_status: string | null
          author_id: string
          caption: string | null
          created_at: string | null
          id: string
          is_watermarked: boolean | null
          latitude: number | null
          location_name: string | null
          longitude: number | null
          milestone_id: string | null
          project_id: string
          weather_data: Json | null
        }
        Insert: {
          ai_analysis_flags?: Json | null
          approval_status?: string | null
          author_id: string
          caption?: string | null
          created_at?: string | null
          id?: string
          is_watermarked?: boolean | null
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          milestone_id?: string | null
          project_id: string
          weather_data?: Json | null
        }
        Update: {
          ai_analysis_flags?: Json | null
          approval_status?: string | null
          author_id?: string
          caption?: string | null
          created_at?: string | null
          id?: string
          is_watermarked?: boolean | null
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          milestone_id?: string | null
          project_id?: string
          weather_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "updates_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "updates_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "updates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_actor: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          employment_type: string | null
          failed_login_attempts: number | null
          hourly_rate: number | null
          id: string
          is_active: boolean | null
          lockout_until: string | null
          organization_id: string | null
          phone_number: string | null
          rfid_badge_id: string | null
          role: string
          skills: string[] | null
          user_preferences: Json | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          employment_type?: string | null
          failed_login_attempts?: number | null
          hourly_rate?: number | null
          id: string
          is_active?: boolean | null
          lockout_until?: string | null
          organization_id?: string | null
          phone_number?: string | null
          rfid_badge_id?: string | null
          role?: string
          skills?: string[] | null
          user_preferences?: Json | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          employment_type?: string | null
          failed_login_attempts?: number | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          lockout_until?: string | null
          organization_id?: string | null
          phone_number?: string | null
          rfid_badge_id?: string | null
          role?: string
          skills?: string[] | null
          user_preferences?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "user_actor_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_billing_rates: {
        Row: {
          effective_date: string
          hourly_rate: number
          id: string
          user_id: string | null
        }
        Insert: {
          effective_date: string
          hourly_rate: number
          id?: string
          user_id?: string | null
        }
        Update: {
          effective_date?: string
          hourly_rate?: number
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_billing_rates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
        ]
      }
      user_certifications: {
        Row: {
          cert_type: string
          expiry_date: string | null
          file_url: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          cert_type: string
          expiry_date?: string | null
          file_url?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          cert_type?: string
          expiry_date?: string | null
          file_url?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_certifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
        ]
      }
      user_identity: {
        Row: {
          actor_id: string
          biometric_enabled: boolean | null
          email: string | null
          full_name: string
          password_hash: string
          phone: string | null
        }
        Insert: {
          actor_id: string
          biometric_enabled?: boolean | null
          email?: string | null
          full_name: string
          password_hash: string
          phone?: string | null
        }
        Update: {
          actor_id?: string
          biometric_enabled?: boolean | null
          email?: string | null
          full_name?: string
          password_hash?: string
          phone?: string | null
        }
        Relationships: []
      }
      vendor_invoices: {
        Row: {
          amount: number | null
          billed_hours: number | null
          created_at: string | null
          id: string
          project_id: string | null
          status: string | null
          vendor_id: string | null
        }
        Insert: {
          amount?: number | null
          billed_hours?: number | null
          created_at?: string | null
          id?: string
          project_id?: string | null
          status?: string | null
          vendor_id?: string | null
        }
        Update: {
          amount?: number | null
          billed_hours?: number | null
          created_at?: string | null
          id?: string
          project_id?: string | null
          status?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_invoices_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "user_actor"
            referencedColumns: ["id"]
          },
        ]
      }
      video_exports: {
        Row: {
          created_at: string | null
          file_url: string | null
          id: string
          project_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          file_url?: string | null
          id?: string
          project_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          file_url?: string | null
          id?: string
          project_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_exports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      virus_scan_results: {
        Row: {
          file_id: string
          id: string
          is_clean: boolean
          scanned_at: string | null
          threats_found: string | null
        }
        Insert: {
          file_id: string
          id?: string
          is_clean: boolean
          scanned_at?: string | null
          threats_found?: string | null
        }
        Update: {
          file_id?: string
          id?: string
          is_clean?: boolean
          scanned_at?: string | null
          threats_found?: string | null
        }
        Relationships: []
      }
      weather_logs: {
        Row: {
          created_at: string | null
          delay_triggered: boolean | null
          id: string
          log_date: string
          precipitation_mm: number | null
          project_id: string | null
        }
        Insert: {
          created_at?: string | null
          delay_triggered?: boolean | null
          id?: string
          log_date: string
          precipitation_mm?: number | null
          project_id?: string | null
        }
        Update: {
          created_at?: string | null
          delay_triggered?: boolean | null
          id?: string
          log_date?: string
          precipitation_mm?: number | null
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "weather_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_automations: {
        Row: {
          action_type: string
          id: string
          is_active: boolean | null
          payload: Json | null
          project_id: string | null
          trigger_event: string
        }
        Insert: {
          action_type: string
          id?: string
          is_active?: boolean | null
          payload?: Json | null
          project_id?: string | null
          trigger_event: string
        }
        Update: {
          action_type?: string
          id?: string
          is_active?: boolean | null
          payload?: Json | null
          project_id?: string | null
          trigger_event?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_automations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_account_lockout: { Args: { p_email: string }; Returns: Json }
      clear_failed_login: { Args: { p_email: string }; Returns: undefined }
      delete_my_account: { Args: never; Returns: undefined }
      get_auth_user_by_email: { Args: { p_email: string }; Returns: string }
      get_pending_invites: {
        Args: never
        Returns: {
          created_at: string
          email: string
          id: string
        }[]
      }
      is_admin: { Args: never; Returns: boolean }
      is_employee: { Args: never; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
      is_vendor: { Args: never; Returns: boolean }
      record_failed_login: { Args: { p_email: string }; Returns: Json }
    }
    Enums: {
      ack_status: "Acknowledged" | "Needs Discussion"
      department_type: "Mechanical" | "Electrical" | "Software" | "General"
      dependency_type: "FS" | "SS" | "FF" | "SF"
      media_type: "image" | "video" | "document"
      notification_type: "update" | "comment" | "mention" | "project" | "system"
      project_status:
        | "Not Started"
        | "In Progress"
        | "On Hold"
        | "Completed"
        | "Delivered"
      project_type: "Mechanical" | "Electrical" | "Software" | "Combined"
      severity_level: "Low" | "Medium" | "High" | "Critical"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      ack_status: ["Acknowledged", "Needs Discussion"],
      department_type: ["Mechanical", "Electrical", "Software", "General"],
      dependency_type: ["FS", "SS", "FF", "SF"],
      media_type: ["image", "video", "document"],
      notification_type: ["update", "comment", "mention", "project", "system"],
      project_status: [
        "Not Started",
        "In Progress",
        "On Hold",
        "Completed",
        "Delivered",
      ],
      project_type: ["Mechanical", "Electrical", "Software", "Combined"],
      severity_level: ["Low", "Medium", "High", "Critical"],
    },
  },
} as const
