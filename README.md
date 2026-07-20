# GreenPeak Household Portal: Energy Efficiency Optimizer

An interactive full-stack dashboard for apartment tenants and building administrators to monitor, analyze, and optimize domestic energy consumption. This application aligns directly with **UN SDG Goal 7: Affordable and Clean Energy (Target 7.3)**, helping households double their rate of energy improvement.

The portal provides an intelligent analysis of utility bills and household appliance footprints, performs predictive smart-home savings modeling, and validates cybersecurity postures to isolate smart-home networks against vulnerabilities.

---

## 🚀 Architectural Blueprint

The platform uses a unified full-stack architecture running **React 19** with **Vite** on the frontend, and a **Node.js Express** server on the backend:

- **Frontend Core:** Single Page Application (SPA) built with functional React, styled using **Tailwind CSS**, with state management for session caching and data persistence.
- **Backend Core:** Express.js serving as a secure proxy to the **Google Gemini API** (`gemini-3.5-flash` model), protecting API keys from exposure to the browser.
- **Fail-Safe Fallback:** Incorporates a robust local statistical intelligence module that computes realistic consumption modeling in real-time when external API connections or Gemini API keys are not configured.

---

## 🔒 Security & Privacy Controls

### 1. Household Access Control & Credentials
The portal forces authentication via dedicated household account units. Users are greeted with an initial login screen. Different access levels restrict access to specific features depending on the account role:

| Account Unit | Resident Name | Role | Default Passcode | Permitted Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Unit 402** | J. Doe | Tenant | `doe402` | Bill Entry, Appliance Tracker, BI Studio, AI Diagnostics |
| **Unit 105** | A. Smith | Tenant | `smith105` | Bill Entry, Appliance Tracker, BI Studio, AI Diagnostics |
| **Unit 310** | L. Chen | Tenant | `chen310` | Bill Entry, Appliance Tracker, BI Studio, AI Diagnostics |
| **Property Admin** | Sys Admin | Admin | `adminmaster` | Full Workspace + Secure Cybersecurity Console |

### 2. PII Prevention and Scrubbing
To safeguard resident privacy, the system actively discourages the submission of **Personally Identifiable Information (PII)**:
- **Privacy Warning Banner:** Displayed prominently in the Utility Bills manager, warning users against typing or uploading sensitive records (e.g., residential addresses, bank routing numbers, private passwords).
- **Interactive Privacy Filter:** An optional toggle to enable "Privacy Scrubbing", which strips and redacts sensitive simulated records prior to transmission to server-side AI engines.
- **Input Sanitization:** The Express server runs deep recursive sanitization on all submitted objects, stripping potential HTML/Script Injection vectors (`XSS` defenses).

---

## 🧑‍💻 Technical Specifications & Local Setup

### Workspace Prerequisites
- Node.js (v18 or higher)
- npm or Bun package manager

### Installation
Run the dependency installer from the root workspace directory:
```bash
npm install
```

### Running the Development Environment
Launches the concurrent Express server and Vite builder on the required reverse-proxy port (`3000`):
```bash
npm run dev
```
Open your browser and navigate to: `http://localhost:3000`

### Compiling for Production
Prepares compiled assets inside the `/dist` directory and bundles the Express server using `esbuild` into a self-contained CommonJS (`dist/server.cjs`) file:
```bash
npm run build
```

### Starting the Production Build
Runs the self-contained production server:
```bash
npm run start
```

---

## 🧪 Comprehensive Testing Guide

To verify code changes and validate portal security policies, follow the testing vectors below.

### 1. Access Control Verification
- **Test Objective:** Validate that unauthenticated users are blocked, and ordinary users cannot access admin consoles.
- **Step-by-step Actions:**
  1. Access the application URL in a clean/incognito browser tab.
  2. Verify that the **GreenPeak Household Portal** login page intercepts the request and hides the core application.
  3. Attempt to bypass by typing a garbage password. Verify that the error alert is triggered.
  4. Log in using `Unit 402` with passcode `doe402`. Verify that you are signed in as "J. Doe" and that the **Cybersecurity Console** is absent from the left-hand navigation.
  5. Sign out, and log back in as **Property Admin** using `adminmaster`. Verify that the **Cybersecurity Console** is now fully visible and interactive.

### 2. PII Defenses and Scrubbing Tests
- **Test Objective:** Ensure that the PII warning encourages safe usage and the scrubbing toggle functions.
- **Step-by-step Actions:**
  1. Click **Utility Bills** in the sidebar.
  2. Confirm the presence of the amber warning banner explicitly stating **"Privacy Directive: Discourage Posting Sensitive Information"**.
  3. Locate the **Privacy Scrubbing Filter** switch.
  4. Toggle the filter **OFF** and click **Generate AI Optimization Report**. Verify on the *Cybersecurity scorecard* section of the dashboard that your score drops due to unredacted details being exposed.
  5. Toggle the filter back **ON** and generate a new report. Verify that the score improves to **98/100**, and any address details are flagged as "Sanitized & Cleared".

### 3. API & Fallback Intelligence Verification
- **Test Objective:** Test behavior with and without a valid `GEMINI_API_KEY`.
- **Step-by-step Actions:**
  1. If no `GEMINI_API_KEY` is present in the environment configuration, click **Predictive Diagnostics** or **Interactive BI Studio**.
  2. Request a custom savings scenario.
  3. Confirm that the application loads the fallback engine and displays a notice stating: *"Loaded offline intelligence framework successfully."*
  4. If a live API key is supplied, confirm that the model generates dynamic, personalized JSON structure with custom Home Assistant automations matching your exact watts inputs.

---

## 🛠️ Debugging & Troubleshooting

### Common Hurdles and Remediation

#### 1. Linter Failures during Build
If `npm run lint` fails, it's usually due to type mismatches. Ensure you do not use `const enum` or generic `any` objects in places that require explicit typings. Run type checks locally:
```bash
npm run lint
```

#### 2. Port Address in Use (Port 3000)
The app is configured to use port `3000` to support nginx routing. If you see an `EADDRINUSE: address already in use :::3000` error:
- Terminate any dangling node processes:
  ```bash
  kill -9 $(lsof -t -i:3000)
  ```
- Re-run the development command.

#### 3. "Target Content Not Found" on surgical edits
When editing files incrementally, verify that the formatting matches the existing source file. Run a linter and clear local storage values using the browser console (`localStorage.clear()`) to resolve cached state desynchronization.
