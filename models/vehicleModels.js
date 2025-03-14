const pool = require('../config/db'); // Assuming you're using PostgreSQL with a connection pool

const vehicleDetails = async (vehicleData) => {
  const { owner_name, vehicle_type, vehicle_model, phone_number, email, district, created_by } = vehicleData;

  const query = `
    INSERT INTO vehicles (owner_name, vehicle_type, vehicle_model, phone_number, email, district, created_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
  `;
  const values = [owner_name, vehicle_type, vehicle_model, phone_number, email, district, created_by];

  const result = await pool.query(query, values);
  return result.rows[0];
};

module.exports = { vehicleDetails };
