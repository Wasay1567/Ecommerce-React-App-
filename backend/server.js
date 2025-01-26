const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// POST route to send email
app.post('/send-email', async (req, res) => {
    const { email, cartItems } = req.body;

    // Validate input
    if (!email || !cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: 'Invalid request data' });
    }

    try {
        // Configure nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Replace with your email provider
            auth: {
                user: 'your-email@gmail.com', // Replace with your email
                pass: 'your-email-password', // Replace with your email password or app password
            },
        });

        // Generate email content
        const cartDetails = cartItems
            .map(
                (item, index) =>
                    `${index + 1}. ${item.name} - Quantity: ${item.quantity} - Price: $${item.price}`
            )
            .join('\n');

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Your Order Details',
            text: `Thank you for your order!\n\nHere are the details of the items in your cart:\n\n${cartDetails}`,
        };

        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending email' });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});