import React, { useMemo, useCallback } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addMonths,
  subMonths
} from 'date-fns';
import {
  FaPlus,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

import './Sidebar.css';

/**
 * Sidebar Component
 * Contains navigation, mini calendar, and calendar list
 */
const Sidebar = ({ currentDate, onDateClick, onCreateEvent, onDateChange, isMinimized = false }) => {

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Memoize mini calendar days calculation for performance
  const miniCalendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd
    });
  }, [currentDate]);

  /**
   * Navigate to previous month
   */
  const handlePrevMonth = useCallback(() => {
    if (onDateChange) {
      const newDate = subMonths(currentDate, 1);
      onDateChange(newDate);
    }
  }, [currentDate, onDateChange]);

  /**
   * Navigate to next month
   */
  const handleNextMonth = useCallback(() => {
    if (onDateChange) {
      const newDate = addMonths(currentDate, 1);
      onDateChange(newDate);
    }
  }, [currentDate, onDateChange]);

  return (
    <div className={`sidebar ${isMinimized ? 'minimized' : ''}`}>
      <div className="sidebar-content">
        {/* Create button */}
        <button 
          className="sidebar-create-button" 
          onClick={onCreateEvent}
          aria-label={isMinimized ? 'Create event' : 'Create'}
        >
          <FaPlus /> {!isMinimized && <span>Create</span>}
        </button>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <button className="nav-item active" aria-label="Calendar">
            <FaCalendarAlt />
            {!isMinimized && <span>Calendar</span>}
          </button>
        </nav>

        {/* Mini Calendar */}
        {!isMinimized && (
          <div className="mini-calendar">
            <div className="mini-calendar-header">
              <button 
                className="mini-calendar-nav-button"
                onClick={handlePrevMonth}
                aria-label="Previous month"
              >
                <FaChevronLeft />
              </button>
              <span className="mini-calendar-month">{format(currentDate, 'MMMM yyyy')}</span>
              <button 
                className="mini-calendar-nav-button"
                onClick={handleNextMonth}
                aria-label="Next month"
              >
                <FaChevronRight />
              </button>
            </div>
            <div className="mini-calendar-grid">
              {/* Week day headers */}
              {weekDays.map((day, index) => (
                <div key={index} className="mini-calendar-day-header">
                  {day}
                </div>
              ))}
              {/* Calendar days */}
              {miniCalendarDays.map((day, index) => {
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isCurrent = isToday(day);
                
                return (
                  <button
                    key={index}
                    className={`mini-calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isCurrent ? 'today' : ''}`}
                    onClick={() => onDateClick(day)}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Sidebar);

