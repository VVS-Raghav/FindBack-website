# 🔍 Lost & Found Portal

A full-stack web application that enables students to post, view, and claim lost or found items within an institution. Claims are automatically approved based on logic, and verified users can securely communicate to recover lost items.

---

## 📸 Demo

![Lost & Found Demo](https://your-demo-link-or-gif.com) <!-- Optional: Replace or remove -->

---

## 🚀 Features

- 🔐 Student registration & login with JWT authentication  
- 📤 Post lost or found items (with images)  
- 🔎 View all items and filter by type (lost / found)  
- 🧾 Claim items with optional proof (receipt/photo)  
- ⚖️ Auto-approve logic:  
  - If only 1 claim in 30 days → auto-approved  
  - If proof is provided → auto-approved  
- ☎️ Poster phone is shown only to approved claimant  
- 🛡️ Fully protected API routes with middleware  
- 📁 File upload support (Multer)

---

## 🧰 Tech Stack

| Frontend              | Backend                | Database |
|----------------------|------------------------|----------|
| React (CRA)          | Node.js + Express.js   | MongoDB  |
| React Router         | JWT for auth           | Mongoose |
| Material UI (MUI)    | Multer for file upload |          |
| Formik + Yup         |                        |          |

---

## 📂 Project Structure

```
.
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
└── frontend/
    ├── components/
    ├── pages/
    └── App.js
```

---

## 🧪 Local Setup

### ✅ Prerequisites
- Node.js & npm
- MongoDB
- Git

### 🔧 Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # Add your MONGO_URI and JWT_SECRET
npm run dev
```

### 💻 Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🔐 Auto-Approval Logic (Claim System)

| Condition                                  | Auto Approved? |
|-------------------------------------------|----------------|
| Proof provided (receipt/image)            | ✅ Yes         |
| Only 1 claim made within 30 days          | ✅ Yes         |
| No proof + multiple claims                | ❌ No          |

If claim is approved:  
- The claimant gets access to the poster’s phone number.

---

## ✨ Screenshots

> _You can insert screenshots of the homepage, post item form, and claim interface here for visual appeal._

---

## 🙋‍♂️ Author

> **Venkata Sai Raghavendra Velicheti**  
> 🔗 [LinkedIn](https://www.linkedin.com/in/your-profile)  
> 🏅 Reliance Foundation Scholar | ICPC Regionalist | Full-Stack Developer  

---

## 📜 License

This project is licensed under the MIT License. Feel free to fork and improve!