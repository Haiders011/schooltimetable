# Academic Timetable & Daily Substitution Engine 🎓

A modern, production-ready web application and Google Sheets-backed engine for managing school timetables, class schedules, and automated daily teacher substitutions.

---

## 🌟 Key Features

1. **4-Stage Smart Substitution Wizard**:
   - **Stage 1 (Time Slot)**: Select Date, Day of Week, and Period (1–8).
   - **Stage 2 (Absent Teacher Discovery)**: Select the absent teacher; the engine automatically scans the master timetable, detects their scheduled class/subject/room, and alerts if they are off duty.
   - **Stage 3 (Intelligent Free-Teacher Ranking)**: Computes in real-time which teachers are completely free in that period. Ranks them by subject compatibility (e.g., Mathematics teacher for a Math class) and daily substitution workload, while disabling busy teachers.
   - **Stage 4 (Clash Validation)**: Prevents double-booking proxies or assigning busy teachers.

2. **Master Schedule Matrix**:
   - **Multi-View Engine**: Switch between **Class Section View**, **Teacher Schedule View**, and **Room/Venue View**.
   - **Interactive Slot Inspector & Editor**: Click any slot to inspect details, make modifications, or assign a substitution.
   - **Real-time Collisions & Substitutions Badge**: Substitutions appear visually highlighted in the grid with proxy details.

3. **User Management & Role-Based Access (RBAC)**:
   - **Admin**: Full control over users, timetable slots, and substitutions.
   - **Coordinator**: Full access to schedule management and substitutions.
   - **Teacher**: Personalized schedule views and substitution logs.
   - Provision accounts, link to teacher profiles, and soft activate/deactivate accounts.

4. **Printable Substitution Memos & Slips**:
   - 1-click generation of formatted official substitution orders ready for printing.

5. **Dual-Mode Engine (Offline Simulator + Live Google Apps Script Cloud Sync)**:
   - Runs out of the box with zero external dependencies in **Simulation Mode** (stored locally in browser).
   - Easily connects to **Google Sheets** via Google Apps Script for persistent, multi-user cloud syncing.

---

## 🚀 Quick Start (Local Demo)

1. Simply open [index.html](file:///d:/Antigrivity%20Tasks/Timetable%20Engine/index.html) in any modern web browser.
2. Log in using one of the pre-configured demo accounts:
   - **Admin**: Username `admin` | Password `admin123`
   - **Coordinator**: Username `coordinator` | Password `coord123`
   - **Teacher**: Username `jsmith` | Password `pass123`

---

## ☁️ Google Sheets & Apps Script Backend Deployment

Follow these 4 simple steps to connect the portal to your Google Drive / Google Sheets backend:

### Step 1: Create a Google Spreadsheet
1. Go to [Google Sheets](https://sheets.new) and create a new blank spreadsheet.
2. Name it e.g. **"Academic Timetable Database"**.

### Step 2: Open Google Apps Script
1. In your Google Sheet, click on **Extensions** > **Apps Script**.
2. Delete any boilerplate code in `Code.gs` and paste the contents of [`backend/Code.gs`](file:///d:/Antigrivity%20Tasks/Timetable%20Engine/backend/Code.gs).
3. Click the **+** (Add a file) button, choose **Script**, name it `Setup.gs`, and paste the contents of [`backend/Setup.gs`](file:///d:/Antigrivity%20Tasks/Timetable%20Engine/backend/Setup.gs).

### Step 3: Initialize Database Tabs
1. In the Apps Script toolbar dropdown, select the function `initDatabase`.
2. Click **Run**. Grant the requested permissions when prompted.
3. Switch back to your Google Sheet: you will see 7 formatted sheets populated with sample data:
   - `Users_Auth`
   - `Teachers`
   - `Classes_Sections`
   - `Subjects`
   - `Rooms`
   - `Master_Timetable`
   - `Daily_Substitutions`

### Step 4: Deploy as a Web App
1. In Apps Script, click **Deploy** > **New deployment**.
2. Click the gear icon ⚙️ next to *Select type* and select **Web app**.
3. Configure the deployment:
   - **Description**: `Timetable Engine API v1`
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone` *(Crucial for frontend fetch requests)*
4. Click **Deploy** and copy the **Web app URL** (`https://script.google.com/macros/s/.../exec`).

### Step 5: Connect Frontend to Backend
1. In the web portal, click the **Settings ⚙️** icon in the top navigation.
2. The deployed **Web app URL** is pre-configured by default:
   `https://script.google.com/macros/s/AKfycbxE5va5E63f7FX3fH1Be9ugfY40OXD8WJ-GCOlEvBijhfRP96Cw4M9EGBQkLxLeet1u/exec`
3. Click **Test Connection** followed by **Save Settings**.
4. The badge will switch to **"Live Cloud Sync"** and synchronize directly with your Google Sheet!

---

## 📁 Repository Structure

```
Timetable Engine/
├── index.html          # Core responsive frontend with UI, state, & substitution engine
├── backend/
│   ├── Code.gs         # REST API handler for Google Apps Script (doGet / doPost)
│   └── Setup.gs        # 1-click sheet schema and sample data generator
└── README.md           # Documentation and deployment manual
```

---

## 🛡️ Data Schema Reference

| Sheet Tab | Primary Key | Key Columns |
|---|---|---|
| `Users_Auth` | `UserID` | `Username`, `Password`, `FullName`, `UserRole`, `AssignedTeacherID`, `IsActive` |
| `Teachers` | `TeacherID` | `FullName`, `PrimarySubject`, `Department`, `Email`, `MaxDailyPeriods` |
| `Classes_Sections` | `ClassID` | `GradeLevel`, `Section`, `RoomNumber`, `ClassTeacherID` |
| `Subjects` | `SubjectID` | `SubjectName`, `Category`, `WeeklyPeriodsRequired` |
| `Rooms` | `RoomID` | `RoomName`, `Capacity`, `Type` |
| `Master_Timetable` | `SlotID` | `DayOfWeek`, `PeriodNumber`, `ClassID`, `SubjectID`, `TeacherID`, `RoomID` |
| `Daily_Substitutions` | `SubstitutionID` | `Date`, `DayOfWeek`, `PeriodNumber`, `ClassID`, `OriginalTeacherID`, `AssignedProxyTeacherID`, `Status` |
