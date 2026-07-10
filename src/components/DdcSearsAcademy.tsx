import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  BookOpen, 
  Search, 
  HelpCircle, 
  Layers, 
  Bookmark, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Compass, 
  Plus, 
  BookMarked,
  Sliders,
  ChevronRight,
  Info,
  ExternalLink,
  Award
} from "lucide-react";
import { UserProfile } from "../types";

interface DdcSearsAcademyProps {
  user: UserProfile;
  onBack: () => void;
}

// Sears Heading format
interface SearsHeading {
  heading: string;
  myanmarName: string;
  category: string;
  useFor?: string; // UF (Use For)
  seeAlso?: string[]; // RT / NT
  subdivisions?: string[];
  example: string;
}

// Table Code Interface
interface TableCode {
  code: string;
  meaning: string;
  myanmarMeaning?: string;
  myanmarName?: string;
  example?: string;
}

// DDC Table Interface
interface DdcTable {
  id: string;
  name: string;
  myanmarName: string;
  description: string;
  codes: TableCode[];
}

export default function DdcSearsAcademy({ user, onBack }: DdcSearsAcademyProps) {
  const [activeTab, setActiveTab] = useState<"sears" | "ddc_classes" | "ddc_tables" | "builder" | "practice">("ddc_classes");
  
  // Sears List State
  const [searsSearch, setSearsSearch] = useState("");
  const [selectedSearsHeading, setSelectedSearsHeading] = useState<SearsHeading | null>(null);

  // DDC Classes State
  const [selectedMainClass, setSelectedMainClass] = useState<string>("300");
  const [classSearch, setClassSearch] = useState("");

  // DDC Tables State
  const [selectedTableId, setSelectedTableId] = useState<string>("t1");
  const [tableSearch, setTableSearch] = useState("");

  // Interactive Builder State
  const [builderBaseCode, setBuilderBaseCode] = useState<string>("610"); // Default Medicine
  const [builderTable, setBuilderTable] = useState<string>("t2"); // Default Area
  const [builderTableCode, setBuilderTableCode] = useState<string>("-591"); // Default Myanmar
  const [builtResult, setBuiltResult] = useState<{
    code: string;
    meaning: string;
    steps: string[];
  }>({
    code: "610.9591",
    meaning: "မြန်မာနိုင်ငံ၏ ဆေးပညာရပ်ဆိုင်ရာစာပေများ (Medicine in Myanmar)",
    steps: [
      "အခြေခံ DDC နံပါတ်: 610 (Medicine & Health)",
      "Table 2 (Geographical Areas) မှ ဒေသဆိုင်ရာကုဒ်ကို ဆက်စပ်မည်",
      "Table 1's -09 (Historical and Geographical treatment) ကိုကြားခံသုံး၍ Table 2 ၏ -591 (Myanmar) ကိုပေါင်းစပ်သည်",
      "အဆင့်ဆင့်ပေါင်းစပ်ခြင်း: 610 + -09 + -591 = 610.9591"
    ]
  });

  // Practice States
  const [quizType, setQuizType] = useState<"sears" | "ddc">("ddc");
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showScoreModal, setShowScoreModal] = useState(false);

  // Sears List Database
  const searsDatabase: SearsHeading[] = [
    {
      heading: "Libraries",
      myanmarName: "စာကြည့်တိုက်များ",
      category: "Social Sciences / Information",
      useFor: "Book collections, Public libraries",
      seeAlso: ["Academic libraries", "School libraries", "Cataloging", "Library science"],
      subdivisions: ["-- Administration", "-- Automation", "-- Finance", "-- Myanmar"],
      example: "Libraries -- Myanmar -- History"
    },
    {
      heading: "Library science",
      myanmarName: "စာကြည့်တိုက်ပညာရပ်",
      category: "Social Sciences / Information",
      useFor: "Library economy, Librarianship",
      seeAlso: ["Bibliography", "Cataloging", "Classification -- Books"],
      subdivisions: ["-- Biography", "-- Study and teaching", "-- Vocational guidance"],
      example: "Library science -- Study and teaching -- Myanmar"
    },
    {
      heading: "Cataloging",
      myanmarName: "စာအုပ်အညွှန်းပြုစုခြင်းပညာ",
      category: "Technical Services",
      useFor: "Book cataloging",
      seeAlso: ["Classification -- Books", "Indexing", "Subject headings"],
      subdivisions: ["-- Handbooks, manuals, etc.", "-- Rules", "-- History"],
      example: "Cataloging -- Rules -- AACR2"
    },
    {
      heading: "Information networks",
      myanmarName: "သတင်းအချက်အလက် ကွန်ရက်များ",
      category: "Technology",
      useFor: "Computer networks, Library networks",
      seeAlso: ["Internet", "Information systems", "Telecommunication"],
      subdivisions: ["-- Security measures", "-- Standards", "-- Myanmar"],
      example: "Information networks -- Standards"
    },
    {
      heading: "Buddhism",
      myanmarName: "ဗုဒ္ဓဘာသာ",
      category: "Religion",
      useFor: "Buddhist religion",
      seeAlso: ["Religions", "Buddhist philosophy", "Buddhist literature"],
      subdivisions: ["-- History", "-- Sacred books", "-- Myanmar", "-- Rituals"],
      example: "Buddhism -- Sacred books -- Tipitaka"
    },
    {
      heading: "Agriculture",
      myanmarName: "စိုက်ပျိုးရေးပညာ",
      category: "Applied Sciences",
      useFor: "Farming, Crop production",
      seeAlso: ["Horticulture", "Soil science", "Forestry"],
      subdivisions: ["-- Economic aspects", "-- Equipment and supplies", "-- Myanmar"],
      example: "Agriculture -- Economic aspects -- Myanmar"
    },
    {
      heading: "Medicine",
      myanmarName: "ဆေးပညာရပ်",
      category: "Applied Sciences",
      useFor: "Medical science, Health",
      seeAlso: ["Anatomy", "Diseases", "Hygiene", "Pharmacology"],
      subdivisions: ["-- Research", "-- History", "-- Dictionaries", "-- Study and teaching"],
      example: "Medicine -- Study and teaching -- Myanmar"
    },
    {
      heading: "Education",
      myanmarName: "ပညာရေးပညာ",
      category: "Social Sciences",
      useFor: "Pedagogy, Instruction",
      seeAlso: ["Schools", "Teachers", "Teaching", "Curriculum"],
      subdivisions: ["-- Finance", "-- History", "-- Myanmar", "-- Statistics"],
      example: "Education -- History -- Myanmar"
    }
  ];

  // DDC 6 Main Classes (In-depth database with hierarchical sub-branches)
  interface DdcSubClass {
    code: string;
    name: string;
    myanmarName: string;
    details: string;
    leaves?: { code: string; name: string; myanmarName: string }[];
  }

  interface DdcMainClass {
    code: string;
    name: string;
    myanmarName: string;
    description: string;
    subClasses: DdcSubClass[];
  }

  const ddcClassesDatabase: { [key: string]: DdcMainClass } = {
    "000": {
      code: "000",
      name: "Computer Science, Information & General Works",
      myanmarName: "ကွန်ပျူတာသိပ္ပံ၊ သတင်းအချက်အလက်နှင့် အထွေထွေပညာရပ်များ",
      description: "ကွန်ပျူတာစနစ်များ၊ စာကြည့်တိုက်ပညာ၊ သုတေသနနည်းလမ်းများနှင့် အထွေထွေရည်ညွှန်းစွယ်စုံကျမ်းများ ပါဝင်သည့် အတန်းကြီးဖြစ်သည်။",
      subClasses: [
        {
          code: "004",
          name: "Computer Science",
          myanmarName: "ကွန်ပျူတာသိပ္ပံနှင့် နည်းပညာ",
          details: "ကွန်ပျူတာဟာ့ဒ်ဝဲ၊ ဆော့ဖ်ဝဲ၊ ကွန်ရက်နှင့် အချက်အလက်စီမံမှုများ။",
          leaves: [
            { code: "004.6", name: "Computer Communications & Networks", myanmarName: "ကွန်ပျူတာ ကွန်ရက်နှင့် အင်တာနက်" },
            { code: "004.678", name: "Internet", myanmarName: "အင်တာနက် နည်းပညာရပ်" },
            { code: "005.1", name: "Computer Programming", myanmarName: "ကွန်ပျူတာ ပရိုဂရမ်ရေးဆွဲခြင်း" }
          ]
        },
        {
          code: "020",
          name: "Library & Information Sciences",
          myanmarName: "စာကြည့်တိုက်နှင့် သတင်းအချက်အလက်သိပ္ပံပညာရပ်",
          details: "စာကြည့်တိုက်စီမံခန့်ခွဲမှု၊ ဝန်ဆောင်မှုများနှင့် စာစုမှတ်တမ်းပြုစုပုံများ။",
          leaves: [
            { code: "025.1", name: "Library Administration", myanmarName: "စာကြည့်တိုက် စီမံခန့်ခွဲရေး" },
            { code: "025.3", name: "Bibliographic Analysis & Cataloging", myanmarName: "စာအုပ်ကတ်တလောက်နှင့် အမျိုးအစားခွဲခြားခြင်း" },
            { code: "027.7", name: "College & University Libraries", myanmarName: "တက္ကသိုလ်စာကြည့်တိုက်များ" }
          ]
        },
        {
          code: "030",
          name: "General Encyclopedic Works",
          myanmarName: "အထွေထွေစွယ်စုံကျမ်းများနှင့် အညွှန်းစာပေများ",
          details: "ကမ္ဘာ့စွယ်စုံကျမ်းကြီးများ၊ ဘာသာရပ်စုံဗဟုသုတအဘိဓာန်များ။"
        }
      ]
    },
    "200": {
      code: "200",
      name: "Religion",
      myanmarName: "ဘာသာရေးနှင့် သီလတရားပညာရပ်",
      description: "ကမ္ဘာ့ဘာသာတရားများ၊ ယုံကြည်ကိုးကွယ်မှု သမိုင်းကြောင်း၊ ဒဿနနှင့် စာပေကျမ်းဂန်များ ပါဝင်သည့် အတန်းကြီးဖြစ်သည်။",
      subClasses: [
        {
          code: "294",
          name: "Religions of Indic Origin",
          myanmarName: "အိန္ဒိယနိုင်ငံအခြေပြု ကိုးကွယ်ယုံကြည်မှုများ",
          details: "ဟိန္ဒူဘာသာ၊ ဂျိန်းဘာသာ၊ ဗုဒ္ဓဘာသာ စသည်တို့ ပါဝင်သည်။",
          leaves: [
            { code: "294.3", name: "Buddhism", myanmarName: "ဗုဒ္ဓဘာသာ (မြန်မာနိုင်ငံတွင် အသုံးအများဆုံး)" },
            { code: "294.382", name: "Buddhist Sacred Books (Tipitaka)", myanmarName: "ပိဋကတ်တော်စာပေများနှင့် အဋ္ဌကထာများ" },
            { code: "294.391", name: "Theravada Buddhism", myanmarName: "ထေရဝါဒ ဗုဒ္ဓဘာသာ" }
          ]
        },
        {
          code: "220",
          name: "The Bible",
          myanmarName: "ခရစ်ယာန် သမ္မာကျမ်းစာ",
          details: "ဓမ္မဟောင်းနှင့် ဓမ္မသစ်ကျမ်းများ၊ ကျမ်းစာလေ့လာမှုဆိုင်ရာများ။"
        },
        {
          code: "297",
          name: "Islam, Babism & Bahai",
          myanmarName: "အစ္စလာမ်ဘာသာနှင့် ဆက်စပ်ယုံကြည်မှုများ",
          details: "ကိုရ်အာန်ကျမ်းစာ၊ အစ္စလာမ်ဓမ္မသတ်နှင့် သမိုင်းကြောင်းများ။"
        }
      ]
    },
    "300": {
      code: "300",
      name: "Social Sciences",
      myanmarName: "လူမှုသိပ္ပံပညာရပ်များ",
      description: "လူသားတို့၏ လူမှုဘဝ၊ နိုင်ငံရေး၊ စီးပွားရေး၊ ဥပဒေနှင့် ပညာရေး စသည့် လူ့ဘောင်ဖွဲ့စည်းမှုပညာရပ်များ ပါဝင်သည့် အတန်းကြီးဖြစ်သည်။",
      subClasses: [
        {
          code: "320",
          name: "Political Science",
          myanmarName: "နိုင်ငံရေးသိပ္ပံပညာရပ်",
          details: "အစိုးရစနစ်များ၊ နိုင်ငံတကာဆက်ဆံရေး၊ ဒီမိုကရေစီနှင့် နိုင်ငံရေးအယူဝါဒများ။",
          leaves: [
            { code: "321.8", name: "Democratic Forms of Government", myanmarName: "ဒီမိုကရေစီအုပ်ချုပ်ရေးစနစ်" },
            { code: "327.591", name: "Myanmar Foreign Relations", myanmarName: "မြန်မာနိုင်ငံ၏ နိုင်ငံတကာဆက်ဆံရေး" }
          ]
        },
        {
          code: "330",
          name: "Economics",
          myanmarName: "စီးပွားရေးပညာရပ်",
          details: "ငွေကြေး၊ ဘဏ်လုပ်ငန်း၊ ထုတ်လုပ်မှု၊ ကုန်သွယ်မှုနှင့် ဈေးကွက်စီးပွားရေး။",
          leaves: [
            { code: "332.1", name: "Banking & Financial Institutions", myanmarName: "ဘဏ်လုပ်ငန်းနှင့် ငွေကြေးအဖွဲ့အစည်းများ" },
            { code: "338.9", name: "Economic Development", myanmarName: "စီးပွားရေး ဖွံ့ဖြိုးတိုးတက်မှု" }
          ]
        },
        {
          code: "340",
          name: "Law",
          myanmarName: "ဥပဒေပညာရပ်",
          details: "ဖွဲ့စည်းပုံအခြေခံဥပဒေ၊ တရားမဥပဒေ၊ ပြစ်မှုဆိုင်ရာဥပဒေနှင့် နိုင်ငံတကာဥပဒေများ။",
          leaves: [
            { code: "342", name: "Constitutional & Administrative Law", myanmarName: "ဖွဲ့စည်းပုံအခြေခံဥပဒေဆိုင်ရာ ဥပဒေ" },
            { code: "345.591", name: "Myanmar Penal Code", myanmarName: "မြန်မာနိုင်ငံ ရာဇသတ်ကြီးဥပဒေ" }
          ]
        },
        {
          code: "370",
          name: "Education",
          myanmarName: "ပညာရေးပညာရပ်",
          details: "သင်ကြားရေးနည်းလမ်းများ၊ ကျောင်းအုပ်ချုပ်မှုနှင့် သင်ရိုးညွှန်းတမ်း ရေးဆွဲခြင်း။",
          leaves: [
            { code: "371.3", name: "Methods of Instruction & Study", myanmarName: "သင်ကြားသင်ယူမှုဆိုင်ရာ နည်းလမ်းများ" },
            { code: "378.591", name: "Higher Education in Myanmar", myanmarName: "မြန်မာနိုင်ငံ၏ အဆင့်မြင့်ပညာရေးကဏ္ဍ" }
          ]
        }
      ]
    },
    "500": {
      code: "500",
      name: "Pure Science",
      myanmarName: "သဘာဝသိပ္ပံနှင့် သင်္ချာပညာရပ်များ",
      description: "သီအိုရီအခြေပြု သင်္ချာ၊ ရူပဗေဒ၊ ဓာတုဗေဒ၊ ဇီဝဗေဒနှင့် ကမ္ဘာမြေသိပ္ပံပညာရပ်များ ပါဝင်သည့် အတန်းကြီးဖြစ်သည်။",
      subClasses: [
        {
          code: "510",
          name: "Mathematics",
          myanmarName: "သင်္ချာပညာရပ်",
          details: "ကဏန်းသင်္ချာ၊ အက္ခရာသင်္ချာ၊ ဂျီဩမေတြီနှင့် ကဲကုလပ်များ။",
          leaves: [
            { code: "512", name: "Algebra", myanmarName: "အက္ခရာသင်္ချာ" },
            { code: "516", name: "Geometry", myanmarName: "ဂျီဩမေတြီ" }
          ]
        },
        {
          code: "530",
          name: "Physics",
          myanmarName: "ရူပဗေဒပညာရပ်",
          details: "စွမ်းအင်၊ အလင်း၊ အသံ၊ လျှပ်စစ်၊ သံလိုက်နှင့် အက်တမ်ဆိုင်ရာရူပဗေဒ။",
          leaves: [
            { code: "535", name: "Light & Optics", myanmarName: "အလင်းနှင့် အလင်းဆိုင်ရာရူပဗေဒ" },
            { code: "537", name: "Electricity & Electronics", myanmarName: "လျှပ်စစ်နှင့် အီလက်ထရွန်နစ်သဘောတရား" }
          ]
        },
        {
          code: "540",
          name: "Chemistry",
          myanmarName: "ဓာတုဗေဒပညာရပ်",
          details: "အော်ဂဲနစ်ဓာတုဗေဒ၊ အင်အော်ဂဲနစ်ဓာတုဗေဒနှင့် ဓာတ်ခွဲခန်းနည်းလမ်းများ။"
        },
        {
          code: "580",
          name: "Plants (Botany)",
          myanmarName: "ရုက္ခဗေဒပညာ (အပင်များအကြောင်း)",
          details: "အပင်တည်ဆောက်ပုံ၊ မျိုးခွဲခြားခြင်းနှင့် သဘာဝပတ်ဝန်းကျင်အပင်များ။"
        }
      ]
    },
    "600": {
      code: "600",
      name: "Technology (Applied Sciences)",
      myanmarName: "နည်းပညာနှင့် အသုံးချသိပ္ပံပညာရပ်များ",
      description: "ဆေးပညာ၊ စိုက်ပျိုးရေး၊ အင်ဂျင်နီယာနှင့် စီးပွားရေးလုပ်ငန်းသုံး ထုတ်လုပ်မှုဆိုင်ရာ လက်တွေ့အသုံးချပညာရပ်များ ဖြစ်သည်။",
      subClasses: [
        {
          code: "610",
          name: "Medicine & Health",
          myanmarName: "ဆေးပညာရပ်နှင့် လူထုကျန်းမာရေး",
          details: "လူ့ခန္ဓာဗေဒ၊ ရောဂါများရှာဖွေကုသခြင်း၊ သူနာပြုအတတ်ပညာနှင့် ဆေးဝါးဗေဒ။",
          leaves: [
            { code: "611", name: "Human Anatomy", myanmarName: "ခန္ဓာဗေဒပညာရပ်" },
            { code: "615", name: "Pharmacology & Therapeutics", myanmarName: "ဆေးဝါးဗေဒနှင့် ကုသရေးနည်းလမ်းများ" },
            { code: "616", name: "Diseases", myanmarName: "ရောဂါဗေဒဆိုင်ရာ စာပေများ" }
          ]
        },
        {
          code: "620",
          name: "Engineering & Allied Operations",
          myanmarName: "အင်ဂျင်နီယာအတတ်ပညာနှင့် လုပ်ငန်းခွင်များ",
          details: "မြို့ပြ၊ လျှပ်စစ်၊ စက်မှုနှင့် အီလက်ထရွန်နစ်အင်ဂျင်နီယာပညာရပ်များ။",
          leaves: [
            { code: "621.381", name: "Electronics", myanmarName: "အီလက်ထရွန်နစ် နည်းပညာရပ်" },
            { code: "624", name: "Civil Engineering", myanmarName: "မြို့ပြ အင်ဂျင်နီယာအတတ်ပညာ" }
          ]
        },
        {
          code: "630",
          name: "Agriculture & Related Technologies",
          myanmarName: "စိုက်ပျိုးရေးပညာနှင့် နည်းပညာများ",
          details: "သီးနှံစိုက်ပျိုးခြင်း၊ မြေဩဇာသုံးစွဲခြင်း၊ မွေးမြူရေးနှင့် သစ်တောလုပ်ငန်း။",
          leaves: [
            { code: "631.5", name: "Cultivation & Harvesting", myanmarName: "သီးနှံစိုက်ပျိုးထုတ်လုပ်မှုနည်းလမ်းများ" },
            { code: "633.18", name: "Rice Cultivation", myanmarName: "စပါးစိုက်ပျိုးရေးပညာရပ် (မြန်မာနိုင်ငံအဓိက)" }
          ]
        }
      ]
    },
    "900": {
      code: "900",
      name: "History & Geography",
      myanmarName: "သမိုင်းနှင့် ပထဝီဝင်ပညာရပ်များ",
      description: "ကမ္ဘာ့နိုင်ငံအသီးသီး၏ သမိုင်းကြောင်း၊ ခရီးသွားမှတ်တမ်းများ၊ ပထဝီဝင်မြေပုံများနှင့် အတ္ထုပ္ပတ္တိများ ပါဝင်သည်။",
      subClasses: [
        {
          code: "910",
          name: "Geography & Travel",
          myanmarName: "ပထဝီဝင်မြေပုံနှင့် ခရီးသွားစာပေ",
          details: "ကမ္ဘာလှည့်ခရီးသွားမှတ်တမ်းများ၊ မြေပုံဒီဇိုင်းနှင့် ပထဝီဝင်သုတေသနများ။",
          leaves: [
            { code: "915.91", name: "Geography & Travel in Myanmar", myanmarName: "မြန်မာနိုင်ငံ ပထဝီဝင်နှင့် ခရီးသွားလမ်းညွှန်" }
          ]
        },
        {
          code: "920",
          name: "Biography, Genealogy, Insignia",
          myanmarName: "အတ္ထုပ္ပတ္တိများ၊ မိသားစုမျိုးရိုးစဉ်ဆက်များ",
          details: "ထင်ရှားကျော်ကြားသော ပုဂ္ဂိုလ်များ၏ ဘဝသမိုင်းမှတ်တမ်းများ။"
        },
        {
          code: "950",
          name: "History of Asia & Orient",
          myanmarName: "အာရှနိုင်ငံများ၏ သမိုင်းကြောင်း",
          details: "အရှေ့တောင်အာရှနှင့် အရှေ့အာရှနိုင်ငံများ၏ ခေတ်အဆက်ဆက်သမိုင်း။",
          leaves: [
            { code: "959", name: "History of Southeast Asia", myanmarName: "အရှေ့တောင်အာရှ သမိုင်း" },
            { code: "959.1", name: "History of Myanmar", myanmarName: "မြန်မာနိုင်ငံ သမိုင်း (အလွန်အရေးကြီးသော ခေါင်းစဉ်)" },
            { code: "959.105", name: "Myanmar Democratic Era History", myanmarName: "မြန်မာ့သမိုင်း (ဒီမိုကရေစီခေတ်ပြောင်းကာလ)" }
          ]
        }
      ]
    }
  };

  // DDC Tables 1 to 6 complete database
  const ddcTablesDatabase: DdcTable[] = [
    {
      id: "t1",
      name: "Table 1: Standard Subdivisions",
      myanmarName: "ဇယား ၁: အထွေထွေ အဆင့်ဆင့်ခွဲခြားမှုပုံစံများ (Standard Subdivisions)",
      description: "စာအုပ်တစ်အုပ်၏ တင်ပြပုံပုံစံ (အဘိဓာန်၊ စွယ်စုံကျမ်း၊ သမိုင်း၊ စာရင်းဇယား) တို့ကို ညွှန်းဆိုရန် အခြေခံကုဒ်နောက်ကွယ်တွင် အမြဲတွဲဖက်သုံးနိုင်သော ဇယားဖြစ်သည်။",
      codes: [
        { code: "-01", meaning: "Philosophy & Theory", myanmarName: "ဒဿနိကဗေဒနှင့် သီအိုရီအယူဝါဒများ", example: "510.1 (Mathematics Theory = 510 + -01)" },
        { code: "-02", meaning: "Miscellany / Handbooks / Outlines", myanmarName: "အထွေထွေလက်စွဲ၊ အနှစ်ချုပ်နှင့် ပုံစံခွက်များ", example: "025.302 (Cataloging Handbook = 025.3 + -02)" },
        { code: "-03", meaning: "Dictionaries & Encyclopedias", myanmarName: "အဘိဓာန်များနှင့် စွယ်စုံကျမ်းများ", example: "610.3 (Medical Dictionary = 610 + -03)" },
        { code: "-05", meaning: "Serial Publications (Journals, Periodicals)", myanmarName: "ဂျာနယ်၊ မဂ္ဂဇင်းနှင့် အချိန်မှန်ထုတ်ဝေသော စာစောင်များ", example: "505 (Pure Science Journal = 500 + -05)" },
        { code: "-07", meaning: "Education, Research, Related Topics", myanmarName: "ပညာရေး၊ သုတေသနပြုမှုနှင့် သင်ကြားသင်ယူရေး", example: "630.7 (Agricultural Education = 630 + -07)" },
        { code: "-09", meaning: "Historical, Geographic, Persons Treatment", myanmarName: "သမိုင်းကြောင်း၊ ဒေသဆိုင်ရာ ဆက်စပ်တင်ပြမှု", example: "370.9 (History of Education = 370 + -09)" }
      ]
    },
    {
      id: "t2",
      name: "Table 2: Geographic Areas & Historical Periods",
      myanmarName: "ဇယား ၂: ပထဝီဝင်ဒေသများနှင့် သမိုင်းဝင်ကာလများ (Geographic Areas)",
      description: "အကြောင်းအရာတစ်ခုကို တိကျသော ကမ္ဘာ့နိုင်ငံများ၊ တိုက်ကြီးများ သို့မဟုတ် မြို့ပြဒေသများနှင့် ဆက်စပ်ညွှန်းဆိုလိုသည့်အခါ ပေါင်းစပ်ရမည့် ဇယားဖြစ်သည်။",
      codes: [
        { code: "-4", meaning: "Europe", myanmarName: "ဥရောပတိုက်နှင့် နိုင်ငံများ" },
        { code: "-5", meaning: "Asia", myanmarName: "အာရှတိုက်တစ်ခုလုံး" },
        { code: "-59", meaning: "Southeast Asia", myanmarName: "အရှေ့တောင်အာရှ ဒေသကြီး" },
        { code: "-591", meaning: "Myanmar", myanmarName: "မြန်မာနိုင်ငံ (စာကြည့်တိုက်တိုင်းအတွက် မရှိမဖြစ် ကုဒ်)", example: "370.9591 (Education in Myanmar = 370 + -09 + -591)" },
        { code: "-7", meaning: "North America", myanmarName: "မြောက်အမေရိကတိုက်" },
        { code: "-73", meaning: "United States", myanmarName: "အမေရိကန်ပြည်ထောင်စု" },
        { code: "-9", meaning: "Other Regions (Pacific, Australia, etc.)", myanmarName: "အခြားသောဒေသများ (အိုရှန်းနီးယား၊ ပစိဖိတ်ဒေသ)" }
      ]
    },
    {
      id: "t3",
      name: "Table 3: Subdivisions for Individual Literatures",
      myanmarName: "ဇယား ၃: စာပေလက်ရာခွဲခြားမှုပုံစံများ (Subdivisions for Literatures)",
      description: "စာပေအနုပညာ (800 Class) တွင် ဝတ္ထုတို၊ ကဗျာ၊ ပြဇာတ်၊ စာစီစာကုံး စသည့် စာပေပုံစံ (Forms) များကို ခွဲခြားသတ်မှတ်ရန် သုံးသည်။",
      codes: [
        { code: "-1", meaning: "Poetry", myanmarName: "ကဗျာလက်ရာများ", example: "821 (English Poetry = 820 + -1)" },
        { code: "-2", meaning: "Drama", myanmarName: "ပြဇာတ်လက်ရာများ", example: "822 (English Drama = 820 + -2)" },
        { code: "-3", meaning: "Fiction / Novels", myanmarName: "ဝတ္ထုရှည်၊ ဝတ္ထုတိုနှင့် ပုံပြင်များ", example: "823 (English Fiction = 820 + -3)" },
        { code: "-8", meaning: "Miscellaneous Writings", myanmarName: "အထွေထွေစာစုစာကုံးနှင့် စာပေအစုံအလင်", example: "828 (English Miscellaneous)" }
      ]
    },
    {
      id: "t4",
      name: "Table 4: Subdivisions of Individual Languages",
      myanmarName: "ဇယား ၄: ဘာသာစကားအင်္ဂါရပ်ဆိုင်ရာ ခွဲခြားမှုများ (Individual Languages)",
      description: "ဘာသာစကားသင်ကြားရေး (400 Class) တွင် သဒ္ဒါ၊ စကားလုံးပေါင်းစပ်ပုံ၊ အဘိဓာန်နှင့် အသံထွက်များကို ခွဲခြားရန် အသုံးပြုသည်။",
      codes: [
        { code: "-1", meaning: "Writing system, Phonology, Phonetics", myanmarName: "စာလုံးပေါင်းစနစ်၊ အသံထွက်ဗေဒနှင့် အက္ခရာစဉ်ပုံစံ", example: "421 (English Writing/Pronunciation = 420 + -1)" },
        { code: "-3", meaning: "Dictionaries of the standard language", myanmarName: "ဘာသာစကားအဘိဓာန်များ", example: "423 (English Dictionary = 420 + -3)" },
        { code: "-5", meaning: "Grammar & Syntax", myanmarName: "သဒ္ဒါစနစ်နှင့် ဝါကျဖွဲ့ထုံးများ", example: "425 (English Grammar = 420 + -5)" }
      ]
    },
    {
      id: "t5",
      name: "Table 5: Ethnic & National Groups",
      myanmarName: "ဇယား ၅: တိုင်းရင်းသားလူမျိုးစုများနှင့် အမျိုးသားရေးအုပ်စုများ (Ethnic Groups)",
      description: "တိကျသော လူမျိုးစုများ၊ ကရင်၊ ကချင်၊ မွန်၊ ဗမာ သို့မဟုတ် ကမ္ဘာ့တိုင်းရင်းသား လူမျိုးစုများကို အခြေခံဘာသာရပ်တွင် ပေါင်းစပ်လိုလျှင် သုံးသည်။",
      codes: [
        { code: "-914", meaning: "Indo-Aryans", myanmarName: "အင်ဒို-အာရီယန် လူမျိုးစုများ" },
        { code: "-95", meaning: "Sino-Tibetan and East Asian peoples", myanmarName: "တရုတ်-တိဗက်နှင့် အရှေ့အာရှနွယ်ဖွား လူမျိုးစုများ" },
        { code: "-958", meaning: "Burmese / Myanmar ethnic groups", myanmarName: "မြန်မာတိုင်းရင်းသား လူမျိုးစုများ (ဗမာ၊ ရှမ်း၊ ကရင် စသည်)", example: "301.451958 (Sociology of Burmese people)" }
      ]
    },
    {
      id: "t6",
      name: "Table 6: Languages",
      myanmarName: "ဇယား ၆: ကမ္ဘာ့ဘာသာစကားများ (Languages)",
      description: "သမ္မာကျမ်းစာ ဘာသာပြန်ခြင်း၊ ဘာသာစကားအလိုက် စာအုပ်ညွှန်းပြသခြင်းတို့တွင် ဘာသာစကားကုဒ်များကို တိုက်ရိုက်သတ်မှတ်ရန် သုံးသည်။",
      codes: [
        { code: "-11", meaning: "English language", myanmarName: "အင်္ဂလိပ်ဘာသာစကား" },
        { code: "-95", meaning: "Asiatic languages", myanmarName: "အာရှဒေသ ဘာသာစကားများ" },
        { code: "-958", meaning: "Burmese / Myanmar language", myanmarName: "မြန်မာဘာသာစကား (ဗမာစာ)" }
      ]
    }
  ];

  // Interactive Code Builder Simulator Data
  const builderBases = [
    { code: "020", name: "Library & Info Science (စာကြည့်တိုက်ပညာ)", category: "000" },
    { code: "294.3", name: "Buddhism (ဗုဒ္ဓဘာသာ)", category: "200" },
    { code: "370", name: "Education (ပညာရေး)", category: "300" },
    { code: "510", name: "Mathematics (သင်္ချာပညာ)", category: "500" },
    { code: "610", name: "Medicine & Health (ဆေးပညာရပ်)", category: "600" },
    { code: "630", name: "Agriculture (စိုက်ပျိုးရေးပညာ)", category: "600" },
    { code: "959.1", name: "History of Myanmar (မြန်မာ့သမိုင်း)", category: "900" }
  ];

  const handleBuildCombination = (base: string, tableId: string, codeVal: string) => {
    setBuilderBaseCode(base);
    setBuilderTable(tableId);
    setBuilderTableCode(codeVal);

    // Dynamic Result Calculation Logic
    let finalCode = base;
    let tableLabel = ddcTablesDatabase.find(t => t.id === tableId)?.name || "";
    let baseLabel = builderBases.find(b => b.code === base)?.name || "";
    let codeMeaning = "";
    let steps: string[] = [];

    steps.push(`၁။ အခြေခံ DDC ဘာသာရပ်ကုဒ်: ${base} (${baseLabel})`);

    if (tableId === "t1") {
      // Standard Subdivisions can usually be appended directly, ensuring decimal placement
      const rawCode = base + codeVal.replace("-", "");
      finalCode = formatDdcDecimal(rawCode);
      const codeMeanText = ddcTablesDatabase.find(t => t.id === "t1")?.codes.find(c => c.code === codeVal)?.meaning || "";
      const codeMyaText = ddcTablesDatabase.find(t => t.id === "t1")?.codes.find(c => c.code === codeVal)?.myanmarMeaning || ddcTablesDatabase.find(t => t.id === "t1")?.codes.find(c => c.code === codeVal)?.myanmarName || "";
      codeMeaning = `${codeMyaText} ဆိုင်ရာ ${baseLabel} စာပေ`;
      steps.push(`၂။ ${tableLabel} မှ ${codeVal} (${codeMeanText}) ကို တိုက်ရိုက် ပေါင်းစပ်သည်၊၊`);
      steps.push(`၃။ DDC စနစ်စည်းကမ်းအရ ဂဏန်း ၃ လုံးနောက်တွင် ဒသမသတ်မှတ်သည်: ${finalCode}`);
    } else if (tableId === "t2") {
      // Area Subdivisions usually require -09 as standard subdivision placeholder if base doesn't support direct area
      let use09 = true;
      if (base === "959.1" || base === "294.3" || base === "915.91") {
        use09 = false; // direct area or already has area
      }

      const areaMean = ddcTablesDatabase.find(t => t.id === "t2")?.codes.find(c => c.code === codeVal)?.meaning || "";
      const areaMya = ddcTablesDatabase.find(t => t.id === "t2")?.codes.find(c => c.code === codeVal)?.myanmarMeaning || ddcTablesDatabase.find(t => t.id === "t2")?.codes.find(c => c.code === codeVal)?.myanmarName || "";

      if (use09) {
        const rawCode = base + "09" + codeVal.replace("-", "");
        finalCode = formatDdcDecimal(rawCode);
        codeMeaning = `${areaMya} ရှိ ${baseLabel} ဆိုင်ရာလေ့လာချက်စာပေ`;
        steps.push(`၂။ ပထဝီဝင်ဒေသဆိုင်ရာဇယားကို ချိတ်ဆက်ရန် Table 1 ၏ -09 (Geographical Treatment) ကို ကြားခံအဖြစ် အသုံးပြုသည်၊၊`);
        steps.push(`၃။ Table 2 မှ နိုင်ငံကုဒ် ${codeVal} (${areaMean}) ကို ထပ်မံပေါင်းစပ်သည်၊၊`);
        steps.push(`၄။ ဂဏန်းများကို ပေါင်းစည်းပြီး ဒသမသတ်မှတ်သည်: ${finalCode}`);
      } else {
        const rawCode = base + codeVal.replace("-", "");
        finalCode = formatDdcDecimal(rawCode);
        codeMeaning = `${areaMya} ၏ ${baseLabel} စာပေစု`;
        steps.push(`၂။ အခြေခံနံပါတ် (${base}) သည် ပထဝီဝင်ဒေသနှင့် တိုက်ရိုက်တွဲဖက်ရန် ခွင့်ပြုထားသဖြင့် ကြားခံ -09 မလိုဘဲ Table 2 ၏ ${codeVal} (${areaMean}) ကို တိုက်ရိုက်ပေါင်းစပ်သည်၊၊`);
        steps.push(`၃။ ပေါင်းစပ်ဖွဲ့စည်းမှု ရလဒ်: ${finalCode}`);
      }
    } else if (tableId === "t3") {
      // Literatures
      const rawCode = base + codeVal.replace("-", "");
      finalCode = formatDdcDecimal(rawCode);
      const litMean = ddcTablesDatabase.find(t => t.id === "t3")?.codes.find(c => c.code === codeVal)?.meaning || "";
      const litMya = ddcTablesDatabase.find(t => t.id === "t3")?.codes.find(c => c.code === codeVal)?.myanmarMeaning || ddcTablesDatabase.find(t => t.id === "t3")?.codes.find(c => c.code === codeVal)?.myanmarName || "";
      codeMeaning = `${baseLabel} ၏ ${litMya} လက်ရာစာအုပ်များ`;
      steps.push(`၂။ Table 3 မှ စာပေပုံစံသတ်မှတ်ချက် ${codeVal} (${litMean}) ကို ပေါင်းစပ်သည်၊၊`);
      steps.push(`၃။ ဂဏန်းပေါင်းစပ်ပြီး ဒသမသတ်မှတ်ပုံ: ${finalCode}`);
    } else if (tableId === "t4") {
      // Languages
      const rawCode = base + codeVal.replace("-", "");
      finalCode = formatDdcDecimal(rawCode);
      const langMean = ddcTablesDatabase.find(t => t.id === "t4")?.codes.find(c => c.code === codeVal)?.meaning || "";
      const langMya = ddcTablesDatabase.find(t => t.id === "t4")?.codes.find(c => c.code === codeVal)?.myanmarMeaning || ddcTablesDatabase.find(t => t.id === "t4")?.codes.find(c => c.code === codeVal)?.myanmarName || "";
      codeMeaning = `${baseLabel} ဆိုင်ရာ ${langMya} စာအုပ်`;
      steps.push(`၂။ Table 4 မှ ဘာသာစကားလေ့လာမှုပုံစံ ${codeVal} (${langMean}) ကို ပေါင်းစပ်သည်၊၊`);
      steps.push(`၃။ စုစုပေါင်းပေါင်းစပ်နံပါတ်: ${finalCode}`);
    } else {
      const rawCode = base + codeVal.replace("-", "");
      finalCode = formatDdcDecimal(rawCode);
      codeMeaning = `သီးခြားအုပ်စုဆိုင်ရာ ${baseLabel} စာအုပ်`;
      steps.push(`၂။ ဇယားမှ တိကျသောကုဒ် ${codeVal} ကို သတ်မှတ်ပေါင်းစပ်သည်၊၊`);
      steps.push(`၃။ ရလဒ်နံပါတ်: ${finalCode}`);
    }

    setBuiltResult({
      code: finalCode,
      meaning: codeMeaning,
      steps: steps
    });
  };

  const formatDdcDecimal = (raw: string): string => {
    // Standard DDC format puts a decimal point after the first three digits.
    // e.g. 61009591 -> 610.09591
    const cleaned = raw.replace(/\D/g, "");
    if (cleaned.length <= 3) return cleaned;
    return cleaned.slice(0, 3) + "." + cleaned.slice(3);
  };

  // Practice Exercises Database
  const practiceQuizzes = {
    ddc: [
      {
        question: "စိုက်ပျိုးရေးပညာရပ် (Agriculture - 630) တွင် ဂျာနယ်/မဂ္ဂဇင်း (Serial Publications - Table 1's -05) ကို ပေါင်းစပ်မည်ဆိုပါက မည်သည့် DDC နံပါတ်ရရှိမည်နည်း။",
        options: ["630.05", "630.5", "630.005", "635"],
        correctIdx: 1,
        explanation: "630 (Agriculture) သည် နောက်ဆုံး သုည (0) ကို ဖြုတ်ပြီး Table 1 ၏ -05 နှင့် ပေါင်းစပ်ကာ 630.5 (Agriculture Periodicals) ဖြစ်လာသည်။ DDC စည်းကမ်းအရ Base နံပါတ်၏ သုညများကို ဒသမအောက်တွင် ချုံ့လေ့ရှိသည်။"
      },
      {
        question: "မြန်မာနိုင်ငံ (Myanmar - Table 2's -591) ဆိုင်ရာ ဆေးပညာရပ် (Medicine - 610) စာအုပ်တစ်အုပ်ကို ကတ်တလောက်သွင်းရန် ဒေသဆိုင်ရာကုဒ်ပေါင်းစပ်ပုံမှာ မည်သည့်အရာဖြစ်မည်နည်း။",
        options: ["610.591", "610.09591", "610.9591", "610.94"],
        correctIdx: 2,
        explanation: "610 (Medicine) နှင့် Table 2 ကို ပေါင်းရန် ကြားခံ Standard Subdivision -09 (Historical and Geographical) ကို အသုံးပြုပြီး 610.9591 ဖြစ်လာသည်။"
      },
      {
        question: "ဗုဒ္ဓဘာသာ (Buddhism) ၏ DDC အခြေခံနံပါတ်မှာ မည်သည့်အရာ ဖြစ်သနည်း။",
        options: ["200", "220", "294.3", "297"],
        correctIdx: 2,
        explanation: "200 သည် ဘာသာရေး (Religion) အတန်းကြီးဖြစ်ပြီး 294.3 သည် သီးခြားဗုဒ္ဓဘာသာ (Buddhism) ဆိုင်ရာ အခြေခံနံပါတ်ဖြစ်သည်။"
      },
      {
        question: "သင်္ချာသီအိုရီ (Mathematics Theory) အတွက် 510 (Mathematics) နှင့် Table 1 ၏ -01 (Philosophy & Theory) ကို ပေါင်းစပ်ပါက မည်သည့်နံပါတ် ရမည်နည်း။",
        options: ["510.01", "510.1", "511", "510.11"],
        correctIdx: 1,
        explanation: "510 (Mathematics) နှင့် Table 1 ၏ -01 ကို ပေါင်းစပ်ရာတွင် သုညကို ချုံ့ပြီး 510.1 ဖြစ်လာသည်။"
      }
    ],
    sears: [
      {
        question: "Sears List principles အရ ပေါင်းစပ်ခေါင်းစဉ်များတွင် သီးခြားဒေသကို ဖော်ပြလိုပါက မည်သည့် ပုံစံဖြင့် ရေးဆွဲရမည်နည်း။",
        options: ["Myanmar Libraries", "Libraries in Myanmar", "Libraries -- Myanmar", "Libraries/Myanmar"],
        correctIdx: 2,
        explanation: "Sears List တွင် ဒေသဆိုင်ရာခွဲခြားမှုများ (Geographic subdivisions) ကို '--' (double dash) ခြား၍ ဖော်ပြရပါသည် (ဥပမာ- Libraries -- Myanmar)။"
      },
      {
        question: "Sears List database တွင် အသုံးမပြုရမည့် ခေါင်းစဉ် (ခေါင်းစဉ်အမှား) ကို အသုံးပြုရမည့် ခေါင်းစဉ်အမှန်သို့ လမ်းညွှန်ညွှန်းဆိုပြသသော သင်္ကေတမှာ မည်သည့်အရာနည်း။",
        options: ["UF (Use For)", "SA (See Also)", "RT (Related Term)", "USE"],
        correctIdx: 3,
        explanation: "USE ညွှန်းဆိုချက်သည် အသုံးမပြုသောစကားလုံးမှ တရားဝင်သတ်မှတ်ထားသော Subject Heading သို့ တိုက်ရိုက်လမ်းညွှန်ပေးသည့် သင်္ကေတဖြစ်သည်။ (ဥပမာ- Book collections USE Libraries)"
      },
      {
        question: "Sears Heading: 'Library science -- Study and teaching -- Myanmar' သည် မည်သည့်အရာကို ဆိုလိုသနည်း။",
        options: ["မြန်မာနိုင်ငံရှိ စာကြည့်တိုက်များအကြောင်း", "မြန်မာနိုင်ငံရှိ စာကြည့်တိုက်ပညာသင်ကြားရေးဆိုင်ရာစာပေ", "မြန်မာနိုင်ငံ စာရေးဆရာများ သမိုင်း", "စာကြည့်တိုက်အလိုအလျောက်စနစ်"],
        correctIdx: 1,
        explanation: "ဤခေါင်းစဉ်သည် စာကြည့်တိုက်ပညာ (Library science) ကို သင်ကြားသင်ယူခြင်း (Study and teaching) မြန်မာနိုင်ငံရှိ (Myanmar) အခြေအနေကို ဆိုလိုခြင်းဖြစ်သည်။"
      }
    ]
  };

  const handleAnswerSubmit = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);
    const activeQuestions = practiceQuizzes[quizType];
    if (idx === activeQuestions[currentQuizIdx].correctIdx) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    const activeQuestions = practiceQuizzes[quizType];
    if (currentQuizIdx < activeQuestions.length - 1) {
      setCurrentQuizIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowScoreModal(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIdx(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowScoreModal(false);
  };

  const filteredSears = searsDatabase.filter(item => 
    item.heading.toLowerCase().includes(searsSearch.toLowerCase()) ||
    item.myanmarName.includes(searsSearch) ||
    item.category.toLowerCase().includes(searsSearch.toLowerCase())
  );

  const filteredTableCodes = ddcTablesDatabase.find(t => t.id === selectedTableId)?.codes.filter(c => 
    c.code.includes(tableSearch) ||
    c.meaning.toLowerCase().includes(tableSearch.toLowerCase()) ||
    c.myanmarMeaning.includes(tableSearch)
  ) || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-20">
      {/* Upper Navigation/Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            id="back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400 bg-pink-500/10 px-2.5 py-0.5 rounded-full border border-pink-500/20 shadow-[0_0_10px_rgba(236,72,153,0.15)]">
                Knowledge Treasury
              </span>
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            </div>
            <h1 className="text-xl font-black text-white mt-0.5">DDC & Sears List Academy</h1>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800">
          <button 
            onClick={() => setActiveTab("ddc_classes")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "ddc_classes" ? "bg-pink-500 text-white shadow-lg shadow-pink-500/20" : "text-slate-400 hover:text-white"
            }`}
          >
            DDC Main Classes
          </button>
          <button 
            onClick={() => setActiveTab("ddc_tables")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "ddc_tables" ? "bg-pink-500 text-white shadow-lg shadow-pink-500/20" : "text-slate-400 hover:text-white"
            }`}
          >
            DDC Tables (1-6)
          </button>
          <button 
            onClick={() => setActiveTab("sears")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "sears" ? "bg-pink-500 text-white shadow-lg shadow-pink-500/20" : "text-slate-400 hover:text-white"
            }`}
          >
            Sears List
          </button>
          <button 
            onClick={() => setActiveTab("builder")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "builder" ? "bg-pink-500 text-white shadow-lg shadow-pink-500/20" : "text-slate-400 hover:text-white"
            }`}
          >
            Interactive Builder
          </button>
          <button 
            onClick={() => setActiveTab("practice")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "practice" ? "bg-pink-500 text-white shadow-lg shadow-pink-500/20" : "text-slate-400 hover:text-white"
            }`}
          >
            Exercises
          </button>
        </div>
      </header>

      {/* Mobile Sub-Navigation */}
      <div className="flex md:hidden overflow-x-auto gap-2 p-4 bg-slate-900 border-b border-slate-800 no-scrollbar">
        <button 
          onClick={() => setActiveTab("ddc_classes")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
            activeTab === "ddc_classes" ? "bg-pink-500 text-white" : "bg-slate-800 text-slate-300"
          }`}
        >
          DDC Main Classes
        </button>
        <button 
          onClick={() => setActiveTab("ddc_tables")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
            activeTab === "ddc_tables" ? "bg-pink-500 text-white" : "bg-slate-800 text-slate-300"
          }`}
        >
          DDC Tables (1-6)
        </button>
        <button 
          onClick={() => setActiveTab("sears")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
            activeTab === "sears" ? "bg-pink-500 text-white" : "bg-slate-800 text-slate-300"
          }`}
        >
          Sears List
        </button>
        <button 
          onClick={() => setActiveTab("builder")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
            activeTab === "builder" ? "bg-pink-500 text-white" : "bg-slate-800 text-slate-300"
          }`}
        >
          Interactive Builder
        </button>
        <button 
          onClick={() => setActiveTab("practice")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
            activeTab === "practice" ? "bg-pink-500 text-white" : "bg-slate-800 text-slate-300"
          }`}
        >
          Exercises
        </button>
      </div>

      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 py-6 flex-1">
        
        {/* TAB 1: DDC MAIN CLASSES (Hierarchical step-by-step click-to-expand structure) */}
        {activeTab === "ddc_classes" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar with 6 main classes selection */}
            <div className="lg:col-span-4 space-y-3">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                <h3 className="text-sm font-black text-white mb-2 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-pink-400" />
                  <span>DDC Main Classes (အဓိကအတန်းကြီးများ)</span>
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  မြန်မာနိုင်ငံ စာကြည့်တိုက်များတွင် အဓိက သုံးစွဲလေ့ရှိပြီး စာမေးပွဲနှင့် လက်တွေ့တွင် မရှိမဖြစ်လိုအပ်သော အတန်းကြီး ၆ ခုကို အသေးစိတ် ခွဲခြမ်းပြထားခြင်း။
                </p>
              </div>

              <div className="space-y-2">
                {Object.values(ddcClassesDatabase).map((cls) => (
                  <button
                    key={cls.code}
                    onClick={() => {
                      setSelectedMainClass(cls.code);
                      setClassSearch("");
                    }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                      selectedMainClass === cls.code 
                        ? "bg-slate-900 border-pink-500/40 text-white shadow-md shadow-pink-500/5" 
                        : "bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-900/80 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-pink-400 font-mono bg-pink-500/10 px-2 py-0.5 rounded">
                          {cls.code} Class
                        </span>
                        <span className="text-xs font-black">{cls.name.split(",")[0]}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{cls.myanmarName}</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-slate-500 transition-all ${selectedMainClass === cls.code ? "rotate-90 text-pink-400" : ""}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* In-depth details and nested branch expansion */}
            <div className="lg:col-span-8 space-y-6">
              {(() => {
                const activeClass = ddcClassesDatabase[selectedMainClass];
                if (!activeClass) return null;
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-6"
                  >
                    <div className="border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2.5 py-1 rounded-xl">
                          DDC Class {activeClass.code}
                        </span>
                        <h2 className="text-lg font-black text-white">{activeClass.name}</h2>
                      </div>
                      <p className="text-xs text-pink-300 font-black mt-2">{activeClass.myanmarName}</p>
                      <p className="text-xs text-slate-300 mt-3 leading-relaxed bg-slate-950/50 p-3 rounded-2xl border border-slate-800/80">
                        {activeClass.description}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-slate-200 flex items-center gap-2">
                        <Compass className="w-4 h-4 text-pink-400" />
                        <span>အဆင့်ဆင့်ပွားလာသော မျိုးကွဲကုဒ်များ (Click to view levels)</span>
                      </h3>

                      <div className="space-y-3">
                        {activeClass.subClasses.map((sub) => (
                          <div 
                            key={sub.code} 
                            className="bg-slate-950 rounded-2xl border border-slate-800 p-4 hover:border-slate-700 transition-all"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-mono text-xs font-black text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-lg">
                                  {sub.code}
                                </span>
                                <h4 className="text-sm font-black text-white inline-block ml-2">{sub.name}</h4>
                                <p className="text-[11px] text-pink-300 font-bold mt-1">{sub.myanmarName}</p>
                                <p className="text-xs text-slate-400 mt-1">{sub.details}</p>
                              </div>
                            </div>

                            {/* Sub-level leaves (hierarchical steps) */}
                            {sub.leaves && sub.leaves.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-slate-800/60 pl-4 space-y-2.5">
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
                                  အတန်းခွဲ အသေးစိတ်များ (Further Subdivisions)
                                </span>
                                {sub.leaves.map((leaf) => (
                                  <div 
                                    key={leaf.code}
                                    className="flex items-center gap-2 text-xs bg-slate-900/60 hover:bg-slate-900 p-2 rounded-xl border border-slate-800 transition-all cursor-pointer"
                                  >
                                    <span className="font-mono font-black text-pink-400 text-[11px] bg-pink-500/10 px-2 py-0.5 rounded">
                                      {leaf.code}
                                    </span>
                                    <div>
                                      <span className="font-bold text-slate-200">{leaf.name}</span>
                                      <span className="text-[10px] text-slate-400 block mt-0.5">{leaf.myanmarName}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })()}
            </div>
          </div>
        )}

        {/* TAB 2: DDC TABLES (1 to 6 complete codes) */}
        {activeTab === "ddc_tables" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar with Table Tabs */}
            <div className="lg:col-span-4 space-y-3">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                <h3 className="text-sm font-black text-white mb-2 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-pink-400" />
                  <span>DDC Auxiliary Tables</span>
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  DDC တွင် အကြောင်းအရာတစ်ခုကို နိုင်ငံ၊ ဘာသာစကား၊ စာပေပုံစံ၊ သို့မဟုတ် လူမျိုးစုများနှင့် ပေါင်းစပ်ရန် သုံးသည့် အကူဇယားကြီး ၆ ခု။
                </p>
              </div>

              <div className="space-y-2">
                {ddcTablesDatabase.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setSelectedTableId(tab.id);
                      setTableSearch("");
                    }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                      selectedTableId === tab.id 
                        ? "bg-slate-900 border-pink-500/40 text-white shadow-md shadow-pink-500/5" 
                        : "bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-900/80 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <span className="text-xs font-black block">{tab.name.split(":")[0]}</span>
                      <p className="text-[10px] text-slate-400 mt-1">{tab.myanmarName.split(" (")[0]}</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-slate-500 transition-all ${selectedTableId === tab.id ? "rotate-90 text-pink-400" : ""}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Table Codes Master Repository */}
            <div className="lg:col-span-8 space-y-6">
              {(() => {
                const activeTable = ddcTablesDatabase.find(t => t.id === selectedTableId);
                if (!activeTable) return null;
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-6"
                  >
                    <div>
                      <h2 className="text-lg font-black text-white">{activeTable.name}</h2>
                      <p className="text-xs text-pink-400 font-bold mt-1">{activeTable.myanmarName}</p>
                      <p className="text-xs text-slate-300 mt-3 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                        {activeTable.description}
                      </p>
                    </div>

                    {/* Search codes inside table */}
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text"
                        placeholder="ဇယားကုဒ် သို့မဟုတ် အဓိပ္ပာယ် ရှာဖွေရန်..."
                        value={tableSearch}
                        onChange={(e) => setTableSearch(e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500/50 transition-all"
                      />
                    </div>

                    <div className="space-y-3">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        ကုဒ်ညွှန်းများနှင့် လက်တွေ့အသုံးချပုံများ
                      </span>

                      {filteredTableCodes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {filteredTableCodes.map((code) => (
                            <div 
                              key={code.code}
                              className="bg-slate-950 border border-slate-800/80 p-4 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all"
                            >
                              <div>
                                <span className="font-mono text-xs font-black text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded">
                                  {code.code}
                                </span>
                                <h4 className="text-xs font-black text-slate-200 mt-2">{code.meaning}</h4>
                                <p className="text-[11px] text-slate-400 mt-1">{code.myanmarMeaning}</p>
                              </div>

                              {code.example && (
                                <div className="mt-3 pt-2.5 border-t border-slate-900/60">
                                  <span className="text-[9px] text-amber-300 font-bold block">လက်တွေ့ပေါင်းစပ်ပုံ:</span>
                                  <code className="text-[10px] text-slate-300 font-mono block mt-1 bg-slate-900 p-1.5 rounded border border-slate-800">
                                    {code.example}
                                  </code>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-500 text-xs">
                          ရှာဖွေမှုနှင့် ကိုက်ညီသောကုဒ် မရှိသေးပါ၊၊
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })()}
            </div>
          </div>
        )}

        {/* TAB 3: SEARS LIST OF SUBJECT HEADINGS HANDBOOK */}
        {activeTab === "sears" && (
          <div className="space-y-6">
            <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800">
              <div className="max-w-3xl">
                <span className="text-xs font-black text-pink-400 uppercase tracking-widest bg-pink-500/10 px-2.5 py-0.5 rounded-full">
                  Subject Headings Master list
                </span>
                <h2 className="text-xl font-black text-white mt-2">Sears List of Subject Headings</h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Sears List သည် စာကြည့်တိုက်များရှိ စာအုပ်များကို ဘာသာရပ်ဆိုင်ရာ ခေါင်းစဉ်များဖြင့် စနစ်တကျ အမည်တပ်ရန် သုံးသော standard အဘိဓာန်ဖြစ်သည်။ ဤနေရာတွင် အဓိက သဘောတရားများနှင့် ခေါင်းစဉ်များကို အလွယ်တကူ ရှာဖွေလေ့လာနိုင်ပါသည်။
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850">
                  <span className="text-[10px] font-mono text-pink-400 font-bold block">RULE 1</span>
                  <h4 className="text-xs font-black text-slate-200 mt-1">Direct Specific (တိုက်ရိုက်တိကျခြင်း)</h4>
                  <p className="text-[10px] text-slate-400 mt-1">ယေဘုယျခေါင်းစဉ်အစား တိုက်ရိုက်အကျဆုံးခေါင်းစဉ်ကို ပေးရမည်။ (ဥပမာ- Birds, NOT Animals)</p>
                </div>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850">
                  <span className="text-[10px] font-mono text-pink-400 font-bold block">RULE 2</span>
                  <h4 className="text-xs font-black text-slate-200 mt-1">Consistency (တစ်သမတ်တည်းဖြစ်ခြင်း)</h4>
                  <p className="text-[10px] text-slate-400 mt-1">တူညီသောအရာများကို အမြဲတမ်း တူညီသောစကားလုံးဖြင့်သာ အသုံးပြုရမည်။</p>
                </div>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850">
                  <span className="text-[10px] font-mono text-pink-400 font-bold block">RULE 3</span>
                  <h4 className="text-xs font-black text-slate-200 mt-1">Common Usage (အသုံးအများဆုံး စကားလုံး)</h4>
                  <p className="text-[10px] text-slate-400 mt-1">လူအများစု အလွယ်တကူ ရှာဖွေနိုင်သော အသုံးများသည့်စကားလုံးများကို ဦးစားပေးရမည်။</p>
                </div>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850">
                  <span className="text-[10px] font-mono text-pink-400 font-bold block">RULE 4</span>
                  <h4 className="text-xs font-black text-slate-200 mt-1">Subdivisions (ဆင့်ပွားခွဲခြားမှုများ)</h4>
                  <p className="text-[10px] text-slate-400 mt-1">ခေါင်းစဉ်အကျယ်ကို '--' ဖြင့် ဆက်စပ်၍ ဘာသာရပ်၊ သမိုင်း၊ ဒေသခွဲခြားမှု ပြုလုပ်ရမည်။</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sear list query */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                  <span className="text-xs font-black text-white block">Sears Subject Headings Search</span>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      placeholder="ခေါင်းစဉ် သို့မဟုတ် ဘာသာရပ်အမည်ဖြင့် ရှာရန်..."
                      value={searsSearch}
                      onChange={(e) => setSearsSearch(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500/50"
                    />
                  </div>
                </div>

                <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800/60 max-h-[400px] overflow-y-auto">
                  {filteredSears.map((item) => (
                    <button
                      key={item.heading}
                      onClick={() => setSelectedSearsHeading(item)}
                      className={`w-full text-left p-4 hover:bg-slate-850 transition-all cursor-pointer flex justify-between items-center ${
                        selectedSearsHeading?.heading === item.heading ? "bg-slate-850" : ""
                      }`}
                    >
                      <div>
                        <span className="text-xs font-black text-pink-400">{item.heading}</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">{item.myanmarName} ({item.category})</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject Detail & Connection Tree */}
              <div className="lg:col-span-7">
                {selectedSearsHeading ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-6"
                  >
                    <div>
                      <span className="text-[10px] text-pink-400 font-bold bg-pink-500/10 border border-pink-500/20 px-2.5 py-0.5 rounded-full">
                        Official Sears Subject Heading
                      </span>
                      <h3 className="text-lg font-black text-white mt-2">{selectedSearsHeading.heading}</h3>
                      <p className="text-xs text-pink-300 font-bold mt-1">မြန်မာလို: {selectedSearsHeading.myanmarName}</p>
                    </div>

                    <div className="space-y-4">
                      {selectedSearsHeading.useFor && (
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                          <span className="text-[10px] text-amber-400 font-bold block">UF (Use For) - ဤစကားလုံးများအစား ဤခေါင်းစဉ်ကိုသုံးရန်</span>
                          <span className="text-xs text-slate-300 mt-1 block italic">{selectedSearsHeading.useFor}</span>
                        </div>
                      )}

                      {selectedSearsHeading.seeAlso && selectedSearsHeading.seeAlso.length > 0 && (
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block mb-1.5">SA (See Also) / RT (Related Terms) - ဆက်စပ်လေ့လာရန်</span>
                          <div className="flex flex-wrap gap-2">
                            {selectedSearsHeading.seeAlso.map((rt) => (
                              <span 
                                key={rt}
                                className="text-xs font-mono bg-slate-950 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-xl"
                              >
                                {rt}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedSearsHeading.subdivisions && selectedSearsHeading.subdivisions.length > 0 && (
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block mb-1.5">Standard Subdivisions (အဆင့်ဆင့်ပွားနိုင်သော ခေါင်းစဉ်ခွဲများ)</span>
                          <div className="space-y-2">
                            {selectedSearsHeading.subdivisions.map((sub) => (
                              <div 
                                key={sub}
                                className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-xl border border-slate-850 text-xs"
                              >
                                <span className="font-mono text-pink-400 font-bold">{sub}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-3 border-t border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold block">Example Formulation (လက်တွေ့အသုံးပြုပုံ နမူနာ)</span>
                        <code className="text-xs font-mono text-amber-300 bg-slate-950 p-3 rounded-xl border border-slate-850 block mt-1.5">
                          {selectedSearsHeading.example}
                        </code>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-8 text-center bg-slate-900 rounded-3xl border border-slate-800 text-slate-500">
                    <BookMarked className="w-12 h-12 text-slate-700 mb-4" />
                    <span className="text-xs">လေ့လာလိုသော Sears Subject Heading ကို ဘယ်ဘက်စာရင်းမှ ရွေးချယ်ပေးပါ၊၊</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INTERACTIVE DDC NUMBER BUILDER */}
        {activeTab === "builder" && (
          <div className="space-y-6">
            <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800">
              <span className="text-xs font-black text-pink-400 uppercase tracking-wider bg-pink-500/10 px-2.5 py-0.5 rounded-full">
                Interactive Simulator
              </span>
              <h2 className="text-lg font-black text-white mt-2">Interactive DDC Number Builder (အကူဇယားပေါင်းစပ်မှု သင်ယူစက်)</h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                ဤကိရိယာသည် အခြေခံ DDC ဘာသာရပ်နံပါတ်တစ်ခုအား Auxiliary Table (ဇယား ၁-၆) များနှင့် ဘယ်လိုစနစ်တကျ ပေါင်းစပ်ဖွဲ့စည်းရသလဲဆိုသည်ကို အဆင့်ဆင့် ပြသပေးမည်ဖြစ်သည်။
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Build controls */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">၁။ အခြေခံဘာသာရပ်ကို ရွေးချယ်ပါ (Select Base Code):</label>
                    <select
                      value={builderBaseCode}
                      onChange={(e) => handleBuildCombination(e.target.value, builderTable, builderTableCode)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-pink-500/50 cursor-pointer"
                    >
                      {builderBases.map((b) => (
                        <option key={b.code} value={b.code}>{b.code} - {b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">၂။ အသုံးပြုမည့် အကူဇယားကို ရွေးချယ်ပါ (Select Table):</label>
                    <div className="grid grid-cols-3 gap-2">
                      {ddcTablesDatabase.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            const firstCode = t.codes[0]?.code || "";
                            handleBuildCombination(builderBaseCode, t.id, firstCode);
                          }}
                          className={`py-2 px-1 rounded-xl text-[10px] font-bold border transition-all cursor-pointer text-center ${
                            builderTable === t.id 
                              ? "bg-pink-500 border-pink-400 text-white shadow-lg" 
                              : "bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          {t.name.split(":")[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">၃။ ဇယားမှ ကုဒ်အသေးစိတ်ကို ရွေးချယ်ပါ (Select Sub-code):</label>
                    <select
                      value={builderTableCode}
                      onChange={(e) => handleBuildCombination(builderBaseCode, builderTable, e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-pink-500/50 cursor-pointer"
                    >
                      {ddcTablesDatabase.find(t => t.id === builderTable)?.codes.map((c) => (
                        <option key={c.code} value={c.code}>{c.code} - {c.meaning} ({c.myanmarMeaning})</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Built output animation tree */}
              <div className="lg:col-span-7">
                <motion.div 
                  key={`${builderBaseCode}-${builderTable}-${builderTableCode}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-6"
                >
                  <div className="text-center bg-slate-950 py-6 rounded-2xl border border-slate-850/60 shadow-inner">
                    <span className="text-[10px] text-pink-400 font-bold tracking-widest uppercase block mb-1">
                      ဂဏန်းပေါင်းစပ်မှု ရလဒ် (Resulting Classification Number)
                    </span>
                    <div className="text-3xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 tracking-wider">
                      {builtResult.code}
                    </div>
                    <div className="text-xs font-black text-slate-200 mt-2.5 px-4">
                      {builtResult.meaning}
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    <span className="text-xs font-black text-white flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-pink-400" />
                      <span>နံပါတ်တည်ဆောက်ပုံ အဆင့်ဆင့် (Step-by-step Connection)</span>
                    </span>

                    <div className="space-y-2.5 pl-2 relative before:absolute before:left-3.5 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-800">
                      {builtResult.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-3 items-start relative">
                          <div className="w-7 h-7 rounded-full bg-slate-950 border border-slate-800 text-pink-400 font-bold text-xs flex items-center justify-center shrink-0 shadow-md">
                            {idx + 1}
                          </div>
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: COMPREHENSIVE PRACTICE EXERCISES */}
        {activeTab === "practice" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800">
              <span className="text-xs font-black text-pink-400 uppercase tracking-wider bg-pink-500/10 px-2.5 py-0.5 rounded-full">
                Interactive Practice Exercises
              </span>
              <h2 className="text-lg font-black text-white mt-2">DDC & Sears List စာမေးပွဲလေ့ကျင့်ခန်း</h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                DDC ဂဏန်းပေါင်းစပ်မှုနည်းလမ်းများနှင့် Sears List Subject Headings သတ်မှတ်မှုဆိုင်ရာ လက်တွေ့အသုံးချမေးခွန်းများကို ဖြေဆိုပြီး သင်၏ စာကြည့်တိုက်ပညာအရည်အသွေးကို စမ်းသပ်ကြည့်ပါ။
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setQuizType("ddc");
                    resetQuiz();
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    quizType === "ddc" 
                      ? "bg-pink-500/20 border-pink-400 text-pink-200" 
                      : "bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  DDC (ဒေါ့ဝေးဒသမစနစ်) မေးခွန်းများ
                </button>
                <button
                  onClick={() => {
                    setQuizType("sears");
                    resetQuiz();
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    quizType === "sears" 
                      ? "bg-pink-500/20 border-pink-400 text-pink-200" 
                      : "bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  Sears List (ဘာသာရပ်ခေါင်းစဉ်) မေးခွန်းများ
                </button>
              </div>
            </div>

            {/* Quiz Screen */}
            {!showScoreModal ? (
              <motion.div 
                key={`${quizType}-${currentQuizIdx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-6"
              >
                <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-3">
                  <span className="text-slate-400">
                    Question <strong className="text-white">{currentQuizIdx + 1}</strong> of {practiceQuizzes[quizType].length}
                  </span>
                  <span className="text-pink-400 font-bold">Score: {score}</span>
                </div>

                <h3 className="text-sm font-black text-white leading-relaxed">
                  {practiceQuizzes[quizType][currentQuizIdx].question}
                </h3>

                <div className="space-y-3">
                  {practiceQuizzes[quizType][currentQuizIdx].options.map((opt, idx) => {
                    let btnStyle = "bg-slate-950/60 border-slate-850 text-slate-300 hover:border-slate-700";
                    if (isAnswered) {
                      if (idx === practiceQuizzes[quizType][currentQuizIdx].correctIdx) {
                        btnStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-300";
                      } else if (idx === selectedAnswer) {
                        btnStyle = "bg-rose-500/10 border-rose-500 text-rose-300";
                      } else {
                        btnStyle = "bg-slate-950/20 border-slate-900 text-slate-500";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => handleAnswerSubmit(idx)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-xs ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && idx === practiceQuizzes[quizType][currentQuizIdx].correctIdx && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        {isAnswered && idx === selectedAnswer && idx !== practiceQuizzes[quizType][currentQuizIdx].correctIdx && (
                          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-slate-950 rounded-2xl border border-slate-850 text-xs space-y-1"
                  >
                    <span className="text-amber-400 font-bold block">ရှင်းလင်းချက်:</span>
                    <p className="text-slate-300 leading-relaxed">
                      {practiceQuizzes[quizType][currentQuizIdx].explanation}
                    </p>
                  </motion.div>
                )}

                {isAnswered && (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-3 rounded-2xl text-xs font-black bg-pink-500 text-white hover:bg-pink-600 transition-all cursor-pointer"
                  >
                    {currentQuizIdx < practiceQuizzes[quizType].length - 1 ? "နောက်တစ်မေးခွန်းသို့" : "ရလဒ်ကြည့်မည်"}
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 bg-slate-900 rounded-3xl border border-slate-800 text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mx-auto text-pink-400">
                  <Award className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-lg font-black text-white">လေ့ကျင့်ခန်း ဖြေဆိုပြီးဆုံးပါပြီ။</h3>
                  <p className="text-xs text-slate-400 mt-1">သင်၏ ရမှတ်အသေးစိတ်</p>
                </div>

                <div className="text-4xl font-black font-mono text-pink-400">
                  {score} / {practiceQuizzes[quizType].length}
                </div>

                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  {score === practiceQuizzes[quizType].length 
                    ? "ထူးချွန်လှပါသည်။ သီအိုရီနှင့် လက်တွေ့ကို ကောင်းမွန်စွာ နားလည်ထားပြီး ဖြစ်သည်။" 
                    : "အဆင်ပြေပါသည်၊၊ အထက်ပါ Main Classes များနှင့် Tables အညွှန်းများကို ထပ်မံလေ့လာ၍ ပြန်လည်စမ်းသပ်ကြည့်နိုင်ပါသည်။"}
                </p>

                <button
                  onClick={resetQuiz}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-all cursor-pointer"
                >
                  ထပ်မံဖြေဆိုရန်
                </button>
              </motion.div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
