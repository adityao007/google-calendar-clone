import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  parseISO,
  getHours,
  getMinutes,
  setHours,
  setMinutes
} from 'date-fns';

/**
 * Date Utility Functions
 * Helper functions for date calculations and formatting
 */

/**
 * Get the start of a month
 * @param {Date} date - Input date
 * @returns {Date} Start of month
 */
export const getMonthStart = (date) => startOfMonth(date);

/**
 * Get the end of a month
 * @param {Date} date - Input date
 * @returns {Date} End of month
 */
export const getMonthEnd = (date) => endOfMonth(date);

/**
 * Get the start of a week (Sunday)
 * @param {Date} date - Input date
 * @returns {Date} Start of week
 */
export const getWeekStart = (date) => startOfWeek(date, { weekStartsOn: 0 });

/**
 * Get the end of a week (Saturday)
 * @param {Date} date - Input date
 * @returns {Date} End of week
 */
export const getWeekEnd = (date) => endOfWeek(date, { weekStartsOn: 0 });

/**
 * Get the start of a day (00:00:00)
 * @param {Date} date - Input date
 * @returns {Date} Start of day
 */
export const getDayStart = (date) => startOfDay(date);

/**
 * Get the end of a day (23:59:59)
 * @param {Date} date - Input date
 * @returns {Date} End of day
 */
export const getDayEnd = (date) => endOfDay(date);

/**
 * Get all days for month view (including previous/next month days)
 * @param {Date} date - Current date
 * @returns {Array<Date>} Array of days in month view
 */
export const getDaysInMonthView = (date) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
};

/**
 * Get all days for week view
 * @param {Date} date - Current date
 * @returns {Array<Date>} Array of days in week
 */
export const getDaysInWeekView = (date) => {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 0 });

  return eachDayOfInterval({ start: weekStart, end: weekEnd });
};

/**
 * Format a date with a given format string
 * @param {Date} date - Date to format
 * @param {string} formatStr - Format string
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatStr = 'PP') => {
  return format(date, formatStr);
};

/**
 * Check if date is in the same month as current date
 * @param {Date} date - Date to check
 * @param {Date} currentDate - Current date
 * @returns {boolean} True if same month
 */
export const isCurrentMonth = (date, currentDate) => {
  return isSameMonth(date, currentDate);
};

/**
 * Check if two dates are the same day
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean} True if same day
 */
export const isCurrentDay = (date1, date2) => {
  return isSameDay(date1, date2);
};

/**
 * Navigate to next or previous month
 * @param {Date} date - Current date
 * @param {string} direction - 'next' or 'prev'
 * @returns {Date} New date
 */
export const navigateMonth = (date, direction) => {
  return direction === 'next' ? addMonths(date, 1) : subMonths(date, 1);
};

/**
 * Navigate to next or previous week
 * @param {Date} date - Current date
 * @param {string} direction - 'next' or 'prev'
 * @returns {Date} New date
 */
export const navigateWeek = (date, direction) => {
  return direction === 'next' ? addWeeks(date, 1) : subWeeks(date, 1);
};

/**
 * Navigate to next or previous day
 * @param {Date} date - Current date
 * @param {string} direction - 'next' or 'prev'
 * @returns {Date} New date
 */
export const navigateDay = (date, direction) => {
  return direction === 'next' ? addDays(date, 1) : subDays(date, 1);
};

/**
 * Get time string from date
 * @param {Date} date - Date to format
 * @returns {string} Formatted time string
 */
export const getTimeString = (date) => {
  return format(date, 'h:mm a');
};

/**
 * Get hour and minute from date
 * @param {Date} date - Date to extract from
 * @returns {Object} Object with hour and minute
 */
export const getHourMinute = (date) => {
  return {
    hour: getHours(date),
    minute: getMinutes(date)
  };
};

/**
 * Set hour and minute on a date
 * @param {Date} date - Date to modify
 * @param {number} hour - Hour to set
 * @param {number} minute - Minute to set
 * @returns {Date} New date with hour and minute set
 */
export const setHourMinute = (date, hour, minute) => {
  return setMinutes(setHours(date, hour), minute);
};

/**
 * Get events that occur on a specific day
 * @param {Array} events - Array of events
 * @param {Date} day - Day to filter events for
 * @returns {Array} Filtered events
 */
export const getEventsForDay = (events, day) => {
  const dayStart = getDayStart(day);
  const dayEnd = getDayEnd(day);

  return events.filter(event => {
    const eventStart = parseISO(event.startTime);
    const eventEnd = parseISO(event.endTime);

    return (
      (eventStart >= dayStart && eventStart <= dayEnd) ||
      (eventEnd >= dayStart && eventEnd <= dayEnd) ||
      (eventStart <= dayStart && eventEnd >= dayEnd)
    );
  });
};

/**
 * Get events that occur in a specific time slot
 * @param {Array} events - Array of events
 * @param {Date} date - Date of the time slot
 * @param {number} hour - Hour of the time slot
 * @returns {Array} Filtered events
 */
export const getEventsForTimeSlot = (events, date, hour) => {
  const slotStart = setMinutes(setHours(date, hour), 0);
  const slotEnd = setMinutes(setHours(date, hour + 1), 0);

  return events.filter(event => {
    const eventStart = parseISO(event.startTime);
    const eventEnd = parseISO(event.endTime);

    return (
      (eventStart >= slotStart && eventStart < slotEnd) ||
      (eventEnd > slotStart && eventEnd <= slotEnd) ||
      (eventStart <= slotStart && eventEnd >= slotEnd)
    );
  });
};

