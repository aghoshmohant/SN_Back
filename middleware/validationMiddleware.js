const { body, validationResult } = require('express-validator');

// Validation rules for signup
const signupValidationRules = [
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('phone_number')
    .isLength({ min: 10, max: 10 })
    .isNumeric()
    .withMessage('Phone number must be 10 digits'),
  body('district').notEmpty().withMessage('District is required'),
  body('state').notEmpty().withMessage('State is required'),
  body('dob').notEmpty().withMessage('Date of birth is required'),
  body('blood_group').notEmpty().withMessage('Blood group is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

// Validation middleware
const validateInputs = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { signupValidationRules, validateInputs };
