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
const testRoutes = require('./routes/testRoutes'); 
const callVolunteerRoutes = require('./routes/callVolunteerRoutes');
const headRegisterRoutes = require('./routes/HeadRegisterRoutes');
const adminLoginRoutes = require('./routes/adminLoginRoutes');
const adminHomeRoutes = require('./routes/adminHomeRoutes');
const headVerificationRoutes = require("./routes/headVerificationRoutes");
const authorityRoutes = require("./routes/adminAuthRoutes");
const adminProfileRoutes = require('./routes/adminProfileRoutes');
const headProfileRoutes = require("./routes/headProfileRoutes");
const bloodBankRoutes = require('./routes/bloodBankRoutes');
const contactRoutes = require('./routes/contactRoutes');
const volunteerIdRoutes = require('./routes/volunteerIdRoutes');
const vehicleIdCRoutes = require('./routes/vehicleIdRoutes');
const acceptedVolunteersRoutes = require('./routes/acceptedVolunteersRoutes');
const errorHandler = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
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
app.use('/api/head-register', headRegisterRoutes);
app.use('/api', adminLoginRoutes);
app.use('/api', adminHomeRoutes);
app.use("/api", headVerificationRoutes);
app.use("/api/authority", authorityRoutes);
app.use('/api', adminProfileRoutes);
app.use("/api/headProfileRoute", headProfileRoutes);
app.use('/api', bloodBankRoutes);
app.use('/api', contactRoutes);
app.use('/api', volunteerIdRoutes);
app.use('/api', vehicleIdCRoutes); 
app.use('/api', acceptedVolunteersRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
