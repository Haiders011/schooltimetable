/**
 * ==============================================================================
 * School Timetable & Faculty Workload System - Database Initializer
 * Google Apps Script (Setup.gs)
 * ==============================================================================
 * Run `initDatabase()` once from the Apps Script editor to automatically generate
 * all required sheets, headers, sample data, and formatting.
 */

function initDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  const setupConfig = [
    {
      name: 'Users_Auth',
      headers: ['UserID', 'Username', 'Password', 'FullName', 'UserRole', 'AssignedTeacherID', 'IsActive', 'CreatedAt', 'LastLogin'],
      data: [
        ['USR-001', 'admin', 'admin123', 'Academic Principal', 'Admin', '', true, new Date(), ''],
        ['USR-002', 'coordinator', 'coord123', 'Timetable Coordinator', 'Coordinator', '', true, new Date(), ''],
        ['USR-003', 'tmehmood', 'pass123', 'Mr. Tariq Mehmood', 'Teacher', 'TCH-001', true, new Date(), ''],
        ['USR-004', 'akhan', 'pass123', 'Ms. Ayesha Khan', 'Teacher', 'TCH-002', true, new Date(), ''],
        ['USR-005', 'rwilliams', 'pass123', 'Mr. Robert Williams', 'Teacher', 'TCH-003', true, new Date(), ''],
        ['USR-006', 'mchen', 'pass123', 'Dr. Michael Chen', 'Teacher', 'TCH-004', true, new Date(), ''],
        ['USR-007', 'sagarwal', 'pass123', 'Mrs. Sarah Agarwal', 'Teacher', 'TCH-005', true, new Date(), ''],
        ['USR-008', 'dpatel', 'pass123', 'Mr. David Patel', 'Teacher', 'TCH-006', true, new Date(), '']
      ]
    },
    {
      name: 'Teachers',
      headers: ['TeacherID', 'FullName', 'ShortCode', 'PrimarySubject', 'SecondarySubjects', 'StandardWeeklyQuota', 'ExtraDutyTitle', 'DutyRelaxationPeriods', 'MaxTeachingPeriods', 'IsActive'],
      data: [
        ['TCH-001', 'Mr. Tariq Mehmood', 'TM', 'Mathematics', 'Physics', 28, 'Discipline Committee', 4, 24, true],
        ['TCH-002', 'Ms. Ayesha Khan', 'AK', 'English Literature', 'Urdu', 28, 'Exam Cell Incharge', 6, 22, true],
        ['TCH-003', 'Mr. Robert Williams', 'RW', 'Physics', 'Mathematics', 28, 'Sports Incharge', 4, 24, true],
        ['TCH-004', 'Dr. Michael Chen', 'MC', 'Chemistry', 'Biology', 28, 'Lab Coordinator', 2, 26, true],
        ['TCH-005', 'Mrs. Sarah Agarwal', 'SA', 'Computer Science', 'Mathematics', 28, 'IT Cell Incharge', 4, 24, true],
        ['TCH-006', 'Mr. David Patel', 'DP', 'History & Social Studies', 'Civics', 28, '', 0, 28, true],
        ['TCH-007', 'Ms. Laura Wilson', 'LW', 'Biology', 'General Science', 28, 'Science Club', 2, 26, true],
        ['TCH-008', 'Mr. James Taylor', 'JT', 'Physical Education', '', 28, '', 0, 28, true]
      ]
    },
    {
      name: 'Classes_Sections',
      headers: ['ClassID', 'GradeLevel', 'Section', 'RoomNumber', 'ClassTeacherID', 'TotalStudents'],
      data: [
        ['CLS-9A', 'Grade 9', 'Section A', 'Room 101', 'TCH-001', 32],
        ['CLS-9B', 'Grade 9', 'Section B', 'Room 102', 'TCH-002', 30],
        ['CLS-10A', 'Grade 10', 'Section A', 'Room 201', 'TCH-003', 34],
        ['CLS-10B', 'Grade 10', 'Section B', 'Room 202', 'TCH-004', 31],
        ['CLS-11A', 'Grade 11', 'Section A (Science)', 'Room 301', 'TCH-005', 28],
        ['CLS-12A', 'Grade 12', 'Section A (Senior)', 'Room 302', 'TCH-006', 26]
      ]
    },
    {
      name: 'Subjects',
      headers: ['SubjectID', 'SubjectName', 'Category', 'WeeklyPeriodsRequired'],
      data: [
        ['MATH', 'Mathematics', 'Core', 6],
        ['ENG', 'English Literature', 'Core', 5],
        ['PHY', 'Physics', 'Science', 5],
        ['CHEM', 'Chemistry', 'Science', 5],
        ['BIO', 'Biology', 'Science', 4],
        ['CS', 'Computer Science', 'Tech', 4],
        ['HIST', 'History & Civics', 'Social', 3],
        ['PE', 'Physical Education', 'Sports', 2]
      ]
    },
    {
      name: 'Rooms',
      headers: ['RoomID', 'RoomName', 'Capacity', 'Type'],
      data: [
        ['Room 101', 'Standard Classroom 101', 35, 'Classroom'],
        ['Room 102', 'Standard Classroom 102', 35, 'Classroom'],
        ['Room 201', 'Standard Classroom 201', 35, 'Classroom'],
        ['Room 202', 'Standard Classroom 202', 35, 'Classroom'],
        ['Room 301', 'Senior Classroom 301', 35, 'Classroom'],
        ['Room 302', 'Senior Classroom 302', 35, 'Classroom'],
        ['LAB-SCI', 'Physics & Chemistry Lab', 40, 'Laboratory'],
        ['LAB-CS', 'Computer Science Lab', 35, 'Computer Lab']
      ]
    },
    {
      name: 'Master_Timetable',
      headers: ['SlotID', 'DayOfWeek', 'PeriodNumber', 'ClassID', 'SubjectID', 'TeacherID', 'RoomID'],
      data: [
        // Monday
        ['SLOT-101', 'Monday', 1, 'CLS-9A', 'MATH', 'TCH-001', 'Room 101'],
        ['SLOT-102', 'Monday', 2, 'CLS-9A', 'ENG', 'TCH-002', 'Room 101'],
        ['SLOT-103', 'Monday', 3, 'CLS-9A', 'PHY', 'TCH-003', 'LAB-SCI'],
        ['SLOT-104', 'Monday', 4, 'CLS-9A', 'CHEM', 'TCH-004', 'LAB-SCI'],
        ['SLOT-105', 'Monday', 5, 'CLS-9A', 'CS', 'TCH-005', 'LAB-CS'],
        ['SLOT-106', 'Monday', 6, 'CLS-9A', 'HIST', 'TCH-006', 'Room 101'],
        ['SLOT-107', 'Monday', 7, 'CLS-9A', 'BIO', 'TCH-007', 'Room 101'],
        ['SLOT-108', 'Monday', 8, 'CLS-9A', 'PE', 'TCH-008', 'Ground'],

        ['SLOT-201', 'Monday', 1, 'CLS-9B', 'ENG', 'TCH-002', 'Room 102'],
        ['SLOT-202', 'Monday', 2, 'CLS-9B', 'MATH', 'TCH-001', 'Room 102'],
        ['SLOT-203', 'Monday', 3, 'CLS-9B', 'CHEM', 'TCH-004', 'Room 102'],
        ['SLOT-204', 'Monday', 4, 'CLS-9B', 'CS', 'TCH-005', 'LAB-CS'],
        ['SLOT-205', 'Monday', 5, 'CLS-9B', 'HIST', 'TCH-006', 'Room 102'],
        ['SLOT-206', 'Monday', 6, 'CLS-9B', 'PHY', 'TCH-003', 'LAB-SCI'],

        ['SLOT-301', 'Monday', 1, 'CLS-10A', 'PHY', 'TCH-003', 'Room 201'],
        ['SLOT-302', 'Monday', 2, 'CLS-10A', 'CHEM', 'TCH-004', 'Room 201'],
        ['SLOT-303', 'Monday', 3, 'CLS-10A', 'MATH', 'TCH-001', 'Room 201'],
        ['SLOT-304', 'Monday', 4, 'CLS-10A', 'ENG', 'TCH-002', 'Room 201'],
        ['SLOT-305', 'Monday', 5, 'CLS-10A', 'BIO', 'TCH-007', 'LAB-SCI'],
        ['SLOT-306', 'Monday', 6, 'CLS-10A', 'CS', 'TCH-005', 'LAB-CS'],

        ['SLOT-401', 'Monday', 1, 'CLS-10B', 'CS', 'TCH-005', 'LAB-CS'],
        ['SLOT-402', 'Monday', 2, 'CLS-10B', 'HIST', 'TCH-006', 'Room 202'],
        ['SLOT-403', 'Monday', 3, 'CLS-10B', 'ENG', 'TCH-002', 'Room 202'],
        ['SLOT-404', 'Monday', 4, 'CLS-10B', 'MATH', 'TCH-001', 'Room 202'],
        ['SLOT-405', 'Monday', 5, 'CLS-10B', 'PHY', 'TCH-003', 'Room 202'],
        ['SLOT-406', 'Monday', 6, 'CLS-10B', 'CHEM', 'TCH-004', 'Room 202']
      ]
    },
    {
      name: 'Daily_Substitution_Log',
      headers: ['SubstitutionID', 'Date', 'DayOfWeek', 'PeriodNumber', 'ClassID', 'OriginalTeacherID', 'AssignedProxyTeacherID', 'ReasonForAbsence', 'Status', 'CreatedBy', 'CreatedAt', 'Notes'],
      data: []
    }
  ];

  setupConfig.forEach(cfg => {
    let sheet = ss.getSheetByName(cfg.name);
    if (!sheet) {
      sheet = ss.insertSheet(cfg.name);
    } else {
      sheet.clear();
    }

    // Append Headers
    sheet.appendRow(cfg.headers);
    const headerRange = sheet.getRange(1, 1, 1, cfg.headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#1e293b'); // Dark Slate
    headerRange.setFontColor('#ffffff');
    headerRange.setHorizontalAlignment('center');

    // Append Sample Data
    if (cfg.data && cfg.data.length > 0) {
      sheet.getRange(2, 1, cfg.data.length, cfg.headers.length).setValues(cfg.data);
    }

    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, cfg.headers.length);
  });

  SpreadsheetApp.flush();
  Logger.log("Database initialized successfully with 7 formatted tabs.");
}
