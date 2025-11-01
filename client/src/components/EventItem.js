import React from 'react';
import { parseISO, format } from 'date-fns';
import './EventItem.css';

/**
 * EventItem Component
 * Displays a single calendar event
 * @param {Object} props
 * @param {Object} props.event - Event object
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.compact - Whether to display in compact mode
 * @param {Object} props.style - Additional inline styles
 */
const EventItem = ({ event, onClick, compact = false, style = {} }) => {
  const startTime = parseISO(event.startTime);
  const endTime = parseISO(event.endTime);
  const color = event.color || '#4285f4';

  const formatTime = (date) => {
    if (event.allDay) return 'All day';
    return format(date, 'h:mm a');
  };

  // Convert hex to rgba with opacity for Google Calendar-like effect
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Different opacity for compact vs full events (matching Google Calendar)
  const bgOpacity = compact ? 0.15 : 0.1;
  
  return (
    <div
      className={`event-item ${compact ? 'compact' : ''}`}
      onClick={onClick}
      style={{
        borderLeftColor: color,
        backgroundColor: hexToRgba(color, bgOpacity),
        color: '#3c4043',
        ...style,
      }}
    >
      {!compact && (
        <div className="event-time">
          {formatTime(startTime)}
          {!event.allDay && ` - ${formatTime(endTime)}`}
        </div>
      )}
      <div className="event-title">{event.title}</div>
      {!compact && event.location && (
        <div className="event-location">{event.location}</div>
      )}
    </div>
  );
};

export default EventItem;

