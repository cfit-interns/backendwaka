import env from "../util/validateEnv"; // Import environment variable validator
import nodemailer from "nodemailer"; // Import nodemailer for email sending functionality
import BookingModel from "../models/booking"; // Import BookingModel from models/booking

const schedule = require('node-schedule'); // Import node-schedule for scheduling tasks

// Configuration for nodemailer
const config = {
  host: env.SMTP_SERVER_ADDRESS, // SMTP server address from environment variables
  port: env.SMTP_PORT, // SMTP port from environment variables
  secure: false, // Secure connection disabled
  auth: {
    user: env.SMTP_LOGIN, // SMTP login username from environment variables
    pass: env.SMTP_PASSWORD, // SMTP login password from environment variables
  },
};

const transporter = nodemailer.createTransport(config); // Create nodemailer transporter instance with config

async function sendEmails() {
  try {
    console.log('Start to send Email'); // Log start of email sending process

    const date = getFormattedDate(); // Get formatted current date
    console.log('Start to send Email'); // Log start of email sending process

    let searchCriteria: any = {};
    searchCriteria.date = date; // Search criteria for bookings with today's date
    const bookings = await BookingModel.find(searchCriteria).exec(); // Find bookings for today
    for (const booking of bookings) {
      const mailOptions = {
        from: env.SMTP_LOGIN, // Sender email address
        to: booking.email, // Recipient email address
        subject: 'Upcoming Booking Time', // Email subject
        text: 'This is a test email sent using book.', // Plain text email content
        html: `
          <h2>Booking Reminder</h2>
          <p>Dear ${booking.firstName} ${booking.lastName},</p>
          <p>This is a friendly reminder that you have a booking scheduled within the next 24 hours. Here are the details of your booking:</p>
          <p><strong>Booking Details:</strong></p>
          <ul>
            <li>Date: ${booking.date}</li>
            <li>Time: ${booking.pickupTime} -- ${booking.dropoffTime}</li>
            <li>Location: ${booking.destination}</li>
          </ul>
          <p>Please ensure that you arrive at least 10 minutes before your scheduled time. If you need to reschedule or cancel your booking, please contact us as soon as possible.</p>
          <p>Thank you for choosing our services.</p>
          <p>Best regards,</p>
          <p>Waka Eastern Bay</p>
        `, // HTML email content with booking details
      };
      try {
        const info = await transporter.sendMail(mailOptions); // Send email using nodemailer transporter
        console.log('Email sent: ' + info.response); // Log email sent confirmation
      } catch (error) {
        console.error('Error sending email:', error); // Log error if email sending fails
      }
    }

  } catch (err) {
    console.error('Error occurred:', err); // Log any unexpected errors
  }
}

// Function to get formatted current date (YYYY-MM-DD)
function getFormattedDate() {
  const today = new Date(); // Get current date
  const year = today.getFullYear(); // Get current year
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Get current month (add 1 because getMonth() is zero-based)
  const day = String(today.getDate()).padStart(2, '0'); // Get current day

  return `${year}-${month}-${day}`; // Return formatted date string
}

// Function to start scheduling email sending job
function start() {
  // Schedule job to run at 00:00:10 (10 seconds after midnight) every day
  schedule.scheduleJob('10 0 0 * * *', () => {
    sendEmails(); // Call sendEmails function when scheduled
  });
}

module.exports = { start }; // Export start function
