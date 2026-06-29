import React from "react";
import {
  RiCalendarScheduleLine,
  RiFileTextLine,
  RiRobot2Line,
  RiBookOpenLine,
  RiAlarmWarningLine,
  RiBarChartBoxLine,
  RiGraduationCapLine,
  RiUploadCloud2Line,
} from "@remixicon/react";
import { Link } from "react-router-dom";

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
  return (
    <div className="bg-base-100 text-base-content">
      {/* ================= NAVBAR ================= */}

      <nav className="navbar bg-base-100 shadow-sm sticky top-0 z-50 px-6 lg:px-12">
        <div className="flex-1">
          <a className="text-3xl font-black text-primary italic cursor-pointer">
            Adapler
            <span className="text-base-content">AI</span>
          </a>
        </div>
        <div className="hidden lg:flex gap-6 mr-6">
          <a className="link link-hover">Home</a>
          <a className="link link-hover">Features</a>
          <a className="link link-hover">About</a>
          <a className="link link-hover">FAQ</a>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-ghost btn-sm">
            <Link to="/login">Login</Link>
          </button>
          <button className="btn btn-primary btn-sm px-6">
            <Link to="/register">Register</Link>
          </button>
        </div>{" "}
      </nav>

      {/* ================= HERO ================= */}

      <section className="hero min-h-[90vh]">
        <div className="hero-content flex-col text-center">
          <div className="badge badge-primary badge-outline badge-lg mb-5">
            🚀 Solusi Belajar Berbasis AI
          </div>

          <h1 className="text-5xl lg:text-7xl font-black max-w-5xl leading-tight">
            Tingkatkan
            <span className="text-primary"> Produktivitas Belajar </span>
            Bersama Adapler
          </h1>

          <p className="max-w-3xl text-lg opacity-70 mt-8 leading-8">
            Adapler membantu pelajar dan mahasiswa mengatur jadwal, merangkum
            materi, membuat latihan soal, hingga memberikan tutor AI yang siap
            membantu belajar kapan saja dan di mana saja.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-5">
            <button className="btn btn-primary btn-lg px-10">
              Mulai Gratis
            </button>

            <button className="btn btn-outline btn-lg">
              Pelajari Lebih Lanjut
            </button>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}

      {/* <section className="py-10 px-5">
        <div className="stats shadow w-full max-w-6xl mx-auto stats-vertical lg:stats-horizontal">
          <div className="stat place-items-center">
            <div className="stat-title">Pengguna Aktif</div>

            <div className="stat-value text-primary">12K+</div>

            <div className="stat-desc">Pelajar & Mahasiswa</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Materi Dirangkum</div>

            <div className="stat-value text-secondary">50K+</div>

            <div className="stat-desc">Dokumen diproses AI</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Jadwal Belajar</div>

            <div className="stat-value">20K+</div>

            <div className="stat-desc">Study Planner dibuat</div>
          </div>
        </div>
      </section> */}

      {/* ================= ABOUT ================= */}

      <section className="py-24 bg-base-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-5xl font-bold">
              Apa itu
              <span className="text-primary"> Adapler?</span>
            </h2>

            <p className="mt-8 text-lg max-w-4xl mx-auto opacity-70 leading-8">
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

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-5xl font-bold mb-5">
            Fitur Unggulan
          </h2>

          <p className="text-center opacity-70 max-w-3xl mx-auto mb-16">
            Semua fitur dirancang untuk membantu proses belajar menjadi lebih
            cepat, mudah, dan menyenangkan.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="card bg-base-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="card-body">
                    <Icon size={48} className="text-primary mb-4" />

                    <h2 className="card-title text-2xl">{item.title}</h2>

                    <p className="opacity-70 leading-7">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* ================= HOW IT WORKS ================= */}

      <section className="py-24 bg-base-200">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-5xl font-bold mb-4">
            Cara Kerja Adapler
          </h2>

          <p className="text-center opacity-70 mb-16 max-w-3xl mx-auto">
            Hanya dalam tiga langkah sederhana kamu sudah bisa belajar lebih
            efektif dengan bantuan Artificial Intelligence.
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            {howItWorks.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="card-body text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon
                          size={42}
                          className="text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                        />
                      </div>
                    </div>

                    <h3 className="font-bold text-2xl">{item.title}</h3>

                    <p className="opacity-70 leading-7">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= AI PREVIEW ================= */}

      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center text-5xl font-bold mb-16">
            Preview AI Assistant
          </h2>

          <div className="mockup-browser border bg-base-200 shadow-xl">
            <div className="mockup-browser-toolbar">
              <div className="input">https://Adapler.vercel.app/chat</div>
            </div>

            <div className="bg-base-100 p-8 space-y-5">
              <div className="chat chat-start">
                <div className="chat-bubble">
                  Halo 👋 Ada materi yang ingin kamu pelajari hari ini?
                </div>
              </div>

              <div className="chat chat-end">
                <div className="chat-bubble chat-bubble-primary">
                  Tolong jelaskan Binary Search Tree dengan bahasa sederhana.
                </div>
              </div>

              <div className="chat chat-start">
                <div className="chat-bubble">
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

      <section className="py-24 bg-base-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-bold mb-8">
                Mengapa Memilih Adapler?
              </h2>

              <p className="opacity-70 leading-8 mb-8">
                Adapler bukan hanya chatbot biasa. Platform ini dirancang
                sebagai partner belajar yang mampu membantu seluruh aktivitas
                akademikmu.
              </p>

              <div className="space-y-5">
                <div>✅ Jadwal belajar otomatis</div>

                <div>✅ Ringkasan materi berbasis AI</div>

                <div>✅ AI Tutor interaktif</div>

                <div>✅ Quiz Generator</div>

                <div>✅ Reminder deadline tugas</div>

                <div>✅ Dashboard perkembangan belajar</div>
              </div>
            </div>

            <div className="stats stats-vertical shadow">
              <div className="stat">
                <div className="stat-title">Akurasi AI</div>

                <div className="stat-value text-primary">95%</div>
              </div>

              <div className="stat">
                <div className="stat-title">Kepuasan Pengguna</div>

                <div className="stat-value text-secondary">4.9★</div>
              </div>

              <div className="stat">
                <div className="stat-title">Respon AI</div>

                <div className="stat-value">&lt; 3 detik</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIAL ================= */}

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-5xl font-bold mb-16">
            Apa Kata Pengguna?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((item, index) => (
              <div key={index} className="card bg-base-200 shadow-lg">
                <div className="card-body">
                  <div className="rating rating-sm mb-3">
                    <input
                      type="radio"
                      className="mask mask-star-2 bg-orange-400"
                      checked
                      readOnly
                    />

                    <input
                      type="radio"
                      className="mask mask-star-2 bg-orange-400"
                      checked
                      readOnly
                    />

                    <input
                      type="radio"
                      className="mask mask-star-2 bg-orange-400"
                      checked
                      readOnly
                    />

                    <input
                      type="radio"
                      className="mask mask-star-2 bg-orange-400"
                      checked
                      readOnly
                    />

                    <input
                      type="radio"
                      className="mask mask-star-2 bg-orange-400"
                      checked
                      readOnly
                    />
                  </div>

                  <p>"{item.comment}"</p>

                  <div className="mt-4">
                    <h4 className="font-bold">{item.name}</h4>

                    <p className="opacity-60 text-sm">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}

      <section className="py-24 bg-base-200">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-center text-5xl font-bold mb-16">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <div className="collapse collapse-arrow bg-base-100">
              <input type="radio" name="faq" />

              <div className="collapse-title font-semibold">
                Apakah Adapler gratis?
              </div>

              <div className="collapse-content">
                Ya. Tersedia versi gratis dengan fitur dasar dan versi premium
                untuk fitur yang lebih lengkap.
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-100">
              <input type="radio" name="faq" />

              <div className="collapse-title font-semibold">
                Apakah bisa upload PDF?
              </div>

              <div className="collapse-content">
                Bisa. Adapler mendukung PDF, DOCX, PPT, dan TXT.
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-100">
              <input type="radio" name="faq" />

              <div className="collapse-title font-semibold">
                Apakah AI bisa menjawab semua mata pelajaran?
              </div>

              <div className="collapse-content">
                Adapler AI dirancang untuk membantu berbagai bidang studi, mulai
                dari Matematika hingga Pemrograman.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}

      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="hero rounded-3xl bg-primary text-primary-content">
            <div className="hero-content text-center py-20">
              <div>
                <h2 className="text-5xl font-bold">
                  Siap Belajar Lebih Pintar?
                </h2>

                <p className="py-8 max-w-2xl">
                  Bergabunglah bersama ribuan mahasiswa dan pelajar yang telah
                  meningkatkan produktivitas belajar menggunakan Adapler.
                </p>

                <button className="btn btn-neutral btn-lg">
                  Mulai Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer className="footer footer-center p-12 bg-neutral text-neutral-content">
        <aside>
          <h2 className="text-3xl font-black">Adapler</h2>

          <p>Smart Learning Platform powered by Artificial Intelligence.</p>

          <p>© 2026 Adapler. All Rights Reserved.</p>
        </aside>
      </footer>
    </div>
  );
}

export default LandingPage;
