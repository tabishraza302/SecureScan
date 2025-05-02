# 🔒 SecureScan Suite — Real-Time Threat Detection Platform

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript\&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript\&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js\&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express\&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql\&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react\&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss\&logoColor=white)
![Sass](https://img.shields.io/badge/Sass-CC6699?logo=sass\&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite\&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

> **SecureScan** is a modern, privacy-first suite for real-time website threat analysis. It includes a **browser extension**, an interactive **web dashboard**, and a secure **backend API**. Powered by VirusTotal and URLScan, it detects malicious domains **before** they can do damage.

---

## 📁 Project Structure

```
SecureScan/
├── extension/     # Browser extension (React + Chrome APIs)
├── frontend/      # Web dashboard (React + TailwindCSS + Sass)
├── backend/       # Node.js + Express API server
├── screenshots/   # Demo images
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### 🧾 Prerequisites

* Node.js (v18 or higher)
* NPM or Yarn
* Chrome (for extension testing)
* VirusTotal & URLScan API Keys

---

### 🔁 1. Clone the Repository

```bash
git clone https://github.com/tabishraza302/SecureScan.git
cd SecureScan
```

---

## 🧩 Module Setup

### 🧱 A. Browser Extension

```bash
cd extension
npm install
npm run build
```

> ✅ Load the `dist/` folder as an **unpacked extension** in `chrome://extensions/`.

---

### 🌐 B. Frontend Web Dashboard

```bash
cd frontend
npm install
npm run dev
```

> 💡 Open [http://localhost:5173](http://localhost:5173) to view the dashboard.

---

### 🖥️ C. Backend API Server

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file inside the `backend/` folder:

```env
VIRUS_TOTAL_KEY=VIRUSTOTAL_KEY
URLSCANIO_KEY=URLSCAN_KEY

JWT_SECRET="this_is_my_secret"

NODE_ENV=development
ORIGIN = "*"
```

> ⚠️ Get your keys from [VirusTotal](https://www.virustotal.com/) and [URLScan.io](https://urlscan.io/).

---

## 📸 Screenshots

<p float="left">
  <img src="./screenshots/extension-warning.png" width="45%" alt="Threat Detected">
  &nbsp;
  <img src="./screenshots/extension-summary.png" width="45%" alt="Summary Overview">
</p>
<p float="left">
  <img src="./screenshots/website-scan.png" width="45%" alt="Home page website">
  &nbsp;
  <img src="./screenshots/website-summary1.png" width="45%" alt="Scan detail summary">
</p>
<p float="left">
  <img src="./screenshots/website-summary2.png" width="45%" alt="Scan detail antivirus result">
  &nbsp;
  <img src="./screenshots/website-summary3.png" width="45%" alt="Scan detail external links">
</p>
---

## ⚙️ How It Works

1. 🔗 User visits a website
2. 🧩 Extension extracts the domain and sends it to the backend
3. 📡 Backend queries VirusTotal and URLScan
4. 📊 Extension displays threat level, risk summary, and graphs

---

## 🛠️ Tech Stack

* **Languages**: TypeScript, JavaScript
* **Frontend**: React, TailwindCSS, Sass
* **Extension**: Chrome APIs (Manifest v3), Content & Background Scripts
* **Backend**: Node.js, Express.js
* **External APIs**: VirusTotal, URLScan
* **Build Tool**: Vite

---

## ✅ Key Features

* 🔍 Real-time malicious domain detection
* 📊 Graphical summaries and risk indicators
* 🔐 Secure API communication
* 🧩 Modular and scalable codebase
* 🌐 Lightweight and privacy-respecting browser extension

---

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](./LICENSE) for details.

---

## 👤 Author

**Tabish Raza**
🔗 [LinkedIn](https://www.linkedin.com/in/tabishraza302)
💻 [GitHub](https://github.com/tabishraza302)

---