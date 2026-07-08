import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlignLeft, Award, CheckCircle2, AlertCircle, RefreshCw, ArrowRight } from "lucide-react";
import { updateUserScore } from "../lib/db";
import { UserProfile } from "../types";

interface FilingGameProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onBack: () => void;
}

interface FileBook {
  id: string;
  title: string;
  author: string;
  filedAs: string; // The representation used for sorting calculation
  ruleExplanation?: string;
}

export default function FilingGame({ user, onUpdateUser, onBack }: FilingGameProps) {
  const [level, setLevel] = useState<1 | 2>(1); // Level 1: English (A, An, The rules), Level 2: Myanmar alphabetical
  const [score, setScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [gameFinished, setGameFinished] = useState<boolean>(false);

  // Completed lists from localStorage
  const [completedFilingIds, setCompletedFilingIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(`sivali_completed_filing_${user.id}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [sessionCompleted, setSessionCompleted] = useState<string[]>([]);
  const [currentSetId, setCurrentSetId] = useState<string>("");

  // States for sorting
  const [shuffledBooks, setShuffledBooks] = useState<FileBook[]>([]);
  const [userSorted, setUserSorted] = useState<FileBook[]>([]);
  const [checked, setChecked] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  // Level 1 english pools
  const level1Pools = [
    {
      id: "l1_setA",
      books: [
        { id: "e1", title: "The Great Gatsby", author: "F. Scott Fitzgerald", filedAs: "Great Gatsby, The", ruleExplanation: "Library rule: Ignore initial article 'The' when sorting." },
        { id: "e2", title: "A Farewell to Arms", author: "Ernest Hemingway", filedAs: "Farewell to Arms, A", ruleExplanation: "Library rule: Ignore initial article 'A' when sorting." },
        { id: "e3", title: "Animal Farm", author: "George Orwell", filedAs: "Animal Farm", ruleExplanation: "Starts with content word 'Animal'." },
        { id: "e4", title: "The Hobbit", author: "J.R.R. Tolkien", filedAs: "Hobbit, The", ruleExplanation: "Library rule: Ignore initial article 'The' when sorting." },
        { id: "e5", title: "An Inconvenient Truth", author: "Al Gore", filedAs: "Inconvenient Truth, An", ruleExplanation: "Library rule: Ignore initial article 'An' when sorting." }
      ]
    },
    {
      id: "l1_setB",
      books: [
        { id: "e6", title: "A Tale of Two Cities", author: "Charles Dickens", filedAs: "Tale of Two Cities, A", ruleExplanation: "Library rule: Ignore initial article 'A' when sorting." },
        { id: "e7", title: "The Old Man and the Sea", author: "Ernest Hemingway", filedAs: "Old Man and the Sea, The", ruleExplanation: "Library rule: Ignore initial article 'The' when sorting." },
        { id: "e8", title: "An Enemy of the People", author: "Henrik Ibsen", filedAs: "Enemy of the People, An", ruleExplanation: "Library rule: Ignore initial article 'An' when sorting." },
        { id: "e9", title: "Brave New World", author: "Aldous Huxley", filedAs: "Brave New World", ruleExplanation: "Starts with content word 'Brave'." },
        { id: "e10", title: "The Catcher in the Rye", author: "J.D. Salinger", filedAs: "Catcher in the Rye, The", ruleExplanation: "Library rule: Ignore initial article 'The' when sorting." }
      ]
    }
  ];

  // Level 2 Myanmar Pools
  const level2Pools = [
    {
      id: "l2_setA",
      books: [
        { id: "m1", title: "ကဗျာပေါင်းချုပ်", author: "ကဗျာမောင်", filedAs: "က", ruleExplanation: "ဗျည်းအက္ခရာ 'က' ဖြင့် စတင်ပါသည်။" },
        { id: "m2", title: "ခရီးသွားမှတ်စုများ", author: "ခိုင်ကြည်ဝင်း", filedAs: "ခ", ruleExplanation: "ဗျည်းအက္ခရာ 'ခ' ဖြင့် စတင်ပါသည်။" },
        { id: "m3", title: "ငြိမ်းချမ်းရေးစာတမ်း", author: "ငြိမ်းသူ", filedAs: "င", ruleExplanation: "ဗျည်းအက္ခရာ 'င' ဖြင့် စတင်ပါသည်။" },
        { id: "m4", title: "စုံထောက်ဦးစံရှား", author: "စံမြတ်ထွန်း", filedAs: "စ", ruleExplanation: "ဗျည်းအက္ခရာ 'စ' ဖြင့် စတင်ပါသည်။" },
        { id: "m5", title: "ညဉ့်နက်သန်းခေါင်ယံ", author: "ညိုမြ", filedAs: "ည", ruleExplanation: "ဗျည်းအက္ခရာ 'ည' ဖြင့် စတင်ပါသည်။" }
      ]
    },
    {
      id: "l2_setB",
      books: [
        { id: "m6", title: "ဃမ္ပနီလုပ်ငန်းရှင်များ", author: "ဦးသန်းမောင်", filedAs: "ဃ", ruleExplanation: "ဗျည်းအက္ခရာ 'ဃ' ဖြင့် စတင်ပါသည်။" },
        { id: "m7", title: "ဇာတာရှင်၏ ဘဝမှတ်တမ်း", author: "ဆရာကြီးဦးတင်", filedAs: "ဇ", ruleExplanation: "ဗျည်းအက္ခရာ 'ဇ' ဖြင့် စတင်ပါသည်။" },
        { id: "m8", title: "ဍက္ကစာပေသမိုင်း", author: "ဒေါက်တာအောင်ဝင်း", filedAs: "ဍ", ruleExplanation: "ဗျည်းအက္ခရာ 'ဍ' ဖြင့် စတင်ပါသည်။" },
        { id: "m9", title: "ဌာနဆိုင်ရာ လုပ်ငန်းလမ်းညွှန်", author: "ဦးဘိုးလှ", filedAs: "ဌ", ruleExplanation: "ဗျည်းအက္ခရာ 'ဌ' ဖြင့် စတင်ပါသည်။" },
        { id: "m10", title: "ဏမိတ်ဆွေများ", author: "မောင်ကြည်လွင်", filedAs: "ဏ", ruleExplanation: "ဗျည်းအက္ခရာ 'ဏ' ဖြင့် စတင်ပါသည်။" }
      ]
    }
  ];

  useEffect(() => {
    const pools = level === 1 ? level1Pools : level2Pools;
    const uncompleted = pools.filter(p => !completedFilingIds.includes(p.id));
    const activePool = uncompleted.length > 0 ? uncompleted[0] : pools[0];
    
    setCurrentSetId(activePool.id);
    const shuffled = [...activePool.books].sort(() => Math.random() - 0.5);
    setShuffledBooks(shuffled);
    setUserSorted([]);
    setChecked(false);
    setSuccess(false);
  }, [level, attempts]);

  const selectBook = (book: FileBook) => {
    if (checked) return;
    setUserSorted(prev => [...prev, book]);
    setShuffledBooks(prev => prev.filter(b => b.id !== book.id));
  };

  const deselectBook = (book: FileBook) => {
    if (checked) return;
    setShuffledBooks(prev => [...prev, book]);
    setUserSorted(prev => prev.filter(b => b.id !== book.id));
  };

  const checkFiling = () => {
    if (userSorted.length !== 5) return;

    // Correct alphabetical sorting based on "filedAs"
    const correctOrder = [...userSorted].sort((a, b) => 
      a.filedAs.localeCompare(b.filedAs, "en", { sensitivity: "base" })
    );

    const isCorrect = userSorted.every((b, idx) => b.id === correctOrder[idx].id);
    setSuccess(isCorrect);
    setChecked(true);

    if (isCorrect) {
      setScore(prev => prev + 50);
      setSessionCompleted(prev => [...prev, currentSetId]);
    }
  };

  const handleFinish = async () => {
    setGameFinished(true);
    const updatedCompleted = [...completedFilingIds, ...sessionCompleted];
    try {
      localStorage.setItem(`sivali_completed_filing_${user.id}`, JSON.stringify(updatedCompleted));
    } catch (e) {
      console.error(e);
    }
    setCompletedFilingIds(updatedCompleted);

    // Update score in Firestore
    await updateUserScore(user.id, "filing", score);
  };

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    setAttempts(0);
    setShuffledBooks([]);
    setUserSorted([]);
    setChecked(false);
    setSuccess(false);
    setGameFinished(false);
    setSessionCompleted([]);
  };

  const clearCompletionHistory = () => {
    try {
      localStorage.removeItem(`sivali_completed_filing_${user.id}`);
    } catch (e) {
      console.error(e);
    }
    setCompletedFilingIds([]);
    setSessionCompleted([]);
    setLevel(1);
    setScore(0);
    setAttempts(0);
    setShuffledBooks([]);
    setUserSorted([]);
    setChecked(false);
    setSuccess(false);
    setGameFinished(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6" id="filing-game-root">
      {/* Header */}
      <div className="glass-card p-6 rounded-3xl mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <AlignLeft className="text-pink-400 w-7 h-7" />
            <span>Alphabetical Filing (အက္ခရာစဉ် စီနည်း)</span>
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            စာအုပ်များကို အက္ခရာစဉ်အလိုက် (A/An/The ကနဦးစကားလုံးချန်လှပ်မှုနည်းလမ်း) စီစဉ်ခြင်းလေ့ကျင့်ခန်း
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/20 text-center">
            <div className="text-xs text-slate-400">လက်ရှိအမှတ်</div>
            <div className="text-xl font-extrabold text-pink-400">{score} pts</div>
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden"
          >
            {/* Level label */}
            <div className="absolute top-0 right-0 bg-pink-500/10 text-pink-400 border-l border-b border-pink-500/20 px-4 py-1.5 text-xs font-semibold rounded-bl-2xl">
              {level === 1 ? "အဆင့် ၁ - အင်္ဂလိပ် စာအုပ်အမည်စဥ်" : "အဆင့် ၂ - မြန်မာ အက္ခရာစဥ်"} (Level {level}/2)
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Filing Order Practice</h3>
              <p className="text-sm text-slate-300">
                {level === 1 
                  ? "အောက်ဖော်ပြပါ အင်္ဂလိပ်စာအုပ်များကို အက္ခရာစဉ် (A to Z) အလိုက် သတ်မှတ်စည်းကမ်းနှင့်အညီ စီပေးပါ။ (စကားလုံးအစရှိ A, An, The များကို ဖယ်ပြီး စီရပါမည်။)"
                  : "အောက်ဖော်ပြပါ မြန်မာစာအုပ်များကို မြန်မာဗျည်းအက္ခရာစဉ် (က၊ ခ၊ ဂ၊ ဃ၊ င...) အလိုက် စီပေးပါ။"
                }
              </p>
            </div>

            {/* Source books */}
            <div className="mb-6">
              <h4 className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                ရွေးချယ်ရန် စာအုပ်များ
              </h4>
              <div className="flex flex-wrap gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 min-h-[90px] items-center">
                {shuffledBooks.map((book) => (
                  <motion.button
                    key={book.id}
                    layoutId={book.id}
                    onClick={() => selectBook(book)}
                    className="glass-card hover:border-pink-400/50 p-3 rounded-xl flex items-center gap-2 text-white text-sm cursor-pointer transition-all"
                  >
                    <span className="bg-pink-950/50 text-pink-300 px-2.5 py-1 rounded-lg text-xs font-bold border border-pink-900">
                      {book.title[0]}
                    </span>
                    <div className="text-left">
                      <div className="font-semibold truncate max-w-[150px]">{book.title}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{book.author}</div>
                    </div>
                  </motion.button>
                ))}
                {shuffledBooks.length === 0 && userSorted.length === 0 && (
                  <div className="text-slate-500 text-sm py-4 text-center w-full">Loading...</div>
                )}
              </div>
            </div>

            {/* Shelf Display */}
            <div className="mb-8">
              <h4 className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                တန်းစီပြီးသား စာအုပ်စင် (အက္ခရာစဉ်အလိုက်)
              </h4>
              
              <div className="relative bg-gradient-to-r from-pink-950/20 to-rose-950/20 border-2 border-dashed border-pink-500/20 rounded-3xl p-6 min-h-[160px] flex flex-wrap gap-4 items-end justify-center">
                <div className="absolute bottom-2 left-4 right-4 h-3 bg-white/10 rounded-full border border-white/15" />

                {userSorted.length === 0 && (
                  <div className="text-center text-slate-500 text-sm py-8 w-full select-none">
                    စာအုပ်များကို တစ်အုပ်ချင်းစီ နှိပ်၍ စင်တင်စီစဥ်ပါ...
                  </div>
                )}

                <AnimatePresence>
                  {userSorted.map((book, idx) => (
                    <motion.button
                      key={book.id}
                      layoutId={book.id}
                      onClick={() => deselectBook(book)}
                      className="z-10 bg-gradient-to-b from-white/15 to-white/5 border border-white/25 rounded-xl p-4 w-[110px] flex flex-col items-center shadow-lg hover:border-pink-400/50 transition-all text-center"
                    >
                      <div className="text-[9px] text-pink-300 font-bold uppercase mb-1">
                        အဆင့် {idx + 1}
                      </div>
                      <span className="text-sm font-bold text-white truncate w-full mb-1">
                        {book.title}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate w-full">
                        {book.author}
                      </span>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Feedback messages */}
            {checked && (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`p-4 rounded-2xl mb-6 border flex items-center gap-3 ${
                  success 
                    ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-200" 
                    : "bg-red-500/20 border-red-500/30 text-red-200"
                }`}
              >
                {success ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-bold">မှန်ကန်ပါတယ်! အဆင့်မြင့်အမှတ်များ ရရှိခဲ့ပါသည်။</div>
                      <div className="text-xs text-emerald-300/80 mt-0.5">
                        {level === 1 
                          ? "Library Cataloging Filing စည်းမျဉ်းအရ အင်္ဂလိပ်စာအုပ်အမည်၏ ရှေ့ဆုံးပါ A, An, The များကို ချန်လှပ်၍ စီရပါမည်။"
                          : "မြန်မာဗျည်းအက္ခရာစဉ် (က၊ ခ၊ င၊ စ၊ ည...) စည်းမျဉ်းများအတိုင်း စနစ်တကျစီနိုင်ခဲ့ပါသည်။"
                        } (+50 pts)
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
                    <div>
                      <div className="font-bold">အဖြေမှားယွင်းနေပါသည်။</div>
                      <div className="text-xs text-red-300/80 mt-0.5">
                        {level === 1
                          ? "Filing စည်းမျဉ်းအရ 'The Great Gatsby' (G အက္ခရာအောက်)၊ 'A Farewell to Arms' (F အက္ခရာအောက်) တို့ကဲ့သို့ စီရပါမည်။"
                          : "မြန်မာစာအုပ်များအတွက် 'ကဗျာ' -> 'ခရီးသွား' -> 'ငြိမ်းချမ်း' -> 'စုံထောက်' -> 'ညဉ့်နက်' စသည်ဖြင့် က၊ ခ၊ င၊ စ၊ ည အက္ခရာအစဥ်အတိုင်း စီပေးရပါမည်။"
                        }
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* Controls */}
            <div className="flex justify-between items-center border-t border-white/10 pt-6">
              <button
                onClick={() => setAttempts(prev => prev + 1)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10 text-white text-sm transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>ပြန်လည်စတင်မည်</span>
              </button>

              <div className="flex gap-4">
                {!checked ? (
                  <button
                    onClick={checkFiling}
                    disabled={userSorted.length !== 5}
                    className={`px-6 py-3 rounded-2xl font-bold transition-all ${
                      userSorted.length === 5
                        ? "liquid-button text-white cursor-pointer"
                        : "bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    အဖြေစစ်မည်
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (level === 1) {
                        setLevel(2);
                      } else {
                        handleFinish();
                      }
                    }}
                    className="px-6 py-3 rounded-2xl font-bold liquid-button flex items-center gap-2"
                  >
                    <span>{level === 1 ? "အဆင့် ၂ သို့" : "ပြီးဆုံးပြီ"}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          /* FINISHED SCREEN */
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-8 md:p-12 rounded-3xl text-center max-w-xl mx-auto"
          >
            <div className="w-24 h-24 bg-gradient-to-tr from-pink-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse" />
              <Award className="text-white w-12 h-12 z-10" />
            </div>

            <h3 className="text-3xl font-extrabold text-white mb-2">အက္ခရာစဉ်လေ့ကျင့်ခန်း ပြီးပါပြီ။</h3>
            <p className="text-slate-300 mb-6 max-w-md mx-auto">
              စာအုပ်စင်များ၏ အက္ခရာစဉ်စီစဉ်မှုနည်းလမ်းများနှင့် အထူးစည်းမျဉ်းများကို ကောင်းစွာလေ့လာနိုင်ခဲ့ပါသည်။
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="text-xs text-slate-400">ရရှိသောအမှတ်</div>
                <div className="text-2xl font-black text-pink-400">{score} pts</div>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="text-xs text-slate-400">အမြင့်ဆုံးအမှတ်</div>
                <div className="text-2xl font-black text-purple-400">
                  {Math.max(user.filingScore, score)} pts
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

              {completedFilingIds.length > 0 && (
                <button
                  onClick={clearCompletionHistory}
                  className="text-xs text-red-300/60 hover:text-red-300 underline transition-all py-1"
                >
                  လေ့ကျင့်ခန်းမှတ်တမ်းကို ဖျက်ပြီး အစမှပြန်စမည် (Filing {completedFilingIds.length} ခု ပြီးစီး)
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
