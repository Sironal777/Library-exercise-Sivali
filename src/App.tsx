import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  Award, 
  User, 
  Trophy, 
  Play, 
  ChevronRight, 
  RefreshCw, 
  LogOut, 
  Info,
  Book,
  AlignLeft,
  Tags,
  Search,
  HelpCircle,
  Settings,
  Sparkles,
  Smartphone,
  ArrowDown
} from "lucide-react";
import { 
  getUserProfile, 
  findUserByUsername, 
  createUserProfile, 
  getLeaderboard 
} from "./lib/db";
import { UserProfile, ActiveScreen } from "./types";

// Import our interactive games
import DdcGame from "./components/DdcGame";
import CatalogingGame from "./components/CatalogingGame";
import FilingGame from "./components/FilingGame";
import SubjectGame from "./components/SubjectGame";
import GeneralKnowledgeGame from "./components/GeneralKnowledgeGame";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>("login");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [leaderboard, setLeaderboard] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dbLoading, setDbLoading] = useState<boolean>(false);
  
  // Auth Form State
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [userMatchFound, setUserMatchFound] = useState<UserProfile | null>(null);

  // Accessibility / Theme States
  const [theme, setTheme] = useState<"dark" | "light">(
    () => (localStorage.getItem("sivali_theme") as "dark" | "light") || "dark"
  );
  const [fontScale, setFontScale] = useState<number>(
    () => Number(localStorage.getItem("sivali_fontScale")) || 100
  );
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // PWA states
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(true);

  // Previously logged in users
  const [pastUsers, setPastUsers] = useState<UserProfile[]>([]);

  // Toggle Theme class on document Element
  useEffect(() => {
    localStorage.setItem("sivali_theme", theme);
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, [theme]);

  // Save Font Scale selection
  useEffect(() => {
    localStorage.setItem("sivali_fontScale", fontScale.toString());
  }, [fontScale]);

  // Load user, past users and PWA prompt on mount
  useEffect(() => {
    async function initUser() {
      try {
        const savedUserId = localStorage.getItem("sivali_library_userId");
        if (savedUserId) {
          const profile = await getUserProfile(savedUserId);
          if (profile) {
            setUser(profile);
            saveToPastUsers(profile);
            setActiveScreen("dashboard");
          } else {
            localStorage.removeItem("sivali_library_userId");
          }
        }
      } catch (e) {
        console.error("Local storage error:", e);
      } finally {
        setLoading(false);
      }
    }
    
    // Past users loading
    try {
      const stored = localStorage.getItem("sivali_past_users");
      if (stored) {
        setPastUsers(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }

    initUser();
    loadLeaderboard();

    // PWA event listner
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // Periodic check to verify user account is still valid and not blocked/deleted
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(async () => {
      try {
        const profile = await getUserProfile(user.id);
        if (!profile || profile.isBlocked) {
          // If profile is deleted or blocked, force logout
          handleLogout();
          alert(profile?.isBlocked 
            ? "⚠️ သင့်အကောင့်အား စနစ်စီမံခန့်ခွဲသူမှ ပိတ်ပင်ထားပါသည်။" 
            : "⚠️ သင့်အကောင့်မှာ စာရင်းမှ ဖျက်သိမ်းခံထားရပါသည်။"
          );
        } else if (profile.username !== user.username || 
                   profile.ddcScore !== user.ddcScore || 
                   profile.catalogingScore !== user.catalogingScore || 
                   profile.filingScore !== user.filingScore || 
                   profile.subjectScore !== user.subjectScore || 
                   profile.gkScore !== user.gkScore ||
                   profile.totalPoints !== user.totalPoints) {
          // If admin edited the profile (e.g. edited username or points), update state in real-time!
          setUser(profile);
        }
      } catch (err) {
        console.error("Periodic user check error:", err);
      }
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(interval);
  }, [user]);

  const saveToPastUsers = (profile: UserProfile) => {
    try {
      const stored = localStorage.getItem("sivali_past_users");
      const list: UserProfile[] = stored ? JSON.parse(stored) : [];
      const filtered = list.filter(u => u.id !== profile.id);
      filtered.unshift(profile);
      localStorage.setItem("sivali_past_users", JSON.stringify(filtered.slice(0, 5)));
      setPastUsers(filtered.slice(0, 5));
    } catch (e) {
      console.error(e);
    }
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        setShowInstallBanner(false);
      }
    } else {
      alert("ဝဘ်ဆိုဒ်ကို ဖုန်း/ကွန်ပျူတာ Home Screen ပေါ်တွင် အိုင်ကွန်အဖြစ် ထည့်သွင်းရန် - \n\n၁။ Browser ဘေးရှိ Settings (စက်ဝိုင်းပုံ သုံးစက်) ကို နှိပ်ပါ။\n၂။ 'Add to Home screen' သို့မဟုတ် 'Install App' ကို ရွေးချယ်ပေးပါ။");
    }
  };

  const handleLogoClick = () => {
    const pw = prompt("Admin Dashboard သို့ ဝင်ရောက်ရန် Password ကို ထည့်သွင်းပါ -");
    if (pw === "zawzaw123") {
      setActiveScreen("admin");
    } else if (pw !== null) {
      alert("စကားဝှက် မှားယွင်းနေပါသည်။");
    }
  };

  // Fetch leaderboard rankings
  const loadLeaderboard = async () => {
    setDbLoading(true);
    const leaders = await getLeaderboard();
    setLeaderboard(leaders);
    setDbLoading(false);
  };

  // Handle entering username
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setUserMatchFound(null);

    const name = usernameInput.trim();
    if (!name) {
      setErrorMsg("ကျေးဇူးပြု၍ အမည်တစ်ခုခု ဖြည့်စွက်ပေးပါ။");
      return;
    }
    if (name.length < 2 || name.length > 15) {
      setErrorMsg("အသုံးပြုသူအမည်သည် အနည်းဆုံး ၂ လုံးမှ အများဆုံး ၁၅ လုံးအထိသာ ဖြစ်ရပါမည်။");
      return;
    }

    setDbLoading(true);
    try {
      const existingUser = await findUserByUsername(name);
      if (existingUser) {
        // If username exists, ask them if they want to resume/login
        setUserMatchFound(existingUser);
      } else {
        // Create new user profile
        const newUser = await createUserProfile(name);
        if (newUser) {
          localStorage.setItem("sivali_library_userId", newUser.id);
          setUser(newUser);
          saveToPastUsers(newUser);
          setActiveScreen("dashboard");
          // Refresh leaderboard to include new user
          loadLeaderboard();
        } else {
          setErrorMsg("ချိတ်ဆက်မှု အဆင်မပြေဖြစ်သွားပါသည်။ ထပ်မံကြိုးစားကြည့်ပါ။");
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("စနစ်ချို့ယွင်းချက် ဖြစ်ပေါ်ခဲ့သည်။ ပြန်လည်ကြိုးစားပေးပါ။");
    } finally {
      setDbLoading(false);
    }
  };

  // Confirm and resume session for existing username
  const handleConfirmResume = (selectedUser: UserProfile) => {
    localStorage.setItem("sivali_library_userId", selectedUser.id);
    setUser(selectedUser);
    saveToPastUsers(selectedUser);
    setActiveScreen("dashboard");
    setUserMatchFound(null);
    setUsernameInput("");
    loadLeaderboard();
  };

  // Log out of profile
  const handleLogout = () => {
    localStorage.removeItem("sivali_library_userId");
    setUser(null);
    setActiveScreen("login");
    setUsernameInput("");
    setUserMatchFound(null);
  };

  // Format Date gracefully
  const formatDate = (isoStr: string) => {
    if (!isoStr) return "-";
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString("my-MM", { month: "short", day: "numeric" }) + " " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "-";
    }
  };

  return (
    <div 
      className="min-h-screen w-full relative overflow-x-hidden bg-gradient-to-b from-[#0e0720] via-[#160a2d] to-[#0a0414] font-sans text-slate-100 flex flex-col justify-between"
      style={{ fontSize: `${fontScale}%` }}
    >
      
      {/* 3D Liquid Animated Background Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-pink-500/18 blur-[100px] animate-blob-1" />
        <div className="absolute top-2/3 -right-20 w-96 h-96 rounded-full bg-purple-600/18 blur-[120px] animate-blob-2" />
        <div className="absolute top-10 right-1/4 w-85 h-85 rounded-full bg-cyan-500/12 blur-[90px] animate-blob-3" />
        <div className="absolute bottom-10 left-1/3 w-75 h-75 rounded-full bg-amber-500/8 blur-[80px] animate-blob-1" />
      </div>

      {/* Main Container */}
      <div className="w-full relative z-10 flex-1 flex flex-col">
        
        {/* Navigation Bar / App Brand */}
        <header className="w-full max-w-7xl mx-auto px-4 py-5 flex justify-between items-center border-b border-white/5 bg-white/[0.01] backdrop-blur-md">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => user && setActiveScreen("dashboard")}>
            <div 
              onClick={(e) => {
                e.stopPropagation();
                handleLogoClick();
              }}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff007f] via-[#a855f7] to-[#06b6d4] flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.5)] border border-white/20 cursor-pointer"
              title="Admin Dashboard"
            >
              <BookOpen className="text-white w-5.5 h-5.5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-display font-black tracking-wider text-white bg-gradient-to-r from-[#ff3399] via-[#d946ef] to-[#00f2fe] bg-clip-text text-transparent text-glow-pink">
                Sīvali-Library-Exercises
              </h1>
              <span className="text-[10px] font-display uppercase tracking-widest text-pink-300/80 font-bold block leading-none mt-0.5">
                LIBRARIAN TRAINING HUB
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Accessibility / Theme / Settings toggler */}
            <button
              onClick={() => setShowSettings(prev => !prev)}
              className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center justify-center"
              title="အပြင်အဆင်နှင့် စာလုံးအရွယ်အစား ချိန်ညှိရန်"
            >
              <Settings className={`w-4 h-4 ${showSettings ? "animate-spin text-pink-400" : ""}`} />
            </button>

            {user && (
              <div className="flex items-center gap-2 sm:gap-4">
                <div 
                  onClick={() => setActiveScreen("dashboard")}
                  className="hidden sm:flex items-center gap-2 bg-pink-500/10 border border-pink-500/30 px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-pink-500/20 cursor-pointer transition-all shadow-[0_0_15px_rgba(236,72,153,0.15)]"
                >
                  <User className="w-3.5 h-3.5 text-pink-400" />
                  <span className="text-white max-w-[100px] truncate font-bold">{user.username}</span>
                  <span className="bg-gradient-to-r from-[#ff007f] to-[#a855f7] text-white px-2 py-0.5 rounded-full font-black text-[10px] tracking-wide shadow-md">
                    {user.totalPoints} pts
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 rounded-xl border border-white/10 hover:bg-red-500/20 hover:border-red-500/30 text-slate-300 hover:text-red-400 transition-all cursor-pointer"
                  title="အကောင့်ထွက်မည်"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Floating Settings Drawer Panel */}
        <AnimatePresence>
          {showSettings && (
            <div className="w-full max-w-7xl mx-auto px-4 relative z-50">
              <motion.div 
                initial={{ height: 0, opacity: 0, y: -10 }}
                animate={{ height: "auto", opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -10 }}
                className="w-full max-w-md ml-auto mt-2 bg-[#120a2a]/95 border border-white/10 p-5 rounded-3xl backdrop-blur-2xl shadow-2xl text-white relative"
              >
                <div className="absolute top-4 right-4">
                  <button 
                    onClick={() => setShowSettings(false)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <h3 className="text-sm font-extrabold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                  <Settings className="w-4 h-4 text-pink-400" />
                  <span>Accessibility Settings (ချိန်ညှိမှုများ)</span>
                </h3>
                
                {/* Theme selection */}
                <div className="flex justify-between items-center mb-5">
                  <span className="text-xs text-slate-300 font-bold">Theme (နောက်ခံအရောင်)</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTheme("dark")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        theme === "dark" 
                          ? "bg-purple-500/20 border-purple-400 text-purple-200"
                          : "border-white/10 text-slate-400 hover:bg-white/5"
                      }`}
                    >
                      Dark Mode
                    </button>
                    <button
                      onClick={() => setTheme("light")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        theme === "light" 
                          ? "bg-pink-500/20 border-pink-400 text-pink-700"
                          : "border-white/10 text-slate-400 hover:bg-white/5"
                      }`}
                    >
                      Light Mode
                    </button>
                  </div>
                </div>

                {/* Font Scale select */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-300 font-bold">
                    <span>စာလုံးအက္ခရာအရွယ်အစား (Font Scale)</span>
                    <span className="text-pink-400 font-extrabold">{fontScale}%</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="160"
                    step="10"
                    value={fontScale}
                    onChange={(e) => setFontScale(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Normal (ပုံမှန်)</span>
                    <span>Medium (အလတ်)</span>
                    <span>Large (အကြီး)</span>
                    <span>Huge (အလွန်ကြီး)</span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Content Route Controller */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:py-10 flex flex-col justify-center">
          {/* PWA Banner Prompter */}
          {showInstallBanner && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-3xl bg-[#1c0f3d]/80 border border-pink-500/30 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                  <Smartphone className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">Sīvali Library App ကို သင့်ဖုန်း/ကွန်ပျူတာပေါ်တွင် Install လုပ်ပါ</h4>
                  <p className="text-xs text-slate-300">Home Screen ပေါ်တွင် အချိန်မရွေး လျင်မြန်စွာ လေ့ကျင့်ခန်းများ ဝင်ရောက်ဖြေဆိုနိုင်ရန် ထည့်သွင်းထားပါ</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleInstallClick}
                  className="px-4 py-2 bg-pink-500 hover:bg-pink-600 border border-pink-400 text-white font-bold text-xs rounded-2xl cursor-pointer transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(236,72,153,0.4)]"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                  <span>Install လုပ်မည်</span>
                </button>
                <button
                  onClick={() => setShowInstallBanner(false)}
                  className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold rounded-2xl cursor-pointer transition-all"
                >
                  ပိတ်မည်
                </button>
              </div>
            </motion.div>
          )}

          {loading ? (
            <div className="text-center py-20">
              <RefreshCw className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
              <p className="text-slate-400 font-medium">စနစ်ကို ပြင်ဆင်နေပါသည်...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeScreen === "login" && (
                /* AUTHENTICATION LOGIN SCREEN */
                <motion.div
                  key="login_screen"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-md w-full mx-auto"
                >
                  <div className="glass-card p-8 rounded-3xl relative overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.5)] border border-white/15">
                    {/* Visual Highlights */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/15 rounded-full blur-2xl animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/15 rounded-full blur-2xl" />

                    <div className="text-center mb-8 relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-tr from-[#ff007f] via-[#a855f7] to-[#06b6d4] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_25px_rgba(236,72,153,0.4)] border border-white/25">
                        <BookOpen className="text-white w-8 h-8" />
                      </div>
                      <h2 className="text-2xl font-display font-black text-white leading-snug tracking-tight bg-gradient-to-r from-pink-400 via-fuchsia-300 to-cyan-400 bg-clip-text text-transparent text-glow-pink">
                        Sīvali Library Science
                      </h2>
                      <p className="text-slate-200 text-sm mt-2.5 font-semibold">
                        ကတ်တလောက်၊ ဒေါ့ဝေးဒသမစနစ်နှင့် စာကြည့်တိုက်လေ့ကျင့်ခန်းများ
                      </p>
                    </div>

                    {!userMatchFound ? (
                      /* Name input form */
                      <form onSubmit={handleAuthSubmit} className="space-y-6 relative z-10">
                        <div>
                          <label className="text-xs text-slate-400 font-bold block mb-2 uppercase tracking-wider">
                            သင့်အမည်ကို ဖြည့်သွင်းပါ (Name/Nickname)
                          </label>
                          <input
                            type="text"
                            value={usernameInput}
                            onChange={(e) => setUsernameInput(e.target.value)}
                            placeholder="ဥပမာ - စောမင်းနိုင်"
                            disabled={dbLoading}
                            className="w-full px-4 py-3.5 rounded-2xl glass-input text-base text-white placeholder-slate-500"
                          />
                          {errorMsg && (
                            <div className="text-xs text-red-400 font-semibold mt-2 flex items-center gap-1.5">
                              <Info className="w-3.5 h-3.5 shrink-0" />
                              <span>{errorMsg}</span>
                            </div>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={dbLoading}
                          className="w-full py-4 rounded-2xl font-bold liquid-button text-base flex items-center justify-center gap-2"
                        >
                          {dbLoading ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              <span>စတင်လေ့ကျင့်မည်</span>
                              <ChevronRight className="w-5 h-5" />
                            </>
                          )}
                        </button>
                      </form>
                    ) : (
                      /* Name match alert / choose to resume */
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6 text-center relative z-10"
                      >
                        <div className="bg-purple-500/10 border border-purple-500/20 p-5 rounded-2xl text-slate-200 text-sm leading-relaxed">
                          <p className="font-bold text-purple-300 mb-1">အမည်တူတစ်ဦး ရှိနှင့်ပြီးသားဖြစ်ပါသည်!</p>
                          <p className="text-xs text-slate-400">
                            <b>"{userMatchFound.username}"</b> အမည်ဖြင့် စုစုပေါင်းရမှတ် <b>{userMatchFound.totalPoints} pts</b> ဖြင့် ယခင်က ကစားခဲ့ဖူးပါသည်။
                          </p>
                        </div>

                        <div className="flex flex-col gap-3">
                          <button
                            onClick={() => handleConfirmResume(userMatchFound)}
                            className="w-full py-3.5 rounded-2xl font-bold liquid-button text-sm cursor-pointer"
                          >
                            ဟုတ်ကဲ့၊ ကျွန်ုပ်အကောင့်ဖြစ်ပါသည် (ပြန်ဝင်မည်)
                          </button>
                          <button
                            onClick={() => {
                              setUserMatchFound(null);
                              setUsernameInput("");
                            }}
                            className="w-full py-3 rounded-2xl border border-white/10 hover:bg-white/5 text-slate-300 text-xs transition-all cursor-pointer"
                          >
                            အခြားအမည်သစ်တစ်ခု ရွေးချယ်မည်
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Saved Profiles (Previously Logged In Names on this device) */}
                    {pastUsers.length > 0 && !userMatchFound && (
                      <div className="mt-6 pt-6 border-t border-white/10 relative z-10">
                        <label className="text-[10px] text-pink-300 font-bold block mb-3 uppercase tracking-wider text-center">
                          ယခင်က ဝင်ရောက်ဖူးသော အကောင့်များ (Saved Profiles)
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {pastUsers.map((profile) => (
                            <button
                              key={profile.id}
                              type="button"
                              onClick={() => handleConfirmResume(profile)}
                              className="text-left p-3 rounded-2xl bg-white/[0.03] hover:bg-pink-500/10 border border-white/5 hover:border-pink-500/30 text-white text-xs transition-all cursor-pointer flex flex-col justify-between group"
                            >
                              <span className="font-bold text-slate-200 group-hover:text-pink-300 block truncate">{profile.username}</span>
                              <span className="text-slate-400 font-mono text-[10px] mt-1">{profile.totalPoints || 0} pts</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-slate-500">
                      Sīvali Cataloging & Classification Suite v1.1
                    </div>
                  </div>
                </motion.div>
              )}

              {activeScreen === "dashboard" && user && (
                /* MAIN HUB / DASHBOARD */
                <motion.div
                  key="dashboard_screen"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                >
                  
                  {/* Left Column: User Profile & Quick Leaderboard */}
                  <div className="lg:col-span-4 space-y-6">
                    {/* User Glass Stats */}
                    <div className="glass-card p-6 rounded-3xl relative overflow-hidden border border-white/20">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/10 rounded-full blur-xl" />
                      
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-tr from-[#ff007f] to-[#a855f7] rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                          <User className="text-white w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-xs text-pink-300 font-bold tracking-wider uppercase">ကြိုဆိုပါသည်</div>
                          <div className="text-lg font-display font-black text-white text-glow-pink">{user.username}</div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 p-4 rounded-2xl border border-pink-500/20 flex justify-between items-center mb-4 shadow-inner">
                        <span className="text-xs text-slate-200 font-bold">စုစုပေါင်းလေ့ကျင့်မှုရမှတ်</span>
                        <span className="text-2xl font-display font-black text-pink-400 text-glow-pink">{user.totalPoints} pts</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                          <div className="text-slate-400">DDC ခွဲခြားခြင်း</div>
                          <div className="font-bold text-white mt-1">{user.ddcScore} pts</div>
                        </div>
                        <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                          <div className="text-slate-400">ကတ်တလောက်သွင်းခြင်း</div>
                          <div className="font-bold text-white mt-1">{user.catalogingScore} pts</div>
                        </div>
                        <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                          <div className="text-slate-400">အက္ခရာစဉ်စီခြင်း</div>
                          <div className="font-bold text-white mt-1">{user.filingScore} pts</div>
                        </div>
                        <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                          <div className="text-slate-400 font-sans">Subject Headings</div>
                          <div className="font-bold text-white mt-1">{user.subjectScore} pts</div>
                        </div>
                        <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/5 col-span-2 text-center">
                          <div className="text-pink-300 font-bold">General Knowledge</div>
                          <div className="font-bold text-white mt-1">{user.gkScore || 0} pts</div>
                        </div>
                      </div>
                    </div>

                    {/* Global Leaderboard Section */}
                    <div className="glass-card p-6 rounded-3xl border border-white/15">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-black text-white flex items-center gap-2">
                          <Trophy className="text-yellow-400 w-4.5 h-4.5" />
                          <span>ထိပ်တန်းအမှတ်စာရင်းဘုတ်</span>
                        </h3>
                        <button 
                          onClick={loadLeaderboard}
                          disabled={dbLoading}
                          className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-all"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${dbLoading ? "animate-spin" : ""}`} />
                        </button>
                      </div>

                      <div className="max-h-[280px] overflow-y-auto space-y-2 pr-1">
                        {leaderboard.map((leader, index) => {
                          const isCurrentUser = leader.id === user.id;
                          return (
                            <div 
                              key={leader.id} 
                              className={`flex justify-between items-center p-2.5 rounded-xl border transition-all ${
                                isCurrentUser 
                                  ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-500/40 shadow-[0_4px_15px_rgba(236,72,153,0.25)]" 
                                  : "bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-pink-500/10"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className={`w-5 text-center text-xs font-display font-black ${
                                  index === 0 ? "text-yellow-400" : index === 1 ? "text-slate-300" : index === 2 ? "text-amber-500" : "text-slate-500"
                                }`}>
                                  {index + 1}
                                </span>
                                <span className={`text-xs truncate font-bold ${isCurrentUser ? "text-pink-300" : "text-white"} max-w-[120px]`}>
                                  {leader.username}
                                </span>
                              </div>
                              <div className="text-right flex items-center gap-1.5">
                                <span className={`font-display text-xs font-black ${isCurrentUser ? "text-pink-400 text-glow-pink" : "text-cyan-300"}`}>
                                  {leader.totalPoints} pts
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Game Module Selectors */}
                  <div className="lg:col-span-8 space-y-6">
                    <div className="p-6 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 border border-pink-500/25 rounded-3xl shadow-[0_8px_30px_rgba(236,72,153,0.1)]">
                      <h3 className="text-lg font-display font-black text-white text-glow-pink mb-1">လေ့ကျင့်ရေး မော်ဂျူးများ ရွေးချယ်ရန်</h3>
                      <p className="text-xs text-pink-200 font-semibold">စာကြည့်တိုက်ပညာရှင်ဖြစ်ရန် လိုအပ်သည့် အရည်အချင်းများကို အမျိုးအစားစုံလင်စွာ လေ့ကျင့်နိုင်မည့် ဂိမ်းများ</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* DDC Classification Game */}
                      <div className="glass-card p-6 rounded-3xl border border-white/15 flex flex-col justify-between hover:border-pink-400/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)] transition-all group">
                        <div>
                          <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-4 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.2)]">
                            <Book className="w-5 h-5" />
                          </div>
                          <h4 className="text-base font-black text-white">Dewey Decimal (DDC)</h4>
                          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                            စာအုပ်ခေါင်းစဉ်အလိုက် သက်ဆိုင်ရာ ဆယ်စုစိတ်နံပါတ် (000-900) ရွေးချယ်ခြင်းနှင့် စာအုပ်နံပါတ် ဒဿမတန်ဖိုးစဉ်အလိုက် စနစ်တကျစီနည်း ဂိမ်း
                          </p>
                        </div>
                        <div className="mt-6 flex justify-between items-center">
                          <span className="text-[10px] text-slate-400 font-mono">High Score: {user.ddcScore} pts</span>
                          <button 
                            onClick={() => setActiveScreen("game_ddc")}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-white flex items-center gap-1 group-hover:bg-pink-500/20 group-hover:border-pink-500 group-hover:text-pink-300 transition-all cursor-pointer"
                          >
                            <span>ကစားမည်</span>
                            <Play className="w-3 h-3 fill-current" />
                          </button>
                        </div>
                      </div>

                      {/* Cataloging MARC Field Game */}
                      <div className="glass-card p-6 rounded-3xl border border-white/15 flex flex-col justify-between hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all group">
                        <div>
                          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <h4 className="text-base font-black text-white">MARC Cataloging Details</h4>
                          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                            စာအုပ်၏ မျက်နှာဖုံးအချက်အလက် (Title page) များကို ဆန်းစစ်ပြီး RDA/MARC standard (ခေါင်းစဉ်၊ ရေးသူ၊ ထုတ်ဝေမှု) ရေးသွင်းနည်း လေ့ကျင့်ခန်း
                          </p>
                        </div>
                        <div className="mt-6 flex justify-between items-center">
                          <span className="text-[10px] text-slate-400 font-mono">High Score: {user.catalogingScore} pts</span>
                          <button 
                            onClick={() => setActiveScreen("game_catalog")}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-white flex items-center gap-1 group-hover:bg-purple-500/20 group-hover:border-purple-500 group-hover:text-purple-300 transition-all cursor-pointer"
                          >
                            <span>ကစားမည်</span>
                            <Play className="w-3 h-3 fill-current" />
                          </button>
                        </div>
                      </div>

                      {/* Alphabetical Shelf Filing Game */}
                      <div className="glass-card p-6 rounded-3xl border border-white/15 flex flex-col justify-between hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all group">
                        <div>
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 text-amber-400 shadow-[0_0_10px_rgba(249,115,22,0.2)]">
                            <AlignLeft className="w-5 h-5" />
                          </div>
                          <h4 className="text-base font-black text-white">Alphabetical Shelf Filing</h4>
                          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                            စာအုပ်စင်များပေါ်တွင် စာအုပ်အမည်အင်္ဂလိပ်၊ မြန်မာဗျည်းအက္ခရာအစီအစဉ်နှင့် အစချီစကားလုံး (A, An, The) လျစ်လျူရှုမှု စည်းမျဉ်းလေ့ကျင့်ခန်း
                          </p>
                        </div>
                        <div className="mt-6 flex justify-between items-center">
                          <span className="text-[10px] text-slate-400 font-mono">High Score: {user.filingScore} pts</span>
                          <button 
                            onClick={() => setActiveScreen("game_filing")}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-white flex items-center gap-1 group-hover:bg-amber-500/20 group-hover:border-amber-500 group-hover:text-amber-300 transition-all cursor-pointer"
                          >
                            <span>ကစားမည်</span>
                            <Play className="w-3 h-3 fill-current" />
                          </button>
                        </div>
                      </div>

                      {/* Subject Headings Game */}
                      <div className="glass-card p-6 rounded-3xl border border-white/15 flex flex-col justify-between hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all group">
                        <div>
                          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                            <Tags className="w-5 h-5" />
                          </div>
                          <h4 className="text-base font-black text-white">Subject Headings (ခေါင်းစဉ်သတ်မှတ်ခြင်း)</h4>
                          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                            စာအုပ်များ၏အကျဉ်းချုပ် အညွှန်းစာများကို ဖတ်ရှုပြီး စာကြည့်တိုက်သုံးခေါင်းစဉ် (Subject terms) များ စနစ်တကျ သတ်မှတ်ရွေးချယ်မှု လေ့ကျင့်ခန်း
                          </p>
                        </div>
                        <div className="mt-6 flex justify-between items-center">
                          <span className="text-[10px] text-slate-400 font-mono">High Score: {user.subjectScore} pts</span>
                          <button 
                            onClick={() => setActiveScreen("game_subject")}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-white flex items-center gap-1 group-hover:bg-cyan-500/20 group-hover:border-cyan-500 group-hover:text-cyan-300 transition-all cursor-pointer"
                          >
                            <span>ကစားမည်</span>
                            <Play className="w-3 h-3 fill-current" />
                          </button>
                        </div>
                      </div>

                      {/* General Knowledge Quiz Game */}
                      <div className="glass-card p-6 rounded-3xl border border-white/15 flex flex-col justify-between hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)] transition-all group">
                        <div>
                          <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-4 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.2)]">
                            <HelpCircle className="w-5 h-5" />
                          </div>
                          <h4 className="text-base font-black text-white">General Knowledge (အထွေထွေဗဟုသုတ)</h4>
                          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                            စာကြည့်တိုက်နှင့် သတင်းအချက်အလက်သိပ္ပံပညာရပ်ဆိုင်ရာ အခြေခံသဘောတရားများ၊ နိုင်ငံတကာစံနှုန်းများနှင့် အထွေထွေဗဟုသုတမေးခွန်းများ ဖြေဆိုခြင်း လေ့ကျင့်ခန်း
                          </p>
                        </div>
                        <div className="mt-6 flex justify-between items-center">
                          <span className="text-[10px] text-slate-400 font-mono">High Score: {user.gkScore || 0} pts</span>
                          <button 
                            onClick={() => setActiveScreen("game_gk")}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-white flex items-center gap-1 group-hover:bg-pink-500/20 group-hover:border-pink-500 group-hover:text-pink-300 transition-all cursor-pointer"
                          >
                            <span>ကစားမည်</span>
                            <Play className="w-3 h-3 fill-current" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>

                </motion.div>
              )}

              {/* GAME VIEWS */}
              {activeScreen === "game_ddc" && user && (
                <DdcGame 
                  user={user} 
                  onUpdateUser={setUser} 
                  onBack={() => {
                    setActiveScreen("dashboard");
                    loadLeaderboard();
                  }} 
                />
              )}

              {activeScreen === "game_catalog" && user && (
                <CatalogingGame 
                  user={user} 
                  onUpdateUser={setUser} 
                  onBack={() => {
                    setActiveScreen("dashboard");
                    loadLeaderboard();
                  }} 
                />
              )}

              {activeScreen === "game_filing" && user && (
                <FilingGame 
                  user={user} 
                  onUpdateUser={setUser} 
                  onBack={() => {
                    setActiveScreen("dashboard");
                    loadLeaderboard();
                  }} 
                />
              )}

              {activeScreen === "game_subject" && user && (
                <SubjectGame 
                  user={user} 
                  onUpdateUser={setUser} 
                  onBack={() => {
                    setActiveScreen("dashboard");
                    loadLeaderboard();
                  }} 
                />
              )}

              {activeScreen === "game_gk" && user && (
                <GeneralKnowledgeGame 
                  user={user} 
                  onUpdateUser={setUser} 
                  onBack={() => {
                    setActiveScreen("dashboard");
                    loadLeaderboard();
                  }} 
                />
              )}

              {activeScreen === "admin" && (
                <AdminDashboard 
                  onBack={() => {
                    setActiveScreen(user ? "dashboard" : "login");
                    loadLeaderboard();
                  }} 
                />
              )}
            </AnimatePresence>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-6 border-t border-white/5 bg-black/20 text-xs text-slate-500 relative z-10">
        <p>© {new Date().getFullYear()} Sīvali Library Exercises Hub. Built with Glass 3D Liquid theme.</p>
      </footer>

    </div>
  );
}
