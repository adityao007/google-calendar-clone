const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Event = require('../models/Event');

/**
 * GET /api/events
 * Get all events within a date range
 * Query params: startDate, endDate (optional)
 */
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = {};
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Validate dates
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ error: 'Invalid date format. Use ISO 8601 format.' });
      }

      if (end < start) {
        return res.status(400).json({ error: 'endDate must be after startDate' });
      }
      
      // Query for events that overlap with the date range
      // An event overlaps if:
      // 1. Event starts within the range, OR
      // 2. Event ends within the range, OR
      // 3. Event completely contains the range (starts before and ends after)
      query = {
        $or: [
          // Event starts within range
          { startTime: { $gte: start, $lte: end } },
          // Event ends within range
          { endTime: { $gte: start, $lte: end } },
          // Event completely contains the range
          {
            $and: [
              { startTime: { $lte: start } },
              { endTime: { $gte: end } }
            ]
          }
        ]
      };
    }

    const events = await Event.find(query)
      .sort({ startTime: 1 })
      .lean()
      .exec();
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch events' });
  }
});

/**
 * GET /api/events/:id
 * Get a single event by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid event ID format' });
    }
    
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch event' });
  }
});

/**
 * POST /api/events
 * Create a new event
 */
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      startTime,
      endTime,
      allDay,
      color,
      location,
      recurring
    } = req.body;

    // Validate required fields
    if (!title || !startTime || !endTime) {
      return res.status(400).json({
        error: 'Title, startTime, and endTime are required'
      });
    }

    // Validate and parse dates
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (isNaN(startDate.getTime())) {
      return res.status(400).json({ error: 'Invalid startTime format' });
    }
    if (isNaN(endDate.getTime())) {
      return res.status(400).json({ error: 'Invalid endTime format' });
    }

    // Validate endTime is after startTime
    if (endDate <= startDate) {
      return res.status(400).json({
        error: 'End time must be after start time'
      });
    }

    // Validate title length
    if (title.trim().length === 0) {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }
    if (title.length > 200) {
      return res.status(400).json({ error: 'Title cannot exceed 200 characters' });
    }

    const event = new Event({
      title: title.trim(),
      description: description || '',
      startTime: startDate,
      endTime: endDate,
      allDay: allDay || false,
      color: color || '#4285f4',
      location: location || '',
      recurring: recurring || 'none'
    });

    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid data format' });
    }
    res.status(500).json({ error: error.message || 'Failed to create event' });
  }
});

/**
 * PUT /api/events/:id
 * Update an existing event
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid event ID format' });
    }
    
    // Check if event exists
    const existingEvent = await Event.findById(id);
    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    const {
      title,
      description,
      startTime,
      endTime,
      allDay,
      color,
      location,
      recurring
    } = req.body;

    // For partial updates, use existing values when not provided
    const newStartTime = startTime !== undefined ? new Date(startTime) : existingEvent.startTime;
    const newEndTime = endTime !== undefined ? new Date(endTime) : existingEvent.endTime;

    // Validate endTime is after startTime
    if (newEndTime <= newStartTime) {
      return res.status(400).json({
        error: 'End time must be after start time'
      });
    }

    // Validate date inputs
    if (startTime !== undefined && isNaN(newStartTime.getTime())) {
      return res.status(400).json({ error: 'Invalid startTime format' });
    }
    if (endTime !== undefined && isNaN(newEndTime.getTime())) {
      return res.status(400).json({ error: 'Invalid endTime format' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (startTime !== undefined) updateData.startTime = newStartTime;
    if (endTime !== undefined) updateData.endTime = newEndTime;
    if (allDay !== undefined) updateData.allDay = allDay;
    if (color !== undefined) updateData.color = color;
    if (location !== undefined) updateData.location = location;
    if (recurring !== undefined) updateData.recurring = recurring;
    
    // Update updatedAt timestamp
    updateData.updatedAt = Date.now();

    const event = await Event.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid data format' });
    }
    res.status(500).json({ error: error.message || 'Failed to update event' });
  }
});

/**
 * DELETE /api/events/:id
 * Delete an event
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid event ID format' });
    }
    
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully', event });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: error.message || 'Failed to delete event' });
  }
});

module.exports = router;

