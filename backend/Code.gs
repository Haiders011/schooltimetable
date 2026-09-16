/**
 * ==============================================================================
 * School Timetable & Daily Substitution Portal - Backend Engine
 * Google Apps Script (Code.gs)
 * ==============================================================================
 */

/**
 * Handle HTTP GET Requests
 * Used to fetch initial database state or perform health checks
 */
function doGet(e) {
  try {
    const action = e && e.parameter ? e.parameter.action : null;
    
    if (action === 'ping') {
      const state = getFullDatabaseState();
      return createJsonResponse({
        status: 'success',
        message: 'Timetable Engine API is active and running.',
        timestamp: new Date().toISOString(),
        ...state
      });
    }
    
    const dbState = getFullDatabaseState();
    return createJsonResponse({
      status: 'success',
      timestamp: new Date().toISOString(),
      ...dbState
    });
  } catch (err) {
    return createJsonResponse({
      status: 'error',
      message: 'Failed to retrieve database state: ' + err.toString()
    });
  }
}

/**
 * Handle HTTP POST Requests
 * Used for mutations (Auth, Create User, Record Substitution, Update Slot, etc.)
 */
function doPost(e) {
  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const action = payload.action;

    switch (action) {
      case 'authenticateUser':
        return handleAuthenticateUser(payload);
        
      case 'createUser':
        return handleCreateUser(payload);
        
      case 'toggleUserStatus':
        return handleToggleUserStatus(payload);
        
      case 'recordSubstitution':
        return handleRecordSubstitution(payload);
        
      case 'deleteSubstitution':
        return handleDeleteSubstitution(payload);
        
      case 'updateTimetableSlot':
        return handleUpdateTimetableSlot(payload);
        
      case 'deleteTimetableSlot':
        return handleDeleteTimetableSlot(payload);

      case 'fetchDatabaseState':
        const state = getFullDatabaseState();
        return createJsonResponse({ status: 'success', ...state });

      default:
        return createJsonResponse({
          status: 'error',
          message: 'Invalid or missing action parameter: ' + action
        });
    }
  } catch (err) {
    return createJsonResponse({
      status: 'error',
      message: 'Execution error: ' + err.toString()
    });
  }
}

/**
 * Helper to build CORS-enabled JSON Response
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Flexible sheet getter that finds sheets by alias/variant naming
 */
function getSheetByNameFlexible(ss, names) {
  for (let n of names) {
    let sheet = ss.getSheetByName(n);
    if (sheet) return sheet;
  }
  return null;
}

/**
 * Retrieves full dataset from all active Google Sheets tabs
 */
function getFullDatabaseState() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  const usersSheet = getSheetByNameFlexible(ss, ['Users_Auth', 'Users']);
  const teachersSheet = getSheetByNameFlexible(ss, ['Teachers', 'Staff']);
  const classesSheet = getSheetByNameFlexible(ss, ['Classes_Sections', 'Classes', 'Sections']);
  const subjectsSheet = getSheetByNameFlexible(ss, ['Subjects', 'Courses']);
  const roomsSheet = getSheetByNameFlexible(ss, ['Rooms_Facilities', 'Rooms', 'Venues']);
  const timetableSheet = getSheetByNameFlexible(ss, ['Master_Timetable', 'Timetable', 'Schedule']);
  const subsSheet = getSheetByNameFlexible(ss, ['Daily_Substitution_Log', 'Daily_Substitutions', 'Substitutions']);

  return {
    Users_Auth: getSheetDataAsObjects(usersSheet),
    Teachers: getSheetDataAsObjects(teachersSheet),
    Classes_Sections: getSheetDataAsObjects(classesSheet),
    Subjects: getSheetDataAsObjects(subjectsSheet),
    Rooms: getSheetDataAsObjects(roomsSheet),
    Rooms_Facilities: getSheetDataAsObjects(roomsSheet),
    Master_Timetable: getSheetDataAsObjects(timetableSheet),
    Daily_Substitutions: getSheetDataAsObjects(subsSheet),
    Daily_Substitution_Log: getSheetDataAsObjects(subsSheet)
  };
}

/**
 * Converts a 2D sheet range into an Array of JSON objects based on row 1 headers
 */
function getSheetDataAsObjects(sheet) {
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const headers = data[0].map(h => String(h).trim());
  const rows = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    // Skip completely empty rows
    if (row.every(cell => cell === '')) continue;

    const rowObj = {};
    headers.forEach((header, colIndex) => {
      let val = row[colIndex];
      // Format Date values cleanly to YYYY-MM-DD string if it's a date object
      if (val instanceof Date) {
        val = Utilities.formatDate(val, Session.getScriptTimeZone(), 'yyyy-MM-dd');
      }
      // Boolean type normalization
      if (val === 'TRUE' || val === true) val = true;
      if (val === 'FALSE' || val === false) val = false;
      rowObj[header] = val;
    });
    rows.push(rowObj);
  }
  return rows;
}

/**
 * Authentication Handler
 */
function handleAuthenticateUser(payload) {
  const { username, password } = payload;
  if (!username || !password) {
    return createJsonResponse({ status: 'error', message: 'Username and password are required.' });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getSheetByNameFlexible(ss, ['Users_Auth', 'Users']);
  if (!sheet) {
    return createJsonResponse({ status: 'error', message: 'Users sheet not found in database.' });
  }

  const users = getSheetDataAsObjects(sheet);

  const found = users.find(u => 
    String(u.Username).toLowerCase() === String(username).toLowerCase()
  );

  if (!found) {
    return createJsonResponse({ status: 'error', message: 'User account not found.' });
  }

  if (String(found.Password) !== String(password)) {
    return createJsonResponse({ status: 'error', message: 'Incorrect password provided.' });
  }

  if (found.IsActive === false || found.IsActive === 'FALSE' || found.IsActive === 0) {
    return createJsonResponse({ status: 'error', message: 'Account is deactivated. Contact an administrator.' });
  }

  // Update LastLogin timestamp in the sheet
  try {
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const usernameCol = headers.indexOf('Username');
    const lastLoginCol = headers.indexOf('LastLogin');
    
    if (usernameCol !== -1 && lastLoginCol !== -1) {
      for (let r = 1; r < data.length; r++) {
        if (String(data[r][usernameCol]).toLowerCase() === String(username).toLowerCase()) {
          sheet.getRange(r + 1, lastLoginCol + 1).setValue(new Date());
          break;
        }
      }
    }
  } catch (e) {
    // Non-fatal, continue
  }

  return createJsonResponse({
    status: 'success',
    user: {
      userID: found.UserID,
      username: found.Username,
      fullName: found.FullName,
      userRole: found.UserRole,
      assignedTeacherID: found.AssignedTeacherID || ''
    }
  });
}

/**
 * Create a new user in Users_Auth
 */
function handleCreateUser(payload) {
  const { username, fullName, password, userRole, assignedTeacherID } = payload;
  if (!username || !fullName || !password || !userRole) {
    return createJsonResponse({ status: 'error', message: 'Missing required user creation fields.' });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getSheetByNameFlexible(ss, ['Users_Auth', 'Users']);
  if (!sheet) {
    return createJsonResponse({ status: 'error', message: 'Users sheet not found in database.' });
  }

  const users = getSheetDataAsObjects(sheet);

  const exists = users.some(u => String(u.Username).toLowerCase() === String(username).toLowerCase());
  if (exists) {
    return createJsonResponse({ status: 'error', message: 'A user with this username already exists.' });
  }

  const newUserID = 'USR-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMddHHmmss');
  const now = new Date();

  sheet.appendRow([
    newUserID,
    username.trim(),
    password.trim(),
    fullName.trim(),
    userRole.trim(),
    assignedTeacherID || '',
    true, // IsActive
    now,  // CreatedAt
    ''    // LastLogin
  ]);

  return createJsonResponse({
    status: 'success',
    message: 'User created successfully.',
    userID: newUserID
  });
}

/**
 * Toggle user active status (soft disable)
 */
function handleToggleUserStatus(payload) {
  const { targetUserID, newStatus } = payload;
  if (!targetUserID) {
    return createJsonResponse({ status: 'error', message: 'Target User ID is required.' });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getSheetByNameFlexible(ss, ['Users_Auth', 'Users']);
  if (!sheet) {
    return createJsonResponse({ status: 'error', message: 'Users sheet not found in database.' });
  }

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const idCol = headers.indexOf('UserID');
  const statusCol = headers.indexOf('IsActive');

  if (idCol === -1 || statusCol === -1) {
    return createJsonResponse({ status: 'error', message: 'Schema missing UserID or IsActive header.' });
  }

  let foundRow = -1;
  for (let r = 1; r < data.length; r++) {
    if (String(data[r][idCol]) === String(targetUserID)) {
      foundRow = r + 1;
      break;
    }
  }

  if (foundRow === -1) {
    return createJsonResponse({ status: 'error', message: 'User not found.' });
  }

  sheet.getRange(foundRow, statusCol + 1).setValue(Boolean(newStatus));

  return createJsonResponse({
    status: 'success',
    message: `User status updated to ${newStatus ? 'Active' : 'Inactive'}.`
  });
}

/**
 * Record Daily Substitution
 */
function handleRecordSubstitution(payload) {
  const {
    date,
    dayOfWeek,
    periodNumber,
    classID,
    originalTeacherID,
    assignedProxyTeacherID,
    reasonForAbsence,
    createdBy,
    notes
  } = payload;

  if (!date || !periodNumber || !classID || !originalTeacherID || !assignedProxyTeacherID) {
    return createJsonResponse({ status: 'error', message: 'Missing required substitution parameters.' });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const subSheet = getSheetByNameFlexible(ss, ['Daily_Substitution_Log', 'Daily_Substitutions', 'Substitutions']);
  if (!subSheet) {
    return createJsonResponse({ status: 'error', message: 'Substitutions sheet not found in database.' });
  }
  
  // Clash validation in Daily_Substitutions
  const existingSubs = getSheetDataAsObjects(subSheet);
  const clash = existingSubs.find(s => 
    String(s.Date) === String(date) &&
    Number(s.PeriodNumber) === Number(periodNumber) &&
    String(s.AssignedProxyTeacherID) === String(assignedProxyTeacherID) &&
    s.Status !== 'Cancelled'
  );

  if (clash) {
    return createJsonResponse({
      status: 'error',
      message: `Clash detected! Teacher ${assignedProxyTeacherID} is already assigned as proxy for Class ${clash.ClassID} on Period ${periodNumber}.`
    });
  }

  const subID = 'SUB-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss');
  const now = new Date();

  subSheet.appendRow([
    subID,
    date,
    dayOfWeek || '',
    Number(periodNumber),
    classID,
    originalTeacherID,
    assignedProxyTeacherID,
    reasonForAbsence || 'Absent',
    'Assigned', // Status
    createdBy || 'System',
    now, // CreatedAt
    notes || ''
  ]);

  return createJsonResponse({
    status: 'success',
    message: 'Substitution recorded successfully.',
    substitutionID: subID
  });
}

/**
 * Delete or Cancel a Substitution record
 */
function handleDeleteSubstitution(payload) {
  const { substitutionID } = payload;
  if (!substitutionID) {
    return createJsonResponse({ status: 'error', message: 'Substitution ID is required.' });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getSheetByNameFlexible(ss, ['Daily_Substitution_Log', 'Daily_Substitutions', 'Substitutions']);
  if (!sheet) {
    return createJsonResponse({ status: 'error', message: 'Substitutions sheet not found in database.' });
  }

  const data = sheet.getDataRange().getValues();
  const idCol = data[0].indexOf('SubstitutionID');

  if (idCol === -1) {
    return createJsonResponse({ status: 'error', message: 'SubstitutionID column not found.' });
  }

  for (let r = 1; r < data.length; r++) {
    if (String(data[r][idCol]) === String(substitutionID)) {
      sheet.deleteRow(r + 1);
      return createJsonResponse({ status: 'success', message: 'Substitution deleted successfully.' });
    }
  }

  return createJsonResponse({ status: 'error', message: 'Substitution record not found.' });
}

/**
 * Update or Add a Master Timetable Slot
 */
function handleUpdateTimetableSlot(payload) {
  const { slotID, dayOfWeek, periodNumber, classID, subjectID, teacherID, roomID } = payload;
  
  if (!dayOfWeek || !periodNumber || !classID || !subjectID || !teacherID) {
    return createJsonResponse({ status: 'error', message: 'Missing required timetable parameters.' });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getSheetByNameFlexible(ss, ['Master_Timetable', 'Timetable', 'Schedule']);
  if (!sheet) {
    return createJsonResponse({ status: 'error', message: 'Master Timetable sheet not found in database.' });
  }

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idCol = headers.indexOf('SlotID');

  // Check teacher or room clash in master timetable for same Day & Period
  const allSlots = getSheetDataAsObjects(sheet);
  const teacherClash = allSlots.find(s => 
    s.DayOfWeek === dayOfWeek &&
    Number(s.PeriodNumber) === Number(periodNumber) &&
    s.TeacherID === teacherID &&
    s.ClassID !== classID &&
    s.SlotID !== slotID
  );

  if (teacherClash) {
    return createJsonResponse({
      status: 'error',
      message: `Teacher ${teacherID} is already booked with Class ${teacherClash.ClassID} on ${dayOfWeek} Period ${periodNumber}.`
    });
  }

  if (slotID) {
    // Update existing slot
    for (let r = 1; r < data.length; r++) {
      if (String(data[r][idCol]) === String(slotID)) {
        sheet.getRange(r + 1, 1, 1, 7).setValues([[
          slotID,
          dayOfWeek,
          Number(periodNumber),
          classID,
          subjectID,
          teacherID,
          roomID || ''
        ]]);
        return createJsonResponse({ status: 'success', message: 'Timetable slot updated successfully.' });
      }
    }
  }

  // Create new slot
  const newSlotID = 'SLOT-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMddHHmmss');
  sheet.appendRow([
    newSlotID,
    dayOfWeek,
    Number(periodNumber),
    classID,
    subjectID,
    teacherID,
    roomID || ''
  ]);

  return createJsonResponse({
    status: 'success',
    message: 'New timetable slot added successfully.',
    slotID: newSlotID
  });
}

/**
 * Delete a Master Timetable Slot
 */
function handleDeleteTimetableSlot(payload) {
  const { slotID } = payload;
  if (!slotID) {
    return createJsonResponse({ status: 'error', message: 'Slot ID is required.' });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getSheetByNameFlexible(ss, ['Master_Timetable', 'Timetable', 'Schedule']);
  if (!sheet) {
    return createJsonResponse({ status: 'error', message: 'Master Timetable sheet not found in database.' });
  }

  const data = sheet.getDataRange().getValues();
  const idCol = data[0].indexOf('SlotID');

  for (let r = 1; r < data.length; r++) {
    if (String(data[r][idCol]) === String(slotID)) {
      sheet.deleteRow(r + 1);
      return createJsonResponse({ status: 'success', message: 'Timetable slot deleted successfully.' });
    }
  }

  return createJsonResponse({ status: 'error', message: 'Timetable slot not found.' });
}
