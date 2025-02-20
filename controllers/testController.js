const db = require('../config/db');
const nodemailer = require('nodemailer');

// Helper function to validate email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Controller to send disaster emails
exports.sendDisasterEmails = async (req, res) => {
  try {
    console.log("Fetching emails from users table...");

    // Fetch all emails from the "email" table
    const result = await db.query('SELECT email FROM email');
    console.log("Emails fetched:", result.rows);

    const emails = result.rows.map(row => row.email);

    // Filter out invalid emails
    const validEmails = emails.filter(isValidEmail);
    const invalidEmails = emails.filter(email => !isValidEmail(email));

    if (validEmails.length === 0) {
      return res.status(404).json({ message: 'No valid emails found in the users table' });
    }

    console.log("Valid emails:", validEmails);
    console.log("Invalid emails:", invalidEmails);

    // Create a transporter object using Gmail SMTP configuration
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',  // SMTP server address
      port: 587,  // Secure port for Gmail's SMTP server
      secure: false,  // Use SSL/TLS for security
      auth: {
        user: 'aghoshmohant@gmail.com',  // Your Gmail address
        pass: 'dpwcyaboxthbdihf',  // Your Gmail password or app-specific password if 2FA is enabled
      },
    });

    // Email details
    const mailOptions = {
      from: 'aghoshmohant@gmail.com',  // Sender's email
      to: validEmails,  // Send emails only to valid addresses
      subject: 'Disaster Alert Notification',
      html: `
        <p>This is an important disaster alert notification. Please take necessary precautions.</p>
        <p>Do you want to respond to this alert?</p>
        <a href="www.youtube.com" style="padding: 10px 20px; background-color: green; color: white; text-decoration: none; border-radius: 5px;">Accept</a>
        <a href="www.youtube.com" style="padding: 10px 20px; background-color: red; color: white; text-decoration: none; border-radius: 5px;">Reject</a>
      `,
    };

    console.log("Sending emails...");
    // Send email
    await transporter.sendMail(mailOptions);

    // Return a response with information about the success and failure
    return res.status(200).json({
      message: 'Emails sent successfully!',
      failedEmails: invalidEmails, // List of invalid emails
    });
  } catch (error) {
    console.error('Error sending disaster emails:', error);
    return res.status(500).json({ error: error.message || 'Failed to send emails' });
  }
};
