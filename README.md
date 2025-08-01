# 🔍 Lost & Found Portal

A full-stack web application that enables students to post, view, and claim lost or found items within an institution. Claims are automatically approved based on logic, and verified users can securely communicate to recover lost items.

---

## 🚀 Features

- 🔐 Student registration & login with JWT authentication  
- 📤 Post lost or found items (with images, Cloudinary integrated)  
- 🔎 View all items and filter by type (lost / found)  
- 🧾 Claim items with optional proof (receipt/photo)  
- ⚖️ Auto-approve logic:  
  - If only 1 claim in 30 days → auto-approved  
  - If proof is provided → manual approval required  
- ☎️ Poster phone is shown only to approved claimant  
- 🛡️ Fully protected API routes with middleware  
- 📁 File upload support (Multer + Cloudinary)

---

## 🧰 Tech Stack

| Frontend              | Backend                | Database | Image Storage |
|-----------------------|------------------------|----------|---------------|
| React (CRA)           | Node.js + Express.js   | MongoDB  | Cloudinary    |
| React Router          | JWT for auth           | Mongoose | Multer        |
| Material UI (MUI)     | Multer for file upload |          |               |
| Formik + Yup          |                        |          |               |

---

## 📂 Project Structure

``` 
.
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
└── frontend/
    ├── api/
    ├── public/
    └── src/
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
- Cloudinary account & credentials

### 🔧 Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # Add your MONGO_URI, JWT_SECRET, Cloudinary credentials
npm run dev
```

### 💻 Frontend Setup

```bash
cd frontend
npm install
npm start
```

Make sure your frontend `.env` has:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

---

## ☁️ Cloudinary Integration Notes

- Images are uploaded to Cloudinary via backend Multer middleware configured with Cloudinary storage adapter.  
- URLs from Cloudinary are stored in MongoDB and served from Cloudinary CDN.  
- Keep Cloudinary credentials secure in `.env`.

---

## 🔐 Auto-Approval Logic (Claim System)

| Condition                        | Approved  |
|---------------------------------|-----------|
| Proof provided (receipt/image)  | ✅ Yes    |
| Only 1 claim made within 30 days | ✅ Yes    |
| No proof + multiple claims       | ❌ No     |

If claim is approved:  
- Claimant gets access to poster’s phone number.

---

## 🙋‍♂️ Author

> **Venkata Sai Raghavendra Velicheti**

---

## 📜 License

This project is licensed under the MIT License. Feel free to fork and improve!