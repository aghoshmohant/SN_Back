const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const orgRoutes = require('./routes/orgRoutes');
const donorRoutes = require('./routes/donorRoutes');
const requirementRoutes = require('./routes/requirementRoutes');
const campRoutes = require('./routes/campRoutes');
const homeRoutes = require('./routes/homeRoutes');
const disasterRoutes = require('./routes/disasterRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const vehicleCallRoutes = require('./routes/callVehicleRoutes');
const authAuthoRoutes = require('./routes/authAuthoRoutes')
const testRoutes = require('./routes/testRoutes'); // Test routes 
const callVolunteerRoutes = require('./routes/callVolunteerRoutes');
const errorHandler = require('./middleware/errorHandler');
const AdminLoginRoutes = require('./routes/admin/loginRoutes');
const AdminHomeROutes =require('./routes/admin/homeRoutes');
const AuthorityVerifyROutes =require('./routes/admin/authoVerificationRoutes');
const AdminProfileRoutes = require('./routes/admin/adminProfileRoutes')

// Initialize Express app
const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(errorHandler);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/organization', orgRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api', requirementRoutes);
app.use('/api', campRoutes);
app.use('/api', homeRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/disaster', disasterRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/test', testRoutes);
app.use('/api/call-vehicle', vehicleCallRoutes);
app.use('/api/call-volunteer', callVolunteerRoutes);
app.use('/api/authority-register',authAuthoRoutes);
app.use('/api/admin/login',AdminLoginRoutes);
app.use('/api/admin/home',AdminHomeROutes);
app.use('/api/admin/autho_verify',AuthorityVerifyROutes)
app.use('/api/admin/profile',AdminProfileRoutes)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
