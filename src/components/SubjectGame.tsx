import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  HelpCircle, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw, 
  Tags, 
  Sparkles, 
  Search, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Layers,
  Infinity as InfinityIcon
} from "lucide-react";
import { updateUserScore } from "../lib/db";
import { UserProfile } from "../types";
import { lccClasses, lccBooksBank, LccClass, LccBookPractice } from "../data/lccData";

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
  const [activeTab, setActiveTab] = useState<"game" | "infinite" | "tables">("infinite"); // Default to infinite practice!
  const [score, setScore] = useState<number>(0);

  // ----------------------------------------------------
  // MCQ GAME STATE (STANDARD ROUNDS)
  // ----------------------------------------------------
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [sessionCompleted, setSessionCompleted] = useState<string[]>([]);
  const [activeQuizzes, setActiveQuizzes] = useState<SubjectQuizItem[]>([]);
  const [aiGenerating, setAiGenerating] = useState<boolean>(false);

  // Completed IDs from localStorage
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(`sivali_completed_subject_${user.id}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const allQuizzes: SubjectQuizItem[] = [
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

  useEffect(() => {
    async function fetchCustomAndInit() {
      try {
        const { getCustomQuestions } = await import("../lib/db");
        const cqs = await getCustomQuestions("subject");
        const customItems = cqs.map((q: any) => q.questionData);
        
        const combined = [...customItems, ...allQuizzes];
        const uncompleted = combined.filter(q => !completedIds.includes(q.id));
        const pool = uncompleted.length > 0 ? uncompleted : combined;
        const selected = [...pool].sort(() => Math.random() - 0.5).slice(0, 6);
        setActiveQuizzes(selected);
      } catch (err) {
        console.error("Error loading subject custom questions:", err);
        const uncompleted = allQuizzes.filter(q => !completedIds.includes(q.id));
        const pool = uncompleted.length > 0 ? uncompleted : allQuizzes;
        const selected = [...pool].sort(() => Math.random() - 0.5).slice(0, 6);
        setActiveQuizzes(selected);
      }
    }
    fetchCustomAndInit();
  }, []);

  const handleAskAi = async () => {
    setAiGenerating(true);
    try {
      const res = await fetch("/api/lessons/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameType: "subject" })
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }

      // Save to firestore custom_questions
      const { addCustomQuestion } = await import("../lib/db");
      await addCustomQuestion("subject", 1, data);

      // Prepend to active list immediately
      setActiveQuizzes(prev => [data, ...prev]);
      setCurrentIdx(0);
      setSelectedSubject(null);
      setChecked(false);

      alert("✨ AI ဆရာတော်မှ သင့်အတွက် အသစ်စက်စက် ကဏ္ဍခွဲခြားမှု သင်ခန်းစာမေးခွန်းတစ်ခုကို အောင်မြင်စွာ ဖန်တီးပေးလိုက်ပါပြီ။");
    } catch (err) {
      console.error(err);
      alert("AI သင်ခန်းစာ တောင်းဆိုရန် အဆင်မပြေပါ။ နောက်မှ ပြန်လည်ကြိုးစားပါ။");
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSelect = (subj: string) => {
    if (checked) return;
    setSelectedSubject(subj);
  };

  const checkAnswer = () => {
    if (!selectedSubject || activeQuizzes.length === 0) return;
    const currentQuiz = activeQuizzes[currentIdx];
    const isCorrect = selectedSubject === currentQuiz.correctSubject;
    setChecked(true);
    if (isCorrect) {
      setScore(prev => prev + 40); // 40 points per correct answer!
      setSessionCompleted(prev => [...prev, currentQuiz.id]);
    }
  };

  const handleNext = async () => {
    setSelectedSubject(null);
    setChecked(false);
    if (currentIdx < activeQuizzes.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setGameFinished(true);
      const updatedCompleted = [...completedIds, ...sessionCompleted];
      try {
        localStorage.setItem(`sivali_completed_subject_${user.id}`, JSON.stringify(updatedCompleted));
      } catch (e) {
        console.error(e);
      }
      setCompletedIds(updatedCompleted);
      // Update score in Firestore
      const updatedUser = await updateUserScore(user.id, "subject", score);
      if (updatedUser) onUpdateUser(updatedUser);
    }
  };

  const resetGame = () => {
    setScore(0);
    setCurrentIdx(0);
    setSelectedSubject(null);
    setChecked(false);
    setGameFinished(false);
    setSessionCompleted([]);

    const uncompleted = allQuizzes.filter(q => !completedIds.includes(q.id));
    const pool = uncompleted.length > 0 ? uncompleted : allQuizzes;
    const selected = [...pool].sort(() => Math.random() - 0.5).slice(0, 6);
    setActiveQuizzes(selected);
  };

  const clearCompletionHistory = () => {
    try {
      localStorage.removeItem(`sivali_completed_subject_${user.id}`);
    } catch (e) {
      console.error(e);
    }
    setCompletedIds([]);
    setSessionCompleted([]);
    setScore(0);
    setCurrentIdx(0);
    setSelectedSubject(null);
    setChecked(false);
    setGameFinished(false);

    const selected = [...allQuizzes].sort(() => Math.random() - 0.5).slice(0, 6);
    setActiveQuizzes(selected);
  };


  // ----------------------------------------------------
  // INFINITE PRACTICE STATE & GENERATION LOGIC
  // ----------------------------------------------------
  const [infiniteBook, setInfiniteBook] = useState<LccBookPractice | null>(null);
  const [infiniteOptions, setInfiniteOptions] = useState<string[]>([]);
  const [infiniteSelected, setInfiniteSelected] = useState<string | null>(null);
  const [infiniteChecked, setInfiniteChecked] = useState<boolean>(false);
  const [infiniteIsCorrect, setInfiniteIsCorrect] = useState<boolean>(false);
  const [infiniteStreak, setInfiniteStreak] = useState<number>(0);

  // Load a random book from the 50 books bank for the infinite challenge
  const nextInfiniteQuestion = () => {
    const randomIndex = Math.floor(Math.random() * lccBooksBank.length);
    const book = lccBooksBank[randomIndex];
    setInfiniteBook(book);
    setInfiniteSelected(null);
    setInfiniteChecked(false);
    setInfiniteIsCorrect(false);

    // Generate options: 1 correct subclass, 3 random wrong subclasses from same or other classes
    const correctVal = `${book.correctSubclass} - ${book.subclassNameMyan}`;
    
    // Grab all unique subclasses from lccClasses to use as wrong options
    const allSubclassOptions: string[] = [];
    lccClasses.forEach(c => {
      c.subclasses?.forEach(s => {
        const optionStr = `${s.code} - ${s.name} (${s.burmeseName})`;
        if (s.code !== book.correctSubclass) {
          allSubclassOptions.push(optionStr);
        }
      });
    });

    // Shuffle and pick 3 wrong options
    const shuffledWrong = allSubclassOptions.sort(() => Math.random() - 0.5).slice(0, 3);
    
    // Combine correct option with 3 wrong options and shuffle
    const combined = [`${book.correctSubclass} - ${book.subclassNameMyan}`, ...shuffledWrong].sort(() => Math.random() - 0.5);
    setInfiniteOptions(combined);
  };

  useEffect(() => {
    if (activeTab === "infinite" && !infiniteBook) {
      nextInfiniteQuestion();
    }
  }, [activeTab, infiniteBook]);

  const handleSelectInfinite = (option: string) => {
    if (infiniteChecked) return;
    setInfiniteSelected(option);
  };

  const handleCheckInfinite = async () => {
    if (!infiniteBook || !infiniteSelected) return;
    const isCorrect = infiniteSelected.startsWith(infiniteBook.correctSubclass);
    setInfiniteChecked(true);
    setInfiniteIsCorrect(isCorrect);

    if (isCorrect) {
      setScore(prev => prev + 40); // 40 points per correct answer!
      setInfiniteStreak(prev => prev + 1);
      // Automatically update Firestore score
      const updatedUser = await updateUserScore(user.id, "subject", score + 40);
      if (updatedUser) onUpdateUser(updatedUser);
    } else {
      setInfiniteStreak(0);
    }
  };


  // ----------------------------------------------------
  // LCC TABLES & CODE BROWSER SEARCH & EXPAND LOGIC
  // ----------------------------------------------------
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedClasses, setExpandedClasses] = useState<Record<string, boolean>>({
    "B": true, // keep philosophy/religion expanded by default for Burmese monks!
    "P": true, // languages
    "Q": true, // computer science
    "Z": true  // libraries
  });

  const toggleClassExpand = (classCode: string) => {
    setExpandedClasses(prev => ({
      ...prev,
      [classCode]: !prev[classCode]
    }));
  };

  // Filter classes & subclasses by search query
  const getFilteredClasses = (): LccClass[] => {
    if (!searchQuery.trim()) return lccClasses;
    
    const query = searchQuery.toLowerCase();
    const result: LccClass[] = [];

    lccClasses.forEach(c => {
      // Check if class code or names match
      const classMatches = 
        c.code.toLowerCase().includes(query) ||
        c.name.toLowerCase().includes(query) ||
        c.burmeseName.toLowerCase().includes(query);

      // Filter subclasses
      const matchingSubclasses = c.subclasses?.filter(s => 
        s.code.toLowerCase().includes(query) ||
        s.name.toLowerCase().includes(query) ||
        s.burmeseName.toLowerCase().includes(query)
      ) || [];

      if (classMatches || matchingSubclasses.length > 0) {
        result.push({
          ...c,
          subclasses: classMatches ? c.subclasses : matchingSubclasses
        });
      }
    });

    return result;
  };

  const filteredClasses = getFilteredClasses();

  return (
    <div className="w-full">
      {/* Header Panel */}
      <div className="glass-card p-6 rounded-3xl mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Tags className="text-teal-400 w-7 h-7" />
            <span>LCC Subject Classification Lab</span>
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            ကုန်းဘောင်၊ ပုဂံ၊ ဗုဒ္ဓဘာသာကျမ်းစာများနှင့် ကွန်ပျူတာသိပ္ပံစာအုပ်များအတွက် LCC (Library of Congress) အမျိုးအစားခွဲနည်းနှင့် ဇယားများရှာဖွေခြင်း
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={handleAskAi}
            disabled={aiGenerating}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-teal-500/20 hover:bg-teal-500/35 border border-teal-500/30 hover:border-teal-500/50 text-teal-300 transition-all cursor-pointer shadow-lg animate-pulse"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{aiGenerating ? "Generating..." : "AI သင်ခန်းစာသစ် တောင်းမည်"}</span>
          </button>
          <div className="bg-white/10 px-3 py-2 rounded-2xl border border-white/20 text-center">
            <div className="text-[10px] text-slate-400">စုစုပေါင်းရမှတ်</div>
            <div className="text-lg font-extrabold text-teal-400">{score || user.subjectScore || 0} pts</div>
          </div>
          <button 
            onClick={onBack}
            className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10 text-white text-sm transition-all cursor-pointer"
          >
            ထွက်မည်
          </button>
        </div>
      </div>

      {/* Navigation Tabs Switcher */}
      <div className="flex flex-wrap border-b border-white/10 mb-6 gap-2">
        <button
          onClick={() => setActiveTab("infinite")}
          className={`px-5 py-3 text-xs sm:text-sm font-extrabold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "infinite"
              ? "border-teal-500 text-teal-300 bg-teal-500/10 rounded-t-xl"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <InfinityIcon className="w-4 h-4 text-teal-400" />
          <span>(၁) အကန့်အသတ်မဲ့ လေ့ကျင့်ရေးဂိမ်း (Infinite Game)</span>
        </button>
        <button
          onClick={() => setActiveTab("tables")}
          className={`px-5 py-3 text-xs sm:text-sm font-extrabold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "tables"
              ? "border-cyan-500 text-cyan-300 bg-cyan-500/10 rounded-t-xl"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Search className="w-4 h-4 text-cyan-400" />
          <span>(၂) LCC ကုဒ်ဇယားများ ရှာဖွေခြင်း (Browse LCC Tables)</span>
        </button>
        <button
          onClick={() => setActiveTab("game")}
          className={`px-5 py-3 text-xs sm:text-sm font-extrabold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "game"
              ? "border-purple-500 text-purple-300 bg-purple-500/10 rounded-t-xl"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Award className="w-4 h-4 text-purple-400" />
          <span>(၃) သီအိုရီ ဉာဏ်စမ်း (Standard MCQ)</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* ========================================== */}
        {/* TAB 1: INFINITE PRACTICE CHALLENGE */}
        {/* ========================================== */}
        {activeTab === "infinite" && (
          <motion.div
            key="infinite_mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Main Interactive Book Display */}
            <div className="lg:col-span-8 space-y-6">
              {infiniteBook && (
                <div className="glass-card p-6 md:p-8 rounded-3xl border border-teal-500/20 relative overflow-hidden shadow-2xl bg-[#090b22]/90">
                  {/* Glowing gradient back */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl" />
                  
                  <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
                    <span className="text-xs font-black text-teal-400 uppercase tracking-widest bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20 flex items-center gap-1.5">
                      <InfinityIcon className="w-4 h-4 animate-spin-slow" />
                      <span>INFINITE BOOK CHALLENGE (စာအုပ်ပေါင်း ၅၀+)</span>
                    </span>
                    <span className="text-xs text-slate-300 font-bold bg-white/5 px-2.5 py-1 rounded-xl">
                      Streak: <span className="text-emerald-400 font-extrabold">{infiniteStreak} 🔥</span>
                    </span>
                  </div>

                  {/* Book Card Graphic representation */}
                  <div className="space-y-4 mb-8">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-widest">Book Title & Description</span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white text-glow-teal leading-relaxed">
                      {infiniteBook.title}
                    </h3>
                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl text-slate-200 text-sm sm:text-base leading-relaxed font-mono">
                      {infiniteBook.description}
                    </div>
                  </div>

                  {/* Select Options Panel */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-400 block mb-1">
                      အထက်ပါစာအုပ်အတွက် အကိုက်ညီဆုံး LCC Subclass (အုပ်စုခွဲ) ကို ရွေးချယ်ပါ -
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {infiniteOptions.map((option) => {
                        const isSelected = infiniteSelected === option;
                        const isCorrectOption = option.startsWith(infiniteBook.correctSubclass);

                        let cardStyle = "text-left p-4 rounded-2xl transition-all border border-white/10 text-white hover:bg-white/10 bg-white/5 cursor-pointer text-xs sm:text-sm font-semibold flex items-center justify-between";
                        if (isSelected && !infiniteChecked) {
                          cardStyle = "bg-teal-500/20 border-teal-400 text-teal-200 text-left p-4 rounded-2xl transition-all cursor-pointer text-xs sm:text-sm font-bold flex items-center justify-between";
                        } else if (infiniteChecked) {
                          if (isCorrectOption) {
                            cardStyle = "bg-emerald-500/30 border-emerald-400 text-emerald-200 text-left p-4 rounded-2xl transition-all text-xs sm:text-sm font-bold flex items-center justify-between";
                          } else if (isSelected) {
                            cardStyle = "bg-red-500/30 border-red-400 text-red-200 text-left p-4 rounded-2xl transition-all text-xs sm:text-sm font-bold flex items-center justify-between";
                          } else {
                            cardStyle = "opacity-30 border border-white/10 text-slate-500 text-left p-4 rounded-2xl text-xs sm:text-sm flex items-center justify-between";
                          }
                        }

                        return (
                          <button
                            key={option}
                            disabled={infiniteChecked}
                            onClick={() => handleSelectInfinite(option)}
                            className={cardStyle}
                          >
                            <span>{option}</span>
                            {infiniteChecked && isCorrectOption && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                            {infiniteChecked && isSelected && !isCorrectOption && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Feedback Details */}
                  {infiniteChecked && (
                    <div className="mt-6 p-4 rounded-2xl border bg-black/40 text-xs sm:text-sm space-y-2 animate-fade-in">
                      {infiniteIsCorrect ? (
                        <div className="text-emerald-400 font-extrabold flex items-center gap-1.5">
                          <CheckCircle2 className="w-5 h-5" />
                          <span>အဖြေမှန်ကန်ပါသည်! (+40 points)</span>
                        </div>
                      ) : (
                        <div className="text-red-400 font-extrabold flex items-center gap-1.5">
                          <AlertCircle className="w-5 h-5" />
                          <span>အဖြေမှားယွင်းနေပါသည်။</span>
                        </div>
                      )}
                      <p className="text-slate-300 leading-relaxed mt-2 font-mono">
                        <strong className="text-teal-300 block mb-1">ဆရာတော်၏ အမျိုးအစားခွဲခြားချက် ရှင်းလင်းချက် -</strong>
                        {infiniteBook.explanation}
                      </p>
                    </div>
                  )}

                  {/* Footer Controller */}
                  <div className="flex justify-end gap-3 border-t border-white/10 pt-5 mt-6">
                    {!infiniteChecked ? (
                      <button
                        onClick={handleCheckInfinite}
                        disabled={!infiniteSelected}
                        className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                          infiniteSelected 
                            ? "bg-teal-500 hover:bg-teal-600 text-white cursor-pointer shadow-[0_0_15px_rgba(20,184,166,0.3)]" 
                            : "bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed"
                        }`}
                      >
                        အဖြေစစ်မည်
                      </button>
                    ) : (
                      <button
                        onClick={nextInfiniteQuestion}
                        className="px-6 py-2.5 rounded-xl font-bold bg-teal-500 hover:bg-teal-600 text-white text-xs sm:text-sm flex items-center gap-1 cursor-pointer transition-all shadow-[0_0_15px_rgba(20,184,166,0.3)]"
                      >
                        <span>နောက်စာအုပ်တစ်အုပ်</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Side Column: Infinite Streak Milestones and Info */}
            <div className="lg:col-span-4 space-y-6">
              <div className="glass-card p-5 rounded-3xl bg-[#090518] border border-white/10">
                <h4 className="text-xs font-black text-teal-400 uppercase tracking-widest mb-3">အကန့်အသတ်မဲ့ လေ့ကျင့်နည်း လမ်းညွှန်</h4>
                <ul className="space-y-2.5 text-xs text-slate-300 list-disc list-inside">
                  <li>LCC စာအုပ်ဒေတာဘေ့စ်မှ အမေးအဖြေများကို စဉ်ဆက်မပြတ် ဖော်ပြပေးပါမည်။</li>
                  <li>မှန်ကန်ပါက ရမှတ် <span className="text-teal-400 font-bold">+၄၀</span> တိုးလာမည်ဖြစ်ပြီး streak အဆင့် တက်လာမည်။</li>
                  <li>အမှားဖြေမိပါက streak မှတ်တမ်း ၀ ပြန်ဖြစ်ပါမည်။</li>
                  <li>အောက်ခြေရှိ "LCC ကုဒ်ဇယားများ" တက်ဘ်တွင် စာအုပ်အုပ်စုများကို ပြန်လည်ရှာဖွေကိုးကားနိုင်ပါသည်။</li>
                </ul>
              </div>

              <div className="glass-card p-5 rounded-3xl bg-[#08041c] border border-white/10 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center mx-auto mb-1">
                  <Sparkles className="text-teal-400 w-6 h-6 animate-pulse" />
                </div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">AI အကူအညီရယူခြင်း</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  သတ်မှတ်ထားသော သီအိုရီဉာဏ်စမ်းများအပြင် AI ဆရာတော်ထံမှ နောက်ထပ်သီအိုရီသင်ခန်းစာ အသစ်စက်စက်များကို အချိန်မရွေး တောင်းဆိုဖန်တီးနိုင်ပါသည်။
                </p>
                <button
                  onClick={handleAskAi}
                  disabled={aiGenerating}
                  className="w-full mt-2 py-2 rounded-xl text-xs font-bold bg-gradient-to-tr from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-lg transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                  <span>{aiGenerating ? "AI ဖန်တီးပေးနေပါသည်..." : "AI သင်ခန်းစာအသစ်ဖန်တီးမည်"}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================== */}
        {/* TAB 2: LCC TABLES & CODE BROWSER */}
        {/* ========================================== */}
        {activeTab === "tables" && (
          <motion.div
            key="lcc_tables"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Real-time search bar */}
            <div className="glass-card p-4 rounded-3xl border border-cyan-500/20 flex items-center gap-3 bg-[#0d0922]/90">
              <Search className="text-cyan-400 w-5 h-5 shrink-0" />
              <input
                type="text"
                placeholder="LCC ကုဒ် သို့မဟုတ် ရှာဖွေလိုသော ဘာသာရပ်ကို ရိုက်ထည့်ပါ... (e.g. BQ, Buddhism, Math, Myanmar, စိုက်ပျိုးရေး)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-white text-sm focus:outline-none placeholder-slate-500 font-mono"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-slate-400 hover:text-white px-2 cursor-pointer"
                >
                  ရှင်းမည်
                </button>
              )}
            </div>

            {/* Expandable Accordion List of Classes */}
            <div className="space-y-4">
              {filteredClasses.length === 0 ? (
                <div className="text-center py-12 glass-card rounded-3xl text-slate-500 text-sm">
                  သင်ရှာဖွေနေသော အတန်းအစား သို့မဟုတ် ကုဒ် မရှိပါ။ စာလုံးပေါင်း ပြန်လည်စစ်ဆေးပေးပါ။
                </div>
              ) : (
                filteredClasses.map((c) => {
                  const isExpanded = !!expandedClasses[c.code];
                  return (
                    <div 
                      key={c.code}
                      className={`glass-card rounded-3xl border transition-all ${
                        isExpanded ? "border-cyan-500/30 bg-[#0f0a28]/95" : "border-white/10 hover:border-white/20 bg-[#0c061e]/80"
                      }`}
                    >
                      {/* Accordion Trigger */}
                      <button
                        onClick={() => toggleClassExpand(c.code)}
                        className="w-full px-6 py-4 flex justify-between items-center text-left cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-extrabold font-mono text-base shadow-[0_0_10px_rgba(6,182,212,0.15)]">
                            {c.code}
                          </span>
                          <div>
                            <span className="text-sm font-extrabold text-white block tracking-wide">{c.name}</span>
                            <span className="text-xs text-slate-400 block mt-0.5">{c.burmeseName}</span>
                          </div>
                        </div>
                        <div>
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-cyan-400" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                        </div>
                      </button>

                      {/* Accordion Content */}
                      <AnimatePresence initial={false}>
                        {isExpanded && c.subclasses && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden border-t border-white/5"
                          >
                            <div className="p-4 sm:p-6 bg-black/20 grid grid-cols-1 md:grid-cols-2 gap-3.5">
                              {c.subclasses.map((sub) => (
                                <div 
                                  key={sub.code}
                                  className="p-3.5 rounded-2xl bg-[#130d32] border border-white/5 hover:border-cyan-500/20 transition-all flex items-start gap-3"
                                >
                                  <span className="text-xs font-black font-mono px-2.5 py-1 bg-cyan-500/10 text-cyan-300 rounded-lg border border-cyan-500/20 select-all">
                                    {sub.code}
                                  </span>
                                  <div className="min-w-0">
                                    <strong className="text-xs font-bold text-white block truncate leading-relaxed">{sub.name}</strong>
                                    <span className="text-[11px] text-slate-400 block leading-relaxed mt-0.5">{sub.burmeseName}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}

        {/* ========================================== */}
        {/* TAB 3: MCQ THEORY GAME */}
        {/* ========================================== */}
        {activeTab === "game" && (
          <motion.div
            key="theory_game"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {activeQuizzes.length === 0 ? (
              <div className="text-center py-12 text-white">မေးခွန်းများ ပြင်ဆင်နေပါသည်...</div>
            ) : !gameFinished ? (
              <div className="glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden bg-[#0a051d]">
                <div className="absolute top-0 right-0 bg-teal-500/10 text-teal-400 border-l border-b border-teal-500/20 px-4 py-1.5 text-xs font-semibold rounded-bl-2xl">
                  မေးခွန်း {currentIdx + 1} / {activeQuizzes.length}
                </div>

                <div className="mb-8">
                  <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider block mb-1">
                    စာအုပ်အညွှန်းနှင့် အကြောင်းအရာအကျဉ်း
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-3 leading-relaxed">
                    {activeQuizzes[currentIdx]?.bookTitle}
                  </h3>
                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl text-slate-200 text-sm sm:text-base leading-relaxed">
                    {activeQuizzes[currentIdx]?.description}
                  </div>
                </div>

                <div className="mb-8">
                  <span className="text-xs font-semibold text-slate-400 block mb-3">
                    အသင့်တော်ဆုံး စာကြည့်တိုက်ခေါင်းစဉ်အကြောင်းအရာကို ရွေးချယ်ပေးပါ -
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeQuizzes[currentIdx]?.options.map((option) => {
                      const isSelected = selectedSubject === option;
                      const isCorrectOption = option === activeQuizzes[currentIdx]?.correctSubject;

                      let cardStyle = "text-left p-4 rounded-2xl transition-all cursor-pointer flex items-center justify-between border border-white/10 text-white hover:bg-white/10 bg-white/5 text-xs sm:text-sm font-semibold";
                      if (isSelected && !checked) {
                        cardStyle = "bg-teal-500/20 border-teal-400 text-teal-300 text-left p-4 rounded-2xl transition-all cursor-pointer text-xs sm:text-sm font-bold flex items-center justify-between";
                      } else if (checked) {
                        if (isCorrectOption) {
                          cardStyle = "bg-emerald-500/30 border-emerald-400 text-emerald-200 text-left p-4 rounded-2xl transition-all text-xs sm:text-sm font-bold flex items-center justify-between";
                        } else if (isSelected) {
                          cardStyle = "bg-red-500/30 border-red-400 text-red-200 text-left p-4 rounded-2xl transition-all text-xs sm:text-sm font-bold flex items-center justify-between";
                        } else {
                          cardStyle = "opacity-40 text-left p-4 rounded-2xl flex items-center justify-between border border-white/10 text-slate-400 bg-transparent text-xs sm:text-sm";
                        }
                      }

                      return (
                        <button
                          key={option}
                          disabled={checked}
                          onClick={() => handleSelect(option)}
                          className={cardStyle}
                        >
                          <span>{option}</span>
                          {checked && isCorrectOption && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                          {checked && isSelected && !isCorrectOption && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-4 border-t border-white/10 pt-6">
                  {!checked ? (
                    <button
                      onClick={checkAnswer}
                      disabled={!selectedSubject}
                      className={`px-6 py-3 rounded-2xl font-bold transition-all ${
                        selectedSubject 
                          ? "bg-teal-500 hover:bg-teal-600 text-white cursor-pointer" 
                          : "bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      အဖြေစစ်မည်
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="px-6 py-3 rounded-2xl font-bold bg-teal-500 hover:bg-teal-600 text-white flex items-center gap-2 cursor-pointer"
                    >
                      <span>ရှေ့သို့</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* FINISH MCQ SCREEN */
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-card p-8 md:p-12 rounded-3xl text-center max-w-xl mx-auto"
              >
                <div className="w-20 h-20 bg-gradient-to-tr from-teal-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <Award className="text-white w-10 h-10" />
                </div>

                <h3 className="text-2xl font-extrabold text-white mb-2">ခေါင်းစဉ်အုပ်စုခွဲခြင်း ပြီးပါပြီ။</h3>
                <p className="text-slate-300 mb-6 text-sm max-w-md mx-auto">
                  စာအုပ်များ၏ အကြောင်းအရာများကို ဆန်းစစ်သုံးသပ်ပြီး စာကြည့်တိုက်သုံးခေါင်းစဉ်များ (Subject Headings) စနစ်တကျ ရွေးချယ်နိုင်ခဲ့ပါသည်။
                </p>

                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="text-xs text-slate-400">ရရှိသောအမှတ်</div>
                    <div className="text-xl font-black text-teal-400">{score} pts</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="text-xs text-slate-400">အမြင့်ဆုံးအမှတ်</div>
                    <div className="text-xl font-black text-purple-400">
                      {Math.max(user.subjectScore, score)} pts
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 justify-center max-w-sm mx-auto">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={resetGame}
                      className="px-6 py-3 rounded-2xl font-semibold border border-white/20 hover:bg-white/10 text-white transition-all flex items-center justify-center gap-2 grow cursor-pointer"
                    >
                      <RefreshCw className="w-5 h-5" />
                      <span>ထပ်မံဆော့ကစားမည်</span>
                    </button>
                    <button
                      onClick={onBack}
                      className="px-8 py-3 rounded-2xl font-bold bg-teal-500 hover:bg-teal-600 text-white cursor-pointer transition-all grow"
                    >
                      ပင်မစာမျက်နှာသို့
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
