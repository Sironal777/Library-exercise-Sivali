import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw, 
  BookOpen, 
  Info, 
  ChevronRight, 
  HelpCircle,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { updateUserScore } from "../lib/db";
import { UserProfile } from "../types";

interface GeneralKnowledgeGameProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onBack: () => void;
}

interface GKQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIdx: number;
  explanation: string;
}

export default function GeneralKnowledgeGame({ user, onUpdateUser, onBack }: GeneralKnowledgeGameProps) {
  // Global pool of library science questions
  const questionsPool: GKQuestion[] = [
    {
      id: "gk_q1",
      question: "စာကြည့်တိုက်ပညာရှင် ရန်ဂါနသန် (S.R. Ranganathan) ၏ ပထမဦးဆုံးသော နိယာမ (First Law of Library Science) မှာ အဘယ်နည်း။",
      options: [
        "Books are for use (စာအုပ်များသည် ဖတ်ရှုအသုံးပြုရန် ဖြစ်သည်)",
        "Every reader his or her book (စာဖတ်သူတိုင်းအတွက် ၎င်းတို့နှင့်ကိုက်ညီသော စာအုပ်ရှိရမည်)",
        "Every book its reader (စာအုပ်တိုင်းအတွက် ၎င်း၏စာဖတ်သူရှိရမည်)",
        "Save the time of the reader (စာဖတ်သူ၏ အချိန်ကို ချွေတာပါ)"
      ],
      correctAnswerIdx: 0,
      explanation: "ပထမနိယာမ 'Books are for use' သည် စာအုပ်များကို သော့ခတ်သိမ်းဆည်းထားရန် မဟုတ်ဘဲ လူအများ ဖတ်ရှုအသုံးပြုနိုင်အောင် စီစဉ်ပေးရန်ဖြစ်ကြောင်း ညွှန်ပြပါသည်။"
    },
    {
      id: "gk_q2",
      question: "Dewey Decimal Classification (DDC) စနစ်ကို မည်သူက စတင်တီထွင်ခဲ့သနည်း။",
      options: [
        "Charles Ammi Cutter",
        "Melvil Dewey",
        "S.R. Ranganathan",
        "William Alanson Borden"
      ],
      correctAnswerIdx: 1,
      explanation: "Melvil Dewey သည် ၁၈၇၆ ခုနှစ်တွင် DDC (ဒေါ့ဝေးဒသမခွဲခြားခြင်းစနစ်) ကို စတင်တီထွင်ပြီး ထုတ်ဝေခဲ့ပါသည်။"
    },
    {
      id: "gk_q3",
      question: "MARC 21 Format တွင် စာအုပ်၏ 'ခေါင်းစဉ်အချက်အလက် (Title Statement)' အတွက် မည်သည့် Tag နံပါတ်ကို အသုံးပြုသနည်း။",
      options: [
        "Tag 100",
        "Tag 245",
        "Tag 260",
        "Tag 300"
      ],
      correctAnswerIdx: 1,
      explanation: "MARC Tag 245 ကို စာအုပ်ခေါင်းစဉ် (Title Statement)၊ အခြားခေါင်းစဉ်ခွဲများနှင့် တာဝန်ယူရေးသားသူများ ဖော်ပြရန်အတွက် အသုံးပြုပါသည်။"
    },
    {
      id: "gk_q4",
      question: "MARC 21 Format တွင် 'အဓိကရေးသားသူ (Main Entry - Personal Name)' အတွက် မည်သည့် Tag နံပါတ်ကို အသုံးပြုသနည်း။",
      options: [
        "Tag 100",
        "Tag 245",
        "Tag 260",
        "Tag 700"
      ],
      correctAnswerIdx: 0,
      explanation: "MARC Tag 100 ကို စာအုပ်၏ ပင်မရေးသားသူ (Personal Name Author) အမည်များ ထည့်သွင်းရန် အသုံးပြုပါသည်။"
    },
    {
      id: "gk_q5",
      question: "MARC 21 Format တွင် စာအုပ်ထုတ်ဝေမှုဆိုင်ရာ အချက်အလက် (Publication, Distribution, etc.) အတွက် မည်သည့် Tag ကို အသုံးပြုသနည်း။",
      options: [
        "Tag 245",
        "Tag 260 / 264",
        "Tag 300",
        "Tag 490"
      ],
      correctAnswerIdx: 1,
      explanation: "MARC Tag 260 သို့မဟုတ် ခေတ်သစ်စံနှုန်းများတွင် Tag 264 ကို ထုတ်ဝေသည့်နေရာ၊ ထုတ်ဝေသူနှင့် ထုတ်ဝေသည့်ခုနှစ်များ ထည့်သွင်းရန် အသုံးပြုပါသည်။"
    },
    {
      id: "gk_q6",
      question: "ခေတ်သစ် ISBN (International Standard Book Number) စနစ်တွင် စုစုပေါင်း ဂဏန်းအရေအတွက် မည်မျှပါဝင်သနည်း။",
      options: [
        "၁၀ လုံး",
        "၁၂ လုံး",
        "၁၃ လုံး",
        "၁၅ လုံး"
      ],
      correctAnswerIdx: 2,
      explanation: "၂၀၀၇ ခုနှစ် ဇန်နဝါရီ ၁ ရက်နေ့မှစ၍ ISBN စနစ်ကို ၁၀ လုံးမှ ၁၃ လုံး (13-digit) အဖြစ် ကမ္ဘာတစ်ဝှမ်း စံသတ်မှတ်ပြောင်းလဲခဲ့ပါသည်။"
    },
    {
      id: "gk_q7",
      question: "စာကြည့်တိုက်များရှိ OPAC ၏ အရှည်ကောက်မှာ အဘယ်နည်း။",
      options: [
        "Online Public Access Catalog",
        "Office Public Archive Center",
        "Online Private Access Card",
        "Optical Public Archive Catalog"
      ],
      correctAnswerIdx: 0,
      explanation: "OPAC သည် 'Online Public Access Catalog' ဖြစ်ပြီး စာဖတ်သူများ စာကြည့်တိုက်အတွင်းရှိ စာအုပ်များကို အွန်လိုင်းမှတစ်ဆင့် ရှာဖွေနိုင်သည့် စနစ်ဖြစ်ပါသည်။"
    },
    {
      id: "gk_q8",
      question: "AACR2 စည်းမျဉ်းများကို ဆက်ခံသည့် ခေတ်ပေါ် စာကတ်တလောက် ရေးသွင်းခြင်းဆိုင်ရာ နိုင်ငံတကာစံနှုန်းအသစ်မှာ မည်သည့်အရာ ဖြစ်သနည်း။",
      options: [
        "Dublin Core",
        "ISBD",
        "RDA (Resource Description and Access)",
        "MARC 21"
      ],
      correctAnswerIdx: 2,
      explanation: "RDA သည် 'Resource Description and Access' ဖြစ်ပြီး ဒစ်ဂျစ်တယ်ခေတ်နှင့် လျော်ညီစွာ AACR2 နေရာတွင် အစားထိုးလာသည့် စံနှုန်းသစ်ဖြစ်ပါသည်။"
    },
    {
      id: "gk_q9",
      question: "အိန္ဒိယနိုင်ငံ၏ စာကြည့်တိုက်ပညာ ဖခင်ကြီး (Father of Library Science in India) ဟု မည်သူ့ကို တင်စားခေါ်ဝေါ်ကြသနည်း။",
      options: [
        "Dr. S.R. Ranganathan",
        "Melvil Dewey",
        "C.A. Cutter",
        "William Alanson Borden"
      ],
      correctAnswerIdx: 0,
      explanation: "Dr. S.R. Ranganathan (Shiyali Ramamrita Ranganathan) သည် စာကြည့်တိုက်ပညာ နိယာမ ၅ ရပ်၊ Colon Classification တို့ကို ရေးသားပြီး အိန္ဒိယစာကြည့်တိုက်ပညာကို ကမ္ဘာ့အလယ် သို့ ပို့ဆောင်ခဲ့သူ ဖြစ်သည်။"
    },
    {
      id: "gk_q10",
      question: "ဒစ်ဂျစ်တယ် စာကြည့်တိုက်များတွင် အသုံးပြုသော Dublin Core Metadata Scheme တွင် စံသတ်မှတ်ထားသော အစိတ်အပိုင်း (Elements) မည်မျှ ပါဝင်သနည်း။",
      options: [
        "၁၀ ခု",
        "၁၂ ခု",
        "၁၅ ခု",
        "၂၀ ခု"
      ],
      correctAnswerIdx: 2,
      explanation: "Dublin Core (Simple metadata set) တွင် Title, Creator, Subject, Description စသည်ဖြင့် စံသတ်မှတ်ထားသော Elements ၁၅ ခု ပါဝင်ပါသည်။"
    },
    {
      id: "gk_q11",
      question: "Dewey Decimal Classification (DDC) ၏ အဓိက အတန်းကြီး (Main Class) 500 သည် မည်သည့်အကြောင်းအရာကို ကိုယ်စားပြုသနည်း။",
      options: [
        "Social Sciences (လူမှုရေးသိပ္ပံ)",
        "Pure Sciences (သဘာဝသိပ္ပံနှင့် သင်္ချာ)",
        "Technology (အသုံးချသိပ္ပံနှင့် နည်းပညာ)",
        "Literature (စာပေပညာ)"
      ],
      correctAnswerIdx: 1,
      explanation: "Class 500 သည် သင်္ချာ၊ ရူပဗေဒ၊ ဓာတုဗေဒ၊ ဇီဝဗေဒ စသည့် သဘာဝသိပ္ပံ (Pure Sciences) ဘာသာရပ်များအတွက် သီးသန့်ဖြစ်ပါသည်။"
    },
    {
      id: "gk_q12",
      question: "Dewey Decimal Classification (DDC) ၏ အဓိက အတန်းကြီး (Main Class) 000 သည် မည်သည့်အကြောင်းအရာ ဖြစ်သနည်း။",
      options: [
        "Philosophy & Psychology (ဒဿနိကဗေဒနှင့် စိတ်ပညာ)",
        "Religion (ဘာသာရေး)",
        "Computer Science, Information & General Works (ကွန်ပျူတာသိပ္ပံနှင့် အထွေထွေပညာရပ်များ)",
        "History & Geography (သမိုင်းနှင့် ပထဝီ)"
      ],
      correctAnswerIdx: 2,
      explanation: "Class 000 သည် ကွန်ပျူတာသိပ္ပံ၊ အထွေထွေအညွှန်းကျမ်းများ၊ စာကြည့်တိုက်နှင့် သတင်းအချက်အလက်ပညာရပ်များအတွက် ဖြစ်ပါသည်။"
    },
    {
      id: "gk_q13",
      question: "စာအုပ်များ သို့မဟုတ် စာပေစုဆောင်းမှုများ၏ စနစ်တကျပြုစုထားသော စာစုစာရင်းကို စာကြည့်တိုက်ဝေါဟာရဖြင့် မည်သို့ခေါ်ဆိုသနည်း။",
      options: [
        "Index (ညွှန်းကိန်း)",
        "Abstract (အကျဉ်းချုပ်)",
        "Bibliography (စာစုစာရင်း)",
        "Glossary (ဝေါဟာရအနက်)"
      ],
      correctAnswerIdx: 2,
      explanation: "Bibliography (စာစုစာရင်း) သည် စာအုပ်များ သို့မဟုတ် စာပေသုတေသနရင်းမြစ်များကို စာရေးသူ သို့မဟုတ် အကြောင်းအရာအလိုက် စနစ်တကျ စုစည်းထားသော စာရင်းဖြစ်သည်။"
    },
    {
      id: "gk_q14",
      question: "အမျိုးသားစာကြည့်တိုက် (National Library) တစ်ခု၏ အဓိကတာဝန်နှင့် လက္ခဏာရပ်မှာ အဘယ်နည်း။",
      options: [
        "တက္ကသိုလ်ကျောင်းသားများအတွက်သာ သုတေသနပြုရန်",
        "နိုင်ငံတော်အတွင်း ထုတ်ဝေသော စာပေအမွေအနှစ်အားလုံးကို ဥပဒေအရ စုဆောင်းထိန်းသိမ်းရန် (Legal Deposit)",
        "ကလေးငယ်များ ပုံပြင်ဖတ်ရန် နေရာပေးရန်",
        "စီးပွားရေးလုပ်ငန်းရှင်များအတွက် စျေးကွက်ရှာဖွေရန်"
      ],
      correctAnswerIdx: 1,
      explanation: "အမျိုးသားစာကြည့်တိုက်များသည် နိုင်ငံတော်အတွင်း ပုံနှိပ်ထုတ်ဝေသည့် စာအုပ်စာစောင်အားလုံးကို ဥပဒေအရ သိမ်းဆည်းပိုင်ခွင့်ရှိပြီး နိုင်ငံတော်၏ စာပေအမွေအနှစ်ကို မပျောက်ပျက်အောင် ထိန်းသိမ်းရသော နေရာဖြစ်သည်။"
    },
    {
      id: "gk_q15",
      question: "စာကြည့်တိုက် ကတ်တလောက် (Library Catalog) တစ်ခု၏ အဓိကရည်ရွယ်ချက်မှာ အဘယ်နည်း။",
      options: [
        "စာကြည့်တိုက်မှ စာအုပ်များကို ရောင်းချရန်",
        "စာဖတ်သူများ လိုချင်သော စာအုပ်ကို စာရေးသူ၊ ခေါင်းစဉ် သို့မဟုတ် အကြောင်းအရာဖြင့် လွယ်ကူစွာ ရှာဖွေသိရှိနိုင်ရန်",
        "စာကြည့်တိုက်ဝန်ထမ်းများ၏ လစာကို တွက်ချက်ရန်",
        "စာအုပ်မျက်နှာဖုံးများကို အရောင်လှလှခြယ်ရန်"
      ],
      correctAnswerIdx: 1,
      explanation: "ကတ်တလောက်သည် စာဖတ်သူများနှင့် စာအုပ်များကို ဆက်သွယ်ပေးသည့် တံတားဖြစ်ပြီး စာကြည့်တိုက်အတွင်းရှိ အချက်အလက်များကို လွယ်ကူလျင်မြန်စွာ ရှာဖွေနိုင်ရန် ကူညီပေးပါသည်။"
    },
    {
      id: "gk_q16",
      question: "S.R. Ranganathan ၏ ပဉ္စမမြောက်နိယာမ (Fifth Law: 'The library is a growing organism') က မည်သည့်အဓိပ္ပာယ်ကို အဓိကဖော်ညွှန်းသနည်း။",
      options: [
        "စာကြည့်တိုက်သည် သက်ရှိသတ္တဝါကဲ့သို့ ရွေ့လျားနိုင်သည်",
        "စာအုပ်၊ စာဖတ်သူနှင့် ဝန်ထမ်းများ တိုးပွားလာသည်နှင့်အမျှ စာကြည့်တိုက်သည်လည်း စဉ်ဆက်မပြတ် ဖွံ့ဖြိုးတိုးတက်ပြောင်းလဲနေရမည်",
        "စာကြည့်တိုက် အဆောက်အဦအတွင်း သစ်ပင်များ စိုက်ပျိုးရမည်",
        "စာကြည့်တိုက်တွင် ပိုးမွှားများ မပေါက်ဖွားအောင် ဓာတုဆေးဖျန်းရမည်"
      ],
      correctAnswerIdx: 1,
      explanation: "စာကြည့်တိုက်သည် အစဉ်အမြဲရှင်သန်ကြီးထွားနေသော ဖွဲ့စည်းပုံရှိပြီး ခေတ်စနစ်ပြောင်းလဲမှုနှင့် စာအုပ်/စာဖတ်သူဦးရေ တိုးတက်လာမှုအပေါ် လိုက်လျောညီထွေစွာ ပြုပြင်ပြောင်းလဲပေးရမည်ကို ဆိုလိုသည်။"
    },
    {
      id: "gk_q17",
      question: "စာကြည့်တိုက်စာအုပ်များကို အလိုအလျောက်ငှား/ပြန်ပေးပြုလုပ်ရန်နှင့် လုံခြုံရေးထိန်းသိမ်းရန် အသုံးပြုသော RFID ၏ အရှည်ကောက်မှာ အဘယ်နည်း။",
      options: [
        "Radio Frequency Identification",
        "Rapid File Information Delivery",
        "Reader Friendly Interface Device",
        "Remote File Index Directory"
      ],
      correctAnswerIdx: 0,
      explanation: "RFID (Radio Frequency Identification) သည် ရေဒီယိုလှိုင်းနှုန်းသုံး အမှတ်အသားစနစ်ဖြစ်ပြီး စာအုပ်များကို အမြန်နှုန်းဖြင့် ရှာဖွေစီမံနိုင်သည့်အပြင် စာကြည့်တိုက်လုံခြုံရေးအတွက်လည်း အသုံးပြုသည်။"
    },
    {
      id: "gk_q18",
      question: "စာအုပ်စင်ပေါ်တွင် စာအုပ်များနေရာချထားရန် စာအုပ်၏ ကျောဘက်တွင် ကပ်ထားသော 'ခေါ်ယူကုဒ်/ခေါ်ယူနံပါတ် (Call Number)' တွင် မည်သည့်အချက်အလက်များ အဓိက ပေါင်းစပ်ပါဝင်သနည်း။",
      options: [
        "စာအုပ်စျေးနှုန်းနှင့် ထုတ်ဝေနှစ်",
        "အမျိုးအစားခွဲခြားခြင်းနံပါတ် (Classification number) နှင့် စာရေးသူကုဒ် (Book/Author number)",
        "ISBN နံပါတ်နှင့် ဖုန်းနံပါတ်",
        "စာကြည့်တိုက်အမည်နှင့် အဖွဲ့ဝင်နံပါတ်"
      ],
      correctAnswerIdx: 1,
      explanation: "Call Number တွင် ဒေါ့ဝေးနံပါတ် (Class number) နှင့် စာရေးသူ၏ အက္ခရာစဉ်ကုဒ် (Book number) တို့ ပေါင်းစပ်ပါဝင်ပြီး စာအုပ်များ စင်ပေါ်တွင် ထားရှိရမည့် တိကျသော လိပ်စာဖြစ်ပါသည်။"
    }
  ];

  // Load completed questions from localStorage
  const [completedQuestionIds, setCompletedQuestionIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(`sivali_completed_gk_${user.id}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Game flow states
  const [sessionQuestions, setSessionQuestions] = useState<GKQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0); // Score accumulated during the current round
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [sessionCompletedIds, setSessionCompletedIds] = useState<string[]>([]);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [dbSaving, setDbSaving] = useState<boolean>(false);
  const [customQuestions, setCustomQuestions] = useState<any[]>([]);
  const [aiGenerating, setAiGenerating] = useState<boolean>(false);

  // Initialize a round of 5 questions
  useEffect(() => {
    async function fetchCustomAndInit() {
      try {
        const { getCustomQuestions } = await import("../lib/db");
        const cqs = await getCustomQuestions("gk");
        setCustomQuestions(cqs);
        
        const customItems = cqs.map((q: any) => {
          const item = q.questionData;
          if (item && item.correctIndex !== undefined && item.correctAnswerIdx === undefined) {
            item.correctAnswerIdx = item.correctIndex;
          }
          return item;
        });
        const combinedPool = [...customItems, ...questionsPool];
        
        // Filter out already answered questions to prevent repeating
        const uncompleted = combinedPool.filter(q => !completedQuestionIds.includes(q.id));
        const pool = uncompleted.length >= 5 ? uncompleted : combinedPool;
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 5);
        
        setSessionQuestions(selected);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching custom GK questions:", err);
        const uncompleted = questionsPool.filter(q => !completedQuestionIds.includes(q.id));
        const pool = uncompleted.length >= 5 ? uncompleted : questionsPool;
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 5);
        setSessionQuestions(selected);
        setLoading(false);
      }
    }
    fetchCustomAndInit();
  }, []);

  const initializeRound = () => {
    setLoading(true);
    setSelectedAns(null);
    setChecked(false);
    setCurrentIdx(0);
    setScore(0);
    setCorrectAnswersCount(0);
    setGameFinished(false);
    setSessionCompletedIds([]);

    const customItems = customQuestions.map((q: any) => {
      const item = q.questionData;
      if (item && item.correctIndex !== undefined && item.correctAnswerIdx === undefined) {
        item.correctAnswerIdx = item.correctIndex;
      }
      return item;
    });
    const combinedPool = [...customItems, ...questionsPool];
    const uncompleted = combinedPool.filter(q => !completedQuestionIds.includes(q.id));
    const pool = uncompleted.length >= 5 ? uncompleted : combinedPool;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 5);
    
    setSessionQuestions(selected);
    setLoading(false);
  };

  const handleAskAi = async () => {
    setAiGenerating(true);
    try {
      const res = await fetch("/api/lessons/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameType: "gk" })
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }

      // Save to firestore custom_questions
      const { addCustomQuestion } = await import("../lib/db");
      await addCustomQuestion("gk", 1, data);

      const parsedData = { ...data };
      if (parsedData.correctIndex !== undefined && parsedData.correctAnswerIdx === undefined) {
        parsedData.correctAnswerIdx = parsedData.correctIndex;
      }

      // Update custom questions list so it's kept in state
      setCustomQuestions(prev => [{ questionData: parsedData, level: 1, gameType: "gk" }, ...prev]);

      // Instantly set as active list
      setSessionQuestions(prev => [parsedData, ...prev]);
      setCurrentIdx(0);
      setSelectedAns(null);
      setChecked(false);

      alert("✨ AI ဆရာတော်မှ သင့်အတွက် အသစ်စက်စက် အထွေထွေဗဟုသုတမေးခွန်းတစ်ခုကို အောင်မြင်စွာ ဖန်တီးပေးလိုက်ပါပြီ။");
    } catch (err) {
      console.error(err);
      alert("AI သင်ခန်းစာ တောင်းဆိုရန် အဆင်မပြေပါ။ နောက်မှ ပြန်လည်ကြိုးစားပါ။");
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSelectOption = (idx: number) => {
    if (checked) return;
    setSelectedAns(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedAns === null || checked) return;
    
    const currentQuestion = sessionQuestions[currentIdx];
    const isCorrect = selectedAns === currentQuestion.correctAnswerIdx;
    
    if (isCorrect) {
      // 20 points per correct answer!
      setScore(prev => prev + 20);
      setCorrectAnswersCount(prev => prev + 1);
      setSessionCompletedIds(prev => [...prev, currentQuestion.id]);
    }
    setChecked(true);
  };

  const handleNextQuestion = async () => {
    setSelectedAns(null);
    setChecked(false);

    if (currentIdx < sessionQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      // End of the game round! Save progress and scores
      setDbSaving(true);
      
      const newScore = score;
      
      // Update completed question history
      const updatedCompleted = Array.from(new Set([...completedQuestionIds, ...sessionCompletedIds]));
      try {
        localStorage.setItem(`sivali_completed_gk_${user.id}`, JSON.stringify(updatedCompleted));
      } catch (e) {
        console.error("Local storage save error:", e);
      }
      setCompletedQuestionIds(updatedCompleted);

      // Save high score to Firestore database
      try {
        const updatedUser = await updateUserScore(user.id, "gk", newScore);
        if (updatedUser) {
          onUpdateUser(updatedUser);
        }
      } catch (e) {
        console.error("Firestore score update error:", e);
      } finally {
        setDbSaving(false);
        setGameFinished(true);
      }
    }
  };

  const clearCompletionHistory = () => {
    try {
      localStorage.removeItem(`sivali_completed_gk_${user.id}`);
    } catch (e) {
      console.error(e);
    }
    setCompletedQuestionIds([]);
    setSessionCompletedIds([]);
    setScore(0);
    setCorrectAnswersCount(0);
    setCurrentIdx(0);
    setSelectedAns(null);
    setChecked(false);
    setGameFinished(false);

    // Pick 5 random questions from the full pool
    const selected = [...questionsPool].sort(() => Math.random() - 0.5).slice(0, 5);
    setSessionQuestions(selected);
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 text-center text-white" id="gk-loading">
        <RefreshCw className="w-10 h-10 text-pink-400 animate-spin mx-auto mb-4" />
        <p className="text-slate-400 font-medium">လေ့ကျင့်ခန်းမေးခွန်းများ ပြင်ဆင်နေပါသည်...</p>
      </div>
    );
  }

  const currentQuestion = sessionQuestions[currentIdx];
  const isCorrect = selectedAns === currentQuestion?.correctAnswerIdx;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6" id="gk-game-root">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
            <HelpCircle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-display font-black text-white bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent text-glow-pink">
              General Knowledge Quiz
            </h2>
            <p className="text-xs text-pink-200/80 font-bold mt-0.5">စာကြည့်တိုက်ပညာ အထွေထွေဗဟုသုတမေးခွန်းများ</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleAskAi}
            disabled={aiGenerating}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-pink-500/20 hover:bg-pink-500/35 border border-pink-500/30 hover:border-pink-500/50 text-pink-300 transition-all cursor-pointer shadow-lg animate-pulse"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{aiGenerating ? "Generating..." : "AI သင်ခန်းစာသစ် တောင်းမည်"}</span>
          </button>
          <div className="bg-white/[0.03] border border-white/10 px-3 py-2 rounded-2xl text-xs flex items-center gap-2 shadow-inner">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300">HighScore:</span>
            <span className="font-display font-black text-cyan-400 text-glow-cyan text-sm">{user.gkScore || 0} pts</span>
          </div>
          <button
            onClick={onBack}
            className="px-3 py-2 rounded-2xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-all text-xs font-bold cursor-pointer"
          >
            ပင်မသို့
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!gameFinished ? (
          /* ACTIVE PLAYING ROUND SCREEN */
          <motion.div
            key="gk_active_round"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Progress and Score Bar */}
            <div className="glass-card p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="text-xs font-bold text-slate-400 whitespace-nowrap">မေးခွန်းတိုးတက်မှု-</span>
                <div className="w-full md:w-48 bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="bg-gradient-to-r from-pink-500 to-purple-500 h-full transition-all duration-300"
                    style={{ width: `${((currentIdx + 1) / sessionQuestions.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-black text-white whitespace-nowrap">
                  {currentIdx + 1} / {sessionQuestions.length}
                </span>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto">
                <div className="bg-pink-500/10 border border-pink-500/20 px-3 py-1 rounded-xl text-xs text-pink-300 font-bold">
                  ရမှတ်: {score} pts
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-xl text-xs text-purple-300 font-bold">
                  မှန်ကန်မှု: {correctAnswersCount} / {sessionQuestions.length}
                </div>
              </div>
            </div>

            {/* Question Card */}
            <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/15 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl" />

              <span className="text-xs font-black text-pink-400 uppercase tracking-widest block mb-4">
                Question {currentIdx + 1}
              </span>

              <h3 className="text-lg md:text-xl font-bold text-white leading-relaxed mb-8">
                {currentQuestion.question}
              </h3>

              {/* Options Grid */}
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((option, idx) => {
                  let optionStyle = "border-white/10 bg-white/[0.02] hover:border-pink-500/40 hover:bg-white/[0.05]";
                  
                  if (checked) {
                    if (idx === currentQuestion.correctAnswerIdx) {
                      // Correct option is always green
                      optionStyle = "border-emerald-500/50 bg-emerald-500/10 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.15)]";
                    } else if (idx === selectedAns) {
                      // If user selected this wrong option, style red
                      optionStyle = "border-red-500/50 bg-red-500/10 text-red-200";
                    } else {
                      // Other wrong options faded
                      optionStyle = "border-white/5 bg-white/[0.01] text-slate-400 opacity-60";
                    }
                  } else if (idx === selectedAns) {
                    // Pre-check selected state
                    optionStyle = "border-pink-500 bg-pink-500/10 text-pink-200 shadow-[0_0_15px_rgba(236,72,153,0.15)]";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={checked}
                      className={`w-full text-left p-4 rounded-2xl border text-sm md:text-base font-medium transition-all flex items-center justify-between gap-4 cursor-pointer ${optionStyle}`}
                    >
                      <span>{option}</span>
                      <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-display font-black text-xs shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Instant Verification Feedback */}
              <AnimatePresence>
                {checked && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`mt-6 p-5 rounded-2xl border flex flex-col sm:flex-row gap-4 items-start ${
                      isCorrect 
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-200" 
                        : "bg-amber-500/10 border-amber-500/20 text-amber-200"
                    }`}
                  >
                    <div className="mt-1 shrink-0">
                      {isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-amber-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-black text-sm mb-1">
                        {isCorrect ? "ဂုဏ်ယူပါသည်! အဖြေမှန်ပါသည်။ (+၂၀ ရမှတ်)" : "မမှန်ပါ၊ ကြိုးစားကြည့်ပါဦး။"}
                      </h4>
                      <p className="text-xs leading-relaxed opacity-90">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-end">
                {!checked ? (
                  <button
                    onClick={handleCheckAnswer}
                    disabled={selectedAns === null}
                    className={`px-8 py-3.5 rounded-2xl font-bold transition-all flex items-center gap-2 ${
                      selectedAns === null
                        ? "bg-white/5 border border-white/5 text-slate-500 cursor-not-allowed"
                        : "liquid-button"
                    }`}
                  >
                    <span>အဖြေတိုက်စစ်မည်</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-8 py-3.5 rounded-2xl font-bold liquid-button flex items-center gap-2"
                  >
                    <span>
                      {currentIdx < sessionQuestions.length - 1 ? "နောက်တစ်ပုဒ်သို့" : "ရမှတ်သိမ်းဆည်းပြီး ပြီးဆုံးမည်"}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          /* ROUND COMPLETED SUMMARY SCREEN */
          <motion.div
            key="gk_summary"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-8 rounded-3xl border border-white/20 text-center space-y-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(236,72,153,0.4)] border border-white/20">
                <Award className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-2xl md:text-3xl font-display font-black text-white bg-gradient-to-r from-pink-400 via-fuchsia-300 to-cyan-400 bg-clip-text text-transparent text-glow-pink">
                လေ့ကျင့်ခန်း ပြီးစီးပါပြီ!
              </h2>
              <p className="text-slate-300 text-sm font-semibold mt-3 leading-relaxed">
                General Knowledge (စာကြည့်တိုက်ပညာ အထွေထွေဗဟုသုတ) မေးခွန်းများကို ပြီးမြောက်အောင် ဖြေဆိုခဲ့ပြီး ဖြစ်ပါသည်။
              </p>
            </div>

            {/* Score Showcase */}
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl shadow-inner text-center">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">မှန်ကန်မှု</span>
                <span className="text-2xl font-display font-black text-emerald-400 text-glow-emerald block mt-1">
                  {correctAnswersCount} / {sessionQuestions.length}
                </span>
                <span className="text-[10px] text-slate-500">မေးခွန်းများ</span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl shadow-inner text-center">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">ရရှိသောရမှတ်</span>
                <span className="text-2xl font-display font-black text-pink-400 text-glow-pink block mt-1">
                  +{score} pts
                </span>
                <span className="text-[10px] text-slate-500">Point rewards</span>
              </div>
            </div>

            {/* Action controls */}
            <div className="flex flex-col gap-4 justify-center max-w-sm mx-auto relative z-10">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={initializeRound}
                  className="px-6 py-3 rounded-2xl font-semibold border border-white/20 hover:bg-white/10 text-white transition-all flex items-center justify-center gap-2 grow cursor-pointer"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>ထပ်မံဆော့ကစားမည်</span>
                </button>
                <button
                  onClick={onBack}
                  className="px-8 py-3 rounded-2xl font-bold liquid-button grow cursor-pointer"
                >
                  ပင်မစာမျက်နှာသို့
                </button>
              </div>

              {completedQuestionIds.length > 0 && (
                <button
                  onClick={clearCompletionHistory}
                  className="text-xs text-red-300/60 hover:text-red-300 underline transition-all py-1 cursor-pointer"
                >
                  လေ့ကျင့်ခန်းမှတ်တမ်းကို ဖျက်ပြီး အစမှပြန်စမည် (မေးခွန်း {completedQuestionIds.length} ခု ပြီးစီး)
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
