const { ValidationError } = require("../helpers/errors");

// Takes zod validation schema as a parameter
const validateRequest = (validationSchema) => {
  return async (req, res, next) => {
    try {
      const result = await validationSchema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
  
      if (!result.success) {
        const error = new ValidationError('Validation failed');
        error.details = result.error;
        return next(error);
      }
  
      req.validatedData = result.data;
      next();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = { validateRequest };