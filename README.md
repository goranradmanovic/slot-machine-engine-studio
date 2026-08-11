# Slot Game Configuration Tool

A full-stack **Slot Game Configuration & Development Tool** designed for live editing, configuration management, authentication, permissions, and hot-reloading of slot game configurations.

The project provides a real-time development environment connecting a **Vue 3 management dashboard** with a **PixiJS slot game running inside an iframe**.

Configuration versions are managed from the dashboard, while the running game communicates with a **Node.js / Express backend through Socket.io** to retrieve and apply the requested configuration.

The project also includes user accounts, profile management, permission-based access control, configuration CRUD operations, and a frontend simulation interface for testing slot-game configurations.

---

# 🚀 Core Features

### 🎮 Slot Game Configuration

* Live JSON configuration editor
* Configuration version management
* Create, read, update and delete configuration files
* File-based JSON persistence
* Configuration validation
* Configuration selection and loading
* Configuration versioning

### ⚡ Live Hot-Reload

* Apply configuration changes without refreshing the browser
* Vue → PixiJS communication through `postMessage`
* PixiJS → Node.js communication through Socket.io
* Dynamic configuration loading
* Game reinitialization without losing the iframe/canvas environment

### 🔐 Authentication

The application includes a complete user authentication system.

* User registration
* User login
* Logout
* JWT-based authentication
* Access token / refresh token flow
* Protected application areas
* Authenticated user sessions

### 👤 User Profiles

Authenticated users have access to their own profile/dashboard.

Profile functionality includes:

* User profile information
* Profile management
* Account-related CRUD operations
* Permission-aware UI
* Protected resources

### 🛡️ Permission-Based Access Control

The application uses a simple three-tier permission system.

```text
simulation.run
      │
config.manage
      │
admin.all
```

### Permission Levels

#### Tier 1 — Simulation / Runner

```text
simulation.run
```

Provides access to the simulation functionality and allows users to work with existing configurations.

Typical capabilities include:

* Access simulation interface
* Run simulations
* Apply existing configurations

---

#### Tier 2 — Configuration Editor

```text
config.manage
```

Provides configuration-management capabilities.

Typical capabilities include:

* Create configurations
* Read configurations
* Update configurations
* Delete configurations
* Manage allowed configuration files

---

#### Tier 3 — Administrator

```text
admin.all
```

Provides full administrative access across the application.

Typical capabilities include:

* Full configuration access
* User management
* Permission management
* Application settings
* Administrative functionality

The permission system is designed so that application functionality can be protected independently of the frontend UI.

---

# 📊 Simulation

The project includes a **simulation interface directly inside the frontend dashboard**.

Simulation functionality is not implemented as a separate application or folder. It is integrated into the configuration-management workflow.

The purpose is to allow developers to test and evaluate a slot configuration from the same environment where the configuration is created and managed.

The simulation interface can be used to inspect game behaviour and statistical results before applying a configuration to the running game.

Typical simulation metrics include:

* Number of spins
* Wins / losses
* RTP
* Hit frequency
* Volatility
* Total bet
* Total payout
* Average win
* Maximum win

The simulation functionality is protected by the:

```text
simulation.run
```

permission.

---

# 🛠️ System Architecture

The application consists of three main runtimes:

```text
┌───────────────────────────────────────────┐
│            Vue 3 Dashboard                │
│                                           │
│  Authentication                           │
│  User Profile                             │
│  Permissions                              │
│  Configuration CRUD                       │
│  JSON Editor                              │
│  Simulation UI                            │
│                                           │
└──────────────────┬────────────────────────┘
                   │
                   │ postMessage()
                   │
                   │ Configuration Version
                   ▼
┌───────────────────────────────────────────┐
│        PixiJS Slot Game (iframe)          │
│                                           │
│  Receives configuration version           │
│  Requests configuration                   │
│  Receives JSON configuration              │
│  Applies configuration                    │
│                                           │
└──────────────────┬────────────────────────┘
                   │
                   │ Socket.io
                   │ version request
                   ▼
┌───────────────────────────────────────────┐
│        Node.js / Express Backend          │
│                                           │
│  Authentication                           │
│  Authorization                            │
│  Configuration CRUD                       │
│  Configuration persistence                │
│  JSON file management                     │
│  Socket.io server                         │
│                                           │
└──────────────────┬────────────────────────┘
                   │
                   │ Read JSON
                   ▼
            Configuration Files
```

---

# 🔄 Configuration Hot-Reload Flow

The hot-reload mechanism works through several steps.

## 1. User Selects Configuration

The authenticated user selects a configuration version from the Vue dashboard.

For example:

```text
v1
v2
v3
```

The dashboard determines which version should be loaded into the running game.

---

## 2. Vue Sends Configuration Version

The Vue application communicates with the PixiJS game through the iframe using the HTML5 `postMessage` API.

Example:

```javascript
window.postMessage(
    {
        type: 'LOAD_CONFIG',
        version: 'v1'
    },
    '*'
)
```

The dashboard sends the **version name**, rather than sending the complete JSON configuration.

---

## 3. PixiJS Receives the Version

The PixiJS game listens for the `message` event.

After receiving the requested version, it sends the version name to the Node.js backend through Socket.io.

```text
Vue Dashboard
      │
      │ postMessage()
      │
      │ version: "v1"
      ▼
PixiJS Game
```

---

## 4. PixiJS Requests the Configuration

The PixiJS game sends a Socket.io request to the backend.

Conceptually:

```text
request-config
{
    version: "v1"
}
```

The game does not need to know where the configuration file is stored.

It only needs to know which version it wants.

---

## 5. Node.js Finds the Configuration

The Node.js backend receives the requested version.

It uses that version to locate the corresponding JSON file in the configuration directory.

Example:

```text
configs/
├── v1.json
├── v2.json
└── v3.json
```

For:

```text
version = "v2"
```

the backend reads:

```text
configs/v2.json
```

---

## 6. Node.js Sends the Configuration

The backend sends the loaded JSON configuration back to the PixiJS game using Socket.io.

```text
Node.js
   │
   │ JSON configuration
   ▼
Socket.io
   │
   ▼
PixiJS Game
```

---

## 7. PixiJS Applies the Configuration

The PixiJS game receives the new configuration and applies it to the running game.

The game can reinitialize the required game elements without refreshing the browser page.

This creates the hot-reload workflow:

```text
Select Version
      ↓
postMessage
      ↓
PixiJS
      ↓
Socket.io
      ↓
Node.js
      ↓
Read JSON
      ↓
Socket.io
      ↓
PixiJS
      ↓
Apply Configuration
      ↓
Hot Reload
```

---

# 🧩 Application Components

## 1. Vue 3 Management Dashboard

The Vue application provides the main interface for users.

### Responsibilities

* Authentication UI
* User profile
* Permission-aware navigation
* Configuration management
* Configuration CRUD
* JSON editor
* Version selection
* Simulation interface
* PixiJS game preview
* `postMessage` communication

The dashboard acts as the central development environment.

---

## 2. PixiJS Slot Game

The PixiJS application represents the actual slot-game runtime.

It runs independently inside an iframe embedded in the dashboard.

### Responsibilities

* Render the slot game
* Listen for configuration version messages
* Request configurations through Socket.io
* Receive configuration JSON
* Apply configuration changes
* Reinitialize game elements

The PixiJS game is intentionally separated from the Vue application.

---

## 3. Node.js / Express Backend

The backend provides the API and WebSocket infrastructure.

### Responsibilities

* User authentication
* JWT token management
* Authorization
* Permission validation
* User management
* Configuration CRUD
* Configuration version management
* JSON file persistence
* JSON file reading
* JSON file writing
* Socket.io server
* Providing configurations to the PixiJS game

---

# 🔐 Authentication & Authorization

The application separates **authentication** from **authorization**.

### Authentication

Authentication determines:

> Who is the user?

The application uses JWT-based authentication to maintain authenticated sessions.

### Authorization

Authorization determines:

> What is the user allowed to do?

Permissions are checked before protected operations are performed.

The current permission model contains three levels:

```text
simulation.run
      │
      ▼
config.manage
      │
      ▼
admin.all
```

Higher-level permissions provide broader access to the system.

---

# 👤 User Dashboard

After authentication, users have access to a personal application dashboard.

The dashboard provides access to functionality according to the user's permissions.

For example:

```text
Authenticated User
        │
        ▼
┌─────────────────────┐
│     User Dashboard  │
├─────────────────────┤
│ Profile             │
│ Configurations      │
│ Simulation          │
│ Game Preview        │
│ Administration      │
└─────────────────────┘
```

Features that require additional permissions are protected accordingly.

---

# 🗂️ Configuration Storage

Configuration versions are stored as JSON files.

Example:

```text
configs/username/
│
├── v1.json
├── v2.json
├── v3.json
└── ...
```

Each JSON file represents a version of a slot-game configuration.

The backend is responsible for reading and writing these files.

The PixiJS game never needs direct filesystem access.

---

# 🔌 Communication Technologies

The project uses different communication mechanisms depending on the responsibility.

### REST API

Used primarily for application-level operations such as:

* Authentication
* User management
* Configuration CRUD
* Configuration management

### HTML5 `postMessage`

Used for communication between:

```text
Vue Dashboard
      ↕
PixiJS iframe
```

The main purpose is to tell the running game which configuration version should be loaded.

### Socket.io

Used for real-time communication between:

```text
PixiJS Game
      ↕
Node.js Server
```

The game requests a configuration version and the server responds with the corresponding JSON configuration.

---

# 🛡️ Security

Because the application uses authentication, permissions, iframe communication and WebSockets, security is an important part of the architecture.

## `postMessage` Origin Validation

Production deployments should validate the origin of incoming messages.

Example:

```javascript
if (event.origin !== 'http://localhost:5173') {
    return
}
```

Using:

```javascript
'*'
```

is acceptable for local development but should be replaced with a trusted origin in production.

---

## Permission Validation

Permissions should not only be used to hide UI elements.

Protected operations should also be validated on the backend.

For example:

```text
Frontend permission check
        +
Backend authorization check
```

This prevents users from bypassing frontend restrictions by directly calling API endpoints.

---

# 📦 Installation & Setup

## Requirements

* Node.js 18+
* npm
* Git

Clone the repository:

```bash
git clone https://github.com/goranradmanovic/slot-machine-engine-studio.git
```

Enter the project:

```bash
cd slot-machine-engine-studio
```

---

## 1. Backend Server

The backend handles authentication, configuration operations, file persistence and Socket.io communication.

```bash
cd backend
npm install
npm run dev
```

Default URL:

```text
http://localhost:3000
```

---

## 2. Frontend Dashboard

The frontend is the Vue 3 management dashboard.

```bash
cd frontend
npm install
npm run dev
```

Default URL:

```text
http://localhost:5173
```

---

## 3. PixiJS Game

The PixiJS game runs independently and is embedded into the dashboard through an iframe.

```bash
cd game
npm install
npm start
```

Default URL:

```text
http://localhost:9000
```

---

# 📸 Screenshots

Screenshots of the following areas can be added here:

### Login

![Sign In Form](./screenshots/11.png "Sign In Form")
![Sign Up Form](./screenshots/12.png "Sign Up Form")
![Forgot Password Form](./screenshots/13.png "Forgot Password Form")
![Reset Password Form](./screenshots/14.png "Reset Password Form")

### User Dashboard

![User popup](./screenshots/15.png "User popup")
![Account info](./screenshots/16.png "Account info")
![Account update](./screenshots/17.png "Account update")
![Account security](./screenshots/16.png "Account security")
![Account preferences](./screenshots/16.png "Account prefrences")

### Configuration Management

![CRUD Config Table](./screenshots/9.png "CRUD Config Table")
![CRUD Config Table Preview](./screenshots/10.png "CRUD Config Table Preview")

### JSON Configuration Editor

![Visual Editor Top](./screenshots/3.png "Visual Editor")
![Visual Editor Middle](./screenshots/4.png "Visual Editor")
![Visual Editor Bottom](./screenshots/5.png "Visual Editor")
![Raw JSON Editor](./screenshots/6.png "Raw JSON Editor")

### Simulation

![Simulator Dashboard Inactive](./screenshots/7.png "Simulator Dashboard Inactive")
![Simulator Dashboard Active](./screenshots/8.png "Simulator Dashboard Active")

### PixiJS Slot Game

![Game Slot Fruits](./screenshots/1.png "Game Slot Fruits")
![Game Slot Egyptians](./screenshots/2.png "Game Slot Egyptians Graphics")

---

# 🎯 Project Goals

The main goal of this project is to explore how a **slot-game development and configuration workflow** can be built using modern web technologies.

The project focuses on:

* Configuration-driven game development
* Live configuration editing
* Hot-reloading
* Version management
* User authentication
* Permission-based authorization
* Configuration CRUD
* Real-time communication
* Iframe-based game isolation
* Vue/PixiJS integration
* Modular full-stack architecture

The architecture keeps the **management tools, backend and game runtime separated**, while providing a communication layer between them.

---

# 🛣️ Future Improvements

Possible future improvements include:

* [ ] Advanced reel configuration
* [ ] Symbol management interface
* [ ] Paytable editor
* [ ] Configuration comparison
* [ ] Configuration rollback
* [ ] More advanced simulation analytics
* [ ] Simulation charts
* [ ] Multiple slot-game projects
* [ ] Cloud configuration storage
* [ ] Improved game preview
* [ ] Automated testing
* [ ] Improved PixiJS animations
* [ ] Performance optimizations
* [ ] Production deployment

---

# 🧑‍💻 Technology Stack

## Frontend

* Vue 3
* TypeScript
* PrimeVue
* Tailwind CSS
* JSON Editor

## Game Engine

* PixiJS
* TypeScript

## Backend

* Node.js
* Express
* TypeScript
* Socket.io

## Authentication

* JWT
* Access Tokens
* Refresh Tokens

## Communication

* REST API
* HTML5 `postMessage`
* WebSockets
* Socket.io

---

# 👨‍💻 About the Project

Slot Game Configuration Tool was created by **Goran Radmanovic** as a personal project exploring the architecture behind modern slot-game development tooling.

The project combines my experience in web development with an interest in **game-development tooling, configuration-driven systems, real-time applications and PixiJS game engines**.

### Main Development Areas

* Vue / Nuxt
* TypeScript
* JavaScript
* Node.js
* Express
* REST APIs
* JWT authentication
* Authorization / permissions
* WebSockets
* Socket.io
* PixiJS
* Full-stack application architecture

---

# 📬 Contact

**Goran Radmanovic**

Web Developer — Vue / Nuxt / JavaScript / TypeScript / Node / PHP

GitHub:

https://github.com/goranradmanovic/slot-machine-engine-studio

LinkedIn:

https://www.linkedin.com/in/goran-radmanovic-70814a9b/

Email:

goranradmanovic@gmail.com

Portfolio:

https://goranradmanovic.github.io/

---

# ⭐ Project

**Slot Game Configuration Tool**

A full-stack development environment for managing, editing and hot-reloading slot-game configurations between a Vue 3 management dashboard and a PixiJS game engine.