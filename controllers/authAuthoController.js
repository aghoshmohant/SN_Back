const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/authority');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// Utility for generating JWT tokens
const generateToken = (user) => {
    return jwt.sign({ email: user.mail }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Signup Controller
exports.signup = async (req, res) => {
    const {
        name, mail, no, designation, dep, eid, dis, oadd, pass, cpass
    } = req.body;

    const idp = req.files?.idp?.[0]?.path || null;
    const photo = req.files?.photo?.[0]?.path || null;

    console.log(req.body);

    if (!name || !mail || !no || !designation || !dep || !eid || !dis || !oadd || !idp || !photo || !pass) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(mail)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!/^\d{10}$/.test(no)) {
        return res.status(400).json({ error: 'Phone number must be 10 digits' });
    }

    if (pass.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    if (pass !== cpass) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        const existingUser = await db.query('SELECT * FROM authority WHERE email = $1', [mail]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(pass, 10);

        await db.query(
            `INSERT INTO authority 
            (name, email, phone_number, designation, department, employee_id, district, office_address, id_proof, photo, password_hash) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [name, mail, no, designation, dep, eid, dis, oadd, idp, photo, hashedPassword]
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
        const userResult = await db.query('SELECT * FROM authority WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = userResult.rows[0];

        const match = await bcrypt.compare(password, user.password_hash);
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
