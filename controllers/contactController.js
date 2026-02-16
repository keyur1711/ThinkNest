const Contact = require('../models/Contact');

const sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your name',
      });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email',
      });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message',
      });
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully',
      data: {
        _id: contact._id,
        name: contact.name,
        email: contact.email,
        createdAt: contact.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message,
    });
  }
};

module.exports = {
  sendMessage,
};
