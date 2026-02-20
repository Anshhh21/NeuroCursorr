NeuroCursor

NeuroCursor is a real-time gesture-based computer control system that allows users to move the cursor, click, and pause interaction using hand gestures captured through a webcam.

The system combines a Python-based gesture engine with a modern Next.js dashboard interface, communicating locally via WebSockets.



Overview

NeuroCursor consists of two main components:
	1.	A local Python engine responsible for:
	•	Real-time hand tracking using MediaPipe
	•	Cursor control using PyAutoGUI
	•	Gesture detection and click logic
	•	WebSocket communication
	2.	A Next.js web interface that:
	•	Displays engine status
	•	Allows starting and stopping the engine
	•	Provides a clean user dashboard

The engine runs locally because it requires camera access and system-level cursor control.



Features
	•	Real-time cursor movement using index finger tracking
	•	Pinch gesture (thumb + index) for mouse click
	•	Open palm gesture for pause and resume
	•	Smooth cursor interpolation
	•	Web-based control dashboard
	•	Local WebSocket communication between UI and engine


Tech Stack

Frontend
	•	Next.js
	•	TypeScript
	•	Tailwind CSS

Backend / Engine
	•	Python
	•	OpenCV
	•	MediaPipe
	•	PyAutoGUI
	•	WebSockets
  
Project Structure
neurocursor/
│
├── engine/        # Python gesture engine
│   ├── engine.py
│   └── requirements.txt
│
├── web/           # Next.js frontend
│   ├── src/
│   └── package.json
│
└── README.md

Installation

1. Clone the repository

git clone https://github.com/your-username/neurocursor.git
cd neurocursor

Running the Python Engine

Navigate to the engine directory:

cd engine

Create a virtual environment (recommended):

Mac/Linux:

python3 -m venv .venv
source .venv/bin/activate

Windows:

python -m venv .venv
.venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Start the engine:

python engine.py

The engine runs locally on:

ws://localhost:8000

Running the Web Dashboard

Open a new terminal and navigate to the web folder:

cd web
npm install
npm run dev

Then open:

http://localhost:3000

Why the Engine Runs Locally

This application cannot be fully deployed to a cloud server because:
	•	Browsers do not allow remote control of system cursors
	•	System-level mouse movement requires OS permissions
	•	Camera access and cursor control must run on the user’s machine

The web dashboard is deployable, but the gesture engine must run locally.



Roadmap
	•	Improved gesture stability
	•	Scroll gesture support
	•	Multi-display support
	•	Desktop application packaging (Electron)
	•	One-click installer

