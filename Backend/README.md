# 🔒 SecureScan - Backend

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript\&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js\&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?logo=express\&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql\&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

A backend service that scans domains for phishing and malware, using APIs like **VirusTotal** and **URLScan**, and provides a secure platform for both users and admins to analyze threats.

---

## 📂 Project Structure

```bash
|-- src
|   |-- controllers
|   |   |-- auth
|   |   |   `-- Auth.Controller.ts
|   |   |-- scanning
|   |   |   `-- Scanning.Controller.ts
|   |   `-- users
|   |       |-- Admin.Controller.ts
|   |       `-- User.Controller.ts
|   |-- database
|   |   |-- Database.ts
|   |   `-- models
|   |       |-- ApiResponse.Model.ts
|   |       |-- Report.Model.ts
|   |       |-- ReportedWebsite.Model.ts
|   |       |-- Scan.Model.ts
|   |       `-- User.Model.ts
|   |-- index.ts
|   |-- middlewares
|   |   |-- Admin.Middleware.ts
|   |   |-- Auth.Middleware.ts
|   |   |-- Error.Middleware.ts
|   |   |-- Morgan.Middleware.ts
|   |   `-- User.Middleware.ts
|   |-- routes
|   |   |-- Index.Routes.ts
|   |   |-- admin
|   |   |   `-- Admin.Routes.ts
|   |   |-- auth
|   |   |   `-- Auth.Routes.ts
|   |   |-- browserExtension
|   |   |   `-- BrowserExtension.Routes.ts
|   |   |-- user
|   |   |   `-- User.Routes.ts
|   |   `-- web
|   |       `-- Web.Routes.ts
|   |-- services
|   |   |-- CRUD
|   |   |   |-- ApiResponse.CRUD.service.ts
|   |   |   |-- Report.CRUD.Service.ts
|   |   |   |-- ReportedWebsite.CRUD.Service.ts
|   |   |   |-- Scan.CRUD.Service.ts
|   |   |   `-- User.CRUD.Service.ts
|   |   |-- auth
|   |   |   `-- Auth.Service.ts
|   |   |-- scanning
|   |   |   |-- Scanning.Service.ts
|   |   |   `-- externalAPIs
|   |   |       |-- URLScan.Service.ts
|   |   |       `-- Virustotal.Service.ts
|   |   |-- score
|   |   |   `-- Score.Service.ts
|   |   `-- users
|   |       |-- Admin.Services.ts
|   |       |-- BaseUser.Service.ts
|   |       `-- User.Service.ts
|   |-- types
|   |   |-- Axios.Types.ts
|   |   |-- General.Types.ts
|   |   |-- Types.ts
|   |   |-- User.Types.ts
|   |   |-- express
|   |   |   `-- index.d.ts
|   |   `-- externalAPIs
|   |       |-- URLScan.Types.ts
|   |       `-- Virustotal.Types.ts
|   `-- utils
|       |-- ErrorHandler.ts
|       |-- General.Utils.ts
|       |-- ResponseHelper.ts
|       |-- Sleep.Types.ts
|       `-- logger
|           |-- Logger.config.ts
|           `-- Logger.ts
|-- README.md
|-- jest.config.js
|-- logs
|-- nodemon.json
|-- package-lock.json
|-- package.json
`-- tsconfig.json
```

---

## 🛠️ Tech Stack

* **Language**: TypeScript
* **Backend**: Node.js, Express
* **Database**: PostgreSQL
* **External APIs**: [VirusTotal](https://www.virustotal.com/), [URLScan](https://urlscan.io/)

---

## 🚀 Getting Started

### 1. Clone the repo (if have not already)

```bash
git clone https://github.com/tabishraza302/SecureScan.git
```

### 2. Install dependencies

```bash
cd SecureScan/Backend
npm install
```

### 3. Create `.env` file

Copy the example:

```bash
cp .env.example .env
```

Fill in your environment variables:

```env
VIRUS_TOTAL_KEY=VIRUSTOTAL_KEY
URLSCANIO_KEY=URLSCAN_KEY

JWT_SECRET="this_is_my_secret"

NODE_ENV=development
ORIGIN = "*"
```

### 4. Run the project in development mode

```bash
npm run dev
```

---

## 📮 API Endpoints

### 🔐 Auth

* `POST /auth/login`
* `POST /auth/register`

### 👤 User

* `GET  /user/dashboard`
* `POST /user/scan/:domain` — Perform scanning
* `GET  /user/reports/:id` — Get report by ID
* `GET  /user/reported-website` — Get list of reported websites

### 🛡️ Admin

* `GET    /admin/dashboard`
* `GET    /admin/users` — Get all users
* `DELETE /admin/user/:id` — Delete user by ID
* `GET    /admin/reports/:id` — Get report details
* `GET    /admin/scanned-websites` — List of all scanned websites
* `GET    /admin/reported-website` — List of all reported phishing/malicious sites
* `GET    /admin/website-report/:id` — Detailed report for a specific website

### 🧩 Browser Extension

* `POST /browser-extension/scan/:domain` — Scan domain via browser extension

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🙋‍♂️ Author

* **Name**: Tabish Raza
* **LinkedIn**: [@tabish302](https://www.linkedin.com/in/tabishraza302/)
* **GitHub**: [@tabish302](https://github.com/tabishraza302)