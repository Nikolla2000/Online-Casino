const { z } = require('zod');

const emailSchema = z.email("Invalid email format")
  .toLowerCase()
  .trim();

const usernameSchema = z.string()
  .min(4, 'Username must be at least 4 charactes')
  .max(20, 'Username can\'t be longer than 20 characters ')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores')
  .toLowerCase()
  .trim();


const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');


const registerSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(20, 'First name can\'t be longer than 20 characters')
    .trim(),

    lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(20, 'Last name can\'t be longer than 20 characters')
    .trim(),

    username: usernameSchema,

    email: emailSchema,

    password: passwordSchema,

    confirmPassword: z.string().min(1, 'Confirm password is required'),

    country: z.string()
      .optional()
      .transform(val => val?.trim()),

    phoneNumber: z.string()
      .optional()
      .transform(val => val?.trim())
      .refine(val => val?.trim()),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords don\'t match',
  path: ['confirmPassword']
});

const updateProfileSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50)
    .trim()
    .optional(),
    
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50)
    .trim()
    .optional(),
    
}).partial();

module.exports = {
  registerSchema,
  updateProfileSchema,
  emailSchema,
  usernameSchema,
  passwordSchema,

  validateRegister: (data) => registerSchema.parse(data),
  validateUpdateProfile: (data) => updateProfileSchema.parse(data),
};