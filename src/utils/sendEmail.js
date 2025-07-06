import nodemailer from 'nodemailer'
const htmlTemplate= ({name,eventName,eventStartDate,eventEndDate,eventLocation})=>`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Invitation</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        }
        .header {
            background-color: #007bff; /* Primary blue for header */
            color: #ffffff;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .content {
            padding: 30px;
            color: #555555;
        }
        .content h2 {
            color: #007bff;
            font-size: 22px;
            margin-top: 0;
            margin-bottom: 20px;
        }
        .details-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
        }
        .details-table th, .details-table td {
            padding: 12px 0;
            text-align: left;
            border-bottom: 1px solid #eeeeee;
        }
        .details-table th {
            color: #777777;
            font-weight: normal;
            width: 30%; /* Adjust as needed */
        }
        .details-table td {
            color: #333333;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>You have been registered for an event</h1>
        </div>
        <div class="content">
            <p>Dear ${name},</p>
            <p>We're excited to invite you to an upcoming event!</p>

            <h2>Event Details</h2>
            <table class="details-table">
                <tr>
                    <th>Event Name:</th>
                    <td><strong>${eventName}</strong></td>
                </tr>
                <tr>
                    <th>Start Date:</th>
                    <td>${new Date(eventStartDate).toLocaleString([], {
                            dateStyle: "medium",
                            timeStyle: "short",
                            hour12: true,
                    })}</td>
                </tr>
                <tr>
                    <th>End Date:</th>
                    <td>${new Date(eventEndDate).toLocaleString([], {
                            dateStyle: "medium",
                            timeStyle: "short",
                            hour12: true,
                    })}</td>
                </tr>
                <tr>
                    <th>Location:</th>
                    <td>${eventLocation}</td>
                </tr>
            </table>

            <p>We look forward to seeing you there!</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
        </div>
      
    </div>
</body>
</html>`
export async function sendGmail({name,email,event}) {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // This tells Nodemailer to use Gmail's well-known SMTP settings
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.GMAIL_USER, 
        to: email,
        subject: 'registration confirmation',
        text: 'registration confirmation mail',
        html: htmlTemplate({name:name,eventName:event.title,eventStartDate:event.start,eventEndDate:event.end,eventLocation:event.location})
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
        
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
