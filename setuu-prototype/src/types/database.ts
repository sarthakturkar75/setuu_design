export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_identity: {
        Row: {
          actor_id: string
          email: string | null
          phone: string | null
          full_name: string
          password_hash: string
          biometric_enabled: boolean | null
        }
        Insert: {
          actor_id?: string
          email?: string | null
          phone?: string | null
          full_name: string
          password_hash: string
          biometric_enabled?: boolean | null
        }
        Update: {
          actor_id?: string
          email?: string | null
          phone?: string | null
          full_name?: string
          password_hash?: string
          biometric_enabled?: boolean | null
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          type: string
          created_at: string | null
          max_projects: number
          subscription_tier: string
          status: string | null
        }
        Insert: {
          id?: string
          name: string
          type: string
          created_at?: string | null
          max_projects: number
          subscription_tier: string
          status?: string | null
        }
        Update: {
          id?: string
          name?: string
          type?: string
          created_at?: string | null
          max_projects?: number
          subscription_tier?: string
          status?: string | null
        }
      }
      user_actor: {
        Row: {
          id: string
          role: string
          organization_id: string | null
          created_at: string | null
          display_name: string | null
          is_active: boolean | null
          failed_login_attempts: number | null
          lockout_until: string | null
          bio: string | null
          avatar_url: string | null
        }
        Insert: {
          id?: string
          role: string
          organization_id?: string | null
          created_at?: string | null
          display_name?: string | null
          is_active?: boolean | null
          failed_login_attempts?: number | null
          lockout_until?: string | null
          bio?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          role?: string
          organization_id?: string | null
          created_at?: string | null
          display_name?: string | null
          is_active?: boolean | null
          failed_login_attempts?: number | null
          lockout_until?: string | null
          bio?: string | null
          avatar_url?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          client_org_id: string | null
          assigned_pm_id: string | null
          status: string
          created_at: string | null
          start_date: string | null
          type: string | null
          tags: string | null
          is_archived: boolean | null
          contract_value: number | null
          client_visibility: string | null
          po_reference: string | null
          target_date: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          client_org_id?: string | null
          assigned_pm_id?: string | null
          status: string
          created_at?: string | null
          start_date?: string | null
          type?: string | null
          tags?: string | null
          is_archived?: boolean | null
          contract_value?: number | null
          client_visibility?: string | null
          po_reference?: string | null
          target_date?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          client_org_id?: string | null
          assigned_pm_id?: string | null
          status?: string
          created_at?: string | null
          start_date?: string | null
          type?: string | null
          tags?: string | null
          is_archived?: boolean | null
          contract_value?: number | null
          client_visibility?: string | null
          po_reference?: string | null
          target_date?: string | null
        }
      }
      milestones: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          target_date: string | null
          completion_status: boolean | null
          weight_percent: number | null
          department: string | null
          created_at: string | null
          display_order: number | null
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          target_date?: string | null
          completion_status?: boolean | null
          weight_percent?: number | null
          department?: string | null
          created_at?: string | null
          display_order?: number | null
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          target_date?: string | null
          completion_status?: boolean | null
          weight_percent?: number | null
          department?: string | null
          created_at?: string | null
          display_order?: number | null
        }
      }
      updates: {
        Row: {
          id: string
          project_id: string
          milestone_id: string | null
          author_id: string
          caption: string | null
          location_name: string | null
          created_at: string | null
          latitude: number | null
          longitude: number | null
          is_watermarked: boolean | null
          approval_status: string | null
        }
        Insert: {
          id?: string
          project_id: string
          milestone_id?: string | null
          author_id: string
          caption?: string | null
          location_name?: string | null
          created_at?: string | null
          latitude?: number | null
          longitude?: number | null
          is_watermarked?: boolean | null
          approval_status?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          milestone_id?: string | null
          author_id?: string
          caption?: string | null
          location_name?: string | null
          created_at?: string | null
          latitude?: number | null
          longitude?: number | null
          is_watermarked?: boolean | null
          approval_status?: string | null
        }
      }
      media_attachments: {
        Row: {
          id: string
          update_id: string
          type: string
          url: string
          file_name: string
          file_size_bytes: number | null
          mime_type: string | null
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          update_id: string
          type: string
          url: string
          file_name: string
          file_size_bytes?: number | null
          mime_type?: string | null
          uploaded_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          update_id?: string
          type?: string
          url?: string
          file_name?: string
          file_size_bytes?: number | null
          mime_type?: string | null
          uploaded_by?: string | null
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          update_id: string
          author_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          update_id: string
          author_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          update_id?: string
          author_id?: string
          content?: string
          created_at?: string
        }
      }
      comment_mentions: {
        Row: {
          id: string
          comment_id: string
          mentioned_user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          comment_id: string
          mentioned_user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          comment_id?: string
          mentioned_user_id?: string
          created_at?: string
        }
      }
      acknowledgements: {
        Row: {
          id: string
          update_id: string
          client_id: string
          status: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          update_id: string
          client_id: string
          status: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          update_id?: string
          client_id?: string
          status?: string
          notes?: string | null
          created_at?: string
        }
      }
      push_tokens: {
        Row: {
          id: string
          user_id: string
          token: string
          platform: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          token: string
          platform: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          token?: string
          platform?: string
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          body: string
          type: string
          reference_id: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          body: string
          type: string
          reference_id?: string | null
          is_read: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          body?: string
          type?: string
          reference_id?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      project_materials: {
        Row: {
          id: string
          project_id: string
          item_name: string
          quantity: number
          status: string
          estimated_delivery: string | null
          actual_delivery: string | null
          created_by: string | null
          created_at: string | null
          po_number: string | null
          spec_id: string | null
          supplier_name: string | null
          lead_time: string | null
          tracking_timeline: Json | null
          expected_arrival_date: string | null
          vendor_id: string | null
        }
        Insert: {
          id?: string
          project_id: string
          item_name: string
          quantity: number
          status: string
          estimated_delivery?: string | null
          actual_delivery?: string | null
          created_by?: string | null
          created_at?: string | null
          po_number?: string | null
          spec_id?: string | null
          supplier_name?: string | null
          lead_time?: string | null
          tracking_timeline?: Json | null
          expected_arrival_date?: string | null
          vendor_id?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          item_name?: string
          quantity?: number
          status?: string
          estimated_delivery?: string | null
          actual_delivery?: string | null
          created_by?: string | null
          created_at?: string | null
          po_number?: string | null
          spec_id?: string | null
          supplier_name?: string | null
          lead_time?: string | null
          tracking_timeline?: Json | null
          expected_arrival_date?: string | null
          vendor_id?: string | null
        }
      }
      project_issues: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          severity: string
          status: string
          assigned_to: string | null
          created_by: string | null
          created_at: string | null
          resolved_at: string | null
          display_id: string | null
          root_cause: string | null
          timeline_impact: string | null
          cost_impact: string | null
          resolution_plan: Json | null
          linked_milestones: Json | null
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          severity: string
          status: string
          assigned_to?: string | null
          created_by?: string | null
          created_at?: string | null
          resolved_at?: string | null
          display_id?: string | null
          root_cause?: string | null
          timeline_impact?: string | null
          cost_impact?: string | null
          resolution_plan?: Json | null
          linked_milestones?: Json | null
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          severity?: string
          status?: string
          assigned_to?: string | null
          created_by?: string | null
          created_at?: string | null
          resolved_at?: string | null
          display_id?: string | null
          root_cause?: string | null
          timeline_impact?: string | null
          cost_impact?: string | null
          resolution_plan?: Json | null
          linked_milestones?: Json | null
        }
      }
      change_requests: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          cost_impact: number | null
          time_impact_days: number | null
          status: string
          approved_by: string | null
          created_by: string | null
          created_at: string | null
          display_id: string | null
          approval_workflow: Json | null
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          cost_impact?: number | null
          time_impact_days?: number | null
          status: string
          approved_by?: string | null
          created_by?: string | null
          created_at?: string | null
          display_id?: string | null
          approval_workflow?: Json | null
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          cost_impact?: number | null
          time_impact_days?: number | null
          status?: string
          approved_by?: string | null
          created_by?: string | null
          created_at?: string | null
          display_id?: string | null
          approval_workflow?: Json | null
        }
      }
      project_resources: {
        Row: {
          id: string
          project_id: string
          resource_type: string
          name: string
          allocated_hours: number | null
          productivity_score: number | null
          notes: string | null
          created_by: string | null
          created_at: string | null
          actual_hours: number | null
          current_assignment: string | null
        }
        Insert: {
          id?: string
          project_id: string
          resource_type: string
          name: string
          allocated_hours?: number | null
          productivity_score?: number | null
          notes?: string | null
          created_by?: string | null
          created_at?: string | null
          actual_hours?: number | null
          current_assignment?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          resource_type?: string
          name?: string
          allocated_hours?: number | null
          productivity_score?: number | null
          notes?: string | null
          created_by?: string | null
          created_at?: string | null
          actual_hours?: number | null
          current_assignment?: string | null
        }
      }
      client_approvals: {
        Row: {
          id: string
          project_id: string
          document_title: string
          document_url: string | null
          status: string
          comments: string | null
          approved_by: string | null
          created_by: string | null
          created_at: string | null
          actioned_at: string | null
          display_id: string | null
          milestone_name: string | null
          final_authority: Json | null
          attached_documents: Json | null
          approval_timeline: Json | null
        }
        Insert: {
          id?: string
          project_id: string
          document_title: string
          document_url?: string | null
          status: string
          comments?: string | null
          approved_by?: string | null
          created_by?: string | null
          created_at?: string | null
          actioned_at?: string | null
          display_id?: string | null
          milestone_name?: string | null
          final_authority?: Json | null
          attached_documents?: Json | null
          approval_timeline?: Json | null
        }
        Update: {
          id?: string
          project_id?: string
          document_title?: string
          document_url?: string | null
          status?: string
          comments?: string | null
          approved_by?: string | null
          created_by?: string | null
          created_at?: string | null
          actioned_at?: string | null
          display_id?: string | null
          milestone_name?: string | null
          final_authority?: Json | null
          attached_documents?: Json | null
          approval_timeline?: Json | null
        }
      }
      lessons_learned: {
        Row: {
          id: string
          project_id: string
          category: string
          description: string
          impact: string | null
          recommendation: string | null
          created_by: string | null
          created_at: string | null
          display_id: string | null
          title: string | null
          root_cause: string | null
          related_media: Json | null
        }
        Insert: {
          id?: string
          project_id: string
          category: string
          description: string
          impact?: string | null
          recommendation?: string | null
          created_by?: string | null
          created_at?: string | null
          display_id?: string | null
          title?: string | null
          root_cause?: string | null
          related_media?: Json | null
        }
        Update: {
          id?: string
          project_id?: string
          category?: string
          description?: string
          impact?: string | null
          recommendation?: string | null
          created_by?: string | null
          created_at?: string | null
          display_id?: string | null
          title?: string | null
          root_cause?: string | null
          related_media?: Json | null
        }
      }
      project_handovers: {
        Row: {
          id: string
          project_id: string
          package_name: string
          document_url: string | null
          warranty_expiry: string | null
          status: string
          client_signature_url: string | null
          created_by: string | null
          created_at: string | null
          display_id: string | null
          description: string | null
          key_attributes: Json | null
          package_contents: Json | null
          sign_off_status: Json | null
        }
        Insert: {
          id?: string
          project_id: string
          package_name: string
          document_url?: string | null
          warranty_expiry?: string | null
          status: string
          client_signature_url?: string | null
          created_by?: string | null
          created_at?: string | null
          display_id?: string | null
          description?: string | null
          key_attributes?: Json | null
          package_contents?: Json | null
          sign_off_status?: Json | null
        }
        Update: {
          id?: string
          project_id?: string
          package_name?: string
          document_url?: string | null
          warranty_expiry?: string | null
          status?: string
          client_signature_url?: string | null
          created_by?: string | null
          created_at?: string | null
          display_id?: string | null
          description?: string | null
          key_attributes?: Json | null
          package_contents?: Json | null
          sign_off_status?: Json | null
        }
      }
      client_meetings: {
        Row: {
          id: string
          project_id: string
          title: string
          meeting_date: string
          attendees: string | null
          minutes_url: string | null
          action_items: string | null
          created_by: string | null
          created_at: string | null
          status: string | null
          description: string | null
          key_attributes: Json | null
          attendees_list: Json | null
          agenda_minutes: Json | null
          action_items_list: Json | null
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          meeting_date: string
          attendees?: string | null
          minutes_url?: string | null
          action_items?: string | null
          created_by?: string | null
          created_at?: string | null
          status?: string | null
          description?: string | null
          key_attributes?: Json | null
          attendees_list?: Json | null
          agenda_minutes?: Json | null
          action_items_list?: Json | null
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          meeting_date?: string
          attendees?: string | null
          minutes_url?: string | null
          action_items?: string | null
          created_by?: string | null
          created_at?: string | null
          status?: string | null
          description?: string | null
          key_attributes?: Json | null
          attendees_list?: Json | null
          agenda_minutes?: Json | null
          action_items_list?: Json | null
        }
      }
      audit_log: {
        Row: {
          id: string
          user_id: string | null
          event_type: string
          table_name: string
          resource_id: string
          old_data: Json | null
          new_data: Json | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          event_type: string
          table_name: string
          resource_id: string
          old_data?: Json | null
          new_data?: Json | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          event_type?: string
          table_name?: string
          resource_id?: string
          old_data?: Json | null
          new_data?: Json | null
          ip_address?: string | null
          created_at?: string
        }
      }
      milestone_checklist_items: {
        Row: {
          id: string
          milestone_id: string
          title: string
          is_complete: boolean
          display_order: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          milestone_id: string
          title: string
          is_complete: boolean
          display_order: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          milestone_id?: string
          title?: string
          is_complete?: boolean
          display_order?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      drawing_versions: {
        Row: {
          id: string
          project_id: string
          drawing_name: string
          version_number: number
          file_url: string
          file_size_bytes: number | null
          description: string | null
          status: string
          uploaded_by: string | null
          approved_by: string | null
          created_at: string
          drawing_id: string | null
        }
        Insert: {
          id?: string
          project_id: string
          drawing_name: string
          version_number: number
          file_url: string
          file_size_bytes?: number | null
          description?: string | null
          status: string
          uploaded_by?: string | null
          approved_by?: string | null
          created_at?: string
          drawing_id?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          drawing_name?: string
          version_number?: number
          file_url?: string
          file_size_bytes?: number | null
          description?: string | null
          status?: string
          uploaded_by?: string | null
          approved_by?: string | null
          created_at?: string
          drawing_id?: string | null
        }
      }
      project_config: {
        Row: {
          id: string
          project_id: string
          module_name: string
          is_enabled: boolean
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          module_name: string
          is_enabled: boolean
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          module_name?: string
          is_enabled?: boolean
          updated_by?: string | null
          updated_at?: string
        }
      }
      project_reports: {
        Row: {
          id: string
          project_id: string | null
          report_data: string
          generated_at: string | null
        }
        Insert: {
          id?: string
          project_id?: string | null
          report_data: string
          generated_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string | null
          report_data?: string
          generated_at?: string | null
        }
      }
      duplicate_files: {
        Row: {
          id: string
          original_file_id: string
          duplicate_file_id: string
          similarity_score: number
          status: string
        }
        Insert: {
          id?: string
          original_file_id: string
          duplicate_file_id: string
          similarity_score: number
          status: string
        }
        Update: {
          id?: string
          original_file_id?: string
          duplicate_file_id?: string
          similarity_score?: number
          status?: string
        }
      }
      virus_scan_results: {
        Row: {
          id: string
          file_id: string
          is_clean: boolean
          threats_found: string | null
          scanned_at: string | null
        }
        Insert: {
          id?: string
          file_id: string
          is_clean: boolean
          threats_found?: string | null
          scanned_at?: string | null
        }
        Update: {
          id?: string
          file_id?: string
          is_clean?: boolean
          threats_found?: string | null
          scanned_at?: string | null
        }
      }
      support_tickets: {
        Row: {
          id: string
          title: string
          description: string
          priority: string
          user_id: string | null
          created_at: string
          status: string
          resolution_notes: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          priority: string
          user_id?: string | null
          created_at?: string
          status: string
          resolution_notes?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          priority?: string
          user_id?: string | null
          created_at?: string
          status?: string
          resolution_notes?: string | null
          updated_at?: string
        }
      }
      subscription_tiers: {
        Row: {
          tier_name: string
          max_storage_gb: number
          max_projects: number
        }
        Insert: {
          tier_name?: string
          max_storage_gb: number
          max_projects: number
        }
        Update: {
          tier_name?: string
          max_storage_gb?: number
          max_projects?: number
        }
      }
      platform_settings: {
        Row: {
          id: string
          maintenance_mode: boolean
          min_android_version: string | null
          global_announcement: string | null
        }
        Insert: {
          id?: string
          maintenance_mode: boolean
          min_android_version?: string | null
          global_announcement?: string | null
        }
        Update: {
          id?: string
          maintenance_mode?: boolean
          min_android_version?: string | null
          global_announcement?: string | null
        }
      }
      break_glass_logs: {
        Row: {
          id: string
          super_admin_id: string
          target_org_id: string
          reason: string
          duration_minutes: number
          created_at: string
        }
        Insert: {
          id?: string
          super_admin_id: string
          target_org_id: string
          reason: string
          duration_minutes: number
          created_at?: string
        }
        Update: {
          id?: string
          super_admin_id?: string
          target_org_id?: string
          reason?: string
          duration_minutes?: number
          created_at?: string
        }
      }
      org_vendors: {
        Row: {
          id: string
          organization_id: string
          vendor_id: string
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          vendor_id: string
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          vendor_id?: string
          created_at?: string
        }
      }
      project_vendors: {
        Row: {
          id: string
          project_id: string
          vendor_id: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          vendor_id: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          vendor_id?: string
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          assignee_id: string | null
          created_by: string
          title: string
          description: string | null
          status: string
          priority: string
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          assignee_id?: string | null
          created_by: string
          title: string
          description?: string | null
          status: string
          priority: string
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          assignee_id?: string | null
          created_by?: string
          title?: string
          description?: string | null
          status?: string
          priority?: string
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      employee_timesheets: {
        Row: {
          id: string
          user_id: string
          project_id: string
          organization_id: string
          work_date: string
          start_time: string
          end_time: string
          hours_logged: number
          status: string | null
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          organization_id: string
          work_date: string
          start_time: string
          end_time: string
          hours_logged: number
          status?: string | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          organization_id?: string
          work_date?: string
          start_time?: string
          end_time?: string
          hours_logged?: number
          status?: string | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      client_meeting_agendas: {
        Row: {
          id: string
          meeting_id: string
          topic: string
          duration: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          meeting_id: string
          topic: string
          duration?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          meeting_id?: string
          topic?: string
          duration?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      invoices: {
        Row: {
          id: string
          vendor_id: string
          project_id: string
          invoice_number: string
          amount: number
          currency: string | null
          status: string
          due_date: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          vendor_id: string
          project_id: string
          invoice_number: string
          amount: number
          currency?: string | null
          status: string
          due_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          vendor_id?: string
          project_id?: string
          invoice_number?: string
          amount?: number
          currency?: string | null
          status?: string
          due_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      scheduled_reports: {
        Row: {
          id: string
          name: string
          format: string
          schedule: string
          next_run: string | null
          created_at: string | null
          created_by: string | null
          project_id: string | null
          parameters: any | null
        }
        Insert: {
          id?: string
          name: string
          format: string
          schedule: string
          next_run?: string | null
          created_at?: string | null
          created_by?: string | null
          project_id?: string | null
          parameters?: any | null
        }
        Update: {
          id?: string
          name?: string
          format?: string
          schedule?: string
          next_run?: string | null
          created_at?: string | null
          created_by?: string | null
          project_id?: string | null
          parameters?: any | null
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
      project_type: 'commercial' | 'residential' | 'industrial' | 'infrastructure'
      project_status: 'draft' | 'active' | 'on_hold' | 'completed' | 'archived'
      department_type: 'civil' | 'electrical' | 'mechanical' | 'plumbing' | 'architectural'
      media_type: 'image' | 'video' | 'document' | 'pdf' | 'cad'
      ack_status: 'pending' | 'acknowledged' | 'disputed'
      notification_type: 'mention' | 'update' | 'alert' | 'system' | 'approval'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
