/**
 * Validate registration form data before sending to server
 * 
 * @param {*} formData
 * @param {Object} formData - The user data to be validated.
 * @param {string} formData.firstName - User first name (2-20 chars)
 * @param {string} formData.lastName - User last name (2-20 chars)
 * @param {string} formData.username - Preferred username (4-20 chars)
 * @param {string} formData.email - User email address.
 * @param {string} formData.country - Selected country code.
 * @param {string} formData.password - Password requiring uppercase, lowercase, number, and special char.
 * @param {string} formData.confirmPassword - Must match formData.password
 * @returns {Object} An errors object. Empty object indicates valid form.
 */
const validateRegisterForm = (formData) => {
  const errors = {};
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const uppercaseLetterRegex = /[A-Z]/;
  const lowercaseLetterRegex = /[a-z]/;
  const numberRegex = /\d/;
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

  if (formData.firstName.length < 2 || formData.firstName.length > 20) {
    errors.firstName = 'First Name must be between 2 and 20 characters';
  }

  if (formData.lastName.length < 2 || formData.lastName.length > 20) {
    errors.lastName = 'Last Name must be between 2 and 20 characters';
  }

  if (formData.username.length < 4 || formData.username.length > 20) {
    errors.username = 'Username must be between 4 and 20 characters';
  }

  if (!emailRegex.test(formData.email)) {
    errors.email = 'You must enter a valid email';
  }

  if (!formData.country) {
    errors.country = 'Please select a country';
  }
  
  if (!specialCharRegex.test(formData.password)) {
    errors.password = 'Password must contain at least one special character';
  }

  if (!uppercaseLetterRegex.test(formData.password)) {
    errors.password = 'Password must contain at least one uppercase letter';
  }

  if (!lowercaseLetterRegex.test(formData.password)) {
    errors.password = 'Password must contain at least one lowercase letter';
  }

  if (!numberRegex.test(formData.password)) {
    errors.password = 'Password must contain at least one number';
  }

  if (formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  if ((formData.password !== formData.confirmPassword) || !formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

export default validateRegisterForm;