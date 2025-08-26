const validateEmail = (req, res, next) => {
    const { email, message, firstName } = req.body;
    
    const errors = [];
  
    if (!email) {
      errors.push('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.push('Email is invalid');
    }
  
    if (!message) {
      errors.push('Message is required');
    } else if (message.length < 10) {
      errors.push('Message must be at least 10 characters long');
    }
  
    if (!firstName) {
      errors.push('First name is required');
    }
  
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: errors
      });
    }
  
    next();
  };
  
  module.exports = {
    validateEmail
  };