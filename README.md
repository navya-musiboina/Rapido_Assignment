# Rapido Ride-Sharing Application

Rapido is a full-stack ride-sharing platform designed to deliver fast, affordable, and reliable transportation services. This repository contains both the frontend (React) and backend (Node.js/Express) codebases.

  ---
## Project Overview

Rapido enables users to register, book rides, view ride details, and manage their profiles. Administrators can log in, view analytics, and manage rides. The application uses RESTful APIs for communication between the frontend and backend, and MongoDB for data storage.

---



## How to Run the Project

### Prerequisites

- Node.js (v16+ recommended)
- npm (v8+ recommended)
- MongoDB (local or cloud instance)

### Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables in `.env` (refer to `.env.example` if available).
4. Start the backend server:
   ```sh
   npm run dev
   ```
   The backend will run at [http://localhost:5000](http://localhost:5000).

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend development server:
   ```sh
   npm start
   ```
   The frontend will run at [http://localhost:3000](http://localhost:3000).

---

## API Endpoints

### Authentication

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — User login
- `GET /api/auth/user` — Get authenticated user info

### Ride Management

- `POST /api/rides/create` — Create a new ride
- `GET /api/rides/:id` — Get ride details
- `POST /api/rides/cancel` — Cancel a ride
- `GET /api/rides/user` — Get user's rides

### Admin

- `POST /api/admin/login` — Admin login
- `GET /api/admin/all-rides` — Get all rides (admin only)
- `GET /api/admin/analytics` — Get ride analytics

---

## Technology Stack

**Frontend:**
- React
- React Router
- Axios
- React Toastify
- Chart.js / Recharts

**Backend:**
- Node.js
- Express
- MongoDB & Mongoose
- JWT (Authentication)
- Swagger (API Documentation)

**Testing:**
- Jest
- React Testing Library

**Other Tools:**
- dotenv (Environment Variables)
- bcryptjs (Password Hashing)
- nodemon (Development)

---
screenshots:
<img width="1816" height="871" alt="image" src="https://github.com/user-attachments/assets/1ccd6c57-3d6c-490b-8006-1ebf49cbaad3" />


<img width="623" height="724" alt="image" src="https://github.com/user-attachments/assets/cc396214-66ce-4ec7-a1fc-12892f8ec5b0" />
<img width="468" height="541" alt="image" src="https://github.com/user-attachments/assets/8b4b6597-fa23-461a-9f3b-5009f533c54c" />
<img width="1864" height="749" alt="image" src="https://github.com/user-attachments/assets/48cae82c-6be3-4c7c-9f5a-685153d66aae" />

<img width="1882" height="780" alt="image" src="https://github.com/user-attachments/assets/6a276fc0-dda2-4edc-8aca-1856be08c6d8" />
<img width="1191" height="645" alt="image" src="https://github.com/user-attachments/assets/1a787dfd-939d-4e53-96fe-a3286e524032" />

<img width="1061" height="475" alt="image" src="https://github.com/user-attachments/assets/3601962c-15ce-4a24-bf55-42f809184560" />



<img width="1886" height="687" alt="image" src="https://github.com/user-attachments/assets/e29c1d2c-9538-42a7-a9a9-dd48a1b693ae" />
<img width="1139" height="684" alt="image" src="https://github.com/user-attachments/assets/07d24bb0-7e08-40ac-b997-bd8b5c2c043f" />
<img width="576" height="565" alt="image" src="https://github.com/user-attachments/assets/da2ab93c-e873-4210-845b-a3cb8f65d67a" />
<img width="1914" height="820" alt="image" src="https://github.com/user-attachments/assets/07670b8e-d6d5-4f71-aeb0-b974f23601f4" />
<img width="1905" height="863" alt="image" src="https://github.com/user-attachments/assets/e7823e50-cc0e-416e-ad10-77f539a8713c" />

<img width="890" height="656" alt="image" src="https://github.com/user-attachments/assets/02f8b576-3e64-4e38-9ce6-c7bc4942d978" />

<img width="1908" height="580" alt="image" src="https://github.com/user-attachments/assets/13b3fe40-9412-4592-89d5-e1689a8563a1" />

<img width="869" height="578" alt="image" src="https://github.com/user-attachments/assets/5ea6f46c-7e7a-41ad-9f12-9f94ce0c901c" />

<img width="1078" height="518" alt="image" src="https://github.com/user-attachments/assets/387a566e-bac8-40b0-aeb0-0e9eb28fb652" />

<img width="939" height="737" alt="image" src="https://github.com/user-attachments/assets/8b3e56b4-5ec8-48a1-a6b0-ef044f95fc09" />
backend
<img width="1439" height="909" alt="image" src="https://github.com/user-attachments/assets/d73b9738-bd51-4ed6-b169-14ead3aa4803" />

## Contact

For support or inquiries, contact [support@rapido.com](mailto:support@rapido.com).

---

## Notes

- All screenshots above illustrate key features and workflows of the Rapido application.
- For more details, refer to the code documentation and comments within the repository.
