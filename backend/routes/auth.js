const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Registracijos maršrutas
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Patikriname, ar vartotojas jau egzistuoja
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Sukuriame naują vartotoją
    user = new User({
      name,
      email,
      password
    });

    // Užšifruojame slaptažodį
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Išsaugome vartotoją duomenų bazėje
    await user.save();
    res.status(201).json({ msg: 'User created successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Prisijungimo maršrutas
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Randame vartotoją pagal email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send('Invalid email or password');
    }
    // Patikriname ar slaptažodis teisingas
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).send('Invalid email or password');
    }
    // Sugeneruojame JWT tokeną
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

// Administratoriaus prisijungimo maršrutas
router.post('/admin', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Randame vartotoją pagal email
    const user = await User.findOne({ email, role: 'admin' });
    if (!user) {
      return res.status(401).send('Invalid email or password');
    }
    // Patikriname ar slaptažodis teisingas
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).send('Invalid email or password');
    }
    // Sugeneruojame JWT tokeną
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
