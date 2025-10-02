const pool = require('../config/connectSql');  //USERNAME TABLE 
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Check if user already exists
    const [existing] = await pool.execute(
      'SELECT * FROM usernames WHERE username = ? LIMIT 1',
      [username]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: 'User with this Username already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await pool.execute(
      `INSERT INTO usernames 
       (mongodb_id, username, password, role, version_key, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [null, username, hashedPassword, role || 'viewer', 0]
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: result.insertId,
        mongodb_id: null,
        username,
        role: role || 'viewer',
        version_key: 0,
        created_at: new Date(), // approximate, MySQL also has NOW()
        updated_at: new Date()
      }
    });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(400).json({ error: 'Error registering user' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.execute(`SELECT * FROM usernames WHERE username = ? LIMIT 1`,[username]);

    const user=rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' }); 

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, username: user.username,role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login error' });
  }
};