import React, { useState } from "react";
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
  ChevronRight,
  Maximize2,
  FolderOpen
} from "lucide-react";
import { UserProfile } from "../types";

interface MindMapsProps {
  user: UserProfile;
  onBack: () => void;
}

interface MapNode {
  id: string;
  title: string;
  englishTitle: string;
  icon: React.ReactNode;
  detail: string;
  keywords: string[];
  examples: string[];
  color: string;
  glowColor: string;
}

interface SubjectMapData {
  id: string;
  name: string;
  code: string;
  color: string;
  darkColor: string;
  glowColor: string;
  description: string;
  nodes: MapNode[];
  selfTest: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export default function MindMaps({ user, onBack }: MindMapsProps) {
  const [selectedSubjectIdx, setSelectedSubjectIdx] = useState<number>(0);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showSelfTest, setShowSelfTest] = useState<boolean>(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [testScore, setTestScore] = useState<number>(0);
  const [testCompleted, setTestCompleted] = useState<boolean>(false);

  // Local font scale adjustments for map text
  const [localFontScale, setLocalFontScale] = useState<number>(100);

  const subjectsData: SubjectMapData[] = [
    {
      id: "adm",
      code: "ADM",
      name: "Library Administration & Management",
      color: "from-emerald-400 to-teal-500",
      darkColor: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
      glowColor: "rgba(16,185,129,0.4)",
      description: "စာကြည့်တိုက်တစ်ခုလုံးအား စနစ်တကျ ရေရှည်ရပ်တည်လည်ပတ်နိုင်စေရန် စီမံခန့်ခွဲသည့် အခြေခံသိပ္ပံပညာရပ်",
      nodes: [
        {
          id: "adm-struct",
          title: "ဖွဲ့စည်းပုံနှင့် စီမံအုပ်ချုပ်မှု",
          englishTitle: "Library Structure & Governance",
          icon: <FolderOpen className="w-5 h-5" />,
          color: "border-emerald-500/40 text-emerald-300 bg-emerald-950/40",
          glowColor: "rgba(16,185,129,0.3)",
          detail: "စာကြည့်တိုက်တစ်ခု ပုံမှန်လည်ပတ်နိုင်ရန် သင့်လျော်သော အုပ်ချုပ်မှုပုံစံ၊ စာကြည့်တိုက်ကော်မတီဖွဲ့စည်းပုံနှင့် ရည်မှန်းချက်ပန်းတိုင်များ ချမှတ်ခြင်းတို့ ပါဝင်သည်။",
          keywords: ["Library Committee", "Mission & Goals", "Departmentalization"],
          examples: ["စာကြည့်တိုက်အကြံပေးကော်မတီ ဖွဲ့စည်းခြင်း", "ဌာနခွဲများခွဲခြားခြင်း (ငှားရမ်းရေး၊ နည်းပညာဝန်ဆောင်မှု)"]
        },
        {
          id: "adm-finance",
          title: "ဘဏ္ဍာရေး စီမံခန့်ခွဲမှု",
          englishTitle: "Financial Management",
          icon: <Database className="w-5 h-5" />,
          color: "border-teal-500/40 text-teal-300 bg-teal-950/40",
          glowColor: "rgba(20,184,166,0.3)",
          detail: "ရရှိနိုင်သော ဘဏ္ဍာရေးရင်းမြစ်များကို စိစစ်ပြီး လိုအပ်သောစာအုပ်များဝယ်ယူရန် ဘတ်ဂျက်ရေးဆွဲခြင်း၊ စာရင်းစစ်ဆေးခြင်းနှင့် ရန်ပုံငွေ တိုးပွားအောင်ပြုလုပ်ခြင်းတို့ ပါဝင်သည်။",
          keywords: ["Budgeting", "Fundraising", "Financial Auditing", "Book Allocation"],
          examples: ["နှစ်စဉ် ဘတ်ဂျက်လျာထားချက် ရေးဆွဲခြင်း", "အလှူရှင်များ ရှာဖွေခြင်းနှင့် စာရင်းထိန်းသိမ်းခြင်း"]
        },
        {
          id: "adm-hr",
          title: "လူသားအရင်းအမြစ် စီမံခန့်ခွဲမှု",
          englishTitle: "Human Resource Management (HRM)",
          icon: <BookOpen className="w-5 h-5" />,
          color: "border-cyan-500/40 text-cyan-300 bg-cyan-950/40",
          glowColor: "rgba(6,182,212,0.3)",
          detail: "စာကြည့်တိုက် ဝန်ထမ်းများကို စနစ်တကျ ခန့်အပ်ခြင်း၊ တာဝန်နှင့် ကျင့်ဝတ်များ သတ်မှတ်ပေးခြင်း၊ ဝန်ထမ်းအရည်အသွေးမြင့်မားရန် လေ့ကျင့်သင်ကြားပေးခြင်းတို့ဖြစ်သည်။",
          keywords: ["Staffing", "In-service Training", "Job Description", "Professional Ethics"],
          examples: ["စာကြည့်တိုက်မှူးနှင့် လက်ထောက်များ၏ တာဝန်ခွဲဝေမှု ဇယားများ", "RDA cataloging လုပ်ငန်းခွင် လေ့ကျင့်ပေးခြင်း"]
        },
        {
          id: "adm-rules",
          title: "စည်းမျဉ်းများနှင့် မူဝါဒများ",
          englishTitle: "Library Rules & Policies",
          icon: <FileText className="w-5 h-5" />,
          color: "border-sky-500/40 text-sky-300 bg-sky-950/40",
          glowColor: "rgba(14,165,233,0.3)",
          detail: "စာဖတ်သူများ လိုက်နာရမည့် ငှားရမ်းမှုစည်းကမ်းများ၊ အသင်းဝင်ခြင်းဆိုင်ရာသတ်မှတ်ချက်များ၊ အမွေအနှစ် စာစုများ ထိန်းသိမ်းမှုဆိုင်ရာ စည်းမျဉ်းများ သတ်မှတ်ခြင်း ဖြစ်သည်။",
          keywords: ["Circulation Policy", "Membership Rules", "Overdue Fines", "Loss & Damages"],
          examples: ["အသင်းဝင်ကတ်ပြား ထုတ်ပေးမှုစနစ်", "စာအုပ်နောက်ကျကြေးနှင့် ပျက်စီးမှုဒဏ်ကြေး သတ်မှတ်ချက်များ"]
        },
        {
          id: "adm-pr",
          title: "ပြည်သူ့ဆက်ဆံရေးနှင့် ဝန်ဆောင်မှု",
          englishTitle: "Public Relations & Outreach",
          icon: <Sparkles className="w-5 h-5" />,
          color: "border-green-500/40 text-green-300 bg-green-950/40",
          glowColor: "rgba(34,197,94,0.3)",
          detail: "စာကြည့်တိုက်ရှိ သတင်းအချက်အလက်များနှင့် ပွဲလမ်းသဘင်များကို ပြည်သူများသိရှိစေရန် လှုံ့ဆော်ခြင်း၊ ပညာပေး ဟောပြောပွဲများနှင့် စာအုပ်ပြပွဲများ ကျင်းပခြင်းဖြစ်သည်။",
          keywords: ["Library Marketing", "Outreach Programs", "Exhibitions", "Newsletters"],
          examples: ["သတင်းလွှာများ ဖြန့်ဝေခြင်း", "စာဖတ်ဝိုင်း (Book Clubs) နှင့် ကလေးစာဖတ်ပွဲများ ပြုလုပ်ခြင်း"]
        }
      ],
      selfTest: [
        {
          question: "စာကြည့်တိုက်အသုံးစရိတ်နှင့် ဝယ်ယူမှုများအတွက် ကြိုတင်ရေးဆွဲရသော စီမံခန့်ခွဲမှုကဏ္ဍမှာ မည်သည့်အရာဖြစ်သနည်း။",
          options: ["လူသားအရင်းအမြစ်", "ဘဏ္ဍာရေး စီမံခန့်ခွဲမှု (Financial Management)", "ပြည်သူ့ဆက်ဆံရေး", "စည်းမျဉ်းများ သတ်မှတ်ခြင်း"],
          correctIndex: 1,
          explanation: "ဘဏ္ဍာရေးစီမံခန့်ခွဲမှု (Financial Management) တွင် နှစ်စဉ်စာအုပ်ဝယ်ယူမှုနှင့် အသုံးစရိတ်များကို စနစ်တကျ ဘတ်ဂျက်ရေးဆွဲခြင်းများ လုပ်ဆောင်ရသည်။"
        },
        {
          question: "စာကြည့်တိုက်ဝန်ဆောင်မှုကို ပြည်သူများပိုမိုသိရှိစေရန် လှုံ့ဆော်လုပ်ဆောင်သော ကဏ္ဍမှာ မည်သည့်အရာဖြစ်သနည်း။",
          options: ["Public Relations & Outreach", "Job Description", "Financial Auditing", "Membership Policy"],
          correctIndex: 0,
          explanation: "Public Relations & Outreach (ပြည်သူ့ဆက်ဆံရေးနှင့် ဝန်ဆောင်မှု) သည် စာကြည့်တိုက်လှုပ်ရှားမှုများကို ပြည်သူများဆီသို့ ဖြန့်ဝေဆက်သွယ်သော လုပ်ငန်းစဉ်ဖြစ်သည်။"
        }
      ]
    },
    {
      id: "cal",
      code: "CAL",
      name: "Cataloguing & Bibliographic Standards",
      color: "from-fuchsia-400 to-purple-500",
      darkColor: "bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-300",
      glowColor: "rgba(217,70,239,0.4)",
      description: "စာအုပ်များနှင့် သတင်းရင်းမြစ်များကို စနစ်တကျ အညွှန်းပြုစုပြီး ပြန်လည်ရှာဖွေရ လွယ်ကူအောင် မှတ်တမ်းတင်ခြင်းပညာ",
      nodes: [
        {
          id: "cal-types",
          title: "ကတ်တလောက် အမျိုးအစားများ",
          englishTitle: "Types of Library Catalogues",
          icon: <Book className="w-5 h-5" />,
          color: "border-fuchsia-500/40 text-fuchsia-300 bg-fuchsia-950/40",
          glowColor: "rgba(217,70,239,0.3)",
          detail: "စာကြည့်တိုက်တွင် အသုံးပြုခဲ့သော သမားရိုးကျ ကတ်စနစ် (ကတ်ပြားသေတ္တာများ) မှသည် ယနေ့ခေတ် ကွန်ပျူတာ အွန်လိုင်းမှ ရှာဖွေနိုင်သော OPAC စနစ်အထိ အမျိုးအစားများ ဖြစ်သည်။",
          keywords: ["Card Catalogue", "OPAC", "WebOPAC", "Union Catalogue"],
          examples: ["အက္ခရာစဉ်ကတ်သေတ္တာ (Card Cabinet)", "အင်တာနက်ပေါ်မှ ရှာဖွေနိုင်သော Koha OPAC စနစ်"]
        },
        {
          id: "cal-standards",
          title: "စာဖော်ပြမှု စံနှုန်းများ",
          englishTitle: "Bibliographic Description Standards",
          icon: <FileText className="w-5 h-5" />,
          color: "border-purple-500/40 text-purple-300 bg-purple-950/40",
          glowColor: "rgba(168,85,247,0.3)",
          detail: "စာအုပ်အချက်အလက်များကို နိုင်ငံတကာ သတ်မှတ်ချက်နှင့်အညီ ဖော်ပြသည့် ရေးထုံးစနစ်များဖြစ်ပြီး ယခင် AACR2 မှ လက်ရှိ ဒစ်ဂျစ်တယ်ခေတ်သုံး RDA သို့ ပြောင်းလဲကျင့်သုံးနေသည်။",
          keywords: ["AACR2 Rules", "RDA (Resource Description and Access)", "ISBD standards"],
          examples: ["စာအုပ်အမည်၊ ရေးသူကို ပုံစံတကျ ဖော်ပြခြင်း", "ဒစ်ဂျစ်တယ်ဖိုင်များအတွက် RDA အင်္ဂါရပ်များ ဖြည့်စွက်ခြင်း"]
        },
        {
          id: "cal-marc",
          title: "MARC 21 Format",
          englishTitle: "Machine-Readable Cataloging",
          icon: <Database className="w-5 h-5" />,
          color: "border-pink-500/40 text-pink-300 bg-pink-950/40",
          glowColor: "rgba(236,72,153,0.3)",
          detail: "ကွန်ပျူတာစနစ်များမှ ဖတ်ရှုနားလည်နိုင်ရန် စာအုပ်အချက်အလက်များကို Tag Codes များဖြင့် စနစ်တကျ သတ်မှတ်ထားသော ပုံစံခွက်ဖြစ်သည်။",
          keywords: ["MARC Tags", "Subfields (e.g. $a, $b)", "Indicators"],
          examples: ["Tag 245 - စာအုပ်ခေါင်းစဉ် (Title Statement)", "Tag 100 - အဓိကစာရေးသူ (Personal Name Creator)", "Tag 264 - ထုတ်ဝေမှုအချက်အလက် (Imprint)"]
        },
        {
          id: "cal-entries",
          title: "ကတ်တလောက်အဝင်များ",
          englishTitle: "Catalog Entries Structure",
          icon: <BookOpen className="w-5 h-5" />,
          color: "border-violet-500/40 text-violet-300 bg-violet-950/40",
          glowColor: "rgba(139,92,246,0.3)",
          detail: "စာဖတ်သူ စာအုပ်ရှာဖွေရာတွင် အသုံးပြုနိုင်သည့် ဝင်ပေါက်များဖြစ်ပြီး စာရေးသူ၊ ခေါင်းစဉ် သို့မဟုတ် ဘာသာရပ်တို့မှတစ်ဆင့် ရှာဖွေနိုင်ရန် ပြုလုပ်ထားခြင်းဖြစ်သည်။",
          keywords: ["Main Entry", "Added Entry", "Subject Entry", "Cross References"],
          examples: ["စာရေးသူအမည်ဖြင့် ရှာရန် Main Entry ထားရှိခြင်း", "ဘာသာရပ်ခေါင်းစဉ်ဖြင့် ရှာရန် Added Entry ပြုလုပ်ပေးခြင်း"]
        },
        {
          id: "cal-authority",
          title: "အာဏာပိုင် ထိန်းချုပ်မှု",
          englishTitle: "Authority Control System",
          icon: <Sparkles className="w-5 h-5" />,
          color: "border-indigo-500/40 text-indigo-300 bg-indigo-950/40",
          glowColor: "rgba(99,102,241,0.3)",
          detail: "စာရေးသူအမည်တူများ သို့မဟုတ် မတူကွဲပြားသော စာလုံးပေါင်းများကို တစ်သမတ်တည်းဖြစ်အောင် သတ်မှတ်ထားသော အမည်ထိန်းချုပ်စနစ်ဖြစ်သည်။",
          keywords: ["Name Authority", "Subject Authority File", "Standardization"],
          examples: ["'သိပ္ပံမောင်ဝ' အမည်အား စံအမည်တစ်ခုတည်းအဖြစ် သတ်မှတ်ထိန်းချုပ်ခြင်း", "မတူညီသော ဘာသာရပ်သုံး ဝေါဟာရများကို စံစကားလုံးအဖြစ် ရွေးချယ်ခြင်း"]
        }
      ],
      selfTest: [
        {
          question: "MARC 21 Format တွင် စာအုပ်၏ 'ခေါင်းစဉ်/အမည် (Title Statement)' ကို မည်သည့် Tag နံပါတ်ဖြင့် ကိုယ်စားပြုသနည်း။",
          options: ["Tag 100", "Tag 245", "Tag 264", "Tag 300"],
          correctIndex: 1,
          explanation: "MARC 21 တွင် Tag 245 ကို စာအုပ်ခေါင်းစဉ် (Title Statement) ဖော်ပြရန် အသုံးပြုပြီး $a (Title)၊ $b (Remainder of Title) စသည်ဖြင့် ခွဲခြားသည်။"
        },
        {
          question: "ခေတ်သစ်ဒစ်ဂျစ်တယ်သတင်းရင်းမြစ်များကိုပါ စနစ်တကျ ကတ်တလောက်သွင်းနိုင်ရန် နိုင်ငံတကာတွင် လက်ရှိကျင့်သုံးနေသော စံနှုန်းမှာ မည်သည့်အရာဖြစ်သနည်း။",
          options: ["AACR2", "Dublin Core", "RDA (Resource Description and Access)", "ISBD"],
          correctIndex: 2,
          explanation: "RDA (Resource Description and Access) သည် AACR2 ၏ နောက်ဆက်တွဲအဖြစ် ပေါ်ပေါက်လာပြီး ဒစ်ဂျစ်တယ်ရင်းမြစ်များကိုပါ ကောင်းစွာဖော်ပြနိုင်သော ခေတ်မီစံနှုန်းဖြစ်သည်။"
        }
      ]
    },
    {
      id: "mcs",
      code: "MCS",
      name: "Metadata & Classification Systems",
      color: "from-amber-400 to-orange-500",
      darkColor: "bg-amber-500/10 border-amber-500/30 text-amber-300",
      glowColor: "rgba(245,158,11,0.4)",
      description: "စာအုပ်များကို ဘာသာရပ်တူရာစုစည်း၍ သတ်မှတ်နံပါတ်များပေးခြင်းနှင့် သတင်းအချက်အလက်ကို သရုပ်ခွဲသည့် မေတာဒေတာစနစ်များ",
      nodes: [
        {
          id: "mcs-schemes",
          title: "အမျိုးအစားခွဲခြားမှု စနစ်များ",
          englishTitle: "Classification Schemes",
          icon: <Book className="w-5 h-5" />,
          color: "border-amber-500/40 text-amber-300 bg-amber-950/40",
          glowColor: "rgba(245,158,11,0.3)",
          detail: "ကမ္ဘာ့စာကြည့်တိုက်များတွင် အဓိကအသုံးပြုသည့် စာအုပ်များကို ဘာသာရပ်အလိုက် နံပါတ်စဉ် သတ်မှတ်ခွဲခြားသော နည်းလမ်းစနစ်များဖြစ်သည်။",
          keywords: ["DDC (Dewey Decimal Classification)", "LCC (Library of Congress)", "UDC (Universal Decimal)"],
          examples: ["DDC - အများပြည်သူစာကြည့်တိုက်များတွင် သုံးသည်", "LCC - တက္ကသိုလ်နှင့် သုတေသနစာကြည့်တိုက်ကြီးများတွင် သုံးသည်"]
        },
        {
          id: "mcs-ddc",
          title: "DDC အဓိကအတန်းကြီး ၁၀ ခု",
          englishTitle: "DDC 10 Main Classes",
          icon: <Database className="w-5 h-5" />,
          color: "border-orange-500/40 text-orange-300 bg-orange-950/40",
          glowColor: "rgba(249,115,22,0.3)",
          detail: "ဒေါ့ဝေးဒသမစနစ်၏ ပထမဆုံး ဂဏန်း ၃ လုံးဖြစ်ပြီး လူသားတို့၏ ဗဟုသုတနယ်ပယ်ကြီး ၁၀ ခုကို ကိုယ်စားပြုခွဲခြားထားသည်။",
          keywords: ["000-Computer & General", "200-Religion", "500-Pure Science", "800-Literature", "900-History"],
          examples: ["200 အတန်းခွဲတွင် ဗုဒ္ဓဘာသာ၊ ခရစ်ယာန်ဘာသာ စသည့် ဘာသာရေးစာအုပ်များ စုစည်းထားသည်", "800 အတန်းခွဲတွင် ကဗျာ၊ ဝတ္ထုနှင့် စာပေအနုပညာ စာအုပ်များပါဝင်သည်"]
        },
        {
          id: "mcs-subject",
          title: "ဘာသာရပ်ခေါင်းစဉ်များ",
          englishTitle: "Subject Headings & Vocabulary",
          icon: <FileText className="w-5 h-5" />,
          color: "border-yellow-500/40 text-yellow-300 bg-yellow-950/40",
          glowColor: "rgba(234,179,8,0.3)",
          detail: "စာအုပ်တွင်ပါဝင်သော အကြောင်းအရာကို တိကျစွာညွှန်းဆိုပြနိုင်ရန် စနစ်တကျ ထိန်းချုပ်ထားသော ဝေါဟာရစာရင်းများ ဖြစ်သည်။",
          keywords: ["LCSH (LC Subject Headings)", "Sears List", "Controlled Vocabulary"],
          examples: ["LCSH ကို အကြီးစားစာကြည့်တိုက်များတွင် သုံးသည်", "Sears List ကို ကျောင်းနှင့် အလတ်စားစာကြည့်တိုက်များတွင် သုံးသည်"]
        },
        {
          id: "mcs-meta",
          title: "မေတာဒေတာ စံနှုန်းများ",
          englishTitle: "Metadata Standards & Schemas",
          icon: <Sparkles className="w-5 h-5" />,
          color: "border-red-500/40 text-red-300 bg-red-950/40",
          glowColor: "rgba(239,68,68,0.3)",
          detail: "အချက်အလက်ကို ဖော်ပြသည့် အချက်အလက် (Data about Data) ဖြစ်ပြီး အထူးသဖြင့် ဒစ်ဂျစ်တယ် စာမျက်နှာများနှင့် ဝဘ်ပေါ်ရှိ သတင်းရင်းမြစ်များကို စုစည်းရာတွင် အရေးပါသည်။",
          keywords: ["Dublin Core (၁၅ ချက်စံ)", "MODS", "METS", "Schema.org"],
          examples: ["Dublin Core Element: Title, Creator, Subject, Description, Date", "Web page များတွင် search engine တွေ့စေရန် metadata ထည့်ခြင်း"]
        }
      ],
      selfTest: [
        {
          question: "DDC စနစ်တွင် လူမှုသိပ္ပံပညာရပ်များ (Social Sciences) ဆိုင်ရာ စာအုပ်များကို မည်သည့်အတန်းနံပါတ်ကြီးအောက်တွင် ထည့်သွင်းသနည်း။",
          options: ["300 Class", "500 Class", "700 Class", "900 Class"],
          correctIndex: 0,
          explanation: "DDC တွင် 300 Class မှာ လူမှုသိပ္ပံပညာရပ်များ (ဥပဒေ၊ ပညာရေး၊ စီးပွားရေး၊ လူမှုရေး) ဖြစ်ပြီး၊ 500 မှာ သဘာဝသိပ္ပံ၊ 700 မှာ အနုပညာ၊ 900 မှာ သမိုင်းနှင့်ပထဝီ ဖြစ်သည်။"
        },
        {
          question: "ဒြပ်စင် (Elements) ၁၅ ခုဖြင့် ဒစ်ဂျစ်တယ်သတင်းရင်းမြစ်များကို ရိုးရှင်းမြန်ဆန်စွာ ဖော်ပြနိုင်သော နိုင်ငံတကာသုံး မေတာဒေတာ စံနှုန်းမှာ မည်သည့်အရာဖြစ်သနည်း။",
          options: ["MARC 21", "Dublin Core", "LCC", "Sears List"],
          correctIndex: 1,
          explanation: "Dublin Core (Dublin Core Metadata Initiative) သည် အခြေခံဒြပ်စင် ၁၅ ခုပါဝင်သည့် အထူးလူကြိုက်များပြီး ရိုးရှင်းသော ဒစ်ဂျစ်တယ် မေတာဒေတာစံနှုန်းဖြစ်သည်။"
        }
      ]
    },
    {
      id: "mss",
      code: "MSS",
      name: "Manuscripts & Special Collections",
      color: "from-cyan-400 to-indigo-500",
      darkColor: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",
      glowColor: "rgba(6,182,212,0.4)",
      description: "ရှေးဟောင်းပေစာ၊ ပုရပိုက်များနှင့် တန်ဖိုးကြီး အထူးစုဆောင်းမှုစာပေများကို ရေရှည်တည်တံ့စေရန် ထိန်းသိမ်းစောင့်ရှောက်သည့်ပညာ",
      nodes: [
        {
          id: "mss-types",
          title: "ရှေးဟောင်းစာပေ အမျိုးအစားများ",
          englishTitle: "Types of Ancient Manuscripts",
          icon: <BookOpen className="w-5 h-5" />,
          color: "border-cyan-500/40 text-cyan-300 bg-cyan-950/40",
          glowColor: "rgba(6,182,212,0.3)",
          detail: "မြန်မာနိုင်ငံတွင် ယခင်က ရေးသားခဲ့သော ပေစာ (ကညစ်ဖြင့်ရေးထွင်းသည်)၊ ပုရပိုက် (စက္ကူခေါက်စနစ်) နှင့် သာသနာရေးဆိုင်ရာ ကမ္မဝါစာစသည်တို့ ဖြစ်သည်။",
          keywords: ["Palm-leaf Manuscripts", "Paper Parabaiks", "Kammavaca text"],
          examples: ["ပေရွက်ပေါ်တွင် ကညစ်ဖြင့် စာလုံးရေးထွင်းထားသော ပေစာထုပ်များ", "ဆေးရောင်စုံပုံများနှင့် ဆေးကျမ်းများပါသော ပုရပိုက်ဖြူ/ပုရပိုက်နက်များ"]
        },
        {
          id: "mss-prep",
          title: "ပေစာပြုစုမှုနှင့် ပုံစံတည်ဆောက်မှု",
          englishTitle: "Preparation of Manuscripts",
          icon: <FileText className="w-5 h-5" />,
          color: "border-blue-500/40 text-blue-300 bg-blue-950/40",
          glowColor: "rgba(59,130,246,0.3)",
          detail: "ပေပင်မှ ပေရွက်ရယူပြီး စာရေးသားနိုင်သည်အထိ အဆင့်ဆင့် ပြင်ဆင်ခြင်းနှင့် မှင်ထင်စေရန် သဘာဝရေနံချေးသုတ်ခြင်း လုပ်ငန်းစဉ်များဖြစ်သည်။",
          keywords: ["Incising (ရေးထွင်းခြင်း)", "Oiling (ရေနံချေးသုတ်ခြင်း)", "Scribing Tools"],
          examples: ["ပေရွက်များကို ဆားရည်ဖြင့်ပြုတ်ပြီး ခြောက်သွေ့အောင်ပြုလုပ်ခြင်း", "မှင်ပေါ်လွင်စေရန် မီးသွေးမှုန့်နှင့် ရေနံချေး ရောသုတ်ခြင်း"]
        },
        {
          id: "mss-conserv",
          title: "မော်ကွန်းထိန်းသိမ်းမှုပညာ",
          englishTitle: "Conservation & Archival Science",
          icon: <Database className="w-5 h-5" />,
          color: "border-indigo-500/40 text-indigo-300 bg-indigo-950/40",
          glowColor: "rgba(99,102,241,0.3)",
          detail: "ရှေးဟောင်းစာရွက်စာတမ်းများ ပိုးမွှားဒဏ်၊ အစိုဓာတ်ဒဏ်နှင့် အက်စစ်စားခြင်းဒဏ်များကြောင့် မပျက်စီးစေရန် သိပ္ပံနည်းကျ ထိန်းသိမ်းသည့်စနစ်ဖြစ်သည်။",
          keywords: ["Relative Humidity (RH 50-60%)", "Temperature Control", "Deacidification", "Acid-free storage"],
          examples: ["အပူချိန် ၂၀ ဒီဂရီစင်တီဂရိတ်ဝန်းကျင်တွင် အမြဲထားရှိခြင်း", "အက်စစ်ကင်းစင်သော သေတ္တာများဖြင့် ပေစာထုပ်များကို သိမ်းဆည်းခြင်း"]
        },
        {
          id: "mss-digital",
          title: "ဒစ်ဂျစ်တယ်စနစ်သို့ ပြောင်းလဲခြင်း",
          englishTitle: "Digitization of Heritage Assets",
          icon: <Sparkles className="w-5 h-5" />,
          color: "border-sky-500/40 text-sky-300 bg-sky-950/40",
          glowColor: "rgba(14,165,233,0.3)",
          detail: "ရှေးဟောင်းပေပုရပိုက်များကို ပျက်စီးမည့်ဘေးမှ ကာကွယ်ရန် အရည်အသွေးမြင့် ကင်မရာများနှင့် ကွန်ပျူတာစနစ်များသုံးကာ ဒစ်ဂျစ်တယ် မော်ကွန်းတိုက်များ ပြုစုခြင်းဖြစ်သည်။",
          keywords: ["High-resolution Photography", "Digital Preservation", "Metadata Tagging"],
          examples: ["ပေရွက်တစ်ရွက်ချင်းစီအား နောက်ခံအမည်းဖြင့် high-res ဓာတ်ပုံရိုက်ခြင်း", "အွန်လိုင်းမှ ဖတ်ရှုနိုင်ရန် PDF နှင့် မေတာဒေတာ တည်ဆောက်ခြင်း"]
        }
      ],
      selfTest: [
        {
          question: "မြန်မာ့သမိုင်းတွင် ရေးသားသူက ပေရွက်ပေါ်တွင် ကညစ်ဖြင့် အက္ခရာများကို အကွေးအဝိုင်းများအဖြစ် ရေးထွင်းပြီးနောက် အဘယ်ကြောင့် ရေနံချေး သုတ်လိမ်းရသနည်း။",
          options: ["ပေရွက်ပျော့ပျောင်းစေရန်", "မှင်ရောင်ထင်ရှားပေါ်လွင်စေရန်နှင့် ပိုးမွှားရန်မှ ကာကွယ်ရန်", "ပေရွက်များကို ကပ်သွားစေရန်", "အရောင်တောက်ပြောင်စေရန်"],
          correctIndex: 1,
          explanation: "ရေးထွင်းထားသော အဝိုင်းရာများထဲသို့ ရေနံချေးနှင့် မီးသွေးမှုန့်များ ဝင်သွားစေရန် သုတ်လိမ်းရသည်။ ၎င်းသည် မှင်ရောင်ကို ထင်ရှားစေရုံသာမက ပိုးမွှားကိုလည်း ကာကွယ်ပေးသည်။"
        },
        {
          question: "ရှေးဟောင်းစာပေများ သိမ်းဆည်းရာတွင် စိုထိုင်းဆ (Relative Humidity) ကို ပုံမှန်အားဖြင့် မည်မျှဝန်းကျင် ထိန်းညှိထားရန် လိုအပ်သနည်း။",
          options: ["10% - 20%", "30% - 40%", "50% - 60%", "80% - 90%"],
          correctIndex: 2,
          explanation: "စိုထိုင်းဆ လွန်ကဲလျှင် မှိုတက်ပြီး၊ လွန်စွာခြောက်သွေ့လျှင် စက္ကူ/ပေရွက်များ ကြွပ်ဆတ်ကျိုးပျက်လွယ်သဖြင့် 50% - 60% ဝန်းကျင် RH ထားရှိခြင်းမှာ အကောင်းဆုံးဖြစ်သည်။"
        }
      ]
    },
    {
      id: "his",
      code: "HIS",
      name: "History of Libraries & Books",
      color: "from-rose-400 to-red-500",
      darkColor: "bg-rose-500/10 border-rose-500/30 text-rose-300",
      glowColor: "rgba(244,63,94,0.4)",
      description: "စာအုပ်စာပေများ ပုံနှိပ်ထုတ်ဝေမှု သမိုင်းကြောင်းနှင့် ကမ္ဘာနှင့်မြန်မာ့ စာကြည့်တိုက်များ ဖြစ်ပေါ်တိုးတက်လာပုံ သမိုင်းရင်းမြစ်",
      nodes: [
        {
          id: "his-ancient",
          title: "ရှေးဟောင်းစာကြည့်တိုက်များ သမိုင်း",
          englishTitle: "Ancient World Libraries",
          icon: <History className="w-5 h-5" />,
          color: "border-rose-500/40 text-rose-300 bg-rose-950/40",
          glowColor: "rgba(244,63,94,0.3)",
          detail: "စာကြည့်တိုက်များ၏ အစဦးဆုံးသမိုင်းဖြစ်ပြီး ရွှံ့ပြားများ၊ ပပိုင်းရပ်စ်ကျူရွက်လိပ်များဖြင့် စာပေအချက်အလက်ကို ထိန်းသိမ်းခဲ့ကြသည်။",
          keywords: ["Clay Tablets", "Library of Alexandria (Egypt)", "Nineveh Library", "Scrolls"],
          examples: ["အဆီးရီးယားဘုရင် အာရှုဘာနီပါယ်၏ နင်နားဗား ရွှံ့ပြားစာကြည့်တိုက်", "အလက်ဇန်းဒရီးယားကျူရွက်လိပ် စာကြည့်တိုက်ကြီး"]
        },
        {
          id: "his-myanmar",
          title: "မြန်မာ့စာကြည့်တိုက်သမိုင်း",
          englishTitle: "Myanmar Library Evolution",
          icon: <Book className="w-5 h-5" />,
          color: "border-red-500/40 text-red-300 bg-red-950/40",
          glowColor: "rgba(239,68,68,0.3)",
          detail: "ပုဂံခေတ်မှသည် ကုန်းဘောင်ခေတ်အထိ ပိဋကတ်သုံးပုံ သိမ်းဆည်းသော ပိဋကတ်တိုက်တော်များနှင့် ကိုလိုနီခေတ်၊ လွတ်လပ်ရေးရပြီးခေတ် စာကြည့်တိုက်များ ဖြစ်သည်။",
          keywords: ["Pitaka Taik", "King Mindon's Archives", "Bernard Free Library", "National Library"],
          examples: ["ပုဂံခေတ် အနော်ရထာမင်းတရားကြီး ဆောက်လုပ်ခဲ့သော ပိဋကတ်တိုက်တော်", "မန္တလေး ရတနာပုံခေတ် မင်းတုန်းမင်းတရားကြီး၏ ပိဋကတ်တိုက်တော်"]
        },
        {
          id: "his-printing",
          title: "ပုံနှိပ်စက်သမိုင်းနှင့် စာအုပ်များ",
          englishTitle: "History of Printing & Books",
          icon: <FileText className="w-5 h-5" />,
          color: "border-amber-500/40 text-amber-300 bg-amber-950/40",
          glowColor: "rgba(245,158,11,0.3)",
          detail: "စာအုပ်များ အမြောက်အမြား ပုံနှိပ်နိုင်စေရန် ဂျိုဟန်ဂူတင်ဘတ်၏ သတ္တုစာလုံးရွှေ့ ပုံနှိပ်စက် တီထွင်မှုနှင့် စာအုပ်ထုတ်လုပ်မှု တိုးတက်လာပုံဖြစ်သည်။",
          keywords: ["Woodblock Printing", "Johannes Gutenberg", "Movable Type (၁၄၄၀ ခုနှစ်)", "Gutenberg Bible"],
          examples: ["တရုတ်ပြည်မှ စတင်ခဲ့သော သစ်သားပုံနှိပ်တုံးစနစ်", "၁၄၅၅ ခုနှစ်တွင် ပထမဆုံးရိုက်နှိပ်သော ဂူတင်ဘတ်သမ္မာကျမ်းစာ"]
        },
        {
          id: "his-national",
          title: "အမျိုးသားစာကြည့်တိုက်များ ပေါ်ပေါက်လာပုံ",
          englishTitle: "Establishment of National Libraries",
          icon: <BookOpen className="w-5 h-5" />,
          color: "border-pink-500/40 text-pink-300 bg-pink-950/40",
          glowColor: "rgba(236,72,153,0.3)",
          detail: "နိုင်ငံတစ်နိုင်ငံ၏ စာပေအမွေအနှစ်အားလုံးကို စုဆောင်းထိန်းသိမ်းရန်နှင့် စာအုပ်အပ်နှံမှုဥပဒေများအရ စာကြည့်တိုက်ကြီးများ ဥပဒေအရ ပေါ်ပေါက်လာခြင်း ဖြစ်သည်။",
          keywords: ["National Library", "Legal Deposit Law (စာအုပ်အပ်နှံမှုဥပဒေ)", "Cultural Heritage"],
          examples: ["ယူကေနိုင်ငံရှိ ဗြိတိသျှစာကြည့်တိုက် (British Library)", "အမေရိကန် ကွန်ဂရက်စာကြည့်တိုက် (Library of Congress)"]
        }
      ],
      selfTest: [
        {
          question: "၁၄၄၀ ပြည့်လွန်နှစ်များတွင် သတ္တုစာလုံးရွှေ့ပုံနှိပ်စက် (Movable Type Printing Press) ကို တီထွင်ပြီး ကမ္ဘာ့ပုံနှိပ်စက်တော်လှန်ရေးကို စတင်ခဲ့သူမှာ မည်သူနည်း။",
          options: ["Albert Einstein", "Johannes Gutenberg (ဂျိုဟန် ဂူတင်ဘတ်)", "Thomas Edison", "Benjamin Franklin"],
          correctIndex: 1,
          explanation: "ဂျိုဟန် ဂူတင်ဘတ်သည် ဂျာမနီနိုင်ငံတွင် စာလုံးရွှေ့ပုံနှိပ်စက်ကို တီထွင်ခဲ့ပြီး ယင်းသည် ကမ္ဘာ့ပညာရေးနှင့် စာကြည့်တိုက်များ တိုးတက်မှုအတွက် အဓိကလှေကားထစ် ဖြစ်ခဲ့သည်။"
        },
        {
          question: "မြန်မာ့သမိုင်းတွင် ပထမဦးဆုံးသော ပိဋကတ်တိုက်တော်ကို မည်သည့်ခေတ်တွင် စတင်တည်ဆောက်ခဲ့သနည်း။",
          options: ["အင်းဝခေတ်", "ပုဂံခေတ် (မင်းကြီး အနော်ရထာ)", "ကုန်းဘောင်ခေတ်", "တောင်ငူခေတ်"],
          correctIndex: 1,
          explanation: "အနော်ရထာမင်းစောသည် သထုံပြည်မှ ပိဋကတ်တော်များကို ပုဂံသို့ ပင့်ဆောင်လာပြီးနောက် ပုဂံရွှေဆံတော်ဘုရားအနီး၌ ပိဋကတ်တိုက်တော်ကို ဆောက်လုပ်ထိန်းသိမ်းခဲ့သည်။"
        }
      ]
    }
  ];

  const currentSubject = subjectsData[selectedSubjectIdx];

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
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="w-full relative z-10"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
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
            <span>စာကြည့်တိုက်ပညာရပ် Mind Maps</span>
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            မြန်မာဘာသာဖြင့် စာကြည့်တိုက်သိပ္ပံ သင်ခန်းစာများကို လှပသပ်ရပ်သော စိတ်မြေပုံစနစ်ဖြင့် အပြန်အလှန်လေ့လာရန်
          </p>
        </div>

        {/* Font Size Changer inside the mind maps screen for fast adjustment */}
        <div className="flex items-center gap-2 bg-[#1d0f3d]/60 border border-white/10 px-3 py-2 rounded-2xl shadow-lg">
          <span className="text-[10px] text-pink-300 font-bold uppercase tracking-wider">Mind Map စာလုံးအရွယ်အစား:</span>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setLocalFontScale(prev => Math.max(80, prev - 10))}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs cursor-pointer"
              title="စာလုံးသေးမည်"
            >
              A-
            </button>
            <button 
              onClick={() => setLocalFontScale(100)}
              className="px-2 h-7 flex items-center justify-center rounded-lg bg-white/10 border border-white/20 text-white text-xs font-bold cursor-pointer"
              title="ပုံမှန်အရွယ်အစား"
            >
              {localFontScale}%
            </button>
            <button 
              onClick={() => setLocalFontScale(prev => Math.min(140, prev + 10))}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs cursor-pointer"
              title="စာလုံးကြီးမည်"
            >
              A+
            </button>
          </div>
        </div>
      </div>

      {/* Tabs list of five subjects */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {subjectsData.map((subj, idx) => {
          const isActive = selectedSubjectIdx === idx;
          return (
            <button
              key={subj.id}
              onClick={() => {
                setSelectedSubjectIdx(idx);
                setActiveNodeId(null);
                setShowSelfTest(false);
              }}
              className={`p-3 md:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center text-center group relative overflow-hidden ${
                isActive 
                  ? `bg-gradient-to-tr ${subj.color} border-white/20 shadow-lg text-white` 
                  : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10 text-slate-300"
              }`}
            >
              {/* Highlight background glowing */}
              {isActive && (
                <div className="absolute inset-0 bg-white/10 mix-blend-overlay animate-pulse" />
              )}
              <span className={`text-xs md:text-sm font-display font-black tracking-widest block ${isActive ? "text-white" : "text-white group-hover:text-pink-300"}`}>
                {subj.code}
              </span>
              <span className="hidden md:inline text-[10px] text-slate-300 mt-1 truncate max-w-full leading-tight">
                {subj.name.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid container with Active Map & Details Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Interactive Mind Map Stage Column */}
        <div className="lg:col-span-8 flex flex-col justify-between p-6 bg-[#160a2d]/40 border border-white/10 rounded-3xl backdrop-blur-md relative overflow-hidden min-h-[480px]">
          
          {/* Glowing Subject Aura */}
          <div 
            className="absolute -top-24 -left-24 w-60 h-60 rounded-full blur-[100px] pointer-events-none transition-all duration-700" 
            style={{ backgroundColor: currentSubject.glowColor }}
          />

          <div className="relative z-10 mb-4 flex justify-between items-center border-b border-white/5 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r ${currentSubject.color} text-white`}>
                  {currentSubject.code}
                </span>
                <span className="text-slate-400 text-xs font-mono">အပြန်အလှန်သက်ဝင်စိတ်မြေပုံ</span>
              </div>
              <h3 className="text-lg font-black text-white mt-1">{currentSubject.name}</h3>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setZoomLevel(prev => Math.max(0.8, prev - 0.1))}
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setZoomLevel(1)}
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-all text-[10px] font-mono cursor-pointer"
                title="Reset Zoom"
              >
                100%
              </button>
              <button 
                onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={startTest}
                className="ml-2 flex items-center gap-1 px-3 py-1 bg-pink-500/20 hover:bg-pink-500/35 border border-pink-500/30 text-pink-300 rounded-xl text-xs font-bold cursor-pointer transition-all animate-pulse"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>စမ်းသပ်ချက်ဖြေမည်</span>
              </button>
            </div>
          </div>

          {/* SVG Map Canvas and Nodes */}
          <div className="flex-1 w-full flex items-center justify-center p-4 relative min-h-[350px]">
            
            <div 
              className="relative w-full max-w-lg transition-transform duration-300"
              style={{ 
                transform: `scale(${zoomLevel})`,
                fontSize: `${localFontScale}%`
              }}
            >
              
              {/* Radial Connectors using SVG Paths */}
              <div className="absolute inset-0 pointer-events-none z-0">
                <svg className="w-full h-full min-h-[350px]" style={{ overflow: "visible" }}>
                  <defs>
                    <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#d946ef" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                  
                  {/* Lines connecting center to outer nodes */}
                  {currentSubject.nodes.map((node, index) => {
                    // Predefined beautiful node coordinates relative to absolute center
                    const total = currentSubject.nodes.length;
                    const angle = (index * 2 * Math.PI) / total;
                    const radius = 135; // distance from center
                    
                    // Coordinates of outer node
                    const x2 = 50 + 40 * Math.cos(angle);
                    const y2 = 50 + 38 * Math.sin(angle);
                    
                    return (
                      <g key={node.id}>
                        {/* Core path curve line */}
                        <path 
                          d={`M 50 50 Q ${50 + 20 * Math.cos(angle)} ${50 + 10 * Math.sin(angle)} ${x2}% ${y2}%`}
                          fill="none" 
                          stroke="url(#gradient-line)" 
                          strokeWidth="2.5" 
                          strokeDasharray="4 3"
                          className="animate-[dash_10s_linear_infinite]"
                        />
                        <circle 
                          cx={`${x2}%`} 
                          cy={`${y2}%`} 
                          r="5" 
                          fill="#d946ef"
                          className="animate-ping" 
                          style={{ animationDuration: "3s" }}
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Central Primary Subject Node */}
              <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className={`p-4 rounded-full bg-gradient-to-tr ${currentSubject.color} shadow-[0_0_25px_rgba(236,72,153,0.3)] border border-white/20 text-center text-white font-extrabold text-sm w-32 h-32 flex flex-col items-center justify-center cursor-pointer`}
                >
                  <BookOpen className="w-6 h-6 mb-1 text-white animate-bounce" />
                  <span className="font-display font-black leading-none block">{currentSubject.code}</span>
                  <span className="text-[9px] text-white/95 mt-1 font-semibold leading-tight px-1">မြေပုံဗဟိုချက်</span>
                </motion.div>
              </div>

              {/* Sub-nodes floating around */}
              {currentSubject.nodes.map((node, index) => {
                const total = currentSubject.nodes.length;
                const angle = (index * 2 * Math.PI) / total;
                const isActive = activeNodeId === node.id;
                
                // Position as percentage
                const x = 50 + 40 * Math.cos(angle);
                const y = 50 + 38 * Math.sin(angle);

                return (
                  <div 
                    key={node.id}
                    className="absolute z-20"
                    style={{ 
                      left: `${x}%`, 
                      top: `${y}%`,
                      transform: "translate(-50%, -50%)"
                    }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveNodeId(node.id)}
                      className={`px-3 py-2.5 rounded-2xl border backdrop-blur-xl transition-all cursor-pointer shadow-lg flex flex-col items-center gap-1 text-center min-w-[130px] max-w-[150px] ${
                        isActive 
                          ? "border-pink-500 bg-pink-500/15 text-pink-300 scale-105 shadow-[0_0_15px_rgba(236,72,153,0.3)]" 
                          : `${node.color} hover:border-pink-400/50 hover:text-white`
                      }`}
                    >
                      <div className="p-1 bg-white/10 rounded-lg shrink-0">
                        {node.icon}
                      </div>
                      <span className="text-[10px] md:text-xs font-bold leading-tight block">
                        {node.title}
                      </span>
                      <span className="text-[8px] opacity-75 font-mono font-medium block truncate max-w-[120px]">
                        {node.englishTitle}
                      </span>
                    </motion.button>
                  </div>
                );
              })}

            </div>

          </div>

          {/* Quick instructions indicator */}
          <div className="mt-4 p-3 bg-white/[0.03] rounded-2xl border border-white/5 flex items-center gap-2 relative z-10 text-xs text-slate-400">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>အဝိုင်းပတ်လည်ရှိ <b>စိတ်မြေပုံအဖွဲ့ခွဲများကို နှိပ်ပြီး</b> သက်ဆိုင်ရာ စာကြည့်တိုက် သင်ခန်းစာ အသေးစိတ် ရှင်းလင်းချက်များနှင့် ဥပမာများကို ညာဘက်ဘောင်တွင် လှလှပပ ဖတ်ရှုလေ့လာနိုင်ပါသည်။</span>
          </div>

        </div>

        {/* Detailed Explanation / Info Panel Column */}
        <div className="lg:col-span-4 flex flex-col">
          
          <AnimatePresence mode="wait">
            
            {showSelfTest ? (
              /* Self-Test Mini-Quiz Panel */
              <motion.div
                key="selftest"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-gradient-to-b from-[#1c0f3d] to-[#120a2a] border border-pink-500/20 p-5 rounded-3xl h-full flex flex-col justify-between shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl" />

                <div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
                    <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                      <HelpCircle className="text-pink-400 w-4 h-4" />
                      <span>{currentSubject.code} မိမိကိုယ်ကိုဆန်းစစ်ရန်</span>
                    </h4>
                    <button 
                      onClick={closeTest}
                      className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-white/5 rounded-lg border border-white/10 cursor-pointer"
                    >
                      ပိတ်မည်
                    </button>
                  </div>

                  {!testCompleted ? (
                    <div className="space-y-4">
                      {/* Progress bar */}
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                        <span>မေးခွန်း - {currentQuestionIdx + 1} / {currentSubject.selfTest.length}</span>
                        <span>ရမှတ်: {testScore} မှတ်</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${currentSubject.color} transition-all duration-300`}
                          style={{ width: `${((currentQuestionIdx + 1) / currentSubject.selfTest.length) * 100}%` }}
                        />
                      </div>

                      <p className="text-xs text-slate-200 font-extrabold leading-relaxed bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                        {currentSubject.selfTest[currentQuestionIdx].question}
                      </p>

                      <div className="space-y-2">
                        {currentSubject.selfTest[currentQuestionIdx].options.map((opt, oIdx) => {
                          const isSelected = selectedAnswerIdx === oIdx;
                          let btnStyle = "bg-white/[0.02] border-white/5 text-slate-300";
                          
                          if (isAnswerChecked) {
                            const isCorrect = oIdx === currentSubject.selfTest[currentQuestionIdx].correctIndex;
                            if (isCorrect) {
                              btnStyle = "bg-green-500/20 border-green-500 text-green-300";
                            } else if (isSelected) {
                              btnStyle = "bg-red-500/20 border-red-500 text-red-300";
                            }
                          } else if (isSelected) {
                            btnStyle = "bg-pink-500/20 border-pink-500 text-pink-300";
                          }

                          return (
                            <button
                              key={oIdx}
                              onClick={() => handleSelectAnswer(oIdx)}
                              className={`w-full text-left p-3 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${btnStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation box after checking answer */}
                      {isAnswerChecked && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-[11px] text-slate-400 leading-relaxed"
                        >
                          <span className="font-bold text-pink-300 block mb-1">💡 ရှင်းလင်းချက် -</span>
                          {currentSubject.selfTest[currentQuestionIdx].explanation}
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    /* Test Completed summary */
                    <div className="text-center py-6 space-y-4">
                      <div className="w-16 h-16 rounded-full bg-pink-500/20 border border-pink-500 flex items-center justify-center mx-auto text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                      <div>
                        <h5 className="text-sm font-black text-white">ဆန်းစစ်မှု ပြီးမြောက်ပါပြီ!</h5>
                        <p className="text-xs text-slate-400 mt-1">သင်ခန်းစာ စိတ်မြေပုံများကို အသုံးချပြီး ဆန်းစစ်ချက်ကို ကောင်းမွန်စွာ ဖြေဆိုပြီးပါပြီ။</p>
                      </div>

                      <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl">
                        <div className="text-[10px] text-slate-400">ရရှိခဲ့သော ရမှတ်စုစုပေါင်း</div>
                        <div className="text-xl font-display font-black text-glow-pink text-pink-400 mt-1">
                          {testScore} / {currentSubject.selfTest.length} မှတ်
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions footer */}
                  <div className="mt-6 pt-4 border-t border-white/5">
                    {!testCompleted ? (
                      !isAnswerChecked ? (
                        <button
                          onClick={handleCheckAnswer}
                          disabled={selectedAnswerIdx === null}
                          className="w-full py-3 rounded-2xl font-bold text-xs bg-pink-500 hover:bg-pink-600 border border-pink-400 text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-md"
                        >
                          အဖြေစစ်ဆေးမည်
                        </button>
                      ) : (
                        <button
                          onClick={handleNextQuestion}
                          className="w-full py-3 rounded-2xl font-bold text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-white cursor-pointer transition-all"
                        >
                          {currentQuestionIdx < currentSubject.selfTest.length - 1 ? "နောက်တစ်မေးခွန်းသို့" : "ရလဒ်ကြည့်မည်"}
                        </button>
                      )
                    ) : (
                      <button
                        onClick={startTest}
                        className="w-full py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-pink-500 to-purple-500 text-white border border-white/15 cursor-pointer transition-all shadow-lg"
                      >
                        ထပ်မံဖြေဆိုမည်
                      </button>
                    )}
                  </div>
                </div>

              </motion.div>
            ) : activeNodeId ? (
              /* Specific node details panel */
              (() => {
                const node = currentSubject.nodes.find(n => n.id === activeNodeId);
                if (!node) return null;

                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white/[0.02] border border-white/10 p-5 rounded-3xl h-full flex flex-col justify-between shadow-xl"
                  >
                    <div>
                      <div className="flex justify-between items-start border-b border-white/5 pb-3 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-white/5 rounded-xl text-pink-400">
                            {node.icon}
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">ခေါင်းစဉ်ခွဲ အသေးစိတ်</h4>
                            <h3 className="text-sm font-black text-white mt-1 leading-tight">{node.title}</h3>
                          </div>
                        </div>
                        <button 
                          onClick={() => setActiveNodeId(null)}
                          className="text-xs text-slate-400 hover:text-white px-1.5 py-0.5 bg-white/5 rounded-lg border border-white/10 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="space-y-4 text-xs">
                        <div>
                          <span className="text-[10px] text-pink-300 font-bold uppercase tracking-wider block mb-1">English Concept Term:</span>
                          <span className="font-mono font-extrabold text-white text-xs bg-white/[0.04] px-2 py-1.5 rounded-lg border border-white/5 block">
                            {node.englishTitle}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] text-pink-300 font-bold uppercase tracking-wider block mb-1">အကျဉ်းချုပ် ရှင်းလင်းချက်:</span>
                          <p className="text-slate-300 leading-relaxed bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                            {node.detail}
                          </p>
                        </div>

                        {node.keywords && node.keywords.length > 0 && (
                          <div>
                            <span className="text-[10px] text-pink-300 font-bold uppercase tracking-wider block mb-1.5">အဓိက သော့ချက်စကားလုံးများ:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {node.keywords.map((kw, idx) => (
                                <span 
                                  key={idx}
                                  className="px-2 py-1 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-300 font-mono text-[10px] font-semibold"
                                >
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {node.examples && node.examples.length > 0 && (
                          <div>
                            <span className="text-[10px] text-pink-300 font-bold uppercase tracking-wider block mb-1.5">လက်တွေ့ ဥပမာများနှင့် အသုံးချမှုများ:</span>
                            <ul className="space-y-1.5">
                              {node.examples.map((ex, idx) => (
                                <li key={idx} className="flex items-start gap-1.5 text-slate-400 leading-relaxed">
                                  <span className="text-pink-400 mt-0.5">•</span>
                                  <span>{ex}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5">
                      <button
                        onClick={() => setActiveNodeId(null)}
                        className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        ခေါင်းစဉ်အားလုံးသို့ ပြန်သွားမည်
                      </button>
                    </div>

                  </motion.div>
                );
              })()
            ) : (
              /* General summary of the subject */
              <motion.div
                key="general"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/[0.02] border border-white/10 p-5 rounded-3xl h-full flex flex-col justify-between shadow-lg"
              >
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">ဘာသာရပ်အနှစ်ချုပ်</h4>
                  <h3 className="text-sm font-black text-white mt-1 flex items-center gap-2">
                    <span className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${currentSubject.color}`} />
                    <span>{currentSubject.name} ({currentSubject.code})</span>
                  </h3>
                  
                  <div className="mt-4 space-y-4 text-xs text-slate-400 leading-relaxed">
                    <p className="bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                      {currentSubject.description}
                    </p>

                    <div className="p-3.5 rounded-2xl border border-white/5 bg-gradient-to-r from-pink-500/5 to-purple-500/5">
                      <span className="font-extrabold text-white text-xs block mb-1.5">စိတ်မြေပုံ၏ ပါဝင်သော အဓိကကဏ္ဍများ -</span>
                      <div className="space-y-2">
                        {currentSubject.nodes.map((node) => (
                          <div 
                            key={node.id}
                            onClick={() => setActiveNodeId(node.id)}
                            className="flex justify-between items-center py-1.5 border-b border-white/5 hover:text-pink-300 cursor-pointer transition-all group"
                          >
                            <span className="font-bold flex items-center gap-1.5">
                              <span className="text-pink-500 text-[10px]">■</span>
                              {node.title}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-pink-400 transition-all shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5">
                  <button
                    onClick={startTest}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff007f] to-[#a855f7] hover:from-[#e60072] hover:to-[#9333ea] border border-white/10 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>မိမိကိုယ်ကိုဆန်းစစ်ရန် မေးခွန်းများဖြေမည်</span>
                  </button>
                </div>

              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>

    </motion.div>
  );
}
