# School Timetable & Faculty Workload System 🎓

A modern, production-ready web application and Google Sheets-backed engine for managing school timetables, faculty workload quotas, extra duties, duty relaxations, and daily teacher substitutions.

---

## 🌟 Key Features

1. **Faculty Profiles & Workload Balancing Engine**:
   - **Standard Weekly Quotas**: Configure baseline period quotas (e.g. 28 periods/week).
   - **Extra Duty & Administrative Assignments**: Record roles like Exam Cell, Discipline Committee, IT Incharge, Sports Coordinator, etc.
   - **Automatic Duty Relief Calculation**: Real-time formula computation:
     $$\text{Max Teaching Periods} = \max(0, \text{Standard Quota} - \text{Duty Relaxation})$$
   - **Soft Activation / Deactivation**: Toggle faculty status without losing historical records.
   - **Real-time Search & Filter**: Instant filtering by faculty name, short code, or subject.

2. **Daily Substitution (Proxy Manager) Module**:
   - **Live Clash Detection**: Validates inputs to ensure proxy and absent teachers are distinct and free.
   - **Calendar & Period Sync**: Auto-detects day of the week from the selected date.
   - **Live Logging**: Immediately saves substitutions to the Google Sheet backend with user attribution.
   - **Log Management**: Delete or cancel substitution records with a single click.

3. **User Authentication & Role-Based Access**:
   - **Live Sheet Authentication**: Authenticates directly against the `Users_Auth` database tab.
   - Default login: `admin` / `admin123`.

4. **Google Apps Script REST API Integration**:
   - Seamless data sync between browser frontend and Google Spreadsheet.
   - CORS-enabled REST API with GET & POST endpoints.

---

## 🚀 Quick Start

1. Open [index.html](file:///d:/Antigrivity%20Tasks/Timetable%20Engine/index.html) in any modern browser.
2. Sign in using the database credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
3. Manage faculty profiles or record substitutions with instant live synchronization.

---

## ☁️ Google Sheets & Apps Script Backend Deployment

Follow these steps to connect the portal to your Google Drive / Google Sheets backend:

### Step 1: Create a Google Spreadsheet
1. Go to [Google Sheets](https://sheets.new) and create a new blank spreadsheet.
2. Name it e.g. **"Academic Timetable & Faculty Database"**.

### Step 2: Open Google Apps Script
1. In your Google Sheet, click **Extensions** > **Apps Script**.
2. Replace `Code.gs` with the contents of [`backend/Code.gs`](file:///d:/Antigrivity%20Tasks/Timetable%20Engine/backend/Code.gs).
3. Click the **+** (Add a file) button, choose **Script**, name it `Setup.gs`, and paste the contents of [`backend/Setup.gs`](file:///d:/Antigrivity%20Tasks/Timetable%20Engine/backend/Setup.gs).

### Step 3: Initialize Database Tabs
1. In the Apps Script toolbar dropdown, select the function `initDatabase`.
2. Click **Run** and authorize the permissions when prompted.
3. Your Google Sheet will populate with 7 formatted tabs:
   - `Users_Auth`
   - `Teachers`
   - `Classes_Sections`
   - `Subjects`
   - `Rooms`
   - `Master_Timetable`
   - `Daily_Substitution_Log`

### Step 4: Deploy as a Web App
1. In Apps Script, click **Deploy** > **New deployment**.
2. Click the gear icon ⚙️ next to *Select type* and choose **Web app**.
3. Configure deployment:
   - **Description**: `Timetable & Faculty Workload API v2`
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone` *(Crucial for frontend fetch requests)*
4. Click **Deploy** and copy the **Web app URL** (`https://script.google.com/macros/s/.../exec`).

---

## 📁 Repository Structure

```
Timetable Engine/
├── index.html          # Core responsive frontend with UI, state, & workload engine
├── backend/
│   ├── Code.gs         # REST API handler for Google Apps Script (doGet / doPost)
│   └── Setup.gs        # 1-click sheet schema and sample data generator
└── README.md           # Documentation and deployment manual
```

---

## 🛡️ Data Schema Reference

| Sheet Tab | Primary Key | Key Columns |
|---|---|---|
| `Users_Auth` | `UserID` | `Username`, `Password`, `FullName`, `UserRole`, `AssignedTeacherID`, `IsActive`, `CreatedAt`, `LastLogin` |
| `Teachers` | `TeacherID` | `FullName`, `ShortCode`, `PrimarySubject`, `SecondarySubjects`, `StandardWeeklyQuota`, `ExtraDutyTitle`, `DutyRelaxationPeriods`, `MaxTeachingPeriods`, `IsActive` |
| `Classes_Sections` | `ClassID` | `GradeLevel`, `Section`, `RoomNumber`, `ClassTeacherID`, `TotalStudents` |
| `Subjects` | `SubjectID` | `SubjectName`, `Category`, `WeeklyPeriodsRequired` |
| `Rooms` | `RoomID` | `RoomName`, `Capacity`, `Type` |
| `Master_Timetable` | `SlotID` | `DayOfWeek`, `PeriodNumber`, `ClassID`, `SubjectID`, `TeacherID`, `RoomID` |
| `Daily_Substitution_Log` | `SubstitutionID` | `Date`, `DayOfWeek`, `PeriodNumber`, `ClassID`, `OriginalTeacherID`, `AssignedProxyTeacherID`, `ReasonForAbsence`, `Status`, `CreatedBy`, `CreatedAt`, `Notes` |
