const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Įkeliame aplinkos kintamuosius iš .env failo
dotenv.config();

const app = express();

// Įjungiame CORS, kad leistume Cross-Origin užklausas
app.use(cors());

// Naudojame express.json() kad leistume aplikacijai apdoroti JSON duomenis
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Prisijungiame prie MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Maršrutų prijungimas
const authRoutes = require('./routes/auth'); // Prisijungimo ir registracijos maršrutai
const adsRoutes = require('./routes/ads'); // Skelbimų maršrutai

// Naudojame auth ir ads maršrutus
app.use('/auth', authRoutes);
app.use('/ads', adsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
