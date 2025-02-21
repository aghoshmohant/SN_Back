const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.name },
        process.env.JWT_SECRET || 'your_secret_key', // Use an environment variable
        { expiresIn: '1h' } // Token expiration time
    );
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Check if user exists
        const userResult = await db.query('SELECT * FROM admin WHERE name = $1', [username]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = userResult.rows[0];

        // Compare the password using bcrypt
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user);

        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};
