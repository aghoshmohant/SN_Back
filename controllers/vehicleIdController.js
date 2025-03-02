const pool = require('../config/db'); // Import database connection

// Fetch vehicle ID, owner_name, and vehicle_type using user ID, and vehicle call IDs
const getVehicleIdByUser = async (req, res) => {
  const { userId } = req.params; // Extract user ID from request params

  try {
    // Query to fetch vehicle details from the vehicles table
    const vehicleQuery = 'SELECT id, owner_name, vehicle_type FROM vehicles WHERE created_by = $1';
    const vehicleResult = await pool.query(vehicleQuery, [userId]);

    if (vehicleResult.rows.length === 0) {
      return res.status(404).json({ message: 'No vehicles found for this user' });
    }

    // Query to fetch vehicle call IDs from the vehicle_calls table
    const callQuery = 'SELECT id FROM vehicle_calls';
    const callResult = await pool.query(callQuery);

    console.log('Fetched Vehicles:', vehicleResult.rows); // Debugging log for vehicles
    console.log('Fetched Vehicle Call IDs:', callResult.rows); // Debugging log for call IDs

    // Combine the results into a response
    const response = {
      vehicles: vehicleResult.rows, // [{ id: 1, owner_name: "John", vehicle_type: "Truck" }, ...]
      vehicleCallIds: callResult.rows.map(row => row.id), // [1, 2, 3, ...]
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching vehicle data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getVehicleIdByUser };