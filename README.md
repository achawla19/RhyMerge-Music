# 🎵 RhyMerge

> Elevate your sound. Collaborate. Create. Conquer.

RhyMerge is a modern music collaboration platform where producers, vocalists, and musicians can connect, collaborate, and build projects together.

---

## 🚀 Features

### 🔐 Authentication

* Secure JWT-based authentication
* Refresh token system (cookie-based)
* Login / Signup flow
* Logout & session management

### 👤 User Profiles

* Dynamic user profiles
* Role-based identity (Producer, Singer, DJ, etc.)
* Bio & genre selection
* Real-time updates across app

### 🎛️ Projects

* Create & manage music projects
* Collaborator system
* Status tracking

### 🔎 Artist Discovery

* Smart search system (UI ready)
* Filter by:

  * Genre
  * Role
  * Tags

### 💬 Messaging (UI Ready)

* Chat UI built
* Real-time system coming next

### ⚙️ Settings System

* Account management
* Profile customization
* Notifications
* Security controls (password, logout, delete account)

---

## 🧱 Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Framer Motion
* Lucide Icons

### Backend

* Node.js
* Express.js
* MongoDB (Atlas)
* JWT Authentication

---

## 📁 Project Structure

```
RhyMerge/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── layouts/
│   │   └── api/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── config/
```

---

## ⚙️ Getting Started

### 1. Clone repo

```
git clone https://github.com/achawla19/RhyMerge-Music.git
cd RhyMerge-Music
```

---

### 2. Setup Backend

```
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

Run backend:

```
npm run dev
```

---

### 3. Setup Frontend

```
cd ../frontend
npm install
npm run dev
```

---

## 🔐 Security Note

Environment variables are NOT committed.
All secrets are stored securely using `.env`.

---

## 🚧 Current Status

🟡 In Development

✔ Auth system complete
✔ UI system complete
✔ Settings system complete
⏳ Backend search integration (next)
⏳ Messaging backend (coming soon)

---

## 🎯 Vision

To build a global platform where music creators can collaborate like a social network + DAW ecosystem.

---

## 🤝 Contributing

Contributions are welcome!

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub.

---
