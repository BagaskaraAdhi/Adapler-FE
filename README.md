# 🚀 Adapler AI - Smart Learning Platform

Adapler AI adalah platform pembelajaran modern berbasis kecerdasan buatan (Artificial Intelligence) yang dirancang khusus untuk membantu mahasiswa dan pelajar meningkatkan produktivitas, mengatur manajemen waktu, serta memahami materi akademik secara lebih efektif dan efisien.

---

## 🛠️ Tech Stack

Aplikasi ini dibangun menggunakan arsitektur modern yang memisahkan Frontend dan Backend secara terpisah (Decoupled Architecture Architecture) guna memastikan performa tinggi dan skalabilitas:

### Frontend

- **Core Framework:** React.js (Vite)
- **Styling & UI Components:** Tailwind CSS & DaisyUI
- **Icons:** Remix Icon
- **Animation:** AOS (Animate On Scroll)
- **Routing:** React Router Dom

### Backend & Database

- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database:** MySQL / PostgreSQL
- **Authentication:** JSON Web Token (JWT)
- **AI Integration:** Gemini API / OpenAI API wrapper (via `generateChatWithAI`, `generateQuizWithAI`, `generateChatWithAI`)

---

## ✨ Fitur Utama

1. **🤖 AI Study Planner**
   Menyusun dan meng-generate jadwal belajar harian secara otomatis berdasarkan prioritas tugas dan deadline yang mendesak, lengkap dengan estimasi total waktu belajar yang dibutuhkan.
2. **📝 Smart Material Summary**
   Mengunggah dan meringkas dokumen akademik (PDF, DOCX, PPTX) menjadi poin-poin penting dan kata kunci utama hanya dalam hitungan detik menggunakan ekstraksi bertenaga AI.
3. **💬 AI Tutor Assistant**
   Fitur chat interaktif 24/7 yang berfungsi sebagai tutor pribadi untuk menjawab pertanyaan sulit atau menjelaskan konsep akademik yang kompleks dengan bahasa yang sederhana.
4. **🧠 Quiz Generator & Analytics**
   Mengubah materi yang telah diunggah menjadi latihan soal pilihan ganda otomatis, lengkap dengan rincian skor akhir, total jawaban benar, serta pembahasan komprehensif untuk setiap soal.
5. **🌓 Global Theme System**
   Sistem perpindahan mode gelap (Dark Mode) dan terang (Light Mode) yang terintegrasi secara global menggunakan React Context API demi kenyamanan visual pengguna.

---

## 📋 Prasyarat (Prerequisites)

Sebelum memulai instalasi di lingkungan lokal, pastikan perangkat kamu sudah terpasang perkakas berikut:

- [Node.js](https://nodejs.org/) (Versi direkomendasikan: v18.x atau lebih baru)
- [NPM](https://www.npmjs.com/) (Biasanya otomatis terpasang bersama Node.js) atau [Yarn](https://classic.yarnpkg.com/)
- [Git](https://git-scm.com/)
- Akses internet (untuk instalasi dependensi dan komunikasi API)

---

## 🚀 Instalasi & Konfigurasi Lokal

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek ini di perangkat lokal kamu:

### 1. Kloning Repositori

Buka terminal atau command prompt, lalu jalankan perintah berikut:

```bash
git clone [https://github.com/BagaskaraAdhi/Adapler-FE.git](https://github.com/BagaskaraAdhi/Adapler-FE.git)
cd Adapler-FE
```
