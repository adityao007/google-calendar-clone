import React from 'react';
import { format, isSameMonth, isToday } from 'date-fns';
import { getDaysInMonthView, getEventsForDay } from '../utils/dateUtils';
import EventItem from './EventItem';
import './MonthView.css';

/**
 * MonthView Component
 * Displays calendar in month view with grid of days
 */
const MonthView = ({ currentDate, events, onDateClick, onEventClick, loading }) => {
  const days = getDaysInMonthView(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="month-view">
      <div className="month-grid">
        {/* Week day headers */}
        <div className="week-day-headers">
          {weekDays.map((day, index) => (
            <div key={index} className="week-day-header">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="calendar-days">
          {days.map((day, index) => {
            const dayEvents = getEventsForDay(events, day);
            const isCurrentMonthDay = isSameMonth(day, currentDate);
            const isCurrentDay = isToday(day);
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;

            return (
              <div
                key={index}
                className={`calendar-day ${!isCurrentMonthDay ? 'other-month' : ''} ${
                  isCurrentDay ? 'today' : ''
                } ${isWeekend ? 'weekend' : ''}`}
                onClick={() => onDateClick(day)}
              >
                <div className="day-number">{format(day, 'd')}</div>
                <div className="day-events">
                  {dayEvents.slice(0, 3).map((event) => (
                    <EventItem
                      key={event._id || event.id}
                      event={event}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      compact
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="more-events">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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

export default MonthView;

