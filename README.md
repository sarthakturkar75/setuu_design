# Setuu — Engineering Tracking & User Updates

Setuu is a B2B construction progress tracking platform built by Praimo Innovation. It empowers project managers, field employees, and vendors to capture real-time progress updates (photos, videos, documents) from the field and share them securely with external clients via a structured, auditable system.

## 🚀 Key Features

* **Robust Offline-First Engine:** Engineered for poor connectivity environments. Core mutations use Optimistic UI for instant feedback while a background WorkManager queues and syncs updates to Supabase when connectivity is restored.
* **Media-Heavy Workflows:** Camera-first UX with automated image compression, resumable chunked video/document uploads, and server-side ClamAV virus scanning.
* **Engineering Drawing Version Control:** In-app viewer supporting interactive image markups and annotations (saving as new immutable versions) alongside view-only PDF capabilities.
* **PDF Reporting Engine:** On-demand generation of formatted, printable, and shareable progress reports aggregating tasks, materials, and milestone data.
* **Enterprise Security:** Strict Row-Level Security (RLS) ensuring absolute data isolation across multi-tenant organizations.
* **Biometric Authentication:** Secure local keystore integration (`flutter_secure_storage` + `local_auth`) for frictionless re-authentication.

## 🏗️ Architecture

Setuu is built on a modern, highly scalable stack:

* **Frontend:** Flutter (Android native MVP with iOS capabilities).
* **State Management:** Riverpod + Clean Architecture (Feature-first modular design).
* **Local Storage (Offline):** Hive for caching and queuing `SyncOperation` tasks.
* **Backend as a Service:** Supabase (PostgreSQL 17 + PostGIS).
* **Edge Functions:** Deno runtime for FCM Push Notifications, Virus Scanning webhooks, and Transactional Emails.

For an in-depth look at the architecture, schema, and API boundaries, refer to:

* [Software Requirements Specification (SRS)](srs_updated.md)
* [Application Architecture Overview](setuu_architecture_updated.md)
* [Database Architecture Diagram](database_architecture.md)

## 🛠️ Getting Started

### Prerequisites

* Flutter SDK (v3.22+)
* Android Studio / Xcode
* Supabase Project (for backend configuration)

### Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/praimo/setuu.git
    cd setuu
    ```

2. **Install dependencies:**

    ```bash
    flutter pub get
    ```

3. **Environment Configuration:**
    Ensure you have your Supabase URL and Anon Key. Create a `.env` file in the root directory (if using `flutter_dotenv`) or supply them through your secure configuration method.

4. **Run the app:**

    ```bash
    flutter run
    ```

## 🔐 Role-Based Access Control (RBAC)

Setuu implements a strict 6-tier role hierarchy:

1. **Super Admin:** Platform health and billing.
2. **Admin:** Praimo leadership, organization management.
3. **Project Manager (PM):** Field leads managing assigned projects.
4. **Employee:** Field workers generating updates.
5. **Vendor:** Suppliers providing material statuses and updates.
6. **Client:** External stakeholders viewing dedicated organizational updates.
