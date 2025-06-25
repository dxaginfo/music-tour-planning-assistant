# 🎵 Tour Planning Assistant

A comprehensive web application for musicians, bands, and their management teams to plan, coordinate, and execute successful tours.

![Tour Planning Assistant Banner](https://via.placeholder.com/1200x400?text=Tour+Planning+Assistant)

## 📋 Overview

The Tour Planning Assistant streamlines the complex logistical challenges of tour planning by providing a centralized platform for:

- 📅 Scheduling and calendar management
- 🏢 Venue information management
- 🚌 Travel logistics coordination
- 💬 Team communication
- 💰 Financial tracking and reporting
- 📱 Mobile access to critical information

## ✨ Features

### Tour Calendar & Scheduling
- Interactive calendar for tour dates and events
- Conflict detection when scheduling new events
- Automated reminders for upcoming events

### Venue Management
- Venue database with contact information and past performance history
- Technical requirements and rider tracking for each venue
- Contract and payment status tracking

### Travel Logistics
- Route planning and optimization
- Distance and travel time calculations
- Transportation and accommodation booking management

### Team Communication
- In-app messaging system
- Document sharing (contracts, riders, etc.)
- Task assignment and tracking

### Financial Management
- Budget planning and tracking
- Expense recording and categorization
- Revenue tracking and settlement reports

### Mobile Responsiveness
- Full functionality across devices (desktop, tablet, mobile)
- Offline access to critical information

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js with hooks for state management
- **State Management**: Redux for global state
- **Routing**: React Router for navigation
- **UI Components**: Material-UI for responsive design
- **Maps Integration**: Google Maps API for route planning
- **Data Visualization**: Chart.js for financial reporting

### Backend
- **Server**: Node.js with Express.js
- **Authentication**: JWT (JSON Web Tokens)
- **API Structure**: RESTful API design
- **Real-time Communication**: Socket.io for live updates

### Database
- **Primary Database**: MongoDB (NoSQL)
- **Data Modeling**: Mongoose for schema validation
- **Cloud Hosting**: MongoDB Atlas

### Deployment & DevOps
- **Hosting**: AWS (Elastic Beanstalk for scaling)
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry for error tracking
- **Version Control**: Git/GitHub

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- MongoDB (local or Atlas connection)
- Google Maps API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/dxaginfo/music-tour-planning-assistant.git
cd music-tour-planning-assistant
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Create environment variables:
Create a `.env` file in the server directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

4. Start the development servers:
```bash
# Start backend server
cd server
npm run dev

# Start frontend server
cd ../client
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
music-tour-planning-assistant/
├── client/                 # Frontend React application
│   ├── public/             # Public assets
│   └── src/                # React source files
│       ├── components/     # UI components
│       ├── pages/          # Page components
│       ├── redux/          # Redux state management
│       ├── services/       # API service calls
│       └── utils/          # Utility functions
├── server/                 # Backend Node.js/Express application
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middlewares/        # Custom middleware
│   └── utils/              # Utility functions
└── README.md               # Project documentation
```

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Tours
- `GET /api/tours` - Get all tours
- `POST /api/tours` - Create a new tour
- `GET /api/tours/:id` - Get a specific tour
- `PUT /api/tours/:id` - Update a tour
- `DELETE /api/tours/:id` - Delete a tour

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create a new event
- `GET /api/events/:id` - Get a specific event
- `PUT /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event

### Venues
- `GET /api/venues` - Get all venues
- `POST /api/venues` - Create a new venue
- `GET /api/venues/:id` - Get a specific venue
- `PUT /api/venues/:id` - Update a venue
- `DELETE /api/venues/:id` - Delete a venue

### Financial
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create a new expense
- `GET /api/revenue` - Get all revenue entries
- `POST /api/revenue` - Create a new revenue entry

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📬 Contact

Project Link: [https://github.com/dxaginfo/music-tour-planning-assistant](https://github.com/dxaginfo/music-tour-planning-assistant)