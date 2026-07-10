import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  Sparkles, 
  BookOpen, 
  Book, 
  FileText, 
  Database, 
  History, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Info, 
  CheckCircle,
  HelpCircle,
  Maximize2,
  FolderOpen,
  Layers,
  ChevronRight,
  Eye,
  Hand
} from "lucide-react";
import { UserProfile } from "../types";

interface MindMapsProps {
  user: UserProfile;
  onBack: () => void;
}

// Tree Data Interfaces
interface SubTopicNode {
  id: string;
  title: string;
  englishTitle: string;
  detail: string;
  examples: string[];
  keywords: string[];
}

interface MainTopicBranch {
  id: string;
  title: string;
  englishTitle: string;
  icon: React.ReactNode;
  detail: string;
  subTopics: SubTopicNode[];
  colorClass: string;
  glowColor: string;
}

interface SubjectTreeData {
  id: string;
  code: string;
  name: string;
  myanmarName: string;
  color: string;
  glowColor: string;
  description: string;
  branches: MainTopicBranch[];
  selfTest: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export default function MindMaps({ user, onBack }: MindMapsProps) {
  const [selectedSubjectIdx, setSelectedSubjectIdx] = useState<number>(0);
  const [expandedNodes, setExpandedNodes] = useState<{ [nodeId: string]: boolean }>({});
  const [selectedNodeDetails, setSelectedNodeDetails] = useState<{
    title: string;
    englishTitle: string;
    detail: string;
    examples?: string[];
    keywords?: string[];
    level: "root" | "branch" | "leaf";
  } | null>(null);

  // Canvas pan and zoom state
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Local font scale adjustment
  const [localFontScale, setLocalFontScale] = useState<number>(100);

  // Quiz state
  const [showSelfTest, setShowSelfTest] = useState<boolean>(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [testScore, setTestScore] = useState<number>(0);
  const [testCompleted, setTestCompleted] = useState<boolean>(false);

  // Detailed Subjects Tree Database (ADM, CAL, MCS, MSS, HIS) in complete Myanmar language
  const subjectsData: SubjectTreeData[] = [
    {
      id: "adm",
      code: "ADM",
      name: "Library Administration & Management",
      myanmarName: "စာကြည့်တိုက် စီမံခန့်ခွဲမှုပညာ",
      color: "from-emerald-400 to-teal-500",
      glowColor: "rgba(16,185,129,0.5)",
      description: "စာကြည့်တိုက်တစ်ခုလုံး စနစ်တကျ ရေရှည်တိုးတက်လည်ပတ်နိုင်ရန် ဘတ်ဂျက်၊ လူအင်အားနှင့် မူဝါဒများကို စီမံခန့်ခွဲသည့် အခြေခံသိပ္ပံပညာရပ်",
      branches: [
        {
          id: "adm-struct",
          title: "ဖွဲ့စည်းပုံနှင့် စီမံအုပ်ချုပ်မှု",
          englishTitle: "Library Governance & Structure",
          icon: <FolderOpen className="w-4 h-4" />,
          colorClass: "border-emerald-500/50 text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60",
          glowColor: "rgba(16,185,129,0.4)",
          detail: "စာကြည့်တိုက်အဖွဲ့အစည်းတစ်ခု၏ အခြေခံအဆောက်အအုံ၊ ကော်မတီဖွဲ့စည်းပုံနှင့် ရေရှည်ရည်မှန်းချက်များ ချမှတ်စီမံခြင်း ကဏ္ဍဖြစ်သည်၊၊",
          subTopics: [
            {
              id: "adm-struct-1",
              title: "စာကြည့်တိုက်ကော်မတီ",
              englishTitle: "Library Committee",
              detail: "စာကြည့်တိုက်၏ မူဝါဒများ၊ ဘဏ္ဍာရေးအခြေအနေနှင့် လုပ်ငန်းစဉ်များကို ကြီးကြပ်ဆုံးဖြတ်ပေးသည့် အဖွဲ့အစည်းဖြစ်သည်၊၊",
              examples: ["အကြံပေးကော်မတီဖွဲ့စည်းခြင်း", "အမှုဆောင်ကော်မတီအစည်းအဝေးများ ကျင်းပခြင်း"],
              keywords: ["Governance", "Advisory Board", "Policy Maker"]
            },
            {
              id: "adm-struct-2",
              title: "ဌာနခွဲများ ခွဲခြားခြင်း",
              englishTitle: "Departmentalization",
              detail: "စာကြည့်တိုက်အတွင်း လုပ်ငန်းတာဝန်အလိုက် ငှားရမ်းရေး၊ နည်းပညာဝန်ဆောင်မှု၊ ရှာဖွေရေး စသည့်ဌာနများ ခွဲခြားစီမံခြင်း ဖြစ်သည်၊၊",
              examples: ["Technical Section (စာအုပ်ကတ်တလောက်သွင်းဌာန)", "Circulation Section (စာအုပ်ငှားရမ်းရေးဌာန)"],
              keywords: ["Work Division", "Specialization", "Staff Organization"]
            },
            {
              id: "adm-struct-3",
              title: "ရည်မှန်းချက်ပန်းတိုင်",
              englishTitle: "Mission & Goals",
              detail: "စာကြည့်တိုက်တစ်ခုချင်းစီ၏ ဝန်ဆောင်မှုပစ်မှတ်၊ တန်ဖိုးထားမှုနှင့် အနာဂတ် ရည်မှန်းချက်များကို တိကျစွာ ရေးဆွဲချမှတ်ခြင်းဖြစ်သည်၊၊",
              examples: ["'ပြည်သူအားလုံး သတင်းအချက်အလက် လွယ်ကူစွာရရှိစေရန်' မစ်ရှင်ချမှတ်ခြင်း", "နှစ်တို/နှစ်ရှည် စီမံကိန်းများ ရေးဆွဲခြင်း"],
              keywords: ["Strategic Plan", "Mission Statement", "Vision", "Values"]
            }
          ]
        },
        {
          id: "adm-finance",
          title: "ဘဏ္ဍာရေး စီမံခန့်ခွဲမှု",
          englishTitle: "Financial Management",
          icon: <Database className="w-4 h-4" />,
          colorClass: "border-teal-500/50 text-teal-300 bg-teal-950/60 hover:bg-teal-900/60",
          glowColor: "rgba(20,184,166,0.4)",
          detail: "ရရှိနိုင်သော ငွေကြေးအရင်းအမြစ်များကို စိစစ်ပြီး လိုအပ်သောစာအုပ်ဝယ်ယူမှု၊ ဝန်ထမ်းလစာနှင့် လည်ပတ်စရိတ်များအတွက် ဘတ်ဂျက်စနစ်တကျ ရေးဆွဲခြင်းဖြစ်သည်၊၊",
          subTopics: [
            {
              id: "adm-fin-1",
              title: "ဘတ်ဂျက် ရေးဆွဲခြင်း",
              englishTitle: "Budgeting",
              detail: "စာကြည့်တိုက်၏ နှစ်စဉ်ဝင်ငွေနှင့် ထွက်ငွေများကို ကြိုတင်ခန့်မှန်းပြီး ဘာသာရပ်အလိုက် စာအုပ်ဝယ်ယူရန် ဝေခွဲသတ်မှတ်ခြင်းဖြစ်သည်၊၊",
              examples: ["Line-item Budget သုံးစွဲပုံဇယား", "Formula Budget ဖြင့် ဌာနအလိုက်ငွေခွဲဝေခြင်း"],
              keywords: ["Allocation", "Fiscal Year", "Revenue", "Expenditure"]
            },
            {
              id: "adm-fin-2",
              title: "ရန်ပုံငွေရှာဖွေခြင်း",
              englishTitle: "Fundraising & Grants",
              detail: "အစိုးရထောက်ပံ့ငွေအပြင် အလှူရှင်များရှာဖွေခြင်း၊ စာအုပ်အလှူပွဲများပြုလုပ်ခြင်းနှင့် အသင်းဝင်ကြေး ကောက်ခံခြင်းများ ပါဝင်သည်၊၊",
              examples: ["အလှူရှင်ဂုဏ်ပြုပွဲများ ပြုလုပ်ခြင်း", "နိုင်ငံတကာ NGO များထံ စီမံကိန်းတင်ပြ၍ ရန်ပုံငွေတောင်းခံခြင်း"],
              keywords: ["Donations", "External Funding", "Grants", "Sponsorship"]
            },
            {
              id: "adm-fin-3",
              title: "ဘဏ္ဍာရေး စာရင်းစစ်ဆေးခြင်း",
              englishTitle: "Financial Auditing",
              detail: "စာကြည့်တိုက်အသုံးစရိတ်များကို ပွင့်လင်းမြင်သာမှုရှိစေရန်နှင့် တရားဝင်ဖြစ်စေရန် နှစ်စဉ် စာရင်းစစ်အဖွဲ့ဖြင့် စနစ်တကျ စစ်ဆေးခြင်းဖြစ်သည်၊၊",
              examples: ["နှစ်ချုပ်ငွေစာရင်း ရှင်းတမ်း ပြုစုခြင်း", "ပြေစာနှင့် ဘောက်ချာများ စနစ်တကျသိမ်းဆည်းခြင်း"],
              keywords: ["Audit Trail", "Transparency", "Accountability"]
            }
          ]
        },
        {
          id: "adm-hr",
          title: "လူသားအရင်းအမြစ် စီမံခြင်း",
          englishTitle: "Human Resource Management",
          icon: <BookOpen className="w-4 h-4" />,
          colorClass: "border-cyan-500/50 text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60",
          glowColor: "rgba(6,182,212,0.4)",
          detail: "စာကြည့်တိုက်ဝန်ထမ်းများကို စနစ်တကျ ရွေးချယ်ခန့်အပ်ခြင်း၊ တာဝန်ဝတ္တရားသတ်မှတ်ခြင်းနှင့် အရည်အသွေးမြင့်မားလာစေရန် လေ့ကျင့်သင်ကြားပေးခြင်း ဖြစ်သည်၊၊",
          subTopics: [
            {
              id: "adm-hr-1",
              title: "ဝန်ထမ်းခန့်အပ်ခြင်း",
              englishTitle: "Staff Selection & Recruitment",
              detail: "စာကြည့်တိုက်အမျိုးအစားအလိုက် သင့်လျော်သော စာကြည့်တိုက်မှူး၊ လက်ထောက်စာကြည့်တိုက်မှူးနှင့် ကွန်ပျူတာကျွမ်းကျင်ဝန်ထမ်းများ ရွေးချယ်ခန့်အပ်ခြင်းဖြစ်သည်၊၊",
              examples: ["Professional Librarian နှင့် Semi-professional ခန့်အပ်ပုံ", "ရာထူးအဆင့်ဆင့် တာဝန်သတ်မှတ်ချက် ရေးဆွဲခြင်း"],
              keywords: ["Recruitment", "Job Specification", "Qualification"]
            },
            {
              id: "adm-hr-2",
              title: "ဝန်ထမ်းလေ့ကျင့်ပေးခြင်း",
              englishTitle: "In-service Training",
              detail: "နည်းပညာအသစ်များနှင့် ခေတ်မီစာကြည့်တိုက် စီမံခန့်ခွဲမှုစနစ် (ILS) ကို ဝန်ထမ်းများကျွမ်းကျင်စေရန် လုပ်ငန်းခွင်သင်တန်းများ ပေးခြင်းဖြစ်သည်၊၊",
              examples: ["RDA ကတ်တလောက် ရေးသွင်းနည်းသင်တန်း", "Koha software သုံးစွဲမှု မွမ်းမံသင်တန်း"],
              keywords: ["Skill Upgrading", "Capacity Building", "Professional Development"]
            },
            {
              id: "adm-hr-3",
              title: "စာကြည့်တိုက်မှူး ကျင့်ဝတ်",
              englishTitle: "Librarian Professional Ethics",
              detail: "သတင်းအချက်အလက်များကို ဘက်လိုက်မှုမရှိဘဲ စာဖတ်သူတိုင်းထံ မျှတစွာ ဖြန့်ဝေပေးရန်နှင့် စာဖတ်သူ၏ အချက်အလက်လုံခြုံမှုကို ထိန်းသိမ်းရမည့်ကျင့်ဝတ်ဖြစ်သည်၊၊",
              examples: ["စာဖတ်သူ၏ ကိုယ်ရေးအချက်အလက်ကို လျှို့ဝှက်ထားပေးခြင်း", "စာပေဆင်ဆာဖြတ်တောက်မှုကို ဆန့်ကျင်ပြီး လွတ်လပ်စွာ ဖတ်ရှုခွင့်ပေးခြင်း"],
              keywords: ["Censorship", "Privacy", "Information Freedom", "Neutrality"]
            }
          ]
        },
        {
          id: "adm-rules",
          title: "စည်းမျဉ်းများနှင့် မူဝါဒများ",
          englishTitle: "Rules & Policies",
          icon: <FileText className="w-4 h-4" />,
          colorClass: "border-sky-500/50 text-sky-300 bg-sky-950/60 hover:bg-sky-900/60",
          glowColor: "rgba(14,165,233,0.4)",
          detail: "စာဖတ်သူများနှင့် ဝန်ထမ်းများ လိုက်နာရမည့် ငှားရမ်းမှု၊ အသင်းဝင်မှုနှင့် စာကြည့်တိုက်အသုံးချမှုဆိုင်ရာ စံသတ်မှတ်ချက်များ ဖြစ်သည်၊၊",
          subTopics: [
            {
              id: "adm-rules-1",
              title: "ငှားရမ်းမှု မူဝါဒ",
              englishTitle: "Circulation Policy",
              detail: "စာအုပ်တစ်ကြိမ်ငှားလျှင် မည်မျှကြာကြာငှားနိုင်သည်၊ စာအုပ်အရေအတွက် မည်မျှအထိ ကန့်သတ်သည် စသည်တို့ကို သတ်မှတ်ခြင်းဖြစ်သည်၊၊",
              examples: ["ကျောင်းသားတစ်ဦးလျှင် စာအုပ် ၂ အုပ်၊ ၁၄ ရက် ငှားခွင့်သတ်မှတ်ခြင်း", "သုတေသန ကိုးကားစာအုပ်များကို ပြင်ပငှားခွင့်မပြုဘဲ စာကြည့်တိုက်အတွင်းသာ ဖတ်ခွင့်ပြုခြင်း"],
              keywords: ["Loan Period", "Due Date", "Renewal", "Check-out"]
            },
            {
              id: "adm-rules-2",
              title: "အသင်းဝင်စည်းမျဉ်းများ",
              englishTitle: "Membership Rules",
              detail: "စာကြည့်တိုက်အသင်းဝင်ကတ်ပြား ပြုလုပ်ပုံအဆင့်ဆင့်၊ လိုအပ်သော ထောက်ခံစာများနှင့် သက်တမ်းတိုးခြင်း လုပ်ငန်းစဉ်များ သတ်မှတ်ခြင်းဖြစ်သည်၊၊",
              examples: ["နိုင်ငံသားစိစစ်ရေးကတ် သို့မဟုတ် ကျောင်းသားကတ် ပြသစေခြင်း", "နှစ်စဉ် အသင်းဝင်သက်တမ်းတိုးရမည့်ရက် သတ်မှတ်ခြင်း"],
              keywords: ["Enrollment", "Library Card", "Registration", "Patron Data"]
            },
            {
              id: "adm-rules-3",
              title: "နောက်ကျကြေးနှင့် ပျက်စီးမှုဒဏ်",
              englishTitle: "Overdue Fines & Damages",
              detail: "စာအုပ်သတ်မှတ်ရက်ထက် နောက်ကျအပ်နှံပါက ဒဏ်ကြေးကောက်ခံခြင်းနှင့် စာအုပ်ပျောက်ဆုံး/ပျက်စီးပါက လျော်ကြေးသတ်မှတ်ခြင်းစနစ်ဖြစ်သည်၊၊",
              examples: ["တစ်ရက်နောက်ကျလျှင် ဒဏ်ကြေး ၅၀၀ ကျပ် သတ်မှတ်ခြင်း", "စာအုပ်ပျောက်ဆုံးပါက မူရင်းတန်ဖိုး၏ နှစ်ဆ သို့မဟုတ် အစားထိုးစာအုပ်အသစ် ပြန်လည်ပေးအပ်စေခြင်း"],
              keywords: ["Penalty Fee", "Replacement Cost", "Lost Item Procedure"]
            }
          ]
        },
        {
          id: "adm-pr",
          title: "ပြည်သူ့ဆက်ဆံရေးနှင့် ကွန်ရက်",
          englishTitle: "Public Relations & Outreach",
          icon: <Sparkles className="w-4 h-4" />,
          colorClass: "border-green-500/50 text-green-300 bg-green-950/60 hover:bg-green-900/60",
          glowColor: "rgba(34,197,94,0.4)",
          detail: "စာကြည့်တိုက်အသုံးပြုမှု မြင့်မားလာစေရန် ပြည်သူလူထုနှင့် ထိတွေ့ဆက်ဆံခြင်း၊ စာဖတ်ပွဲများကျင်းပခြင်းနှင့် ဝန်ဆောင်မှုများကို ကြော်ငြာခြင်းဖြစ်သည်၊၊",
          subTopics: [
            {
              id: "adm-pr-1",
              title: "စာအုပ်ပြပွဲများနှင့် ပွဲလမ်းများ",
              englishTitle: "Exhibitions & Events",
              detail: "စာအုပ်အသစ်များ မိတ်ဆက်ပွဲ၊ ရှေးဟောင်းပေပုရပိုက် ပြပွဲများနှင့် စာရေးဆရာများနှင့် တွေ့ဆုံပွဲများ ကျင်းပပေးခြင်းဖြစ်သည်၊၊",
              examples: ["အပြည်ပြည်ဆိုင်ရာ စာတတ်မြောက်ရေးနေ့ စာအုပ်ပြပွဲ", "ကလေးများအတွက် ပုံပြောပြိုင်ပွဲ ကျင်းပခြင်း"],
              keywords: ["Library Event", "Book Launch", "Cultural Program"]
            },
            {
              id: "adm-pr-2",
              title: "စာဖတ်ဝိုင်းများ ဖွဲ့စည်းခြင်း",
              englishTitle: "Book Clubs",
              detail: "စာဖတ်သူအချင်းချင်း ဖတ်ဖူးသည့်စာအုပ်များကို ဝေဖန်သုံးသပ်ကာ အပြန်အလှန်ဆွေးနွေး၍ ဗဟုသုတမျှဝေနိုင်မည့် အဖွဲ့ငယ်များ တည်ထောင်ပေးခြင်း ဖြစ်သည်၊၊",
              examples: ["လစဉ် သုတေသနစာဖတ်ဝိုင်း (Book Club)", "လူငယ်စာပေနှီးနှောဖလှယ်ပွဲများ စီစဉ်ပေးခြင်း"],
              keywords: ["Knowledge Sharing", "Book Review", "Literary Discussion"]
            }
          ]
        }
      ],
      selfTest: [
        {
          question: "စာကြည့်တိုက်၏ အနာဂတ်ဦးတည်ချက်နှင့် ဝန်ဆောင်မှုပေးရခြင်း၏ ရည်ရွယ်ချက်ကို ဖော်ပြထားသော စီမံခန့်ခွဲမှုစာတမ်းကို မည်သို့ခေါ်သနည်း။",
          options: ["ဘတ်ဂျက်အစီရင်ခံစာ", "မစ်ရှင်ထုတ်ပြန်ချက် (Mission Statement)", "ဝန်ထမ်းကျင့်ဝတ်", "စာအုပ်ငှားရမ်းမှုစည်းကမ်း"],
          correctIndex: 1,
          explanation: "Mission Statement (မစ်ရှင်ထုတ်ပြန်ချက်) သည် စာကြည့်တိုက်တစ်ခု တည်ရှိရခြင်း၏ အဓိကရည်ရွယ်ချက်၊ တာဝန်နှင့် ပစ်မှတ်ပရိသတ်ကို တိကျစွာဖော်ပြသော စီမံခန့်ခွဲမှုစာတမ်းဖြစ်သည်။"
        },
        {
          question: "စာဖတ်သူ၏ ကိုယ်ရေးအချက်အလက်ကို လျှို့ဝှက်ထားပေးခြင်းနှင့် စာပေဆင်ဆာဖြတ်တောက်မှုကို ဆန့်ကျင်ခြင်းမှာ မည်သည့်အရာနှင့် သက်ဆိုင်သနည်း။",
          options: ["စာကြည့်တိုက်မှူး ကျင့်ဝတ် (Professional Ethics)", "ဌာနခွဲများ ခွဲခြားခြင်း", "ရန်ပုံငွေရှာဖွေခြင်း", "နောက်ကျဒဏ်ကြေး ကောက်ခံခြင်း"],
          correctIndex: 0,
          explanation: "စာဖတ်သူများ၏ လွတ်လပ်စွာရှာဖွေဖတ်ရှုခွင့်နှင့် အချက်အလက်လုံခြုံမှုကို ထိန်းသိမ်းခြင်းမှာ စာကြည့်တိုက်မှူးများ လိုက်နာရမည့် အသက်မွေးဝမ်းကျောင်းဆိုင်ရာ ကျင့်ဝတ် (Professional Ethics) ဖြစ်သည်။"
        }
      ]
    },
    {
      id: "cal",
      code: "CAL",
      name: "Cataloguing & Bibliographic Standards",
      myanmarName: "စာအုပ်အညွှန်းပြုစုခြင်းနှင့် စံနှုန်းများ",
      color: "from-fuchsia-400 to-purple-500",
      glowColor: "rgba(217,70,239,0.5)",
      description: "စာအုပ်များနှင့် သတင်းရင်းမြစ်များကို စနစ်တကျ အညွှန်းစုဆောင်းပြီး ပြန်လည်ရှာဖွေရ လွယ်ကူအောင် နိုင်ငံတကာစံနှုန်းများနှင့်အညီ မှတ်တမ်းတင်ခြင်းပညာ",
      branches: [
        {
          id: "cal-types",
          title: "ကတ်တလောက် အမျိုးအစားများ",
          englishTitle: "Types of Library Catalogues",
          icon: <Book className="w-4 h-4" />,
          colorClass: "border-fuchsia-500/50 text-fuchsia-300 bg-fuchsia-950/60 hover:bg-fuchsia-900/60",
          glowColor: "rgba(217,70,239,0.4)",
          detail: "သမိုင်းတစ်လျှောက် အသုံးပြုခဲ့သည့် စာအုပ်ညွှန်းကတ်ပြားစနစ်များမှသည် ယနေ့ခေတ် အင်တာနက်အခြေပြု စာအုပ်ရှာဖွေရေး စနစ်များအထိ အမျိုးအစားများဖြစ်သည်။",
          subTopics: [
            {
              id: "cal-types-1",
              title: "ကတ်ပြားကတ်တလောက်",
              englishTitle: "Card Catalogue",
              detail: "စာကြည့်တိုက်များတွင် အသုံးပြုခဲ့သည့် ၅x၃ လက်မအရွယ် စက္ကူကတ်ပြားငယ်များကို အက္ခရာစဉ်အလိုက် သေတ္တာငယ်များထဲတွင် စုစည်းထားသော ရိုးရာရှာဖွေမှုစနစ် ဖြစ်သည်၊၊",
              examples: ["စာရေးသူကတ်ပြား (Author Card)", "ခေါင်းစဉ်ကတ်ပြား (Title Card) သေတ္တာများ"],
              keywords: ["Traditional Card", "Cabinet", "Alphabetical Order"]
            },
            {
              id: "cal-types-2",
              title: "OPAC အွန်လိုင်းကတ်တလောက်",
              englishTitle: "Online Public Access Catalogue (OPAC)",
              detail: "စာကြည့်တိုက်အတွင်းရှိ ကွန်ပျူတာ terminal များမှတစ်ဆင့် စာအုပ်များ၏ တည်နေရာနှင့် ငှားယူနိုင်မှု အခြေအနေကို အချိန်နှင့်တပြေးညီ ရှာဖွေနိုင်သော စနစ်ဖြစ်သည်၊၊",
              examples: ["Koha OPAC Search Engine", "တက္ကသိုလ်စာကြည့်တိုက်သုံး WebOPAC စနစ်များ"],
              keywords: ["Digital Search", "Real-time Status", "LMS Integration"]
            },
            {
              id: "cal-types-3",
              title: "ပူးတွဲကတ်တလောက်",
              englishTitle: "Union Catalogue",
              detail: "စာကြည့်တိုက်အများအပြား သို့မဟုတ် တစ်နိုင်ငံလုံးရှိ စာကြည့်တိုက်များရှိ စာအုပ်စာရင်းများကို စုစည်းထားသော ဘုံကတ်တလောက်စနစ် ဖြစ်သည်၊၊",
              examples: ["OCLC WorldCat - ကမ္ဘာ့အကြီးဆုံး ပူးတွဲကတ်တလောက်ကြီး", "မြန်မာနိုင်ငံတက္ကသိုလ်များ ပူးတွဲစာအုပ်ညွှန်းစနစ်"],
              keywords: ["Collaborative Cataloguing", "Shared Resource", "Global Database"]
            }
          ]
        },
        {
          id: "cal-standards",
          title: "စာဖော်ပြမှု စံနှုန်းများ",
          englishTitle: "Bibliographic Standards",
          icon: <FileText className="w-4 h-4" />,
          colorClass: "border-purple-500/50 text-purple-300 bg-purple-950/60 hover:bg-purple-900/60",
          glowColor: "rgba(168,85,247,0.4)",
          detail: "စာအုပ်၏ အချက်အလက်များ (အမည်၊ ရေးသူ၊ အင်္ဂါရပ်) ကို တစ်ကမ္ဘာလုံး တစ်သမတ်တည်းဖြစ်အောင် ဖော်ပြရန် သတ်မှတ်ထားသော ရေးထုံးစံနှုန်းများ ဖြစ်သည်၊၊",
          subTopics: [
            {
              id: "cal-std-1",
              title: "AACR2 စည်းမျဉ်းများ",
              englishTitle: "Anglo-American Cataloguing Rules 2nd Ed",
              detail: "ကတ်ပြားစနစ်ခေတ်က အဓိကသုံးစွဲခဲ့သော စာအုပ်နှင့် အခြားပစ္စည်းများ၏ စာစုအချက်အလက်ကို ဖော်ပြသည့် အင်္ဂလိပ်-အမေရိကန် စံရေးထုံးနည်းဥပဒေဖြစ်သည်၊၊",
              examples: ["Main entry တွင် စာရေးသူနောက်ဆုံးအမည်ကို အရင်ရေးခြင်း (ဥပမာ- စိန်, မောင်)"],
              keywords: ["Descriptive Rules", "Legacy System", "Punctuation Standards"]
            },
            {
              id: "cal-std-2",
              title: "RDA စံနှုန်းသစ်",
              englishTitle: "Resource Description & Access",
              detail: "AACR2 ၏ နောက်ကောက်ပေါ်ပေါက်လာသော ဒစ်ဂျစ်တယ်ရင်းမြစ်များ၊ အွန်လိုင်းစာမျက်နှာများကိုပါ စနစ်တကျ ဖော်ပြနိုင်သည့် ခေတ်သစ် အချက်အလက်ဖော်ပြမှုစံနှုန်းဖြစ်သည်၊၊",
              examples: ["WEMI Concept (Work, Expression, Manifestation, Item)", "အင်တာနက်စာမျက်နှာများနှင့် e-books များကို လွယ်ကူစွာ ကတ်တလောက်သွင်းခြင်း"],
              keywords: ["FRBR Model", "Semantic Web", "Digital Era Standards", "Flexible Data"]
            },
            {
              id: "cal-std-3",
              title: "ISBD သတ်မှတ်ချက်",
              englishTitle: "International Standard Bibliographic Description",
              detail: "စာအုပ်အချက်အလက်များကို နယ်ပယ်ကြီး ၈ ခု (Areas) ခွဲခြားပြီး ပုဒ်ဖြတ်ပုဒ်ရပ် သင်္ကေတများဖြင့် သတ်မှတ်ဖော်ပြသော နိုင်ငံတကာ စံနှုန်းဖြစ်သည်၊၊",
              examples: ["ခေါင်းစဉ်နှင့် ရေးသူကြားတွင် ' / ' (slash) ခြားခြင်း", "ထုတ်ဝေသူအမည် ရှေ့တွင် ' : ' (colon) စံသတ်မှတ်ချက်သုံးခြင်း"],
              keywords: ["IFLA Rules", "8 Elements Area", "Universal Punctuation"]
            }
          ]
        },
        {
          id: "cal-marc",
          title: "MARC 21 Format",
          englishTitle: "Machine-Readable Cataloguing",
          icon: <Database className="w-4 h-4" />,
          colorClass: "border-pink-500/50 text-pink-300 bg-pink-950/60 hover:bg-pink-900/60",
          glowColor: "rgba(236,72,153,0.4)",
          detail: "စာအုပ်များ၏ သတင်းအချက်အလက်ကို ကွန်ပျူတာစနစ်များမှ ဖတ်ရှုနားလည်နိုင်ရန် သတ်မှတ်ထားသော ဂဏန်း Tag ကုဒ်များသုံးစွဲသည့် စံပုံစံခွက် ဖြစ်သည်၊၊",
          subTopics: [
            {
              id: "cal-marc-1",
              title: "Tag 245 (စာအုပ်အမည်)",
              englishTitle: "Title Statement (Tag 245)",
              detail: "စာအုပ်၏ အဓိကခေါင်းစဉ်၊ ခေါင်းစဉ်ခွဲနှင့် ရေးသားသူအချက်အလက်များကို ကွန်ပျူတာဖတ်နိုင်အောင် သိမ်းဆည်းသည့် Tag ဖြစ်သည်၊၊",
              examples: ["245 10 $a စာကြည့်တိုက်သိပ္ပံအခြေခံ / $c မောင်လှ။", "Subfield $a တွင် အဓိကခေါင်းစဉ်၊ Subfield $c တွင် ရေးသူ ထည့်ခြင်း"],
              keywords: ["Title Field", "Subfield a and c", "Indicator Values"]
            },
            {
              id: "cal-marc-2",
              title: "Tag 100 (အဓိကရေးသူ)",
              englishTitle: "Main Entry - Personal Name (Tag 100)",
              detail: "စာအုပ်ကို ရေးသားသူ တစ်ဦးတည်းရှိပါက ၎င်း၏အမည်ကို အဓိကရှာဖွေနိုင်ရန် Tag 100 တွင် သတ်မှတ်ထည့်သွင်းခြင်းဖြစ်သည်၊၊",
              examples: ["100 1# $a လှ, မောင်, $e author."],
              keywords: ["Primary Author", "Personal Name", "Relator Term"]
            },
            {
              id: "cal-marc-3",
              title: "Tag 264 (ထုတ်ဝေမှု)",
              englishTitle: "Production & Publication (Tag 264)",
              detail: "စာအုပ်ကို ထုတ်ဝေသည့် မြို့၊ ထုတ်ဝေသူအမည်နှင့် ထုတ်ဝေသည့်ခုနှစ် စသည့်အချက်အလက်များကို သိမ်းဆည်းရန် သုံးစွဲသည့် Tag ဖြစ်သည်၊၊",
              examples: ["264 #1 $a ရန်ကုန် : $b စာပေဗိမာန်, $c 2026."],
              keywords: ["Imprint Info", "Place of Publication", "Date of Publication"]
            }
          ]
        }
      ],
      selfTest: [
        {
          question: "ကွန်ပျူတာများနှင့် စာကြည့်တိုက်ဆော့ဖ်ဝဲများက စာအုပ်အချက်အလက်ကို ဖတ်ရှုနားလည်နိုင်ရန် ဂဏန်း Tag များဖြင့် ဖွဲ့စည်းထားသော နိုင်ငံတကာသုံး Format မှာ မည်သည့်အရာနည်း။",
          options: ["AACR2", "MARC 21", "DDC", "Dublin Core"],
          correctIndex: 1,
          explanation: "MARC 21 (Machine-Readable Cataloging) သည် ကွန်ပျူတာများက စာအုပ်အညွှန်းများကို ဖတ်ရှု၊ သိမ်းဆည်း၊ ဖလှယ်နိုင်ရန် ဖန်တီးထားသော Tag အခြေပြု standard format ဖြစ်သည်။"
        },
        {
          question: "MARC 21 စနစ်တွင် Tag 264 သည် မည်သည့်သတင်းအချက်အလက်ကို ကိုယ်စားပြုသနည်း။",
          options: ["စာအုပ်၏ အဓိကရေးသူအမည်", "စာအုပ်၏ ခေါင်းစဉ် (Title)", "ထုတ်ဝေမှုအချက်အလက် (Publication, Distribution)", "စာအုပ်၏ စာမျက်နှာအကွာအဝေး"],
          correctIndex: 2,
          explanation: "Tag 264 (ယခင် Tag 260 အစားသုံးသည်) သည် စာအုပ်ထုတ်ဝေသည့်နေရာ ($a)၊ ထုတ်ဝေသူ ($b) နှင့် ထုတ်ဝေသည့်ခုနှစ် ($c) စသည့် ထုတ်ဝေမှုအချက်အလက်များကို သိမ်းဆည်းသည်။"
        }
      ]
    },
    {
      id: "mcs",
      code: "MCS",
      name: "Metadata & Classification Systems",
      myanmarName: "မေတာဒေတာနှင့် ဘာသာရပ်ခွဲခြားမှုစနစ်များ",
      color: "from-amber-400 to-orange-500",
      glowColor: "rgba(245,158,11,0.5)",
      description: "စာအုပ်များကို ဘာသာရပ်တူရာစုစည်း၍ နံပါတ်များပေးခြင်းနှင့် သတင်းအချက်အလက်များကို သရုပ်ခွဲသည့် မေတာဒေတာစနစ်များ",
      branches: [
        {
          id: "mcs-schemes",
          title: "အမျိုးအစားခွဲခြားမှုစနစ်များ",
          englishTitle: "Classification Schemes",
          icon: <Book className="w-4 h-4" />,
          colorClass: "border-amber-500/50 text-amber-300 bg-amber-950/60 hover:bg-amber-900/60",
          glowColor: "rgba(245,158,11,0.4)",
          detail: "စာအုပ်များကို စာစင်ပေါ်တွင် စနစ်တကျ အစီအစဉ်တကျဖြစ်စေရန်နှင့် ဘာသာရပ်တူရာ စာအုပ်များ ပေါင်းစည်းထားရန် အသုံးပြုသည့် သင်္ကေတဂဏန်းစနစ်များဖြစ်သည်။",
          subTopics: [
            {
              id: "mcs-sch-1",
              title: "DDC စနစ် (Dewey)",
              englishTitle: "Dewey Decimal Classification",
              detail: "Melvil Dewey တီထွင်ခဲ့သော ကမ္ဘာ့အသုံးအများဆုံး ဒသမစနစ်ဖြစ်ပြီး ဗဟုသုတများကို အဓိက အတန်းကြီး ၁၀ ခုဖြင့် ဂဏန်း ၃ လုံးသုံးကာ ခွဲခြားသည်၊၊",
              examples: ["လူထုစာကြည့်တိုက်များတွင် အဓိကသုံးစွဲခြင်း", "စာအုပ်များကို ဂဏန်းအလိုက် (ဥပမာ 500 - Pure Science) စီစဉ်ခြင်း"],
              keywords: ["Decimal Base", "Decimal Point", "10 Main Classes", "Relative Index"]
            },
            {
              id: "mcs-sch-2",
              title: "LCC စနစ် (Congress)",
              englishTitle: "Library of Congress Classification",
              detail: "အမေရိကန်ကွန်ဂရက်စာကြည့်တိုက်က တီထွင်ခဲ့ပြီး အက္ခရာများနှင့် ဂဏန်းများကို တွဲဖက်ကာ စာအုပ်အမျိုးအစားခွဲခြားသည့်စနစ် ဖြစ်သည်၊၊",
              examples: ["အကြီးစား သုတေသနစာကြည့်တိုက်များနှင့် တက္ကသိုလ်စာကြည့်တိုက်များတွင် သုံးစွဲခြင်း", "ဥပမာ- Q (Science), QA (Mathematics)"],
              keywords: ["Alphanumeric System", "Academic Library", "Specialized System"]
            },
            {
              id: "mcs-sch-3",
              title: "UDC စနစ်",
              englishTitle: "Universal Decimal Classification",
              detail: "DDC ပေါ်အခြေခံကာ ပိုမိုရှုပ်ထွေးပြီး သရုပ်ခွဲနိုင်သည့် အထူးသင်္ကေတများ (+, :, = စသည်) ကို ပေါင်းစပ်အသုံးပြုသော ဘက်စုံသုံး ဒသမစနစ်ဖြစ်သည်၊၊",
              examples: ["သိပ္ပံနှင့် နည်းပညာ အထူးစာကြည့်တိုက်များတွင် သုံးစွဲခြင်း", "ဘာသာရပ်နှစ်ခု ချိတ်ဆက်မှုပြရန် ':' သင်္ကေတသုံးခြင်း"],
              keywords: ["Faceted Classification", "Multilingual", "Interdisciplinary Connection"]
            }
          ]
        },
        {
          id: "mcs-ddc",
          title: "DDC အဓိကအတန်းကြီး ၁၀ ခု",
          englishTitle: "DDC 10 Main Classes",
          icon: <Database className="w-4 h-4" />,
          colorClass: "border-orange-500/50 text-orange-300 bg-orange-950/60 hover:bg-orange-900/60",
          glowColor: "rgba(249,115,22,0.4)",
          detail: "ဒေါ့ဝေးဒသမစနစ်၏ ပထမဂဏန်း ၃ လုံးဖြင့် ခွဲခြားထားသော လူသားတို့၏ သိပ္ပံနှင့် လူမှုရေး အသိပညာရပ်နယ်ပယ်ကြီး ၁၀ ခု ဖြစ်သည်၊၊",
          subTopics: [
            {
              id: "mcs-ddc-1",
              title: "000 မှ 300 အထိ",
              englishTitle: "000 - 300 Classes",
              detail: "000 (ကွန်ပျူတာနှင့် အထွေထွေ)၊ 100 (ဒဿနိကဗေဒနှင့် စိတ်ပညာ)၊ 200 (ဘာသာရေး)၊ 300 (လူမှုသိပ္ပံပညာရပ်များ) တို့ ပါဝင်သည်၊၊",
              examples: ["220 - သမ္မာကျမ်းစာ၊ 294 - ဗုဒ္ဓဘာသာနှင့် အရှေ့တိုင်းဘာသာရေး", "340 - ဥပဒေပညာရပ်၊ 370 - ပညာရေးပညာရပ်"],
              keywords: ["Generalities", "Philosophy", "Religion", "Social Sciences"]
            },
            {
              id: "mcs-ddc-2",
              title: "400 မှ 600 အထိ",
              englishTitle: "400 - 600 Classes",
              detail: "400 (ဘာသာစကားပညာ)၊ 500 (သဘာဝသိပ္ပံနှင့် သင်္ချာ)၊ 600 (အသုံးချသိပ္ပံနှင့် နည်းပညာ) တို့ ဖြစ်သည်၊၊",
              examples: ["420 - အင်္ဂလိပ်စာလုံးပေါင်းနှင့် ရေးထုံး၊ 510 - သင်္ချာပညာ", "610 - ဆေးပညာရပ်၊ 630 - စိုက်ပျိုးရေးပညာရပ်"],
              keywords: ["Language", "Pure Science", "Technology", "Applied Sciences"]
            },
            {
              id: "mcs-ddc-3",
              title: "700 မှ 900 အထိ",
              englishTitle: "700 - 900 Classes",
              detail: "700 (အနုပညာနှင့် အပန်းဖြေ)၊ 800 (စာပေအနုပညာ)၊ 900 (သမိုင်းနှင့် ပထဝီဝင်) တို့ ဖြစ်သည်၊၊",
              examples: ["780 - ဂီတအနုပညာ၊ 820 - အင်္ဂလိပ်စာပေဝတ္ထုများ", "959.1 - မြန်မာ့သမိုင်းဆိုင်ရာစာပေများ"],
              keywords: ["Arts & Recreation", "Literature", "History & Geography"]
            }
          ]
        },
        {
          id: "mcs-meta",
          title: "မေတာဒေတာ စံနှုန်းများ",
          englishTitle: "Metadata Standards & Schemas",
          icon: <Sparkles className="w-4 h-4" />,
          colorClass: "border-yellow-500/50 text-yellow-300 bg-yellow-950/60 hover:bg-yellow-900/60",
          glowColor: "rgba(234,179,8,0.4)",
          detail: "ဒစ်ဂျစ်တယ်စာမျက်နှာများ၊ e-books များနှင့် မာလ်တီမီဒီယာများကို စနစ်တကျ ရှာဖွေနိုင်ရန် ဖော်ပြထားသော 'အချက်အလက်ကို ညွှန်းသည့် အချက်အလက်' ဖြစ်သည်၊၊",
          subTopics: [
            {
              id: "mcs-met-1",
              title: "Dublin Core စံနှုန်း",
              englishTitle: "Dublin Core Metadata Initiative",
              detail: "ရိုးရှင်းပြီး လိုက်နာရလွယ်ကူသော အခြေခံဒြပ်စင် ၁၅ ခု (Elements) ဖြင့် ဒစ်ဂျစ်တယ်ရင်းမြစ်များကို ဖော်ပြသည့် ကမ္ဘာသုံး မေတာဒေတာစံနှုန်းဖြစ်သည်၊၊",
              examples: ["Title (အမည်), Creator (ဖန်တီးသူ), Date (ခုနှစ်), Subject (ဘာသာရပ်) စသည်တို့ သတ်မှတ်ခြင်း"],
              keywords: ["15 Basic Elements", "Simplicity", "Web Resources", "Cross-domain Map"]
            },
            {
              id: "mcs-met-2",
              title: "MODS & METS စနစ်",
              englishTitle: "MODS / METS Framework",
              detail: "XML ပေါ်တွင် အခြေခံထားပြီး အမေရိကန်ကွန်ဂရက်စာကြည့်တိုက်က တည်ထောင်ခဲ့သော စာစုအချက်အလက်နှင့် ဒစ်ဂျစ်တယ် ဖိုင်တည်ဆောက်ပုံဖော်ပြသည့် စနစ်ဖြစ်သည်၊၊",
              examples: ["ဒစ်ဂျစ်တယ်မော်ကွန်းတိုက်များတွင် PDF ဖိုင်ဖွဲ့စည်းပုံကို သတ်မှတ်ထိန်းသိမ်းခြင်း"],
              keywords: ["XML-based", "Structural Metadata", "Digital Preservation", "Data Transmission"]
            }
          ]
        }
      ],
      selfTest: [
        {
          question: "ဒေါ့ဝေးဒသမစနစ် (DDC) တွင် 'Pure Science' (သင်္ချာ၊ ရူပဗေဒ၊ ဓာတုဗေဒ စသည့် သဘာဝသိပ္ပံပညာရပ်များ) သည် မည်သည့်အတန်းနံပါတ်ကြီးတွင် ပါဝင်သနည်း။",
          options: ["300 Class", "500 Class", "600 Class", "800 Class"],
          correctIndex: 1,
          explanation: "DDC စနစ်တွင် 500 Class သည် Pure Science (သဘာဝသိပ္ပံနှင့် သင်္ချာ) ဖြစ်ပြီး၊ 600 သည် Applied Science (နည်းပညာ၊ ဆေးပညာ၊ စိုက်ပျိုးရေး) ဖြစ်သည်။"
        },
        {
          question: "Title, Creator, Subject, Publisher နှင့် Date အပါအဝင် အခြေခံဒြပ်စင် ၁၅ ခုပါဝင်သည့် ဒစ်ဂျစ်တယ် မေတာဒေတာ စံနှုန်းမှာ အဘယ်နည်း။",
          options: ["MARC 21", "Dublin Core", "LCC Schema", "Sears Vocabulary"],
          correctIndex: 1,
          explanation: "Dublin Core (Dublin Core Metadata Initiative) သည် ဒစ်ဂျစ်တယ်စာမျက်နှာများနှင့် အရင်းအမြစ်များကို မြန်ဆန်လွယ်ကူစွာ ဖော်ပြရန် အဓိကဒြပ်စင် ၁၅ ခုဖြင့် ဖွဲ့စည်းထားသော နိုင်ငံတကာစံနှုန်းဖြစ်သည်။"
        }
      ]
    },
    {
      id: "mss",
      code: "MSS",
      name: "Manuscripts & Special Collections",
      myanmarName: "ရှေးဟောင်းပေစာ၊ ပုရပိုက်နှင့် အထူးစုဆောင်းမှုများ",
      color: "from-cyan-400 to-indigo-500",
      glowColor: "rgba(6,182,212,0.5)",
      description: "ရှေးဟောင်းပေစာ၊ ပုရပိုက်များနှင့် တန်ဖိုးကြီး အထူးစုဆောင်းမှုစာပေများကို ရေရှည်တည်တံ့စေရန် ထိန်းသိမ်းစောင့်ရှောက်သည့် သိပ္ပံနည်းကျပညာရပ်",
      branches: [
        {
          id: "mss-types",
          title: "ရှေးဟောင်းစာပေ အမျိုးအစားများ",
          englishTitle: "Types of Heritage Manuscripts",
          icon: <BookOpen className="w-4 h-4" />,
          colorClass: "border-cyan-500/50 text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60",
          glowColor: "rgba(6,182,212,0.4)",
          detail: "ပုံနှိပ်စက်များ မပေါ်မီခေတ်က မြန်မာ့ရိုးရာအမွေအနှစ်အဖြစ် လက်ရေးဖြင့် ရေးသားမှတ်တမ်းတင်ခဲ့သော စာပေအမျိုးအစားများဖြစ်သည်။",
          subTopics: [
            {
              id: "mss-typ-1",
              title: "ပေစာများ",
              englishTitle: "Palm-leaf Manuscripts",
              detail: "သဘာဝပေပင်မှရရှိသော ပေရွက်များကို အချပ်များပြုလုပ်ပြီး သံကညစ်ဖြင့် စာလုံးများကို အဝိုင်းပုံစံများ ရေးထွင်းထားသော ရှေးဟောင်းအမွေအနှစ်စာစု ဖြစ်သည်၊၊",
              examples: ["ပိဋကတ်တော် ပေစာထုပ်များ", "ဆေးကျမ်း၊ နက္ခတ်ကျမ်း ပေရွက်များ"],
              keywords: ["Corypha umbraculifera", "Stylus (ကညစ်)", "Oiling", "Preservation"]
            },
            {
              id: "mss-typ-2",
              title: "ပုရပိုက်များ",
              englishTitle: "Paper Parabaiks",
              detail: "ထန်းပင်ခေါက် သို့မဟုတ် မိုင်းကိုင်စက္ကူများကို အဆင့်ဆင့် ထူထပ်စွာ ပြုလုပ်ပြီး အခေါက်များအဖြစ် ရေးသားသော မြန်မာ့ရိုးရာ စာအုပ်ဒီဇိုင်း ဖြစ်သည်၊၊",
              examples: ["ပုရပိုက်ဖြူ (မှင်မည်းဖြင့် ရေးသည်)", "ပုရပိုက်နက် (မြေဖြူ သို့မဟုတ် ကံ့ကူဆံဖြင့် ရေးသည်)"],
              keywords: ["Accordion Fold", "Shan Paper", "Steatite Pencil (ကံ့ကူဆံ)"]
            },
            {
              id: "mss-typ-3",
              title: "ကမ္မဝါစာ",
              englishTitle: "Kammavaca Text",
              detail: "သံဃာ့ကံဆောင်လုပ်ငန်းများအတွက် အသုံးပြုသည့် ရွှေချ၊ ဆေးရေး ပုံစံများဖြင့် အလွန်တန်ဖိုးကြီးပြီး လှပစွာ ပြုလုပ်ထားသော သာသနာရေး စာစုဖြစ်သည်၊၊",
              examples: ["ကျောက်ကျောကမ္မဝါ", "ပိုးကမ္မဝါစာထုပ်များ"],
              keywords: ["Buddhist Ritual Text", "Lacquer & Gold Leaf", "Decorative Art"]
            }
          ]
        },
        {
          id: "mss-prep",
          title: "ပေစာပြုစုမှု အဆင့်ဆင့်",
          englishTitle: "Manuscripts Preparation",
          icon: <FileText className="w-4 h-4" />,
          colorClass: "border-blue-500/50 text-blue-300 bg-blue-950/60 hover:bg-blue-900/60",
          glowColor: "rgba(59,130,246,0.4)",
          detail: "ပေရွက်များကို သဘာဝအတိုင်း ရယူပြီး စာရေးသားရန် သင့်လျော်အောင် သိပ္ပံနှင့် ရိုးရာနည်းလမ်းများ ပေါင်းစပ်၍ ပြင်ဆင်ပုံအဆင့်ဆင့် ဖြစ်သည်၊၊",
          subTopics: [
            {
              id: "mss-prp-1",
              title: "ပေရွက်ပြင်ဆင်ခြင်း",
              englishTitle: "Leaf Processing",
              detail: "ပေပင်မှ ဖြတ်ယူလာသော ပေရွက်နုများကို ဆားရည် သို့မဟုတ် ဆေးဖက်ဝင် အရည်များဖြင့် ပြုတ်ပြီး ခြောက်သွေ့အောင်ပြုလုပ်ကာ စာရေးရန် ပြားချပ်အောင် ပွတ်တိုက်ခြင်း ဖြစ်သည်၊၊",
              examples: ["ပေရွက်များကို ကြိုးတန်း၍ နှင်းဒဏ်၊ နေဒဏ်ခံစေခြင်း", "ပေရွက်တစ်ချပ်စီကို အလျားညီအောင် ဖြတ်တောက်ခြင်း"],
              keywords: ["Boiling", "Drying", "Smoothing", "Size Cutting"]
            },
            {
              id: "mss-prp-2",
              title: "ကညစ်ဖြင့် ရေးထွင်းခြင်း",
              englishTitle: "Scribing with Stylus",
              detail: "ထိပ်ဖျား ချွန်ထက်သော သံကညစ် (Stylus) ကို အသုံးပြုကာ ပေရွက်မျက်နှာပြင်၏ ဖိုင်ဘာကြောများကို မပျက်စီးစေဘဲ စာလုံးများကို အကွေးအဝိုင်းများဖြင့် ရေးထွင်းခြင်း ဖြစ်သည်၊၊",
              examples: ["ပေစာရေးဆရာ (ကညစ်ကိုင်) က တစ်ရက်လျှင် ပေရွက်အနည်းငယ်သာ ရေးထွင်းနိုင်ခြင်း"],
              keywords: ["Iron Stylus", "Circular Script (မြန်မာအဝိုင်းစာ)", "Manual Incising"]
            },
            {
              id: "mss-prp-3",
              title: "ရေနံချေးသုတ်ခြင်း",
              englishTitle: "Oiling & Ink Infusion",
              detail: "စာလုံးများ ရေးထွင်းပြီးပါက ကညစ်ရာထဲသို့ သဘာဝရေနံချေးနှင့် မီးသွေးမှုန့် ရောစပ်သုတ်လိမ်းကာ ပိုလျှံသည်များကို ပြန်လည်သုတ်သင်ပြီး စာလုံးပေါ်လွင်စေခြင်းဖြစ်သည်၊၊",
              examples: ["မီးသွေးမှုန့်ကြောင့် စာလုံးများ အနက်ရောင်ပြောင်းသွားခြင်း", "ရေနံချေးကြောင့် ပေရွက်ပျော့ပျောင်းပြီး ပိုးမွှားဒဏ်ခံနိုင်ခြင်း"],
              keywords: ["Crude Oil", "Charcoal Powder", "Insect Repellent", "Legibility"]
            }
          ]
        },
        {
          id: "mss-conserv",
          title: "မော်ကွန်းထိန်းသိမ်းမှုပညာ",
          englishTitle: "Conservation & Archival Science",
          icon: <Database className="w-4 h-4" />,
          colorClass: "border-indigo-500/50 text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/60",
          glowColor: "rgba(99,102,241,0.4)",
          detail: "ရှေးဟောင်းရိုးရာ စာပေပစ္စည်းများ အပူချိန်၊ စိုထိုင်းဆနှင့် ပိုးမွှားများကြောင့် မပျက်စီးစေရန် သိပ္ပံနည်းကျ စောင့်ရှောက်ခြင်းဖြစ်သည်၊၊",
          subTopics: [
            {
              id: "mss-con-1",
              title: "ပတ်ဝန်းကျင် ထိန်းချုပ်ခြင်း",
              englishTitle: "Environmental Control",
              detail: "မော်ကွန်းတိုက်အတွင်း၌ အပူချိန်ကို ၂၀°C ဝန်းကျင်နှင့် စိုထိုင်းဆ (Relative Humidity) ကို 50-60% အတွင်း အမြဲတစေ ထိန်းညှိထားရှိခြင်းဖြစ်သည်၊၊",
              examples: ["24-hour Air Conditioning သုံးစွဲခြင်း", "Dehumidifier (စိုထိုင်းဆလျှော့စက်) ထားရှိခြင်း"],
              keywords: ["Relative Humidity (RH)", "Temperature Play", "Mold Prevention"]
            },
            {
              id: "mss-con-2",
              title: "ပိုးမွှားဒဏ် ကာကွယ်ခြင်း",
              englishTitle: "Biological Damage Control",
              detail: "ပေရွက်များကို စားတတ်သော ပိုးဟပ်၊ ခြနှင့် စာအုပ်ပိုးကောင်များ ကင်းစင်စေရန် သဘာဝဆေးဖက်ဝင် ပစ္စည်းများ (ဥပမာ ဖယောင်း၊ သနပ်ခါး) သုံး၍ ကာကွယ်ခြင်း ဖြစ်သည်၊၊",
              examples: ["ပေစာထုပ်များကြားတွင် သဘာဝဆေးဖက်ဝင် အနံ့ရှိသောအပင်များ ထည့်သိမ်းခြင်း", "ပိုးသတ်ဆေး အငွေ့မှိုင်းတိုက်ခြင်း (Fumigation)"],
              keywords: ["Insects", "Termite control", "Fumigation", "Natural Repellents"]
            }
          ]
        },
        {
          id: "mss-digital",
          title: "ဒစ်ဂျစ်တယ်စနစ် ပြောင်းလဲခြင်း",
          englishTitle: "Digitization of Manuscripts",
          icon: <Sparkles className="w-4 h-4" />,
          colorClass: "border-sky-500/50 text-sky-300 bg-sky-950/60 hover:bg-sky-900/60",
          glowColor: "rgba(14,165,233,0.4)",
          detail: "ရှေးဟောင်းပေပုရပိုက်များကို ပျက်စီးမည့်ဘေးမှ ကာကွယ်ရန်နှင့် တစ်ကမ္ဘာလုံး ဖတ်ရှုနိုင်စေရန် အရည်အသွေးမြင့် ကင်မရာများသုံးကာ digital archive ပြုလုပ်ခြင်း ဖြစ်သည်၊၊",
          subTopics: [
            {
              id: "mss-dig-1",
              title: "High-resolution Photography",
              englishTitle: "High-resolution Photography",
              detail: "ပေရွက်တစ်ချပ်ချင်းစီအား အရိပ်မကျစေဘဲ နောက်ခံအမည်းဖြင့် တိကျစွာ high-res ဓာတ်ပုံရိုက်ကူး မှတ်တမ်းတင်ခြင်း ဖြစ်သည်၊၊",
              examples: ["Cradle Scanner ဖြင့် စာအုပ်များ စကန်ဖတ်ခြင်း", "ဓာတ်ပုံရိုက်စဉ် ပေစာ မထိခိုက်အောင် လက်အိတ်စွပ်ကိုင်တွယ်စေခြင်း"],
              keywords: ["Image Capture", "Diffused Lighting", "TIFF Format", "No-flash Option"]
            },
            {
              id: "mss-dig-2",
              title: "မေတာဒေတာ ချိတ်ဆက်ခြင်း",
              englishTitle: "Metadata Tagging",
              detail: "ဓာတ်ပုံရိုက်ပြီးသား ဖိုင်များကို စာဖတ်သူ ရှာဖွေနိုင်ရန် ပေစာအမည်၊ ကဏ္ဍ၊ ခုနှစ်နှင့် ရေးသူအချက်အလက်များ metadata ထည့်သွင်းခြင်း ဖြစ်သည်၊၊",
              examples: ["ရှေးဟောင်းပေစာ နံပါတ်စနစ် သတ်မှတ်ခြင်း", "e-Manuscript metadata စာရင်းသွင်းခြင်း"],
              keywords: ["Metadata Schema", "Searchability", "Archival Description"]
            }
          ]
        }
      ],
      selfTest: [
        {
          question: "ကညစ်ဖြင့် ပေရွက်ပေါ်တွင် စာလုံးများရေးထွင်းပြီးနောက် စာလုံးများ ပိုမိုထင်ရှားပေါ်လွင်လာစေရန်နှင့် ပိုးမွှားဘေးမှ ကာကွယ်ရန် မည်သည့်အရာကို သုတ်လိမ်းရသနည်း။",
          options: ["သစ်စေးနှင့် ရွှေချခြင်း", "ရေနံချေးနှင့် မီးသွေးမှုန့် ရောစပ်သုတ်ခြင်း", "ဆားရည်နှင့် အရက်ပျံသုတ်ခြင်း", "ဓာတုဗေဒ ကော်ရည်သုတ်ခြင်း"],
          correctIndex: 1,
          explanation: "ပေစာရေးပြီးပါက သဘာဝရေနံချေး (Crude Oil) နှင့် မီးသွေးမှုန့် (Charcoal Powder) ရောစပ်၍ ပွတ်သုတ်ပေးရသည်။ ၎င်းသည် စာလုံးများကို အနက်ရောင်ထင်ရှားစေပြီး ပိုးမွှားရန်မှ ကာကွယ်ပေးသည်။"
        },
        {
          question: "သံဃာ့ကံဆောင်လုပ်ငန်းများနှင့် သာသနာရေးဆိုင်ရာ လုပ်ငန်းများတွင် အသုံးပြုရန် ရွှေချဆေးရေး ပုံစံဖြင့် အထူးတန်ဖိုးကြီးမားစွာ လက်ရာမြောက်စွာ ပြုလုပ်ထားသော စာပေအမွေအနှစ်မှာ မည်သည့်အရာနည်း။",
          options: ["ပုရပိုက်ဖြူ", "ပုရပိုက်နက်", "ကမ္မဝါစာ (Kammavaca)", "ရွှံ့ပြားမှတ်တမ်း"],
          correctIndex: 2,
          explanation: "ကမ္မဝါစာ (Kammavaca) သည် ရွှေချဆေးရေးနှင့် အနီရောင် ကမ္မဝါဆေးများ သုံးကာ လက်ရာမြောက်စွာ ပြုစုထားသော၊ သံဃာ့ကျင့်ဝတ်ဆိုင်ရာ လွန်စွာမြင့်မြတ်သော ရိုးရာစာပေပစ္စည်း ဖြစ်သည်။"
        }
      ]
    },
    {
      id: "his",
      code: "HIS",
      name: "History of Libraries & Books",
      myanmarName: "စာကြည့်တိုက်နှင့် စာအုပ်သမိုင်းကြောင်း",
      color: "from-rose-400 to-red-500",
      glowColor: "rgba(244,63,94,0.5)",
      description: "စာအုပ်စာပေများ ပုံနှိပ်ထုတ်ဝေမှု သမိုင်းအလှည့်အပြောင်းနှင့် ကမ္ဘာနှင့်မြန်မာ့ စာကြည့်တိုက်များ တိုးတက်ပြောင်းလဲလာပုံ သမိုင်းရင်းမြစ်",
      branches: [
        {
          id: "his-ancient",
          title: "ရှေးဟောင်းစာကြည့်တိုက်များ သမိုင်း",
          englishTitle: "Ancient Libraries",
          icon: <History className="w-4 h-4" />,
          colorClass: "border-rose-500/50 text-rose-300 bg-rose-950/60 hover:bg-rose-900/60",
          glowColor: "rgba(244,63,94,0.4)",
          detail: "စာကြည့်တိုက်များ၏ အစဦးဆုံးသမိုင်းဖြစ်ပြီး ရွှံ့ပြားများ၊ ပပိုင်းရပ်စ်ကျူရွက်လိပ်များဖြင့် သတင်းအချက်အလက်ကို ထိန်းသိမ်းခဲ့ကြသည့်ခေတ် ဖြစ်သည်၊၊",
          subTopics: [
            {
              id: "his-anc-1",
              title: "နင်နားဗား ရွှံ့ပြားစာကြည့်တိုက်",
              englishTitle: "Nineveh Clay Tablets Library",
              detail: "အဆီးရီးယားဘုရင် အာရှုဘာနီပါယ် တည်ထောင်ခဲ့ပြီး သပ်ပုံစာလုံး (Cuneiform) ရေးထွင်းထားသော ရွှံ့ပြားပေါင်း ၃၀,၀၀၀ ကျော်ရှိသည့် ရှေးဟောင်းမှတ်တမ်းတိုက် ဖြစ်သည်၊၊",
              examples: ["Epic of Gilgamesh (ဂီဂါမက်ရှ် မော်ကွန်းကဗျာ) ရွှံ့ပြားကို ရှာဖွေတွေ့ရှိခြင်း"],
              keywords: ["Cuneiform", "King Ashurbanipal", "Assyrian Empire", "Clay Tablets"]
            },
            {
              id: "his-anc-2",
              title: "အလက်ဇန်းဒရီးယား စာကြည့်တိုက်",
              englishTitle: "Library of Alexandria",
              detail: "အီဂျစ်နိုင်ငံတွင် တည်ရှိခဲ့ပြီး ပပိုင်းရပ်စ် (Papyrus) ကျူရွက်လိပ် သန်းဝက်ကျော် သိမ်းဆည်းကာ ကမ္ဘာ့သိပ္ပံပညာရှင်ကြီးများ သုတေသနပြုခဲ့သည့် ရှေးဟောင်းအကြီးဆုံး စာကြည့်တိုက်ကြီးဖြစ်သည်၊၊",
              examples: ["Eratosthenes, Euclid စသည့် ပညာရှင်ကြီးများ စာကြည့်တိုက်မှူးအဖြစ် တာဝန်ယူခဲ့ခြင်း"],
              keywords: ["Papyrus Scrolls", "Ptolemaic Dynasty", "Ancient Egypt", "Destruction by Fire"]
            }
          ]
        },
        {
          id: "his-myanmar",
          title: "မြန်မာ့စာကြည့်တိုက် ဖြစ်ပေါ်တိုးတက်မှု",
          englishTitle: "Myanmar Library History",
          icon: <Book className="w-4 h-4" />,
          colorClass: "border-red-500/50 text-red-300 bg-red-950/60 hover:bg-red-900/60",
          glowColor: "rgba(239,68,68,0.4)",
          detail: "ပုဂံခေတ်မှသည် ကုန်းဘောင်ခေတ်အထိ ပိဋကတ်သုံးပုံ သိမ်းဆည်းရာ ပိဋကတ်တိုက်တော်များနှင့် ကိုလိုနီခေတ်၊ လွတ်လပ်ရေးရပြီးခေတ် စာကြည့်တိုက်များ ဖြစ်သည်၊၊",
          subTopics: [
            {
              id: "his-mya-1",
              title: "ပုဂံပိဋကတ်တိုက်တော်",
              englishTitle: "Bagan Pitaka Taik",
              detail: "အနော်ရထာမင်းတရားကြီး သထုံပြည်မှ ပင့်ဆောင်လာသော ပိဋကတ်တော်များကို စနစ်တကျ ထိန်းသိမ်းရန် ပုဂံရွှေဆံတော်ဘုရားအနီး ဆောက်လုပ်ခဲ့သော ပထမဆုံး စာကြည့်တိုက်ဖြစ်သည်၊၊",
              examples: ["ပုဂံမြို့ဟောင်းရှိ အမိုးဆင်ဝင် ၅ ဆင့်ပါ စတုရန်းပုံ ပိဋကတ်တိုက်အဆောက်အအုံ"],
              keywords: ["Anawrahta Min", "Mon-style Architecture", "Tripitaka Scrolls"]
            },
            {
              id: "his-mya-2",
              title: "ဘားနတ် အခမဲ့စာကြည့်တိုက်",
              englishTitle: "Bernard Free Library",
              detail: "ကိုလိုနီခေတ် ၁၈၈၃ ခုနှစ်တွင် မဟာမင်းကြီး ဘားနတ်က ရန်ကုန်မြို့၌ တည်ထောင်ခဲ့ပြီး မြန်မာ့ပထမဆုံးသော ပြည်သူ့စာကြည့်တိုက်ပုံစံ အခမဲ့စာကြည့်တိုက်ကြီး ဖြစ်သည်၊၊",
              examples: ["ရှေးဟောင်းပေပုရပိုက်များကို သိမ်းဆည်းပြီး နောက်ပိုင်း အမျိုးသားစာကြည့်တိုက်၏ အခြေခံဖြစ်လာခြင်း"],
              keywords: ["Colonial Era", "Public Library", "Sir Charles Bernard", "National Library Origin"]
            }
          ]
        },
        {
          id: "his-printing",
          title: "ပုံနှိပ်စက်သမိုင်းနှင့် စာအုပ်များ",
          englishTitle: "History of Printing & Books",
          icon: <FileText className="w-4 h-4" />,
          colorClass: "border-amber-500/50 text-amber-300 bg-amber-950/60 hover:bg-amber-900/60",
          glowColor: "rgba(245,158,11,0.4)",
          detail: "စာပေများ လူအများထံ ပျံ့နှံ့စေရန် ပထမဆုံး ပုံနှိပ်နည်းပညာများ စတင်တီထွင်မှုနှင့် စာအုပ်များ အစုလိုက်အပြုံလိုက် ထုတ်လုပ်နိုင်ပုံ သမိုင်းဖြစ်သည်၊၊",
          subTopics: [
            {
              id: "his-prn-1",
              title: "ဂျိုဟန်ဂူတင်ဘတ်",
              englishTitle: "Johannes Gutenberg",
              detail: "၁၄၄၀ ပြည့်လွန်နှစ်များတွင် ဂျာမနီနိုင်ငံ မိန့်ဇ်မြို့၌ သတ္တုစာလုံးရွှေ့စနစ် (Movable Type Printing) ကို တီထွင်ခဲ့ပြီး ကမ္ဘာ့ပုံနှိပ်စက် တော်လှန်ရေးကို စတင်ခဲ့သူဖြစ်သည်၊၊",
              examples: ["သံမဏိစာလုံးတုံးလေးများကို စီညှိပြီး စက်ဖြင့်ဖိနှိပ်ပုံစံထုတ်ခြင်း"],
              keywords: ["Movable Type", "Mainz (Germany)", "Printing Revolution"]
            },
            {
              id: "his-prn-2",
              title: "ဂူတင်ဘတ် သမ္မာကျမ်းစာ",
              englishTitle: "Gutenberg Bible (1455)",
              detail: "ဂျိုဟန်ဂူတင်ဘတ်က ပထမဦးဆုံး ပုံနှိပ်စက်ဖြင့် ရိုက်နှိပ်ထုတ်ဝေခဲ့သော သမိုင်းဝင် သမ္မာကျမ်းစာအုပ်ကြီး ဖြစ်ပြီး စာအုပ်ခေတ်ဦး၏ အမွေအနှစ်ဖြစ်သည်၊၊",
              examples: ["လက်ရှိကမ္ဘာပေါ်တွင် Gutenberg Bible မူရင်းအုပ်ရေအနည်းငယ်သာ ကျန်ရှိပြီး အလွန်တန်ဖိုးကြီးခြင်း"],
              keywords: ["Latin Vulgate", "First Printed Book", "Incunabula Era"]
            }
          ]
        }
      ],
      selfTest: [
        {
          question: "အီဂျစ်နိုင်ငံတွင် တည်ရှိခဲ့ပြီး ပပိုင်းရပ်စ် (Papyrus) ကျူရွက်လိပ် သန်းဝက်ကျော် သိမ်းဆည်းခဲ့သော ရှေးဟောင်းကမ္ဘာ့ အကြီးဆုံး စာကြည့်တိုက်ကြီးမှာ မည်သည့်အရာနည်း။",
          options: ["နင်နားဗား စာကြည့်တိုက်", "အလက်ဇန်းဒရီးယား စာကြည့်တိုက် (Library of Congress)", "ဗြိတိသျှ စာကြည့်တိုက်", "ကိုလိုနီ စာကြည့်တိုက်"],
          correctIndex: 1,
          explanation: "အီဂျစ်နိုင်ငံ အလက်ဇန်းဒရီးယားမြို့တွင် ဆောက်လုပ်ခဲ့သော စာကြည့်တိုက်ကြီး (Library of Alexandria) သည် ရှေးဟောင်းကမ္ဘာတွင် အသိပညာအချက်အလက် စုစည်းမှုအကြီးဆုံး ဗဟိုချက် ဖြစ်ခဲ့သည်။"
        },
        {
          question: "မြန်မာနိုင်ငံတွင် ကိုလိုနီခေတ် ၁၈၈၃ ခုနှစ်က ပထမဆုံးသော ပြည်သူ့ဝန်ဆောင်မှု အခမဲ့စာကြည့်တိုက်အဖြစ် တည်ထောင်ခဲ့သော နေရာမှာ မည်သည့်အရာနည်း။",
          options: ["ပုဂံပိဋကတ်တိုက်", "ဘားနတ် အခမဲ့စာကြည့်တိုက် (Bernard Free Library)", "အမျိုးသားစာကြည့်တိုက်", "ရတနာပုံ နန်းတွင်းမော်ကွန်းတိုက်"],
          correctIndex: 1,
          explanation: "မဟာမင်းကြီး ဆာချားလ်စ်ဘားနတ်၏ ကူညီထောက်ပံ့မှုဖြင့် တည်ထောင်ခဲ့သော ဘားနတ် အခမဲ့စာကြည့်တိုက် (Bernard Free Library) သည် မြန်မာ့ပထမဆုံးသော အခမဲ့ ပြည်သူ့စာကြည့်တိုက် ဖြစ်ပြီး ရှေးဟောင်းမြန်မာပေစာ ပုရပိုက်များကို တန်ဖိုးရှိစွာ စုဆောင်းခဲ့သည်။"
        }
      ]
    }
  ];

  const currentSubject = subjectsData[selectedSubjectIdx];

  // Force center of canvas view
  useEffect(() => {
    resetCanvasView();
    // Default open root node details
    setSelectedNodeDetails({
      title: currentSubject.myanmarName,
      englishTitle: currentSubject.name,
      detail: currentSubject.description,
      level: "root"
    });
    // Expand root node by default
    setExpandedNodes({
      [`root-${currentSubject.id}`]: true
    });
  }, [selectedSubjectIdx]);

  const resetCanvasView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Node Click Handlers
  const handleRootClick = () => {
    const rootId = `root-${currentSubject.id}`;
    setExpandedNodes(prev => ({
      ...prev,
      [rootId]: !prev[rootId]
    }));
    setSelectedNodeDetails({
      title: currentSubject.myanmarName,
      englishTitle: currentSubject.name,
      detail: currentSubject.description,
      level: "root"
    });
  };

  const handleBranchClick = (branch: MainTopicBranch) => {
    const branchId = branch.id;
    setExpandedNodes(prev => ({
      ...prev,
      [branchId]: !prev[branchId]
    }));
    setSelectedNodeDetails({
      title: branch.title,
      englishTitle: branch.englishTitle,
      detail: branch.detail,
      level: "branch"
    });
  };

  const handleLeafClick = (leaf: SubTopicNode) => {
    setSelectedNodeDetails({
      title: leaf.title,
      englishTitle: leaf.englishTitle,
      detail: leaf.detail,
      examples: leaf.examples,
      keywords: leaf.keywords,
      level: "leaf"
    });
  };

  // Drag to pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    dragStart.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Touch controls for mobile support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    const touch = e.touches[0];
    dragStart.current = { x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPanOffset({
      x: touch.clientX - dragStart.current.x,
      y: touch.clientY - dragStart.current.y
    });
  };

  // Mathematical Coordinate Layout Generator for Spider-Web Mind Map
  const generateLayout = () => {
    const rootId = `root-${currentSubject.id}`;
    const rootExpanded = !!expandedNodes[rootId];

    // Center coordinates in virtual space
    const centerX = 400;
    const centerY = 300;

    const nodesList: any[] = [];
    const linesList: any[] = [];

    // 1. Root Node
    nodesList.push({
      id: rootId,
      type: "root",
      title: currentSubject.code,
      subtitle: currentSubject.myanmarName,
      x: centerX,
      y: centerY,
      isExpanded: rootExpanded,
      color: `bg-gradient-to-tr ${currentSubject.color} text-white shadow-[0_0_25px_${currentSubject.glowColor}] border-2 border-white/20`,
      size: 90
    });

    if (!rootExpanded) {
      return { nodes: nodesList, lines: linesList };
    }

    const branches = currentSubject.branches;
    const numBranches = branches.length;
    const branchRadius = 180; // Distance from center to level 1

    branches.forEach((branch, bIdx) => {
      // Calculate radial angle for branches
      // Distribute evenly around 360 degrees
      const branchAngle = (bIdx * 2 * Math.PI) / numBranches - Math.PI / 2; // start top
      const bx = centerX + branchRadius * Math.cos(branchAngle);
      const by = centerY + branchRadius * Math.sin(branchAngle);

      const branchId = branch.id;
      const branchExpanded = !!expandedNodes[branchId];

      // Add line from Root to Branch
      linesList.push({
        id: `line-${rootId}-${branchId}`,
        x1: centerX,
        y1: centerY,
        x2: bx,
        y2: by,
        color: currentSubject.glowColor,
        isPulse: true,
        width: 3
      });

      // Add Branch Node
      nodesList.push({
        id: branchId,
        type: "branch",
        raw: branch,
        title: branch.title,
        subtitle: branch.englishTitle,
        x: bx,
        y: by,
        isExpanded: branchExpanded,
        color: branch.colorClass + ` shadow-[0_0_15px_${branch.glowColor}] border`,
        icon: branch.icon,
        size: 75
      });

      // If Branch is expanded, calculate leaf node positions further out
      if (branchExpanded) {
        const subTopics = branch.subTopics;
        const numLeaves = subTopics.length;
        const leafRadius = 120; // Distance from branch to level 2

        // Spread leaves in a cone centered on the branch angle
        const coneSpread = Math.PI / 2.2; // roughly 80 degrees spread
        const startAngle = branchAngle - coneSpread / 2;
        const angleStep = numLeaves > 1 ? coneSpread / (numLeaves - 1) : 0;

        subTopics.forEach((leaf, lIdx) => {
          const leafAngle = numLeaves > 1 ? startAngle + lIdx * angleStep : branchAngle;
          const lx = bx + leafRadius * Math.cos(leafAngle);
          const ly = by + leafRadius * Math.sin(leafAngle);

          // Line from Branch to Leaf
          linesList.push({
            id: `line-${branchId}-${leaf.id}`,
            x1: bx,
            y1: by,
            x2: lx,
            y2: ly,
            color: branch.glowColor,
            isPulse: false,
            width: 1.5
          });

          // Add Leaf Node
          nodesList.push({
            id: leaf.id,
            type: "leaf",
            raw: leaf,
            title: leaf.title,
            subtitle: leaf.englishTitle,
            x: lx,
            y: ly,
            color: "border-slate-500/30 text-slate-300 bg-slate-900/80 hover:border-pink-500/40 hover:text-pink-300 transition-all shadow-md",
            size: 60
          });
        });
      }
    });

    return { nodes: nodesList, lines: linesList };
  };

  const { nodes, lines } = generateLayout();

  // Quiz helper functions
  const handleNextQuestion = () => {
    setSelectedAnswerIdx(null);
    setIsAnswerChecked(false);
    if (currentQuestionIdx < currentSubject.selfTest.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      setTestCompleted(true);
    }
  };

  const handleSelectAnswer = (idx: number) => {
    if (isAnswerChecked) return;
    setSelectedAnswerIdx(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswerIdx === null) return;
    setIsAnswerChecked(true);
    if (selectedAnswerIdx === currentSubject.selfTest[currentQuestionIdx].correctIndex) {
      setTestScore(testScore + 1);
    }
  };

  const startTest = () => {
    setShowSelfTest(true);
    setCurrentQuestionIdx(0);
    setSelectedAnswerIdx(null);
    setIsAnswerChecked(false);
    setTestScore(0);
    setTestCompleted(false);
  };

  const closeTest = () => {
    setShowSelfTest(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="w-full relative z-10"
      style={{ fontSize: `${localFontScale}%` }}
    >
      {/* Header and Top Actions */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-pink-300 font-bold hover:text-white transition-all bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ပင်မစာမျက်နှာသို့ ပြန်မည်</span>
          </button>
          
          <h2 className="text-xl md:text-2xl font-display font-black text-white text-glow-pink mt-3 flex items-center gap-2">
            <Sparkles className="text-pink-400 w-5 md:w-6 h-5 md:h-6 animate-pulse" />
            <span>ပင့်ကူအိမ် သင်ခန်းစာ Mind Maps</span>
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            စာကြည့်တိုက်သိပ္ပံ၏ ဘာသာရပ်ကြီး ၅ ခုကို အလွတ်ကျက်စရာမလိုဘဲ အဆင့်ဆင့်ချိတ်ဆက်မှုများဖြင့် ကလစ်နှိပ်၍ ပွားယူလေ့လာနိုင်သည့် စနစ်
          </p>
        </div>

        {/* Dynamic Font Size Adjustment */}
        <div className="flex flex-wrap items-center gap-2.5 bg-[#170a2c]/80 border border-white/15 px-3.5 py-2 rounded-2xl shadow-xl">
          <span className="text-[10px] text-pink-300 font-bold uppercase tracking-wider flex items-center gap-1">
            <Layers className="w-3 h-3 text-pink-400" />
            <span>စာလုံးအရွယ်အစား ချိန်ညှိမှု:</span>
          </span>
          <div className="flex items-center gap-1 bg-black/30 rounded-xl p-0.5 border border-white/5">
            <button 
              onClick={() => setLocalFontScale(prev => Math.max(80, prev - 10))}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white font-black text-xs cursor-pointer transition-all active:scale-95"
              title="စာလုံးအရွယ်အစား သေးငယ်မည်"
              id="btn-font-decrease"
            >
              A-
            </button>
            <button 
              onClick={() => setLocalFontScale(100)}
              className="px-2.5 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white text-xs font-bold cursor-pointer"
              title="ပုံမှန်စာလုံးအရွယ်အစားသို့ ပြန်ထားမည်"
              id="btn-font-reset"
            >
              {localFontScale}%
            </button>
            <button 
              onClick={() => setLocalFontScale(prev => Math.min(140, prev + 10))}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white font-black text-xs cursor-pointer transition-all active:scale-95"
              title="စာလုံးအရွယ်အစား ကြီးမားမည်"
              id="btn-font-increase"
            >
              A+
            </button>
          </div>
        </div>
      </div>

      {/* Tabs list of five subjects (ADM, CAL, MCS, MSS, HIS) */}
      <div className="grid grid-cols-5 gap-2 mb-6" id="subject-mindmaps-tabs">
        {subjectsData.map((subj, idx) => {
          const isActive = selectedSubjectIdx === idx;
          return (
            <button
              key={subj.id}
              onClick={() => {
                setSelectedSubjectIdx(idx);
                setShowSelfTest(false);
              }}
              className={`p-3 md:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center text-center group relative overflow-hidden ${
                isActive 
                  ? `bg-gradient-to-tr ${subj.color} border-white/20 shadow-[0_0_25px_rgba(20,184,166,0.15)] text-white` 
                  : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/15 text-slate-300"
              }`}
              id={`tab-subject-${subj.id}`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-white/10 mix-blend-overlay animate-pulse" />
              )}
              <span className={`text-sm md:text-base font-display font-black tracking-wider block ${isActive ? "text-white" : "text-white group-hover:text-pink-300"}`}>
                {subj.code}
              </span>
              <span className="hidden lg:inline text-[10px] text-slate-300 mt-1 truncate max-w-full font-medium leading-tight opacity-95">
                {subj.myanmarName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid container with Active Map Engine & Details Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Interactive Mind Map Stage Column */}
        <div className="lg:col-span-8 flex flex-col justify-between p-4 md:p-6 bg-[#160a2d]/40 border border-white/10 rounded-3xl backdrop-blur-md relative overflow-hidden min-h-[550px] select-none">
          
          {/* Glowing Subject Aura Background */}
          <div 
            className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-[110px] pointer-events-none transition-all duration-700 opacity-60" 
            style={{ backgroundColor: currentSubject.glowColor }}
          />

          {/* Active Subject Brief Header */}
          <div className="relative z-10 mb-4 flex justify-between items-center border-b border-white/5 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r ${currentSubject.color} text-white`}>
                  {currentSubject.code}
                </span>
                <span className="text-slate-400 text-[10px] font-mono flex items-center gap-1">
                  <Hand className="w-3 h-3 text-slate-500 animate-bounce" />
                  <span>ကလစ်နှိပ်၍ ဖြန့်ပွားကြည့်ရှုနိုင်သော ပင့်ကူအိမ်သင်ခန်းစာ</span>
                </span>
              </div>
              <h3 className="text-base md:text-lg font-black text-white mt-1">
                {currentSubject.myanmarName} <span className="text-slate-400 font-mono text-xs font-normal">({currentSubject.name})</span>
              </h3>
            </div>
            
            {/* Viewport Control Actions */}
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.1))}
                className="p-1.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
                title="ကျုံ့မည် (Zoom Out)"
                id="btn-zoom-out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button 
                onClick={resetCanvasView}
                className="p-1.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer text-xs font-bold"
                title="ပင်မနေရာ အလယ်သို့ ပြန်ရွှေ့မည်"
                id="btn-zoom-reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
                className="p-1.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
                title="ချဲ့မည် (Zoom In)"
                id="btn-zoom-in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Draggable & Zoomable Canvas Area */}
          <div 
            ref={canvasRef}
            className="w-full h-[400px] md:h-[460px] relative overflow-hidden bg-black/20 rounded-2xl border border-white/5 cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUpOrLeave}
            id="mindmap-viewport"
          >
            {/* Inner transformed container wrapping SVG and Nodes */}
            <div 
              className="absolute inset-0 transition-transform duration-100 ease-out origin-center"
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`
              }}
            >
              {/* SVG Link Layer */}
              <svg 
                className="absolute inset-0 w-[1000px] h-[750px] pointer-events-none"
                style={{ minWidth: "1000px", minHeight: "750px" }}
              >
                <defs>
                  {/* Glowing filter effect for spider web links */}
                  <filter id="glow-link" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {lines.map((line) => (
                  <g key={line.id}>
                    {/* Background glowing line */}
                    <line 
                      x1={line.x1}
                      y1={line.y1}
                      x2={line.x2}
                      y2={line.y2}
                      stroke={line.color}
                      strokeWidth={line.width * 2.5}
                      strokeOpacity="0.25"
                      strokeLinecap="round"
                    />
                    {/* Foreground clean line */}
                    <line 
                      x1={line.x1}
                      y1={line.y1}
                      x2={line.x2}
                      y2={line.y2}
                      stroke={line.color}
                      strokeWidth={line.width}
                      strokeOpacity={line.isPulse ? "0.8" : "0.5"}
                      strokeLinecap="round"
                      className={line.isPulse ? "animate-pulse stroke-glow" : ""}
                    />
                  </g>
                ))}
              </svg>

              {/* DOM Nodes Layer */}
              <div className="absolute inset-0 w-[1000px] h-[750px] pointer-events-none" style={{ minWidth: "1000px", minHeight: "750px" }}>
                {nodes.map((node) => {
                  const nodeWidth = node.size;
                  const nodeHeight = node.size;
                  
                  return (
                    <div
                      key={node.id}
                      className="absolute pointer-events-auto transition-transform duration-300"
                      style={{
                        left: node.x - nodeWidth / 2,
                        top: node.y - nodeHeight / 2,
                        width: nodeWidth,
                        height: nodeHeight,
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (node.type === "root") {
                            handleRootClick();
                          } else if (node.type === "branch") {
                            handleBranchClick(node.raw);
                          } else {
                            handleLeafClick(node.raw);
                          }
                        }}
                        className={`w-full h-full rounded-full flex flex-col items-center justify-center text-center p-1.5 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer relative ${node.color}`}
                        id={`node-${node.id}`}
                      >
                        {/* Dynamic decorative expand status ring */}
                        {node.type !== "leaf" && (
                          <div className={`absolute -inset-1.5 rounded-full border border-dashed animate-spin-slow opacity-40 ${
                            node.isExpanded ? "border-pink-500" : "border-slate-500"
                          }`} />
                        )}

                        {/* Node Content */}
                        {node.type === "root" && (
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-black tracking-widest">{node.title}</span>
                            <span className="text-[7.5px] font-bold text-slate-100 max-w-[80px] truncate leading-tight">
                              {node.subtitle.split(' ')[0]}
                            </span>
                          </div>
                        )}

                        {node.type === "branch" && (
                          <div className="flex flex-col items-center">
                            <span className="text-pink-400 mb-0.5">{node.icon}</span>
                            <span className="text-[10px] font-black max-w-[65px] leading-tight text-white block truncate">
                              {node.title}
                            </span>
                          </div>
                        )}

                        {node.type === "leaf" && (
                          <div className="flex flex-col items-center">
                            <span className="text-[9px] font-black max-w-[55px] leading-tight text-slate-200 block truncate">
                              {node.title}
                            </span>
                          </div>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Instruction tooltip overlay */}
            <div className="absolute bottom-3 left-3 bg-black/60 border border-white/10 px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 pointer-events-none">
              <Info className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
              <span className="text-[9px] text-slate-300 font-medium">
                * ဝိုင်းများကို နှိပ်၍ ပွားယူပါ။ ကလစ်ဆွဲ၍ ရွှေ့ပြောင်းနိုင်သည်၊၊
              </span>
            </div>
          </div>

          {/* Quick Subject Test Launcher Bar */}
          <div className="relative z-10 mt-4 flex justify-between items-center bg-[#1c0d38]/90 border border-white/10 px-4 py-3 rounded-2xl">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-pink-400" />
              <span className="text-xs text-slate-300 font-bold">
                သင်ခန်းစာမှတ်မိလွယ်စေရန် ကိုယ်တိုင်စမ်းသပ်မှုမေးခွန်းများ ဖြေဆိုမည်လား။
              </span>
            </div>
            <button
              onClick={startTest}
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1"
              id="btn-start-selftest"
            >
              <span>စမ်းသပ်မှု စတင်မည်</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Sidebar Panel Column (Details & Explanations) */}
        <div className="lg:col-span-4 flex flex-col bg-[#110524]/60 border border-white/10 rounded-3xl p-5 backdrop-blur-md relative overflow-hidden min-h-[500px]">
          
          <div className="flex items-center gap-1.5 border-b border-white/5 pb-3.5 mb-4">
            <BookOpen className="w-4 h-4 text-pink-400" />
            <h4 className="text-sm font-black text-white">သင်ခန်းစာ အသေးစိတ်ဖော်ပြချက်</h4>
          </div>

          <AnimatePresence mode="wait">
            {selectedNodeDetails ? (
              <motion.div
                key={selectedNodeDetails.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                      selectedNodeDetails.level === "root" 
                        ? "bg-emerald-500/20 text-emerald-300" 
                        : selectedNodeDetails.level === "branch" 
                        ? "bg-fuchsia-500/20 text-fuchsia-300" 
                        : "bg-pink-500/20 text-pink-300"
                    }`}>
                      {selectedNodeDetails.level === "root" ? "အဓိကဘာသာရပ်" : selectedNodeDetails.level === "branch" ? "ပင်မကဏ္ဍ" : "သင်ခန်းစာခွဲ"}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">အပြန်အလှန်လေ့လာရေး</span>
                  </div>

                  {/* Title */}
                  <h4 className="text-lg font-black text-white mt-2.5 leading-tight">
                    {selectedNodeDetails.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5 mb-4">
                    {selectedNodeDetails.englishTitle}
                  </p>

                  {/* Detailed Explanation */}
                  <div className="bg-black/35 border border-white/5 p-4 rounded-2xl mb-4">
                    <span className="text-[10px] font-bold text-pink-300 uppercase block mb-1">ရှင်းလင်းချက်:</span>
                    <p className="text-xs text-slate-200 leading-relaxed font-normal">
                      {selectedNodeDetails.detail}
                    </p>
                  </div>

                  {/* Keywords */}
                  {selectedNodeDetails.keywords && selectedNodeDetails.keywords.length > 0 && (
                    <div className="mb-4">
                      <span className="text-[10px] font-bold text-purple-300 uppercase block mb-1.5">အဓိက ဝေါဟာရများ:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedNodeDetails.keywords.map((kw, i) => (
                          <span key={i} className="text-[9px] text-slate-300 bg-white/5 border border-white/5 px-2 py-0.5 rounded font-mono">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Examples */}
                  {selectedNodeDetails.examples && selectedNodeDetails.examples.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold text-teal-300 uppercase block mb-1.5">လက်တွေ့ သာဓကများ:</span>
                      <ul className="space-y-1.5">
                        {selectedNodeDetails.examples.map((ex, i) => (
                          <li key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5 bg-white/[0.02] p-2 rounded-lg border border-white/5">
                            <span className="text-pink-400 font-bold mt-0.5">•</span>
                            <span className="leading-relaxed">{ex}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-6 border-t border-white/5 pt-4 text-center">
                  <span className="text-[9px] text-slate-500 leading-tight block">
                    * အခြားဝိုင်းများကို နှိပ်၍ သက်ဆိုင်ရာ သင်ခန်းစာခေါင်းစဉ်အလိုက် အသေးစိတ်ကို ပြောင်းလဲဖတ်ရှုနိုင်ပါသည်၊၊
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <Book className="w-10 h-10 text-slate-600 mb-3 animate-pulse" />
                <p className="text-xs text-slate-400 max-w-[180px] leading-relaxed">
                  ပင့်ကူအိမ်ဝိုင်းရှိ ခေါင်းစဉ်တစ်ခုခုကို ကလစ်နှိပ်၍ အသေးစိတ် ရှင်းလင်းချက်များကို ဤနေရာတွင် ဖတ်ရှုနိုင်သည်၊၊
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Full Screen Interactive Self-Test Quiz Overlay Modal */}
      <AnimatePresence>
        {showSelfTest && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#120524] border border-white/10 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative overflow-hidden"
              id="selftest-modal"
            >
              {/* Modal Glowing Backgrounds */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/10 rounded-full blur-[60px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-[60px] pointer-events-none" />

              <div className="relative z-10">
                <div className="flex justify-between items-center border-b border-white/5 pb-3.5 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    <span className="text-xs font-bold text-pink-300">
                      {currentSubject.code} - ကိုယ်တိုင်စမ်းသပ်မှု
                    </span>
                  </div>
                  <button 
                    onClick={closeTest}
                    className="text-slate-400 hover:text-white font-black text-xs cursor-pointer bg-white/5 px-2.5 py-1 rounded-lg hover:bg-white/10 transition-all"
                  >
                    ပိတ်မည်
                  </button>
                </div>

                {!testCompleted ? (
                  <div>
                    {/* Progress indicator */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] text-slate-400 font-mono">
                        မေးခွန်း {currentQuestionIdx + 1} / {currentSubject.selfTest.length}
                      </span>
                      <span className="text-[10px] text-pink-300 font-bold">
                        ရမှတ်: {testScore}
                      </span>
                    </div>

                    {/* Question text */}
                    <h4 className="text-sm font-black text-white leading-relaxed mb-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                      {currentSubject.selfTest[currentQuestionIdx].question}
                    </h4>

                    {/* Options list */}
                    <div className="space-y-2 mb-5">
                      {currentSubject.selfTest[currentQuestionIdx].options.map((opt, oIdx) => {
                        const isSelected = selectedAnswerIdx === oIdx;
                        let optColor = "bg-white/[0.02] border-white/5 text-slate-200 hover:bg-white/5 hover:border-white/10";
                        
                        if (isSelected) {
                          optColor = "bg-pink-500/10 border-pink-500/50 text-pink-300";
                        }
                        
                        if (isAnswerChecked) {
                          const isCorrect = oIdx === currentSubject.selfTest[currentQuestionIdx].correctIndex;
                          if (isCorrect) {
                            optColor = "bg-green-500/10 border-green-500/50 text-green-300 font-bold";
                          } else if (isSelected) {
                            optColor = "bg-rose-500/10 border-rose-500/50 text-rose-300";
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectAnswer(oIdx)}
                            className={`w-full p-3 rounded-xl text-left text-xs transition-all border flex items-center justify-between cursor-pointer ${optColor}`}
                            disabled={isAnswerChecked}
                          >
                            <span>{opt}</span>
                            {isAnswerChecked && oIdx === currentSubject.selfTest[currentQuestionIdx].correctIndex && (
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback and Explanations */}
                    {isAnswerChecked && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 mb-5"
                      >
                        <span className="text-[10px] font-bold text-teal-300 block mb-1">ရှင်းလင်းချက်:</span>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                          {currentSubject.selfTest[currentQuestionIdx].explanation}
                        </p>
                      </motion.div>
                    )}

                    {/* Action button */}
                    <div className="flex justify-end">
                      {!isAnswerChecked ? (
                        <button
                          onClick={handleCheckAnswer}
                          disabled={selectedAnswerIdx === null}
                          className="px-5 py-2 rounded-xl text-xs font-bold bg-pink-500 text-white hover:bg-pink-600 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
                        >
                          အဖြေစစ်မည်
                        </button>
                      ) : (
                        <button
                          onClick={handleNextQuestion}
                          className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 transition-all cursor-pointer"
                        >
                          {currentQuestionIdx < currentSubject.selfTest.length - 1 ? "နောက်တစ်ခွန်း" : "ရလဒ်ကြည့်မည်"}
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  // Quiz Completed State
                  <div className="text-center py-6">
                    <div className="w-14 h-14 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-4 text-green-400">
                      <CheckCircle className="w-7 h-7" />
                    </div>
                    <h4 className="text-lg font-black text-white">စမ်းသပ်မှု ပြီးဆုံးပါပြီ။</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      {currentSubject.myanmarName} ဆိုင်ရာ သင်ခန်းစာမေးခွန်းများကို ဖြေဆိုပြီးပါပြီ၊၊
                    </p>

                    <div className="my-6 bg-black/45 border border-white/5 p-4 rounded-2xl max-w-xs mx-auto">
                      <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest block">စုစုပေါင်းရမှတ်</span>
                      <span className="text-3xl font-black text-glow-pink text-pink-400 block mt-1.5">
                        {testScore} / {currentSubject.selfTest.length}
                      </span>
                    </div>

                    <div className="flex justify-center gap-3">
                      <button
                        onClick={startTest}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all cursor-pointer"
                      >
                        တစ်ခေါက်ပြန်ဖြေမည်
                      </button>
                      <button
                        onClick={closeTest}
                        className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 transition-all cursor-pointer shadow-md"
                      >
                        အဆင်ပြေပါပြီ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
