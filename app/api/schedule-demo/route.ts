import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

// POST /api/schedule-demo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, time, email, name } = body

    // Validate required fields
    if (!date || !time || !email || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    // Format the date for display
    const meetingDate = new Date(date)
    const formattedDate = meetingDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    // Generate a Google Meet link
    // Note: For a real implementation, you'd use Google Calendar API to create actual Meet links
    // This creates a placeholder link - replace with actual Google Calendar API integration
    const meetingId = `palvo-demo-${Date.now()}`
    const meetLink = `https://meet.google.com/nmc-noji-vjt`

    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    // Email HTML template
    const emailHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Palvo Demo is Confirmed</title>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #000000;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%); border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 48px 40px 24px; text-align: center;">
              <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #00ffff 0%, #7c3aed 100%); border-radius: 16px; margin: 0 auto 24px; line-height: 64px; text-align: center;">
                <span style="font-size: 28px;">🎬</span>
              </div>
              <h1 style="color: #ffffff; font-size: 32px; font-weight: 700; margin: 0 0 8px; letter-spacing: -0.5px;">Demo Confirmed!</h1>
              <p style="color: rgba(255,255,255,0.6); font-size: 16px; margin: 0;">We're excited to show you Palvo</p>
            </td>
          </tr>
          
          <!-- Greeting -->
          <tr>
            <td style="padding: 0 40px 24px;">
              <p style="color: rgba(255,255,255,0.8); font-size: 16px; line-height: 1.6; margin: 0;">
                Hi ${name},<br><br>
                Your product demo has been scheduled. Here are your meeting details:
              </p>
            </td>
          </tr>
          
          <!-- Meeting Details Card -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: rgba(0,0,0,0.4); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
                <tr>
                  <td style="padding: 28px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                          <p style="color: #00ffff; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 6px;">📅 Date</p>
                          <p style="color: #ffffff; font-size: 18px; font-weight: 600; margin: 0;">${formattedDate}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                          <p style="color: #00ffff; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 6px;">🕐 Time</p>
                          <p style="color: #ffffff; font-size: 18px; font-weight: 600; margin: 0;">${time}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 20px;">
                          <p style="color: #00ffff; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 6px;">⏱️ Duration</p>
                          <p style="color: #ffffff; font-size: 18px; font-weight: 600; margin: 0;">30 minutes</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Join Button -->
          <tr>
            <td style="padding: 0 40px 32px;" align="center">
              <a href="${meetLink}" target="_blank" style="display: inline-block; background: #ffffff; color: #000000; font-size: 16px; font-weight: 600; text-decoration: none; padding: 16px 48px; border-radius: 50px;">
                Join Google Meet
              </a>
            </td>
          </tr>
          
          <!-- Meet Link -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: rgba(0,255,255,0.05); border-radius: 12px; border: 1px solid rgba(0,255,255,0.2);">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin: 0 0 6px;">Meeting Link</p>
                    <a href="${meetLink}" style="color: #00ffff; font-size: 14px; text-decoration: none; word-break: break-all;">${meetLink}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; border-top: 1px solid rgba(255,255,255,0.1);">
              <p style="color: rgba(255,255,255,0.4); font-size: 14px; line-height: 1.6; margin: 0 0 16px; text-align: center;">
                If you need to reschedule, simply reply to this email and we'll find a new time that works for you.
              </p>
              <p style="color: rgba(255,255,255,0.3); font-size: 12px; margin: 0; text-align: center;">
                © ${new Date().getFullYear()} Palvo. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

    // Plain text version
    const textContent = `
Demo Confirmed! 🎉

Hi ${name},

Your Palvo product demo has been scheduled.

Meeting Details:
- Date: ${formattedDate}
- Time: ${time}
- Duration: 30 minutes

Join Google Meet: ${meetLink}

If you need to reschedule, simply reply to this email.

Best,
The Palvo Team
`

    // Send email to customer
    await transporter.sendMail({
      from: `"Palvo" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: "🎬 Your Palvo Demo is Confirmed!",
      text: textContent,
      html: emailHTML,
    })

    // Optionally send notification to admin
    if (process.env.ADMIN_EMAIL) {
      await transporter.sendMail({
        from: `"Palvo Scheduler" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `New Demo Booking: ${name}`,
        text: `
New demo booking received:

Name: ${name}
Email: ${email}
Date: ${formattedDate}
Time: ${time}

Meeting Link: ${meetLink}
`,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Demo scheduled successfully",
      meetLink,
      meetingId,
    })

  } catch (error) {
    console.error("Error scheduling demo:", error)
    return NextResponse.json(
      { error: "Failed to schedule demo. Please try again." },
      { status: 500 }
    )
  }
}

// Generate a random Google Meet-style code
function generateMeetCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz"
  const generateSegment = (length: number) =>
    Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
  
  return `${generateSegment(3)}-${generateSegment(4)}-${generateSegment(3)}`
}