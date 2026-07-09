import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  User,
  Trash2, 
  Plus, 
  BookOpen, 
  X, 
  Award, 
  Search, 
  ArrowLeft, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  FolderPlus,
  Shield,
  HelpCircle,
  Database
} from "lucide-react";
import { 
  getAllUsers, 
  deleteUserProfile, 
  addCustomQuestion, 
  getCustomQuestions, 
  deleteCustomQuestion 
} from "../lib/db";
import { UserProfile } from "../types";

interface AdminDashboardProps {
  onBack: () => void;
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [customQuestions, setCustomQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"users" | "lessons" | "create">("users");
  
  // Search query
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Message feedback
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form State for creating custom questions
  const [gameType, setGameType] = useState<string>("gk");
  const [level, setLevel] = useState<number>(1);
  
  // Custom Question Form inputs
  const [gkQuestion, setGkQuestion] = useState<string>("");
  const [gkOptions, setGkOptions] = useState<string[]>(["", "", "", ""]);
  const [gkCorrectIdx, setGkCorrectIdx] = useState<number>(0);
  const [gkExplanation, setGkExplanation] = useState<string>("");

  const [subjectTitle, setSubjectTitle] = useState<string>("");
  const [subjectDesc, setSubjectDesc] = useState<string>("");
  const [subjectCorrect, setSubjectCorrect] = useState<string>("");
  const [subjectOptions, setSubjectOptions] = useState<string[]>(["", "", "", ""]);

  const [ddcTitle, setDdcTitle] = useState<string>("");
  const [ddcSubject, setDdcSubject] = useState<string>("");
  const [ddcCorrect, setDdcCorrect] = useState<string>("200");
  const [ddcOptions, setDdcOptions] = useState<string[]>(["", "", "", ""]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const allUsers = await getAllUsers();
      const allCqs = await getCustomQuestions();
      setUsers(allUsers);
      setCustomQuestions(allCqs);
    } catch (err) {
      console.error(err);
      showFeedback("ဒေတာများ ဆွဲယူရန် မအောင်မြင်ပါ။", "error");
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (text: string, type: "success" | "error") => {
    setMsg({ text, type });
    setTimeout(() => {
      setMsg(null);
    }, 4000);
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (!window.confirm(`အသုံးပြုသူ "${username}" အား စာရင်းမှ ပယ်ဖျက်ရန် သေချာပါသလား?`)) {
      return;
    }
    
    try {
      const success = await deleteUserProfile(userId);
      if (success) {
        showFeedback(`အသုံးပြုသူ "${username}" အား ဖျက်သိမ်းပြီးပါပြီ။`, "success");
        setUsers(users.filter(u => u.id !== userId));
      } else {
        showFeedback("ပယ်ဖျက်ခြင်း မအောင်မြင်ပါ။", "error");
      }
    } catch (err) {
      console.error(err);
      showFeedback("ချိတ်ဆက်မှု အမှားအယွင်းရှိနေသည်။", "error");
    }
  };

  const handleDeleteQuestion = async (qid: string) => {
    if (!window.confirm("ဤသင်ခန်းစာကို ပယ်ဖျက်ရန် သေချာပါသလား?")) {
      return;
    }
    try {
      const success = await deleteCustomQuestion(qid);
      if (success) {
        showFeedback("သင်ခန်းစာအား ပယ်ဖျက်ပြီးပါပြီ။", "success");
        setCustomQuestions(customQuestions.filter(q => q.id !== qid));
      } else {
        showFeedback("ပယ်ဖျက်ခြင်း မအောင်မြင်ပါ။", "error");
      }
    } catch (err) {
      console.error(err);
      showFeedback("ချိတ်ဆက်မှု အမှားအယွင်းရှိနေသည်။", "error");
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    let qData: any = null;

    if (gameType === "gk") {
      if (!gkQuestion || gkOptions.some(o => !o.trim())) {
        showFeedback("ကျေးဇူးပြု၍ မေးခွန်းနှင့် အဖြေရွေးချယ်စရာအားလုံးကို ဖြည့်စွက်ပေးပါ။", "error");
        return;
      }
      qData = {
        question: gkQuestion,
        options: gkOptions,
        correctIndex: gkCorrectIdx,
        explanation: gkExplanation || "အဖြေမှန်ဖြစ်ပါသည်။"
      };
    } else if (gameType === "subject") {
      if (!subjectTitle || !subjectDesc || !subjectCorrect || subjectOptions.some(o => !o.trim())) {
        showFeedback("ကျေးဇူးပြု၍ အချက်အလက်အားလုံးကို ပြည့်စုံစွာ ဖြည့်သွင်းပေးပါ။", "error");
        return;
      }
      qData = {
        bookTitle: subjectTitle,
        description: subjectDesc,
        correctSubject: subjectCorrect,
        options: subjectOptions
      };
    } else if (gameType === "ddc") {
      if (!ddcTitle || !ddcSubject || !ddcCorrect || ddcOptions.some(o => !o.trim())) {
        showFeedback("ကျေးဇူးပြု၍ အချက်အလက်အားလုံးကို ပြည့်စုံစွာ ဖြည့်သွင်းပေးပါ။", "error");
        return;
      }
      const formattedOptions = ddcOptions.map((o, idx) => ({
        code: idx === 0 ? ddcCorrect : `${ddcCorrect.substring(0, 1)}${idx}0`,
        label: o
      }));
      qData = {
        title: ddcTitle,
        subject: ddcSubject,
        correctDdc: ddcCorrect,
        options: formattedOptions
      };
    } else {
      showFeedback("ဤဂိမ်းအမျိုးအစားအတွက် တိုက်ရိုက်ဖန်တီးမှုကို မပံ့ပိုးသေးပါ။ AI အကူအညီဖြင့် ထည့်သွင်းနိုင်ပါသည်။", "error");
      return;
    }

    try {
      const success = await addCustomQuestion(gameType, level, qData);
      if (success) {
        showFeedback("သင်ခန်းစာအသစ်ကို အောင်မြင်စွာ ဖန်တီးသိမ်းဆည်းပြီးပါပြီ။", "success");
        // Clear forms
        setGkQuestion("");
        setGkOptions(["", "", "", ""]);
        setSubjectTitle("");
        setSubjectDesc("");
        setSubjectCorrect("");
        setSubjectOptions(["", "", "", ""]);
        setDdcTitle("");
        setDdcSubject("");
        setDdcOptions(["", "", "", ""]);
        loadData();
      } else {
        showFeedback("သိမ်းဆည်းခြင်း မအောင်မြင်ပါ။", "error");
      }
    } catch (err) {
      console.error(err);
      showFeedback("စနစ်ချို့ယွင်းချက် ဖြစ်ပွားခဲ့သည်။", "error");
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-pink-400 font-bold text-sm uppercase tracking-widest">
            <Shield className="w-4 h-4 animate-pulse" />
            <span>Admin Control Panel</span>
          </div>
          <h2 className="text-2xl font-display font-black text-white mt-1">
            စနစ်စီမံခန့်ခွဲသူ ဒက်ရှ်ဘုတ်
          </h2>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          ဒိုင်ယာလော့ဂ်သို့ ပြန်သွားမည်
        </button>
      </div>

      {/* Feedback alerts */}
      <AnimatePresence>
        {msg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl mb-6 flex items-center gap-3 border ${
              msg.type === "success" 
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" 
                : "bg-rose-500/15 border-rose-500/30 text-rose-400"
            }`}
          >
            {msg.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="text-sm font-semibold">{msg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 gap-2 mb-6">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "users" ? "border-pink-500 text-pink-400" : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Users className="w-4 h-4" />
          အသုံးပြုသူများ စီမံရန် ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("lessons")}
          className={`px-4 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "lessons" ? "border-pink-500 text-pink-400" : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          သင်ခန်းစာအသစ်များ ({customQuestions.length})
        </button>
        <button
          onClick={() => setActiveTab("create")}
          className={`px-4 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "create" ? "border-pink-500 text-pink-400" : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Plus className="w-4 h-4" />
          ကိုယ်တိုင် သင်ခန်းစာထည့်ရန်
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <RefreshCw className="w-10 h-10 text-pink-500 animate-spin mb-3" />
          <p className="text-slate-400 font-medium">ဒေတာများကို ရယူနေပါသည်...</p>
        </div>
      ) : (
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
          
          {/* TAB 1: USERS MANAGEMENT */}
          {activeTab === "users" && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Database className="text-pink-400 w-5 h-5" />
                  နာမည်ထပ်နေသူများနှင့် အကောင့်များကို စီမံခန့်ခွဲရန်
                </h3>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ရှာဖွေမည်..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl text-sm glass-input"
                  />
                </div>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  ရှာဖွေမှုရလဒ် မရှိပါ။
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-xs text-slate-400 uppercase tracking-wider">
                        <th className="py-3 px-4">အသုံးပြုသူအမည်</th>
                        <th className="py-3 px-4">ရမှတ်စုစုပေါင်း</th>
                        <th className="py-3 px-4 hidden md:table-cell">ဂိမ်းအလိုက် အမြင့်ဆုံးရမှတ်</th>
                        <th className="py-3 px-4">နောက်ဆုံးဝင်ရောက်ချိန်</th>
                        <th className="py-3 px-4 text-center">လုပ်ဆောင်ချက်</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((item) => (
                        <tr key={item.id} className="border-b border-white/5 text-sm hover:bg-white/5 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                              <User className="w-3.5 h-3.5 text-pink-400" />
                            </div>
                            {item.username}
                          </td>
                          <td className="py-3.5 px-4 font-black text-pink-400">{item.totalPoints} pts</td>
                          <td className="py-3.5 px-4 text-xs text-slate-400 hidden md:table-cell">
                            DDC: {item.ddcScore} | Cat: {item.catalogingScore} | File: {item.filingScore} | Sub: {item.subjectScore} | GK: {item.gkScore}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-400">
                            {item.lastActive ? new Date(item.lastActive).toLocaleDateString("my-MM") : "မရှိပါ"}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => handleDeleteUser(item.id, item.username)}
                              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30 transition-all cursor-pointer"
                              title="အကောင့်ဖျက်မည်"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CUSTOM LESSONS MANAGEMENT */}
          {activeTab === "lessons" && (
            <div>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <BookOpen className="text-pink-400 w-5 h-5" />
                ထည့်သွင်းထားသော စိတ်ကြိုက်/AI-ဖန်တီးထားသော သင်ခန်းစာများ
              </h3>

              {customQuestions.length === 0 ? (
                <div className="text-center py-12 text-slate-400 flex flex-col items-center justify-center">
                  <BookOpen className="w-12 h-12 text-slate-600 mb-3" />
                  <span>ထည့်သွင်းထားသော သင်ခန်းစာ မရှိသေးပါ။ AI သင်ခန်းစာ တောင်းဆိုသည့်ခလုတ်များဖြင့် စတင်ပါ။</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customQuestions.map((q) => (
                    <div key={q.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all flex justify-between items-start">
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-pink-500/20 text-pink-300 border border-pink-500/30 text-[10px] uppercase font-black px-2 py-0.5 rounded">
                            {q.gameType}
                          </span>
                          <span className="text-xs text-slate-400">Level {q.level}</span>
                        </div>
                        <p className="text-sm font-bold text-white truncate">
                          {q.gameType === "gk" && q.questionData.question}
                          {q.gameType === "subject" && q.questionData.bookTitle}
                          {q.gameType === "ddc" && q.questionData.title}
                          {q.gameType === "filing" && `Filing Book Pool: ${q.questionData.books?.length || 0} books`}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Created: {q.createdAt ? new Date(q.createdAt).toLocaleDateString("my-MM") : "-"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer"
                        title="သင်ခန်းစာဖျက်မည်"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CREATE CUSTOM LESSON QUESTION */}
          {activeTab === "create" && (
            <form onSubmit={handleCreateQuestion}>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <FolderPlus className="text-pink-400 w-5 h-5" />
                ကိုယ်ပိုင် စာကြည့်တိုက်သိပ္ပံ သင်ခန်းစာမေးခွန်း ဖန်တီးသိမ်းဆည်းရန်
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2">ဂိမ်းခေါင်းစဉ်အမျိုးအစား</label>
                  <select
                    value={gameType}
                    onChange={(e) => setGameType(e.target.value)}
                    className="w-full py-2.5 px-4 rounded-xl text-sm glass-input cursor-pointer"
                  >
                    <option value="gk">General Knowledge (အထွေထွေဗဟုသုတမေးခွန်း)</option>
                    <option value="subject">Subject Headings (အကြောင်းအရာအလိုက်ခွဲခြားခြင်း)</option>
                    <option value="ddc">DDC Game Match (ဒီဝီဆယ်စုစနစ်ယှဉ်တွဲခြင်း)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2">အဆင့် (Level)</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(Number(e.target.value))}
                    className="w-full py-2.5 px-4 rounded-xl text-sm glass-input cursor-pointer"
                  >
                    <option value={1}>Level 1</option>
                    <option value={2}>Level 2</option>
                  </select>
                </div>
              </div>

              {/* Form details for GK */}
              {gameType === "gk" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2">မေးခွန်း (Question)</label>
                    <textarea
                      value={gkQuestion}
                      onChange={(e) => setGkQuestion(e.target.value)}
                      placeholder="ဥပမာ - What is the primary role of a national library?"
                      className="w-full py-2.5 px-4 rounded-xl text-sm glass-input h-20"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {gkOptions.map((opt, idx) => (
                      <div key={idx}>
                        <label className="block text-xs font-bold text-slate-400 mb-1">ရွေးချယ်စရာ {idx + 1}</label>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const copy = [...gkOptions];
                            copy[idx] = e.target.value;
                            setGkOptions(copy);
                          }}
                          placeholder={`အဖြေရွေးချယ်စရာ ${idx + 1}`}
                          className="w-full py-2 px-3 rounded-xl text-sm glass-input"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-2">အဖြေမှန်ရွေးချယ်စရာအညွှန်း</label>
                      <select
                        value={gkCorrectIdx}
                        onChange={(e) => setGkCorrectIdx(Number(e.target.value))}
                        className="w-full py-2.5 px-4 rounded-xl text-sm glass-input cursor-pointer"
                      >
                        <option value={0}>ရွေးချယ်စရာ ၁ မှန်သည်</option>
                        <option value={1}>ရွေးချယ်စရာ ၂ မှန်သည်</option>
                        <option value={2}>ရွေးချယ်စရာ ၃ မှန်သည်</option>
                        <option value={3}>ရွေးချယ်စရာ ၄ မှန်သည်</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-2">အဖြေရှင်းလင်းချက် (Burmese/English)</label>
                      <input
                        type="text"
                        value={gkExplanation}
                        onChange={(e) => setGkExplanation(e.target.value)}
                        placeholder="အဖြေမှန်ဖြစ်ရသည့် အကြောင်းရင်းရှင်းလင်းချက်..."
                        className="w-full py-2.5 px-4 rounded-xl text-sm glass-input"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Form details for Subject Headings */}
              {gameType === "subject" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">စာအုပ်ခေါင်းစဉ် (Book Title)</label>
                    <input
                      type="text"
                      value={subjectTitle}
                      onChange={(e) => setSubjectTitle(e.target.value)}
                      placeholder="စာအုပ်အမည်"
                      className="w-full py-2.5 px-4 rounded-xl text-sm glass-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">စာအုပ်အကျဉ်းချုပ်ဖော်ပြချက် (Book Description)</label>
                    <textarea
                      value={subjectDesc}
                      onChange={(e) => setSubjectDesc(e.target.value)}
                      placeholder="ဤစာအုပ်သည် ဘာအကြောင်းအရာအဓိက ဆွေးနွေးပါသလဲ..."
                      className="w-full py-2.5 px-4 rounded-xl text-sm glass-input h-20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">အဖြေမှန် Subject Heading ခေါင်းစဉ်</label>
                    <input
                      type="text"
                      value={subjectCorrect}
                      onChange={(e) => setSubjectCorrect(e.target.value)}
                      placeholder="ဥပမာ - Medicine, Health & Wellness (ကျန်းမာရေးနှင့် ဆေးပညာ)"
                      className="w-full py-2.5 px-4 rounded-xl text-sm glass-input"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {subjectOptions.map((opt, idx) => (
                      <div key={idx}>
                        <label className="block text-xs font-bold text-slate-400 mb-1">
                          {idx === 0 ? "အမှန် (ရွေးချယ်စရာ ၁)" : `မှားယွင်းသည့် ရွေးချယ်စရာ ${idx + 1}`}
                        </label>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const copy = [...subjectOptions];
                            copy[idx] = e.target.value;
                            if (idx === 0) setSubjectCorrect(e.target.value);
                            setSubjectOptions(copy);
                          }}
                          placeholder={idx === 0 ? "အဖြေမှန်နှင့် အတူတူဖြစ်ရပါမည်" : `မှားယွင်းသောအဖြေ ${idx}`}
                          className="w-full py-2 px-3 rounded-xl text-sm glass-input"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form details for DDC */}
              {gameType === "ddc" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">စာအုပ်ခေါင်းစဉ် (Book Title)</label>
                    <input
                      type="text"
                      value={ddcTitle}
                      onChange={(e) => setDdcTitle(e.target.value)}
                      placeholder="စာအုပ်အမည်"
                      className="w-full py-2.5 px-4 rounded-xl text-sm glass-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">ဘာသာရပ် သို့မဟုတ် အကြောင်းအရာ</label>
                    <input
                      type="text"
                      value={ddcSubject}
                      onChange={(e) => setDdcSubject(e.target.value)}
                      placeholder="ဥပမာ - ဗုဒ္ဓဘာသာဆိုင်ရာ သုတေသန"
                      className="w-full py-2.5 px-4 rounded-xl text-sm glass-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">အဖြေမှန် DDC ကုတ်နံပါတ်</label>
                    <input
                      type="text"
                      value={ddcCorrect}
                      onChange={(e) => setDdcCorrect(e.target.value)}
                      placeholder="ဥပမာ - 200"
                      className="w-full py-2.5 px-4 rounded-xl text-sm glass-input"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ddcOptions.map((opt, idx) => (
                      <div key={idx}>
                        <label className="block text-xs font-bold text-slate-400 mb-1">
                          {idx === 0 ? "ရွေးချယ်စရာ ၁ (အမှန်ဖော်ပြချက်)" : `မှားယွင်းသည့် ရွေးချယ်စရာ ${idx + 1}`}
                        </label>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const copy = [...ddcOptions];
                            copy[idx] = e.target.value;
                            setDdcOptions(copy);
                          }}
                          placeholder={idx === 0 ? "ဥပမာ - 200 - ဘာသာရေး (Religion)" : `မှားယွင်းသော DDC ပြချက် ${idx}`}
                          className="w-full py-2 px-3 rounded-xl text-sm glass-input"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl font-bold liquid-button shadow-lg text-white"
                >
                  သင်ခန်းစာမေးခွန်း သိမ်းဆည်းမည်
                </button>
              </div>
            </form>
          )}

        </div>
      )}
    </div>
  );
}
