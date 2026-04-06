const express = require('express');
const router = express.Router();
const { sendEmail } = require('../../controllers/Email.controller');
const { validateEmail } = require('../../middleware/emailValidation');

/**
 * @swagger
 * tags:
 *   name: Email
 *   description: Contact form email endpoints
 */

/**
 * @swagger
 * /v1/email/sendEmail:
 *   post:
 *     summary: Send a contact form email to admin
 *     tags: [Email]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - message
 *             properties:
 *               email:
 *                 type: string
 *                 example: "mitko@example.com"
 *               message:
 *                 type: string
 *                 example: "Hello, I have a question..."
 *               firstName:
 *                 type: string
 *                 example: "Mitko"
 *               lastName:
 *                 type: string
 *                 example: "Mitkov"
 *               phone:
 *                 type: string
 *                 example: "+359888123456"
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email send successfully!"
 *       400:
 *         description: Email and message are required
 *       500:
 *         description: Failed to send email
 */
router.post('/sendEmail', validateEmail, sendEmail);

module.exports = router;