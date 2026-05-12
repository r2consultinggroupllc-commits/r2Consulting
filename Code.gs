// Google Apps Script - Code.gs
// Instructions for deployment:
// 1. Go to https://script.google.com and create a new project.
// 2. Paste this entire code into the Code.gs file.
// 3. Create a Google Sheet and copy its URL.
// 4. Update the GOOGLE_SHEET_URL below.
// 5. Click "Deploy" > "New deployment".
// 6. Select type: "Web app".
// 7. Execute as: "Me" (your Google account).
// 8. Who has access: "Anyone" (important so the public form works).
// 9. Click "Deploy" and authorize the script.
// 10. Copy the "Web app URL" and paste it into your AI Studio Secrets as VITE_APPS_SCRIPT_URL.

const OWNER_EMAIL = 'r2consultinggroupllc@gmail.com'; // Where notifications are sent

// Optional: If you want to save to a spreadsheet, put the full URL here
// Make sure the first row in the sheet has headers: Date, Name, Phone, Email, Message
const GOOGLE_SHEET_URL = ''; 

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { name, phone, email, message } = data;
    
    // 1. (Optional) Save to Google Sheet
    if (GOOGLE_SHEET_URL) {
      const sheet = SpreadsheetApp.openByUrl(GOOGLE_SHEET_URL).getSheets()[0];
      sheet.appendRow([new Date(), name, phone, email, message]);
    }

    // 2. Send Alert Email to You
    const ownerSubject = `New Lead: ${name} (R2 Consulting Contact Form)`;
    const ownerBody = `You have a new contact form submission:\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage:\n${message}`;
    GmailApp.sendEmail(OWNER_EMAIL, ownerSubject, ownerBody);

    // 3. Send Professional Auto-Reply Email to the Potential Client
    const clientSubject = 'We received your message - R2 Consulting Group';
    const clientBodyHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
        <h2 style="color: #ce0e1d; text-transform: uppercase; font-style: italic;">R2 Consulting Group</h2>
        <h3>Hi ${name},</h3>
        <p>Thank you for reaching out! We have received your message and will review it shortly. You can expect to hear back from us within 24 business hours.</p>
        <p style="padding: 15px; background-color: #f9f9f9; border-left: 4px solid #fccb06;">
          <strong>Your Message:</strong><br>
          <i>${message}</i>
        </p>
        <p>If you need immediate assistance, feel free to give us a call or reply directly to this email.</p>
        <br>
        <p>Best regards,</p>
        <p><strong>The R2 Consulting Group Team</strong><br>
        Built for the Trades. Powered by Technology.</p>
      </div>
    `;
    
    // Send email to client (uses your Google account to send it)
    GmailApp.sendEmail(email, clientSubject, 'Thank you for reaching out. We have received your message.', {
      htmlBody: clientBodyHtml,
      name: 'R2 Consulting Group'
    });

    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Needed to handle CORS preflight requests gracefully
function doOptions(e) {
  return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
}
