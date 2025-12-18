# Netlist V² - Validator & Visualizer

## Overview
This application runs validation & simple visualizations on netlist files. Netlist files are used to describe connectivity in an electric circuit. The application accepts `*.json` files, runs validation on the server, and stores validated netlists to the DB. Valid netlist can be visualized in SVG format demontrating the core components and connections of the netlists.  

![Netlist Visualizer](./screenshots/visualization.png)

## Features
- ✓ Upload JSON netlist files
- ✓ Visualize as graph (nodes=components, edges=nets)
- ✓ Highlight GND connections
- ✓ Validate against rules (see below)
- ✓ Store in MongoDB per-user
- ✓ Displays users netlists in sidebar

## Architecture
- Frontend: React + TypeScript + Tailwind
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Visualization: SVG with custom graph layout

## Setup Instructions

### Prerequisites
- Docker & Docker Compose installed
- Ports 5173 (frontend), 3000 (backend), and 27017 (MongoDB) available

### Running the Application
1. Extract the project zip file
2. Navigate to the project directory:
   ```bash
   cd netlist-visualizer
   ```
3. Start the application with Docker Compose:
   ```bash
   docker-compose up --build
   ```

4. Access the application at [http://localhost:5173](http://localhost:5173)

## Users
To simplify user management & authentication for Demo purposes, 3 users are automatically generated in the database on a fresh project start.  The users are loaded into the front end when the app builds and you may toggle users via a select element in the top right.

## Runtime
The application runs on Node.js 20 (LTS) and is fully containerized via Docker.

## Validation Rules
- Names cannot be blank (enforced by schema)
- GND net must exist
- Components requiring GND: microcontroller, IC, LED, connector
- Valid component/pin references

## Test Files
See `/test-netlists/` directory

