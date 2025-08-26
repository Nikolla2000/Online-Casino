const nodemailer = require("nodemailer");

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

        res.status(200).json({ message: "Email send successfully!" });


    } catch (err) {
        console.error("Email error: ", err);
        res.status(500).json({ error: 'Failed to send email'});
    }
}

module.exports = {
    sendEmail,
}