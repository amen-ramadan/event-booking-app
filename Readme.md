# 🎉 Event Booking App

A full-stack web application that allows users to **browse, book, and manage events**.  
Built with **Node.js + GraphQL** on the backend and **React + TypeScript** on the frontend.  

---

## 📑 Table of Contents
- [Introduction](#-introduction)
- [Overview](#-overview)
- [Backend](#-backend)
- [Frontend](#-frontend)
- [Features](#-features)
- [Usage](#-usage)
- [Installation](#-installation)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Introduction
**Event Booking App** is a full-stack application that allows users to **book events** and manage their bookings.  
It provides a platform for:
- **Users** → to browse and book events.  
- **Organizers** → to create and manage events.  

---

## 🗂️ Overview
- **Backend** → Node.js + GraphQL API with authentication, event & booking management, and real-time updates (WebSockets).  
- **Frontend** → React + TypeScript for a modern, responsive user interface.  

---

## 🛠️ Backend
### Overview
The backend API is built with **Node.js** and **GraphQL**.  

### Features
- 🔐 **User Authentication & Authorization**  
- 🎫 **Event Creation & Management** (create, update, delete)  
- 📅 **Booking Creation & Management**  
- ⚡ **Real-time Updates** (via WebSockets)  

### API
The backend API is documented via the GraphQL schema:  
👉 [`https://server-event-booking-app-production.up.railway.app/graphql`](https://server-event-booking-app-production.up.railway.app/graphql)

---

## 💻 Frontend
### Overview
The frontend is built with **React + TypeScript**.  

### Features
- 🔐 User Authentication & Authorization  
- 🎉 Event Listing & Filtering  
- 🎫 Booking Creation & Management  
- ⚡ Real-time Updates (via WebSockets)  

### Deployment
Hosted on Netlify:  
👉 [`https://event-booking-app.netlify.app`](https://event-booking-app.netlify.app)

---

## ✨ Features
- 🔐 User Authentication and Authorization  
- 🎉 Event Creation and Management  
- 🎫 Booking Creation and Management  
- ⚡ Real-time Updates  
- 🔍 Filtering and Sorting of Events  
- ✅ Booking Confirmation and Cancellation  

---

## 📖 Usage
### 📝 Register
1. Go to the frontend and click **Register**.  
2. Fill out the form and submit.  
3. Verify your email via the link sent.  

### 🔑 Login
1. Go to the frontend and click **Log In**.  
2. Enter your email and password.  

### 🎉 Browsing Events
1. Navigate to the **Events** tab.  
2. Browse the available events.  
3. Apply filters (category, location, date).  

### 🎫 Booking an Event
1. Select an event from the list.  
2. Click **Book**.  

---

## ⚙️ Installation
### Prerequisites
- Node.js **v14+**  
- npm **v6+** or yarn **v1+**

### Steps
1. Clone the repository:
   ```bash
   git clone <repo-url>

2. Install dependencies:
npm install
# or
yarn install

3. Start the Backend API:
cd server
npm start

4. Start the Frontend:
cd client
npm start


API Documentation

The backend GraphQL API is available here:
👉 https://server-event-booking-app-production.up.railway.app/graphql

🤝 Contributing

Fork the repository

Create a new branch

Make changes and commit them

Open a pull request

📜 License

This project is licensed under the MIT License.