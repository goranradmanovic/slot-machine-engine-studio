Technical Test: Hot-Reloadable Config Tool for PixiJS Slot Game

Estimated Effort

5-6 hours

We value thoughtful, well-structured work over rushed prototypes. Please focus on building a clear, functional, and maintainable solution—even if it means skipping extras or polish.

1. Objective

Build a developer-facing tool that enables hot-reloading of different versions of a slot machine configuration in a PixiJS-based game. This tool will consist of:

A VueJS frontend that embeds the game and triggers config changes

A Node.js + Socket.IO backend that serves versioned JSON configs

A modified PixiJS game that loads and applies configurations dynamically at runtime

This simulates a real-world scenario where QA or developers need to test different reel setups quickly without restarting the game.

2. Provided

A small PixiJS-based slot game project

Instructions to run the game locally: npm install, npm start

3. What You'll Build

3.1. Modify the Game (PixiJS)

Extract the existing hardcoded slot machine configuration (see SlotMachineConfig.ts) into a separate JSON file.

Implement logic to load this JSON config at runtime.

Establish a Socket.IO connection to the backend to receive updated config data.

Add hot-reload functionality to apply new configurations live, without reloading the page.

Send a status response via postMessage back to the parent (Vue) app.

3.2. Build the VueJS Tool

Create a basic VueJS interface that:

Embeds the game using an iframe

Lists available config versions (fetched from backend)

Sends the selected config version to the game via postMessage

Displays a status message based on the game’s response (e.g., success/failure)

3.3. Create the Backend (Node.js + Socket.IO)

Serve at least two versions of a JSON slot configuration (e.g., reels_v1.json, reels_v2.json)

Listen for config requests from the game via Socket.IO and respond with the appropriate config

3.4. Communication Flow

VueJS tool sends selected config version to the game via postMessage

Game connects to backend via Socket.IO and requests the versioned config

Backend responds with the requested JSON config

Game applies the new config and responds back to the VueJS tool via postMessage

VueJS tool updates UI with success/error feedback

4. Completion Criteria

Game is refactored to load slot configuration from a JSON file

Vue tool enables switching between at least two config versions

Socket.IO is used for backend communication (both game and frontend)

Config changes are hot-applied in-game without page reload

The Vue frontend displays success or failure messages from the game

5. Bonus Points

Add JSON Schema validation for config structure

Handle and report config errors gracefully

Add a simple inline JSON editor in the frontend

Use a clean, modular architecture

6. Submission Instructions

Do NOT upload your solution to a public GitHub repository

Package your local git repo as a local ZIP archive

Include:

/vue-frontend – VueJS tool

/backend – Node.js + Socket.IO server

/game – Modified PixiJS slot game

Include a README.md with:

Setup instructions for each component

Overview of how your solution works

Any assumptions or limitations