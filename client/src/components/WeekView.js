import React from 'react';
import { format, isToday, parseISO, getHours, getMinutes } from 'date-fns';
import { getDaysInWeekView, getEventsForDay } from '../utils/dateUtils';
import EventItem from './EventItem';
import './WeekView.css';

/**
 * WeekView Component
 * Displays calendar in week view with hourly time slots
 */
const WeekView = ({ currentDate, events, onDateClick, onEventClick, loading }) => {
  const days = getDaysInWeekView(currentDate);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventPosition = (event, day) => {
    const eventStart = parseISO(event.startTime);
    const eventEnd = parseISO(event.endTime);
    
    if (event.allDay) {
      return { top: 0, height: 'auto' };
    }
    
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);
    
    // Calculate position relative to the day
    const effectiveStart = eventStart < dayStart ? dayStart : eventStart;
    const effectiveEnd = eventEnd > dayEnd ? dayEnd : eventEnd;
    
    const startHour = getHours(effectiveStart);
    const startMinute = getMinutes(effectiveStart);
    const endHour = getHours(effectiveEnd);
    const endMinute = getMinutes(effectiveEnd);
    
    // Calculate position in pixels (each hour is 60px, each minute is 1px)
    const startPositionPx = (startHour * 60) + startMinute;
    const durationPx = ((endHour * 60 + endMinute) - (startHour * 60 + startMinute));
    const minHeightPx = 20; // Minimum height in pixels
    
    return {
      top: `${startPositionPx}px`,
      height: `${Math.max(durationPx, minHeightPx)}px`,
    };
  };

  return (
    <div className="week-view">
      <div className="week-header">
        <div className="time-column-header"></div>
        {days.map((day, index) => (
          <div
            key={index}
            className={`week-day-header ${isToday(day) ? 'today' : ''}`}
          >
            <div className="week-day-content">
              <span className="week-day-name">{format(day, 'EEE').toUpperCase()}</span>
              <span className={`week-day-number ${isToday(day) ? 'today-number' : ''}`}>
                {format(day, 'd')}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="week-body">
        <div className="time-column">
          <div className="all-day-time-label">All day</div>
          {hours.map((hour) => {
            const timeDate = new Date();
            timeDate.setHours(hour, 0, 0, 0);
            let displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
            const period = hour < 12 ? 'AM' : 'PM';
            return (
              <div key={hour} className="time-slot">
                {displayHour} {period}
              </div>
            );
          })}
        </div>

        <div className="week-days">
          {days.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className={`week-day-column ${isToday(day) ? 'today-column' : ''}`}
            >
              <div className="all-day-section">
                <div className="all-day-events-container">
                  {getEventsForDay(events, day)
                    .filter((event) => event.allDay)
                    .map((event) => (
                      <EventItem
                        key={event._id || event.id}
                        event={event}
                        onClick={() => onEventClick(event)}
                        compact
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
                      const clickedDate = new Date(day);
                      clickedDate.setHours(hour, 0, 0, 0);
                      onDateClick(clickedDate);
                    }}
                  />
                ))}
                {/* Render events absolutely positioned within the hour-slots container */}
                {getEventsForDay(events, day)
                  .filter((event) => !event.allDay)
                  .map((event) => {
                    const position = getEventPosition(event, day);
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
                          left: '2px',
                          right: '2px',
                          zIndex: 10,
                          pointerEvents: 'auto',
                        }}
                      />
                    );
                  })}
              </div>
            </div>
          ))}
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

export default WeekView;

