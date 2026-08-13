-- Migration: init_missing_tables
-- Adds missing tables required for Setuu Enterprise Phase 0-6

-- 1. Timesheets (Employee & Resource Tracking)
CREATE TABLE timesheets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES user_actor(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    hours_worked DECIMAL(5,2) NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Pending', -- Pending, Approved, Rejected
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Invoices (Vendor Payments)
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    invoice_number VARCHAR(100) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    status TEXT DEFAULT 'Submitted', -- Submitted, Processing, Paid, Disputed
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Wiki Docs (Team SOPs and Knowledge Base)
CREATE TABLE wiki_docs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    author_id UUID REFERENCES user_actor(id) ON DELETE SET NULL,
    category VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Break Glass Logs (Emergency Security Audits)
CREATE TABLE break_glass_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES user_actor(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    duration_minutes INT NOT NULL,
    status TEXT DEFAULT 'Active', -- Active, Expired, Revoked
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- 5. Virus Scan Results (ClamAV Dropzone Integration)
CREATE TABLE virus_scan_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID NOT NULL, -- Logical reference to storage object
    status TEXT DEFAULT 'Scanning', -- Scanning, Clean, Infected
    threat_details TEXT,
    scanned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Basic RLS setup for the new tables
ALTER TABLE timesheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE wiki_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE break_glass_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE virus_scan_results ENABLE ROW LEVEL SECURITY;

-- Note: We default to allowing access for authenticated users in the prototype.
-- Production will require stricter policies per role.
CREATE POLICY "Allow authenticated read" ON timesheets FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON invoices FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON wiki_docs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON break_glass_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON virus_scan_results FOR SELECT TO authenticated USING (true);
