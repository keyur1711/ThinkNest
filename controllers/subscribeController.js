const Subscriber = require('../models/Subscriber');

const subscribeUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await Subscriber.findOne({ email: normalizedEmail });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'This email is already subscribed to our newsletter',
      });
    }

    const subscriber = await Subscriber.create({ email: normalizedEmail });

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: {
        _id: subscriber._id,
        email: subscriber.email,
        createdAt: subscriber.createdAt,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This email is already subscribed to our newsletter',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error subscribing to newsletter',
      error: error.message,
    });
  }
};

module.exports = {
  subscribeUser,
};
