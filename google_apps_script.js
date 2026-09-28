function doPost(e) {
  return handleLeadSubmission(e);
}

function doGet(e) {
  return handleLeadSubmission(e);
}

function handleLeadSubmission(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 10 seconds to prevent race conditions
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Auto-create formatted headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Timestamp",
        "Customer Name",
        "Contact Number",
        "City / State",
        "Bundle / Package",
        "Price",
        "Status",
        "Source"
      ];
      sheet.appendRow(headers);

      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#1B3B2B"); // Dark Ayurvedic Green
      headerRange.setFontColor("#D4BD86"); // Gold text
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

    // Parse incoming data
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var name = (data.name || "ग्राहक").toString().trim();
    var rawContact = (data.contact || data.phone || "").toString();
    var cleanContact = rawContact.replace(/\D/g, "").slice(-10);
    var city = (data.city || "-").toString().trim();
    var bundle = (data.bundle || "Madhavbaug Immunity Prash").toString().trim();
    var price = (data.price || "₹1,899").toString().trim();
    var source = (data.source || "Website Form").toString().trim();

    // Validate phone number
    if (!cleanContact || cleanContact.length < 10) {
      return createJsonResponse({
        result: "error",
        message: "कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।"
      });
    }

    // Check for duplicates in the sheet within the last 24 hours
    var lastRow = sheet.getLastRow();
    var now = new Date();
    var TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

    if (lastRow > 1) {
      // Column 1 = Timestamp, Column 3 = Contact Number
      var values = sheet.getRange(2, 1, lastRow - 1, 3).getValues();

      for (var i = 0; i < values.length; i++) {
        var rowDate = values[i][0];
        var rowContact = (values[i][2] || "").toString().replace(/\D/g, "").slice(-10);

        if (rowContact === cleanContact) {
          var isDuplicate = false;
          if (rowDate instanceof Date) {
            var diff = now.getTime() - rowDate.getTime();
            if (diff < TWENTY_FOUR_HOURS_MS) {
              isDuplicate = true;
            }
          } else {
            // Fallback: If date parsing isn't a Date object, prevent duplicate
            isDuplicate = true;
          }

          if (isDuplicate) {
            return createJsonResponse({
              result: "duplicate",
              message: "You have already submitted, please wait for 24hr",
              phone: cleanContact
            });
          }
        }
      }
    }

    // Append new lead if not duplicate
    sheet.appendRow([
      now,
      name,
      "'" + cleanContact, // Apostrophe forces text format in Excel/Sheets
      city,
      bundle,
      price,
      "New Lead",
      source
    ]);

    // Auto-fit columns
    var newRow = sheet.getLastRow();
    sheet.getRange(newRow, 1, 1, 8).setHorizontalAlignment("left");

    return createJsonResponse({
      result: "success",
      message: "Lead successfully recorded in Google Sheet",
      phone: cleanContact
    });

  } catch (err) {
    return createJsonResponse({
      result: "error",
      message: err.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
