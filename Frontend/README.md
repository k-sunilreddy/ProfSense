# 🎓 ProfSense: Real-Time Faculty Availability System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Available-success)](https://profsense-frontend.vercel.app/)

**ProfSense** is a full-stack, decoupled web application and IoT system designed to solve a common campus infrastructure problem: helping students and staff locate faculty members whose schedules change dynamically throughout the day. 

Originally developed as a final year project, the system is actively deployed on our college network, utilizing a web dashboard for remote status updates and an edge hardware device for live public display.

---

## 🚀 Features
* **Real-Time Status Tracking:** Faculty can update their current status (e.g., *Available, In a Meeting, Invigilation, On Leave*) via a secure dashboard.
* **Public Display Interface:** A read-only, auto-refreshing UI designed specifically for a digital display screen.
* **Hardware Integration:** A Raspberry Pi connected to a physical monitor outside the staff room fetches and displays the live data over the campus network.
* **Cloud-Native Architecture:** The public demo version utilizes a completely decoupled, cloud-hosted microservice architecture.

---

## 🛠️ Tech Stack & Architecture

### Frontend (User Interface)
* **Framework:** React.js (Vite)
* **Styling:** Tailwind CSS
* **Deployment:** Vercel

### Backend (REST API)
* **Language:** PHP 8.x
* **Architecture:** Custom RESTful API handling CORS, JSON serialization, and secure data routing.
* **Deployment:** Dockerized container hosted on Render.

### Database
* **System:** MySQL
* **Deployment:** Managed cloud database hosted on Aiven.

### Edge Hardware (Campus Deployment)
* **Device:** Raspberry Pi
* **Function:** Acts as a kiosk client on the local Wi-Fi network, rendering the frontend display UI to a physical monitor outside the faculty room.

---

## 🧠 System Workflow
1. A faculty member logs into the React dashboard and changes their status.
2. The Vercel frontend sends an asynchronous `POST` request to the Render PHP API.
3. The API validates the request and updates the MySQL database on Aiven.
4. The Raspberry Pi display (and any students checking the web link) instantly pulls the new state via a `GET` request and updates the UI.

---

## 💻 Local Setup & Development

If you wish to run this project locally:

**1. Clone the repository**
\`\`\`bash
git clone https://github.com/your-username/profsense-frontend.git
cd profsense-frontend
\`\`\`

**2. Install dependencies**
\`\`\`bash
npm install
\`\`\`

**3. Configure Environment Variables**
Create a `.env` file in the root directory and add your API endpoint:
\`\`\`env
VITE_API_URL=http://localhost:8000
\`\`\`

**4. Start the development server**
\`\`\`bash
npm run dev
\`\`\`