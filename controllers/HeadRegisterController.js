const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Add this
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const ensureUploadDirectories = () => {
  const directories = ["uploads/id_proof", "uploads/profile"];
  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

ensureUploadDirectories();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "id_proof") cb(null, "uploads/id_proof");
    else if (file.fieldname === "photo") cb(null, "uploads/profile");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
exports.upload = upload.fields([{ name: "id_proof", maxCount: 1 }, { name: "photo", maxCount: 1 }]);

// Registration function
exports.registerHead = async (req, res) => {
  const { full_name, email, phone_number, district, password } = req.body;
  const idProofFile = req.files["id_proof"] ? req.files["id_proof"][0] : null;
  const profileFile = req.files["photo"] ? req.files["photo"][0] : null;

  if (!idProofFile || !profileFile) return res.status(400).json({ error: "ID Proof and Photo are required" });

  try {
    const existingUser = await db.query("SELECT * FROM district_heads WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) return res.status(409).json({ error: "User with this email already exists." });

    const idProofUrl = `${req.protocol}://${req.get("host")}/uploads/id_proof/${idProofFile.filename}`;
    const profileUrl = `${req.protocol}://${req.get("host")}/uploads/profile/${profileFile.filename}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO district_heads (full_name, email, phone_number, district, password, id_proof, profile_photo) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [full_name, email, phone_number, district, hashedPassword, idProofUrl, profileUrl]
    );

    res.status(201).json({ message: "District head registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
};

// Login function with JWT
exports.loginHead = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.query("SELECT * FROM district_heads WHERE email = $1", [email]);
    if (user.rows.length === 0) return res.status(401).json({ error: "Invalid email or password" });

    const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);
    if (!isPasswordValid) return res.status(401).json({ error: "Invalid email or password" });

    // Generate JWT token
    const token = jwt.sign({ email: user.rows[0].email }, "your-secret-key", { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message || "Something went wrong during login" });
  }
};
