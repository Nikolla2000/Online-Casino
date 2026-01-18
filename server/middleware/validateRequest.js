const { ValidationError } = require("../helpers/errors");

// Takes zod validation schema as a parameter
const validateRequest = (validationSchema) => {
  return (req, res, next) => {
    const result = validationSchema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const error = new ValidationError('Validation failed');
      error.details = result.error.errors;
      return next(error);
    }

    req.validatedData = result.data;
    next();
  }
}

module.exports = { validateRequest };