import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, Award, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Tags } from "lucide-react";
import { updateUserScore } from "../lib/db";
import { UserProfile } from "../types";

interface SubjectGameProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onBack: () => void;
}

interface SubjectQuizItem {
  id: string;
  bookTitle: string;
  description: string;
  correctSubject: string;
  options: string[];
}

export default function SubjectGame({ user, onUpdateUser, onBack }: SubjectGameProps) {
  const [score, setScore] = useState<number>(0);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);

  const quizzes: SubjectQuizItem[] = [
    {
      id: "sub_1",
      bookTitle: "မြန်မာ့သမိုင်းနှင့် ရှေးဟောင်းယဉ်ကျေးမှု သုတေသန",
      description: "ပျူမြို့ဟောင်းများ၏ တူးဖော်တွေ့ရှိချက်များ၊ ပုဂံခေတ် ဗိသုကာလက်ရာများနှင့် ကုန်းဘောင်ခေတ် ခရီးသွားမှတ်တမ်းများအကြောင်း သုတေသနပြု ရေးသားထားသော စာအုပ်ဖြစ်သည်။",
      correctSubject: "Myanmar - History & Archaeology (မြန်မာ့သမိုင်းနှင့် ရှေးဟောင်းသုတေသန)",
      options: [
        "Monastic Education System (ဘုန်းတော်ကြီးသင် ပညာရေးစနစ်)",
        "Myanmar - History & Archaeology (မြန်မာ့သမိုင်းနှင့် ရှေးဟောင်းသုတေသန)",
        "Buddhist Literature & Art (ဗုဒ္ဓဘာသာ စာပေနှင့် အနုပညာ)",
        "Asian Geography (အာရှပထဝီဝင်အချက်အလက်များ)"
      ]
    },
    {
      id: "sub_2",
      bookTitle: "ကျန်းမာစွာ အသက်ရှည်နည်းနှင့် ခေတ်မီ ဆေးကုသမှု လမ်းညွှန်",
      description: "နေ့စဉ် စားသောက်မှုပုံစံ၊ ကိုယ်လက်လှုပ်ရှားမှုနှင့် အဖြစ်များသော ရောဂါဝေဒနာများကို သိပ္ပံနည်းကျ စောင့်ရှောက်ကုသပုံများ ပါဝင်သော လမ်းညွှန်စာအုပ် ဖြစ်သည်။",
      correctSubject: "Medicine, Health & Wellness (ကျန်းမာရေးနှင့် ဆေးပညာ)",
      options: [
        "Psychology & Human Behavior (စိတ်ပညာနှင့် လူ့အပြုအမူ)",
        "Biological Sciences (ဇီဝသိပ္ပံပညာရပ်များ)",
        "Medicine, Health & Wellness (ကျန်းမာရေးနှင့် ဆေးပညာ)",
        "Sociological Studies (လူမှုဗေဒ လေ့လာချက်များ)"
      ]
    },
    {
      id: "sub_3",
      bookTitle: "ဗုဒ္ဓဓမ္မနှင့် စိတ်တည်ငြိမ်မှု ကမ္မဋ္ဌာန်း လမ်းညွှန်",
      description: "ကိုယ်စိတ်နှစ်ပါး အေးချမ်းတည်ငြိမ်စေရန်အတွက် မင်းကွန်းဆရာတော်ကြီး၏ ဝိပဿနာ တရားတော်များနှင့် ရှုမှတ်နည်းများ စနစ်တကျလမ်းညွှန်ချက် စာအုပ်ဖြစ်သည်။",
      correctSubject: "Theravada Buddhism & Meditation (ထေရဝါဒ ဗုဒ္ဓဘာသာနှင့် တရားရိပ်သာ)",
      options: [
        "Theravada Buddhism & Meditation (ထေရဝါဒ ဗုဒ္ဓဘာသာနှင့် တရားရိပ်သာ)",
        "Ancient Philosophy (ရှေးဟောင်းဒဿနိကဗေဒ)",
        "Ethics & Morality Studies (ကျင့်ဝတ်နှင့် သီလဆိုင်ရာ သုတေသန)",
        "Mystical Oriental Religions (အရှေ့တိုင်း ဘာသာရေး လေ့လာချက်)"
      ]
    }
  ];

  const handleSelect = (subj: string) => {
    if (checked) return;
    setSelectedSubject(subj);
  };

  const checkAnswer = () => {
    if (!selectedSubject) return;
    const isCorrect = selectedSubject === quizzes[currentIdx].correctSubject;
    setChecked(true);
    if (isCorrect) {
      setScore(prev => prev + 40); // 40 points per correct subject heading match!
    }
  };

  const handleNext = async () => {
    setSelectedSubject(null);
    setChecked(false);
    if (currentIdx < quizzes.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setGameFinished(true);
      // Update high score inside database
      await updateUserScore(user.id, "subject", score);
    }
  };

  const currentQuiz = quizzes[currentIdx];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6" id="subject-game-root">
      {/* Header */}
      <div className="glass-card p-6 rounded-3xl mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Tags className="text-teal-400 w-7 h-7" />
            <span>Subject Headings (ခေါင်းစဉ်အကြောင်းအရာ သတ်မှတ်ခြင်း)</span>
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            စာအုပ်များ၏ ပါဝင်သောအကြောင်းအရာအလိုက် စာကြည့်တိုက်ခေါင်းစဉ် (Subject headings) အုပ်စုခွဲခြားခြင်း လေ့ကျင့်ခန်း
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/20 text-center">
            <div className="text-xs text-slate-400">လက်ရှိအမှတ်</div>
            <div className="text-xl font-extrabold text-teal-400">{score} pts</div>
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
            key={currentIdx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-teal-500/10 text-teal-400 border-l border-b border-teal-500/20 px-4 py-1.5 text-xs font-semibold rounded-bl-2xl">
              မေးခွန်း {currentIdx + 1} / {quizzes.length}
            </div>

            {/* Book Info Showcase */}
            <div className="mb-8">
              <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider block mb-1">
                စာအုပ်အညွှန်းနှင့် အကြောင်းအရာအကျဉ်း
              </span>
              <h3 className="text-2xl font-extrabold text-white mb-3">
                {currentQuiz.bookTitle}
              </h3>
              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl text-slate-200 text-base leading-relaxed">
                {currentQuiz.description}
              </div>
            </div>

            {/* Float Floating Liquid Style Subject Headings selection */}
            <div className="mb-8">
              <span className="text-xs font-semibold text-slate-400 block mb-3">
                အသင့်တော်ဆုံး စာကြည့်တိုက်ခေါင်းစဉ်အကြောင်းအရာကို ရွေးချယ်ပေးပါ -
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuiz.options.map((option) => {
                  const isSelected = selectedSubject === option;
                  const isCorrectOption = option === currentQuiz.correctSubject;

                  let cardStyle = "glass-card text-left p-4 rounded-2xl transition-all cursor-pointer flex items-center justify-between border border-white/10 text-white hover:bg-white/10";
                  if (isSelected && !checked) {
                    cardStyle = "bg-teal-500/20 border-teal-400 text-teal-300 text-left p-4 rounded-2xl transition-all cursor-pointer flex items-center justify-between";
                  } else if (checked) {
                    if (isCorrectOption) {
                      cardStyle = "bg-emerald-500/30 border-emerald-400 text-emerald-200 text-left p-4 rounded-2xl transition-all flex items-center justify-between";
                    } else if (isSelected) {
                      cardStyle = "bg-red-500/30 border-red-400 text-red-200 text-left p-4 rounded-2xl transition-all flex items-center justify-between";
                    } else {
                      cardStyle = "opacity-40 glass-card text-left p-4 rounded-2xl flex items-center justify-between border border-white/10 text-white";
                    }
                  }

                  return (
                    <button
                      key={option}
                      disabled={checked}
                      onClick={() => handleSelect(option)}
                      className={cardStyle}
                    >
                      <span className="font-semibold">{option}</span>
                      {checked && isCorrectOption && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                      {checked && isSelected && !isCorrectOption && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer Control */}
            <div className="flex justify-end gap-4 border-t border-white/10 pt-6">
              {!checked ? (
                <button
                  onClick={checkAnswer}
                  disabled={!selectedSubject}
                  className={`px-6 py-3 rounded-2xl font-bold transition-all ${
                    selectedSubject 
                      ? "liquid-button text-white cursor-pointer" 
                      : "bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  အဖြေစစ်မည်
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 rounded-2xl font-bold liquid-button flex items-center gap-2"
                >
                  <span>ရှေ့သို့</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          /* FINISH SCREEN */
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-8 md:p-12 rounded-3xl text-center max-w-xl mx-auto"
          >
            <div className="w-24 h-24 bg-gradient-to-tr from-teal-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse" />
              <Award className="text-white w-12 h-12 z-10" />
            </div>

            <h3 className="text-3xl font-extrabold text-white mb-2">ခေါင်းစဉ်အုပ်စုခွဲခြင်း ပြီးပါပြီ။</h3>
            <p className="text-slate-300 mb-6 max-w-md mx-auto">
              စာအုပ်များ၏ အကြောင်းအရာအချက်အလက်များကို ဆန်းစစ်သုံးသပ်ပြီး စာကြည့်တိုက်သုံးခေါင်းစဉ်များ (Subject Headings) စနစ်တကျ ရွေးချယ်နိုင်ခဲ့ပါသည်။
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="text-xs text-slate-400">ရရှိသောအမှတ်</div>
                <div className="text-2xl font-black text-teal-400">{score} pts</div>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="text-xs text-slate-400">အမြင့်ဆုံးအမှတ်</div>
                <div className="text-2xl font-black text-purple-400">
                  {Math.max(user.subjectScore, score)} pts
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setScore(0);
                  setCurrentIdx(0);
                  setSelectedSubject(null);
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
