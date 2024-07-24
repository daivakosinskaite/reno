const express = require('express');
const jwt = require('jsonwebtoken');
const Ad = require('../models/Ad');
const router = express.Router();

// Middleware, kad patikrintume autentifikaciją
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.sendStatus(401);
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.sendStatus(401);
  }
};

// Pridėti skelbimą
router.post('/', authenticate, async (req, res) => {
  const { title, price, city, imageUrl } = req.body;
  const ad = new Ad({
    title,
    price,
    city,
    imageUrl,
    userId: req.user.userId
  });
  await ad.save();
  res.status(201).json(ad);
});

// Gauti visus skelbimus
router.get('/', async (req, res) => {
  const ads = await Ad.find();
  res.json(ads);
});

// Gauti vartotojo skelbimus
router.get('/my-ads', authenticate, async (req, res) => {
  const ads = await Ad.find({ userId: req.user.userId });
  res.json(ads);
});

// Ištrinti skelbimą
router.delete('/:id', authenticate, async (req, res) => {
  const ad = await Ad.findById(req.params.id);
  if (!ad) {
    return res.sendStatus(404);
  }
  if (ad.userId.toString() !== req.user.userId) {
    return res.sendStatus(403);
  }
  await ad.remove();
  res.sendStatus(204);
});

// Atnaujinti skelbimą
router.put('/:id', authenticate, async (req, res) => {
  const { title, price, city, imageUrl } = req.body;
  const ad = await Ad.findById(req.params.id);
  if (!ad) {
    return res.sendStatus(404);
  }
  if (ad.userId.toString() !== req.user.userId) {
    return res.sendStatus(403);
  }
  ad.title = title || ad.title;
  ad.price = price || ad.price;
  ad.city = city || ad.city;
  ad.imageUrl = imageUrl || ad.imageUrl;
  await ad.save();
  res.json(ad);
});

module.exports = router;
