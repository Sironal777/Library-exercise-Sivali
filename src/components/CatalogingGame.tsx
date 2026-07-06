import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Award, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, FileText } from "lucide-react";
import { updateUserScore } from "../lib/db";
import { UserProfile } from "../types";

interface CatalogingGameProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onBack: () => void;
}

interface CatalogQuiz {
  id: string;
  titlePage: {
    title: string;
    subTitle?: string;
    author: string;
    publisher: string;
    place: string;
    year: string;
    isbn: string;
    edition?: string;
  };
  questions: {
    id: string;
    marcField: string; // e.g., "100", "245", "260" or "020"
    fieldName: string; // e.g., "Main Entry - Personal Name (Author)"
    correctValue: string;
    options: string[];
  }[];
}

export default function CatalogingGame({ user, onUpdateUser, onBack }: CatalogingGameProps) {
  const [score, setScore] = useState<number>(0);
  const [currentQuizIdx, setCurrentQuizIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // questionId -> selectedOption
  const [checked, setChecked] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);

  // Quizzes with glassmorphic book title details
  const quizzes: CatalogQuiz[] = [
    {
      id: "cat_1",
      titlePage: {
        title: "Sīvali Jātaka and library science",
        subTitle: "A historical guide to monastic catalogs",
        author: "Bhikkhu Nyanika",
        publisher: "Sarpay Beikman Publishing House",
        place: "Yangon, Myanmar",
        year: "2015",
        isbn: "978-3-16-148410-0",
        edition: "2nd Revised Edition"
      },
      questions: [
        {
          id: "q1_1",
          marcField: "245",
          fieldName: "Title & Statement of Responsibility (ခေါင်းစဉ်နှင့် တာဝန်ခံမှုဖော်ပြချက်)",
          correctValue: "Sīvali Jātaka and library science / Bhikkhu Nyanika",
          options: [
            "Sīvali Jātaka and library science / Bhikkhu Nyanika",
            "Bhikkhu Nyanika : Sīvali Jātaka and library science",
            "Library Science guide by Bhikkhu Nyanika",
            "Sīvali Jātaka - 2nd Revised Edition"
          ]
        },
        {
          id: "q1_2",
          marcField: "100",
          fieldName: "Main Entry - Personal Name (ပင်မအကွက် - အာဘော်/ရေးသားသူ)",
          correctValue: "Nyanika, Bhikkhu",
          options: [
            "Bhikkhu Nyanika",
            "Nyanika, Bhikkhu",
            "Bhikkhu, Nyanika",
            "Nyanika"
          ]
        },
        {
          id: "q1_3",
          marcField: "264 / 260",
          fieldName: "Publication / Imprint (ထုတ်ဝေမှုဆိုင်ရာ အချက်အလက်များ)",
          correctValue: "Yangon : Sarpay Beikman Publishing House, 2015",
          options: [
            "Sarpay Beikman Publishing House, 2015",
            "Yangon : Sarpay Beikman Publishing House, 2015",
            "2015 - Yangon, Myanmar",
            "Sarpay Beikman House : Yangon, 2015"
          ]
        }
      ]
    },
    {
      id: "cat_2",
      titlePage: {
        title: "The Art of Monastic Cataloging",
        author: "Prof. Tin Mg Win",
        publisher: "Universities Press",
        place: "Mandalay, Myanmar",
        year: "2021",
        isbn: "978-99971-0-453-2",
        edition: "First Edition"
      },
      questions: [
        {
          id: "q2_1",
          marcField: "245",
          fieldName: "Title & Statement of Responsibility (ခေါင်းစဉ်နှင့် တာဝန်ခံမှုဖော်ပြချက်)",
          correctValue: "The Art of Monastic Cataloging / Prof. Tin Mg Win",
          options: [
            "The Art of Monastic Cataloging / Prof. Tin Mg Win",
            "Tin Mg Win (Prof.) - The Art of Monastic Cataloging",
            "Art of Monastic Cataloging, Universities Press",
            "Mandalay : Universities Press, 2021"
          ]
        },
        {
          id: "q2_2",
          marcField: "100",
          fieldName: "Main Entry - Personal Name (ပင်မအကွက် - အာဘော်/ရေးသားသူ)",
          correctValue: "Tin Mg Win, Prof.",
          options: [
            "Prof. Tin Mg Win",
            "Tin Mg Win, Prof.",
            "Win, Tin Mg (Prof.)",
            "Tin Mg Win"
          ]
        },
        {
          id: "q2_3",
          marcField: "020",
          fieldName: "ISBN (အပြည်ပြည်ဆိုင်ရာ စာအုပ်စံနှုန်းနံပါတ်)",
          correctValue: "9789997104532",
          options: [
            "978-99971-0-453-2",
            "9789997104532",
            "ISBN 9789997104532",
            "978-99971-0-453-2 (First Edition)"
          ]
        }
      ]
    }
  ];

  const handleSelectOption = (questionId: string, option: string) => {
    if (checked) return;
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleCheckAnswers = () => {
    const quiz = quizzes[currentQuizIdx];
    let correctCount = 0;
    
    quiz.questions.forEach(q => {
      if (answers[q.id] === q.correctValue) {
        correctCount++;
      }
    });

    // Score: 30 points per correct answer!
    setScore(prev => prev + (correctCount * 30));
    setChecked(true);
  };

  const handleNextQuiz = () => {
    setAnswers({});
    setChecked(false);
    if (currentQuizIdx < quizzes.length - 1) {
      setCurrentQuizIdx(prev => prev + 1);
    } else {
      setGameFinished(true);
      // Update score in Firestore
      updateUserScore(user.id, "cataloging", score);
    }
  };

  const currentQuiz = quizzes[currentQuizIdx];
  const allAnswered = currentQuiz.questions.every(q => answers[q.id] !== undefined);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6" id="catalog-game-root">
      {/* Header Glassmorphism */}
      <div className="glass-card p-6 rounded-3xl mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="text-purple-400 w-7 h-7" />
            <span>Cataloging (ကတ်တလောက် ရေးသွင်းနည်း)</span>
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            စာအုပ်များ၏ သိကောင်းစရာ အချက်အလက်များကို AACR2 / RDA စံနှုန်းများနှင့်အညီ မှတ်တမ်းတင်ခြင်း လေ့ကျင့်ခန်း
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/20 text-center">
            <div className="text-xs text-slate-400">လက်ရှိအမှတ်</div>
            <div className="text-xl font-extrabold text-purple-400">{score} pts</div>
          </div>
          <button 
            onClick={onBack}
            className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10 text-white text-sm transition-all"
          >
            ထွက်မည်
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!gameFinished ? (
          <motion.div
            key={currentQuizIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Title Page Render (3D Glass Sheet) */}
            <div className="lg:col-span-5">
              <div className="glass-card p-6 rounded-3xl h-full border border-white/20 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden">
                {/* Visual Glow */}
                <div className="absolute -top-12 -left-12 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl" />
                
                {/* Title Page Content */}
                <div className="text-center py-6 border-b border-white/10 relative z-10">
                  <span className="text-[10px] tracking-widest font-extrabold text-purple-400 uppercase bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                    TITLE PAGE (မျက်နှာဖုံးဝင်း)
                  </span>
                  <h3 className="text-2xl font-extrabold text-white mt-6 leading-relaxed text-glow-purple">
                    {currentQuiz.titlePage.title}
                  </h3>
                  {currentQuiz.titlePage.subTitle && (
                    <p className="text-slate-300 text-sm italic mt-2">
                      {currentQuiz.titlePage.subTitle}
                    </p>
                  )}
                  {currentQuiz.titlePage.edition && (
                    <p className="text-cyan-300 text-xs font-semibold mt-4 bg-cyan-500/10 inline-block px-3 py-1 rounded-lg border border-cyan-500/20">
                      {currentQuiz.titlePage.edition}
                    </p>
                  )}
                </div>

                <div className="text-center py-8 relative z-10">
                  <span className="text-xs text-slate-400 block mb-1 font-medium">ရေးသားသူ -</span>
                  <span className="text-lg font-bold text-white tracking-wide">
                    {currentQuiz.titlePage.author}
                  </span>
                </div>

                <div className="border-t border-white/10 pt-6 text-center text-xs text-slate-300 space-y-2 relative z-10">
                  <div>
                    <span className="text-slate-400">ထုတ်ဝေသူ - </span>
                    <strong className="text-white">{currentQuiz.titlePage.publisher}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">ထုတ်ဝေရာအရပ် - </span>
                    <strong className="text-white">{currentQuiz.titlePage.place}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">ထုတ်ဝေသည့်ခုနှစ် - </span>
                    <strong className="text-cyan-300 font-mono font-bold">{currentQuiz.titlePage.year}</strong>
                  </div>
                  <div className="bg-white/5 py-2 px-3 rounded-xl border border-white/5 inline-block mt-4">
                    <span className="text-slate-400 font-mono">ISBN: </span>
                    <span className="text-white font-mono font-bold tracking-wider">{currentQuiz.titlePage.isbn}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions Form */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="glass-card p-6 md:p-8 rounded-3xl flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider block">
                      မေးခွန်းတွဲ {currentQuizIdx + 1} / {quizzes.length}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> RDA/MARC Fields
                    </span>
                  </div>

                  <div className="space-y-6">
                    {currentQuiz.questions.map((q) => {
                      const userAns = answers[q.id];
                      return (
                        <div key={q.id} className="bg-white/5 p-4 rounded-2xl border border-white/10">
                          <label className="text-xs text-purple-300 font-bold block mb-2 uppercase tracking-wide">
                            MARC Field {q.marcField} — <span className="text-white">{q.fieldName}</span>
                          </label>
                          
                          <div className="grid grid-cols-1 gap-2">
                            {q.options.map((opt) => {
                              const isSelected = userAns === opt;
                              const isCorrect = opt === q.correctValue;
                              
                              let btnClass = "text-left p-3 rounded-xl text-sm border transition-all cursor-pointer flex items-center justify-between text-white border-white/10 bg-white/5 hover:bg-white/10";
                              if (isSelected && !checked) {
                                btnClass = "text-left p-3 rounded-xl text-sm border transition-all cursor-pointer flex items-center justify-between bg-purple-500/20 border-purple-400 text-purple-200 font-medium";
                              } else if (checked) {
                                if (isCorrect) {
                                  btnClass = "text-left p-3 rounded-xl text-sm border transition-all flex items-center justify-between bg-emerald-500/30 border-emerald-400 text-emerald-200 font-medium";
                                } else if (isSelected) {
                                  btnClass = "text-left p-3 rounded-xl text-sm border transition-all flex items-center justify-between bg-red-500/30 border-red-400 text-red-200 font-medium";
                                } else {
                                  btnClass = "opacity-45 text-left p-3 rounded-xl text-sm border border-white/15 bg-white/5 text-slate-400 flex items-center justify-between";
                                }
                              }

                              return (
                                <button
                                  key={opt}
                                  onClick={() => handleSelectOption(q.id, opt)}
                                  disabled={checked}
                                  className={btnClass}
                                >
                                  <span>{opt}</span>
                                  {checked && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                                  {checked && isSelected && !isCorrect && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-4 border-t border-white/10 pt-6 mt-6">
                  {!checked ? (
                    <button
                      onClick={handleCheckAnswers}
                      disabled={!allAnswered}
                      className={`px-6 py-3 rounded-2xl font-bold transition-all ${
                        allAnswered
                          ? "liquid-button text-white cursor-pointer"
                          : "bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      အဖြေစစ်မည်
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuiz}
                      className="px-6 py-3 rounded-2xl font-bold liquid-button flex items-center gap-2"
                    >
                      <span>ရှေ့သို့</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* FINISHED */
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-8 md:p-12 rounded-3xl text-center max-w-xl mx-auto"
          >
            <div className="w-24 h-24 bg-gradient-to-tr from-purple-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse" />
              <Award className="text-white w-12 h-12 z-10" />
            </div>

            <h3 className="text-3xl font-extrabold text-white mb-2">ကတ်တလောက်လေ့ကျင့်ခန်း ပြီးပါပြီ။</h3>
            <p className="text-slate-300 mb-6 max-w-md mx-auto">
              စာအုပ်များ၏ RDA / AACR2 MARC fields များကို သတ်မှတ်စံနှုန်းများနှင့်အညီ မှန်ကန်စွာ ကတ်တလောက်သွင်းနိုင်ခဲ့ပါသည်။
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="text-xs text-slate-400">ရရှိသောအမှတ်</div>
                <div className="text-2xl font-black text-purple-400">{score} pts</div>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="text-xs text-slate-400">အမြင့်ဆုံးအမှတ်</div>
                <div className="text-2xl font-black text-cyan-400">
                  {Math.max(user.catalogingScore, score)} pts
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setScore(0);
                  setCurrentQuizIdx(0);
                  setAnswers({});
                  setChecked(false);
                  setGameFinished(false);
                }}
                className="px-6 py-3 rounded-2xl font-semibold border border-white/20 hover:bg-white/10 text-white transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>ပြန်လည်ကစားမည်</span>
              </button>
              <button
                onClick={onBack}
                className="px-8 py-3 rounded-2xl font-bold liquid-button"
              >
                ပင်မစာမျက်နှာသို့
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
