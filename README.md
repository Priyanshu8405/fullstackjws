# React JWT Authentication & Protected Dashboard System 🛡️

A modern, full-featured React authentication application demonstrating **JWT generation**, **token storage (`localStorage`)**, **token expiration handling**, **role-based authorization**, and **protected route guarding**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.0-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg)

---

## 🌟 Key Concepts & Features

- 🔑 **Username & Password Authentication**: Controlled form inputs with password visibility toggle and validation.
- ⚡ **Simulated JWT Token Generation**: Constructs a structured JWT (`Header.Payload.Signature`) containing user attributes (`userId`, `username`, `role`, `iat`, `exp`).
- 💾 **Token Storage (`localStorage`)**: Persists the JWT token across browser refreshes and automatically hydrates session state on load.
- 👑 **Role-Based Access Control**: Supports multiple roles (`Admin`, `Editor`, `User`) embedded directly inside the JWT payload.
- 🔒 **Protected Dashboard UI**: Guards confidential views with `ProtectedRoute`. Only logged-in users with a valid, non-expired token can view the dashboard.
- 🔬 **Interactive JWT Inspector**: Color-coded visualization splitting the token into Header (Red), Payload (Purple), and Signature (Blue) with decoded JSON view.
- ⏱️ **Session Expiration Timer**: Live expiration countdown timer with automatic session invalidation upon token expiry.
- ⚡ **Quick Demo Presets**: One-click demo account switcher (`Admin`, `Editor`, `User`).

---

## 📁 Project Structure

```
jws/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx        # Protected Dashboard & JWT Inspector
│   │   ├── LoginForm.jsx        # Login Form & Quick Presets
│   │   ├── Navbar.jsx           # Top Header with User Info & Role Badge
│   │   └── ProtectedRoute.jsx   # Auth Guard Wrapper Component
│   ├── context/
│   │   └── AuthContext.jsx      # React Context for State & localStorage Sync
│   ├── utils/
│   │   └── jwt.js               # JWT Encoding, Decoding & Expiration Helpers
│   ├── App.jsx                  # Main App Entry Component
│   ├── App.css                  # Dark Glassmorphism Styling
│   └── main.jsx                 # Application Mounting
├── index.html
├── package.json
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) (v9+)

### Installation & Run

```bash
# 1. Clone the repository
git clone <your-repository-url>
cd jws

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The application will launch at `http://localhost:5173`.

---

## 🧪 Demo Credentials

You can test the application using the quick preset buttons on the login page or enter custom credentials:

| Username | Password | Assigned Role | Access Level |
| :--- | :--- | :--- | :--- |
| `admin_alex` | `admin123` | **Admin** | Full Access (Overview, JWT Inspector, Admin Panel, Content Studio) |
| `editor_sarah` | `editor123` | **Editor** | Medium Access (Overview, JWT Inspector, Content Studio) |
| `user_john` | `user123` | **User** | Standard Access (Overview, JWT Inspector) |

---

## 🔐 How JWT Authentication Works in This App

1. **User Login**: User submits username, password, and selects a role.
2. **JWT Creation**: `generateToken(userId, username, role)` builds:
   - **Header**: `{ "alg": "HS256", "typ": "JWT" }`
   - **Payload**: `{ "userId": "usr_948201", "username": "admin_alex", "role": "Admin", "iat": 1727500000, "exp": 1727503600 }`
   - **Signature**: HMAC SHA-256 hash representation.
3. **Storage**: Saved in `localStorage` under `jwt_auth_system_token`.
4. **Hydration & Guard**: On refresh, `AuthContext` retrieves the token, checks `exp`, and unlocks `ProtectedRoute`.

---

## 🛠️ Built With

- **React** - UI Component Library
- **Vite** - Lightning-fast Build Tool
- **Lucide React** - Modern Icons
