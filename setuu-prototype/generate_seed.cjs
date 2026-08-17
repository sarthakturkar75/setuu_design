const fs = require('fs');

const uuid = () => 'gen_random_uuid()';

function run() {
  let sql = `-- Comprehensive Seed Data for Phase 0\n-- Generated automatically\n\n`;

  // Helper arrays to store generated IDs (we use deterministic UUIDs for foreign keys)
  const org1_id = '11111111-1111-1111-1111-111111111111';
  const org2_id = '22222222-2222-2222-2222-222222222222';
  const super_admin_id = '33333333-3333-3333-3333-333333333333';
  const admin1_id = '44444444-4444-4444-4444-444444444444';
  const admin2_id = '55555555-5555-5555-5555-555555555555';

  const pm_ids = Array.from({length: 3}, (_, i) => `66666666-6666-6666-6666-00000000000${i}`);
  const emp_ids = Array.from({length: 5}, (_, i) => `77777777-7777-7777-7777-00000000000${i}`);
  const vendor_ids = Array.from({length: 3}, (_, i) => `88888888-8888-8888-8888-00000000000${i}`);
  const client_ids = Array.from({length: 2}, (_, i) => `99999999-9999-9999-9999-00000000000${i}`);
  
  const project_ids = Array.from({length: 8}, (_, i) => `aaaaaaaa-aaaa-aaaa-aaaa-00000000000${i}`);
  
  const insertUser = (id, email, name, role, org_id) => {
    sql += `
INSERT INTO user_identity (actor_id, email, phone, full_name, password_hash)
VALUES ('${id}', '${email}', '+15550000000', '${name}', 'hashed_password_mock');
INSERT INTO user_actor (id, role, organization_id, display_name, is_active)
VALUES ('${id}', '${role}', ${org_id ? `'${org_id}'` : 'NULL'}, '${name}', true);
`;
  };

  sql += `-- 1. Organizations\n`;
  sql += `INSERT INTO organizations (id, name, type, max_projects, subscription_tier, status) VALUES 
  ('${org1_id}', 'Praimo Innovation', 'Enterprise', 100, 'Pro', 'Active'),
  ('${org2_id}', 'Acme Manufacturing', 'Client', 50, 'Basic', 'Active');\n`;

  sql += `-- 2. Users (Super Admin, Admins, PMs, Employees, Vendors, Clients)\n`;
  insertUser(super_admin_id, 'super@setuu.com', 'Super Admin', 'super_admin', null);
  insertUser(admin1_id, 'admin1@praimo.com', 'Praimo Admin', 'admin', org1_id);
  insertUser(admin2_id, 'admin2@acme.com', 'Acme Admin', 'admin', org2_id);

  pm_ids.forEach((id, i) => insertUser(id, `pm${i}@praimo.com`, `Project Manager ${i}`, 'pm', org1_id));
  emp_ids.forEach((id, i) => insertUser(id, `emp${i}@praimo.com`, `Engineer ${i}`, 'employee', org1_id));
  vendor_ids.forEach((id, i) => insertUser(id, `vendor${i}@supply.com`, `Vendor ${i}`, 'vendor', org1_id));
  client_ids.forEach((id, i) => insertUser(id, `client${i}@acme.com`, `Client ${i}`, 'client', org2_id));

  sql += `-- 3. Projects (8 Projects)\n`;
  const statuses = ['draft', 'active', 'on_hold', 'completed', 'archived', 'active', 'active', 'active'];
  project_ids.forEach((id, i) => {
    sql += `INSERT INTO projects (id, name, description, client_org_id, assigned_pm_id, status, type) 
    VALUES ('${id}', 'Project Alpha ${i}', 'Description for project ${i}', '${org2_id}', '${pm_ids[i % pm_ids.length]}', '${statuses[i]}', 'commercial');\n`;
  });

  sql += `-- 4. Milestones (20+ Milestones)\n`;
  let milestone_ids = [];
  project_ids.forEach((proj_id, p) => {
    for (let m = 0; m < 3; m++) {
      let m_id = `bbbbbbbb-bbbb-bbbb-bbbb-${p}0000000000${m}`;
      milestone_ids.push(m_id);
      sql += `INSERT INTO milestones (id, project_id, name, status, weight_percent, department, display_order) 
      VALUES ('${m_id}', '${proj_id}', 'Phase ${m+1}', 'active', 33.3, 'civil', ${m});\n`;
      
      for (let c = 0; c < 2; c++) {
        sql += `INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at)
        VALUES ('${m_id}', 'Checklist Item ${c}', false, ${c}, now(), now());\n`;
      }
    }
  });

  sql += `-- 5. Updates (30+ Updates) and Attachments\n`;
  let update_ids = [];
  milestone_ids.forEach((m_id, u) => {
    for (let j = 0; j < 2; j++) {
      let u_id = `cccccccc-cccc-cccc-cccc-${u}0000000000${j}`;
      update_ids.push(u_id);
      let proj_id = project_ids[Math.floor(u / 3)];
      sql += `INSERT INTO updates (id, project_id, milestone_id, author_id, body, location_name, latitude, longitude)
      VALUES ('${u_id}', '${proj_id}', '${m_id}', '${emp_ids[0]}', 'Site update ${j} for milestone', 'Site A', 37.77, -122.41);\n`;
      
      sql += `INSERT INTO media_attachments (update_id, file_url, media_type, uploaded_by)
      VALUES ('${u_id}', 'https://example.com/photo.jpg', 'image', '${emp_ids[0]}');\n`;
    }
  });

  sql += `-- 6. Comments (15+ Comments)\n`;
  for(let c = 0; c < 20; c++) {
    sql += `INSERT INTO comments (update_id, author_id, body)
    VALUES ('${update_ids[c % update_ids.length]}', '${emp_ids[1]}', 'Looks good ${c}');\n`;
  }

  sql += `-- 7. Acknowledgements (10+ Acks)\n`;
  for(let a = 0; a < 15; a++) {
    sql += `INSERT INTO acknowledgements (update_id, acknowledged_by, status)
    VALUES ('${update_ids[a % update_ids.length]}', '${client_ids[0]}', 'acknowledged');\n`;
  }

  sql += `-- 8. Materials, Issues, Change Requests, etc.\n`;
  for(let i = 0; i < 5; i++) {
    sql += `INSERT INTO project_materials (project_id, item_name, quantity, status) 
    VALUES ('${project_ids[i]}', 'Steel Beams', 100, 'ordered');\n`;
    sql += `INSERT INTO project_issues (project_id, title, severity, status)
    VALUES ('${project_ids[i]}', 'Delay in delivery', 'high', 'open');\n`;
    sql += `INSERT INTO change_requests (project_id, title, status)
    VALUES ('${project_ids[i]}', 'Design change', 'pending');\n`;
  }

  sql += `-- 9. Audit Logs & Break-glass Logs\n`;
  sql += `INSERT INTO audit_log (event_type, table_name, resource_id) VALUES ('UPDATE', 'projects', '${project_ids[0]}');\n`;
  sql += `INSERT INTO break_glass_logs (super_admin_id, target_org_id, reason, duration_minutes) 
  VALUES ('${super_admin_id}', '${org1_id}', 'Emergency maintenance', 60);\n`;

  fs.writeFileSync('supabase/seed.sql', sql);
  console.log('Seed SQL generated successfully!');
}

run();
