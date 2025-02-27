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
  const { full_name, email, phone_number, district, dob, blood_group, donate_blood, password } = req.body;

  if (!full_name || !email || !phone_number || !district || !dob || !blood_group || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!/^\d{10}$/.test(phone_number)) {
    return res.status(400).json({ error: 'Phone number must be 10 digits' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  try {
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users (full_name, email, phone_number, district, dob, blood_group, donate_blood, password) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [full_name, email, phone_number, district, dob, blood_group, donate_blood, hashedPassword]
    );

    return res.status(201).json({ message: 'Account created successfully!' });
  } catch (error) {
    console.error('Error during signup:', error);
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
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

// Update Profile Controller
exports.updateProfile = async (req, res) => {
  const { full_name, phone_number, district, dob, blood_group, donate_blood } = req.body;
  const email = req.user.email; // Extract email from authenticated user

  try {
    await db.query(
      `UPDATE users SET full_name = $1, phone_number = $2, district = $3, dob = $4, blood_group = $5, donate_blood = $6 
       WHERE email = $7`,
      [full_name, phone_number, district, dob, blood_group, donate_blood, email]
    );

    return res.status(200).json({ message: 'Profile updated successfully!' });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

// Get Profile Controller
exports.getProfile = async (req, res) => {
  const email = req.user.email;

  try {
    const result = await db.query('SELECT full_name, email, phone_number, district, dob, blood_group, donate_blood FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
