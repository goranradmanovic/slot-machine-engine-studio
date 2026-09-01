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

### 🤖 AI Configuration Assistant

* AI-generated slot configurations
* Natural-language configuration requests
* AI configuration validation
* Configuration error and warning detection
* Configuration diff generation
* Human-in-the-loop configuration review
* Apply or reject AI-generated changes
* Save approved configurations through the existing CRUD workflow

The project includes an **AI-powered Slot Configuration Assistant** that helps users generate slot-game configurations from natural-language requirements.

Instead of manually creating every configuration property, the user can describe the configuration they need and the AI generates a proposed configuration that can then be **reviewed, validated, applied and saved** through the configuration management workflow.

The AI is designed as an assistant rather than an automatic configuration publisher. Generated configurations must pass through the application's validation and review process before they can be applied.

### AI Configuration Workflow

The AI configuration workflow follows a controlled generation and review process:

```text
User Requirement
       │
       ▼
AI Configuration Request
       │
       ▼
AI Generates Configuration
       │
       ▼
Configuration Validation
       │
       ▼
Generate Configuration Diff
       │
       ▼
User Reviews Changes
       │
       ├───────────────┐
       │               │
     Reject          Apply
                       │
                       ▼
                Save Configuration
                       │
                       ▼
                Configuration File
```

### AI Capabilities

The AI assistant can:

* Generate slot-game configuration JSON from user requirements
* Work with the application's existing `SlotMachineConfig` structure
* Generate configuration values according to the requested game requirements
* Validate generated configuration data
* Identify configuration errors and warnings
* Compare generated configuration against the existing configuration
* Generate a human-readable configuration diff
* Allow the user to review generated changes before applying them
* Apply approved configuration changes
* Save the approved configuration through the existing configuration management workflow

### Configuration Review

AI-generated configurations are **not automatically applied**.

Before a configuration can be saved, the generated result is compared against the current configuration.

The application generates a structured configuration diff containing the properties that would be changed.

For example:

```text
AI Generated Configuration
          │
          ▼
┌──────────────────────────────┐
│ Configuration Diff           │
├──────────────────────────────┤
│ REEL_COUNT       5 → 6       │
│ SYMBOL_SIZE    150 → 180     │
│ BET             10 → 20      │
│ HAS_FREE_SPINS  false → true │
└──────────────────────────────┘
          │
          ▼
     User Review
          │
      ┌───┴───┐
      │       │
    Reject   Apply
```

This provides a clear separation between **AI generation** and **configuration deployment**.

### Configuration Validation

Generated configurations are passed through the application's configuration validation layer before they can be safely used.

Validation can identify:

* Invalid numeric values
* Invalid configuration properties
* Missing or incompatible values
* Configuration errors
* Configuration warnings

The validation result distinguishes between:

```text
Validation Result
       │
       ├── Errors
       │     └── Configuration cannot be applied
       │
       └── Warnings
             └── Configuration may require user review
```

This ensures that the AI assistant works together with the application's existing configuration validation rather than bypassing it.

### Configuration Diff

The application includes a dedicated configuration-diff mechanism for comparing two `SlotMachineConfig` objects.

The generated diff provides structured information about configuration changes, including the affected property and a human-readable description.

Special configuration values can also receive contextual labels. For example, `WINLINES` changes can be represented by the number of paylines rather than displaying only raw JSON data.

This makes AI-generated changes easier for developers and configuration managers to understand before applying them.

### Human-in-the-Loop Design

The AI assistant follows a **human-in-the-loop** approach.

```text
AI
 │
 │ Generate
 ▼
Configuration
 │
 │ Validate
 ▼
Validation
 │
 │ Diff
 ▼
Changes
 │
 │ Review
 ▼
User
 │
 ├── Reject
 │
 └── Apply
       │
       ▼
   Save Config
```

The user remains responsible for approving the generated configuration.

This approach reduces the risk of blindly applying AI-generated configuration changes while still significantly reducing the amount of manual configuration work.

### AI Integration Architecture

The AI assistant is integrated into the existing backend architecture.

```text
┌───────────────────────────────────────────┐
│              Vue Dashboard                │
│                                           │
│  AI Configuration Assistant               │
│  Configuration Review                     │
│  Validation Results                       │
│  Configuration Diff                       │
└──────────────────┬────────────────────────┘
                   │
                   │ REST API
                   ▼
┌───────────────────────────────────────────┐
│          Node.js / Express Backend        │
│                                           │
│  AI Service                               │
│  Configuration Validation                 │
│  Configuration Diff                       │
│  Authorization                            │
│  Configuration CRUD                       │
└──────────────────┬────────────────────────┘
                   │
                   ▼
             Configuration
                 Files
```

The AI service is separated from the configuration-management logic, allowing AI generation, validation and persistence to remain independent responsibilities.

### AI Technology

The AI integration uses an OpenAI-compatible client configured to communicate with the selected AI provider and model.

The AI service is responsible for:

* Sending configuration requirements to the AI model
* Receiving generated configuration data
* Processing the generated response
* Passing the result to the configuration validation layer
* Returning the generated configuration to the application for review

The AI layer does not directly bypass the application's authorization, validation or configuration-management workflow.

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
basic
  │
  ▼
manager
  │
  ▼
admin
```

### Permission Levels

#### Tier 1 — Simulation / Runner

```text
basic
```

Provides access to the simulation functionality and allows users to work with existing configurations.

Typical capabilities include:

* Access simulation interface
* Run simulations
* Apply existing configurations

---

#### Tier 2 — Configuration Editor

```text
manager
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
admin
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

### 👥 User Management (Admin)

Administrators have complete control over user accounts across the system. In addition to managing configurations and application settings, they can perform full **CRUD** operations on every other user account through a dedicated administration interface.

#### Administrator User Operations

The user management panel allows administrators to:

* Create new user accounts
* View all registered users
* Edit user information
* Change user roles and permissions
* Reset user passwords
* Delete user accounts
* Search and filter users
* Manage account status

#### User Lifecycle

The administration workflow follows a standard **CRUD** lifecycle.

```text
Create User
  │
  ▼
View User
  │
  ▼
Update User
  │
  ▼
Delete User

```

#### Available Actions

| **Action** | **Description** |
|------------|-----------------|
| **Create** | Register a new user with an initial role. |
| **Read** | View all users and their account information. |
| **Update** | Modify profile details, permissions, and account settings. |
| **Delete** | Permanently remove a user account from the system. |
| **Role Management** | Assign `basic`, `manager`, or `admin` roles. |
| **Password Reset** | Reset passwords for user accounts when required. |

#### Security Rules

User management is protected by backend authorization checks to ensure only administrators can perform these operations.

* Only users with the admin role can access user management endpoints.
* Role changes take effect immediately.
* Permission updates invalidate affected sessions when required.
* Every protected endpoint is verified on the server, preventing unauthorized access through direct **API** calls.

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
basic
  │
  ▼
manager
  │
  ▼
admin
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

### AI Features
![AI Prompt](./screenshots/27.png "AI Prompt")
![AI Confirm](./screenshots/28.png "AI Confirm")
![AI Changes](./screenshots/29.png "AI Changes")
![AI Changes](./screenshots/30.png "AI Changes")

### User Permissions

![Admin](./screenshots/20.png "Admin Permission")
![Manager](./screenshots/21.png "Manager Permission")
![Basic](./screenshots/22.png "Bassic Permission")

### User Management

![User Management Table](./screenshots/23.png "Admin User Management")
![Create User Dialog](./screenshots/24.png "Create User")
![Edit User Dialog](./screenshots/25.png "Edit User")
![Delete User Dialog](./screenshots/26.png "Delete User")

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

* AI-assisted configuration generation
* Human-in-the-loop AI workflows
* Automated configuration validation
* Configuration change comparison
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