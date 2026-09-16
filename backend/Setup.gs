/**
 * ==============================================================================
 * School Timetable & Daily Substitution Portal - Database Initializer
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
        ['USR-003', 'jsmith', 'pass123', 'John Smith', 'Teacher', 'TCH-001', true, new Date(), ''],
        ['USR-004', 'edavis', 'pass123', 'Emily Davis', 'Teacher', 'TCH-002', true, new Date(), ''],
        ['USR-005', 'rwilliams', 'pass123', 'Robert Williams', 'Teacher', 'TCH-003', true, new Date(), ''],
        ['USR-006', 'mchen', 'pass123', 'Michael Chen', 'Teacher', 'TCH-004', true, new Date(), ''],
        ['USR-007', 'sagarwal', 'pass123', 'Sarah Agarwal', 'Teacher', 'TCH-005', true, new Date(), ''],
        ['USR-008', 'dpatel', 'pass123', 'David Patel', 'Teacher', 'TCH-006', true, new Date(), '']
      ]
    },
    {
      name: 'Teachers',
      headers: ['TeacherID', 'FullName', 'PrimarySubject', 'Department', 'Email', 'MaxDailyPeriods', 'Phone'],
      data: [
        ['TCH-001', 'John Smith', 'Mathematics', 'Science & Math', 'jsmith@school.edu', 5, '+1-555-0101'],
        ['TCH-002', 'Emily Davis', 'English Literature', 'Humanities', 'edavis@school.edu', 5, '+1-555-0102'],
        ['TCH-003', 'Robert Williams', 'Physics', 'Science & Math', 'rwilliams@school.edu', 5, '+1-555-0103'],
        ['TCH-004', 'Michael Chen', 'Chemistry', 'Science & Math', 'mchen@school.edu', 5, '+1-555-0104'],
        ['TCH-005', 'Sarah Agarwal', 'Computer Science', 'Technology', 'sagarwal@school.edu', 5, '+1-555-0105'],
        ['TCH-006', 'David Patel', 'History & Social Studies', 'Humanities', 'dpatel@school.edu', 5, '+1-555-0106'],
        ['TCH-007', 'Laura Wilson', 'Biology', 'Science & Math', 'lwilson@school.edu', 5, '+1-555-0107'],
        ['TCH-008', 'James Taylor', 'Physical Education', 'Sports', 'jtaylor@school.edu', 6, '+1-555-0108']
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
        ['SLOT-406', 'Monday', 6, 'CLS-10B', 'CHEM', 'TCH-004', 'Room 202'],

        // Tuesday
        ['SLOT-501', 'Tuesday', 1, 'CLS-9A', 'CHEM', 'TCH-004', 'Room 101'],
        ['SLOT-502', 'Tuesday', 2, 'CLS-9A', 'MATH', 'TCH-001', 'Room 101'],
        ['SLOT-503', 'Tuesday', 3, 'CLS-9A', 'ENG', 'TCH-002', 'Room 101'],
        ['SLOT-504', 'Tuesday', 4, 'CLS-9A', 'BIO', 'TCH-007', 'LAB-SCI'],

        ['SLOT-601', 'Tuesday', 1, 'CLS-9B', 'MATH', 'TCH-001', 'Room 102'],
        ['SLOT-602', 'Tuesday', 2, 'CLS-9B', 'PHY', 'TCH-003', 'Room 102'],
        ['SLOT-603', 'Tuesday', 3, 'CLS-9B', 'CS', 'TCH-005', 'LAB-CS'],
        ['SLOT-604', 'Tuesday', 4, 'CLS-9B', 'ENG', 'TCH-002', 'Room 102']
      ]
    },
    {
      name: 'Daily_Substitutions',
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

    // Set Headers
    sheet.getRange(1, 1, 1, cfg.headers.length)
      .setValues([cfg.headers])
      .setFontWeight('bold')
      .setBackground('#1e293b')
      .setFontColor('#ffffff');

    // Set Seed Data
    if (cfg.data && cfg.data.length > 0) {
      sheet.getRange(2, 1, cfg.data.length, cfg.headers.length).setValues(cfg.data);
    }

    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, cfg.headers.length);
  });

  SpreadsheetApp.flush();
  Logger.log('Timetable Engine database successfully initialized with 7 structured sheets.');
}
