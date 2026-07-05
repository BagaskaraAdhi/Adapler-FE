import React, { useEffect } from "react";
import {
  RiCalendarScheduleLine,
  RiFileTextLine,
  RiRobot2Line,
  RiBookOpenLine,
  RiAlarmWarningLine,
  RiBarChartBoxLine,
  RiGraduationCapLine,
  RiUploadCloud2Line,
  RiMoonLine,
  RiSunLine,
} from "@remixicon/react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
// 1. Import useTheme dari file context-mu
import { useTheme } from "./Component/ThemeContext";

const features = [
  {
    title: "AI Study Planner",
    desc: "Susun jadwal belajar otomatis berdasarkan deadline, prioritas mata kuliah, dan waktu luangmu.",
    icon: RiCalendarScheduleLine,
  },
  {
    title: "Smart Material Summary",
    desc: "Ringkas file PDF, DOCX, maupun PPT menjadi poin-poin penting hanya dalam hitungan detik.",
    icon: RiFileTextLine,
  },
  {
    title: "AI Tutor",
    desc: "Tanyakan materi apa pun dan dapatkan penjelasan yang mudah dipahami layaknya belajar bersama tutor.",
    icon: RiRobot2Line,
  },
  {
    title: "Quiz Generator",
    desc: "Ubah materi belajar menjadi soal latihan pilihan ganda maupun essay secara otomatis.",
    icon: RiBookOpenLine,
  },
  {
    title: "Assignment Reminder",
    desc: "Jangan lewatkan deadline tugas dengan sistem pengingat yang terintegrasi.",
    icon: RiAlarmWarningLine,
  },
  {
    title: "Learning Analytics",
    desc: "Pantau perkembangan belajar melalui dashboard statistik yang interaktif.",
    icon: RiBarChartBoxLine,
  },
];

const howItWorks = [
  {
    title: "Upload Materi",
    desc: "Upload file PDF, Word, ataupun PowerPoint sebagai materi pembelajaran.",
    icon: RiUploadCloud2Line,
  },
  {
    title: "AI Memproses",
    desc: "AI akan membaca, memahami, dan menghasilkan ringkasan, latihan soal, maupun penjelasan materi.",
    icon: RiRobot2Line,
  },
  {
    title: "Belajar Lebih Pintar",
    desc: "Gunakan jadwal belajar, AI Tutor, dan quiz otomatis untuk meningkatkan hasil belajarmu.",
    icon: RiGraduationCapLine,
  },
];

const testimonials = [
  {
    name: "Andi Pratama",
    role: "Mahasiswa Informatika",
    comment:
      "Adapler AI membuat waktu belajar saya jauh lebih teratur dan efisien.",
  },
  {
    name: "Siti Rahma",
    role: "Mahasiswa Kedokteran",
    comment:
      "Fitur ringkasan materi sangat membantu ketika harus belajar banyak modul sekaligus.",
  },
  {
    name: "Budi Santoso",
    role: "Pelajar SMA",
    comment:
      "AI Tutor membantu saya memahami materi Matematika lebih cepat dibanding sebelumnya.",
  },
];

function LandingPage() {
  // 2. Ambil state global dari ThemeContext
  const { isDarkMode, setIsDarkMode } = useTheme();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <div className="font-sans bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 overflow-hidden transition-colors duration-300">
      {/* ================= NAVBAR ================= */}
      <nav
        className="navbar bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm sticky top-0 z-50 px-6 lg:px-12 border-b border-blue-50 dark:border-gray-800 transition-colors duration-300"
        data-aos="fade-down"
        data-aos-duration="500"
      >
        <div className="navbar-start">
          <a className="text-3xl font-black text-blue-600 dark:text-blue-400 italic cursor-pointer tracking-tight">
            Adapler<span className="text-gray-800 dark:text-white">AI</span>
          </a>
        </div>

        <div className="navbar-center hidden lg:flex gap-8">
          <a
            className="link link-hover text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-300 font-medium"
            href="#Features"
          >
            Features
          </a>
          <a
            className="link link-hover text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-300 font-medium"
            href="#About"
          >
            About
          </a>
          <a
            className="link link-hover text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-300 font-medium"
            href="#Faq"
          >
            FAQ
          </a>
        </div>

        <div className="navbar-end flex gap-2 lg:gap-3 items-center">
          {/* 3. Gunakan setIsDarkMode dari context untuk mengubah tema secara global */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="btn btn-circle btn-ghost text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mr-1 lg:mr-2"
            title={isDarkMode ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
          >
            {isDarkMode ? (
              <RiSunLine size={22} className="text-orange-400" />
            ) : (
              <RiMoonLine size={22} className="text-blue-600" />
            )}
          </button>

          <Link
            to="/login"
            className="btn btn-ghost btn-sm px-4 lg:px-6 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="btn bg-orange-500 hover:bg-orange-600 text-white border-none btn-sm px-4 lg:px-6 shadow-md shadow-orange-500/30"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Hero, About, Features, dll tetap sama, pastikan semua class dark: ditambahkan seperti contoh di bawah ini */}

      {/* ================= HERO ================= */}
      <section className="hero min-h-[90vh] bg-gradient-to-b from-blue-50 via-white to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-900 transition-colors duration-300">
        <div className="hero-content flex-col text-center">
          <div
            className="badge bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-none badge-lg mb-5 px-4 py-3 font-semibold transition-colors"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            🚀 Solusi Belajar Berbasis AI
          </div>

          <h1
            className="text-5xl lg:text-7xl font-black max-w-5xl leading-tight text-gray-900 dark:text-white transition-colors"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            Tingkatkan{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300">
              Produktivitas Belajar
            </span>{" "}
            Bersama Adapler
          </h1>

          <p
            className="max-w-3xl text-lg text-gray-600 dark:text-gray-300 mt-8 leading-8 transition-colors"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            Adapler membantu pelajar dan mahasiswa mengatur jadwal, merangkum
            materi, membuat latihan soal, hingga memberikan tutor AI yang siap
            membantu belajar kapan saja dan di mana saja.
          </p>

          <div
            className="mt-10 flex flex-wrap justify-center gap-5"
            data-aos="fade-up"
            data-aos-delay="800"
          >
            <Link
              to="/register"
              className="btn bg-orange-500 hover:bg-orange-600 text-white border-none btn-lg px-10 shadow-lg shadow-orange-500/40"
            >
              Mulai Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section
        id="About"
        className="py-24 bg-blue-50/50 dark:bg-gray-800/50 transition-colors duration-300"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h2
              className="text-5xl font-bold text-gray-900 dark:text-white transition-colors"
              data-aos="fade-up"
            >
              Apa itu{" "}
              <span className="text-blue-600 dark:text-blue-400">Adapler?</span>
            </h2>
            <p
              className="mt-8 text-lg max-w-4xl mx-auto text-gray-600 dark:text-gray-300 leading-8 transition-colors"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Adapler merupakan platform pembelajaran modern yang memanfaatkan
              Artificial Intelligence untuk membantu pengguna belajar secara
              lebih efektif. Platform ini dirancang khusus bagi mahasiswa,
              pelajar, maupun siapa saja yang ingin meningkatkan produktivitas
              belajar melalui teknologi AI.
            </p>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-24 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <h2
            className="text-center text-5xl font-bold mb-4 text-gray-900 dark:text-white transition-colors"
            data-aos="fade-up"
          >
            Cara Kerja Adapler
          </h2>
          <p
            className="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-3xl mx-auto transition-colors"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Hanya dalam tiga langkah sederhana kamu sudah bisa belajar lebih
            efektif dengan bantuan Artificial Intelligence.
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            {howItWorks.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="card bg-white dark:bg-gray-800 shadow-lg shadow-blue-900/5 hover:shadow-xl transition-all duration-300 group border border-blue-50 dark:border-gray-700"
                  data-aos="zoom-in-up"
                  data-aos-delay={index * 200}
                >
                  <div className="card-body text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-20 h-20 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center transition-colors">
                        <Icon
                          size={42}
                          className="text-orange-500 dark:text-orange-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                        />
                      </div>
                    </div>
                    <h3 className="font-bold text-2xl text-gray-800 dark:text-white transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-7 transition-colors">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= AI PREVIEW ================= */}
      <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6">
          <h2
            className="text-center text-5xl font-bold mb-16 text-gray-900 dark:text-white transition-colors"
            data-aos="fade-up"
          >
            Preview AI Assistant
          </h2>
          <div
            className="mockup-browser border border-blue-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl shadow-blue-900/10 dark:shadow-none transition-colors"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="mockup-browser-toolbar bg-gray-50 dark:bg-gray-800 border-b border-blue-50 dark:border-gray-700 transition-colors">
              <div className="input text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 transition-colors">
                https://smart-adapler.projectbase.my.id/chat
              </div>
            </div>
            <div className="bg-blue-50/30 dark:bg-gray-800/50 p-8 space-y-5 transition-colors">
              <div
                className="chat chat-start"
                data-aos="fade-right"
                data-aos-delay="400"
              >
                <div className="chat-bubble bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm transition-colors">
                  Halo 👋 Ada materi yang ingin kamu pelajari hari ini?
                </div>
              </div>
              <div
                className="chat chat-end"
                data-aos="fade-left"
                data-aos-delay="800"
              >
                <div className="chat-bubble bg-blue-600 dark:bg-blue-600 text-white shadow-md">
                  Tolong jelaskan Binary Search Tree dengan bahasa sederhana.
                </div>
              </div>
              <div
                className="chat chat-start"
                data-aos="fade-right"
                data-aos-delay="1200"
              >
                <div className="chat-bubble bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm transition-colors">
                  Binary Search Tree adalah struktur data pohon yang setiap node
                  kirinya lebih kecil dan node kanannya lebih besar dari parent
                  sehingga pencarian data menjadi lebih cepat.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE ================= */}
      <section className="py-24 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div data-aos="fade-right">
              <h2 className="text-5xl font-bold mb-8 text-gray-900 dark:text-white transition-colors">
                Mengapa Memilih Adapler?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-8 mb-8 transition-colors">
                Adapler bukan hanya chatbot biasa. Platform ini dirancang
                sebagai partner belajar yang mampu membantu seluruh aktivitas
                akademikmu.
              </p>
              <div className="space-y-5 text-gray-800 dark:text-gray-200 font-medium transition-colors">
                {[
                  "Jadwal belajar otomatis",
                  "Ringkasan materi berbasis AI",
                  "AI Tutor interaktif",
                  "Quiz Generator",
                  "Reminder deadline tugas",
                  "Dashboard perkembangan belajar",
                ].map((text, i) => (
                  <div
                    key={i}
                    data-aos="fade-right"
                    data-aos-delay={i * 100}
                    className="flex items-center gap-3"
                  >
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400 text-sm transition-colors">
                      ✓
                    </span>
                    {text}
                  </div>
                ))}
              </div>
            </div>

            <div
              className="stats stats-vertical shadow-xl shadow-blue-900/5 bg-white dark:bg-gray-800 border border-blue-50 dark:border-gray-700 transition-colors duration-300"
              data-aos="fade-left"
              data-aos-delay="300"
            >
              <div className="stat">
                <div className="stat-title text-gray-500 dark:text-gray-400 transition-colors">
                  Akurasi AI
                </div>
                <div className="stat-value text-blue-600 dark:text-blue-400 transition-colors">
                  95%
                </div>
              </div>
              <div className="stat">
                <div className="stat-title text-gray-500 dark:text-gray-400 transition-colors">
                  Kepuasan Pengguna
                </div>
                <div className="stat-value text-orange-500 dark:text-orange-400 transition-colors">
                  4.9★
                </div>
              </div>
              <div className="stat">
                <div className="stat-title text-gray-500 dark:text-gray-400 transition-colors">
                  Respon AI
                </div>
                <div className="stat-value text-gray-800 dark:text-white transition-colors">
                  &lt; 3 detik
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIAL ================= */}
      <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <h2
            className="text-center text-5xl font-bold mb-16 text-gray-900 dark:text-white transition-colors"
            data-aos="fade-up"
          >
            Apa Kata Pengguna?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((item, index) => (
              <div
                key={index}
                className="card bg-blue-50/50 dark:bg-gray-800/50 border border-blue-100 dark:border-gray-700 shadow-sm transition-colors duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 200}
              >
                <div className="card-body">
                  <div className="rating rating-sm mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <input
                        key={star}
                        type="radio"
                        className="mask mask-star-2 bg-orange-400"
                        checked
                        readOnly
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 italic transition-colors">
                    "{item.comment}"
                  </p>
                  <div className="mt-4">
                    <h4 className="font-bold text-gray-900 dark:text-white transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section
        id="Faq"
        className="py-24 bg-blue-50/50 dark:bg-gray-800/50 transition-colors duration-300"
      >
        <div className="max-w-4xl mx-auto px-6">
          <h2
            className="text-center text-5xl font-bold mb-16 text-gray-900 dark:text-white transition-colors"
            data-aos="fade-up"
          >
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div
              className="collapse collapse-arrow bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 shadow-sm transition-colors duration-300"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <input type="radio" name="faq" />
              <div className="collapse-title font-semibold text-gray-800 dark:text-white transition-colors">
                Apakah Adapler gratis?
              </div>
              <div className="collapse-content text-gray-600 dark:text-gray-300 transition-colors">
                Ya. Tersedia versi gratis dengan fitur dasar dan versi premium
                untuk fitur yang lebih lengkap.
              </div>
            </div>
            <div
              className="collapse collapse-arrow bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 shadow-sm transition-colors duration-300"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <input type="radio" name="faq" />
              <div className="collapse-title font-semibold text-gray-800 dark:text-white transition-colors">
                Apakah bisa upload PDF?
              </div>
              <div className="collapse-content text-gray-600 dark:text-gray-300 transition-colors">
                Bisa. Adapler mendukung PDF, DOCX, PPT, dan TXT.
              </div>
            </div>
            <div
              className="collapse collapse-arrow bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 shadow-sm transition-colors duration-300"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <input type="radio" name="faq" />
              <div className="collapse-title font-semibold text-gray-800 dark:text-white transition-colors">
                Apakah AI bisa menjawab semua mata pelajaran?
              </div>
              <div className="collapse-content text-gray-600 dark:text-gray-300 transition-colors">
                Adapler AI dirancang untuk membantu berbagai bidang studi, mulai
                dari Matematika hingga Pemrograman.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6">
          <div
            className="hero rounded-3xl bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-900 dark:to-blue-700 text-white shadow-2xl shadow-blue-900/20 dark:shadow-none transition-colors duration-300"
            data-aos="zoom-in"
            data-aos-duration="1000"
          >
            <div className="hero-content text-center py-20">
              <div>
                <h2 className="text-5xl font-bold">
                  Siap Belajar Lebih Pintar?
                </h2>
                <p className="py-8 max-w-2xl text-blue-100 dark:text-gray-200 transition-colors">
                  Bergabunglah bersama ribuan mahasiswa dan pelajar yang telah
                  meningkatkan produktivitas belajar menggunakan Adapler.
                </p>
                <Link
                  to="/register"
                  className="btn bg-orange-500 hover:bg-orange-600 text-white border-none btn-lg shadow-lg shadow-orange-500/40"
                >
                  Mulai Sekarang
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer footer-center p-12 bg-blue-950 text-blue-100">
        <aside>
          <h2 className="text-3xl font-black italic tracking-tight">
            Adapler<span className="text-orange-500">AI</span>
          </h2>
          <p>Smart Learning Platform powered by Artificial Intelligence.</p>
          <p className="opacity-60">© 2026 Adapler. All Rights Reserved.</p>
        </aside>
      </footer>
    </div>
  );
}

export default LandingPage;
