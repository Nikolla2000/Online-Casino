const nodemailer = require("nodemailer");

/**
 * Send contact form email to admin
 * 
 * @route POST /server/v1/email/sendEmail
 * @access Public
 * @param {string} email - Sender's email address (required)
 * @param {string} message - Contact message (required)
 * @param {string} [firstName] - Sender's first name
 * @param {string} [lastName] - Sender's last name  
 * @param {string} [phone] - Sender's phone number
 * @returns {Promise<void>} sends JSON indicating success on sending email
 * @throws {400} email or message missing
 * @throws {500} email service failure
 */
const sendEmail = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, message } = req.body;

        if (!email || !message) {
            return res.status(400).json({ error: 'Email and message are required' });
        }

        const transporter = nodemailer.createTransport({
            service: process.env.SMTP_SERVICE,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        const mailOptions = {
            from: email,
            to: process.env.CONTACT_EMAIL,
            subject: `New Contact from ${firstName} ${lastName}`,
            html: `
                <h2>📧 New Contact Form Submission</h2>
                <p><strong>👤 Name:</strong> ${firstName} ${lastName}</p>
                <p><strong>📧 Email:</strong> ${email}</p>
                <p><strong>📞 Phone:</strong> ${phone || 'Not provided'}</p>
                <p><strong>💬 Message:</strong></p>
                <p>${message}</p>
                <hr>
                <p>🕒 Sent at: ${new Date().toLocaleString()}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: "Email send successfully!" });


    } catch (err) {
        console.error("Email error: ", err);
        return res.status(500).json({ error: 'Failed to send email'});
    }
}

module.exports = {
    sendEmail,
}