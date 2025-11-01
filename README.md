# Google Calendar Clone

A high-fidelity fullstack clone of Google Calendar built with React and Node.js. Features monthly, weekly, and daily views with smooth animations and complete event management.

## 🎯 Features

### Frontend
- **Three Calendar Views**: Month, Week, and Day views
- **Event Management**: Create, edit, and delete events
- **Interactive UI**: Click dates to create events, click events to edit
- **Smooth Animations**: Modal transitions, hover effects, and visual feedback
- **Responsive Design**: Works on desktop and mobile
- **Event Customization**: 8 color options, all-day events, recurring patterns

### Backend
- **RESTful API**: Full CRUD operations for events
- **MongoDB**: Persistent data storage
- **Data Validation**: Server and client-side validation
- **Error Handling**: Comprehensive error handling

## 🛠️ Technology Stack

**Frontend:**
- React 18
- date-fns (date manipulation)
- Axios (HTTP client)
- React Icons
- CSS3 (custom styling)

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- CORS, dotenv

## 📁 Project Structure

```
google-calendar-clone/
├── client/                          # React frontend
│   ├── public/                      # Static files
│   │   └── index.html
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── CalendarHeader.js
│   │   │   ├── CalendarHeader.css
│   │   │   ├── MonthView.js
│   │   │   ├── MonthView.css
│   │   │   ├── WeekView.js
│   │   │   ├── WeekView.css
│   │   │   ├── DayView.js
│   │   │   ├── DayView.css
│   │   │   ├── EventModal.js
│   │   │   ├── EventModal.css
│   │   │   ├── EventItem.js
│   │   │   ├── EventItem.css
│   │   │   ├── Sidebar.js
│   │   │   ├── Sidebar.css
│   │   │   ├── Notification.js
│   │   │   └── Notification.css
│   │   ├── services/                # API service layer
│   │   │   └── api.js
│   │   ├── utils/                   # Date utilities
│   │   │   └── dateUtils.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── package-lock.json
├── server/                          # Node.js backend
│   ├── models/                      # Mongoose schemas
│   │   └── Event.js
│   ├── routes/                      # API endpoints
│   │   └── events.js
│   ├── index.js                     # Server entry point
│   ├── package.json
│   └── package-lock.json
├── package.json                     # Root package.json
├── package-lock.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd google-calendar-clone
   npm run install-all
   ```
   
   This installs dependencies for:
   - Root: `/package.json`
   - Server: `/server/package.json`
   - Client: `/client/package.json`

2. **Set up MongoDB**
   
   **Option A - Local MongoDB:**
   - Install and start MongoDB locally
   - Default connection: `mongodb://localhost:27017/google-calendar-clone`
   - No configuration file needed

   **Option B - MongoDB Atlas:**
   - Create MongoDB Atlas account and get connection string
   - Create environment file at `/server/.env`:
     ```
     PORT=5001
     MONGODB_URI=your_mongodb_atlas_connection_string
     CLIENT_URL=http://localhost:3000
     ```

3. **Run the application**
   
   **Start both frontend and backend:**
   ```bash
   npm run dev
   ```
   
   This starts:
   - Backend server: `http://localhost:5001` (from `/server/index.js`)
   - Frontend React app: `http://localhost:3000` (from `/client/src/index.js`)
   
   **Run separately:**
   ```bash
   # Backend only
   cd server && npm run dev
   
   # Frontend only (in new terminal)
   cd client && npm start
   ```

## 📡 API Endpoints

**Base URL**: `http://localhost:5001/api`

- `GET /api/events` - Get events (optional: `?startDate=...&endDate=...`)
  - Defined in: `/server/routes/events.js` (GET `/`)
- `GET /api/events/:id` - Get single event by ID
  - Defined in: `/server/routes/events.js` (GET `/:id`)
- `POST /api/events` - Create new event
  - Defined in: `/server/routes/events.js` (POST `/`)
- `PUT /api/events/:id` - Update existing event
  - Defined in: `/server/routes/events.js` (PUT `/:id`)
- `DELETE /api/events/:id` - Delete event
  - Defined in: `/server/routes/events.js` (DELETE `/:id`)
- `GET /api/health` - Health check endpoint
  - Defined in: `/server/index.js`

**Event Data Model:**
```json
{
  "title": "Event Title",
  "description": "Description",
  "startTime": "2024-01-15T10:00:00.000Z",
  "endTime": "2024-01-15T11:00:00.000Z",
  "allDay": false,
  "color": "#4285f4",
  "location": "Location",
  "recurring": "none"
}
```

## 🏗️ Architecture

### Frontend
- **Entry Point**: `/client/src/index.js`
- **Main Component**: `/client/src/App.js`
- **Components**: All in `/client/src/components/`
- **API Service**: `/client/src/services/api.js`
- **Date Utils**: `/client/src/utils/dateUtils.js`
- **State Management**: React hooks (useState, useEffect, useCallback)
- **Key Components**: App, CalendarHeader, Sidebar, MonthView, WeekView, DayView, EventModal

### Backend
- **Entry Point**: `/server/index.js`
- **API Routes**: `/server/routes/events.js`
- **Data Model**: `/server/models/Event.js`
- **RESTful API** with Express.js
- **MongoDB** with Mongoose for data modeling
- **Validation Layers**: Schema (Mongoose), Route (Express), Database (MongoDB)
- **Middleware**: CORS, JSON parsing, error handling

### Data Flow
```
User Action → Component → App.js → API Service → Backend → MongoDB → Response → UI Update
```

**Files involved:**
- `/client/src/components/*.js` → User interaction
- `/client/src/App.js` → State management
- `/client/src/services/api.js` → HTTP requests
- `/server/routes/events.js` → API handlers
- `/server/models/Event.js` → Data model
- MongoDB database → Data storage

## 💡 Business Logic & Edge Cases

### Validation
- **Time Validation**: End time must be after start time (client & server)
- **Required Fields**: Title, startTime, endTime
- **Field Limits**: Title (200 chars), Description (1000 chars)
- **ObjectId Validation**: MongoDB ID format validation

### Edge Cases Handled

1. **Overlapping Events**: Multiple events can exist at the same time (like Google Calendar)
2. **All-Day Events**: Stored as 00:00:00 to 23:59:59, shown in all-day section
3. **Cross-Day Events**: Events spanning multiple days appear in all relevant calendar cells
4. **Month/Week Boundaries**: Events crossing boundaries appear in both views
5. **Partial Updates**: Validates endTime > startTime even when only one date field is updated
6. **Date Range Queries**: Efficient MongoDB queries that check for overlap with visible range
7. **Timezone Handling**: Stores UTC, displays in local timezone

### Recurring Events
- **Current**: Pattern is stored (`none`, `daily`, `weekly`, `monthly`, `yearly`)
- **Limitation**: Only base event stored; occurrences not expanded
- **Future**: Requires recurrence engine to generate individual occurrences

## 🎨 Animations & Interactions

### Design Features
- **Color Scheme**: Matches Google Calendar (#1a73e8 primary)
- **Typography**: Google Sans font family
- **Layout**: Exact dimensions (240px sidebar, 64px header)
- **Visual Elements**: Gradient buttons, backdrop blur, smooth transitions

### Key Animations
- **Modal**: Fade in overlay (0.2s) + slide up content (0.4s)
- **Buttons**: Gradient backgrounds with shimmer effect on hover
- **Calendar Days**: Hover effects with scale transform (1.01x)
- **Today Indicator**: Blue gradient circle with shadow
- **Event Items**: Translate and scale on hover with backdrop blur
- **Performance**: Uses GPU-accelerated properties (transform, opacity)

### Animation Details
- Most interactions: 0.25s transitions
- Complex animations: 0.3-0.4s with cubic-bezier easing
- Quick feedback: 0.15s
- Consistent timing functions across all components

## 🔮 Future Enhancements

**Features:**
- Full recurrence expansion
- Event search
- Drag & drop rescheduling
- Multiple calendars
- ICS import/export
- Browser notifications
- Keyboard shortcuts

**Technical:**
- TypeScript migration
- Redux/Context API for state
- Unit & E2E tests
- PWA support
- Virtual scrolling
- Optimistic updates

## 🐛 Troubleshooting

- **MongoDB Connection Error**
  - Ensure MongoDB is running locally
  - Or check Atlas connection string in `/server/.env`
  - Verify connection string format: `mongodb://localhost:27017/google-calendar-clone`

- **Port Already in Use**
  - Change PORT in `/server/.env`
  - Or kill process using port 5001: `lsof -ti:5001 | xargs kill`

- **CORS Errors**
  - Verify backend is running on `http://localhost:5001`
  - Check CORS configuration in `/server/index.js`
  - Ensure CLIENT_URL in `/server/.env` matches frontend URL

- **Events Not Displaying**
  - Check browser console (F12) for errors
  - Verify API endpoints are accessible: `http://localhost:5001/api/events`
  - Check MongoDB connection and database contents
  - Verify date range queries in browser network tab

- **Installation Issues**
  - Delete `node_modules` folders: `/node_modules`, `/client/node_modules`, `/server/node_modules`
  - Delete lock files: `package-lock.json`, `/client/package-lock.json`, `/server/package-lock.json`
  - Reinstall: `npm run install-all`

## 📝 Recent Improvements

- **UI Enhancements**: Gradient backgrounds, enhanced shadows, backdrop blur effects
- **Interactions**: Shimmer animations, smooth hover effects, better button styles
- **Code Quality**: Improved validation, better error handling, removed deprecated options

## 📄 License

MIT License

---

**Note**: This is an educational clone project. Ensure MongoDB is configured before running.
