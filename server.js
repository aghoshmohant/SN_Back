const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes')
const orgRoutes = require('./routes/orgRoutes')
const errorHandler = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(errorHandler);
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicle',vehicleRoutes)
app.use('/api/organization',orgRoutes)

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
