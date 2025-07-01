# ☁️ Cloud File Storage

A secure and simple cloud file storage system with folder support, versioning, and file sharing.

### 🚀 Features
- 📁 Create folders and nested subfolders
- 📤 Upload files into specific folders
- 📥 Download and 🗑️ delete files
- 🕒 File versioning for files with the same name in the same folder
- 🔗 Share files and revoke access as needed
- ⏱️ Generate signed URLs with time-limited public access
- 🛠️ Built with **Node.js**, **Express**, **MongoDB**, and **Cloudflare R2**

---

### ⚙️ Setup

Create a `.env` file in the root of the project with the following variables:

```env
CLOUDFLARE_R2_ACCESS_KEY=...
CLOUDFLARE_R2_SECRET_KEY=...
CLOUDFLARE_R2_BUCKET_NAME=...
CLOUDFLARE_R2_ENDPOINT=...
MONGO_URI=...
JWT_SECRET=...
PORT=...
```
Install the required dependencies
```bash
npm install
```
---

### ▶️ Start the App

```bash
npm start
```
