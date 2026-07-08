import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import {
  RiBookOpenLine,
  RiArrowDownSLine,
  RiQuestionnaireLine,
  RiLoader4Line,
  RiCheckboxCircleFill,
  RiRestartLine,
  RiSparkling2Line,
  RiTimerLine,
  RiHistoryLine,
} from "@remixicon/react";

const QUIZ_DURATION_SECONDS = 10 * 60; // 10 menit

function parseQuestionAndOptions(rawText) {
  if (!rawText) return { question: "", options: null };

  const regex =
    /([\s\S]*?)\bA\.\s*([\s\S]*?)\bB\.\s*([\s\S]*?)\bC\.\s*([\s\S]*?)\bD\.\s*([\s\S]*)/;
  const match = rawText.match(regex);

  if (!match) return { question: rawText, options: null };

  const clean = (s) =>
    s
      .trim()
      .replace(/\.\s*$/, "")
      .trim();

  return {
    question: match[1].trim(),
    options: {
      A: clean(match[2]),
      B: clean(match[3]),
      C: clean(match[4]),
      D: clean(match[5]),
    },
  };
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// Bentuk response GET /quiz/:materialId bisa jadi salah satu dari dua hal:
//  - array soal -> berarti quiz sudah dibuat tapi belum (atau sedang) dikerjakan
//  - objek berisi score/total_benar/total_soal -> berarti quiz ini sudah pernah
//    diselesaikan sebelumnya
// Sesuaikan pengecekan ini kalau bentuk response API sebenarnya berbeda.
function isResultPayload(payload) {
  return (
    payload &&
    !Array.isArray(payload) &&
    typeof payload === "object" &&
    ("score" in payload || "total_benar" in payload)
  );
}

/**
 * Dropdown "Pilih Materi" versi custom (bukan <select> native) supaya
 * tampilannya konsisten di semua browser & bisa dikustom penuh: highlight
 * item aktif, ikon centang, animasi buka/tutup, dsb.
 */
function MaterialSelect({ materials, value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = materials.find((m) => m.id === value);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-sm text-left transition ${
          open
            ? "border-orange-400 bg-white ring-2 ring-orange-100 dark:border-orange-500/60 dark:bg-gray-800 dark:ring-orange-500/10"
            : "border-gray-200 bg-gray-50 hover:border-orange-200 hover:bg-orange-50/40 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-orange-500/40"
        } text-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-100`}
      >
        <span className={selected ? "font-medium" : "text-gray-400"}>
          {selected ? selected.judul : "-- Pilih Materi --"}
        </span>
        <RiArrowDownSLine
          size={18}
          className={`shrink-0 text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180 text-orange-500" : ""
          }`}
        />
      </button>

      <div
        className={`absolute z-20 mt-2 w-full origin-top overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg shadow-gray-200/60 transition-all duration-150 ease-out dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/40 ${
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <div className="max-h-64 overflow-y-auto py-1.5">
          {materials.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-400">
              Belum ada materi tersedia.
            </div>
          ) : (
            materials.map((m) => {
              const isSelected = m.id === value;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    onChange(m.id);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition ${
                    isSelected
                      ? "bg-orange-50 font-semibold text-orange-700 dark:bg-orange-950/30 dark:text-orange-300"
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/70"
                  }`}
                >
                  <span className="truncate">{m.judul}</span>
                  {isSelected && (
                    <RiCheckboxCircleFill
                      size={16}
                      className="shrink-0 text-orange-500"
                    />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function QuizPage() {
  const API_BASE_URL = "https://adapler-api.inidito.my.id";
  const token = localStorage.getItem("authToken");

  const [materials, setMaterials] = useState([]);
  const [materialId, setMaterialId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION_SECONDS);
  // Menandai bahwa hasil yang ditampilkan berasal dari quiz yang memang
  // sudah pernah diselesaikan sebelumnya (bukan baru saja disubmit),
  // supaya kita bisa kasih pesan yang lebih jelas ke user.
  const [isPastResult, setIsPastResult] = useState(false);

  // Ref supaya effect timer selalu punya versi terbaru dari answers/materialId
  // tanpa perlu masukkan semuanya ke dependency array
  const answersRef = useRef(answers);
  const materialIdRef = useRef(materialId);
  const autoSubmittedRef = useRef(false);
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);
  useEffect(() => {
    materialIdRef.current = materialId;
  }, [materialId]);

  const parsedQuestions = useMemo(
    () =>
      questions.map((q) => ({
        ...q,
        ...parseQuestionAndOptions(q.pertanyaan),
      })),
    [questions],
  );

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/material`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const result = await response.json();
        setMaterials(
          Array.isArray(result?.data?.materials) ? result.data.materials : [],
        );
      }
    } catch (error) {
      console.error("Gagal ambil materi:", error);
    }
  };

  // Mengecek status quiz untuk sebuah materi: apakah belum pernah dibuat,
  // sudah dibuat tapi belum dikerjakan, atau sudah selesai dikerjakan.
  const checkQuizStatus = useCallback(
    async (id) => {
      setIsQuizLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/quiz/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          const payload = data?.data;
          if (isResultPayload(payload)) {
            // Quiz untuk materi ini sudah pernah diselesaikan sebelumnya
            setQuizResult(payload);
            setIsPastResult(true);
          } else if (Array.isArray(payload) && payload.length > 0) {
            // Quiz sudah dibuat, siap dikerjakan
            setQuestions(payload);
            setAnswers({});
            autoSubmittedRef.current = false;
            setTimeLeft(QUIZ_DURATION_SECONDS);
          }
          // Kalau payload kosong/tidak dikenali, berarti belum ada quiz
          // untuk materi ini -> biarkan tampilan "Generate" yang muncul.
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsQuizLoading(false);
      }
    },
    [token],
  );

  const generateQuiz = async () => {
    if (!materialId) return alert("Pilih materi terlebih dahulu");
    setIsGenerating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ materialId }),
      });
      if (res.ok) {
        await checkQuizStatus(materialId);
      } else {
        // Kemungkinan besar ini gagal karena quiz untuk materi ini
        // sudah pernah dibuat sebelumnya. Daripada mentok di alert,
        // langsung coba tampilkan quiz/hasil yang sudah ada.
        await checkQuizStatus(materialId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // submitQuiz dibungkus useCallback + pakai ref supaya bisa dipanggil
  // dari dalam effect timer tanpa masalah stale closure
  const submitQuiz = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/nilai-quiz/${materialIdRef.current}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ jawabanUser: answersRef.current }),
        },
      );
      const data = await res.json();
      if (res.ok) {
        setQuizResult(data.data);
        setIsPastResult(false);
      }
    } catch (err) {
      console.error(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ----- Timer 10 menit -----
  useEffect(() => {
    if (parsedQuestions.length === 0 || quizResult) return;

    if (timeLeft <= 0) {
      if (!autoSubmittedRef.current) {
        autoSubmittedRef.current = true;
        submitQuiz();
      }
      return;
    }

    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, parsedQuestions.length, quizResult, submitQuiz]);

  // Dipanggil setiap kali user ganti pilihan materi di dropdown.
  const handleSelectMaterial = (id) => {
    setMaterialId(id);
    setQuestions([]);
    setAnswers({});
    setQuizResult(null);
    setIsPastResult(false);
    autoSubmittedRef.current = false;
    setTimeLeft(QUIZ_DURATION_SECONDS);
    if (id) checkQuizStatus(id);
  };

  // Dipakai di layar hasil akhir: kembali ke pemilihan materi, bukan
  // "coba lagi" materi yang sama (karena 1 materi cuma bisa 1 quiz).
  const handlePickAnotherMaterial = () => {
    setMaterialId("");
    setQuestions([]);
    setAnswers({});
    setQuizResult(null);
    setIsPastResult(false);
    autoSubmittedRef.current = false;
    setTimeLeft(QUIZ_DURATION_SECONDS);
  };

  const answeredCount = Object.keys(answers).length;
  const progress = questions.length
    ? Math.round((answeredCount / questions.length) * 100)
    : 0;

  const isTimeRunningOut = timeLeft <= 60; // warning di 1 menit terakhir
  const hasQuizAlready = parsedQuestions.length > 0 || quizResult;

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/25">
          <RiQuestionnaireLine size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Quiz Generator
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Uji pemahaman kamu dengan latihan soal otomatis.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-6">
          <label className="mb-2 block text-sm font-semibold text-gray-600 dark:text-gray-300">
            Pilih Materi untuk Quiz
          </label>
          <div className="flex gap-2">
            <MaterialSelect
              materials={materials}
              value={materialId}
              onChange={handleSelectMaterial}
              disabled={isQuizLoading || isGenerating}
            />
            <button
              onClick={generateQuiz}
              disabled={
                isGenerating || !materialId || isQuizLoading || hasQuizAlready
              }
              title={
                hasQuizAlready
                  ? "Quiz untuk materi ini sudah pernah dibuat"
                  : undefined
              }
              className="flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-500/25 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isGenerating ? (
                <RiLoader4Line size={16} className="animate-spin" />
              ) : hasQuizAlready ? (
                <RiCheckboxCircleFill size={16} />
              ) : (
                <RiSparkling2Line size={16} />
              )}
              {hasQuizAlready ? "Sudah Dibuat" : "Generate"}
            </button>
          </div>
        </div>

        {isQuizLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <RiLoader4Line size={32} className="animate-spin text-orange-500" />
            <p className="text-sm text-gray-400">Menyiapkan soal kuis...</p>
          </div>
        ) : parsedQuestions.length > 0 && !quizResult ? (
          <div>
            {/* Timer + progress */}
            <div className="mb-6 flex items-center gap-4">
              <div
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold tabular-nums ${
                  isTimeRunningOut
                    ? "animate-pulse bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                    : "bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-300"
                }`}
              >
                <RiTimerLine size={16} />
                {formatTime(timeLeft)}
              </div>

              <div className="w-full">
                <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                  <span>
                    Terjawab {answeredCount} dari {parsedQuestions.length} soal
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {parsedQuestions.map((q, i) => (
                <div
                  key={q.id}
                  className="rounded-2xl border border-gray-100 bg-gray-50/60 p-5 dark:border-gray-800 dark:bg-gray-900/40"
                >
                  <p className="mb-4 flex gap-2 font-medium text-gray-800 dark:text-gray-100">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600 dark:bg-orange-900/40 dark:text-orange-300">
                      {i + 1}
                    </span>
                    {q.question}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {["A", "B", "C", "D"].map((opt) => {
                      const selected = answers[q.id] === opt;
                      const optionText = q.options?.[opt];
                      return (
                        <label
                          key={opt}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition ${
                            selected
                              ? "border-orange-400 bg-orange-50 text-orange-800 shadow-sm dark:border-orange-500/60 dark:bg-orange-950/30 dark:text-orange-200"
                              : "border-gray-200 bg-white text-gray-600 hover:border-orange-200 hover:bg-orange-50/40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name={q.id}
                            value={opt}
                            checked={selected}
                            onChange={(e) =>
                              setAnswers({ ...answers, [q.id]: e.target.value })
                            }
                            className="sr-only"
                          />
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                              selected
                                ? "bg-orange-500 text-white"
                                : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {opt}
                          </span>
                          <span className="leading-snug">
                            {optionText || `Opsi ${opt}`}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={submitQuiz}
              disabled={answeredCount < questions.length}
              className="mt-6 w-full rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {answeredCount < questions.length
                ? `Jawab semua soal dulu (${answeredCount}/${questions.length})`
                : "Submit Jawaban"}
            </button>
          </div>
        ) : quizResult ? (
          <div className="flex flex-col items-center justify-center gap-4 py-14">
            {isPastResult && (
              <div className="flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                <RiHistoryLine size={14} />
                Kamu sudah menyelesaikan kuis ini sebelumnya
              </div>
            )}

            <div className="relative flex h-32 w-32 items-center justify-center">
              <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-gray-100 dark:text-gray-800"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  strokeWidth="10"
                  strokeLinecap="round"
                  stroke="url(#scoreGradient)"
                  strokeDasharray={2 * Math.PI * 52}
                  strokeDashoffset={
                    2 * Math.PI * 52 * (1 - (quizResult.score || 0) / 100)
                  }
                />
                <defs>
                  <linearGradient
                    id="scoreGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {quizResult.score}
                </span>
                <span className="text-[11px] text-gray-400">skor</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <RiCheckboxCircleFill size={16} className="text-emerald-500" />
              Benar {quizResult.total_benar} dari {quizResult.total_soal} soal
            </div>

            <button
              onClick={handlePickAnotherMaterial}
              className="mt-2 flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <RiRestartLine size={16} />
              Pilih Materi Lain
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 dark:bg-orange-950/30">
              <RiBookOpenLine size={28} className="text-orange-400" />
            </div>
            <p className="text-sm text-gray-400">
              Pilih materi dan klik{" "}
              <span className="font-medium text-gray-500 dark:text-gray-300">
                Generate
              </span>{" "}
              untuk memulai kuis.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default QuizPage;
