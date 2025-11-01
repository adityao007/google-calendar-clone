import React, { useState, useEffect, useRef } from 'react';
import { parseISO, format } from 'date-fns';
import { FaTimes, FaTrash } from 'react-icons/fa';

import './EventModal.css';

/**
 * EventModal Component
 * Modal for creating and editing calendar events
 */
const EventModal = ({ event, onClose, onSave, onDelete }) => {
  const isEditing = event?.id || event?._id;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Initialize form data from event prop or defaults
  const getInitialFormData = () => {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 3600000);

    return {
      title: event?.title || '',
      description: event?.description || '',
      startTime: event?.startTime
        ? format(parseISO(event.startTime), "yyyy-MM-dd'T'HH:mm")
        : format(now, "yyyy-MM-dd'T'HH:mm"),
      endTime: event?.endTime
        ? format(parseISO(event.endTime), "yyyy-MM-dd'T'HH:mm")
        : format(oneHourLater, "yyyy-MM-dd'T'HH:mm"),
      allDay: event?.allDay || false,
      color: event?.color || '#4285f4',
      location: event?.location || '',
      recurring: event?.recurring || 'none',
    };
  };

  const [formData, setFormData] = useState(getInitialFormData());
  const modalRef = useRef(null);
  const titleInputRef = useRef(null);

  // Update form data when event prop changes
  useEffect(() => {
    setFormData(getInitialFormData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.id, event?._id]);

  // Focus title input when modal opens
  useEffect(() => {
    if (titleInputRef.current) {
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    }
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !showDeleteConfirm) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose, showDeleteConfirm]);

  // Available event colors
  const colors = [
    { name: 'Blue', value: '#4285f4' },
    { name: 'Green', value: '#34a853' },
    { name: 'Yellow', value: '#fbbc04' },
    { name: 'Orange', value: '#ff9800' },
    { name: 'Red', value: '#ea4335' },
    { name: 'Purple', value: '#9c27b0' },
    { name: 'Pink', value: '#e91e63' },
    { name: 'Teal', value: '#009688' },
  ];

  /**
   * Handle form input changes
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle allDay toggle - convert date format accordingly
    if (name === 'allDay' && checked !== formData.allDay) {
      const newAllDay = checked;
      setFormData(prev => {
        let newStartTime = prev.startTime;
        let newEndTime = prev.endTime;
        
        if (newAllDay) {
          // Convert datetime-local to date format
          newStartTime = prev.startTime.includes('T') ? prev.startTime.split('T')[0] : prev.startTime;
          newEndTime = prev.endTime.includes('T') ? prev.endTime.split('T')[0] : prev.endTime;
        } else {
          // Convert date to datetime-local format
          if (!prev.startTime.includes('T')) {
            newStartTime = prev.startTime + 'T09:00';
          }
          if (!prev.endTime.includes('T')) {
            newEndTime = prev.endTime + 'T10:00';
          }
        }
        
        return {
          ...prev,
          allDay: newAllDay,
          startTime: newStartTime,
          endTime: newEndTime
        };
      });
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      if (titleInputRef.current) {
        titleInputRef.current.focus();
        titleInputRef.current.style.borderBottomColor = '#ea4335';
        setTimeout(() => {
          if (titleInputRef.current) {
            titleInputRef.current.style.borderBottomColor = '';
          }
        }, 2000);
      }
      return;
    }

    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      const endTimeInput = e.target.querySelector('input[name="endTime"]');
      if (endTimeInput) {
        endTimeInput.focus();
        endTimeInput.style.borderColor = '#ea4335';
        setTimeout(() => {
          endTimeInput.style.borderColor = '';
        }, 2000);
      }
      return;
    }

    try {
      // Handle all-day events - set time to start/end of day
      let startTime, endTime;
      if (formData.allDay) {
        const startDate = new Date(formData.startTime);
        startDate.setHours(0, 0, 0, 0);
        startTime = startDate.toISOString();
        
        const endDate = new Date(formData.endTime);
        endDate.setHours(23, 59, 59, 999);
        endTime = endDate.toISOString();
      } else {
        startTime = new Date(formData.startTime).toISOString();
        endTime = new Date(formData.endTime).toISOString();
      }
      
      await onSave({
        ...formData,
        startTime,
        endTime,
      });
    } catch (error) {
      console.error('Error saving event:', error);
      // Error will be handled by parent component's notification system
    }
  };

  /**
   * Show delete confirmation modal
   */
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  /**
   * Confirm and execute delete
   */
  const handleConfirmDelete = async () => {
    try {
      await onDelete();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting event:', error);
      // Error will be handled by parent component's notification system
      throw error; // Re-throw to let parent handle
    }
  };

  /**
   * Cancel delete confirmation
   */
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div 
        className="modal-overlay" 
        onClick={onClose}
        aria-label="Close modal"
      ></div>
      <div 
        className="event-modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <div className="modal-title" id="modal-title">
            {isEditing ? 'Edit event' : 'Create event'}
          </div>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <input
              ref={titleInputRef}
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Add title"
              className="title-input"
              required
              maxLength={200}
              aria-label="Event title"
              aria-required="true"
            />
          </div>

          <div className="form-row">
            <div className="time-input-group">
              <label>
                <input
                  type="checkbox"
                  name="allDay"
                  checked={formData.allDay}
                  onChange={handleChange}
                />
                All day
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="time-input-group">
              <input
                type={formData.allDay ? "date" : "datetime-local"}
                name="startTime"
                value={formData.allDay 
                  ? (formData.startTime.includes('T') ? formData.startTime.split('T')[0] : formData.startTime)
                  : formData.startTime
                }
                onChange={handleChange}
                className="time-input"
                required
              />
            </div>
            <span className="time-separator">-</span>
            <div className="time-input-group">
              <input
                type={formData.allDay ? "date" : "datetime-local"}
                name="endTime"
                value={formData.allDay 
                  ? (formData.endTime.includes('T') ? formData.endTime.split('T')[0] : formData.endTime)
                  : formData.endTime
                }
                onChange={handleChange}
                className="time-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Add location"
              className="text-input"
              maxLength={200}
              aria-label="Event location"
            />
          </div>

          <div className="form-group">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add description"
              className="description-input"
              rows="4"
              maxLength={1000}
              aria-label="Event description"
            />
          </div>

          <div className="form-group">
            <label className="color-label">Color</label>
            <div className="color-picker">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`color-option ${formData.color === color.value ? 'selected' : ''}`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="recurring-label">Repeat</label>
            <select
              name="recurring"
              value={formData.recurring}
              onChange={handleChange}
              className="recurring-select"
            >
              <option value="none">Does not repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="modal-actions">
            {isEditing && (
              <button
                type="button"
                className="delete-button"
                onClick={handleDeleteClick}
              >
                <FaTrash /> Delete
              </button>
            )}
            <div className="action-buttons">
              <button type="button" className="cancel-button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="save-button">
                {isEditing ? 'Save' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {showDeleteConfirm && (
        <>
          <div 
            className="modal-overlay" 
            onClick={handleCancelDelete} 
            style={{ zIndex: 1002 }}
            aria-label="Close delete confirmation"
          ></div>
          <div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="delete-title">
            <div className="confirm-modal-content">
              <h3 id="delete-title">Delete Event</h3>
              <p>Are you sure you want to delete this event?</p>
              <div className="confirm-modal-actions">
                <button 
                  type="button" 
                  className="cancel-button" 
                  onClick={handleCancelDelete}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="confirm-delete-button" 
                  onClick={handleConfirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default EventModal;

