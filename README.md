# 🎬 StreamZY

**StreamZY** is a full-stack video streaming web application designed to deliver a modern content browsing experience similar to platforms like YouTube. It enables users to search videos and creators, explore content seamlessly, and interact with channels through a subscription system.

The project is built using a **scalable client-server architecture**, with a dedicated React frontend and an Express-based backend API, ensuring clean separation of concerns and maintainability.

---

## 🌐 Live Demo

🚀 **StreamZY Live At:** [[Add Your Deployed Frontend Link Here]](https://streamzy-1.onrender.com)

---

## 🚀 Core Features

### 🔍 Advanced Search System

* Unified search for **both users and videos**
* Efficient backend querying with combined results
* Supports pagination for scalability
* Real-time updates based on user queries

---

### 🎥 Video Browsing Experience

* Smooth **infinite scrolling** for continuous content loading
* Optimized rendering for large datasets
* Clean and responsive UI for all screen sizes

---

### 👤 User & Channel System

* Dedicated **user profile pages**
* Displays subscriber count and user details
* Seamless navigation between channels

---

### 🔔 Subscription System

* Users can **subscribe/unsubscribe** to channels
* Instant UI updates reflecting subscription state
* Dropdown-based interaction for better UX
* Backend-controlled subscription persistence

---

### 🔐 Authentication & Security

* Secure authentication using **JWT (JSON Web Tokens)**
* Protected routes for user-specific actions
* Token-based authorization for API requests
* Safe handling of user sessions

---

### ⚡ Performance & Optimization

* Efficient API calls using Axios
* Pagination-based data fetching
* Context API for centralized state management
* Reduced unnecessary re-renders

---

## 🏗️ Project Architecture

The project follows a **modular full-stack architecture**:

```bash
streamzy/
│
├── frontend/        # React Client
│   ├── src/
│   │   ├── components/
│   │   ├── Context/
│   │   ├── pages/
│   │   └── App.jsx
│   └── package.json
│
├── backend/         # Express Server
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── index.js
│   └── package.json
│
└── README.md
```

---

## 🖥️ Frontend (React)

### ⚙️ Technologies Used

* React.js (Component-based architecture)
* Tailwind CSS (Utility-first styling)
* Axios (HTTP requests)
* React Router DOM (Routing)
* React Infinite Scroll Component
* React Hot Toast (Notifications)

### ✨ Key Functionalities

* Dynamic routing (Search page, User profile)
* Infinite scrolling for content-heavy pages
* Centralized state using Context API
* Responsive UI across devices
* Real-time interaction feedback (toasts, loaders)

---

## 🛠️ Backend (Node.js + Express)

### ⚙️ Technologies Used

* Node.js
* Express.js
* MongoDB (Database)
* JWT for authentication

### ✨ Key Functionalities

* RESTful API design
* Modular route handling
* Middleware-based authentication
* Subscription management system
* Search API combining multiple collections
* Pagination support for large datasets

---

## 🔐 Authentication Flow

1. User logs in → server generates JWT
2. Token stored in frontend (localStorage)
3. Token sent via `Authorization: Bearer <token>`
4. Backend verifies token for protected routes

---

## 🌐 API Endpoints (Examples)

```bash
GET    /v1/streamZY/search?query=
GET    /v1/subscriber/isSubscribed/:id
PATCH  /v1/subscriber/toggleSubcscribe/:id
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/streamzy.git
cd streamzy
```

---

### 2️⃣ Install Dependencies

Frontend:

```bash
cd frontend
npm install
```

Backend:

```bash
cd backend
npm install
```

---

### 3️⃣ Environment Variables

Create `.env` file in **backend/**:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

---

### 4️⃣ Run Locally

Frontend:

```bash
npm run dev
```

Backend:

```bash
npm run dev
```

---

## ☁️ Deployment

### Backend (Render)

* Deployed as a **Web Service**
* Uses environment variables for configuration
* Start command:

```bash
npm start
```

### Frontend

* Deployed on platforms like **Vercel / Netlify**

---

## ⚠️ Common Issues & Fixes

### ❌ Cannot GET /

* Root route not defined in backend
* Fix: Add a default route in Express

---

### ❌ Invalid Signature (JWT)

* Caused by mismatched `JWT_SECRET`
* Fix: Ensure same secret across environments and re-login

---

### ❌ Infinite Scroll Not Working

* Incorrect `hasMore` logic
* Improper component structure

---

## 📈 Future Enhancements

* 🎬 Video upload functionality
* ❤️ Like & comment system
* 🤖 Recommendation engine
* 📊 Analytics dashboard

---

## 🙌 About the Project

StreamZY is built as a **production-oriented full-stack project**, focusing on:

* Scalable backend architecture
* Clean and maintainable frontend
* Real-world feature implementation
* Performance optimization techniques

It demonstrates strong understanding of **full-stack development, API design, and user experience engineering**.

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!

---
