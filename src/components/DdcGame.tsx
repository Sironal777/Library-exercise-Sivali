import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Book, Award, ArrowRight, RefreshCw, CheckCircle2, AlertCircle, HelpCircle, Sparkles } from "lucide-react";
import { updateUserScore } from "../lib/db";
import { UserProfile } from "../types";

interface DdcGameProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onBack: () => void;
}

interface MatchQuestion {
  id: string;
  title: string;
  subject: string;
  correctDdc: string; // e.g., "200"
  options: { code: string; label: string }[];
}

interface SortBook {
  id: string;
  title: string;
  callNumber: string; // DDC decimal
}

export default function DdcGame({ user, onUpdateUser, onBack }: DdcGameProps) {
  const [level, setLevel] = useState<1 | 2>(1); // Level 1: Category Match, Level 2: Decimal Order
  const [score, setScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  
  // Completed lists from localStorage
  const [completedMatchIds, setCompletedMatchIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(`sivali_completed_ddc_m_${user.id}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [completedSortIds, setCompletedSortIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(`sivali_completed_ddc_s_${user.id}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Track session completions
  const [sessionCompletedMatches, setSessionCompletedMatches] = useState<string[]>([]);
  const [sessionCompletedSort, setSessionCompletedSort] = useState<string | null>(null);

  // Level 1 States
  const [currentMatchIdx, setCurrentMatchIdx] = useState<number>(0);
  const [selectedDdc, setSelectedDdc] = useState<string | null>(null);
  const [matchChecked, setMatchChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  // Level 2 States
  const [sortBooks, setSortBooks] = useState<SortBook[]>([]);
  const [userSorted, setUserSorted] = useState<SortBook[]>([]);
  const [sortChecked, setSortChecked] = useState<boolean>(false);
  const [sortSuccess, setSortSuccess] = useState<boolean>(false);

  // Level 1 Sample Questions (Myanmar/English mix for local flavor!)
  const matchQuestions: MatchQuestion[] = [
    {
      id: "m1",
      title: "မြန်မာရာဇဝင်သမိုင်းနှင့် ခရီးသွားမှတ်တမ်းများ",
      subject: "သမိုင်းနှင့် ပထဝီဝင် (History & Geography)",
      correctDdc: "900",
      options: [
        { code: "200", label: "200 - ဘာသာရေး (Religion)" },
        { code: "300", label: "300 - လူမှုရေးသိပ္ပံ (Social Sciences)" },
        { code: "900", label: "900 - သမိုင်းနှင့် ပထဝီဝင် (Geography & History)" },
        { code: "500", label: "500 - သဘာဝသိပ္ပံ (Natural Sciences)" }
      ]
    },
    {
      id: "m2",
      title: "အဂ္ဂမဟာပဏ္ဍိတ ဆရာတော်များ၏ တရားတော်များစုစည်းမှု",
      subject: "ဗုဒ္ဓဘာသာဆိုင်ရာ သုတေသန (Buddhism & Religion)",
      correctDdc: "200",
      options: [
        { code: "100", label: "100 - ဒဿနိကဗေဒနှင့် စိတ်ပညာ (Philosophy)" },
        { code: "200", label: "200 - ဘာသာရေး (Religion)" },
        { code: "800", label: "800 - စာပေ (Literature)" },
        { code: "000", label: "000 - အထွေထွေပညာရပ်များ (Computer Science & Info)" }
      ]
    },
    {
      id: "m3",
      title: "အခြေခံ ကွန်ပျူတာကုဒ်ရေးနည်းနှင့် ကွန်ရက်စနစ်",
      subject: "အိုင်တီနှင့် သတင်းအချက်အလက် (IT & Computer Science)",
      correctDdc: "000",
      options: [
        { code: "000", label: "000 - ကွန်ပျူတာနှင့် အထွေထွေ (Info & Computer Science)" },
        { code: "600", label: "600 - နည်းပညာနှင့် အသုံးချသိပ္ပံ (Technology)" },
        { code: "500", label: "500 - သဘာဝသိပ္ပံ (Natural Sciences)" },
        { code: "400", label: "400 - ဘာသာစကား (Language)" }
      ]
    },
    {
      id: "m4",
      title: "စီးပွားရေး ဖွံ့ဖြိုးတိုးတက်မှုနှင့် မြန်မာ့လူမှုအဖွဲ့အစည်း",
      subject: "လူမှုဗေဒနှင့် စီးပွားရေး (Sociology & Economics)",
      correctDdc: "300",
      options: [
        { code: "100", label: "100 - ဒဿနိကဗေဒနှင့် စိတ်ပညာ (Philosophy)" },
        { code: "300", label: "300 - လူမှုရေးသိပ္ပံ (Social Sciences)" },
        { code: "600", label: "600 - နည်းပညာနှင့် အသုံးချသိပ္ပံ (Technology)" },
        { code: "700", label: "700 - အနုပညာနှင့် အပန်းဖြေခြင်း (Arts & Recreation)" }
      ]
    },
    {
      id: "m5",
      title: "စိုက်ပျိုးရေးသိပ္ပံနှင့် ခေတ်မီ ဆေးဝါးထုတ်လုပ်မှုနည်းပညာ",
      subject: "ဆေးဘက်ဆိုင်ရာနှင့် စိုက်ပျိုးရေး (Agriculture & Medical Sciences)",
      correctDdc: "600",
      options: [
        { code: "500", label: "500 - သဘာဝသိပ္ပံ (Natural Sciences)" },
        { code: "600", label: "600 - နည်းပညာနှင့် အသုံးချသိပ္ပံ (Technology / Applied)" },
        { code: "700", label: "700 - အနုပညာ (Arts & Recreation)" },
        { code: "300", label: "300 - လူမှုရေးသိပ္ပံ (Social Sciences)" }
      ]
    }
  ];

  // Level 2 Sorting Question Sets
  const sortPool: { id: string; books: SortBook[] }[] = [
    {
      id: "set_1",
      books: [
        { id: "s1_1", title: "Intro to Algebra", callNumber: "512" },
        { id: "s1_2", title: "Algebra Applications", callNumber: "512.02" },
        { id: "s1_3", title: "Linear Systems", callNumber: "512.3" },
        { id: "s1_4", title: "Matrix Theory", callNumber: "512.32" },
        { id: "s1_5", title: "Modern Algebra", callNumber: "512.4" }
      ]
    },
    {
      id: "set_2",
      books: [
        { id: "s2_1", title: "Buddhism History", callNumber: "294" },
        { id: "s2_2", title: "Theravada Principles", callNumber: "294.3" },
        { id: "s2_3", title: "Abhidhamma Studies", callNumber: "294.32" },
        { id: "s2_4", title: "Visuddhimagga Guide", callNumber: "294.324" },
        { id: "s2_5", title: "Zen Teachings", callNumber: "294.34" }
      ]
    },
    {
      id: "set_3",
      books: [
        { id: "s3_1", title: "Poetry Basics", callNumber: "808" },
        { id: "s3_2", title: "Myanmar Lyrics", callNumber: "808.1" },
        { id: "s3_3", title: "Creative Writing", callNumber: "808.109" },
        { id: "s3_4", title: "Short Stories", callNumber: "808.3" },
        { id: "s3_5", title: "Novel Structures", callNumber: "808.31" }
      ]
    }
  ];

  // Filter Match Questions
  const [activeMatchQuestions, setActiveMatchQuestions] = useState<MatchQuestion[]>([]);
  const [activeSortSet, setActiveSortSet] = useState<{ id: string; books: SortBook[] } | null>(null);
  const [customQuestions, setCustomQuestions] = useState<any[]>([]);
  const [aiGenerating, setAiGenerating] = useState<boolean>(false);

  useEffect(() => {
    async function fetchCustomAndInit() {
      try {
        const { getCustomQuestions } = await import("../lib/db");
        const cqs = await getCustomQuestions("ddc");
        setCustomQuestions(cqs);
        
        // Match Level 1 custom questions
        const customL1 = cqs.filter((q: any) => q.level === 1).map((q: any) => q.questionData);
        const combinedMatch = [...customL1, ...matchQuestions];
        const uncompleted = combinedMatch.filter(q => !completedMatchIds.includes(q.id));
        const pool = uncompleted.length > 0 ? uncompleted : combinedMatch;
        const selected = [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
        setActiveMatchQuestions(selected);
      } catch (err) {
        console.error("Error loading custom questions:", err);
        const uncompleted = matchQuestions.filter(q => !completedMatchIds.includes(q.id));
        const pool = uncompleted.length > 0 ? uncompleted : matchQuestions;
        const selected = [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
        setActiveMatchQuestions(selected);
      }
    }
    fetchCustomAndInit();
  }, []);

  // Initialize sorting game for Level 2
  useEffect(() => {
    if (level === 2) {
      const customL2 = customQuestions.filter((q: any) => q.level === 2).map((q: any) => q.questionData);
      const combinedSort = [...customL2, ...sortPool];
      const uncompleted = combinedSort.filter(s => !completedSortIds.includes(s.id));
      const pool = uncompleted.length > 0 ? uncompleted : combinedSort;
      const selectedSet = pool[Math.floor(Math.random() * pool.length)];
      setActiveSortSet(selectedSet);

      // Shuffle books
      const shuffled = [...selectedSet.books].sort(() => Math.random() - 0.5);
      setSortBooks(shuffled);
      setUserSorted([]);
      setSortChecked(false);
      setSortSuccess(false);
    }
  }, [level, attempts, customQuestions]);

  const handleAskAi = async () => {
    setAiGenerating(true);
    try {
      const res = await fetch("/api/lessons/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameType: "ddc", level })
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }

      // Save to firestore collection custom_questions
      const { addCustomQuestion } = await import("../lib/db");
      await addCustomQuestion("ddc", level, data);

      if (level === 1) {
        // Prepend to active questions and set index to 0
        setActiveMatchQuestions(prev => [data, ...prev]);
        setCurrentMatchIdx(0);
        setSelectedDdc(null);
        setMatchChecked(false);
      } else {
        // Set up active set immediately
        setActiveSortSet(data);
        const shuffled = [...data.books].sort(() => Math.random() - 0.5);
        setSortBooks(shuffled);
        setUserSorted([]);
        setSortChecked(false);
        setSortSuccess(false);
      }
      alert("✨ AI ဆရာတော်မှ သင့်အတွက် အသစ်စက်စက် သင်ခန်းစာမေးခွန်းတစ်ခုကို အောင်မြင်စွာ ဖန်တီးပေးလိုက်ပါပြီ။");
    } catch (err) {
      console.error(err);
      alert("AI သင်ခန်းစာ တောင်းဆိုရန် အဆင်မပြေပါ။ နောက်မှ ပြန်လည်ကြိုးစားပါ။");
    } finally {
      setAiGenerating(false);
    }
  };

  // Handle Match Option Click
  const handleOptionClick = (code: string) => {
    if (matchChecked) return;
    setSelectedDdc(code);
  };

  // Check Level 1 Match
  const checkMatchAnswer = () => {
    if (!selectedDdc || activeMatchQuestions.length === 0) return;
    const currentQ = activeMatchQuestions[currentMatchIdx];
    const correct = selectedDdc === currentQ.correctDdc;
    setIsCorrect(correct);
    setMatchChecked(true);
    if (correct) {
      setScore(prev => prev + 20); // 20 points per match
      setSessionCompletedMatches(prev => [...prev, currentQ.id]);
    }
  };

  // Move to Next Match Question or Transition
  const nextMatchQuestion = () => {
    setSelectedDdc(null);
    setMatchChecked(false);
    if (currentMatchIdx < activeMatchQuestions.length - 1) {
      setCurrentMatchIdx(prev => prev + 1);
    } else {
      // Finished Level 1, go to Level 2
      setLevel(2);
      setAttempts(0);
    }
  };

  // Move a book to User Sorted List
  const addToSorted = (book: SortBook) => {
    if (sortChecked) return;
    setUserSorted(prev => [...prev, book]);
    setSortBooks(prev => prev.filter(b => b.id !== book.id));
  };

  // Remove a book from User Sorted List
  const removeFromSorted = (book: SortBook) => {
    if (sortChecked) return;
    setSortBooks(prev => [...prev, book]);
    setUserSorted(prev => prev.filter(b => b.id !== book.id));
  };

  // Parse decimal call numbers for comparison
  const compareCallNumbers = (a: string, b: string): number => {
    return parseFloat(a) - parseFloat(b);
  };

  // Check Level 2 Sorting
  const checkSortAnswer = () => {
    if (userSorted.length !== 5) return;
    
    // Sort correctly
    const correctOrder = [...userSorted].sort((a, b) => compareCallNumbers(a.callNumber, b.callNumber));
    
    // Check if user order matches correct order
    const isSortedCorrectly = userSorted.every(
      (book, idx) => book.id === correctOrder[idx].id
    );

    setSortSuccess(isSortedCorrectly);
    setSortChecked(true);
    
    if (isSortedCorrectly) {
      setScore(prev => prev + 50); // 50 points for sorting correctly
      if (activeSortSet) {
        setSessionCompletedSort(activeSortSet.id);
      }
    }
  };

  const handleFinishGame = async () => {
    setGameFinished(true);

    const updatedMatches = [...completedMatchIds, ...sessionCompletedMatches];
    const updatedSorts = (sortSuccess && activeSortSet) ? [...completedSortIds, activeSortSet.id] : completedSortIds;

    try {
      localStorage.setItem(`sivali_completed_ddc_m_${user.id}`, JSON.stringify(updatedMatches));
      if (sortSuccess && activeSortSet) {
        localStorage.setItem(`sivali_completed_ddc_s_${user.id}`, JSON.stringify(updatedSorts));
      }
    } catch (e) {
      console.error(e);
    }

    setCompletedMatchIds(updatedMatches);
    setCompletedSortIds(updatedSorts);

    // Persist High Score inside Firestore
    try {
      await updateUserScore(user.id, "ddc", score);
    } catch (e) {
      console.error(e);
    }
  };

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    setAttempts(0);
    setCurrentMatchIdx(0);
    setSelectedDdc(null);
    setMatchChecked(false);
    setIsCorrect(false);
    setSortBooks([]);
    setUserSorted([]);
    setSortChecked(false);
    setSortSuccess(false);
    setGameFinished(false);
    setSessionCompletedMatches([]);
    setSessionCompletedSort(null);

    // Filter Match Questions
    const uncompleted = matchQuestions.filter(q => !completedMatchIds.includes(q.id));
    const pool = uncompleted.length > 0 ? uncompleted : matchQuestions;
    const selected = [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
    setActiveMatchQuestions(selected);
  };

  const clearCompletionHistory = () => {
    try {
      localStorage.removeItem(`sivali_completed_ddc_m_${user.id}`);
      localStorage.removeItem(`sivali_completed_ddc_s_${user.id}`);
    } catch (e) {
      console.error(e);
    }
    setCompletedMatchIds([]);
    setCompletedSortIds([]);
    setSessionCompletedMatches([]);
    setSessionCompletedSort(null);
    setLevel(1);
    setScore(0);
    setAttempts(0);
    setCurrentMatchIdx(0);
    setSelectedDdc(null);
    setMatchChecked(false);
    setIsCorrect(false);
    setSortBooks([]);
    setUserSorted([]);
    setSortChecked(false);
    setSortSuccess(false);
    setGameFinished(false);

    const selected = [...matchQuestions].sort(() => Math.random() - 0.5).slice(0, 3);
    setActiveMatchQuestions(selected);
  };

  if (activeMatchQuestions.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 text-center text-white" id="ddc-loading">
        လေ့ကျင့်ခန်းများ ပြင်ဆင်နေပါသည်...
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6" id="ddc-game-root">
      {/* Header Glassmorphism */}
      <div className="glass-card p-6 rounded-3xl mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Book className="text-cyan-400 w-7 h-7" />
            <span>Dewey Decimal (DDC) အမျိုးအစားခွဲနည်း</span>
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            စာကြည့်တိုက်သုံး ဆယ်စုစိတ် စနစ်ဖြင့် စာအုပ်များကို အမှတ်စဉ်ခွဲခြင်း လေ့ကျင့်ခန်း
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={handleAskAi}
            disabled={aiGenerating}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-pink-500/20 hover:bg-pink-500/35 border border-pink-500/30 hover:border-pink-500/50 text-pink-300 transition-all cursor-pointer shadow-lg animate-pulse"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{aiGenerating ? "Generating..." : "AI သင်ခန်းစာသစ် တောင်းမည်"}</span>
          </button>
          <div className="bg-white/10 px-3 py-2 rounded-2xl border border-white/20 text-center">
            <div className="text-[10px] text-slate-400">လက်ရှိအမှတ်</div>
            <div className="text-lg font-extrabold text-cyan-400">{score} pts</div>
          </div>
          <button 
            onClick={onBack}
            className="px-3 py-2 rounded-xl border border-white/10 hover:bg-white/10 text-white text-sm transition-all cursor-pointer"
          >
            ထွက်မည်
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!gameFinished ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {level === 1 ? (
              /* LEVEL 1: DDC CATEGORY MATCH */
              <div className="glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-cyan-500/10 text-cyan-400 border-l border-b border-cyan-500/20 px-4 py-1.5 text-xs font-semibold rounded-bl-2xl">
                  အဆင့် ၁ - ပင်မအုပ်စုတွဲခြင်း (Level 1/2)
                </div>

                <div className="mb-6">
                  <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
                    မေးခွန်း {currentMatchIdx + 1} / {activeMatchQuestions.length}
                  </span>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-400 transition-all duration-300"
                      style={{ width: `${((currentMatchIdx + 1) / activeMatchQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xs text-slate-400 mb-1">စာအုပ်အမည် -</h3>
                  <div className="text-2xl font-bold text-white tracking-wide leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/10">
                    {activeMatchQuestions[currentMatchIdx].title}
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-sm text-cyan-300">
                    <HelpCircle className="w-4 h-4 text-cyan-400" />
                    <span>စာအုပ်အကြောင်းအရာ - <b>{activeMatchQuestions[currentMatchIdx].subject}</b></span>
                  </div>
                </div>

                {/* Grid of Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {activeMatchQuestions[currentMatchIdx].options.map((option) => {
                    const isSelected = selectedDdc === option.code;
                    const isCorrectOption = option.code === activeMatchQuestions[currentMatchIdx].correctDdc;
                    
                    let cardStyle = "glass-card text-left p-4 rounded-2xl transition-all cursor-pointer flex items-center justify-between border border-white/10 text-white hover:bg-white/10";
                    if (isSelected && !matchChecked) {
                      cardStyle = "bg-cyan-500/20 border-cyan-400 text-cyan-300 text-left p-4 rounded-2xl transition-all cursor-pointer flex items-center justify-between";
                    } else if (matchChecked) {
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
                        key={option.code}
                        onClick={() => handleOptionClick(option.code)}
                        disabled={matchChecked}
                        className={cardStyle}
                      >
                        <span className="font-medium">{option.label}</span>
                        {matchChecked && isCorrectOption && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                        {matchChecked && isSelected && !isCorrectOption && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Footer Controls */}
                <div className="flex justify-end gap-4 items-center border-t border-white/10 pt-6">
                  {!matchChecked ? (
                    <button
                      onClick={checkMatchAnswer}
                      disabled={!selectedDdc}
                      className={`px-6 py-3 rounded-2xl font-semibold transition-all flex items-center gap-2 ${
                        selectedDdc 
                          ? "liquid-button text-white cursor-pointer" 
                          : "bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      အဖြေစစ်မည်
                    </button>
                  ) : (
                    <button
                      onClick={nextMatchQuestion}
                      className="px-6 py-3 rounded-2xl font-semibold liquid-button flex items-center gap-2"
                    >
                      <span>ရှေ့သို့</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* LEVEL 2: DECIMAL ORDER SORTING */
              <div className="glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-purple-500/10 text-purple-400 border-l border-b border-purple-500/20 px-4 py-1.5 text-xs font-semibold rounded-bl-2xl">
                  အဆင့် ၂ - ဒဿမစနစ် စင်တင်ခြင်း (Level 2/2)
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">Shelf Decimal Organization</h3>
                  <p className="text-sm text-slate-300">
                    အောက်ပါ စာအုပ်များကို DDC နံပါတ် အငယ်မှ အကြီးသို့ စနစ်တကျ စီပေးပါ (အောက်ဆုံးမှ စာအုပ်ကို အရင်နှိပ်ပါ)။
                  </p>
                </div>

                {/* Source Books */}
                <div className="mb-6">
                  <h4 className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                    စာအုပ်စင်အောက်ရှိ ရွေးချယ်ရန် စာအုပ်များ
                  </h4>
                  <div className="flex flex-wrap gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 min-h-[90px] items-center">
                    {sortBooks.length === 0 && userSorted.length === 0 && (
                      <div className="text-center w-full text-slate-500 text-sm">Loading books...</div>
                    )}
                    {sortBooks.length === 0 && userSorted.length > 0 && !sortChecked && (
                      <div className="text-center w-full text-slate-400 text-xs">စာအုပ်အားလုံး စီပြီးပါပြီ။ အဖြေစစ်မည်ကို နှိပ်ပါ။</div>
                    )}
                    
                    <AnimatePresence>
                      {sortBooks.map((book) => (
                        <motion.button
                          key={book.id}
                          layoutId={book.id}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.9, opacity: 0 }}
                          onClick={() => addToSorted(book)}
                          className="glass-card hover:border-cyan-400/50 p-3 rounded-xl flex items-center gap-2 text-white text-sm cursor-pointer transition-all"
                        >
                          <Book className="w-4 h-4 text-cyan-400" />
                          <span className="font-mono bg-cyan-950/50 text-cyan-300 px-2 py-0.5 rounded text-xs border border-cyan-900">
                            {book.callNumber}
                          </span>
                          <span className="truncate max-w-[120px]">{book.title}</span>
                        </motion.button>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Animated Liquid Style Shelf */}
                <div className="mb-8">
                  <h4 className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2 flex justify-between items-center">
                    <span>တန်းစီပြီးသား စာအုပ်စင် (အငယ်မှ အကြီးစဥ်)</span>
                    {userSorted.length > 0 && !sortChecked && (
                      <span className="text-xs text-purple-400 italic">ပြန်ထုတ်ရန် စာအုပ်ကို နှိပ်ပါ</span>
                    )}
                  </h4>
                  
                  <div className="relative bg-gradient-to-r from-purple-950/20 to-indigo-950/20 border-2 border-dashed border-purple-500/20 rounded-3xl p-6 min-h-[160px] flex flex-wrap gap-4 items-end justify-center">
                    
                    {/* Shelf bottom wood visual effect in glass style */}
                    <div className="absolute bottom-2 left-4 right-4 h-3 bg-white/10 rounded-full border border-white/15 shadow-[0_5px_15px_rgba(0,0,0,0.5)]" />
                    
                    {userSorted.length === 0 && (
                      <div className="text-center text-slate-500 text-sm py-8 w-full select-none">
                        စာအုပ်များကို တစ်အုပ်ချင်း နှိပ်ပြီး စင်ပေါ်သို့ တင်ပါ...
                      </div>
                    )}

                    <AnimatePresence>
                      {userSorted.map((book, idx) => (
                        <motion.button
                          key={book.id}
                          layoutId={book.id}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 20, opacity: 0 }}
                          onClick={() => removeFromSorted(book)}
                          className="z-10 bg-gradient-to-b from-white/15 to-white/5 border border-white/25 rounded-xl p-4 w-[110px] flex flex-col items-center shadow-lg hover:border-purple-400/50 transition-all text-center"
                        >
                          <div className="text-[10px] text-purple-300 font-extrabold uppercase mb-1">
                            အုပ်ရေ {idx + 1}
                          </div>
                          <span className="font-mono text-cyan-300 font-bold bg-slate-900/60 px-2 py-0.5 rounded text-sm mb-2 border border-slate-800">
                            {book.callNumber}
                          </span>
                          <span className="text-xs text-white truncate w-full font-medium">
                            {book.title}
                          </span>
                        </motion.button>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Sorting Feedback Messages */}
                {sortChecked && (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`p-4 rounded-2xl mb-6 border flex items-center gap-3 ${
                      sortSuccess 
                        ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-200" 
                        : "bg-red-500/20 border-red-500/30 text-red-200"
                    }`}
                  >
                    {sortSuccess ? (
                      <>
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                        <div>
                          <div className="font-bold">ထူးချွန်ပါတယ်! စာအုပ်များအားလုံး စနစ်တကျ မှန်ကန်စွာ စီစဉ်ပြီးပါပြီ။</div>
                          <div className="text-xs text-emerald-300/80 mt-0.5">DDC နံပါတ်များကို ကိန်းဂဏန်း ဒဿမတန်ဖိုးများအတိုင်း တန်းစီရခြင်းဖြစ်ပါသည်။ (+50 pts)</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
                        <div>
                          <div className="font-bold">အဖြေမှားယွင်းနေပါသည်။ စီစဉ်ပုံ မမှန်ကန်သေးပါ။</div>
                          <div className="text-xs text-red-300/80 mt-0.5">
                            DDC စနစ်တွင် ဒဿမကိန်းများကို သမားရိုးကျမဟုတ်ဘဲ ဂဏန်းတစ်ခုချင်းစီ တန်ဖိုးအလိုက် နှိုင်းယှဉ်စီရပါသည်။ ဥပမာ - 512.02 {`<`} 512.3 {`<`} 512.32 {`<`} 512.4 ။
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}

                {/* Footer Controls */}
                <div className="flex justify-between items-center border-t border-white/10 pt-6">
                  <button
                    onClick={() => {
                      // Restart this sorting level to try again with new books
                      setAttempts(prev => prev + 1);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10 text-white text-sm transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>မေးခွန်းပြောင်းမည်</span>
                  </button>

                  <div className="flex gap-4">
                    {!sortChecked ? (
                      <button
                        onClick={checkSortAnswer}
                        disabled={userSorted.length !== 5}
                        className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                          userSorted.length === 5
                            ? "liquid-button text-white cursor-pointer"
                            : "bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed"
                        }`}
                      >
                        အဖြေစစ်မည်
                      </button>
                    ) : (
                      <button
                        onClick={handleFinishGame}
                        className="px-6 py-3 rounded-2xl font-semibold liquid-button flex items-center gap-2"
                      >
                        <span>ပြီးဆုံးပြီ</span>
                        <Award className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          /* GAME END / RESULTS SCREEN */
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-8 md:p-12 rounded-3xl text-center"
          >
            <div className="w-24 h-24 bg-gradient-to-tr from-cyan-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse" />
              <Award className="text-white w-12 h-12 z-10" />
            </div>

            <h3 className="text-3xl font-extrabold text-white mb-2">လေ့ကျင့်ခန်း ပြီးဆုံးပါပြီ။</h3>
            <p className="text-slate-300 mb-6 max-w-md mx-auto">
              စာကြည့်တိုက် Dewey Decimal Classification (DDC) ဂိမ်းကို ကစားခဲ့ပြီးပါပြီ။ သင့်စွမ်းဆောင်ရည်မှာ အောက်ပါအတိုင်း ဖြစ်ပါသည်။
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="text-xs text-slate-400">ရရှိသောအမှတ်</div>
                <div className="text-2xl font-black text-cyan-400">{score} pts</div>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="text-xs text-slate-400">လက်ရှိအဆင့်မြင့်ဆုံး</div>
                <div className="text-2xl font-black text-purple-400">
                  {Math.max(user.ddcScore, score)} pts
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 justify-center max-w-sm mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={resetGame}
                  className="px-6 py-3 rounded-2xl font-semibold border border-white/20 hover:bg-white/10 text-white transition-all flex items-center justify-center gap-2 grow"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>ထပ်မံဆော့ကစားမည်</span>
                </button>
                <button
                  onClick={onBack}
                  className="px-8 py-3 rounded-2xl font-bold liquid-button grow"
                >
                  ပင်မစာမျက်နှာသို့
                </button>
              </div>

              {(completedMatchIds.length > 0 || completedSortIds.length > 0) && (
                <button
                  onClick={clearCompletionHistory}
                  className="text-xs text-red-300/60 hover:text-red-300 underline transition-all py-1"
                >
                  လေ့ကျင့်ခန်းမှတ်တမ်းကို ဖျက်ပြီး အစမှပြန်စမည် (DDC {completedMatchIds.length + completedSortIds.length} ခု ပြီးစီး)
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
