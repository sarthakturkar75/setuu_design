# Remote Database Dump

*Generated at: 2026-08-17T16:59:48.068Z*

This document contains a complete snapshot of the remote Supabase database's schema and current data.

---

## Table: `acknowledgements`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| update_id | uuid |
| client_id | uuid |
| status | USER-DEFINED |
| notes | text |
| created_at | timestamp with time zone |

### Data (1 rows)
| id | update_id | client_id | status | notes | created_at |
| --- | --- | --- | --- | --- | --- |
| \|e\|8\|4\|f\|d\|6\|f\|8\|-\|5\|6\|7\|4\|-\|4\|9\|d\|d\|-\|b\|8\|2\|c\|-\|0\|5\|1\|5\|3\|1\|3\|5\|b\|f\|8\|0\| | \|6\|8\|7\|f\|4\|3\|5\|b\|-\|0\|a\|c\|b\|-\|4\|0\|b\|9\|-\|a\|6\|8\|c\|-\|0\|3\|9\|0\|5\|a\|6\|0\|f\|4\|4\|1\| | \|1\|b\|3\|e\|a\|d\|9\|6\|-\|5\|6\|e\|1\|-\|4\|7\|a\|b\|-\|9\|7\|e\|1\|-\|6\|f\|e\|6\|c\|5\|5\|9\|5\|8\|3\|b\| | \|A\|c\|k\|n\|o\|w\|l\|e\|d\|g\|e\|d\| | \|S\|e\|e\|n\| \|b\|y\| \|c\|l\|i\|e\|n\|t\| | "2026-08-08T05:41:58.703Z" |

---

## Table: `audit_log`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| user_id | uuid |
| event_type | text |
| table_name | text |
| resource_id | uuid |
| old_data | jsonb |
| new_data | jsonb |
| ip_address | text |
| created_at | timestamp with time zone |

### Data (61 rows)
| id | user_id | event_type | table_name | resource_id | old_data | new_data | ip_address | created_at |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| \|f\|f\|f\|9\|c\|9\|d\|9\|-\|0\|5\|3\|3\|-\|4\|6\|a\|b\|-\|b\|0\|6\|d\|-\|a\|8\|d\|7\|0\|7\|b\|b\|3\|d\|6\|6\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|p\|r\|o\|j\|e\|c\|t\|s\| | \|3\|7\|6\|d\|1\|a\|9\|f\|-\|b\|d\|a\|4\|-\|4\|7\|5\|0\|-\|a\|7\|3\|d\|-\|9\|9\|3\|c\|b\|c\|5\|6\|6\|7\|a\|7\| | *null* | {"id":"376d1a9f-bda4-4750-a73d-993cbc5667a7","name":"Acme Headquarters","tags":["commercial","hq"],"type":"Combined","status":"In Progress","created_at":"2026-08-08T04:57:44.979494+00:00","start_date":"2026-08-08","description":"New HQ building for Acme Corp","is_archived":false,"target_date":"2027-08-08","po_reference":"PO-ACME-001","client_org_id":"001a74b2-a099-4c27-814c-7d923ea6a690","assigned_pm_id":"96e9fc3d-1455-4fdf-a861-19fdd3458373","contract_value":5000000,"client_visibility":"Full Transparency"} | *null* | "2026-08-08T04:57:44.979Z" |
| \|5\|c\|e\|a\|d\|6\|4\|c\|-\|3\|f\|6\|4\|-\|4\|7\|2\|e\|-\|8\|7\|e\|9\|-\|d\|0\|6\|6\|a\|8\|f\|d\|2\|e\|d\|3\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|p\|r\|o\|j\|e\|c\|t\|s\| | \|7\|2\|5\|a\|2\|b\|6\|9\|-\|5\|2\|a\|f\|-\|4\|5\|6\|b\|-\|a\|2\|4\|2\|-\|c\|5\|3\|9\|3\|9\|3\|6\|e\|b\|9\|f\| | *null* | {"id":"725a2b69-52af-456b-a242-c5393936eb9f","name":"Acme Warehouse","tags":["warehouse"],"type":"Mechanical","status":"Not Started","created_at":"2026-08-08T04:57:44.979494+00:00","start_date":"2026-09-07","description":"New warehouse for Acme Corp","is_archived":false,"target_date":"2027-02-04","po_reference":"PO-ACME-002","client_org_id":"001a74b2-a099-4c27-814c-7d923ea6a690","assigned_pm_id":"d63ab6da-e46c-417e-af78-114910b5aeeb","contract_value":1500000,"client_visibility":"Restricted"} | *null* | "2026-08-08T04:57:44.979Z" |
| \|1\|d\|0\|7\|a\|2\|5\|2\|-\|7\|4\|7\|9\|-\|4\|3\|f\|3\|-\|9\|0\|2\|e\|-\|1\|8\|c\|8\|0\|4\|9\|4\|d\|8\|2\|c\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|m\|i\|l\|e\|s\|t\|o\|n\|e\|s\| | \|a\|9\|b\|6\|c\|c\|9\|8\|-\|6\|c\|9\|e\|-\|4\|0\|e\|0\|-\|a\|4\|e\|0\|-\|0\|0\|3\|a\|6\|5\|7\|0\|2\|8\|9\|3\| | *null* | {"id":"a9b6cc98-6c9e-40e0-a4e0-003a65702893","title":"Foundation Completeness","created_at":"2026-08-08T04:57:44.979494+00:00","department":"Civil","project_id":"376d1a9f-bda4-4750-a73d-993cbc5667a7","description":"Foundation laid and cured","target_date":"2026-09-07T00:00:00+00:00","display_order":1,"weight_percent":15,"completion_status":false} | *null* | "2026-08-08T04:57:44.979Z" |
| \|e\|a\|4\|2\|d\|8\|f\|d\|-\|4\|8\|c\|1\|-\|4\|b\|7\|4\|-\|9\|e\|a\|1\|-\|4\|8\|9\|1\|a\|0\|0\|7\|e\|a\|9\|a\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|m\|i\|l\|e\|s\|t\|o\|n\|e\|s\| | \|4\|e\|e\|b\|8\|d\|e\|2\|-\|f\|2\|4\|9\|-\|4\|b\|d\|f\|-\|9\|d\|d\|6\|-\|f\|b\|8\|c\|c\|5\|6\|6\|0\|3\|7\|5\| | *null* | {"id":"4eeb8de2-f249-4bdf-9dd6-fb8cc5660375","title":"Structural Framing","created_at":"2026-08-08T04:57:44.979494+00:00","department":"Structural","project_id":"376d1a9f-bda4-4750-a73d-993cbc5667a7","description":"Steel and concrete framing complete","target_date":"2026-11-06T00:00:00+00:00","display_order":2,"weight_percent":25,"completion_status":false} | *null* | "2026-08-08T04:57:44.979Z" |
| \|3\|c\|a\|2\|9\|7\|5\|f\|-\|d\|f\|1\|5\|-\|4\|c\|4\|8\|-\|9\|4\|a\|2\|-\|7\|8\|e\|3\|7\|2\|9\|3\|5\|8\|6\|8\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|u\|p\|d\|a\|t\|e\|s\| | \|8\|d\|2\|2\|0\|6\|8\|0\|-\|b\|f\|e\|e\|-\|4\|8\|9\|5\|-\|a\|2\|e\|c\|-\|8\|2\|1\|3\|9\|1\|c\|a\|8\|0\|9\|2\| | *null* | {"id":"8d220680-bfee-4895-a2ec-821391ca8092","caption":"Foundation digging started","latitude":40.7128,"author_id":"96e9fc3d-1455-4fdf-a861-19fdd3458373","longitude":-74.006,"created_at":"2026-08-08T04:57:44.979494+00:00","project_id":"376d1a9f-bda4-4750-a73d-993cbc5667a7","milestone_id":"a9b6cc98-6c9e-40e0-a4e0-003a65702893","location_name":"Site A North","is_watermarked":true,"approval_status":"Approved"} | *null* | "2026-08-08T04:57:44.979Z" |
| \|f\|0\|1\|b\|1\|1\|4\|c\|-\|7\|6\|7\|d\|-\|4\|1\|6\|f\|-\|9\|9\|c\|7\|-\|6\|a\|8\|e\|4\|e\|9\|8\|2\|a\|8\|3\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|u\|p\|d\|a\|t\|e\|s\| | \|2\|3\|e\|a\|1\|c\|f\|0\|-\|a\|8\|2\|a\|-\|4\|2\|e\|2\|-\|8\|9\|f\|8\|-\|2\|0\|1\|a\|9\|3\|b\|0\|8\|c\|4\|4\| | *null* | {"id":"23ea1cf0-a82a-42e2-89f8-201a93b08c44","caption":"Rebar installation","latitude":40.713,"author_id":"96e9fc3d-1455-4fdf-a861-19fdd3458373","longitude":-74.0065,"created_at":"2026-08-08T04:57:44.979494+00:00","project_id":"376d1a9f-bda4-4750-a73d-993cbc5667a7","milestone_id":"a9b6cc98-6c9e-40e0-a4e0-003a65702893","location_name":"Site A East","is_watermarked":false,"approval_status":"Submitted"} | *null* | "2026-08-08T04:57:44.979Z" |
| \|d\|d\|c\|8\|2\|1\|1\|e\|-\|4\|6\|4\|c\|-\|4\|a\|3\|6\|-\|a\|d\|5\|b\|-\|f\|b\|6\|f\|6\|c\|0\|c\|6\|b\|6\|4\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|p\|r\|o\|j\|e\|c\|t\|_\|m\|a\|t\|e\|r\|i\|a\|l\|s\| | \|9\|f\|5\|c\|a\|5\|d\|6\|-\|2\|a\|2\|8\|-\|4\|2\|a\|7\|-\|b\|3\|2\|a\|-\|2\|8\|c\|f\|6\|0\|e\|7\|e\|a\|8\|d\| | *null* | {"id":"9f5ca5d6-2a28-42a7-b32a-28cf60e7ea8d","status":"Ordered","spec_id":"SPEC-001","quantity":500,"item_name":"Concrete","lead_time":"5 days","po_number":"PO-CON-01","created_at":"2026-08-08T04:57:44.979494+00:00","created_by":"96e9fc3d-1455-4fdf-a861-19fdd3458373","project_id":"376d1a9f-bda4-4750-a73d-993cbc5667a7","supplier_name":"CementCo","actual_delivery":null,"tracking_timeline":[],"estimated_delivery":"2026-08-13","expected_arrival_date":"2026-08-13T00:00:00+00:00"} | *null* | "2026-08-08T04:57:44.979Z" |
| \|3\|b\|6\|4\|1\|b\|0\|4\|-\|3\|b\|3\|2\|-\|4\|6\|2\|5\|-\|8\|e\|c\|1\|-\|7\|7\|1\|7\|f\|0\|9\|f\|a\|a\|8\|c\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|p\|r\|o\|j\|e\|c\|t\|_\|i\|s\|s\|u\|e\|s\| | \|c\|a\|0\|4\|1\|4\|4\|0\|-\|9\|3\|2\|3\|-\|4\|1\|1\|6\|-\|b\|b\|9\|0\|-\|f\|3\|a\|0\|5\|c\|4\|b\|f\|4\|e\|1\| | *null* | {"id":"ca041440-9323-4116-bb90-f3a05c4bf4e1","title":"Weather Delay","status":"Open","severity":"High","created_at":"2026-08-08T04:57:44.979494+00:00","created_by":"96e9fc3d-1455-4fdf-a861-19fdd3458373","display_id":"ISS-001","project_id":"376d1a9f-bda4-4750-a73d-993cbc5667a7","root_cause":"Weather","assigned_to":"96e9fc3d-1455-4fdf-a861-19fdd3458373","cost_impact":"$0","description":"Heavy rain delayed foundation","resolved_at":null,"resolution_plan":[],"timeline_impact":"3 days","linked_milestones":[]} | *null* | "2026-08-08T04:57:44.979Z" |
| \|d\|c\|8\|5\|b\|8\|1\|d\|-\|7\|f\|4\|7\|-\|4\|b\|f\|6\|-\|a\|2\|9\|f\|-\|6\|1\|b\|1\|b\|7\|c\|c\|d\|c\|1\|2\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|c\|h\|a\|n\|g\|e\|_\|r\|e\|q\|u\|e\|s\|t\|s\| | \|8\|9\|3\|3\|9\|9\|5\|b\|-\|7\|f\|b\|9\|-\|4\|5\|f\|0\|-\|9\|2\|0\|0\|-\|5\|d\|3\|8\|7\|0\|d\|b\|a\|2\|5\|d\| | *null* | {"id":"8933995b-7fb9-45f0-9200-5d3870dba25d","title":"Upgrade Steel Grade","status":"Pending","created_at":"2026-08-08T04:57:44.979494+00:00","created_by":"96e9fc3d-1455-4fdf-a861-19fdd3458373","display_id":"CR-001","project_id":"376d1a9f-bda4-4750-a73d-993cbc5667a7","approved_by":"d63ab6da-e46c-417e-af78-114910b5aeeb","cost_impact":15000,"description":"Client requested better steel","time_impact_days":2,"approval_workflow":[]} | *null* | "2026-08-08T04:57:44.979Z" |
| \|1\|d\|b\|6\|f\|a\|8\|d\|-\|8\|a\|b\|a\|-\|4\|b\|b\|8\|-\|8\|2\|3\|d\|-\|b\|e\|7\|0\|7\|6\|1\|e\|6\|2\|c\|d\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|p\|r\|o\|j\|e\|c\|t\|_\|r\|e\|s\|o\|u\|r\|c\|e\|s\| | \|9\|a\|3\|6\|b\|4\|5\|9\|-\|9\|c\|9\|0\|-\|4\|7\|6\|1\|-\|9\|2\|3\|5\|-\|b\|7\|c\|8\|1\|2\|d\|4\|8\|7\|2\|2\| | *null* | {"id":"9a36b459-9c90-4761-9235-b7c812d48722","name":"Excavator Team A","notes":"High performance","created_at":"2026-08-08T04:57:44.979494+00:00","created_by":"96e9fc3d-1455-4fdf-a861-19fdd3458373","project_id":"376d1a9f-bda4-4750-a73d-993cbc5667a7","actual_hours":40,"resource_type":"Labor","allocated_hours":160,"current_assignment":"Site A North","productivity_score":5} | *null* | "2026-08-08T04:57:44.979Z" |
| \|b\|2\|1\|c\|4\|1\|7\|2\|-\|1\|8\|a\|0\|-\|4\|1\|b\|c\|-\|8\|b\|2\|2\|-\|4\|e\|c\|1\|d\|5\|5\|7\|c\|d\|a\|6\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|c\|l\|i\|e\|n\|t\|_\|a\|p\|p\|r\|o\|v\|a\|l\|s\| | \|e\|5\|6\|2\|a\|4\|6\|2\|-\|e\|2\|6\|1\|-\|4\|7\|1\|9\|-\|9\|8\|9\|c\|-\|f\|3\|d\|b\|2\|e\|c\|c\|8\|0\|a\|7\| | *null* | {"id":"e562a462-e261-4719-989c-f3db2ecc80a7","status":"Approved","comments":"Looks fine","created_at":"2026-08-08T04:57:44.979494+00:00","created_by":"96e9fc3d-1455-4fdf-a861-19fdd3458373","display_id":"APP-001","project_id":"376d1a9f-bda4-4750-a73d-993cbc5667a7","actioned_at":"2026-08-08T04:57:44.979494+00:00","approved_by":"c1e629c9-0474-4597-a77d-a1019bc71a37","document_url":"https://docs.url/foundation.pdf","document_title":"Foundation Design Docs","milestone_name":"Foundation Completeness","final_authority":{"role":"Client"},"approval_timeline":[],"attached_documents":[]} | *null* | "2026-08-08T04:57:44.979Z" |
| \|0\|0\|a\|2\|e\|0\|c\|2\|-\|6\|2\|9\|1\|-\|4\|c\|3\|b\|-\|b\|f\|b\|a\|-\|f\|4\|3\|b\|2\|4\|5\|f\|3\|9\|7\|1\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|l\|e\|s\|s\|o\|n\|s\|_\|l\|e\|a\|r\|n\|e\|d\| | \|c\|e\|f\|e\|0\|7\|9\|7\|-\|3\|8\|5\|a\|-\|4\|3\|4\|3\|-\|b\|2\|0\|1\|-\|8\|2\|2\|e\|d\|6\|6\|1\|3\|9\|e\|0\| | *null* | {"id":"cefe0797-385a-4343-b201-822ed66139e0","title":"Excavation Signage","impact":"Medium","category":"Safety","created_at":"2026-08-08T04:57:44.979494+00:00","created_by":"96e9fc3d-1455-4fdf-a861-19fdd3458373","display_id":"LL-001","project_id":"376d1a9f-bda4-4750-a73d-993cbc5667a7","root_cause":"Oversight","description":"Ensure better signage near excavations","related_media":[],"recommendation":"Add mandatory signage checks"} | *null* | "2026-08-08T04:57:44.979Z" |
| \|2\|1\|c\|3\|b\|f\|7\|5\|-\|7\|7\|d\|1\|-\|4\|9\|8\|3\|-\|9\|a\|8\|f\|-\|d\|1\|6\|7\|4\|4\|1\|a\|1\|f\|6\|2\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|p\|r\|o\|j\|e\|c\|t\|_\|h\|a\|n\|d\|o\|v\|e\|r\|s\| | \|2\|9\|b\|a\|2\|e\|5\|8\|-\|b\|5\|b\|e\|-\|4\|c\|f\|f\|-\|9\|1\|0\|c\|-\|2\|1\|4\|8\|4\|4\|2\|4\|5\|c\|0\|b\| | *null* | {"id":"29ba2e58-b5be-4cff-910c-214844245c0b","status":"Draft","created_at":"2026-08-08T04:57:44.979494+00:00","created_by":"96e9fc3d-1455-4fdf-a861-19fdd3458373","display_id":"HO-001","project_id":"376d1a9f-bda4-4750-a73d-993cbc5667a7","description":"Handover for Foundation","document_url":"https://docs.url/handover1.pdf","package_name":"Phase 1 Handover","key_attributes":[],"sign_off_status":[],"warranty_expiry":"2027-08-08","package_contents":[],"client_signature_url":null} | *null* | "2026-08-08T04:57:44.979Z" |
| \|6\|6\|5\|4\|f\|6\|1\|3\|-\|1\|6\|d\|5\|-\|4\|5\|6\|3\|-\|8\|a\|1\|0\|-\|c\|4\|e\|5\|e\|3\|d\|0\|4\|5\|3\|4\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|c\|l\|i\|e\|n\|t\|_\|m\|e\|e\|t\|i\|n\|g\|s\| | \|0\|4\|5\|b\|2\|5\|c\|0\|-\|6\|8\|8\|5\|-\|4\|4\|1\|8\|-\|b\|f\|2\|7\|-\|a\|3\|6\|0\|0\|9\|4\|5\|e\|e\|4\|a\| | *null* | {"id":"045b25c0-6885-4418-bf27-a3600945ee4a","title":"Kickoff Meeting","status":"Completed","attendees":"Alice, Bob, Charlie","created_at":"2026-08-08T04:57:44.979494+00:00","created_by":"96e9fc3d-1455-4fdf-a861-19fdd3458373","project_id":"376d1a9f-bda4-4750-a73d-993cbc5667a7","description":"Initial kickoff with client","minutes_url":"https://docs.url/minutes1.pdf","action_items":"Finalize designs","meeting_date":"2026-07-29T04:57:44.979494+00:00","agenda_minutes":[],"attendees_list":[],"key_attributes":[],"action_items_list":[]} | *null* | "2026-08-08T04:57:44.979Z" |
| \|0\|6\|2\|7\|5\|c\|b\|4\|-\|d\|c\|c\|9\|-\|4\|7\|3\|e\|-\|9\|a\|2\|7\|-\|9\|6\|4\|b\|3\|b\|b\|2\|5\|e\|e\|5\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|m\|i\|l\|e\|s\|t\|o\|n\|e\|_\|c\|h\|e\|c\|k\|l\|i\|s\|t\|_\|i\|t\|e\|m\|s\| | \|a\|8\|2\|e\|8\|3\|0\|b\|-\|b\|7\|1\|a\|-\|4\|0\|0\|0\|-\|b\|4\|4\|4\|-\|6\|b\|c\|a\|9\|3\|e\|5\|7\|1\|8\|8\| | *null* | {"id":"a82e830b-b71a-4000-b444-6bca93e57188","title":"Site Survey","created_at":"2026-08-08T04:57:44.979494+00:00","created_by":"96e9fc3d-1455-4fdf-a861-19fdd3458373","updated_at":"2026-08-08T04:57:44.979494+00:00","is_complete":true,"milestone_id":"a9b6cc98-6c9e-40e0-a4e0-003a65702893","display_order":1} | *null* | "2026-08-08T04:57:44.979Z" |
| \|2\|8\|1\|4\|0\|4\|1\|f\|-\|a\|8\|3\|a\|-\|4\|c\|4\|c\|-\|b\|8\|6\|f\|-\|e\|9\|a\|c\|f\|f\|b\|7\|8\|c\|9\|4\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|m\|i\|l\|e\|s\|t\|o\|n\|e\|_\|c\|h\|e\|c\|k\|l\|i\|s\|t\|_\|i\|t\|e\|m\|s\| | \|a\|1\|0\|2\|3\|b\|4\|9\|-\|a\|b\|5\|f\|-\|4\|c\|8\|8\|-\|a\|1\|b\|1\|-\|c\|8\|5\|6\|6\|6\|3\|1\|0\|9\|9\|e\| | *null* | {"id":"a1023b49-ab5f-4c88-a1b1-c8566631099e","title":"Permits Obtained","created_at":"2026-08-08T04:57:44.979494+00:00","created_by":"96e9fc3d-1455-4fdf-a861-19fdd3458373","updated_at":"2026-08-08T04:57:44.979494+00:00","is_complete":true,"milestone_id":"a9b6cc98-6c9e-40e0-a4e0-003a65702893","display_order":2} | *null* | "2026-08-08T04:57:44.979Z" |
| \|c\|d\|9\|d\|6\|9\|b\|f\|-\|5\|c\|6\|6\|-\|4\|6\|e\|b\|-\|9\|5\|6\|d\|-\|2\|9\|7\|2\|d\|7\|9\|5\|b\|8\|5\|e\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|d\|r\|a\|w\|i\|n\|g\|_\|v\|e\|r\|s\|i\|o\|n\|s\| | \|f\|d\|f\|9\|4\|b\|d\|2\|-\|0\|b\|f\|5\|-\|4\|9\|7\|5\|-\|8\|3\|e\|7\|-\|1\|7\|f\|1\|1\|b\|c\|9\|2\|a\|3\|9\| | *null* | {"id":"fdf94bd2-0bf5-4975-83e7-17f11bc92a39","status":"Approved","file_url":"https://docs.url/arch_v1.dwg","created_at":"2026-08-08T04:57:44.979494+00:00","drawing_id":"00bc38c3-a7a1-4d5e-aec1-840af280d8c0","project_id":"376d1a9f-bda4-4750-a73d-993cbc5667a7","approved_by":"d63ab6da-e46c-417e-af78-114910b5aeeb","description":"Initial draft","uploaded_by":"96e9fc3d-1455-4fdf-a861-19fdd3458373","drawing_name":"Architectural Plan V1","version_number":1,"file_size_bytes":5000000} | *null* | "2026-08-08T04:57:44.979Z" |
| \|5\|b\|5\|e\|d\|8\|f\|d\|-\|d\|0\|5\|0\|-\|4\|a\|5\|d\|-\|a\|2\|2\|d\|-\|8\|1\|4\|1\|0\|4\|e\|8\|a\|1\|5\|2\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|p\|r\|o\|j\|e\|c\|t\|_\|c\|o\|n\|f\|i\|g\| | \|7\|8\|9\|c\|f\|8\|f\|a\|-\|c\|a\|9\|c\|-\|4\|9\|c\|5\|-\|b\|0\|1\|0\|-\|2\|0\|6\|7\|f\|c\|6\|8\|e\|6\|7\|2\| | *null* | {"id":"789cf8fa-ca9c-49c5-b010-2067fc68e672","is_enabled":true,"project_id":"376d1a9f-bda4-4750-a73d-993cbc5667a7","updated_at":"2026-08-08T04:57:44.979494+00:00","updated_by":"d63ab6da-e46c-417e-af78-114910b5aeeb","module_name":"change_requests"} | *null* | "2026-08-08T04:57:44.979Z" |
| \|7\|5\|8\|6\|d\|0\|d\|3\|-\|5\|9\|6\|f\|-\|4\|f\|3\|0\|-\|b\|d\|9\|8\|-\|3\|0\|e\|0\|8\|8\|8\|6\|e\|9\|7\|d\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|u\|p\|d\|a\|t\|e\|s\| | \|8\|d\|2\|2\|0\|6\|8\|0\|-\|b\|f\|e\|e\|-\|4\|8\|9\|5\|-\|a\|2\|e\|c\|-\|8\|2\|1\|3\|9\|1\|c\|a\|8\|0\|9\|2\| | *null* | {"caption":"Foundation digging started"} | \|1\|9\|2\|.\|1\|6\|8\|.\|1\|.\|1\| | "2026-08-08T04:57:44.979Z" |
| \|4\|2\|7\|1\|4\|f\|6\|3\|-\|1\|7\|a\|9\|-\|4\|c\|d\|a\|-\|9\|b\|e\|e\|-\|7\|3\|f\|e\|6\|f\|d\|e\|5\|2\|0\|8\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|p\|r\|o\|j\|e\|c\|t\|s\| | \|f\|e\|d\|5\|f\|a\|1\|a\|-\|0\|d\|3\|a\|-\|4\|3\|b\|8\|-\|9\|f\|a\|5\|-\|b\|5\|f\|0\|3\|c\|9\|d\|2\|e\|d\|c\| | *null* | {"id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","name":"Acme Headquarters","tags":["commercial","hq"],"type":"Combined","status":"In Progress","created_at":"2026-08-08T05:41:58.703296+00:00","start_date":"2026-08-08","description":"New HQ building for Acme Corp","is_archived":false,"target_date":"2027-08-08","po_reference":"PO-ACME-001","client_org_id":"c0b01c0a-23df-4e31-a34c-3d5fa9449961","assigned_pm_id":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","contract_value":5000000,"client_visibility":"Full Transparency"} | *null* | "2026-08-08T05:41:58.703Z" |
| \|c\|d\|e\|f\|a\|5\|c\|2\|-\|0\|d\|a\|1\|-\|4\|2\|a\|6\|-\|b\|3\|d\|9\|-\|a\|d\|2\|f\|4\|c\|3\|9\|f\|7\|e\|a\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|p\|r\|o\|j\|e\|c\|t\|s\| | \|5\|7\|7\|c\|5\|4\|9\|b\|-\|2\|8\|1\|1\|-\|4\|d\|0\|f\|-\|9\|8\|4\|d\|-\|5\|c\|2\|3\|7\|d\|f\|5\|9\|7\|d\|7\| | *null* | {"id":"577c549b-2811-4d0f-984d-5c237df597d7","name":"Acme Warehouse","tags":["warehouse"],"type":"Mechanical","status":"Not Started","created_at":"2026-08-08T05:41:58.703296+00:00","start_date":"2026-09-07","description":"New warehouse for Acme Corp","is_archived":false,"target_date":"2027-02-04","po_reference":"PO-ACME-002","client_org_id":"c0b01c0a-23df-4e31-a34c-3d5fa9449961","assigned_pm_id":"1c1bf062-95fa-4fdd-9231-0d2ec9a2766e","contract_value":1500000,"client_visibility":"Restricted"} | *null* | "2026-08-08T05:41:58.703Z" |
| \|b\|2\|f\|d\|f\|b\|f\|7\|-\|e\|f\|b\|8\|-\|4\|e\|d\|a\|-\|8\|3\|a\|2\|-\|3\|4\|9\|a\|8\|0\|1\|7\|7\|e\|9\|1\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|m\|i\|l\|e\|s\|t\|o\|n\|e\|s\| | \|1\|5\|9\|3\|9\|c\|5\|9\|-\|a\|1\|1\|5\|-\|4\|5\|1\|f\|-\|a\|5\|4\|4\|-\|5\|f\|1\|f\|0\|f\|5\|a\|9\|c\|6\|f\| | *null* | {"id":"15939c59-a115-451f-a544-5f1f0f5a9c6f","title":"Foundation Completeness","created_at":"2026-08-08T05:41:58.703296+00:00","department":"Civil","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","description":"Foundation laid and cured","target_date":"2026-09-07T00:00:00+00:00","display_order":1,"weight_percent":15,"completion_status":false} | *null* | "2026-08-08T05:41:58.703Z" |
| \|f\|b\|1\|4\|5\|2\|6\|d\|-\|4\|b\|e\|e\|-\|4\|d\|4\|d\|-\|8\|6\|3\|0\|-\|b\|8\|4\|c\|0\|4\|6\|6\|9\|2\|4\|f\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|m\|i\|l\|e\|s\|t\|o\|n\|e\|s\| | \|0\|2\|1\|5\|c\|2\|2\|8\|-\|5\|c\|b\|9\|-\|4\|7\|3\|b\|-\|8\|e\|b\|5\|-\|e\|8\|7\|1\|2\|0\|f\|6\|6\|c\|9\|b\| | *null* | {"id":"0215c228-5cb9-473b-8eb5-e87120f66c9b","title":"Structural Framing","created_at":"2026-08-08T05:41:58.703296+00:00","department":"Structural","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","description":"Steel and concrete framing complete","target_date":"2026-11-06T00:00:00+00:00","display_order":2,"weight_percent":25,"completion_status":false} | *null* | "2026-08-08T05:41:58.703Z" |
| \|c\|7\|f\|7\|9\|a\|0\|d\|-\|4\|4\|1\|c\|-\|4\|f\|4\|6\|-\|8\|9\|b\|c\|-\|4\|1\|c\|d\|9\|3\|5\|6\|1\|6\|0\|0\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|u\|p\|d\|a\|t\|e\|s\| | \|6\|8\|7\|f\|4\|3\|5\|b\|-\|0\|a\|c\|b\|-\|4\|0\|b\|9\|-\|a\|6\|8\|c\|-\|0\|3\|9\|0\|5\|a\|6\|0\|f\|4\|4\|1\| | *null* | {"id":"687f435b-0acb-40b9-a68c-03905a60f441","caption":"Foundation digging started","latitude":40.7128,"author_id":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","longitude":-74.006,"created_at":"2026-08-08T05:41:58.703296+00:00","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","milestone_id":"15939c59-a115-451f-a544-5f1f0f5a9c6f","location_name":"Site A North","is_watermarked":true,"approval_status":"Approved"} | *null* | "2026-08-08T05:41:58.703Z" |
| \|e\|5\|8\|f\|a\|b\|f\|9\|-\|d\|9\|4\|6\|-\|4\|9\|5\|2\|-\|9\|c\|5\|2\|-\|a\|2\|3\|f\|e\|c\|a\|f\|3\|b\|7\|d\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|u\|p\|d\|a\|t\|e\|s\| | \|e\|2\|9\|5\|c\|4\|0\|1\|-\|1\|d\|0\|8\|-\|4\|0\|5\|d\|-\|9\|0\|8\|8\|-\|e\|3\|a\|5\|b\|d\|b\|5\|4\|1\|e\|8\| | *null* | {"id":"e295c401-1d08-405d-9088-e3a5bdb541e8","caption":"Rebar installation","latitude":40.713,"author_id":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","longitude":-74.0065,"created_at":"2026-08-08T05:41:58.703296+00:00","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","milestone_id":"15939c59-a115-451f-a544-5f1f0f5a9c6f","location_name":"Site A East","is_watermarked":false,"approval_status":"Submitted"} | *null* | "2026-08-08T05:41:58.703Z" |
| \|6\|4\|7\|b\|9\|5\|9\|f\|-\|4\|c\|7\|b\|-\|4\|e\|c\|d\|-\|9\|0\|1\|2\|-\|0\|4\|c\|9\|f\|a\|b\|8\|3\|6\|5\|e\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|p\|r\|o\|j\|e\|c\|t\|_\|m\|a\|t\|e\|r\|i\|a\|l\|s\| | \|b\|e\|8\|7\|2\|f\|4\|e\|-\|9\|9\|c\|2\|-\|4\|1\|d\|0\|-\|a\|4\|4\|8\|-\|d\|f\|d\|c\|4\|c\|6\|c\|2\|b\|f\|f\| | *null* | {"id":"be872f4e-99c2-41d0-a448-dfdc4c6c2bff","status":"Ordered","spec_id":"SPEC-001","quantity":500,"item_name":"Concrete","lead_time":"5 days","po_number":"PO-CON-01","created_at":"2026-08-08T05:41:58.703296+00:00","created_by":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","supplier_name":"CementCo","actual_delivery":null,"tracking_timeline":[],"estimated_delivery":"2026-08-13","expected_arrival_date":"2026-08-13T00:00:00+00:00"} | *null* | "2026-08-08T05:41:58.703Z" |
| \|8\|a\|7\|d\|a\|7\|2\|c\|-\|e\|e\|b\|3\|-\|4\|3\|c\|3\|-\|b\|4\|5\|b\|-\|2\|b\|0\|9\|5\|a\|9\|4\|6\|8\|c\|5\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|p\|r\|o\|j\|e\|c\|t\|_\|i\|s\|s\|u\|e\|s\| | \|8\|f\|2\|6\|d\|8\|c\|0\|-\|1\|5\|a\|e\|-\|4\|4\|7\|2\|-\|a\|c\|1\|9\|-\|0\|9\|b\|0\|6\|9\|0\|6\|4\|7\|c\|a\| | *null* | {"id":"8f26d8c0-15ae-4472-ac19-09b0690647ca","title":"Weather Delay","status":"Open","severity":"High","created_at":"2026-08-08T05:41:58.703296+00:00","created_by":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","display_id":"ISS-001","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","root_cause":"Weather","assigned_to":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","cost_impact":"$0","description":"Heavy rain delayed foundation","resolved_at":null,"resolution_plan":[],"timeline_impact":"3 days","linked_milestones":[]} | *null* | "2026-08-08T05:41:58.703Z" |
| \|b\|c\|e\|b\|7\|1\|3\|7\|-\|0\|b\|f\|4\|-\|4\|3\|2\|7\|-\|8\|c\|b\|f\|-\|7\|0\|a\|e\|1\|5\|1\|9\|c\|e\|2\|e\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|c\|h\|a\|n\|g\|e\|_\|r\|e\|q\|u\|e\|s\|t\|s\| | \|4\|3\|7\|c\|f\|d\|1\|1\|-\|1\|6\|b\|e\|-\|4\|f\|7\|0\|-\|b\|a\|e\|d\|-\|9\|f\|6\|8\|b\|a\|f\|1\|9\|b\|5\|e\| | *null* | {"id":"437cfd11-16be-4f70-baed-9f68baf19b5e","title":"Upgrade Steel Grade","status":"Pending","created_at":"2026-08-08T05:41:58.703296+00:00","created_by":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","display_id":"CR-001","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","approved_by":"1c1bf062-95fa-4fdd-9231-0d2ec9a2766e","cost_impact":15000,"description":"Client requested better steel","time_impact_days":2,"approval_workflow":[]} | *null* | "2026-08-08T05:41:58.703Z" |
| \|5\|8\|2\|5\|d\|9\|4\|5\|-\|9\|f\|a\|e\|-\|4\|9\|8\|1\|-\|b\|7\|0\|8\|-\|d\|e\|2\|7\|3\|c\|2\|c\|7\|e\|e\|d\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|p\|r\|o\|j\|e\|c\|t\|_\|r\|e\|s\|o\|u\|r\|c\|e\|s\| | \|1\|0\|2\|8\|a\|6\|d\|0\|-\|1\|e\|f\|b\|-\|4\|6\|e\|4\|-\|8\|b\|f\|f\|-\|6\|6\|a\|e\|b\|8\|8\|9\|3\|7\|9\|8\| | *null* | {"id":"1028a6d0-1efb-46e4-8bff-66aeb8893798","name":"Excavator Team A","notes":"High performance","created_at":"2026-08-08T05:41:58.703296+00:00","created_by":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","actual_hours":40,"resource_type":"Labor","allocated_hours":160,"current_assignment":"Site A North","productivity_score":5} | *null* | "2026-08-08T05:41:58.703Z" |
| \|6\|c\|8\|7\|2\|6\|b\|4\|-\|5\|4\|8\|7\|-\|4\|f\|e\|3\|-\|8\|e\|e\|b\|-\|2\|4\|b\|c\|9\|6\|7\|7\|9\|2\|e\|8\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|c\|l\|i\|e\|n\|t\|_\|a\|p\|p\|r\|o\|v\|a\|l\|s\| | \|3\|8\|6\|f\|6\|4\|a\|f\|-\|f\|3\|a\|4\|-\|4\|2\|d\|0\|-\|a\|c\|9\|9\|-\|c\|6\|b\|7\|d\|1\|0\|3\|0\|c\|5\|3\| | *null* | {"id":"386f64af-f3a4-42d0-ac99-c6b7d1030c53","status":"Approved","comments":"Looks fine","created_at":"2026-08-08T05:41:58.703296+00:00","created_by":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","display_id":"APP-001","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","actioned_at":"2026-08-08T05:41:58.703296+00:00","approved_by":"1b3ead96-56e1-47ab-97e1-6fe6c559583b","document_url":"https://docs.url/foundation.pdf","document_title":"Foundation Design Docs","milestone_name":"Foundation Completeness","final_authority":{"role":"Client"},"approval_timeline":[],"attached_documents":[]} | *null* | "2026-08-08T05:41:58.703Z" |
| \|4\|d\|d\|c\|f\|d\|f\|4\|-\|7\|8\|9\|b\|-\|4\|5\|e\|7\|-\|9\|b\|f\|6\|-\|7\|b\|1\|6\|8\|4\|0\|c\|a\|a\|d\|d\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|l\|e\|s\|s\|o\|n\|s\|_\|l\|e\|a\|r\|n\|e\|d\| | \|3\|e\|d\|d\|2\|6\|4\|b\|-\|c\|a\|f\|7\|-\|4\|f\|6\|f\|-\|b\|1\|3\|4\|-\|9\|5\|a\|e\|2\|3\|4\|9\|3\|2\|0\|3\| | *null* | {"id":"3edd264b-caf7-4f6f-b134-95ae23493203","title":"Excavation Signage","impact":"Medium","category":"Safety","created_at":"2026-08-08T05:41:58.703296+00:00","created_by":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","display_id":"LL-001","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","root_cause":"Oversight","description":"Ensure better signage near excavations","related_media":[],"recommendation":"Add mandatory signage checks"} | *null* | "2026-08-08T05:41:58.703Z" |
| \|e\|c\|c\|1\|2\|f\|a\|5\|-\|6\|0\|c\|9\|-\|4\|a\|4\|5\|-\|9\|d\|0\|7\|-\|c\|3\|d\|c\|5\|5\|8\|c\|f\|2\|5\|8\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|p\|r\|o\|j\|e\|c\|t\|_\|h\|a\|n\|d\|o\|v\|e\|r\|s\| | \|f\|d\|9\|a\|b\|d\|d\|c\|-\|7\|f\|c\|d\|-\|4\|9\|d\|c\|-\|8\|f\|e\|0\|-\|0\|c\|6\|5\|d\|3\|3\|9\|4\|2\|8\|c\| | *null* | {"id":"fd9abddc-7fcd-49dc-8fe0-0c65d339428c","status":"Draft","created_at":"2026-08-08T05:41:58.703296+00:00","created_by":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","display_id":"HO-001","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","description":"Handover for Foundation","document_url":"https://docs.url/handover1.pdf","package_name":"Phase 1 Handover","key_attributes":[],"sign_off_status":[],"warranty_expiry":"2027-08-08","package_contents":[],"client_signature_url":null} | *null* | "2026-08-08T05:41:58.703Z" |
| \|6\|8\|e\|b\|f\|7\|b\|d\|-\|e\|2\|c\|a\|-\|4\|5\|3\|c\|-\|9\|d\|7\|1\|-\|6\|6\|5\|6\|e\|6\|c\|0\|1\|7\|8\|e\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|c\|l\|i\|e\|n\|t\|_\|m\|e\|e\|t\|i\|n\|g\|s\| | \|8\|4\|e\|2\|2\|7\|2\|1\|-\|b\|1\|0\|3\|-\|4\|a\|c\|9\|-\|9\|c\|1\|3\|-\|2\|3\|e\|e\|c\|9\|4\|2\|4\|8\|e\|9\| | *null* | {"id":"84e22721-b103-4ac9-9c13-23eec94248e9","title":"Kickoff Meeting","status":"Completed","attendees":"Alice, Bob, Charlie","created_at":"2026-08-08T05:41:58.703296+00:00","created_by":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","description":"Initial kickoff with client","minutes_url":"https://docs.url/minutes1.pdf","action_items":"Finalize designs","meeting_date":"2026-07-29T05:41:58.703296+00:00","agenda_minutes":[],"attendees_list":[],"key_attributes":[],"action_items_list":[]} | *null* | "2026-08-08T05:41:58.703Z" |
| \|7\|7\|3\|4\|1\|2\|f\|6\|-\|4\|0\|5\|3\|-\|4\|2\|5\|0\|-\|b\|5\|0\|c\|-\|f\|a\|5\|f\|b\|1\|e\|8\|9\|a\|4\|0\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|m\|i\|l\|e\|s\|t\|o\|n\|e\|_\|c\|h\|e\|c\|k\|l\|i\|s\|t\|_\|i\|t\|e\|m\|s\| | \|4\|f\|c\|e\|d\|9\|d\|1\|-\|b\|5\|1\|6\|-\|4\|c\|d\|3\|-\|b\|9\|c\|1\|-\|f\|6\|3\|5\|d\|6\|5\|9\|d\|9\|1\|2\| | *null* | {"id":"4fced9d1-b516-4cd3-b9c1-f635d659d912","title":"Site Survey","created_at":"2026-08-08T05:41:58.703296+00:00","created_by":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","updated_at":"2026-08-08T05:41:58.703296+00:00","is_complete":true,"milestone_id":"15939c59-a115-451f-a544-5f1f0f5a9c6f","display_order":1} | *null* | "2026-08-08T05:41:58.703Z" |
| \|1\|4\|5\|f\|4\|a\|b\|3\|-\|5\|6\|2\|6\|-\|4\|c\|3\|5\|-\|b\|a\|6\|1\|-\|2\|6\|e\|0\|9\|a\|7\|7\|e\|e\|3\|1\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|m\|i\|l\|e\|s\|t\|o\|n\|e\|_\|c\|h\|e\|c\|k\|l\|i\|s\|t\|_\|i\|t\|e\|m\|s\| | \|5\|1\|1\|2\|d\|5\|7\|5\|-\|1\|0\|4\|b\|-\|4\|a\|5\|2\|-\|a\|9\|4\|4\|-\|8\|1\|e\|3\|2\|9\|b\|0\|b\|c\|f\|7\| | *null* | {"id":"5112d575-104b-4a52-a944-81e329b0bcf7","title":"Permits Obtained","created_at":"2026-08-08T05:41:58.703296+00:00","created_by":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","updated_at":"2026-08-08T05:41:58.703296+00:00","is_complete":true,"milestone_id":"15939c59-a115-451f-a544-5f1f0f5a9c6f","display_order":2} | *null* | "2026-08-08T05:41:58.703Z" |
| \|6\|1\|f\|d\|e\|2\|3\|9\|-\|1\|0\|9\|0\|-\|4\|d\|c\|5\|-\|b\|3\|c\|4\|-\|8\|d\|d\|6\|d\|7\|9\|7\|1\|d\|0\|e\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|d\|r\|a\|w\|i\|n\|g\|_\|v\|e\|r\|s\|i\|o\|n\|s\| | \|3\|6\|2\|1\|8\|7\|c\|c\|-\|8\|b\|1\|d\|-\|4\|2\|9\|e\|-\|9\|4\|3\|8\|-\|6\|d\|2\|5\|4\|a\|4\|4\|7\|f\|d\|c\| | *null* | {"id":"362187cc-8b1d-429e-9438-6d254a447fdc","status":"Approved","file_url":"https://docs.url/arch_v1.dwg","created_at":"2026-08-08T05:41:58.703296+00:00","drawing_id":"6fdd1a06-5b9d-46da-a8a3-574172a53e8d","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","approved_by":"1c1bf062-95fa-4fdd-9231-0d2ec9a2766e","description":"Initial draft","uploaded_by":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","drawing_name":"Architectural Plan V1","version_number":1,"file_size_bytes":5000000} | *null* | "2026-08-08T05:41:58.703Z" |
| \|2\|0\|a\|e\|6\|d\|7\|8\|-\|e\|7\|1\|4\|-\|4\|8\|b\|4\|-\|9\|0\|6\|a\|-\|b\|f\|3\|0\|d\|6\|1\|0\|7\|d\|9\|f\| | *null* | \|I\|N\|S\|E\|R\|T\| | \|p\|r\|o\|j\|e\|c\|t\|_\|c\|o\|n\|f\|i\|g\| | \|c\|a\|5\|1\|8\|a\|7\|9\|-\|e\|2\|d\|3\|-\|4\|c\|4\|9\|-\|8\|7\|6\|f\|-\|f\|3\|4\|8\|4\|5\|9\|5\|b\|7\|1\|d\| | *null* | {"id":"ca518a79-e2d3-4c49-876f-f3484595b71d","is_enabled":true,"project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","updated_at":"2026-08-08T05:41:58.703296+00:00","updated_by":"1c1bf062-95fa-4fdd-9231-0d2ec9a2766e","module_name":"change_requests"} | *null* | "2026-08-08T05:41:58.703Z" |
| \|5\|2\|3\|0\|1\|d\|4\|c\|-\|8\|8\|9\|8\|-\|4\|6\|7\|6\|-\|a\|c\|0\|b\|-\|5\|7\|0\|a\|6\|4\|d\|1\|5\|3\|d\|d\| | \|0\|5\|5\|7\|b\|3\|d\|0\|-\|7\|c\|4\|d\|-\|4\|5\|d\|4\|-\|9\|2\|f\|3\|-\|4\|4\|9\|0\|b\|f\|6\|0\|8\|d\|a\|6\| | \|I\|N\|S\|E\|R\|T\| | \|u\|p\|d\|a\|t\|e\|s\| | \|6\|8\|7\|f\|4\|3\|5\|b\|-\|0\|a\|c\|b\|-\|4\|0\|b\|9\|-\|a\|6\|8\|c\|-\|0\|3\|9\|0\|5\|a\|6\|0\|f\|4\|4\|1\| | *null* | {"caption":"Foundation digging started"} | \|1\|9\|2\|.\|1\|6\|8\|.\|1\|.\|1\| | "2026-08-08T05:41:58.703Z" |
| \|0\|4\|e\|7\|1\|a\|0\|2\|-\|9\|6\|2\|4\|-\|4\|3\|7\|1\|-\|9\|3\|4\|5\|-\|1\|1\|5\|5\|1\|8\|7\|d\|7\|0\|3\|0\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | \|I\|N\|S\|E\|R\|T\| | \|p\|r\|o\|j\|e\|c\|t\|_\|i\|s\|s\|u\|e\|s\| | \|d\|1\|b\|c\|7\|6\|1\|6\|-\|4\|f\|a\|5\|-\|4\|6\|8\|b\|-\|b\|f\|4\|9\|-\|a\|1\|3\|0\|7\|e\|e\|3\|b\|b\|f\|e\| | *null* | {"id":"d1bc7616-4fa5-468b-bf49-a1307ee3bbfe","title":"fcgvhbj","status":"Open","severity":"Critical","created_at":"2026-08-08T11:42:38.762+00:00","created_by":"1c1bf062-95fa-4fdd-9231-0d2ec9a2766e","display_id":"ISS-8762","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","root_cause":"dfxcgvhbjnkm","assigned_to":"1b3ead96-56e1-47ab-97e1-6fe6c559583b","cost_impact":"435678","description":"hgvbjnkm","resolved_at":null,"resolution_plan":[{"step":"g hm","status":"Pending"}],"timeline_impact":"h. bjnm","linked_milestones":[{"milestone":"gvbhjnkm"}]} | *null* | "2026-08-08T06:12:38.977Z" |
| \|a\|8\|1\|f\|b\|3\|1\|d\|-\|9\|9\|a\|5\|-\|4\|0\|4\|6\|-\|a\|c\|a\|e\|-\|e\|7\|f\|5\|2\|3\|2\|a\|c\|4\|b\|e\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | \|I\|N\|S\|E\|R\|T\| | \|c\|h\|a\|n\|g\|e\|_\|r\|e\|q\|u\|e\|s\|t\|s\| | \|e\|5\|b\|7\|a\|a\|5\|b\|-\|4\|3\|b\|4\|-\|4\|9\|b\|f\|-\|b\|e\|3\|7\|-\|f\|0\|4\|a\|a\|6\|0\|4\|3\|9\|0\|6\| | *null* | {"id":"e5b7aa5b-43b4-49bf-be37-f04aa6043906","title":"fvbnmk","status":"Pending","created_at":"2026-08-08T11:43:59.498+00:00","created_by":"1c1bf062-95fa-4fdd-9231-0d2ec9a2766e","display_id":"CR-9498","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","approved_by":null,"cost_impact":4567,"description":"gfcvhbjnkm","time_impact_days":6,"approval_workflow":null} | *null* | "2026-08-08T06:13:59.573Z" |
| \|2\|e\|8\|4\|5\|5\|9\|5\|-\|c\|2\|7\|c\|-\|4\|d\|5\|b\|-\|8\|c\|4\|b\|-\|6\|e\|b\|f\|f\|9\|0\|9\|3\|2\|5\|4\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | \|D\|E\|L\|E\|T\|E\| | \|c\|h\|a\|n\|g\|e\|_\|r\|e\|q\|u\|e\|s\|t\|s\| | \|e\|5\|b\|7\|a\|a\|5\|b\|-\|4\|3\|b\|4\|-\|4\|9\|b\|f\|-\|b\|e\|3\|7\|-\|f\|0\|4\|a\|a\|6\|0\|4\|3\|9\|0\|6\| | {"id":"e5b7aa5b-43b4-49bf-be37-f04aa6043906","title":"fvbnmk","status":"Approved","created_at":"2026-08-08T11:43:59.498+00:00","created_by":"1c1bf062-95fa-4fdd-9231-0d2ec9a2766e","display_id":"CR-9498","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","approved_by":null,"cost_impact":4567,"description":"gfcvhbjnkm","time_impact_days":6,"approval_workflow":null} | *null* | *null* | "2026-08-08T11:32:51.591Z" |
| \|b\|e\|8\|1\|a\|e\|1\|1\|-\|9\|e\|d\|f\|-\|4\|c\|3\|2\|-\|8\|b\|e\|7\|-\|b\|6\|d\|2\|6\|4\|d\|d\|b\|f\|5\|b\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | \|U\|P\|D\|A\|T\|E\| | \|c\|h\|a\|n\|g\|e\|_\|r\|e\|q\|u\|e\|s\|t\|s\| | \|4\|3\|7\|c\|f\|d\|1\|1\|-\|1\|6\|b\|e\|-\|4\|f\|7\|0\|-\|b\|a\|e\|d\|-\|9\|f\|6\|8\|b\|a\|f\|1\|9\|b\|5\|e\| | {"id":"437cfd11-16be-4f70-baed-9f68baf19b5e","title":"Upgrade Steel Grade","status":"Pending","created_at":"2026-08-08T05:41:58.703296+00:00","created_by":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","display_id":"CR-001","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","approved_by":"1c1bf062-95fa-4fdd-9231-0d2ec9a2766e","cost_impact":15000,"description":"Client requested better steel","time_impact_days":2,"approval_workflow":[]} | {"id":"437cfd11-16be-4f70-baed-9f68baf19b5e","title":"Upgrade Steel Grade","status":"Approved","created_at":"2026-08-08T05:41:58.703296+00:00","created_by":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","display_id":"CR-001","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","approved_by":"1c1bf062-95fa-4fdd-9231-0d2ec9a2766e","cost_impact":15000,"description":"Client requested better steel","time_impact_days":2,"approval_workflow":[]} | *null* | "2026-08-08T06:14:19.639Z" |
| \|f\|0\|2\|0\|a\|9\|4\|0\|-\|8\|6\|4\|d\|-\|4\|a\|1\|1\|-\|9\|b\|4\|5\|-\|1\|e\|6\|b\|1\|7\|4\|f\|f\|4\|5\|a\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | \|U\|P\|D\|A\|T\|E\| | \|c\|h\|a\|n\|g\|e\|_\|r\|e\|q\|u\|e\|s\|t\|s\| | \|4\|3\|7\|c\|f\|d\|1\|1\|-\|1\|6\|b\|e\|-\|4\|f\|7\|0\|-\|b\|a\|e\|d\|-\|9\|f\|6\|8\|b\|a\|f\|1\|9\|b\|5\|e\| | {"id":"437cfd11-16be-4f70-baed-9f68baf19b5e","title":"Upgrade Steel Grade","status":"Approved","created_at":"2026-08-08T05:41:58.703296+00:00","created_by":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","display_id":"CR-001","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","approved_by":"1c1bf062-95fa-4fdd-9231-0d2ec9a2766e","cost_impact":15000,"description":"Client requested better steel","time_impact_days":2,"approval_workflow":[]} | {"id":"437cfd11-16be-4f70-baed-9f68baf19b5e","title":"Upgrade Steel Grade","status":"Pending","created_at":"2026-08-08T05:41:58.703296+00:00","created_by":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","display_id":"CR-001","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","approved_by":"1c1bf062-95fa-4fdd-9231-0d2ec9a2766e","cost_impact":15000,"description":"Client requested better steel","time_impact_days":2,"approval_workflow":[]} | *null* | "2026-08-08T06:14:21.184Z" |
| \|4\|7\|5\|f\|f\|4\|0\|d\|-\|a\|b\|c\|d\|-\|4\|4\|2\|3\|-\|b\|a\|6\|c\|-\|4\|6\|1\|5\|8\|5\|1\|2\|b\|5\|1\|b\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | \|U\|P\|D\|A\|T\|E\| | \|c\|h\|a\|n\|g\|e\|_\|r\|e\|q\|u\|e\|s\|t\|s\| | \|e\|5\|b\|7\|a\|a\|5\|b\|-\|4\|3\|b\|4\|-\|4\|9\|b\|f\|-\|b\|e\|3\|7\|-\|f\|0\|4\|a\|a\|6\|0\|4\|3\|9\|0\|6\| | {"id":"e5b7aa5b-43b4-49bf-be37-f04aa6043906","title":"fvbnmk","status":"Pending","created_at":"2026-08-08T11:43:59.498+00:00","created_by":"1c1bf062-95fa-4fdd-9231-0d2ec9a2766e","display_id":"CR-9498","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","approved_by":null,"cost_impact":4567,"description":"gfcvhbjnkm","time_impact_days":6,"approval_workflow":null} | {"id":"e5b7aa5b-43b4-49bf-be37-f04aa6043906","title":"fvbnmk","status":"Approved","created_at":"2026-08-08T11:43:59.498+00:00","created_by":"1c1bf062-95fa-4fdd-9231-0d2ec9a2766e","display_id":"CR-9498","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","approved_by":null,"cost_impact":4567,"description":"gfcvhbjnkm","time_impact_days":6,"approval_workflow":null} | *null* | "2026-08-08T06:14:23.548Z" |
| \|6\|c\|a\|e\|9\|0\|9\|e\|-\|8\|b\|4\|f\|-\|4\|4\|c\|f\|-\|8\|4\|2\|6\|-\|c\|1\|0\|6\|0\|c\|b\|8\|3\|0\|d\|2\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | \|U\|P\|D\|A\|T\|E\| | \|c\|h\|a\|n\|g\|e\|_\|r\|e\|q\|u\|e\|s\|t\|s\| | \|e\|5\|b\|7\|a\|a\|5\|b\|-\|4\|3\|b\|4\|-\|4\|9\|b\|f\|-\|b\|e\|3\|7\|-\|f\|0\|4\|a\|a\|6\|0\|4\|3\|9\|0\|6\| | {"id":"e5b7aa5b-43b4-49bf-be37-f04aa6043906","title":"fvbnmk","status":"Approved","created_at":"2026-08-08T11:43:59.498+00:00","created_by":"1c1bf062-95fa-4fdd-9231-0d2ec9a2766e","display_id":"CR-9498","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","approved_by":null,"cost_impact":4567,"description":"gfcvhbjnkm","time_impact_days":6,"approval_workflow":null} | {"id":"e5b7aa5b-43b4-49bf-be37-f04aa6043906","title":"fvbnmk","status":"Pending","created_at":"2026-08-08T11:43:59.498+00:00","created_by":"1c1bf062-95fa-4fdd-9231-0d2ec9a2766e","display_id":"CR-9498","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","approved_by":null,"cost_impact":4567,"description":"gfcvhbjnkm","time_impact_days":6,"approval_workflow":null} | *null* | "2026-08-08T06:14:24.772Z" |
| \|b\|1\|4\|4\|2\|d\|f\|4\|-\|b\|4\|b\|9\|-\|4\|c\|0\|5\|-\|a\|5\|2\|7\|-\|3\|2\|7\|6\|e\|3\|f\|9\|b\|9\|5\|a\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | \|I\|N\|S\|E\|R\|T\| | \|p\|r\|o\|j\|e\|c\|t\|_\|r\|e\|s\|o\|u\|r\|c\|e\|s\| | \|c\|c\|a\|c\|5\|d\|1\|d\|-\|e\|3\|8\|4\|-\|4\|e\|5\|e\|-\|8\|3\|f\|b\|-\|d\|0\|a\|9\|5\|9\|8\|0\|d\|0\|6\|0\| | *null* | {"id":"ccac5d1d-e384-4e5e-83fb-d0a95980d060","name":"cgvhbjnk","notes":"ghvjbknml","created_at":"2026-08-08T11:47:13.103+00:00","created_by":null,"project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","actual_hours":4,"resource_type":"Software","allocated_hours":5,"current_assignment":"cfgvbhnj","productivity_score":4} | *null* | "2026-08-08T06:17:13.736Z" |
| \|a\|2\|3\|1\|e\|e\|b\|b\|-\|0\|3\|0\|9\|-\|4\|2\|c\|e\|-\|8\|0\|e\|3\|-\|7\|1\|1\|b\|1\|f\|9\|0\|1\|8\|c\|e\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | \|U\|P\|D\|A\|T\|E\| | \|u\|p\|d\|a\|t\|e\|s\| | \|e\|2\|9\|5\|c\|4\|0\|1\|-\|1\|d\|0\|8\|-\|4\|0\|5\|d\|-\|9\|0\|8\|8\|-\|e\|3\|a\|5\|b\|d\|b\|5\|4\|1\|e\|8\| | {"id":"e295c401-1d08-405d-9088-e3a5bdb541e8","caption":"Rebar installation","latitude":40.713,"author_id":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","longitude":-74.0065,"created_at":"2026-08-08T05:41:58.703296+00:00","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","milestone_id":"15939c59-a115-451f-a544-5f1f0f5a9c6f","location_name":"Site A East","is_watermarked":false,"approval_status":"Submitted"} | {"id":"e295c401-1d08-405d-9088-e3a5bdb541e8","caption":"Rebar installation","latitude":40.713,"author_id":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","longitude":-74.0065,"created_at":"2026-08-08T05:41:58.703296+00:00","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","milestone_id":"15939c59-a115-451f-a544-5f1f0f5a9c6f","location_name":"Site A East","is_watermarked":false,"approval_status":"Reviewed"} | *null* | "2026-08-08T06:18:28.435Z" |
| \|d\|e\|c\|3\|f\|b\|8\|4\|-\|7\|9\|5\|1\|-\|4\|a\|e\|d\|-\|a\|6\|c\|1\|-\|d\|f\|0\|9\|9\|b\|9\|8\|8\|c\|8\|5\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | \|U\|P\|D\|A\|T\|E\| | \|u\|p\|d\|a\|t\|e\|s\| | \|e\|2\|9\|5\|c\|4\|0\|1\|-\|1\|d\|0\|8\|-\|4\|0\|5\|d\|-\|9\|0\|8\|8\|-\|e\|3\|a\|5\|b\|d\|b\|5\|4\|1\|e\|8\| | {"id":"e295c401-1d08-405d-9088-e3a5bdb541e8","caption":"Rebar installation","latitude":40.713,"author_id":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","longitude":-74.0065,"created_at":"2026-08-08T05:41:58.703296+00:00","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","milestone_id":"15939c59-a115-451f-a544-5f1f0f5a9c6f","location_name":"Site A East","is_watermarked":false,"approval_status":"Reviewed"} | {"id":"e295c401-1d08-405d-9088-e3a5bdb541e8","caption":"Rebar installation","latitude":40.713,"author_id":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","longitude":-74.0065,"created_at":"2026-08-08T05:41:58.703296+00:00","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","milestone_id":"15939c59-a115-451f-a544-5f1f0f5a9c6f","location_name":"Site A East","is_watermarked":false,"approval_status":"Approved"} | *null* | "2026-08-08T06:18:31.204Z" |
| \|d\|2\|4\|c\|c\|c\|6\|f\|-\|d\|1\|f\|3\|-\|4\|5\|3\|1\|-\|b\|1\|9\|e\|-\|a\|b\|9\|e\|e\|2\|f\|a\|b\|0\|5\|2\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | \|U\|P\|D\|A\|T\|E\| | \|p\|r\|o\|j\|e\|c\|t\|_\|m\|a\|t\|e\|r\|i\|a\|l\|s\| | \|b\|e\|8\|7\|2\|f\|4\|e\|-\|9\|9\|c\|2\|-\|4\|1\|d\|0\|-\|a\|4\|4\|8\|-\|d\|f\|d\|c\|4\|c\|6\|c\|2\|b\|f\|f\| | {"id":"be872f4e-99c2-41d0-a448-dfdc4c6c2bff","status":"Ordered","spec_id":"SPEC-001","quantity":500,"item_name":"Concrete","lead_time":"5 days","po_number":"PO-CON-01","created_at":"2026-08-08T05:41:58.703296+00:00","created_by":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","supplier_name":"CementCo","actual_delivery":null,"tracking_timeline":[],"estimated_delivery":"2026-08-13","expected_arrival_date":"2026-08-13T00:00:00+00:00"} | {"id":"be872f4e-99c2-41d0-a448-dfdc4c6c2bff","status":"In Transit","spec_id":"SPEC-001","quantity":500,"item_name":"Concrete","lead_time":"5 days","po_number":"PO-CON-01","created_at":"2026-08-08T05:41:58.703296+00:00","created_by":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","supplier_name":"CementCo","actual_delivery":null,"tracking_timeline":[],"estimated_delivery":"2026-08-13","expected_arrival_date":"2026-08-13T00:00:00+00:00"} | *null* | "2026-08-08T11:32:37.917Z" |
| \|0\|d\|1\|d\|e\|9\|a\|9\|-\|9\|2\|7\|5\|-\|4\|5\|3\|b\|-\|b\|e\|9\|d\|-\|9\|8\|d\|7\|6\|b\|a\|b\|c\|a\|3\|0\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | \|U\|P\|D\|A\|T\|E\| | \|p\|r\|o\|j\|e\|c\|t\|_\|m\|a\|t\|e\|r\|i\|a\|l\|s\| | \|b\|e\|8\|7\|2\|f\|4\|e\|-\|9\|9\|c\|2\|-\|4\|1\|d\|0\|-\|a\|4\|4\|8\|-\|d\|f\|d\|c\|4\|c\|6\|c\|2\|b\|f\|f\| | {"id":"be872f4e-99c2-41d0-a448-dfdc4c6c2bff","status":"In Transit","spec_id":"SPEC-001","quantity":500,"item_name":"Concrete","lead_time":"5 days","po_number":"PO-CON-01","created_at":"2026-08-08T05:41:58.703296+00:00","created_by":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","supplier_name":"CementCo","actual_delivery":null,"tracking_timeline":[],"estimated_delivery":"2026-08-13","expected_arrival_date":"2026-08-13T00:00:00+00:00"} | {"id":"be872f4e-99c2-41d0-a448-dfdc4c6c2bff","status":"Delivered","spec_id":"SPEC-001","quantity":500,"item_name":"Concrete","lead_time":"5 days","po_number":"PO-CON-01","created_at":"2026-08-08T05:41:58.703296+00:00","created_by":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","supplier_name":"CementCo","actual_delivery":null,"tracking_timeline":[],"estimated_delivery":"2026-08-13","expected_arrival_date":"2026-08-13T00:00:00+00:00"} | *null* | "2026-08-08T11:32:39.999Z" |
| \|f\|2\|c\|d\|7\|e\|f\|d\|-\|0\|2\|1\|9\|-\|4\|2\|6\|c\|-\|8\|0\|5\|b\|-\|e\|6\|7\|e\|9\|4\|d\|d\|f\|c\|a\|8\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | \|U\|P\|D\|A\|T\|E\| | \|c\|h\|a\|n\|g\|e\|_\|r\|e\|q\|u\|e\|s\|t\|s\| | \|4\|3\|7\|c\|f\|d\|1\|1\|-\|1\|6\|b\|e\|-\|4\|f\|7\|0\|-\|b\|a\|e\|d\|-\|9\|f\|6\|8\|b\|a\|f\|1\|9\|b\|5\|e\| | {"id":"437cfd11-16be-4f70-baed-9f68baf19b5e","title":"Upgrade Steel Grade","status":"Pending","created_at":"2026-08-08T05:41:58.703296+00:00","created_by":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","display_id":"CR-001","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","approved_by":"1c1bf062-95fa-4fdd-9231-0d2ec9a2766e","cost_impact":15000,"description":"Client requested better steel","time_impact_days":2,"approval_workflow":[]} | {"id":"437cfd11-16be-4f70-baed-9f68baf19b5e","title":"Upgrade Steel Grade","status":"Approved","created_at":"2026-08-08T05:41:58.703296+00:00","created_by":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","display_id":"CR-001","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","approved_by":"1c1bf062-95fa-4fdd-9231-0d2ec9a2766e","cost_impact":15000,"description":"Client requested better steel","time_impact_days":2,"approval_workflow":[]} | *null* | "2026-08-08T11:32:47.900Z" |
| \|a\|0\|c\|3\|0\|e\|c\|4\|-\|c\|8\|b\|2\|-\|4\|6\|c\|1\|-\|9\|d\|7\|a\|-\|c\|c\|f\|0\|e\|8\|d\|e\|b\|0\|c\|e\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | \|U\|P\|D\|A\|T\|E\| | \|c\|h\|a\|n\|g\|e\|_\|r\|e\|q\|u\|e\|s\|t\|s\| | \|e\|5\|b\|7\|a\|a\|5\|b\|-\|4\|3\|b\|4\|-\|4\|9\|b\|f\|-\|b\|e\|3\|7\|-\|f\|0\|4\|a\|a\|6\|0\|4\|3\|9\|0\|6\| | {"id":"e5b7aa5b-43b4-49bf-be37-f04aa6043906","title":"fvbnmk","status":"Pending","created_at":"2026-08-08T11:43:59.498+00:00","created_by":"1c1bf062-95fa-4fdd-9231-0d2ec9a2766e","display_id":"CR-9498","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","approved_by":null,"cost_impact":4567,"description":"gfcvhbjnkm","time_impact_days":6,"approval_workflow":null} | {"id":"e5b7aa5b-43b4-49bf-be37-f04aa6043906","title":"fvbnmk","status":"Approved","created_at":"2026-08-08T11:43:59.498+00:00","created_by":"1c1bf062-95fa-4fdd-9231-0d2ec9a2766e","display_id":"CR-9498","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","approved_by":null,"cost_impact":4567,"description":"gfcvhbjnkm","time_impact_days":6,"approval_workflow":null} | *null* | "2026-08-08T11:32:49.654Z" |
| \|a\|b\|4\|1\|7\|a\|2\|5\|-\|e\|2\|4\|d\|-\|4\|7\|1\|a\|-\|a\|0\|6\|9\|-\|1\|e\|f\|f\|2\|e\|c\|9\|e\|0\|0\|a\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | \|I\|N\|S\|E\|R\|T\| | \|p\|r\|o\|j\|e\|c\|t\|s\| | \|8\|f\|6\|7\|d\|a\|c\|b\|-\|b\|5\|8\|8\|-\|4\|0\|f\|f\|-\|8\|a\|0\|4\|-\|d\|7\|a\|7\|8\|3\|f\|1\|5\|7\|7\|d\| | *null* | {"id":"8f67dacb-b588-40ff-8a04-d7a783f1577d","name":"gfcvhbj","tags":[],"type":"Software","status":"Not Started","created_at":"2026-08-08T11:35:54.919924+00:00","start_date":"2026-08-08","description":"gfvhbjn","is_archived":false,"target_date":"2026-08-31","po_reference":"324567","client_org_id":"c0b01c0a-23df-4e31-a34c-3d5fa9449961","assigned_pm_id":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","contract_value":34567,"client_visibility":"Milestone-Only"} | *null* | "2026-08-08T11:35:54.919Z" |
| \|7\|9\|f\|b\|5\|7\|8\|8\|-\|d\|8\|f\|4\|-\|4\|d\|2\|4\|-\|a\|6\|5\|e\|-\|f\|5\|3\|3\|0\|0\|d\|1\|c\|0\|c\|f\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | \|I\|N\|S\|E\|R\|T\| | \|m\|i\|l\|e\|s\|t\|o\|n\|e\|s\| | \|8\|5\|3\|3\|e\|7\|0\|9\|-\|a\|5\|9\|4\|-\|4\|a\|2\|d\|-\|8\|9\|4\|a\|-\|1\|9\|a\|3\|a\|8\|a\|c\|b\|2\|0\|9\| | *null* | {"id":"8533e709-a594-4a2d-894a-19a3a8acb209","title":"dzxfcgvh","created_at":"2026-08-08T11:35:55.218731+00:00","department":null,"project_id":"8f67dacb-b588-40ff-8a04-d7a783f1577d","description":null,"target_date":"2026-08-25T00:00:00+00:00","display_order":0,"weight_percent":20,"completion_status":false} | *null* | "2026-08-08T11:35:55.218Z" |
| \|d\|f\|f\|d\|b\|5\|2\|3\|-\|3\|f\|6\|7\|-\|4\|0\|c\|c\|-\|a\|1\|9\|9\|-\|a\|c\|e\|0\|b\|0\|5\|9\|e\|9\|9\|e\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | \|I\|N\|S\|E\|R\|T\| | \|m\|i\|l\|e\|s\|t\|o\|n\|e\|s\| | \|9\|8\|a\|6\|4\|f\|5\|e\|-\|7\|0\|4\|6\|-\|4\|d\|5\|3\|-\|9\|7\|c\|5\|-\|7\|5\|b\|8\|9\|2\|c\|1\|c\|e\|5\|e\| | *null* | {"id":"98a64f5e-7046-4d53-97c5-75b892c1ce5e","title":"gvhbjn","created_at":"2026-08-08T11:35:55.255027+00:00","department":null,"project_id":"8f67dacb-b588-40ff-8a04-d7a783f1577d","description":null,"target_date":"2026-08-31T00:00:00+00:00","display_order":0,"weight_percent":80,"completion_status":false} | *null* | "2026-08-08T11:35:55.255Z" |
| \|5\|3\|0\|2\|4\|c\|f\|3\|-\|6\|2\|2\|2\|-\|4\|e\|7\|4\|-\|a\|e\|8\|c\|-\|e\|e\|c\|f\|3\|9\|3\|d\|f\|b\|5\|c\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | \|I\|N\|S\|E\|R\|T\| | \|p\|r\|o\|j\|e\|c\|t\|_\|m\|a\|t\|e\|r\|i\|a\|l\|s\| | \|9\|3\|b\|b\|5\|f\|f\|1\|-\|0\|0\|7\|7\|-\|4\|f\|1\|e\|-\|a\|e\|9\|a\|-\|f\|2\|1\|2\|d\|e\|2\|e\|0\|6\|3\|c\| | *null* | {"id":"93bb5ff1-0077-4f1e-ae9a-f212de2e063c","status":"Ordered","spec_id":"43567","quantity":5467,"item_name":"dfcghvj","lead_time":"44","po_number":"546","created_at":"2026-08-08T17:06:52.136+00:00","created_by":"1c1bf062-95fa-4fdd-9231-0d2ec9a2766e","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","supplier_name":"gcfvhjb","actual_delivery":null,"tracking_timeline":null,"estimated_delivery":"2026-09-16","expected_arrival_date":null} | *null* | "2026-08-08T11:36:52.226Z" |
| \|3\|2\|2\|c\|9\|6\|a\|e\|-\|f\|1\|b\|e\|-\|4\|c\|d\|3\|-\|b\|1\|b\|2\|-\|1\|7\|5\|8\|e\|2\|a\|5\|c\|b\|d\|c\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | \|I\|N\|S\|E\|R\|T\| | \|p\|r\|o\|j\|e\|c\|t\|s\| | \|a\|f\|5\|6\|4\|5\|9\|2\|-\|4\|9\|1\|8\|-\|4\|d\|b\|d\|-\|9\|a\|d\|c\|-\|4\|d\|d\|2\|4\|d\|7\|7\|d\|8\|4\|b\| | *null* | {"id":"af564592-4918-4dbd-9adc-4dd24d77d84b","name":"fgcvhb","tags":[],"type":"Electrical","status":"Not Started","created_at":"2026-08-13T10:49:26.330487+00:00","start_date":null,"description":"b n","is_archived":false,"target_date":"2026-09-05","po_reference":"33456","client_org_id":"c0b01c0a-23df-4e31-a34c-3d5fa9449961","assigned_pm_id":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","contract_value":4567,"client_visibility":"Restricted"} | *null* | "2026-08-13T10:49:26.330Z" |
| \|5\|b\|5\|a\|8\|8\|0\|b\|-\|6\|b\|f\|3\|-\|4\|c\|2\|2\|-\|8\|2\|1\|c\|-\|b\|4\|f\|5\|b\|f\|3\|7\|3\|9\|a\|b\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | \|I\|N\|S\|E\|R\|T\| | \|p\|r\|o\|j\|e\|c\|t\|s\| | \|5\|7\|b\|9\|3\|d\|2\|c\|-\|c\|c\|8\|6\|-\|4\|4\|2\|f\|-\|a\|1\|f\|d\|-\|c\|b\|6\|a\|2\|f\|6\|d\|2\|c\|4\|f\| | *null* | {"id":"57b93d2c-cc86-442f-a1fd-cb6a2f6d2c4f","name":"fgcvhb","tags":[],"type":"Electrical","status":"Not Started","created_at":"2026-08-13T10:50:03.055081+00:00","start_date":null,"description":"b n","is_archived":false,"target_date":"2026-09-05","po_reference":"33456","client_org_id":"c0b01c0a-23df-4e31-a34c-3d5fa9449961","assigned_pm_id":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","contract_value":5678,"client_visibility":"Restricted"} | *null* | "2026-08-13T10:50:03.055Z" |
| \|9\|b\|c\|3\|2\|9\|e\|6\|-\|f\|b\|1\|f\|-\|4\|1\|1\|b\|-\|8\|9\|5\|c\|-\|5\|3\|7\|e\|e\|1\|d\|3\|e\|5\|9\|9\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | \|I\|N\|S\|E\|R\|T\| | \|p\|r\|o\|j\|e\|c\|t\|s\| | \|5\|2\|9\|c\|9\|6\|b\|1\|-\|6\|4\|b\|2\|-\|4\|9\|c\|0\|-\|a\|4\|9\|0\|-\|e\|7\|c\|2\|8\|d\|3\|4\|2\|5\|1\|8\| | *null* | {"id":"529c96b1-64b2-49c0-a490-e7c28d342518","name":"rtfyg","tags":[],"type":"Mechanical","status":"Not Started","created_at":"2026-08-13T10:53:14.066202+00:00","start_date":null,"description":"vghbj","is_archived":false,"target_date":"2026-09-05","po_reference":"45678","client_org_id":"c0b01c0a-23df-4e31-a34c-3d5fa9449961","assigned_pm_id":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","contract_value":45678,"client_visibility":"Restricted"} | *null* | "2026-08-13T10:53:14.066Z" |
| \|4\|3\|9\|9\|9\|e\|a\|6\|-\|2\|d\|0\|7\|-\|4\|5\|7\|e\|-\|8\|5\|5\|4\|-\|a\|2\|7\|9\|a\|8\|2\|0\|e\|6\|1\|d\| | *null* | \|U\|P\|D\|A\|T\|E\| | \|p\|r\|o\|j\|e\|c\|t\|_\|r\|e\|s\|o\|u\|r\|c\|e\|s\| | \|1\|0\|2\|8\|a\|6\|d\|0\|-\|1\|e\|f\|b\|-\|4\|6\|e\|4\|-\|8\|b\|f\|f\|-\|6\|6\|a\|e\|b\|8\|8\|9\|3\|7\|9\|8\| | {"id":"1028a6d0-1efb-46e4-8bff-66aeb8893798","name":"Excavator Team A","notes":"High performance","created_at":"2026-08-08T05:41:58.703296+00:00","created_by":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","actual_hours":40,"resource_type":"Labor","allocated_hours":160,"current_assignment":"Site A North","productivity_score":5} | {"id":"1028a6d0-1efb-46e4-8bff-66aeb8893798","name":"Excavator Team A","notes":"High performance","created_at":"2026-08-08T05:41:58.703296+00:00","created_by":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","project_id":"fed5fa1a-0d3a-43b8-9fa5-b5f03c9d2edc","actual_hours":40,"resource_type":"Mechanical","allocated_hours":160,"current_assignment":"Site A North","productivity_score":5} | *null* | "2026-08-13T11:50:15.028Z" |
| \|0\|1\|6\|1\|e\|6\|c\|8\|-\|2\|1\|7\|3\|-\|4\|c\|6\|1\|-\|8\|d\|4\|1\|-\|e\|e\|9\|b\|7\|6\|8\|7\|8\|7\|7\|0\| | *null* | \|D\|E\|L\|E\|T\|E\| | \|p\|r\|o\|j\|e\|c\|t\|s\| | \|a\|f\|5\|6\|4\|5\|9\|2\|-\|4\|9\|1\|8\|-\|4\|d\|b\|d\|-\|9\|a\|d\|c\|-\|4\|d\|d\|2\|4\|d\|7\|7\|d\|8\|4\|b\| | {"id":"af564592-4918-4dbd-9adc-4dd24d77d84b","name":"fgcvhb","tags":[],"type":"Electrical","status":"Not Started","created_at":"2026-08-13T10:49:26.330487+00:00","start_date":null,"description":"b n","is_archived":false,"target_date":"2026-09-05","po_reference":"33456","client_org_id":"c0b01c0a-23df-4e31-a34c-3d5fa9449961","assigned_pm_id":"0557b3d0-7c4d-45d4-92f3-4490bf608da6","contract_value":4567,"client_visibility":"Restricted"} | *null* | *null* | "2026-08-13T11:50:27.924Z" |

---

## Table: `break_glass_logs`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| super_admin_id | uuid |
| target_org_id | uuid |
| reason | text |
| created_at | timestamp with time zone |

### Data (0 rows)
*No data currently stored in this table.*

---

## Table: `change_requests`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| project_id | uuid |
| title | text |
| description | text |
| cost_impact | numeric |
| time_impact_days | integer |
| status | text |
| approved_by | uuid |
| created_by | uuid |
| created_at | timestamp with time zone |
| display_id | text |
| approval_workflow | jsonb |

### Data (1 rows)
| id | project_id | title | description | cost_impact | time_impact_days | status | approved_by | created_by | created_at | display_id | approval_workflow |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| \|4\|3\|7\|c\|f\|d\|1\|1\|-\|1\|6\|b\|e\|-\|4\|f\|7\|0\|-\|b\|a\|e\|d\|-\|9\|f\|6\|8\|b\|a\|f\|1\|9\|b\|5\|e\| | \|f\|e\|d\|5\|f\|a\|1\|a\|-\|0\|d\|3\|a\|-\|4\|3\|b\|8\|-\|9\|f\|a\|5\|-\|b\|5\|f\|0\|3\|c\|9\|d\|2\|e\|d\|c\| | \|U\|p\|g\|r\|a\|d\|e\| \|S\|t\|e\|e\|l\| \|G\|r\|a\|d\|e\| | \|C\|l\|i\|e\|n\|t\| \|r\|e\|q\|u\|e\|s\|t\|e\|d\| \|b\|e\|t\|t\|e\|r\| \|s\|t\|e\|e\|l\| | \|1\|5\|0\|0\|0\| | \|2\| | \|A\|p\|p\|r\|o\|v\|e\|d\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | \|0\|5\|5\|7\|b\|3\|d\|0\|-\|7\|c\|4\|d\|-\|4\|5\|d\|4\|-\|9\|2\|f\|3\|-\|4\|4\|9\|0\|b\|f\|6\|0\|8\|d\|a\|6\| | "2026-08-08T05:41:58.703Z" | \|C\|R\|-\|0\|0\|1\| | [] |

---

## Table: `client_approvals`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| project_id | uuid |
| document_title | text |
| document_url | text |
| status | text |
| comments | text |
| approved_by | uuid |
| created_by | uuid |
| created_at | timestamp with time zone |
| actioned_at | timestamp with time zone |
| display_id | text |
| milestone_name | text |
| final_authority | jsonb |
| attached_documents | jsonb |
| approval_timeline | jsonb |

### Data (1 rows)
| id | project_id | document_title | document_url | status | comments | approved_by | created_by | created_at | actioned_at | display_id | milestone_name | final_authority | attached_documents | approval_timeline |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| \|3\|8\|6\|f\|6\|4\|a\|f\|-\|f\|3\|a\|4\|-\|4\|2\|d\|0\|-\|a\|c\|9\|9\|-\|c\|6\|b\|7\|d\|1\|0\|3\|0\|c\|5\|3\| | \|f\|e\|d\|5\|f\|a\|1\|a\|-\|0\|d\|3\|a\|-\|4\|3\|b\|8\|-\|9\|f\|a\|5\|-\|b\|5\|f\|0\|3\|c\|9\|d\|2\|e\|d\|c\| | \|F\|o\|u\|n\|d\|a\|t\|i\|o\|n\| \|D\|e\|s\|i\|g\|n\| \|D\|o\|c\|s\| | \|h\|t\|t\|p\|s\|:\|/\|/\|d\|o\|c\|s\|.\|u\|r\|l\|/\|f\|o\|u\|n\|d\|a\|t\|i\|o\|n\|.\|p\|d\|f\| | \|A\|p\|p\|r\|o\|v\|e\|d\| | \|L\|o\|o\|k\|s\| \|f\|i\|n\|e\| | \|1\|b\|3\|e\|a\|d\|9\|6\|-\|5\|6\|e\|1\|-\|4\|7\|a\|b\|-\|9\|7\|e\|1\|-\|6\|f\|e\|6\|c\|5\|5\|9\|5\|8\|3\|b\| | \|0\|5\|5\|7\|b\|3\|d\|0\|-\|7\|c\|4\|d\|-\|4\|5\|d\|4\|-\|9\|2\|f\|3\|-\|4\|4\|9\|0\|b\|f\|6\|0\|8\|d\|a\|6\| | "2026-08-08T05:41:58.703Z" | "2026-08-08T05:41:58.703Z" | \|A\|P\|P\|-\|0\|0\|1\| | \|F\|o\|u\|n\|d\|a\|t\|i\|o\|n\| \|C\|o\|m\|p\|l\|e\|t\|e\|n\|e\|s\|s\| | {"role":"Client"} | [] | [] |

---

## Table: `client_meeting_agendas`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| meeting_id | uuid |
| topic | text |
| duration | text |
| created_at | timestamp with time zone |
| updated_at | timestamp with time zone |

### Data (0 rows)
*No data currently stored in this table.*

---

## Table: `client_meetings`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| project_id | uuid |
| title | text |
| meeting_date | timestamp with time zone |
| attendees | text |
| minutes_url | text |
| action_items | text |
| created_by | uuid |
| created_at | timestamp with time zone |
| status | text |
| description | text |
| key_attributes | jsonb |
| attendees_list | jsonb |
| agenda_minutes | jsonb |
| action_items_list | jsonb |

### Data (1 rows)
| id | project_id | title | meeting_date | attendees | minutes_url | action_items | created_by | created_at | status | description | key_attributes | attendees_list | agenda_minutes | action_items_list |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| \|8\|4\|e\|2\|2\|7\|2\|1\|-\|b\|1\|0\|3\|-\|4\|a\|c\|9\|-\|9\|c\|1\|3\|-\|2\|3\|e\|e\|c\|9\|4\|2\|4\|8\|e\|9\| | \|f\|e\|d\|5\|f\|a\|1\|a\|-\|0\|d\|3\|a\|-\|4\|3\|b\|8\|-\|9\|f\|a\|5\|-\|b\|5\|f\|0\|3\|c\|9\|d\|2\|e\|d\|c\| | \|K\|i\|c\|k\|o\|f\|f\| \|M\|e\|e\|t\|i\|n\|g\| | "2026-07-29T05:41:58.703Z" | \|A\|l\|i\|c\|e\|,\| \|B\|o\|b\|,\| \|C\|h\|a\|r\|l\|i\|e\| | \|h\|t\|t\|p\|s\|:\|/\|/\|d\|o\|c\|s\|.\|u\|r\|l\|/\|m\|i\|n\|u\|t\|e\|s\|1\|.\|p\|d\|f\| | \|F\|i\|n\|a\|l\|i\|z\|e\| \|d\|e\|s\|i\|g\|n\|s\| | \|0\|5\|5\|7\|b\|3\|d\|0\|-\|7\|c\|4\|d\|-\|4\|5\|d\|4\|-\|9\|2\|f\|3\|-\|4\|4\|9\|0\|b\|f\|6\|0\|8\|d\|a\|6\| | "2026-08-08T05:41:58.703Z" | \|C\|o\|m\|p\|l\|e\|t\|e\|d\| | \|I\|n\|i\|t\|i\|a\|l\| \|k\|i\|c\|k\|o\|f\|f\| \|w\|i\|t\|h\| \|c\|l\|i\|e\|n\|t\| | [] | [] | [] | [] |

---

## Table: `comment_mentions`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| comment_id | uuid |
| mentioned_user_id | uuid |
| created_at | timestamp with time zone |

### Data (1 rows)
| id | comment_id | mentioned_user_id | created_at |
| --- | --- | --- | --- |
| \|7\|0\|2\|f\|a\|b\|2\|0\|-\|1\|b\|9\|5\|-\|4\|e\|3\|f\|-\|9\|6\|5\|c\|-\|2\|e\|d\|5\|b\|7\|5\|5\|8\|0\|f\|5\| | \|f\|7\|c\|4\|3\|5\|2\|9\|-\|9\|2\|e\|5\|-\|4\|6\|d\|c\|-\|a\|2\|3\|0\|-\|6\|3\|5\|4\|8\|d\|4\|5\|7\|1\|c\|9\| | \|0\|5\|5\|7\|b\|3\|d\|0\|-\|7\|c\|4\|d\|-\|4\|5\|d\|4\|-\|9\|2\|f\|3\|-\|4\|4\|9\|0\|b\|f\|6\|0\|8\|d\|a\|6\| | "2026-08-08T05:41:58.703Z" |

---

## Table: `comments`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| update_id | uuid |
| author_id | uuid |
| content | text |
| created_at | timestamp with time zone |

### Data (4 rows)
| id | update_id | author_id | content | created_at |
| --- | --- | --- | --- | --- |
| \|f\|7\|c\|4\|3\|5\|2\|9\|-\|9\|2\|e\|5\|-\|4\|6\|d\|c\|-\|a\|2\|3\|0\|-\|6\|3\|5\|4\|8\|d\|4\|5\|7\|1\|c\|9\| | \|6\|8\|7\|f\|4\|3\|5\|b\|-\|0\|a\|c\|b\|-\|4\|0\|b\|9\|-\|a\|6\|8\|c\|-\|0\|3\|9\|0\|5\|a\|6\|0\|f\|4\|4\|1\| | \|1\|b\|3\|e\|a\|d\|9\|6\|-\|5\|6\|e\|1\|-\|4\|7\|a\|b\|-\|9\|7\|e\|1\|-\|6\|f\|e\|6\|c\|5\|5\|9\|5\|8\|3\|b\| | \|L\|o\|o\|k\|s\| \|g\|o\|o\|d\|,\| \|k\|e\|e\|p\| \|u\|s\| \|u\|p\|d\|a\|t\|e\|d\|!\| | "2026-08-08T05:41:58.703Z" |
| \|b\|2\|b\|f\|3\|6\|e\|7\|-\|c\|1\|0\|5\|-\|4\|7\|5\|2\|-\|b\|b\|1\|e\|-\|5\|4\|1\|1\|9\|7\|c\|4\|f\|4\|a\|8\| | \|6\|8\|7\|f\|4\|3\|5\|b\|-\|0\|a\|c\|b\|-\|4\|0\|b\|9\|-\|a\|6\|8\|c\|-\|0\|3\|9\|0\|5\|a\|6\|0\|f\|4\|4\|1\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | \|c\|g\|h\|v\|j\|b\|k\|n\| | "2026-08-08T07:12:43.799Z" |
| \|0\|6\|2\|8\|c\|a\|d\|e\|-\|0\|c\|0\|6\|-\|4\|2\|1\|6\|-\|9\|e\|f\|2\|-\|4\|4\|6\|1\|e\|c\|7\|0\|a\|0\|e\|8\| | \|e\|2\|9\|5\|c\|4\|0\|1\|-\|1\|d\|0\|8\|-\|4\|0\|5\|d\|-\|9\|0\|8\|8\|-\|e\|3\|a\|5\|b\|d\|b\|5\|4\|1\|e\|8\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | \|c\| \|v\|b\|n\| | "2026-08-08T07:12:51.095Z" |
| \|e\|d\|3\|f\|0\|4\|9\|b\|-\|1\|7\|8\|7\|-\|4\|2\|0\|b\|-\|8\|2\|6\|7\|-\|0\|7\|9\|1\|0\|e\|a\|c\|3\|f\|0\|c\| | \|6\|8\|7\|f\|4\|3\|5\|b\|-\|0\|a\|c\|b\|-\|4\|0\|b\|9\|-\|a\|6\|8\|c\|-\|0\|3\|9\|0\|5\|a\|6\|0\|f\|4\|4\|1\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | \|g\|f\|x\|c\|h\|v\|j\|b\|k\| | "2026-08-08T11:34:59.782Z" |

---

## Table: `drawing_versions`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| project_id | uuid |
| drawing_name | text |
| version_number | integer |
| file_url | text |
| file_size_bytes | bigint |
| description | text |
| status | text |
| uploaded_by | uuid |
| approved_by | uuid |
| created_at | timestamp with time zone |
| drawing_id | uuid |

### Data (1 rows)
| id | project_id | drawing_name | version_number | file_url | file_size_bytes | description | status | uploaded_by | approved_by | created_at | drawing_id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| \|3\|6\|2\|1\|8\|7\|c\|c\|-\|8\|b\|1\|d\|-\|4\|2\|9\|e\|-\|9\|4\|3\|8\|-\|6\|d\|2\|5\|4\|a\|4\|4\|7\|f\|d\|c\| | \|f\|e\|d\|5\|f\|a\|1\|a\|-\|0\|d\|3\|a\|-\|4\|3\|b\|8\|-\|9\|f\|a\|5\|-\|b\|5\|f\|0\|3\|c\|9\|d\|2\|e\|d\|c\| | \|A\|r\|c\|h\|i\|t\|e\|c\|t\|u\|r\|a\|l\| \|P\|l\|a\|n\| \|V\|1\| | \|1\| | \|h\|t\|t\|p\|s\|:\|/\|/\|d\|o\|c\|s\|.\|u\|r\|l\|/\|a\|r\|c\|h\|_\|v\|1\|.\|d\|w\|g\| | \|5\|0\|0\|0\|0\|0\|0\| | \|I\|n\|i\|t\|i\|a\|l\| \|d\|r\|a\|f\|t\| | \|A\|p\|p\|r\|o\|v\|e\|d\| | \|0\|5\|5\|7\|b\|3\|d\|0\|-\|7\|c\|4\|d\|-\|4\|5\|d\|4\|-\|9\|2\|f\|3\|-\|4\|4\|9\|0\|b\|f\|6\|0\|8\|d\|a\|6\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | "2026-08-08T05:41:58.703Z" | \|6\|f\|d\|d\|1\|a\|0\|6\|-\|5\|b\|9\|d\|-\|4\|6\|d\|a\|-\|a\|8\|a\|3\|-\|5\|7\|4\|1\|7\|2\|a\|5\|3\|e\|8\|d\| |

---

## Table: `duplicate_files`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| original_file_id | uuid |
| duplicate_file_id | uuid |
| similarity_score | numeric |
| status | text |

### Data (2 rows)
| id | original_file_id | duplicate_file_id | similarity_score | status |
| --- | --- | --- | --- | --- |
| \|b\|4\|c\|2\|e\|f\|5\|9\|-\|5\|d\|6\|f\|-\|4\|7\|b\|f\|-\|8\|4\|a\|5\|-\|c\|8\|e\|7\|1\|d\|7\|8\|2\|1\|4\|a\| | \|e\|7\|8\|2\|e\|2\|f\|d\|-\|2\|3\|5\|2\|-\|4\|8\|7\|7\|-\|8\|5\|3\|5\|-\|e\|c\|2\|d\|2\|5\|e\|e\|1\|f\|0\|4\| | \|7\|7\|a\|6\|b\|1\|a\|a\|-\|9\|b\|c\|0\|-\|4\|2\|2\|9\|-\|9\|a\|b\|1\|-\|5\|4\|2\|4\|b\|2\|9\|6\|b\|b\|e\|1\| | \|9\|8\|.\|5\|0\| | \|F\|l\|a\|g\|g\|e\|d\| |
| \|a\|1\|a\|6\|9\|8\|1\|a\|-\|1\|4\|3\|9\|-\|4\|8\|2\|a\|-\|9\|9\|d\|8\|-\|8\|1\|2\|b\|8\|4\|4\|0\|a\|d\|2\|f\| | \|7\|3\|a\|0\|a\|e\|2\|4\|-\|8\|8\|5\|d\|-\|4\|0\|c\|4\|-\|b\|0\|c\|0\|-\|6\|7\|0\|9\|6\|7\|9\|a\|3\|1\|6\|7\| | \|a\|5\|e\|3\|0\|b\|a\|8\|-\|2\|b\|c\|b\|-\|4\|e\|a\|c\|-\|a\|5\|a\|2\|-\|4\|0\|9\|5\|a\|3\|4\|b\|4\|2\|d\|a\| | \|9\|8\|.\|5\|0\| | \|F\|l\|a\|g\|g\|e\|d\| |

---

## Table: `employee_timesheets`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| user_id | uuid |
| project_id | uuid |
| organization_id | uuid |
| work_date | date |
| start_time | time without time zone |
| end_time | time without time zone |
| hours_logged | numeric |
| status | text |
| notes | text |
| created_at | timestamp with time zone |
| updated_at | timestamp with time zone |

### Data (0 rows)
*No data currently stored in this table.*

---

## Table: `invoices`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| vendor_id | uuid |
| project_id | uuid |
| invoice_number | text |
| amount | numeric |
| currency | text |
| status | text |
| due_date | timestamp with time zone |
| created_at | timestamp with time zone |
| updated_at | timestamp with time zone |

### Data (0 rows)
*No data currently stored in this table.*

---

## Table: `lessons_learned`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| project_id | uuid |
| category | text |
| description | text |
| impact | text |
| recommendation | text |
| created_by | uuid |
| created_at | timestamp with time zone |
| display_id | text |
| title | text |
| root_cause | text |
| related_media | jsonb |

### Data (1 rows)
| id | project_id | category | description | impact | recommendation | created_by | created_at | display_id | title | root_cause | related_media |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| \|3\|e\|d\|d\|2\|6\|4\|b\|-\|c\|a\|f\|7\|-\|4\|f\|6\|f\|-\|b\|1\|3\|4\|-\|9\|5\|a\|e\|2\|3\|4\|9\|3\|2\|0\|3\| | \|f\|e\|d\|5\|f\|a\|1\|a\|-\|0\|d\|3\|a\|-\|4\|3\|b\|8\|-\|9\|f\|a\|5\|-\|b\|5\|f\|0\|3\|c\|9\|d\|2\|e\|d\|c\| | \|S\|a\|f\|e\|t\|y\| | \|E\|n\|s\|u\|r\|e\| \|b\|e\|t\|t\|e\|r\| \|s\|i\|g\|n\|a\|g\|e\| \|n\|e\|a\|r\| \|e\|x\|c\|a\|v\|a\|t\|i\|o\|n\|s\| | \|M\|e\|d\|i\|u\|m\| | \|A\|d\|d\| \|m\|a\|n\|d\|a\|t\|o\|r\|y\| \|s\|i\|g\|n\|a\|g\|e\| \|c\|h\|e\|c\|k\|s\| | \|0\|5\|5\|7\|b\|3\|d\|0\|-\|7\|c\|4\|d\|-\|4\|5\|d\|4\|-\|9\|2\|f\|3\|-\|4\|4\|9\|0\|b\|f\|6\|0\|8\|d\|a\|6\| | "2026-08-08T05:41:58.703Z" | \|L\|L\|-\|0\|0\|1\| | \|E\|x\|c\|a\|v\|a\|t\|i\|o\|n\| \|S\|i\|g\|n\|a\|g\|e\| | \|O\|v\|e\|r\|s\|i\|g\|h\|t\| | [] |

---

## Table: `media_attachments`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| update_id | uuid |
| type | USER-DEFINED |
| url | text |
| file_name | text |
| file_size_bytes | bigint |
| mime_type | text |
| uploaded_by | uuid |
| created_at | timestamp with time zone |

### Data (2 rows)
| id | update_id | type | url | file_name | file_size_bytes | mime_type | uploaded_by | created_at |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| \|7\|3\|a\|0\|a\|e\|2\|4\|-\|8\|8\|5\|d\|-\|4\|0\|c\|4\|-\|b\|0\|c\|0\|-\|6\|7\|0\|9\|6\|7\|9\|a\|3\|1\|6\|7\| | \|6\|8\|7\|f\|4\|3\|5\|b\|-\|0\|a\|c\|b\|-\|4\|0\|b\|9\|-\|a\|6\|8\|c\|-\|0\|3\|9\|0\|5\|a\|6\|0\|f\|4\|4\|1\| | \|i\|m\|a\|g\|e\| | \|h\|t\|t\|p\|s\|:\|/\|/\|s\|t\|o\|r\|a\|g\|e\|.\|u\|r\|l\|/\|i\|m\|g\|1\|.\|j\|p\|g\| | \|i\|m\|g\|1\|.\|j\|p\|g\| | \|1\|0\|2\|4\|0\|0\|0\| | \|i\|m\|a\|g\|e\|/\|j\|p\|e\|g\| | \|0\|5\|5\|7\|b\|3\|d\|0\|-\|7\|c\|4\|d\|-\|4\|5\|d\|4\|-\|9\|2\|f\|3\|-\|4\|4\|9\|0\|b\|f\|6\|0\|8\|d\|a\|6\| | "2026-08-08T05:41:58.703Z" |
| \|a\|5\|e\|3\|0\|b\|a\|8\|-\|2\|b\|c\|b\|-\|4\|e\|a\|c\|-\|a\|5\|a\|2\|-\|4\|0\|9\|5\|a\|3\|4\|b\|4\|2\|d\|a\| | \|e\|2\|9\|5\|c\|4\|0\|1\|-\|1\|d\|0\|8\|-\|4\|0\|5\|d\|-\|9\|0\|8\|8\|-\|e\|3\|a\|5\|b\|d\|b\|5\|4\|1\|e\|8\| | \|v\|i\|d\|e\|o\| | \|h\|t\|t\|p\|s\|:\|/\|/\|s\|t\|o\|r\|a\|g\|e\|.\|u\|r\|l\|/\|v\|i\|d\|1\|.\|m\|p\|4\| | \|v\|i\|d\|1\|.\|m\|p\|4\| | \|1\|5\|0\|0\|0\|0\|0\|0\| | \|v\|i\|d\|e\|o\|/\|m\|p\|4\| | \|0\|5\|5\|7\|b\|3\|d\|0\|-\|7\|c\|4\|d\|-\|4\|5\|d\|4\|-\|9\|2\|f\|3\|-\|4\|4\|9\|0\|b\|f\|6\|0\|8\|d\|a\|6\| | "2026-08-08T05:41:58.703Z" |

---

## Table: `milestone_checklist_items`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| milestone_id | uuid |
| title | text |
| is_complete | boolean |
| display_order | integer |
| created_by | uuid |
| created_at | timestamp with time zone |
| updated_at | timestamp with time zone |

### Data (2 rows)
| id | milestone_id | title | is_complete | display_order | created_by | created_at | updated_at |
| --- | --- | --- | --- | --- | --- | --- | --- |
| \|4\|f\|c\|e\|d\|9\|d\|1\|-\|b\|5\|1\|6\|-\|4\|c\|d\|3\|-\|b\|9\|c\|1\|-\|f\|6\|3\|5\|d\|6\|5\|9\|d\|9\|1\|2\| | \|1\|5\|9\|3\|9\|c\|5\|9\|-\|a\|1\|1\|5\|-\|4\|5\|1\|f\|-\|a\|5\|4\|4\|-\|5\|f\|1\|f\|0\|f\|5\|a\|9\|c\|6\|f\| | \|S\|i\|t\|e\| \|S\|u\|r\|v\|e\|y\| | \|t\|r\|u\|e\| | \|1\| | \|0\|5\|5\|7\|b\|3\|d\|0\|-\|7\|c\|4\|d\|-\|4\|5\|d\|4\|-\|9\|2\|f\|3\|-\|4\|4\|9\|0\|b\|f\|6\|0\|8\|d\|a\|6\| | "2026-08-08T05:41:58.703Z" | "2026-08-08T05:41:58.703Z" |
| \|5\|1\|1\|2\|d\|5\|7\|5\|-\|1\|0\|4\|b\|-\|4\|a\|5\|2\|-\|a\|9\|4\|4\|-\|8\|1\|e\|3\|2\|9\|b\|0\|b\|c\|f\|7\| | \|1\|5\|9\|3\|9\|c\|5\|9\|-\|a\|1\|1\|5\|-\|4\|5\|1\|f\|-\|a\|5\|4\|4\|-\|5\|f\|1\|f\|0\|f\|5\|a\|9\|c\|6\|f\| | \|P\|e\|r\|m\|i\|t\|s\| \|O\|b\|t\|a\|i\|n\|e\|d\| | \|t\|r\|u\|e\| | \|2\| | \|0\|5\|5\|7\|b\|3\|d\|0\|-\|7\|c\|4\|d\|-\|4\|5\|d\|4\|-\|9\|2\|f\|3\|-\|4\|4\|9\|0\|b\|f\|6\|0\|8\|d\|a\|6\| | "2026-08-08T05:41:58.703Z" | "2026-08-08T05:41:58.703Z" |

---

## Table: `milestones`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| project_id | uuid |
| title | text |
| description | text |
| target_date | timestamp with time zone |
| completion_status | boolean |
| weight_percent | integer |
| department | text |
| created_at | timestamp with time zone |
| display_order | integer |

### Data (4 rows)
| id | project_id | title | description | target_date | completion_status | weight_percent | department | created_at | display_order |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| \|1\|5\|9\|3\|9\|c\|5\|9\|-\|a\|1\|1\|5\|-\|4\|5\|1\|f\|-\|a\|5\|4\|4\|-\|5\|f\|1\|f\|0\|f\|5\|a\|9\|c\|6\|f\| | \|f\|e\|d\|5\|f\|a\|1\|a\|-\|0\|d\|3\|a\|-\|4\|3\|b\|8\|-\|9\|f\|a\|5\|-\|b\|5\|f\|0\|3\|c\|9\|d\|2\|e\|d\|c\| | \|F\|o\|u\|n\|d\|a\|t\|i\|o\|n\| \|C\|o\|m\|p\|l\|e\|t\|e\|n\|e\|s\|s\| | \|F\|o\|u\|n\|d\|a\|t\|i\|o\|n\| \|l\|a\|i\|d\| \|a\|n\|d\| \|c\|u\|r\|e\|d\| | "2026-09-07T00:00:00.000Z" | \|f\|a\|l\|s\|e\| | \|1\|5\| | \|C\|i\|v\|i\|l\| | "2026-08-08T05:41:58.703Z" | \|1\| |
| \|0\|2\|1\|5\|c\|2\|2\|8\|-\|5\|c\|b\|9\|-\|4\|7\|3\|b\|-\|8\|e\|b\|5\|-\|e\|8\|7\|1\|2\|0\|f\|6\|6\|c\|9\|b\| | \|f\|e\|d\|5\|f\|a\|1\|a\|-\|0\|d\|3\|a\|-\|4\|3\|b\|8\|-\|9\|f\|a\|5\|-\|b\|5\|f\|0\|3\|c\|9\|d\|2\|e\|d\|c\| | \|S\|t\|r\|u\|c\|t\|u\|r\|a\|l\| \|F\|r\|a\|m\|i\|n\|g\| | \|S\|t\|e\|e\|l\| \|a\|n\|d\| \|c\|o\|n\|c\|r\|e\|t\|e\| \|f\|r\|a\|m\|i\|n\|g\| \|c\|o\|m\|p\|l\|e\|t\|e\| | "2026-11-06T00:00:00.000Z" | \|f\|a\|l\|s\|e\| | \|2\|5\| | \|S\|t\|r\|u\|c\|t\|u\|r\|a\|l\| | "2026-08-08T05:41:58.703Z" | \|2\| |
| \|8\|5\|3\|3\|e\|7\|0\|9\|-\|a\|5\|9\|4\|-\|4\|a\|2\|d\|-\|8\|9\|4\|a\|-\|1\|9\|a\|3\|a\|8\|a\|c\|b\|2\|0\|9\| | \|8\|f\|6\|7\|d\|a\|c\|b\|-\|b\|5\|8\|8\|-\|4\|0\|f\|f\|-\|8\|a\|0\|4\|-\|d\|7\|a\|7\|8\|3\|f\|1\|5\|7\|7\|d\| | \|d\|z\|x\|f\|c\|g\|v\|h\| | *null* | "2026-08-25T00:00:00.000Z" | \|f\|a\|l\|s\|e\| | \|2\|0\| | *null* | "2026-08-08T11:35:55.218Z" | \|0\| |
| \|9\|8\|a\|6\|4\|f\|5\|e\|-\|7\|0\|4\|6\|-\|4\|d\|5\|3\|-\|9\|7\|c\|5\|-\|7\|5\|b\|8\|9\|2\|c\|1\|c\|e\|5\|e\| | \|8\|f\|6\|7\|d\|a\|c\|b\|-\|b\|5\|8\|8\|-\|4\|0\|f\|f\|-\|8\|a\|0\|4\|-\|d\|7\|a\|7\|8\|3\|f\|1\|5\|7\|7\|d\| | \|g\|v\|h\|b\|j\|n\| | *null* | "2026-08-31T00:00:00.000Z" | \|f\|a\|l\|s\|e\| | \|8\|0\| | *null* | "2026-08-08T11:35:55.255Z" | \|0\| |

---

## Table: `notifications`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| user_id | uuid |
| title | text |
| body | text |
| type | USER-DEFINED |
| reference_id | uuid |
| is_read | boolean |
| created_at | timestamp with time zone |

### Data (10 rows)
| id | user_id | title | body | type | reference_id | is_read | created_at |
| --- | --- | --- | --- | --- | --- | --- | --- |
| \|7\|2\|c\|3\|1\|c\|8\|8\|-\|7\|e\|8\|7\|-\|4\|9\|a\|e\|-\|9\|3\|3\|1\|-\|6\|c\|1\|d\|2\|6\|5\|3\|b\|1\|a\|7\| | \|1\|b\|3\|e\|a\|d\|9\|6\|-\|5\|6\|e\|1\|-\|4\|7\|a\|b\|-\|9\|7\|e\|1\|-\|6\|f\|e\|6\|c\|5\|5\|9\|5\|8\|3\|b\| | \|N\|e\|w\| \|U\|p\|d\|a\|t\|e\|:\| \|A\|c\|m\|e\| \|H\|e\|a\|d\|q\|u\|a\|r\|t\|e\|r\|s\| | \|F\|o\|u\|n\|d\|a\|t\|i\|o\|n\| \|d\|i\|g\|g\|i\|n\|g\| \|s\|t\|a\|r\|t\|e\|d\| | \|u\|p\|d\|a\|t\|e\| | \|6\|8\|7\|f\|4\|3\|5\|b\|-\|0\|a\|c\|b\|-\|4\|0\|b\|9\|-\|a\|6\|8\|c\|-\|0\|3\|9\|0\|5\|a\|6\|0\|f\|4\|4\|1\| | \|f\|a\|l\|s\|e\| | "2026-08-08T05:41:58.703Z" |
| \|7\|c\|8\|0\|7\|3\|d\|d\|-\|d\|2\|3\|4\|-\|4\|d\|9\|4\|-\|a\|2\|d\|a\|-\|7\|5\|7\|2\|4\|0\|b\|9\|1\|c\|4\|1\| | \|1\|b\|3\|e\|a\|d\|9\|6\|-\|5\|6\|e\|1\|-\|4\|7\|a\|b\|-\|9\|7\|e\|1\|-\|6\|f\|e\|6\|c\|5\|5\|9\|5\|8\|3\|b\| | \|N\|e\|w\| \|U\|p\|d\|a\|t\|e\|:\| \|A\|c\|m\|e\| \|H\|e\|a\|d\|q\|u\|a\|r\|t\|e\|r\|s\| | \|R\|e\|b\|a\|r\| \|i\|n\|s\|t\|a\|l\|l\|a\|t\|i\|o\|n\| | \|u\|p\|d\|a\|t\|e\| | \|e\|2\|9\|5\|c\|4\|0\|1\|-\|1\|d\|0\|8\|-\|4\|0\|5\|d\|-\|9\|0\|8\|8\|-\|e\|3\|a\|5\|b\|d\|b\|5\|4\|1\|e\|8\| | \|f\|a\|l\|s\|e\| | "2026-08-08T05:41:58.703Z" |
| \|0\|b\|2\|f\|6\|3\|d\|d\|-\|e\|8\|7\|4\|-\|4\|d\|0\|5\|-\|8\|b\|b\|c\|-\|2\|b\|a\|7\|1\|6\|c\|c\|f\|c\|e\|1\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | \|N\|e\|w\| \|U\|p\|d\|a\|t\|e\|:\| \|A\|c\|m\|e\| \|H\|e\|a\|d\|q\|u\|a\|r\|t\|e\|r\|s\| | \|F\|o\|u\|n\|d\|a\|t\|i\|o\|n\| \|d\|i\|g\|g\|i\|n\|g\| \|s\|t\|a\|r\|t\|e\|d\| | \|u\|p\|d\|a\|t\|e\| | \|6\|8\|7\|f\|4\|3\|5\|b\|-\|0\|a\|c\|b\|-\|4\|0\|b\|9\|-\|a\|6\|8\|c\|-\|0\|3\|9\|0\|5\|a\|6\|0\|f\|4\|4\|1\| | \|t\|r\|u\|e\| | "2026-08-08T05:41:58.703Z" |
| \|9\|e\|f\|2\|4\|1\|3\|3\|-\|2\|c\|a\|b\|-\|4\|6\|2\|d\|-\|9\|5\|8\|8\|-\|4\|e\|9\|3\|5\|9\|2\|8\|1\|8\|c\|1\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | \|N\|e\|w\| \|U\|p\|d\|a\|t\|e\|:\| \|A\|c\|m\|e\| \|H\|e\|a\|d\|q\|u\|a\|r\|t\|e\|r\|s\| | \|R\|e\|b\|a\|r\| \|i\|n\|s\|t\|a\|l\|l\|a\|t\|i\|o\|n\| | \|u\|p\|d\|a\|t\|e\| | \|e\|2\|9\|5\|c\|4\|0\|1\|-\|1\|d\|0\|8\|-\|4\|0\|5\|d\|-\|9\|0\|8\|8\|-\|e\|3\|a\|5\|b\|d\|b\|5\|4\|1\|e\|8\| | \|t\|r\|u\|e\| | "2026-08-08T05:41:58.703Z" |
| \|f\|3\|9\|b\|e\|9\|0\|a\|-\|7\|3\|3\|9\|-\|4\|9\|3\|9\|-\|9\|a\|5\|0\|-\|e\|6\|9\|1\|f\|3\|5\|5\|e\|2\|2\|4\| | \|1\|b\|3\|e\|a\|d\|9\|6\|-\|5\|6\|e\|1\|-\|4\|7\|a\|b\|-\|9\|7\|e\|1\|-\|6\|f\|e\|6\|c\|5\|5\|9\|5\|8\|3\|b\| | \|N\|e\|w\| \|U\|p\|d\|a\|t\|e\| | \|N\|e\|w\| \|u\|p\|d\|a\|t\|e\| \|p\|o\|s\|t\|e\|d\| \|o\|n\| \|F\|o\|u\|n\|d\|a\|t\|i\|o\|n\| \|C\|o\|m\|p\|l\|e\|t\|e\|n\|e\|s\|s\| | \|u\|p\|d\|a\|t\|e\| | \|6\|8\|7\|f\|4\|3\|5\|b\|-\|0\|a\|c\|b\|-\|4\|0\|b\|9\|-\|a\|6\|8\|c\|-\|0\|3\|9\|0\|5\|a\|6\|0\|f\|4\|4\|1\| | \|t\|r\|u\|e\| | "2026-08-08T05:41:58.703Z" |
| \|b\|9\|c\|9\|1\|b\|b\|1\|-\|8\|f\|f\|c\|-\|4\|2\|6\|8\|-\|9\|8\|0\|3\|-\|4\|2\|f\|8\|3\|1\|e\|e\|8\|b\|6\|3\| | \|0\|5\|5\|7\|b\|3\|d\|0\|-\|7\|c\|4\|d\|-\|4\|5\|d\|4\|-\|9\|2\|f\|3\|-\|4\|4\|9\|0\|b\|f\|6\|0\|8\|d\|a\|6\| | \|U\|p\|d\|a\|t\|e\| \|A\|c\|k\|n\|o\|w\|l\|e\|d\|g\|e\|d\| | \|A\| \|c\|l\|i\|e\|n\|t\| \|h\|a\|s\| \|a\|c\|k\|n\|o\|w\|l\|e\|d\|g\|e\|d\| \|y\|o\|u\|r\| \|u\|p\|d\|a\|t\|e\|.\| | \|u\|p\|d\|a\|t\|e\| | \|6\|8\|7\|f\|4\|3\|5\|b\|-\|0\|a\|c\|b\|-\|4\|0\|b\|9\|-\|a\|6\|8\|c\|-\|0\|3\|9\|0\|5\|a\|6\|0\|f\|4\|4\|1\| | \|t\|r\|u\|e\| | "2026-08-08T05:41:58.703Z" |
| \|8\|1\|2\|5\|a\|0\|c\|4\|-\|7\|d\|d\|7\|-\|4\|1\|4\|d\|-\|8\|8\|4\|7\|-\|0\|3\|9\|7\|1\|6\|7\|6\|5\|0\|e\|7\| | \|0\|5\|5\|7\|b\|3\|d\|0\|-\|7\|c\|4\|d\|-\|4\|5\|d\|4\|-\|9\|2\|f\|3\|-\|4\|4\|9\|0\|b\|f\|6\|0\|8\|d\|a\|6\| | \|N\|e\|w\| \|C\|o\|m\|m\|e\|n\|t\| | \|S\|o\|m\|e\|o\|n\|e\| \|c\|o\|m\|m\|e\|n\|t\|e\|d\| \|o\|n\| \|y\|o\|u\|r\| \|u\|p\|d\|a\|t\|e\|.\| | \|c\|o\|m\|m\|e\|n\|t\| | \|6\|8\|7\|f\|4\|3\|5\|b\|-\|0\|a\|c\|b\|-\|4\|0\|b\|9\|-\|a\|6\|8\|c\|-\|0\|3\|9\|0\|5\|a\|6\|0\|f\|4\|4\|1\| | \|t\|r\|u\|e\| | "2026-08-08T05:41:58.703Z" |
| \|2\|8\|4\|9\|4\|e\|1\|3\|-\|f\|f\|7\|e\|-\|4\|7\|1\|0\|-\|9\|b\|3\|1\|-\|6\|e\|0\|6\|a\|3\|9\|6\|1\|6\|7\|c\| | \|0\|5\|5\|7\|b\|3\|d\|0\|-\|7\|c\|4\|d\|-\|4\|5\|d\|4\|-\|9\|2\|f\|3\|-\|4\|4\|9\|0\|b\|f\|6\|0\|8\|d\|a\|6\| | \|N\|e\|w\| \|C\|o\|m\|m\|e\|n\|t\| | \|S\|o\|m\|e\|o\|n\|e\| \|c\|o\|m\|m\|e\|n\|t\|e\|d\| \|o\|n\| \|y\|o\|u\|r\| \|u\|p\|d\|a\|t\|e\|.\| | \|c\|o\|m\|m\|e\|n\|t\| | \|6\|8\|7\|f\|4\|3\|5\|b\|-\|0\|a\|c\|b\|-\|4\|0\|b\|9\|-\|a\|6\|8\|c\|-\|0\|3\|9\|0\|5\|a\|6\|0\|f\|4\|4\|1\| | \|f\|a\|l\|s\|e\| | "2026-08-08T07:12:43.799Z" |
| \|9\|0\|c\|9\|8\|2\|2\|7\|-\|a\|9\|c\|2\|-\|4\|4\|b\|d\|-\|8\|e\|f\|a\|-\|4\|d\|1\|6\|0\|b\|3\|f\|9\|d\|d\|8\| | \|0\|5\|5\|7\|b\|3\|d\|0\|-\|7\|c\|4\|d\|-\|4\|5\|d\|4\|-\|9\|2\|f\|3\|-\|4\|4\|9\|0\|b\|f\|6\|0\|8\|d\|a\|6\| | \|N\|e\|w\| \|C\|o\|m\|m\|e\|n\|t\| | \|S\|o\|m\|e\|o\|n\|e\| \|c\|o\|m\|m\|e\|n\|t\|e\|d\| \|o\|n\| \|y\|o\|u\|r\| \|u\|p\|d\|a\|t\|e\|.\| | \|c\|o\|m\|m\|e\|n\|t\| | \|e\|2\|9\|5\|c\|4\|0\|1\|-\|1\|d\|0\|8\|-\|4\|0\|5\|d\|-\|9\|0\|8\|8\|-\|e\|3\|a\|5\|b\|d\|b\|5\|4\|1\|e\|8\| | \|f\|a\|l\|s\|e\| | "2026-08-08T07:12:51.095Z" |
| \|3\|4\|0\|e\|a\|d\|0\|6\|-\|a\|4\|b\|1\|-\|4\|3\|3\|e\|-\|b\|6\|7\|e\|-\|5\|e\|f\|7\|f\|e\|5\|3\|e\|d\|d\|d\| | \|0\|5\|5\|7\|b\|3\|d\|0\|-\|7\|c\|4\|d\|-\|4\|5\|d\|4\|-\|9\|2\|f\|3\|-\|4\|4\|9\|0\|b\|f\|6\|0\|8\|d\|a\|6\| | \|N\|e\|w\| \|C\|o\|m\|m\|e\|n\|t\| | \|S\|o\|m\|e\|o\|n\|e\| \|c\|o\|m\|m\|e\|n\|t\|e\|d\| \|o\|n\| \|y\|o\|u\|r\| \|u\|p\|d\|a\|t\|e\|.\| | \|c\|o\|m\|m\|e\|n\|t\| | \|6\|8\|7\|f\|4\|3\|5\|b\|-\|0\|a\|c\|b\|-\|4\|0\|b\|9\|-\|a\|6\|8\|c\|-\|0\|3\|9\|0\|5\|a\|6\|0\|f\|4\|4\|1\| | \|f\|a\|l\|s\|e\| | "2026-08-08T11:34:59.782Z" |

---

## Table: `org_vendors`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| organization_id | uuid |
| vendor_id | uuid |
| created_at | timestamp with time zone |

### Data (0 rows)
*No data currently stored in this table.*

---

## Table: `organizations`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| name | text |
| type | text |
| created_at | timestamp with time zone |
| max_projects | integer |
| subscription_tier | text |
| status | text |

### Data (5 rows)
| id | name | type | created_at | max_projects | subscription_tier | status |
| --- | --- | --- | --- | --- | --- | --- |
| \|c\|0\|b\|0\|1\|c\|0\|a\|-\|2\|3\|d\|f\|-\|4\|e\|3\|1\|-\|a\|3\|4\|c\|-\|3\|d\|5\|f\|a\|9\|4\|4\|9\|9\|6\|1\| | \|A\|c\|m\|e\| \|C\|o\|r\|p\| | \|c\|l\|i\|e\|n\|t\| | "2026-08-08T05:41:58.703Z" | \|1\|0\| | \|P\|r\|o\| | \|a\|c\|t\|i\|v\|e\| |
| \|3\|3\|3\|3\|3\|3\|3\|3\|-\|3\|3\|3\|3\|-\|3\|3\|3\|3\|-\|3\|3\|3\|3\|-\|3\|3\|3\|3\|3\|3\|3\|3\|3\|3\|3\|3\| | \|V\|e\|n\|d\|o\|r\| \|M\|a\|n\|u\|f\|a\|c\|t\|u\|r\|i\|n\|g\| \|C\|o\|r\|p\| | \|v\|e\|n\|d\|o\|r\| | "2026-08-13T12:17:37.392Z" | \|1\|0\|0\| | \|e\|n\|t\|e\|r\|p\|r\|i\|s\|e\| | \|a\|c\|t\|i\|v\|e\| |
| \|4\|4\|4\|4\|4\|4\|4\|4\|-\|4\|4\|4\|4\|-\|4\|4\|4\|4\|-\|4\|4\|4\|4\|-\|4\|4\|4\|4\|4\|4\|4\|4\|4\|4\|4\|4\| | \|P\|r\|a\|i\|m\|o\| | \|p\|l\|a\|t\|f\|o\|r\|m\| | "2026-08-13T12:17:37.392Z" | \|1\|0\|0\|0\| | \|e\|n\|t\|e\|r\|p\|r\|i\|s\|e\| | \|a\|c\|t\|i\|v\|e\| |
| \|2\|0\|d\|d\|b\|c\|a\|7\|-\|f\|3\|a\|8\|-\|4\|b\|f\|4\|-\|a\|7\|b\|5\|-\|5\|7\|e\|e\|5\|9\|3\|8\|3\|d\|2\|1\| | \|b\|u\|i\|l\|d\|i\|t\| | \|i\|n\|t\|e\|r\|n\|a\|l\| | "2026-08-08T05:41:58.703Z" | \|5\|0\| | \|E\|n\|t\|e\|r\|p\|r\|i\|s\|e\| | \|a\|c\|t\|i\|v\|e\| |
| \|7\|a\|c\|4\|d\|2\|0\|6\|-\|2\|7\|4\|b\|-\|4\|c\|6\|6\|-\|8\|8\|6\|7\|-\|0\|e\|0\|7\|a\|e\|e\|2\|4\|d\|d\|9\| | \|h\|i\|t\|a\|c\|h\|i\| | \|c\|l\|i\|e\|n\|t\| | "2026-08-08T06:19:04.553Z" | \|5\| | \|F\|r\|e\|e\| | \|a\|c\|t\|i\|v\|e\| |

---

## Table: `platform_settings`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| maintenance_mode | boolean |
| min_android_version | text |
| global_announcement | text |

### Data (1 rows)
| id | maintenance_mode | min_android_version | global_announcement |
| --- | --- | --- | --- |
| \|0\|0\|0\|0\|0\|0\|0\|0\|-\|0\|0\|0\|0\|-\|0\|0\|0\|0\|-\|0\|0\|0\|0\|-\|0\|0\|0\|0\|0\|0\|0\|0\|0\|0\|0\|0\| | \|f\|a\|l\|s\|e\| | \|1\|.\|0\|.\|0\| | *null* |

---

## Table: `project_config`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| project_id | uuid |
| module_name | text |
| is_enabled | boolean |
| updated_by | uuid |
| updated_at | timestamp with time zone |

### Data (1 rows)
| id | project_id | module_name | is_enabled | updated_by | updated_at |
| --- | --- | --- | --- | --- | --- |
| \|c\|a\|5\|1\|8\|a\|7\|9\|-\|e\|2\|d\|3\|-\|4\|c\|4\|9\|-\|8\|7\|6\|f\|-\|f\|3\|4\|8\|4\|5\|9\|5\|b\|7\|1\|d\| | \|f\|e\|d\|5\|f\|a\|1\|a\|-\|0\|d\|3\|a\|-\|4\|3\|b\|8\|-\|9\|f\|a\|5\|-\|b\|5\|f\|0\|3\|c\|9\|d\|2\|e\|d\|c\| | \|c\|h\|a\|n\|g\|e\|_\|r\|e\|q\|u\|e\|s\|t\|s\| | \|t\|r\|u\|e\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | "2026-08-08T05:41:58.703Z" |

---

## Table: `project_handovers`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| project_id | uuid |
| package_name | text |
| document_url | text |
| warranty_expiry | date |
| status | text |
| client_signature_url | text |
| created_by | uuid |
| created_at | timestamp with time zone |
| display_id | text |
| description | text |
| key_attributes | jsonb |
| package_contents | jsonb |
| sign_off_status | jsonb |

### Data (1 rows)
| id | project_id | package_name | document_url | warranty_expiry | status | client_signature_url | created_by | created_at | display_id | description | key_attributes | package_contents | sign_off_status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| \|f\|d\|9\|a\|b\|d\|d\|c\|-\|7\|f\|c\|d\|-\|4\|9\|d\|c\|-\|8\|f\|e\|0\|-\|0\|c\|6\|5\|d\|3\|3\|9\|4\|2\|8\|c\| | \|f\|e\|d\|5\|f\|a\|1\|a\|-\|0\|d\|3\|a\|-\|4\|3\|b\|8\|-\|9\|f\|a\|5\|-\|b\|5\|f\|0\|3\|c\|9\|d\|2\|e\|d\|c\| | \|P\|h\|a\|s\|e\| \|1\| \|H\|a\|n\|d\|o\|v\|e\|r\| | \|h\|t\|t\|p\|s\|:\|/\|/\|d\|o\|c\|s\|.\|u\|r\|l\|/\|h\|a\|n\|d\|o\|v\|e\|r\|1\|.\|p\|d\|f\| | "2027-08-07T18:30:00.000Z" | \|D\|r\|a\|f\|t\| | *null* | \|0\|5\|5\|7\|b\|3\|d\|0\|-\|7\|c\|4\|d\|-\|4\|5\|d\|4\|-\|9\|2\|f\|3\|-\|4\|4\|9\|0\|b\|f\|6\|0\|8\|d\|a\|6\| | "2026-08-08T05:41:58.703Z" | \|H\|O\|-\|0\|0\|1\| | \|H\|a\|n\|d\|o\|v\|e\|r\| \|f\|o\|r\| \|F\|o\|u\|n\|d\|a\|t\|i\|o\|n\| | [] | [] | [] |

---

## Table: `project_issues`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| project_id | uuid |
| title | text |
| description | text |
| severity | text |
| status | text |
| assigned_to | uuid |
| created_by | uuid |
| created_at | timestamp with time zone |
| resolved_at | timestamp with time zone |
| display_id | text |
| root_cause | text |
| timeline_impact | text |
| cost_impact | text |
| resolution_plan | jsonb |
| linked_milestones | jsonb |

### Data (2 rows)
| id | project_id | title | description | severity | status | assigned_to | created_by | created_at | resolved_at | display_id | root_cause | timeline_impact | cost_impact | resolution_plan | linked_milestones |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| \|8\|f\|2\|6\|d\|8\|c\|0\|-\|1\|5\|a\|e\|-\|4\|4\|7\|2\|-\|a\|c\|1\|9\|-\|0\|9\|b\|0\|6\|9\|0\|6\|4\|7\|c\|a\| | \|f\|e\|d\|5\|f\|a\|1\|a\|-\|0\|d\|3\|a\|-\|4\|3\|b\|8\|-\|9\|f\|a\|5\|-\|b\|5\|f\|0\|3\|c\|9\|d\|2\|e\|d\|c\| | \|W\|e\|a\|t\|h\|e\|r\| \|D\|e\|l\|a\|y\| | \|H\|e\|a\|v\|y\| \|r\|a\|i\|n\| \|d\|e\|l\|a\|y\|e\|d\| \|f\|o\|u\|n\|d\|a\|t\|i\|o\|n\| | \|H\|i\|g\|h\| | \|O\|p\|e\|n\| | \|0\|5\|5\|7\|b\|3\|d\|0\|-\|7\|c\|4\|d\|-\|4\|5\|d\|4\|-\|9\|2\|f\|3\|-\|4\|4\|9\|0\|b\|f\|6\|0\|8\|d\|a\|6\| | \|0\|5\|5\|7\|b\|3\|d\|0\|-\|7\|c\|4\|d\|-\|4\|5\|d\|4\|-\|9\|2\|f\|3\|-\|4\|4\|9\|0\|b\|f\|6\|0\|8\|d\|a\|6\| | "2026-08-08T05:41:58.703Z" | *null* | \|I\|S\|S\|-\|0\|0\|1\| | \|W\|e\|a\|t\|h\|e\|r\| | \|3\| \|d\|a\|y\|s\| | \|$\|0\| | [] | [] |
| \|d\|1\|b\|c\|7\|6\|1\|6\|-\|4\|f\|a\|5\|-\|4\|6\|8\|b\|-\|b\|f\|4\|9\|-\|a\|1\|3\|0\|7\|e\|e\|3\|b\|b\|f\|e\| | \|f\|e\|d\|5\|f\|a\|1\|a\|-\|0\|d\|3\|a\|-\|4\|3\|b\|8\|-\|9\|f\|a\|5\|-\|b\|5\|f\|0\|3\|c\|9\|d\|2\|e\|d\|c\| | \|f\|c\|g\|v\|h\|b\|j\| | \|h\|g\|v\|b\|j\|n\|k\|m\| | \|C\|r\|i\|t\|i\|c\|a\|l\| | \|O\|p\|e\|n\| | \|1\|b\|3\|e\|a\|d\|9\|6\|-\|5\|6\|e\|1\|-\|4\|7\|a\|b\|-\|9\|7\|e\|1\|-\|6\|f\|e\|6\|c\|5\|5\|9\|5\|8\|3\|b\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | "2026-08-08T11:42:38.762Z" | *null* | \|I\|S\|S\|-\|8\|7\|6\|2\| | \|d\|f\|x\|c\|g\|v\|h\|b\|j\|n\|k\|m\| | \|h\|.\| \|b\|j\|n\|m\| | \|4\|3\|5\|6\|7\|8\| | [{"step":"g hm","status":"Pending"}] | [{"milestone":"gvbhjnkm"}] |

---

## Table: `project_materials`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| project_id | uuid |
| item_name | text |
| quantity | numeric |
| status | text |
| estimated_delivery | date |
| actual_delivery | date |
| created_by | uuid |
| created_at | timestamp with time zone |
| po_number | text |
| spec_id | text |
| supplier_name | text |
| lead_time | text |
| tracking_timeline | jsonb |
| expected_arrival_date | timestamp with time zone |
| vendor_id | uuid |

### Data (2 rows)
| id | project_id | item_name | quantity | status | estimated_delivery | actual_delivery | created_by | created_at | po_number | spec_id | supplier_name | lead_time | tracking_timeline | expected_arrival_date | vendor_id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| \|b\|e\|8\|7\|2\|f\|4\|e\|-\|9\|9\|c\|2\|-\|4\|1\|d\|0\|-\|a\|4\|4\|8\|-\|d\|f\|d\|c\|4\|c\|6\|c\|2\|b\|f\|f\| | \|f\|e\|d\|5\|f\|a\|1\|a\|-\|0\|d\|3\|a\|-\|4\|3\|b\|8\|-\|9\|f\|a\|5\|-\|b\|5\|f\|0\|3\|c\|9\|d\|2\|e\|d\|c\| | \|C\|o\|n\|c\|r\|e\|t\|e\| | \|5\|0\|0\| | \|D\|e\|l\|i\|v\|e\|r\|e\|d\| | "2026-08-12T18:30:00.000Z" | *null* | \|0\|5\|5\|7\|b\|3\|d\|0\|-\|7\|c\|4\|d\|-\|4\|5\|d\|4\|-\|9\|2\|f\|3\|-\|4\|4\|9\|0\|b\|f\|6\|0\|8\|d\|a\|6\| | "2026-08-08T05:41:58.703Z" | \|P\|O\|-\|C\|O\|N\|-\|0\|1\| | \|S\|P\|E\|C\|-\|0\|0\|1\| | \|C\|e\|m\|e\|n\|t\|C\|o\| | \|5\| \|d\|a\|y\|s\| | [] | "2026-08-13T00:00:00.000Z" | *null* |
| \|9\|3\|b\|b\|5\|f\|f\|1\|-\|0\|0\|7\|7\|-\|4\|f\|1\|e\|-\|a\|e\|9\|a\|-\|f\|2\|1\|2\|d\|e\|2\|e\|0\|6\|3\|c\| | \|f\|e\|d\|5\|f\|a\|1\|a\|-\|0\|d\|3\|a\|-\|4\|3\|b\|8\|-\|9\|f\|a\|5\|-\|b\|5\|f\|0\|3\|c\|9\|d\|2\|e\|d\|c\| | \|d\|f\|c\|g\|h\|v\|j\| | \|5\|4\|6\|7\| | \|O\|r\|d\|e\|r\|e\|d\| | "2026-09-15T18:30:00.000Z" | *null* | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | "2026-08-08T17:06:52.136Z" | \|5\|4\|6\| | \|4\|3\|5\|6\|7\| | \|g\|c\|f\|v\|h\|j\|b\| | \|4\|4\| | *null* | *null* | *null* |

---

## Table: `project_reports`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| project_id | uuid |
| report_data | text |
| generated_at | timestamp with time zone |

### Data (1 rows)
| id | project_id | report_data | generated_at |
| --- | --- | --- | --- |
| \|e\|9\|b\|7\|5\|1\|a\|2\|-\|3\|e\|a\|e\|-\|4\|a\|4\|a\|-\|8\|6\|4\|3\|-\|3\|4\|5\|5\|5\|b\|7\|f\|1\|3\|6\|d\| | \|f\|e\|d\|5\|f\|a\|1\|a\|-\|0\|d\|3\|a\|-\|4\|3\|b\|8\|-\|9\|f\|a\|5\|-\|b\|5\|f\|0\|3\|c\|9\|d\|2\|e\|d\|c\| | \|M\|o\|n\|t\|h\|l\|y\| \|P\|r\|o\|g\|r\|e\|s\|s\|:\| \|O\|n\| \|T\|r\|a\|c\|k\| | "2026-08-08T05:41:58.703Z" |

---

## Table: `project_resources`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| project_id | uuid |
| resource_type | text |
| name | text |
| allocated_hours | numeric |
| productivity_score | integer |
| notes | text |
| created_by | uuid |
| created_at | timestamp with time zone |
| actual_hours | numeric |
| current_assignment | text |

### Data (2 rows)
| id | project_id | resource_type | name | allocated_hours | productivity_score | notes | created_by | created_at | actual_hours | current_assignment |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| \|c\|c\|a\|c\|5\|d\|1\|d\|-\|e\|3\|8\|4\|-\|4\|e\|5\|e\|-\|8\|3\|f\|b\|-\|d\|0\|a\|9\|5\|9\|8\|0\|d\|0\|6\|0\| | \|f\|e\|d\|5\|f\|a\|1\|a\|-\|0\|d\|3\|a\|-\|4\|3\|b\|8\|-\|9\|f\|a\|5\|-\|b\|5\|f\|0\|3\|c\|9\|d\|2\|e\|d\|c\| | \|S\|o\|f\|t\|w\|a\|r\|e\| | \|c\|g\|v\|h\|b\|j\|n\|k\| | \|5\| | \|4\| | \|g\|h\|v\|j\|b\|k\|n\|m\|l\| | *null* | "2026-08-08T11:47:13.103Z" | \|4\|.\|0\|0\| | \|c\|f\|g\|v\|b\|h\|n\|j\| |
| \|1\|0\|2\|8\|a\|6\|d\|0\|-\|1\|e\|f\|b\|-\|4\|6\|e\|4\|-\|8\|b\|f\|f\|-\|6\|6\|a\|e\|b\|8\|8\|9\|3\|7\|9\|8\| | \|f\|e\|d\|5\|f\|a\|1\|a\|-\|0\|d\|3\|a\|-\|4\|3\|b\|8\|-\|9\|f\|a\|5\|-\|b\|5\|f\|0\|3\|c\|9\|d\|2\|e\|d\|c\| | \|M\|e\|c\|h\|a\|n\|i\|c\|a\|l\| | \|E\|x\|c\|a\|v\|a\|t\|o\|r\| \|T\|e\|a\|m\| \|A\| | \|1\|6\|0\|.\|0\|0\| | \|5\| | \|H\|i\|g\|h\| \|p\|e\|r\|f\|o\|r\|m\|a\|n\|c\|e\| | \|0\|5\|5\|7\|b\|3\|d\|0\|-\|7\|c\|4\|d\|-\|4\|5\|d\|4\|-\|9\|2\|f\|3\|-\|4\|4\|9\|0\|b\|f\|6\|0\|8\|d\|a\|6\| | "2026-08-08T05:41:58.703Z" | \|4\|0\|.\|0\|0\| | \|S\|i\|t\|e\| \|A\| \|N\|o\|r\|t\|h\| |

---

## Table: `project_vendors`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| project_id | uuid |
| vendor_id | uuid |
| created_at | timestamp with time zone |

### Data (0 rows)
*No data currently stored in this table.*

---

## Table: `projects`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| name | text |
| description | text |
| client_org_id | uuid |
| assigned_pm_id | uuid |
| status | text |
| created_at | timestamp with time zone |
| start_date | date |
| type | USER-DEFINED |
| tags | ARRAY |
| is_archived | boolean |
| contract_value | numeric |
| client_visibility | text |
| po_reference | text |
| target_date | date |

### Data (5 rows)
| id | name | description | client_org_id | assigned_pm_id | status | created_at | start_date | type | tags | is_archived | contract_value | client_visibility | po_reference | target_date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| \|f\|e\|d\|5\|f\|a\|1\|a\|-\|0\|d\|3\|a\|-\|4\|3\|b\|8\|-\|9\|f\|a\|5\|-\|b\|5\|f\|0\|3\|c\|9\|d\|2\|e\|d\|c\| | \|A\|c\|m\|e\| \|H\|e\|a\|d\|q\|u\|a\|r\|t\|e\|r\|s\| | \|N\|e\|w\| \|H\|Q\| \|b\|u\|i\|l\|d\|i\|n\|g\| \|f\|o\|r\| \|A\|c\|m\|e\| \|C\|o\|r\|p\| | \|c\|0\|b\|0\|1\|c\|0\|a\|-\|2\|3\|d\|f\|-\|4\|e\|3\|1\|-\|a\|3\|4\|c\|-\|3\|d\|5\|f\|a\|9\|4\|4\|9\|9\|6\|1\| | \|0\|5\|5\|7\|b\|3\|d\|0\|-\|7\|c\|4\|d\|-\|4\|5\|d\|4\|-\|9\|2\|f\|3\|-\|4\|4\|9\|0\|b\|f\|6\|0\|8\|d\|a\|6\| | \|I\|n\| \|P\|r\|o\|g\|r\|e\|s\|s\| | "2026-08-08T05:41:58.703Z" | "2026-08-07T18:30:00.000Z" | \|C\|o\|m\|b\|i\|n\|e\|d\| | ["commercial","hq"] | \|f\|a\|l\|s\|e\| | \|5\|0\|0\|0\|0\|0\|0\|.\|0\|0\| | \|F\|u\|l\|l\| \|T\|r\|a\|n\|s\|p\|a\|r\|e\|n\|c\|y\| | \|P\|O\|-\|A\|C\|M\|E\|-\|0\|0\|1\| | "2027-08-07T18:30:00.000Z" |
| \|5\|7\|7\|c\|5\|4\|9\|b\|-\|2\|8\|1\|1\|-\|4\|d\|0\|f\|-\|9\|8\|4\|d\|-\|5\|c\|2\|3\|7\|d\|f\|5\|9\|7\|d\|7\| | \|A\|c\|m\|e\| \|W\|a\|r\|e\|h\|o\|u\|s\|e\| | \|N\|e\|w\| \|w\|a\|r\|e\|h\|o\|u\|s\|e\| \|f\|o\|r\| \|A\|c\|m\|e\| \|C\|o\|r\|p\| | \|c\|0\|b\|0\|1\|c\|0\|a\|-\|2\|3\|d\|f\|-\|4\|e\|3\|1\|-\|a\|3\|4\|c\|-\|3\|d\|5\|f\|a\|9\|4\|4\|9\|9\|6\|1\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | \|N\|o\|t\| \|S\|t\|a\|r\|t\|e\|d\| | "2026-08-08T05:41:58.703Z" | "2026-09-06T18:30:00.000Z" | \|M\|e\|c\|h\|a\|n\|i\|c\|a\|l\| | ["warehouse"] | \|f\|a\|l\|s\|e\| | \|1\|5\|0\|0\|0\|0\|0\|.\|0\|0\| | \|R\|e\|s\|t\|r\|i\|c\|t\|e\|d\| | \|P\|O\|-\|A\|C\|M\|E\|-\|0\|0\|2\| | "2027-02-03T18:30:00.000Z" |
| \|8\|f\|6\|7\|d\|a\|c\|b\|-\|b\|5\|8\|8\|-\|4\|0\|f\|f\|-\|8\|a\|0\|4\|-\|d\|7\|a\|7\|8\|3\|f\|1\|5\|7\|7\|d\| | \|g\|f\|c\|v\|h\|b\|j\| | \|g\|f\|v\|h\|b\|j\|n\| | \|c\|0\|b\|0\|1\|c\|0\|a\|-\|2\|3\|d\|f\|-\|4\|e\|3\|1\|-\|a\|3\|4\|c\|-\|3\|d\|5\|f\|a\|9\|4\|4\|9\|9\|6\|1\| | \|0\|5\|5\|7\|b\|3\|d\|0\|-\|7\|c\|4\|d\|-\|4\|5\|d\|4\|-\|9\|2\|f\|3\|-\|4\|4\|9\|0\|b\|f\|6\|0\|8\|d\|a\|6\| | \|N\|o\|t\| \|S\|t\|a\|r\|t\|e\|d\| | "2026-08-08T11:35:54.919Z" | "2026-08-07T18:30:00.000Z" | \|S\|o\|f\|t\|w\|a\|r\|e\| | [] | \|f\|a\|l\|s\|e\| | \|3\|4\|5\|6\|7\|.\|0\|0\| | \|M\|i\|l\|e\|s\|t\|o\|n\|e\|-\|O\|n\|l\|y\| | \|3\|2\|4\|5\|6\|7\| | "2026-08-30T18:30:00.000Z" |
| \|5\|7\|b\|9\|3\|d\|2\|c\|-\|c\|c\|8\|6\|-\|4\|4\|2\|f\|-\|a\|1\|f\|d\|-\|c\|b\|6\|a\|2\|f\|6\|d\|2\|c\|4\|f\| | \|f\|g\|c\|v\|h\|b\| | \|b\| \|n\| | \|c\|0\|b\|0\|1\|c\|0\|a\|-\|2\|3\|d\|f\|-\|4\|e\|3\|1\|-\|a\|3\|4\|c\|-\|3\|d\|5\|f\|a\|9\|4\|4\|9\|9\|6\|1\| | \|0\|5\|5\|7\|b\|3\|d\|0\|-\|7\|c\|4\|d\|-\|4\|5\|d\|4\|-\|9\|2\|f\|3\|-\|4\|4\|9\|0\|b\|f\|6\|0\|8\|d\|a\|6\| | \|N\|o\|t\| \|S\|t\|a\|r\|t\|e\|d\| | "2026-08-13T10:50:03.055Z" | *null* | \|E\|l\|e\|c\|t\|r\|i\|c\|a\|l\| | [] | \|f\|a\|l\|s\|e\| | \|5\|6\|7\|8\|.\|0\|0\| | \|R\|e\|s\|t\|r\|i\|c\|t\|e\|d\| | \|3\|3\|4\|5\|6\| | "2026-09-04T18:30:00.000Z" |
| \|5\|2\|9\|c\|9\|6\|b\|1\|-\|6\|4\|b\|2\|-\|4\|9\|c\|0\|-\|a\|4\|9\|0\|-\|e\|7\|c\|2\|8\|d\|3\|4\|2\|5\|1\|8\| | \|r\|t\|f\|y\|g\| | \|v\|g\|h\|b\|j\| | \|c\|0\|b\|0\|1\|c\|0\|a\|-\|2\|3\|d\|f\|-\|4\|e\|3\|1\|-\|a\|3\|4\|c\|-\|3\|d\|5\|f\|a\|9\|4\|4\|9\|9\|6\|1\| | \|0\|5\|5\|7\|b\|3\|d\|0\|-\|7\|c\|4\|d\|-\|4\|5\|d\|4\|-\|9\|2\|f\|3\|-\|4\|4\|9\|0\|b\|f\|6\|0\|8\|d\|a\|6\| | \|N\|o\|t\| \|S\|t\|a\|r\|t\|e\|d\| | "2026-08-13T10:53:14.066Z" | *null* | \|M\|e\|c\|h\|a\|n\|i\|c\|a\|l\| | [] | \|f\|a\|l\|s\|e\| | \|4\|5\|6\|7\|8\|.\|0\|0\| | \|R\|e\|s\|t\|r\|i\|c\|t\|e\|d\| | \|4\|5\|6\|7\|8\| | "2026-09-04T18:30:00.000Z" |

---

## Table: `push_tokens`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| user_id | uuid |
| token | text |
| platform | text |
| created_at | timestamp with time zone |
| updated_at | timestamp with time zone |

### Data (4 rows)
| id | user_id | token | platform | created_at | updated_at |
| --- | --- | --- | --- | --- | --- |
| \|6\|f\|a\|a\|f\|c\|8\|9\|-\|6\|8\|8\|3\|-\|4\|b\|8\|3\|-\|9\|b\|4\|6\|-\|b\|4\|0\|6\|0\|0\|a\|1\|1\|2\|0\|9\| | \|1\|b\|3\|e\|a\|d\|9\|6\|-\|5\|6\|e\|1\|-\|4\|7\|a\|b\|-\|9\|7\|e\|1\|-\|6\|f\|e\|6\|c\|5\|5\|9\|5\|8\|3\|b\| | \|t\|o\|k\|e\|n\|_\|x\|y\|z\|_\|1\|2\|3\| | \|i\|O\|S\| | "2026-08-08T05:41:58.703Z" | "2026-08-08T05:41:58.703Z" |
| \|7\|6\|7\|5\|4\|7\|d\|d\|-\|0\|b\|1\|9\|-\|4\|9\|c\|5\|-\|a\|f\|c\|e\|-\|5\|4\|e\|b\|d\|c\|a\|a\|c\|4\|b\|6\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | \|c\|l\|h\|M\|X\|1\|X\|J\|S\|T\|C\|I\|X\|e\|N\|w\|f\|X\|I\|_\|R\|0\|:\|A\|P\|A\|9\|1\|b\|G\|3\|W\|e\|D\|_\|J\|1\|j\|t\|1\|m\|8\|P\|d\|i\|S\|G\|h\|b\|t\|Q\|i\|Z\|0\|g\|A\|V\|B\|u\|O\|1\|3\|l\|h\|O\|B\|R\|y\|U\|X\|p\|S\|d\|V\|S\|w\|-\|x\|n\|X\|x\|T\|9\|S\|u\|H\|M\|H\|a\|V\|g\|X\|C\|H\|Y\|N\|D\|D\|u\|4\|g\|5\|Y\|2\|I\|B\|M\|i\|-\|j\|H\|D\|w\|L\|2\|o\|t\|u\|k\|x\|N\|s\|W\|2\|_\|D\|S\|r\|s\|f\|h\|D\|e\|I\|r\|7\|s\|T\|U\|_\|O\|I\| | \|a\|n\|d\|r\|o\|i\|d\| | "2026-08-11T05:42:53.363Z" | "2026-08-11T11:20:17.303Z" |
| \|9\|d\|a\|e\|a\|d\|5\|c\|-\|d\|2\|2\|c\|-\|4\|1\|1\|7\|-\|9\|b\|e\|e\|-\|3\|5\|1\|0\|a\|b\|5\|7\|7\|c\|2\|d\| | \|1\|b\|3\|e\|a\|d\|9\|6\|-\|5\|6\|e\|1\|-\|4\|7\|a\|b\|-\|9\|7\|e\|1\|-\|6\|f\|e\|6\|c\|5\|5\|9\|5\|8\|3\|b\| | \|c\|l\|h\|M\|X\|1\|X\|J\|S\|T\|C\|I\|X\|e\|N\|w\|f\|X\|I\|_\|R\|0\|:\|A\|P\|A\|9\|1\|b\|G\|3\|W\|e\|D\|_\|J\|1\|j\|t\|1\|m\|8\|P\|d\|i\|S\|G\|h\|b\|t\|Q\|i\|Z\|0\|g\|A\|V\|B\|u\|O\|1\|3\|l\|h\|O\|B\|R\|y\|U\|X\|p\|S\|d\|V\|S\|w\|-\|x\|n\|X\|x\|T\|9\|S\|u\|H\|M\|H\|a\|V\|g\|X\|C\|H\|Y\|N\|D\|D\|u\|4\|g\|5\|Y\|2\|I\|B\|M\|i\|-\|j\|H\|D\|w\|L\|2\|o\|t\|u\|k\|x\|N\|s\|W\|2\|_\|D\|S\|r\|s\|f\|h\|D\|e\|I\|r\|7\|s\|T\|U\|_\|O\|I\| | \|a\|n\|d\|r\|o\|i\|d\| | "2026-08-11T05:50:39.634Z" | "2026-08-11T11:20:38.616Z" |
| \|2\|3\|4\|e\|3\|0\|3\|6\|-\|4\|6\|9\|6\|-\|4\|7\|6\|e\|-\|b\|5\|8\|d\|-\|b\|9\|b\|7\|c\|5\|0\|4\|f\|9\|f\|8\| | \|0\|5\|5\|7\|b\|3\|d\|0\|-\|7\|c\|4\|d\|-\|4\|5\|d\|4\|-\|9\|2\|f\|3\|-\|4\|4\|9\|0\|b\|f\|6\|0\|8\|d\|a\|6\| | \|c\|l\|h\|M\|X\|1\|X\|J\|S\|T\|C\|I\|X\|e\|N\|w\|f\|X\|I\|_\|R\|0\|:\|A\|P\|A\|9\|1\|b\|G\|3\|W\|e\|D\|_\|J\|1\|j\|t\|1\|m\|8\|P\|d\|i\|S\|G\|h\|b\|t\|Q\|i\|Z\|0\|g\|A\|V\|B\|u\|O\|1\|3\|l\|h\|O\|B\|R\|y\|U\|X\|p\|S\|d\|V\|S\|w\|-\|x\|n\|X\|x\|T\|9\|S\|u\|H\|M\|H\|a\|V\|g\|X\|C\|H\|Y\|N\|D\|D\|u\|4\|g\|5\|Y\|2\|I\|B\|M\|i\|-\|j\|H\|D\|w\|L\|2\|o\|t\|u\|k\|x\|N\|s\|W\|2\|_\|D\|S\|r\|s\|f\|h\|D\|e\|I\|r\|7\|s\|T\|U\|_\|O\|I\| | \|a\|n\|d\|r\|o\|i\|d\| | "2026-08-11T05:50:54.970Z" | "2026-08-11T11:20:53.961Z" |

---

## Table: `scheduled_reports`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| name | text |
| format | text |
| schedule | text |
| next_run | timestamp with time zone |
| created_at | timestamp with time zone |
| created_by | uuid |
| project_id | uuid |
| parameters | jsonb |

### Data (0 rows)
*No data currently stored in this table.*

---

## Table: `subscription_tiers`

### Schema
| Column | Type |
|---|---|
| tier_name | text |
| max_storage_gb | integer |
| max_projects | integer |

### Data (3 rows)
| tier_name | max_storage_gb | max_projects |
| --- | --- | --- |
| \|S\|t\|a\|r\|t\|e\|r\| | \|1\|0\|0\| | \|1\|0\| |
| \|P\|r\|o\| | \|1\|0\|0\|0\| | \|1\|0\|0\| |
| \|E\|n\|t\|e\|r\|p\|r\|i\|s\|e\| | \|5\|0\|0\|0\| | \|5\|0\|0\| |

---

## Table: `support_tickets`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| title | text |
| description | text |
| priority | text |
| user_id | uuid |
| created_at | timestamp with time zone |
| status | text |
| resolution_notes | text |
| updated_at | timestamp with time zone |

### Data (2 rows)
| id | title | description | priority | user_id | created_at | status | resolution_notes | updated_at |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| \|a\|5\|d\|2\|c\|9\|a\|7\|-\|1\|7\|8\|9\|-\|4\|a\|4\|8\|-\|9\|5\|8\|5\|-\|6\|4\|1\|4\|a\|e\|b\|8\|0\|f\|0\|9\| | \|A\|p\|p\| \|C\|r\|a\|s\|h\|i\|n\|g\| | \|A\|p\|p\| \|c\|r\|a\|s\|h\|e\|s\| \|w\|h\|e\|n\| \|I\| \|u\|p\|l\|o\|a\|d\| \|l\|a\|r\|g\|e\| \|v\|i\|d\|e\|o\|s\| | \|H\|i\|g\|h\| | \|1\|b\|3\|e\|a\|d\|9\|6\|-\|5\|6\|e\|1\|-\|4\|7\|a\|b\|-\|9\|7\|e\|1\|-\|6\|f\|e\|6\|c\|5\|5\|9\|5\|8\|3\|b\| | "2026-08-08T05:41:58.703Z" | \|O\|p\|e\|n\| | *null* | "2026-08-10T15:32:05.654Z" |
| \|d\|f\|f\|8\|e\|e\|a\|1\|-\|9\|b\|7\|8\|-\|4\|3\|5\|9\|-\|b\|6\|d\|f\|-\|d\|9\|4\|7\|1\|f\|9\|e\|8\|f\|0\|b\| | \|x\|a\|c\|s\|d\|s\| | \|s\|w\|d\|a\|c\|e\|f\| \|s\| | \|L\|o\|w\| | \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | "2026-08-08T11:00:07.968Z" | \|O\|p\|e\|n\| | *null* | "2026-08-10T15:32:05.654Z" |

---

## Table: `tasks`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| project_id | uuid |
| assignee_id | uuid |
| created_by | uuid |
| title | text |
| description | text |
| status | text |
| priority | text |
| due_date | timestamp with time zone |
| created_at | timestamp with time zone |
| updated_at | timestamp with time zone |

### Data (0 rows)
*No data currently stored in this table.*

---

## Table: `updates`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| project_id | uuid |
| milestone_id | uuid |
| author_id | uuid |
| caption | text |
| location_name | text |
| created_at | timestamp with time zone |
| latitude | numeric |
| longitude | numeric |
| is_watermarked | boolean |
| approval_status | text |

### Data (2 rows)
| id | project_id | milestone_id | author_id | caption | location_name | created_at | latitude | longitude | is_watermarked | approval_status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| \|6\|8\|7\|f\|4\|3\|5\|b\|-\|0\|a\|c\|b\|-\|4\|0\|b\|9\|-\|a\|6\|8\|c\|-\|0\|3\|9\|0\|5\|a\|6\|0\|f\|4\|4\|1\| | \|f\|e\|d\|5\|f\|a\|1\|a\|-\|0\|d\|3\|a\|-\|4\|3\|b\|8\|-\|9\|f\|a\|5\|-\|b\|5\|f\|0\|3\|c\|9\|d\|2\|e\|d\|c\| | \|1\|5\|9\|3\|9\|c\|5\|9\|-\|a\|1\|1\|5\|-\|4\|5\|1\|f\|-\|a\|5\|4\|4\|-\|5\|f\|1\|f\|0\|f\|5\|a\|9\|c\|6\|f\| | \|0\|5\|5\|7\|b\|3\|d\|0\|-\|7\|c\|4\|d\|-\|4\|5\|d\|4\|-\|9\|2\|f\|3\|-\|4\|4\|9\|0\|b\|f\|6\|0\|8\|d\|a\|6\| | \|F\|o\|u\|n\|d\|a\|t\|i\|o\|n\| \|d\|i\|g\|g\|i\|n\|g\| \|s\|t\|a\|r\|t\|e\|d\| | \|S\|i\|t\|e\| \|A\| \|N\|o\|r\|t\|h\| | "2026-08-08T05:41:58.703Z" | \|4\|0\|.\|7\|1\|2\|8\|0\|0\|0\|0\| | \|-\|7\|4\|.\|0\|0\|6\|0\|0\|0\|0\|0\| | \|t\|r\|u\|e\| | \|A\|p\|p\|r\|o\|v\|e\|d\| |
| \|e\|2\|9\|5\|c\|4\|0\|1\|-\|1\|d\|0\|8\|-\|4\|0\|5\|d\|-\|9\|0\|8\|8\|-\|e\|3\|a\|5\|b\|d\|b\|5\|4\|1\|e\|8\| | \|f\|e\|d\|5\|f\|a\|1\|a\|-\|0\|d\|3\|a\|-\|4\|3\|b\|8\|-\|9\|f\|a\|5\|-\|b\|5\|f\|0\|3\|c\|9\|d\|2\|e\|d\|c\| | \|1\|5\|9\|3\|9\|c\|5\|9\|-\|a\|1\|1\|5\|-\|4\|5\|1\|f\|-\|a\|5\|4\|4\|-\|5\|f\|1\|f\|0\|f\|5\|a\|9\|c\|6\|f\| | \|0\|5\|5\|7\|b\|3\|d\|0\|-\|7\|c\|4\|d\|-\|4\|5\|d\|4\|-\|9\|2\|f\|3\|-\|4\|4\|9\|0\|b\|f\|6\|0\|8\|d\|a\|6\| | \|R\|e\|b\|a\|r\| \|i\|n\|s\|t\|a\|l\|l\|a\|t\|i\|o\|n\| | \|S\|i\|t\|e\| \|A\| \|E\|a\|s\|t\| | "2026-08-08T05:41:58.703Z" | \|4\|0\|.\|7\|1\|3\|0\|0\|0\|0\|0\| | \|-\|7\|4\|.\|0\|0\|6\|5\|0\|0\|0\|0\| | \|f\|a\|l\|s\|e\| | \|A\|p\|p\|r\|o\|v\|e\|d\| |

---

## Table: `user_actor`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| role | text |
| organization_id | uuid |
| created_at | timestamp with time zone |
| display_name | text |
| is_active | boolean |
| failed_login_attempts | integer |
| lockout_until | timestamp with time zone |
| bio | text |
| avatar_url | text |

### Data (6 rows)
| id | role | organization_id | created_at | display_name | is_active | failed_login_attempts | lockout_until | bio | avatar_url |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| \|1\|b\|3\|e\|a\|d\|9\|6\|-\|5\|6\|e\|1\|-\|4\|7\|a\|b\|-\|9\|7\|e\|1\|-\|6\|f\|e\|6\|c\|5\|5\|9\|5\|8\|3\|b\| | \|c\|l\|i\|e\|n\|t\| | \|c\|0\|b\|0\|1\|c\|0\|a\|-\|2\|3\|d\|f\|-\|4\|e\|3\|1\|-\|a\|3\|4\|c\|-\|3\|d\|5\|f\|a\|9\|4\|4\|9\|9\|6\|1\| | "2026-08-08T05:41:58.703Z" | \|J\|a\|y\|e\|s\|h\| | \|t\|r\|u\|e\| | \|0\| | *null* | \|C\|l\|i\|e\|n\|t\| \|R\|e\|p\| | \|h\|t\|t\|p\|s\|:\|/\|/\|a\|v\|a\|t\|a\|r\|.\|u\|r\|l\|/\|2\| |
| \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | \|a\|d\|m\|i\|n\| | \|2\|0\|d\|d\|b\|c\|a\|7\|-\|f\|3\|a\|8\|-\|4\|b\|f\|4\|-\|a\|7\|b\|5\|-\|5\|7\|e\|e\|5\|9\|3\|8\|3\|d\|2\|1\| | "2026-08-08T05:41:58.703Z" | \|P\|r\|i\|t\|h\|v\|i\| | \|t\|r\|u\|e\| | \|0\| | *null* | \|A\|d\|m\|i\|n\| \|a\|t\| \|B\|u\|i\|l\|d\|I\|t\| | \|h\|t\|t\|p\|s\|:\|/\|/\|a\|v\|a\|t\|a\|r\|.\|u\|r\|l\|/\|1\| |
| \|0\|5\|5\|7\|b\|3\|d\|0\|-\|7\|c\|4\|d\|-\|4\|5\|d\|4\|-\|9\|2\|f\|3\|-\|4\|4\|9\|0\|b\|f\|6\|0\|8\|d\|a\|6\| | \|p\|m\| | \|2\|0\|d\|d\|b\|c\|a\|7\|-\|f\|3\|a\|8\|-\|4\|b\|f\|4\|-\|a\|7\|b\|5\|-\|5\|7\|e\|e\|5\|9\|3\|8\|3\|d\|2\|1\| | "2026-08-08T05:41:58.703Z" | \|A\|b\|h\|a\|y\| | \|t\|r\|u\|e\| | \|0\| | *null* | \|P\|M\| \|a\|t\| \|B\|u\|i\|l\|d\|I\|t\| | \|h\|t\|t\|p\|s\|:\|/\|/\|a\|v\|a\|t\|a\|r\|.\|u\|r\|l\|/\|3\| |
| \|3\|d\|9\|7\|4\|4\|b\|5\|-\|5\|8\|3\|6\|-\|4\|3\|4\|7\|-\|b\|f\|b\|4\|-\|9\|3\|d\|6\|5\|9\|3\|a\|c\|7\|e\|a\| | \|v\|e\|n\|d\|o\|r\| | \|3\|3\|3\|3\|3\|3\|3\|3\|-\|3\|3\|3\|3\|-\|3\|3\|3\|3\|-\|3\|3\|3\|3\|-\|3\|3\|3\|3\|3\|3\|3\|3\|3\|3\|3\|3\| | "2026-08-13T12:03:38.876Z" | \|v\|e\|n\|d\|o\|r\| | \|t\|r\|u\|e\| | \|0\| | *null* | \|E\|x\|t\|e\|r\|n\|a\|l\| \|M\|a\|n\|u\|f\|a\|c\|t\|u\|r\|i\|n\|g\| \|S\|u\|b\|c\|o\|n\|t\|r\|a\|c\|t\|o\|r\| | \|h\|t\|t\|p\|s\|:\|/\|/\|a\|v\|a\|t\|a\|r\|.\|u\|r\|l\|/\|4\| |
| \|d\|d\|6\|d\|5\|f\|5\|b\|-\|f\|2\|4\|1\|-\|4\|d\|0\|6\|-\|8\|2\|1\|d\|-\|c\|6\|5\|6\|b\|8\|5\|d\|8\|2\|5\|e\| | \|s\|u\|p\|e\|r\|_\|a\|d\|m\|i\|n\| | \|4\|4\|4\|4\|4\|4\|4\|4\|-\|4\|4\|4\|4\|-\|4\|4\|4\|4\|-\|4\|4\|4\|4\|-\|4\|4\|4\|4\|4\|4\|4\|4\|4\|4\|4\|4\| | "2026-08-13T12:03:38.876Z" | \|s\|u\|p\|e\|r\|a\|d\|m\|i\|n\| | \|t\|r\|u\|e\| | \|0\| | *null* | \|S\|e\|t\|u\|u\| \|P\|l\|a\|t\|f\|o\|r\|m\| \|A\|r\|c\|h\|i\|t\|e\|c\|t\| | \|h\|t\|t\|p\|s\|:\|/\|/\|a\|v\|a\|t\|a\|r\|.\|u\|r\|l\|/\|5\| |
| \|f\|e\|d\|e\|4\|e\|5\|0\|-\|5\|0\|f\|e\|-\|4\|6\|5\|2\|-\|a\|5\|4\|d\|-\|3\|d\|e\|5\|b\|4\|3\|2\|c\|5\|7\|9\| | \|e\|n\|g\|i\|n\|e\|e\|r\| | \|2\|0\|d\|d\|b\|c\|a\|7\|-\|f\|3\|a\|8\|-\|4\|b\|f\|4\|-\|a\|7\|b\|5\|-\|5\|7\|e\|e\|5\|9\|3\|8\|3\|d\|2\|1\| | "2026-08-13T12:03:38.876Z" | \|S\|a\|r\|t\|h\|a\|k\| | \|t\|r\|u\|e\| | \|0\| | *null* | \|M\|u\|l\|t\|i\|d\|i\|s\|c\|i\|p\|l\|i\|n\|a\|r\|y\| \|S\|y\|s\|t\|e\|m\|s\| \|E\|n\|g\|i\|n\|e\|e\|r\| | \|h\|t\|t\|p\|s\|:\|/\|/\|a\|v\|a\|t\|a\|r\|.\|u\|r\|l\|/\|6\| |

---

## Table: `user_identity`

### Schema
| Column | Type |
|---|---|
| actor_id | uuid |
| email | character varying |
| phone | character varying |
| full_name | character varying |
| password_hash | character varying |
| biometric_enabled | boolean |

### Data (6 rows)
| actor_id | email | phone | full_name | password_hash | biometric_enabled |
| --- | --- | --- | --- | --- | --- |
| \|0\|5\|5\|7\|b\|3\|d\|0\|-\|7\|c\|4\|d\|-\|4\|5\|d\|4\|-\|9\|2\|f\|3\|-\|4\|4\|9\|0\|b\|f\|6\|0\|8\|d\|a\|6\| | \|p\|m\|@\|b\|u\|i\|l\|d\|i\|t\|.\|c\|o\|m\| | \|+\|1\|1\|2\|2\|3\|3\|4\|4\|5\|5\| | \|A\|b\|h\|a\|y\| | \|h\|a\|s\|h\|e\|d\|_\|p\|w\|_\|3\| | \|t\|r\|u\|e\| |
| \|1\|c\|1\|b\|f\|0\|6\|2\|-\|9\|5\|f\|a\|-\|4\|f\|d\|d\|-\|9\|2\|3\|1\|-\|0\|d\|2\|e\|c\|9\|a\|2\|7\|6\|6\|e\| | \|a\|d\|m\|i\|n\|@\|b\|u\|i\|l\|d\|i\|t\|.\|c\|o\|m\| | \|+\|1\|2\|3\|4\|5\|6\|7\|8\|9\|0\| | \|P\|r\|i\|t\|h\|v\|i\| | \|h\|a\|s\|h\|e\|d\|_\|p\|w\|_\|1\| | \|t\|r\|u\|e\| |
| \|1\|b\|3\|e\|a\|d\|9\|6\|-\|5\|6\|e\|1\|-\|4\|7\|a\|b\|-\|9\|7\|e\|1\|-\|6\|f\|e\|6\|c\|5\|5\|9\|5\|8\|3\|b\| | \|c\|l\|i\|e\|n\|t\|@\|a\|c\|m\|e\|.\|c\|o\|m\| | \|+\|0\|9\|8\|7\|6\|5\|4\|3\|2\|1\| | \|J\|a\|y\|e\|s\|h\| | \|h\|a\|s\|h\|e\|d\|_\|p\|w\|_\|2\| | \|t\|r\|u\|e\| |
| \|3\|d\|9\|7\|4\|4\|b\|5\|-\|5\|8\|3\|6\|-\|4\|3\|4\|7\|-\|b\|f\|b\|4\|-\|9\|3\|d\|6\|5\|9\|3\|a\|c\|7\|e\|a\| | \|v\|e\|n\|d\|o\|r\|@\|d\|e\|m\|o\|.\|c\|o\|m\| | *null* | \|v\|e\|n\|d\|o\|r\| | \|E\|X\|T\|E\|R\|N\|A\|L\|_\|A\|U\|T\|H\| | \|t\|r\|u\|e\| |
| \|d\|d\|6\|d\|5\|f\|5\|b\|-\|f\|2\|4\|1\|-\|4\|d\|0\|6\|-\|8\|2\|1\|d\|-\|c\|6\|5\|6\|b\|8\|5\|d\|8\|2\|5\|e\| | \|s\|u\|p\|e\|r\|a\|d\|m\|i\|n\|@\|d\|e\|m\|o\|.\|c\|o\|m\| | *null* | \|s\|u\|p\|e\|r\|a\|d\|m\|i\|n\| | \|E\|X\|T\|E\|R\|N\|A\|L\|_\|A\|U\|T\|H\| | \|t\|r\|u\|e\| |
| \|f\|e\|d\|e\|4\|e\|5\|0\|-\|5\|0\|f\|e\|-\|4\|6\|5\|2\|-\|a\|5\|4\|d\|-\|3\|d\|e\|5\|b\|4\|3\|2\|c\|5\|7\|9\| | \|e\|n\|g\|i\|n\|e\|e\|r\|@\|d\|e\|m\|o\|.\|c\|o\|m\| | *null* | \|S\|a\|r\|t\|h\|a\|k\| | \|E\|X\|T\|E\|R\|N\|A\|L\|_\|A\|U\|T\|H\| | \|t\|r\|u\|e\| |

---

## Table: `virus_scan_results`

### Schema
| Column | Type |
|---|---|
| id | uuid |
| file_id | uuid |
| is_clean | boolean |
| threats_found | text |
| scanned_at | timestamp with time zone |

### Data (2 rows)
| id | file_id | is_clean | threats_found | scanned_at |
| --- | --- | --- | --- | --- |
| \|5\|0\|b\|0\|2\|f\|b\|c\|-\|8\|0\|6\|d\|-\|4\|b\|8\|9\|-\|8\|0\|3\|a\|-\|d\|8\|8\|3\|9\|c\|2\|1\|d\|3\|1\|0\| | \|e\|7\|8\|2\|e\|2\|f\|d\|-\|2\|3\|5\|2\|-\|4\|8\|7\|7\|-\|8\|5\|3\|5\|-\|e\|c\|2\|d\|2\|5\|e\|e\|1\|f\|0\|4\| | \|t\|r\|u\|e\| | *null* | "2026-08-08T04:57:44.979Z" |
| \|8\|5\|1\|3\|9\|0\|5\|9\|-\|f\|3\|5\|3\|-\|4\|f\|4\|e\|-\|9\|2\|f\|e\|-\|4\|d\|c\|f\|c\|2\|0\|4\|1\|6\|c\|c\| | \|7\|3\|a\|0\|a\|e\|2\|4\|-\|8\|8\|5\|d\|-\|4\|0\|c\|4\|-\|b\|0\|c\|0\|-\|6\|7\|0\|9\|6\|7\|9\|a\|3\|1\|6\|7\| | \|t\|r\|u\|e\| | *null* | "2026-08-08T05:41:58.703Z" |

---

