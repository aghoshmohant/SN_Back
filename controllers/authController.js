const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Utility for generating JWT tokens
const generateToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

// Signup Controller
exports.signup = async (req, res) => {
  const {
    full_name,
    email,
    phone_number,
    district,
    dob,
    blood_group,
    donate_blood,
    password,
  } = req.body;

  // Basic input validation
  if (
    !full_name ||
    !email ||
    !phone_number ||
    !district ||
    !dob ||
    !blood_group ||
    !password
  ) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Validate email format
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Validate phone number
  if (!/^\d{10}$/.test(phone_number)) {
    return res.status(400).json({ error: 'Phone number must be 10 digits' });
  }

  // Validate password strength
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  try {
    // Check if user already exists
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await db.query(
      `INSERT INTO users 
      (full_name, email, phone_number, district, dob, blood_group, donate_blood, password) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        full_name,
        email,
        phone_number,
        district,
        dob,
        blood_group,
        donate_blood,
        hashedPassword,
      ]
    );

    return res.status(201).json({ message: 'Account created successfully!' });
  } catch (error) {
    console.error('Error during signup:',error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

// Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Check if user exists
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Compare the password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user); // Generate token
    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
