const express = require('express');
const router = express.Router();
const Person = require('../models/person');

// GET /person
router.get('/', async (req, res, next) => {
  try {
    const people = await Person.find().lean();
    res.json(people);
  } catch (err) {
    // forward to centralized error handler
    next(err);
  }
});

// POST /person
router.post('/', async (req, res, next) => {
  try {
    const p = new Person(req.body);
    const saved = await p.save();
    res.status(201).json(saved);
  } catch (err) {
    // Mongoose validation error -> 400
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation failed', details: err.errors });
    }
    next(err);
  }
});

// GET /person/:id
router.get('/:id', async (req, res, next) => {
  try {
    const p = await Person.findById(req.params.id).lean();
    if (!p) return res.status(404).json({ error: 'Person not found' });
    res.json(p);
  } catch (err) {
    // bad ObjectId or other error
    next(err);
  }
});

// PUT /person/:id
router.put('/:id', async (req, res, next) => {
  try {
    const updated = await Person.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Person not found' });
    res.json(updated);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation failed', details: err.errors });
    }
    next(err);
  }
});

// DELETE /person/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Person.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Person not found' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
