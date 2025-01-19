const pool = require('../config/db'); // Assuming you're using PostgreSQL with a connection pool

// Save User to the Database
const signupUser = async (userData) => {
  const { full_name, email, phone_number, district, state, dob, blood_group, donate_blood, password } = userData;

  const query = `
    INSERT INTO signup (full_name, email, phone_number, district, state, dob, blood_group, donate_blood, password)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id
  `;
  const values = [full_name, email, phone_number, district, state, dob, blood_group, donate_blood, password];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// Fetch User by Email
const loginUser = async (email) => {
  const query = `SELECT * FROM signup WHERE email = $1`;
  const result = await pool.query(query, [email]);

  return result.rows[0]; // Return the first user if found
};

module.exports = { signupUser, loginUser };
