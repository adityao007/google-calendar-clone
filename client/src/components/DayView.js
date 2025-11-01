import React from 'react';
import { format, parseISO, getHours, getMinutes } from 'date-fns';
import EventItem from './EventItem';
import './DayView.css';

/**
 * DayView Component
 * Displays calendar in day view with hourly time slots
 */
const DayView = ({ currentDate, events, onDateClick, onEventClick, loading }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventPosition = (event) => {
    const eventStart = parseISO(event.startTime);
    const eventEnd = parseISO(event.endTime);
    
    if (event.allDay) {
      return { top: 0, height: 'auto' };
    }
    
    const startHour = getHours(eventStart);
    const startMinute = getMinutes(eventStart);
    const endHour = getHours(eventEnd);
    const endMinute = getMinutes(eventEnd);
    
    // Calculate position in pixels (each hour is 60px, each minute is 1px)
    const startPositionPx = (startHour * 60) + startMinute;
    const durationPx = ((endHour * 60 + endMinute) - (startHour * 60 + startMinute));
    const minHeightPx = 20; // Minimum height in pixels
    
    return {
      top: `${startPositionPx}px`,
      height: `${Math.max(durationPx, minHeightPx)}px`,
    };
  };

  // Filter events for the current day (including overlapping events)
  const dayEvents = events.filter((event) => {
    const eventStart = parseISO(event.startTime);
    const eventEnd = parseISO(event.endTime);
    const dayStart = new Date(currentDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(currentDate);
    dayEnd.setHours(23, 59, 59, 999);
    
    return (
      (eventStart >= dayStart && eventStart <= dayEnd) ||
      (eventEnd >= dayStart && eventEnd <= dayEnd) ||
      (eventStart <= dayStart && eventEnd >= dayEnd)
    );
  });

  return (
    <div className="day-view">
      <div className="day-header">
        <div className="time-column-header"></div>
        <div className="day-header-content">
          <div className="day-name">{format(currentDate, 'EEEE')}</div>
          <div className="day-date">{format(currentDate, 'MMMM d, yyyy')}</div>
        </div>
      </div>

      <div className="day-body">
        <div className="time-column">
          {hours.map((hour) => {
            const timeDate = new Date(currentDate);
            timeDate.setHours(hour, 0, 0, 0);
            const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
            const period = hour < 12 ? 'AM' : 'PM';
            return (
              <div key={hour} className="time-slot">
                {displayHour} {period}
              </div>
            );
          })}
        </div>

        <div className="day-column">
          <div className="all-day-section">
            <div className="all-day-label">All day</div>
            <div className="all-day-events">
              {dayEvents
                .filter((event) => event.allDay)
                .map((event) => (
                  <EventItem
                    key={event._id || event.id}
                    event={event}
                    onClick={() => onEventClick(event)}
                  />
                ))}
            </div>
          </div>

          <div className="hour-slots">
            {hours.map((hour) => (
              <div
                key={hour}
                className="hour-slot"
                onClick={() => {
                  const clickedDate = new Date(currentDate);
                  clickedDate.setHours(hour, 0, 0, 0);
                  onDateClick(clickedDate);
                }}
              />
            ))}
            {/* Render events absolutely positioned within the hour-slots container */}
            {dayEvents
              .filter((event) => !event.allDay)
              .map((event) => {
                const position = getEventPosition(event);
                return (
                    <EventItem
                      key={event._id || event.id}
                      event={event}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      compact={false}
                      style={{
                        position: 'absolute',
                        ...position,
                        left: '4px',
                        right: '4px',
                        zIndex: 10,
                      }}
                    />
                );
              })}
          </div>
        </div>
      </div>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default DayView;

