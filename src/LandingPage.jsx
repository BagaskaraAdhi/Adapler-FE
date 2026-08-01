import React, { useEffect, useRef, useState } from "react";
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
  RiPencilLine,
  RiLightbulbFlashLine,
  RiFireLine,
} from "@remixicon/react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import logo from "./assets/logo.png";
import { useTheme } from "./Component/ThemeContext";
import CursorSparkle from "./Component/CursorSparkle";

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

// Kata yang berputar di headline Hero, memberi kesan dinamis tanpa berlebihan
const rotatingWords = ["Cerdas", "Efisien", "Fokus", "Konsisten"];

// Ikon dekoratif yang melayang di sekitar Hero — posisi, ikon, dan delay animasi
// masing-masing berbeda supaya gerakannya tidak terlihat seragam/kaku.
const floatingIcons = [
  {
    icon: RiBookOpenLine,
    position: "top-20 left-[6%]",
    delay: "0s",
    duration: "5.5s",
    depth: 14,
  },
  {
    icon: RiLightbulbFlashLine,
    position: "top-32 right-[8%]",
    delay: "0.8s",
    duration: "6.5s",
    depth: -18,
  },
  {
    icon: RiPencilLine,
    position: "bottom-24 left-[10%]",
    delay: "1.4s",
    duration: "5s",
    depth: -12,
  },
  {
    icon: RiGraduationCapLine,
    position: "bottom-16 right-[6%]",
    delay: "0.4s",
    duration: "6s",
    depth: 16,
  },
];

// Hook kecil untuk animasi "count up" pada angka statistik, jalan sekali
// ketika `trigger` menjadi true (dipicu oleh IntersectionObserver di section stats).
function useCountUp(end, trigger, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let frame;
    let startTime = null;

    const step = (timestamp) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setValue(progress * end);
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [trigger, end, duration]);

  return value;
}

function LandingPage() {
  // 2. Ambil state global dari ThemeContext
  const { isDarkMode, setIsDarkMode } = useTheme();

  // Progress bar scroll di bagian atas halaman
  const [scrollProgress, setScrollProgress] = useState(0);

  // Rotating word di headline Hero
  const [wordIndex, setWordIndex] = useState(0);

  // Parallax ringan untuk ikon melayang di Hero, mengikuti posisi mouse
  const heroRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Trigger count-up untuk section statistik
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const akurasi = useCountUp(95, statsVisible);
  const kepuasan = useCountUp(4.9, statsVisible);
  const responTime = useCountUp(3, statsVisible, 1000);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }, []);

  // Update progress bar tiap kali user scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ganti kata di headline setiap 2.2 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % rotatingWords.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // Nyalakan count-up saat section statistik masuk viewport
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleHeroMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  };

  return (
    <div className="font-sans bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 overflow-hidden transition-colors duration-300">
      {/* Efek sparkle yang mengikuti mouse di seluruh halaman */}
      <CursorSparkle />

      {/* Progress bar scroll, gaya "highlighter" menandai progres membaca halaman */}
      <div className="fixed top-0 left-0 w-full h-1 bg-blue-100/60 dark:bg-gray-800 z-[60]">
        <div
          className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-blue-500 transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Keyframe untuk animasi tambahan di halaman ini */}
      <style>{`
        @keyframes floaty {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(6deg); }
        }
        .floaty-el {
          animation: floaty 5s ease-in-out infinite;
        }
        @keyframes fadeSlideWord {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .word-rotate {
          display: inline-block;
          animation: fadeSlideWord 0.5s ease;
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.35); }
          50% { box-shadow: 0 0 0 10px rgba(249, 115, 22, 0); }
        }
        .streak-badge {
          animation: pulseGlow 2.6s ease-in-out infinite;
        }
        @keyframes shineSweep {
          0% { transform: translateX(-120%) skewX(-20deg); }
          100% { transform: translateX(220%) skewX(-20deg); }
        }
        .shine-sweep {
          animation: shineSweep 3.8s ease-in-out infinite;
        }
      `}</style>

      {/* ================= NAVBAR ================= */}
      <nav
        className="navbar bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm sticky top-0 z-50 px-6 lg:px-12 border-b border-blue-50 dark:border-gray-800 transition-colors duration-300"
        data-aos="fade-down"
        data-aos-duration="500"
      >
        <div className="navbar-start">
          <a className="flex items-center gap-2 cursor-pointer">
            <img
              src={logo}
              alt="Adapler AI Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-3xl font-black text-blue-600 dark:text-white italic tracking-tight">
              Adapler
              <span className="text-gray-800 dark:text-blue-400">AI</span>
            </span>
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
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        className="hero min-h-[90vh] relative bg-gradient-to-b from-blue-50 via-white to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-900 transition-colors duration-300"
      >
        {/* Ikon dekoratif melayang, mengikuti pergerakan mouse secara halus (parallax) */}
        {floatingIcons.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`absolute ${item.position} hidden lg:block pointer-events-none`}
              style={{
                transform: `translate(${mousePos.x * item.depth}px, ${
                  mousePos.y * item.depth
                }px)`,
                transition: "transform 0.25s ease-out",
              }}
            >
              <div
                className="floaty-el w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 shadow-lg shadow-blue-900/10 dark:shadow-none border border-blue-50 dark:border-gray-700 flex items-center justify-center"
                style={{
                  animationDelay: item.delay,
                  animationDuration: item.duration,
                }}
              >
                <Icon size={26} className="text-blue-500 dark:text-blue-400" />
              </div>
            </div>
          );
        })}

        <div className="hero-content flex-col text-center relative z-10">
          <div
            className="badge bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-none badge-lg mb-5 px-4 py-3 font-semibold transition-colors"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            Solusi Belajar Berbasis AI
          </div>

          <h1
            className="text-5xl lg:text-7xl font-black max-w-5xl leading-tight text-gray-900 dark:text-white transition-colors"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            Belajar Lebih{" "}
            <span
              key={wordIndex}
              className="word-rotate text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300"
            >
              {rotatingWords[wordIndex]}
            </span>
            <br />
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

          <div
            className="streak-badge mt-8 inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-orange-100 dark:border-gray-700 rounded-full px-5 py-2.5 shadow-md"
            data-aos="fade-up"
            data-aos-delay="1000"
          >
            <RiFireLine size={18} className="text-orange-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              12.500+ pelajar sedang belajar bareng Adapler minggu ini
            </span>
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

      {/* ================= FEATURES ================= */}
      <section
        id="Features"
        className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2
            className="text-center text-5xl font-bold mb-4 text-gray-900 dark:text-white transition-colors"
            data-aos="fade-up"
          >
            Semua yang Kamu Butuhkan untuk Belajar
          </h2>
          <p
            className="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-3xl mx-auto transition-colors"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Satu platform, enam cara berbeda untuk membuat waktu belajarmu lebih
            terarah.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((item, index) => {
              const Icon = item.icon;
              const isBlue = index % 2 === 0;
              return (
                <div
                  key={index}
                  className="group p-8 rounded-2xl border border-blue-50 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
                  data-aos="fade-up"
                  data-aos-delay={(index % 3) * 150}
                >
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 ${
                      isBlue
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : "bg-orange-50 dark:bg-orange-900/20"
                    }`}
                  >
                    <Icon
                      size={28}
                      className={
                        isBlue
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-orange-500 dark:text-orange-400"
                      }
                    />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-7 transition-colors">
                    {item.desc}
                  </p>
                </div>
              );
            })}
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
              ref={statsRef}
              className="stats stats-vertical shadow-xl shadow-blue-900/5 bg-white dark:bg-gray-800 border border-blue-50 dark:border-gray-700 transition-colors duration-300"
              data-aos="fade-left"
              data-aos-delay="300"
            >
              <div className="stat">
                <div className="stat-title text-gray-500 dark:text-gray-400 transition-colors">
                  Akurasi AI
                </div>
                <div className="stat-value text-blue-600 dark:text-blue-400 transition-colors">
                  {Math.round(akurasi)}%
                </div>
              </div>
              <div className="stat">
                <div className="stat-title text-gray-500 dark:text-gray-400 transition-colors">
                  Kepuasan Pengguna
                </div>
                <div className="stat-value text-orange-500 dark:text-orange-400 transition-colors">
                  {kepuasan.toFixed(1)}★
                </div>
              </div>
              <div className="stat">
                <div className="stat-title text-gray-500 dark:text-gray-400 transition-colors">
                  Respon AI
                </div>
                <div className="stat-value text-gray-800 dark:text-white transition-colors">
                  &lt; {Math.round(responTime)} detik
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
                className="card bg-blue-50/50 dark:bg-gray-800/50 border border-blue-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
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
            className="hero relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-900 dark:to-blue-700 text-white shadow-2xl shadow-blue-900/20 dark:shadow-none transition-colors duration-300"
            data-aos="zoom-in"
            data-aos-duration="1000"
          >
            {/* Efek sapuan cahaya halus, memberi kesan "hidup" pada CTA */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="shine-sweep absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            <div className="hero-content text-center py-20 relative z-10">
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
