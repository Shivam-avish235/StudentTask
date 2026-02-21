# 🎓 Student Task Management System

A full-stack **MERN application** that allows students to **register, log in, and manage their daily tasks** through a secure, authenticated dashboard.

---

## 🚀 Features

### 🔐 User Authentication
- Secure registration & login
- **JWT (JSON Web Tokens)** for authentication
- **bcryptjs** for password hashing

### 🛡️ Protected Routes
- Dashboard accessible **only to authenticated users**
- JWT-based route protection

### ✅ Task Management (CRUD)
- View all personal tasks
- Create new tasks
- Update task status (mark as complete / edit title)
- Delete tasks

### 🔒 Security
- Password hashing with bcrypt
- JWT authentication middleware
- Ownership checks (users can only modify their own tasks)
- Backend CORS configured to allow only frontend URL  
  (`http://localhost:5173`)

---

## 🛠️ Tech Stack

### Backend
- **Node.js & Express** – REST API
- **MongoDB & Mongoose** – Database & ODM
- **JWT** – Authentication
- **bcryptjs** – Password encryption
- **CORS** – Secure cross-origin access

### Frontend
- **React (Vite)** – UI & build tool
- **Axios** – API requests with JWT interceptor
- **React Router DOM** – Client-side routing
- **Tailwind CSS** – Responsive & modern UI

---
## Screenshots
  ![LoginPage](https://github.com/Shivam-avish235/StudentTask/blob/main/image1%20(1).png)
  ![Registration](https://github.com/Shivam-avish235/StudentTask/blob/main/image2.png)
  ![Dashboard](https://github.com/Shivam-avish235/StudentTask/blob/main/image3.png)
  

##  Setup
### Backend Setup
    ``` Bash 
        cd Backend

    ```Bash
        npm install
### Start the server
      ```Bash
          npm run dev

### Frontend Setup
    ``` Bash 
        cd Frontend/StudentTask

    ```Bash
        npm install
### Start the server
      ```Bash
          npm run dev
### POSTMAN API
  ![POSTMAN](  https://vermamavish12035-295181.postman.co/workspace/Shivam-verma's-Workspace~9aaacb11-0593-4836-894e-ff87d5f3b7b2/request/52580802-ddc720a5-bcc9-437c-9c9d-7d9c35b7591b?action=share&creator=52580802&ctx=documentation)

