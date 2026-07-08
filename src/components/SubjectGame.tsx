import React, { useState, useEffect } from "react";
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

  // Completed IDs from localStorage
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(`sivali_completed_subject_${user.id}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Session completed IDs in this round
  const [sessionCompleted, setSessionCompleted] = useState<string[]>([]);

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
        "Asian Geography (อာရှပထဝီဝင်အချက်အလက်များ)"
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
    },
    {
      id: "theory_1",
      bookTitle: "What are the different types of libraries?",
      description: "စာကြည့်တိုက်များကို ၎င်းတို့၏ ရည်ရွယ်ချက်၊ ရန်ပုံငွေနှင့် အသုံးပြုသူအပေါ် မူတည်၍ အမျိုးအစား အမျိုးမျိုး ခွဲခြားထားပါသည်။",
      correctSubject: "National, Academic, Public, and Special Libraries (အမျိုးသား၊ ပညာရေး၊ ပြည်သူ့ နှင့် အထူးစာကြည့်တိုက်များ)",
      options: [
        "National, Academic, Public, and Special Libraries (အမျိုးသား၊ ပညာရေး၊ ပြည်သူ့ နှင့် အထူးစာကြည့်တိုက်များ)",
        "School and College Libraries only (ကျောင်းနှင့် ကောလိပ်စာကြည့်တိုက်များသာ)",
        "Digital and Physical Libraries (ဒစ်ဂျစ်တယ်နှင့် ရုပ်ပိုင်းဆိုင်ရာ စာကြည့်တိုက်များသာ)",
        "Private and Government Libraries (ပုဂ္ဂလိကနှင့် အစိုးရစာကြည့်တိုက်များသာ)"
      ]
    },
    {
      id: "theory_2",
      bookTitle: "What are the core services provided by the different types of libraries?",
      description: "စာကြည့်တိုက်အမျိုးအစားအလိုက် ပံ့ပိုးပေးသော အခြေခံနှင့် အဓိကကျသော ဝန်ဆောင်မှုများ ဖြစ်ပါသည်။",
      correctSubject: "Information access, reference services, circulation, resource sharing, and community engagement (သတင်းအချက်အလက်ရှာဖွေခြင်း၊ ကိုးကားခြင်း၊ စာအုပ်ငှားရမ်းခြင်း၊ အရင်းအမြစ်မျှဝေခြင်းနှင့် လူထုပူးပေါင်းဆောင်ရွက်မှု)",
      options: [
        "Information access, reference services, circulation, resource sharing, and community engagement (သတင်းအချက်အလက်ရှာဖွေခြင်း၊ ကိုးကားခြင်း၊ စာအုပ်ငှားရမ်းခြင်း၊ အရင်းအမြစ်မျှဝေခြင်းနှင့် လူထုပူးပေါင်းဆောင်ရွက်မှု)",
        "Book selling and printing only (စာအုပ်ရောင်းချခြင်းနှင့် ပုံနှိပ်ခြင်းသက်သက်သာ)",
        "Strictly research and thesis writing (သုတေသနနှင့် ဘွဲ့လွန်စာတမ်းပြုစုခြင်း သက်သက်သာ)",
        "Cafeteria and recreation services (ကော်ဖီဆိုင်နှင့် အပန်းဖြေဝန်ဆောင်မှုများ)"
      ]
    },
    {
      id: "theory_3",
      bookTitle: "What is the primary role of a national library?",
      description: "တိုင်းပြည်တစ်ခု၏ ပုံနှိပ်ထုတ်ဝေမှုသမိုင်း၊ ယဉ်ကျေးမှုအမွေအနှစ်များကို စုဆောင်းထိန်းသိမ်းရန် တာဝန်ရှိသောအဆင့်မြင့် စာကြည့်တိုက် ဖြစ်ပါသည်။",
      correctSubject: "To collect, preserve, and conserve the intellectual heritage and legal deposit of the nation (နိုင်ငံတော်၏ စာပေ/ဉာဏအမွေအနှစ်များနှင့် တရားဝင်အပ်နှံသော စာအုပ်စာတမ်းများကို စုဆောင်းထိန်းသိမ်းရန်)",
      options: [
        "To collect, preserve, and conserve the intellectual heritage and legal deposit of the nation (နိုင်ငံတော်၏ စာပေ/ဉာဏအမွေအနှစ်များနှင့် တရားဝင်အပ်နှံသော စာအုပ်စာတမ်းများကို စုဆောင်းထိန်းသိမ်းရန်)",
        "To provide textbooks to primary school students (မူလတန်းကျောင်းသားများအတွက် ပြဌာန်းစာအုပ်များ ပံ့ပိုးပေးရန်)",
        "To sell international bestsellers at low cost (နိုင်ငံတကာ လူကြိုက်များသော စာအုပ်များကို ဈေးနှုန်းချိုသာစွာ ရောင်းချရန်)",
        "To act as a recreational center for children (ကလေးများအတွက် ဖျော်ဖြေရေးဗဟိုဌာနအဖြစ် ဆောင်ရွက်ရန်)"
      ]
    },
    {
      id: "theory_4",
      bookTitle: "What is the difference between a school library and a college library?",
      description: "စာကြည့်တိုက်နှစ်ခုလုံးသည် ပညာရေးနယ်ပယ်ဖြစ်သော်လည်း ဝန်ဆောင်မှုပေးရသည့် အဆင့်နှင့် ရည်ရွယ်ချက် ကွာခြားပါသည်။",
      correctSubject: "School libraries support K-12 curriculum and basic literacy, while college libraries focus on academic research, specialized databases, and higher education (ကျောင်းစာကြည့်တိုက်သည် အခြေခံပညာသင်ရိုးကို ပံ့ပိုးပြီး၊ ကောလိပ်စာကြည့်တိုက်သည် အဆင့်မြင့်သုတေသနနှင့် ဒေတာဘေ့စ်များကို ဦးတည်သည်)",
      options: [
        "School libraries support K-12 curriculum and basic literacy, while college libraries focus on academic research, specialized databases, and higher education (ကျောင်းစာကြည့်တိုက်သည် အခြေခံပညာသင်ရိုးကို ပံ့ပိုးပြီး၊ ကောလိပ်စာကြည့်တိုက်သည် အဆင့်မြင့်သုတေသနနှင့် ဒေတာဘေ့စ်များကို ဦးတည်သည်)",
        "There is no difference, they share the exact same budget and user base (မည်သည့်ကွာခြားချက်မျှမရှိဘဲ တူညီသော ဘတ်ဂျက်နှင့် အသုံးပြုသူများရှိသည်)",
        "School libraries only contain comics, while college libraries contain novels (ကျောင်းစာကြည့်တိုက်တွင် ကာတွန်းများသာရှိပြီး ကောလိပ်တွင် ဝတ္ထုများသာရှိသည်)",
        "College libraries do not allow reading books in the library (ကောလိပ်စာကြည့်တိုက်တွင် စာဖတ်ခွင့်မပြုပါ)"
      ]
    },
    {
      id: "theory_5",
      bookTitle: "What is the function of an academic library?",
      description: "တက္ကသိုလ်၊ ကောလိပ် စသည့် အဆင့်မြင့်ပညာရေးအဖွဲ့အစည်းများတွင် တည်ရှိသော စာကြည့်တိုက်များ၏ အဓိကတာဝန် ဖြစ်ပါသည်။",
      correctSubject: "To support the curriculum, teaching, and research activities of the parent institution (မိခင်အဖွဲ့အစည်း၏ သင်ရိုးညွှန်းတမ်း၊ သင်ကြားမှုနှင့် သုတေသနလုပ်ငန်းများကို ပံ့ပိုးကူညီရန်)",
      options: [
        "To support the curriculum, teaching, and research activities of the parent institution (မိခင်အဖွဲ့အစည်း၏ သင်ရိုးညွှန်းတမ်း၊ သင်ကြားမှုနှင့် သုတေသနလုပ်ငန်းများကို ပံ့ပိုးကူညီရန်)",
        "To host public entertainment and cinema shows (အများပြည်သူ ဖျော်ဖြေရေးနှင့် ရုပ်ရှင်ပြသမှုများ ပြုလုပ်ရန်)",
        "To publish daily newspapers for the general public (အများပြည်သူအတွက် နေ့စဉ်သတင်းစာများ ထုတ်ဝေရန်)",
        "To issue driving licenses and registrations (ယာဉ်မောင်းလိုင်စင်နှင့် မှတ်ပုံတင်များ ထုတ်ပေးရန်)"
      ]
    },
    {
      id: "theory_6",
      bookTitle: "What is the primary function of a school library?",
      description: "မူလတန်း၊ အလယ်တန်း၊ အထက်တန်းကျောင်းများရှိ စာကြည့်တိုက်များ၏ အဓိကကျသော ရည်မှန်းချက် ဖြစ်ပါသည်။",
      correctSubject: "To develop reading habits, support basic education, and build informational literacy among students (ကျောင်းသားများ၏ ဖတ်ရှုမှုအလေ့အထ တိုးတက်စေရန်၊ အခြေခံပညာရေးကို ပံ့ပိုးရန်နှင့် သတင်းအချက်အလက် ရှာဖွေတတ်စေရန်)",
      options: [
        "To develop reading habits, support basic education, and build informational literacy among students (ကျောင်းသားများ၏ ဖတ်ရှုမှုအလေ့အထ တိုးတက်စေရန်၊ အခြေခံပညာရေးကို ပံ့ပိုးရန်နှင့် သတင်းအချက်အလက် ရှာဖွေတတ်စေရန်)",
        "To store outdated administrative and financial documents (ခေတ်မမှီတော့သော ရုံးလုပ်ငန်းနှင့် ဘဏ္ဍာရေးစာရွက်စာတမ်းများ သိမ်းဆည်းရန်)",
        "To provide high-end laboratory equipment for biology (ဇီဝဗေဒအတွက် အဆင့်မြင့်ဓာတ်ခွဲခန်းသုံးပစ္စည်းများ ထောက်ပံ့ရန်)",
        "To act as an examination hall only (စာမေးပွဲဖြေဆိုသည့် ခန်းမအဖြစ်သာ အသုံးပြုရန်)"
      ]
    },
    {
      id: "theory_7",
      bookTitle: "What is a special library?",
      description: "သီးခြားအဖွဲ့အစည်းတစ်ခု သို့မဟုတ် ကော်ပိုရေးရှင်း၊ အစိုးရဌာန၊ ဆေးရုံ စသည်တို့အတွက် သီးသန့်ဝန်ဆောင်မှုပေးသော စာကြည့်တိုက် ဖြစ်ပါသည်။",
      correctSubject: "A library established by a specific organization to serve specialized information needs of its staff/members (အဖွဲ့အစည်းတစ်ခုမှ ၎င်း၏ဝန်ထမ်း/အဖွဲ့ဝင်များ၏ သီးသန့်သတင်းအချက်အလက် လိုအပ်ချက်ကို ဖြည့်ဆည်းရန် တည်ထောင်ထားသော စာကြည့်တိုက်)",
      options: [
        "A library established by a specific organization to serve specialized information needs of its staff/members (အဖွဲ့အစည်းတစ်ခုမှ ၎င်း၏ဝန်ထမ်း/အဖွဲ့ဝင်များ၏ သီးသန့်သတင်းအချက်အလက် လိုအပ်ချက်ကို ဖြည့်ဆည်းရန် တည်ထောင်ထားသော စာကြည့်တိုက်)",
        "A library that only opens during special national holidays (အမျိုးသားနေ့ထူးနေ့မြတ်များတွင်သာ ဖွင့်လှစ်သော စာကြည့်တိုက်)",
        "A library with premium entry fees and VIP members only (ဝင်ကြေးအဆမတန်မြင့်မားပြီး VIP အဖွဲ့ဝင်များသာ ဝင်ခွင့်ရှိသော စာကြည့်တိုက်)",
        "A library that only collects rare mystical books (ရှားပါးပြီး ထူးဆန်းသော မှော်စာအုပ်များကိုသာ စုဆောင်းသော စာကြည့်တိုက်)"
      ]
    },
    {
      id: "theory_8",
      bookTitle: "What are the collections in the different types of libraries?",
      description: "စာကြည့်တိုက်အမျိုးအစားအလိုက် စာအုပ်စာတမ်းများ စုဆောင်းသိမ်းဆည်းမှု (Collection setup) ကွာခြားပုံ ဖြစ်ပါသည်။",
      correctSubject: "Textbooks in school libraries, research journals in academic libraries, general literature in public libraries, and technical reports in special libraries (ကျောင်းများတွင် သင်ရိုးစာအုပ်များ၊ တက္ကသိုလ်များတွင် သုတေသနဂျာနယ်များ၊ ပြည်သူ့စာကြည့်တိုက်တွင် အထွေထွေစာပေနှင့် အထူးစာကြည့်တိုက်တွင် နည်းပညာအစီရင်ခံစာများ)",
      options: [
        "Textbooks in school libraries, research journals in academic libraries, general literature in public libraries, and technical reports in special libraries (ကျောင်းများတွင် သင်ရိုးစာအုပ်များ၊ တက္ကသိုလ်များတွင် သုတေသနဂျာနယ်များ၊ ပြည်သူ့စာကြည့်တိုက်တွင် အထွေထွေစာပေနှင့် အထူးစာကြည့်တိုက်တွင် နည်းပညာအစီရင်ခံစာများ)",
        "All libraries must contain the exact same identical collection of books (စာကြည့်တိုက်အားလုံးတွင် လုံးဝတူညီသော စာအုပ်များသာ ထားရှိရမည်)",
        "Digital software code files only without any paper-based materials (မည်သည့်စက္ကူစာအုပ်မျှမပါဘဲ ဒစ်ဂျစ်တယ်ကုဒ်ဖိုင်များသာ)",
        "Fiction books and entertainment magazines only in all libraries (စာကြည့်တိုက်အားလုံးတွင် ဝတ္ထုနှင့် ဖျော်ဖြေရေးမဂ္ဂဇင်းများသာ ထားရှိရမည်)"
      ]
    },
    {
      id: "theory_9",
      bookTitle: "Give the reasons for categorizing the libraries.",
      description: "စာကြည့်တိုက်များကို ၎င်းတို့၏လုပ်ဆောင်ချက်အလိုက် အမျိုးအစား ခွဲခြားသတ်မှတ်ရခြင်း အကြောင်းရင်းများ ဖြစ်ပါသည်။",
      correctSubject: "To meet specific needs of different user groups, manage resources effectively, and tailor appropriate services (အသုံးပြုသူအုပ်စုအလိုက် လိုအပ်ချက်များ ဖြည့်ဆည်းရန်၊ အရင်းအမြစ်များ ထိရောက်စွာစီမံရန်နှင့် ဝန်ဆောင်မှုများကို ကွက်တိပေးနိုင်ရန်)",
      options: [
        "To meet specific needs of different user groups, manage resources effectively, and tailor appropriate services (အသုံးပြုသူအုပ်စုအလိုက် လိုအပ်ချက်များ ဖြည့်ဆည်းရန်၊ အရင်းအမြစ်များ ထိရောက်စွာစီမံရန်နှင့် ဝန်ဆောင်မှုများကို ကွက်တိပေးနိုင်ရန်)",
        "To create competition among library organizations (စာကြည့်တိုက်အချင်းချင်း ပြိုင်ဆိုင်မှု ပြင်းထန်လာစေရန်)",
        "To reduce government funding and save administrative taxes (အစိုးရထောက်ပံ့ငွေ လျှော့ချရန်နှင့် စီမံခန့်ခွဲမှု အခွန်များ သက်သာစေရန်)",
        "To prevent books from being easily shared between cities (မြို့ကြီးများအကြား စာအုပ်များ လွယ်ကူစွာ မမျှဝေနိုင်စေရန် တားဆီးရန်)"
      ]
    },
    {
      id: "theory_10",
      bookTitle: "What are the different types of libraries identified to meet the requirements of users?",
      description: "အသုံးပြုသူအမျိုးမျိုး၏ ကွဲပြားသော လိုအပ်ချက်များကို ဖြည့်ဆည်းရန် သတ်မှတ်ထားသော စာကြည့်တိုက်များ ဖြစ်ပါသည်။",
      correctSubject: "Academic, Public, Special, and National Libraries (ပညာရေး၊ ပြည်သူ့၊ အထူး နှင့် အမျိုးသားစာကြည့်တိုက်များ)",
      options: [
        "Academic, Public, Special, and National Libraries (ပညာရေး၊ ပြည်သူ့၊ အထူး နှင့် အမျိုးသားစာကြည့်တိုက်များ)",
        "Private, Subscription, and Commercial Libraries only (ကိုယ်ပိုင်၊ လစဉ်ကြေးပေး နှင့် စီးပွားရေးစာကြည့်တိုက်များသာ)",
        "Audio, Video, and Game Libraries (အသံ၊ ဗီဒီယိုနှင့် ဂိမ်းစာကြည့်တိုက်များ)",
        "Central and Branch Libraries only (ဗဟိုနှင့် စာကြည့်တိုက်ခွဲများသာ)"
      ]
    },
    {
      id: "theory_11",
      bookTitle: "What are the primary objectives of a school library?",
      description: "ကျောင်းစာကြည့်တိုက်တစ်ခုက အကောင်အထည်ဖော်ရန် ချမှတ်ထားသော အဓိကရည်မှန်းချက်များ ဖြစ်ပါသည်။",
      correctSubject: "Supporting teaching-learning process, cultivating lifetime reading habit, and providing resource materials for teachers and students (သင်ကြားသင်ယူမှုကို ထောက်ပံ့ရန်၊ တစ်သက်တာစာဖတ်သည့် အလေ့အထပျိုးထောင်ရန်နှင့် ဆရာ/ကျောင်းသားများအတွက် အထောက်အကူပြုပစ္စည်းများ ပံ့ပိုးရန်)",
      options: [
        "Supporting teaching-learning process, cultivating lifetime reading habit, and providing resource materials for teachers and students (သင်ကြားသင်ယူမှုကို ထောက်ပံ့ရန်၊ တစ်သက်တာစာဖတ်သည့် အလေ့အထပျိုးထောင်ရန်နှင့် ဆရာ/ကျောင်းသားများအတွက် အထောက်အကူပြုပစ္စည်းများ ပံ့ပိုးရန်)",
        "Ensuring all students buy books from the school shop (ကျောင်းသားအားလုံး ကျောင်းဆိုင်မှ စာအုပ်ဝယ်ယူရန် တာဝန်ယူပေးရန်)",
        "Offering online gaming platforms to children (ကလေးများအတွက် အွန်လိုင်းဂိမ်းများ ဆော့ကစားရန် ပံ့ပိုးပေးရန်)",
        "Providing administrative workspace for principal and office staff (ကျောင်းအုပ်ကြီးနှင့် ရုံးအဖွဲ့သားများအတွက် ရုံးလုပ်ငန်းခွင် နေရာစီစဉ်ပေးရန်)"
      ]
    },
    {
      id: "theory_12",
      bookTitle: "Why is display of new books important for school children?",
      description: "စာအုပ်သစ်များကို ထင်သာမြင်သာရှိသော စင်များတွင် ခင်းကျင်းပြသခြင်းက ကျောင်းသားကလေးငယ်များအတွက် မည်သို့အကျိုးရှိစေသနည်း။",
      correctSubject: "To attract children's curiosity, stimulate reading interest, and promote awareness of new library acquisitions (ကလေးများ၏ စူးစမ်းလိုစိတ်ကို ဆွဲဆောင်ရန်၊ စာဖတ်ချင်စိတ်နှိုးဆွရန်နှင့် စာအုပ်အသစ်များရောက်ရှိခြင်းကို အသိပေးရန်)",
      options: [
        "To attract children's curiosity, stimulate reading interest, and promote awareness of new library acquisitions (ကလေးများ၏ စူးစမ်းလိုစိတ်ကို ဆွဲဆောင်ရန်၊ စာဖတ်ချင်စိတ်နှိုးဆွရန်နှင့် စာအုပ်အသစ်များရောက်ရှိခြင်းကို အသိပေးရန်)",
        "To hide old books from being read by children (ကလေးများ စာအုပ်ဟောင်းများကို မဖတ်မိစေရန် ဖုံးကွယ်ထားရန်)",
        "To follow a strict legal requirement of library space (စာကြည့်တိုက် ဥပဒေစည်းမျဉ်း သက်သက်ကို လိုက်နာရန်)",
        "To prevent the dust from collecting on the shelf covers (စာအုပ်စင်များပေါ်တွင် ဖုန်မတက်စေရန် ကာကွယ်ရန်)"
      ]
    },
    {
      id: "theory_13",
      bookTitle: "Mention at least three services of a college library that are different from that of a school library.",
      description: "ကောလိပ်စာကြည့်တိုက်တွင် ပံ့ပိုးပေးပြီး ကျောင်းစာကြည့်တိုက်တွင် မတွေ့ရတတ်သော ဝန်ဆောင်မှုများ ဖြစ်ပါသည်။",
      correctSubject: "Interlibrary loan, research database access, and specialized reference service (စာကြည့်တိုက်အချင်းချင်း ချိတ်ဆက်ငှားရမ်းခြင်း၊ သုတေသနဒေတာဘေ့စ်များ အသုံးပြုခွင့်ပေးခြင်းနှင့် အဆင့်မြင့်ကိုးကားမှု ဝန်ဆောင်မှု)",
      options: [
        "Interlibrary loan, research database access, and specialized reference service (စာကြည့်တိုက်အချင်းချင်း ချိတ်ဆက်ငားရမ်းခြင်း၊ သုတေသနဒေတာဘေ့စ်များ အသုံးပြုခွင့်ပေးခြင်းနှင့် အဆင့်မြင့်ကိုးကားမှု ဝန်ဆောင်မှု)",
        "Free lunch, transport facilities, and medical checkups (အခမဲ့နေ့လည်စာ၊ သယ်ယူပို့ဆောင်ရေးနှင့် ကျန်းမာရေးစစ်ဆေးမှုများ)",
        "Printing, scanning, and binding services only (စာရွက်စာတမ်း ပုံနှိပ်ခြင်းနှင့် စာအုပ်ချုပ်ခြင်း သက်သက်သာ)",
        "Selling stationeries, school uniforms, and sports items (စာရေးကိရိယာ၊ ကျောင်းဝတ်စုံနှင့် အားကစားပစ္စည်းများ ရောင်းချခြင်း)"
      ]
    },
    {
      id: "theory_14",
      bookTitle: "National libraries came to be established for which of the following reasons?",
      description: "အမျိုးသားစာကြည့်တိုက်များ ပေါ်ပေါက်လာရခြင်း၏ သမိုင်းဝင် အခြေခံအကြောင်းရင်းကို ရွေးချယ်ပါ။",
      correctSubject: "Preserving national heritage and culture (အမျိုးသားယဉ်ကျေးမှုနှင့် အမွေအနှစ်များကို ထိန်းသိမ်းစောင့်ရှောက်ရန်)",
      options: [
        "Preserving national heritage and culture (အမျိုးသားယဉ်ကျေးမှုနှင့် အမွေအနှစ်များကို ထိန်းသိမ်းစောင့်ရှောက်ရန်)",
        "Introducing a new political philosophy (နိုင်ငံရေးအတွေးအခေါ်အသစ်တစ်ခု မိတ်ဆက်ရန်)",
        "Resolving social conflicts and legal cases (လူမှုရေးပဋိပက္ခများနှင့် ဥပဒေရေးရာအမှုအခင်းများကို ဖြေရှင်းရန်)",
        "Facilitating commercial international trade (အပြည်ပြည်ဆိုင်ရာ ကုန်သွယ်ရေးလုပ်ငန်းများကို လွယ်ကူချောမွေ့စေရန်)"
      ]
    },
    {
      id: "theory_15",
      bookTitle: "What is 'authority' in library science?",
      description: "စာကြည့်တိုက်စီမံအုပ်ချုပ်မှု နယ်ပယ်ရှိ 'Authority' (စီမံပိုင်ခွင့်အာဏာပိုင်အဖွဲ့) ၏ တရားဝင်အဓိပ္ပာယ် ဖွင့်ဆိုချက် ဖြစ်ပါသည်။",
      correctSubject: "The legal or administrative body responsible for decision-making, policy formulation, and financial funding of the library (မူဝါဒချမှတ်ခြင်း၊ ဆုံးဖြတ်ချက်ချခြင်းနှင့် ငွေကြေးထောက်ပံ့မှုပေးရန် တာဝန်ရှိသည့် တရားဝင် အုပ်ချုပ်မှုအဖွဲ့အစည်း)",
      options: [
        "The legal or administrative body responsible for decision-making, policy formulation, and financial funding of the library (မူဝါဒချမှတ်ခြင်း၊ ဆုံးဖြတ်ချက်ချခြင်းနှင့် ငွေကြေးထောက်ပံ့မှုပေးရန် တာဝန်ရှိသည့် တရားဝင် အုပ်ချုပ်မှုအဖွဲ့အစည်း)",
        "The author who wrote the highest number of books in the library (စာကြည့်တိုက်တွင် စာအုပ်အများဆုံးရေးသားထားသော စာရေးဆရာ)",
        "The security guard who enforces silence in the reading room (စာဖတ်ခန်းအတွင်း တိတ်ဆိတ်စွာနေရန် ထိန်းသိမ်းပေးသော လုံခြုံရေးဝန်ထမ်း)",
        "A software tool that auto-catalogs the books (စာအုပ်များကို အလိုအလျောက် ကတ်တလောက်လုပ်ပေးသည့် ဆော့ဖ်ဝဲလ်ကိရိယာ)"
      ]
    },
    {
      id: "theory_16",
      bookTitle: "What is 'committee' in library management?",
      description: "စာကြည့်တိုက် စီမံခန့်ခွဲရာတွင် 'Library Committee' (စာကြည့်တိုက်ကော်မတီ) ၏ အဓိကသဘောတရား ဖြစ်ပါသည်။",
      correctSubject: "A body of appointed members representing users and management to advise on library development and run administrative affairs (စာကြည့်တိုက်ဖွံ့ဖြိုးတိုးတက်ရေး အကြံပြုရန်နှင့် စီမံခန့်ခွဲရေးလုပ်ငန်းများ လုပ်ဆောင်ရန် ခန့်အပ်ထားသော ကော်မတီအဖွဲ့ဝင်များ)",
      options: [
        "A body of appointed members representing users and management to advise on library development and run administrative affairs (စာကြည့်တိုက်ဖွံ့ဖြိုးတိုးတက်ရေး အကြံပြုရန်နှင့် စီမံခန့်ခွဲရေးလုပ်ငန်းများ လုပ်ဆောင်ရန် ခန့်အပ်ထားသော ကော်မတီအဖွဲ့ဝင်များ)",
        "A group of students who read books together in a circle (စာအုပ်များကို အတူတူဝိုင်းဖတ်သော ကျောင်းသားအုပ်စု)",
        "A legal court that handles complaints regarding lost books (ပျောက်ဆုံးစာအုပ်များအတွက် တိုင်ကြားချက်များကို စစ်ဆေးသည့် တရားရုံး)",
        "The cleaning staff responsible for dusting shelves (စာအုပ်စင်များ ဖုန်သုတ်ရန် တာဝန်ရှိသည့် သန့်ရှင်းရေးဝန်ထမ်းများ)"
      ]
    },
    {
      id: "theory_17",
      bookTitle: "What are the core functions of a 'library authority'?",
      description: "စာကြည့်တိုက်အာဏာပိုင် (Library Authority) က ဆောင်ရွက်ပေးရမည့် အခြေခံတာဝန်များ ဖြစ်ပါသည်။",
      correctSubject: "Providing financial budget, formulating long-term development policies, and appointing high-level library executives (ဘဏ္ဍာရေးရန်ပုံငွေ ပံ့ပိုးခြင်း၊ ရေရှည်ဖွံ့ဖြိုးတိုးတက်ရေးမူဝါဒများ ချမှတ်ခြင်းနှင့် အဆင့်မြင့်အမှုဆောင်များ ခန့်အပ်ခြင်း)",
      options: [
        "Providing financial budget, formulating long-term development policies, and appointing high-level library executives (ဘဏ္ဍာရေးရန်ပုံငွေ ပံ့ပိုးခြင်း၊ ရေရှည်ဖွံ့ဖြိုးတိုးတက်ရေးမူဝါဒများ ချမှတ်ခြင်းနှင့် အဆင့်မြင့်အမှုဆောင်များ ခန့်အပ်ခြင်း)",
        "Issuing student identity cards and library entry tickets (ကျောင်းသားကတ်ပြားများနှင့် စာကြည့်တိုက်ဝင်ခွင့်လက်မှတ်များ ထုတ်ပေးခြင်း)",
        "Conducting direct physical book repairs and binding on a daily basis (နေ့စဉ်ရုပ်ပိုင်းဆိုင်ရာ စာအုပ်ပြင်ဆင်ခြင်းနှင့် စာအုပ်ချုပ်ခြင်းလုပ်ငန်းများကို တိုက်ရိုက်လုပ်ဆောင်ခြင်း)",
        "Driving vehicles to distribute books to remote villages (ဝေးလံခေါင်သီသော ကျေးရွာများသို့ စာအုပ်များဖြန့်ဝေရန် ယာဉ်မောင်းနှင်ခြင်း)"
      ]
    },
    {
      id: "theory_18",
      bookTitle: "What are the power and functions of a library committee?",
      description: "စာကြည့်တိုက်ကော်မတီတစ်ခုက ပိုင်ဆိုင်သည့် လုပ်ပိုင်ခွင့်အာဏာနှင့် ဆောင်ရွက်ရမည့် လုပ်ငန်းတာဝန်များ ဖြစ်ပါသည်။",
      correctSubject: "Supervising library staff, approving book selection lists, allocating budget, and checking library rules implementation (ဝန်ထမ်းများကို ကြီးကြပ်ခြင်း၊ စာအုပ်ရွေးချယ်မှုစာရင်းကို အတည်ပြုခြင်း၊ ဘတ်ဂျက်ခွဲဝေခြင်းနှင့် စည်းကမ်းချက်များကို စစ်ဆေးခြင်း)",
      options: [
        "Supervising library staff, approving book selection lists, allocating budget, and checking library rules implementation (ဝန်ထမ်းများကို ကြီးကြပ်ခြင်း၊ စာအုပ်ရွေးချယ်မှုစာရင်းကို အတည်ပြုခြင်း၊ ဘတ်ဂျက်ခွဲဝေခြင်းနှင့် စည်းကမ်းချက်များကို စစ်ဆေးခြင်း)",
        "Making legal arrests of delayed borrowers (စာအုပ်ပြန်မအပ်သူများကို တရားဝင် ဖမ်းဆီးအရေးယူခြင်း)",
        "Translating foreign books into Myanmar language (နိုင်ငံခြားစာအုပ်များကို မြန်မာဘာသာသို့ တိုက်ရိုက်ပြန်ဆိုခြင်း)",
        "Organizing sports events inside the library hall (စာကြည့်တိုက်ခန်းမအတွင်း အားကစားပြိုင်ပွဲများ ကျင်းပခြင်း)"
      ]
    },
    {
      id: "theory_19",
      bookTitle: "Why is a library committee needed?",
      description: "စာကြည့်တိုက်တစ်ခုကို စနစ်တကျ၊ တရားမျှတစွာ လည်ပတ်နိုင်ရန် ကော်မတီ ဖွဲ့စည်းရခြင်း၏ လိုအပ်ချက် ဖြစ်ပါသည်။",
      correctSubject: "To ensure democratic decision-making, represent user views, and share administrative responsibility of the librarian (ဒီမိုကရေစီနည်းကျ ဆုံးဖြတ်ရန်၊ အသုံးပြုသူများ၏ အမြင်ကို ကိုယ်စားပြုရန်နှင့် စာကြည့်တိုက်မှူး၏ စီမံခန့်ခွဲမှုဝန်ထုပ်ဝန်ပိုးကို မျှဝေရန်)",
      options: [
        "To ensure democratic decision-making, represent user views, and share administrative responsibility of the librarian (ဒီမိုကရေစီနည်းကျ ဆုံးဖြတ်ရန်၊ အသုံးပြုသူများ၏ အမြင်ကို ကိုယ်စားပြုရန်နှင့် စာကြည့်တိုက်မှူး၏ စီမံခန့်ခွဲမှုဝန်ထုပ်ဝန်ပိုးကို မျှဝေရန်)",
        "To replace the librarian entirely with automated robots (စာကြည့်တိုက်မှူးနေရာတွင် စက်ရုပ်များဖြင့် အစားထိုးရန်)",
        "To collect membership fees and fine payments for profitable revenue (အကျိုးအမြတ်ရရှိရန်အတွက် အသင်းဝင်ကြေးနှင့် ဒဏ်ကြေးများ အဓိကကောက်ခံရန်)",
        "To select which political party can access the library books (မည်သည့်နိုင်ငံရေးပါတီက စာအုပ်များကို ဖတ်ခွင့်ရှိမည်ကို ဆုံးဖြတ်ရန်)"
      ]
    },
    {
      id: "theory_20",
      bookTitle: "What is meant by 'the flexible facilities of the library'?",
      description: "ခေတ်မီစာကြည့်တိုက် ဒီဇိုင်းနှင့် တည်ဆောက်ပုံဆိုင်ရာ 'Flexible facilities' (ပြောင်းလွယ်ပြင်လွယ်ရှိသော အသုံးအဆောင်များ) ၏ အနက်အဓိပ္ပာယ် ဖြစ်ပါသည်။",
      correctSubject: "Modularity in design allowing spaces to be reconfigured for different purposes as library needs change over time (စာကြည့်တိုက်၏ လိုအပ်ချက်ပြောင်းလဲမှုအပေါ် မူတည်၍ နေရာများကို ပုံစံအမျိုးမျိုး ပြောင်းလဲအသုံးပြုနိုင်ရန် မော်ဂျူလာပုံစံ ဒီဇိုင်းထုတ်လုပ်ထားခြင်း)",
      options: [
        "Modularity in design allowing spaces to be reconfigured for different purposes as library needs change over time (စာကြည့်တိုက်၏ လိုအပ်ချက်ပြောင်းလဲမှုအပေါ် မူတည်၍ နေရာများကို ပုံစံအမျိုးမျိုး ပြောင်းလဲအသုံးပြုနိုင်ရန် မော်ဂျူလာပုံစံ ဒီဇိုင်းထုတ်လုပ်ထားခြင်း)",
        "Physical buildings made of rubber and flexible carbon materials (ရော်ဘာ သို့မဟုတ် ကာဗွန်ပြောင်းလွယ်ပြင်လွယ်ပစ္စည်းများဖြင့် ဆောက်လုပ်ထားသော စာကြည့်တိုက် အဆောက်အအုံ)",
        "The permission to take library furniture back to students' homes (စာကြည့်တိုက်ရှိ ပရိဘောဂများကို ကျောင်းသားများ၏ နေအိမ်သို့ သယ်ဆောင်သွားခွင့် ပြုခြင်း)",
        "Libraries that change their physical address every single month (လစဉ် စာကြည့်တိုက်လိပ်စာကို ပြောင်းရွှေ့နေခြင်း)"
      ]
    },
    {
      id: "theory_21",
      bookTitle: "What are the key needs for selecting a site of a library?",
      description: "စာကြည့်တိုက်တစ်ခု ဆောက်လုပ်ရန်အတွက် မြေနေရာ ရွေးချယ်ရာတွင် မဖြစ်မနေ လိုအပ်သော အချက်များ ဖြစ်ပါသည်။",
      correctSubject: "Central accessibility, quiet surroundings, natural light/ventilation, and scope for future expansion (လူတိုင်းအလွယ်တကူ လာရောက်နိုင်မှု၊ ဆိတ်ငြိမ်သောပတ်ဝန်းကျင်၊ သဘာဝအလင်းရောင်/လေဝင်လေထွက်နှင့် နောင်တွင်တိုးချဲ့နိုင်မည့် မြေနေရာရှိမှု)",
      options: [
        "Central accessibility, quiet surroundings, natural light/ventilation, and scope for future expansion (လူတိုင်းအလွယ်တကူ လာရောက်နိုင်မှု၊ ဆိတ်ငြိမ်သောပတ်ဝန်းကျင်၊ သဘာဝအလင်းရောင်/လေဝင်လေထွက်နှင့် နောင်တွင်တိုးချဲ့နိုင်မည့် မြေနေရာရှိမှု)",
        "Being located inside the busiest industrial zone or heavy market (အလုပ်အရှုပ်ဆုံး စက်မှုဇုန် သို့မဟုတ် စည်ကားလွန်းသော စျေးကြီးအတွင်း တည်ရှိခြင်း)",
        "Selecting a remote mountain top for isolated reading only (အထီးကျန်စွာ စာဖတ်ရန်အတွက် ဝေးလံခေါင်သီသော တောင်ထိပ်ကို ရွေးချယ်ခြင်း)",
        "Finding a site that has the lowest soil quality to save purchase costs (မြေဝယ်ယူစရိတ်သက်သာစေရန် အညံ့ဆုံး မြေဆီလွှာအရည်အသွေးရှိသော နေရာကို ရှာဖွေခြင်း)"
      ]
    },
    {
      id: "theory_22",
      bookTitle: "What is the primary purpose of managing spaces in the library?",
      description: "စာကြည့်တိုက်အတွင်းရှိ ကုန်းမြေနှင့် အဆောက်အဦနေရာလွတ်များကို စီမံခန့်ခွဲရခြင်း၏ အဓိကရည်ရွယ်ချက် ဖြစ်ပါသည်။",
      correctSubject: "To maximize user comfort, facilitate smooth traffic flow, and optimize storage of materials and staff work zones (အသုံးပြုသူများ သက်တောင့်သက်သာရှိစေရန်၊ သွားလာမှု လွယ်ကူစေရန်နှင့် စာအုပ်များသိမ်းဆည်းမှုနှင့် ဝန်ထမ်းအလုပ်နေရာများကို အကျိုးရှိဆုံးအသုံးချရန်)",
      options: [
        "To maximize user comfort, facilitate smooth traffic flow, and optimize storage of materials and staff work zones (အသုံးပြုသူများ သက်တောင့်သက်သာရှိစေရန်၊ သွားလာမှု လွယ်ကူစေရန်နှင့် စာအုပ်များသိမ်းဆည်းမှုနှင့် ဝန်ထမ်းအလုပ်နေရာများကို အကျိုးရှိဆုံးအသုံးချရန်)",
        "To store as many unwanted materials as possible to fill all empty space (နေရာလွတ်အားလုံး ပြည့်နှက်သွားစေရန် မလိုအပ်သောပစ္စည်းများကို တတ်နိုင်သမျှ သိမ်းဆည်းရန်)",
        "To charge high fees for renting out empty reading cabins (လွတ်နေသော စာဖတ်ခန်းငယ်များကို ငှားရမ်းခြင်းအတွက် မြင့်မားသောအခကြေးငွေ ကောက်ခံရန်)",
        "To prevent users from walking freely near the bookshelves (အသုံးပြုသူများ စာအုပ်စင်များအနီး လွတ်လပ်စွာ သွားလာခြင်းကို တားဆီးရန်)"
      ]
    },
    {
      id: "theory_23",
      bookTitle: "What is the purpose of establishing distinct zones in a library?",
      description: "စာကြည့်တိုက်အတွင်း ဇုန်များ (ဆိတ်ငြိမ်ဇုန်၊ ပူးပေါင်းဆောင်ရွက်မှုဇုန်၊ လူမှုရေးဇုန်) စသည်ဖြင့် ခွဲခြားသတ်မှတ်ရခြင်း အကျိုးကျေးဇူး ဖြစ်ပါသည်။",
      correctSubject: "To separate noisy collaborative activities from quiet individual study areas to ensure a productive environment for everyone (အများစုပေါင်းလုပ်ဆောင်ပြီး ဆူညံနိုင်သည့် လုပ်ငန်းများနှင့် တစ်ကိုယ်ရေဆိတ်ငြိမ်စွာ လေ့လာလိုသည့် နေရာများကို ခွဲခြားပေးရန်)",
      options: [
        "To separate noisy collaborative activities from quiet individual study areas to ensure a productive environment for everyone (အများစုပေါင်းလုပ်ဆောင်ပြီး ဆူညံနိုင်သည့် လုပ်ငန်းများနှင့် တစ်ကိုယ်ရေဆိတ်ငြိမ်စွာ လေ့လာလိုသည့် နေရာများကို ခွဲခြားပေးရန်)",
        "To segregate users based on their age or social status (အသုံးပြုသူများကို အသက်အရွယ် သို့မဟုတ် လူမှုရေးအဆင့်အတန်းအလိုက် ခွဲခြားထားရန်)",
        "To keep different languages of books in completely sealed separate rooms (မတူညီသော ဘာသာစကား စာအုပ်များကို လုံးဝအလုံပိတ်အခန်းများတွင် သီးခြားစီထားရန်)",
        "To allow only library staff in the reading areas (စာဖတ်ဧရိယာများအတွင်း စာကြည့်တိုက် ဝန်ထမ်းများကိုသာ ဝင်ခွင့်ပြုရန်)"
      ]
    }
  ];

  // Initialize active quizzes once on mount
  const [activeQuizzes, setActiveQuizzes] = useState<SubjectQuizItem[]>([]);

  useEffect(() => {
    const uncompleted = allQuizzes.filter(q => !completedIds.includes(q.id));
    // Pick up to 6 questions for this round
    const pool = uncompleted.length > 0 ? uncompleted : allQuizzes;
    const selected = [...pool].sort(() => Math.random() - 0.5).slice(0, 6);
    setActiveQuizzes(selected);
  }, []);

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
      // Persist completed IDs to localStorage
      const updatedCompleted = [...completedIds, ...sessionCompleted];
      try {
        localStorage.setItem(`sivali_completed_subject_${user.id}`, JSON.stringify(updatedCompleted));
      } catch (e) {
        console.error(e);
      }
      setCompletedIds(updatedCompleted);
      // Update high score inside database
      await updateUserScore(user.id, "subject", score);
    }
  };

  const resetGame = () => {
    setScore(0);
    setCurrentIdx(0);
    setSelectedSubject(null);
    setChecked(false);
    setGameFinished(false);
    setSessionCompleted([]);

    // Refresh active quizzes from uncompleted ones
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

  // If there are no active quizzes loaded, show loading state
  if (activeQuizzes.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 text-center text-white" id="subject-loading">
        လေ့ကျင့်ခန်းများ စစ်ဆေးနေပါသည်...
      </div>
    );
  }

  const currentQuiz = activeQuizzes[currentIdx];
  const isTheoryQuestion = currentQuiz.id.startsWith("theory_");

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
              မေးခွန်း {currentIdx + 1} / {activeQuizzes.length}
            </div>

            {/* Book Info Showcase */}
            <div className="mb-8">
              <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider block mb-1">
                {isTheoryQuestion 
                  ? "စာကြည့်တိုက်သီအိုရီ လေ့ကျင့်ခန်းမေးခွန်း (Library Science Theory)" 
                  : "စာအုပ်အညွှန်းနှင့် အကြောင်းအရာအကျဉ်း"}
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

              {completedIds.length > 0 && (
                <button
                  onClick={clearCompletionHistory}
                  className="text-xs text-red-300/60 hover:text-red-300 underline transition-all py-1"
                >
                  လေ့ကျင့်ခန်းမှတ်တမ်းကို ဖျက်ပြီး အစမှပြန်စမည် ({completedIds.length} ခု ပြီးစီး)
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
