import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw, 
  FileText, 
  Sparkles, 
  Layers, 
  Trash2, 
  FileCode, 
  Compass, 
  HelpCircle,
  RotateCcw
} from "lucide-react";
import { updateUserScore } from "../lib/db";
import { UserProfile } from "../types";

interface CatalogingGameProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onBack: () => void;
}

interface CatalogQuiz {
  id: string;
  titlePage: {
    title: string;
    subTitle?: string;
    author: string;
    publisher: string;
    place: string;
    year: string;
    isbn: string;
    edition?: string;
  };
  questions: {
    id: string;
    marcField: string;
    fieldName: string;
    correctValue: string;
    options: string[];
  }[];
}

interface LabBook {
  id: string;
  title: string;
  subTitle: string;
  author: string;
  authorInverted: string; // e.g. "Nyanika, Bhikkhu"
  edition?: string;
  place: string;
  publisher: string;
  year: string;
  pages: string;
  illustrations: string;
  size: string;
  isbn: string;
  callNumber: string;
  subjectHeading: string;
}

const mapTitlePageToLabBook = (titlePage: any, id: string): LabBook => {
  const author = titlePage.author || "Unknown Author";
  const authorParts = author.trim().split(/\s+/);
  const authorInverted = authorParts.length > 1 
    ? `${authorParts[authorParts.length - 1]}, ${authorParts.slice(0, authorParts.length - 1).join(" ")}`
    : author;

  const firstLetter = authorInverted.charAt(0).toUpperCase() || "A";
  const randomClass = ["Z695", "BQ5630", "BQ2260", "Z662"][Math.floor(Math.random() * 4)];
  const callNum = `${randomClass} .${firstLetter}${Math.floor(Math.random() * 90) + 10} ${titlePage.year || "2026"}`;

  let subject = "Library science -- Burma -- Handbooks";
  const lowerTitle = (titlePage.title || "").toLowerCase();
  if (lowerTitle.includes("buddhism") || lowerTitle.includes("vipassana") || lowerTitle.includes("dhamma")) {
    subject = "Theravada Buddhism -- Meditation -- Handbooks, manuals, etc.";
  } else if (lowerTitle.includes("history") || lowerTitle.includes("ancient")) {
    subject = "Myanmar -- History -- Sources";
  }

  return {
    id: id,
    title: titlePage.title || "Untitled Book",
    subTitle: titlePage.subTitle || "",
    author: author,
    authorInverted: authorInverted,
    edition: titlePage.edition || "1st Edition",
    place: titlePage.place || "Yangon",
    publisher: titlePage.publisher || "Universities Press",
    year: titlePage.year || "2026",
    pages: "220 pages",
    illustrations: "illustrations, diagrams",
    size: "22 cm",
    isbn: titlePage.isbn || "978-99971-0-000-0",
    callNumber: callNum,
    subjectHeading: subject
  };
};

export default function CatalogingGame({ user, onUpdateUser, onBack }: CatalogingGameProps) {
  const [activeTab, setActiveTab] = useState<"mcq" | "lab">("lab"); // Default to the interactive lab!
  const [score, setScore] = useState<number>(0);

  // ----------------------------------------------------
  // MCQ MODE STATE & LOGIC
  // ----------------------------------------------------
  const [currentQuizIdx, setCurrentQuizIdx] = useState<number>(0);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, string>>({});
  const [mcqChecked, setMcqChecked] = useState<boolean>(false);
  const [mcqFinished, setMcqFinished] = useState<boolean>(false);
  const [sessionCompleted, setSessionCompleted] = useState<string[]>([]);
  const [activeQuizzes, setActiveQuizzes] = useState<CatalogQuiz[]>([]);

  const [completedQuizIds, setCompletedQuizIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(`sivali_completed_catalog_${user.id}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const quizzes: CatalogQuiz[] = [
    {
      id: "cat_1",
      titlePage: {
        title: "Sīvali Jātaka and library science",
        subTitle: "A historical guide to monastic catalogs",
        author: "Bhikkhu Nyanika",
        publisher: "Sarpay Beikman Publishing House",
        place: "Yangon, Myanmar",
        year: "2015",
        isbn: "978-3-16-148410-0",
        edition: "2nd Revised Edition"
      },
      questions: [
        {
          id: "q1_1",
          marcField: "245",
          fieldName: "Title & Statement of Responsibility (ခေါင်းစဉ်နှင့် တာဝန်ခံမှုဖော်ပြချက်)",
          correctValue: "Sīvali Jātaka and library science / Bhikkhu Nyanika",
          options: [
            "Sīvali Jātaka and library science / Bhikkhu Nyanika",
            "Bhikkhu Nyanika : Sīvali Jātaka and library science",
            "Library Science guide by Bhikkhu Nyanika",
            "Sīvali Jātaka - 2nd Revised Edition"
          ]
        },
        {
          id: "q1_2",
          marcField: "100",
          fieldName: "Main Entry - Personal Name (ပင်မအကွက် - အာဘော်/ရေးသားသူ)",
          correctValue: "Nyanika, Bhikkhu",
          options: [
            "Bhikkhu Nyanika",
            "Nyanika, Bhikkhu",
            "Bhikkhu, Nyanika",
            "Nyanika"
          ]
        },
        {
          id: "q1_3",
          marcField: "264 / 260",
          fieldName: "Publication / Imprint (ထုတ်ဝေမှုဆိုင်ရာ အချက်အလက်များ)",
          correctValue: "Yangon : Sarpay Beikman Publishing House, 2015",
          options: [
            "Sarpay Beikman Publishing House, 2015",
            "Yangon : Sarpay Beikman Publishing House, 2015",
            "2015 - Yangon, Myanmar",
            "Sarpay Beikman House : Yangon, 2015"
          ]
        }
      ]
    },
    {
      id: "cat_2",
      titlePage: {
        title: "The Art of Monastic Cataloging",
        author: "Prof. Tin Mg Win",
        publisher: "Universities Press",
        place: "Mandalay, Myanmar",
        year: "2021",
        isbn: "978-99971-0-453-2",
        edition: "First Edition"
      },
      questions: [
        {
          id: "q2_1",
          marcField: "245",
          fieldName: "Title & Statement of Responsibility (ခေါင်းစဉ်နှင့် တာဝန်ခံမှုဖော်ပြချက်)",
          correctValue: "The Art of Monastic Cataloging / Prof. Tin Mg Win",
          options: [
            "The Art of Monastic Cataloging / Prof. Tin Mg Win",
            "Tin Mg Win (Prof.) - The Art of Monastic Cataloging",
            "Art of Monastic Cataloging, Universities Press",
            "Mandalay : Universities Press, 2021"
          ]
        },
        {
          id: "q2_2",
          marcField: "100",
          fieldName: "Main Entry - Personal Name (ပင်မအကွက် - အာဘော်/ရေးသားသူ)",
          correctValue: "Tin Mg Win, Prof.",
          options: [
            "Prof. Tin Mg Win",
            "Tin Mg Win, Prof.",
            "Win, Tin Mg (Prof.)",
            "Tin Mg Win"
          ]
        },
        {
          id: "q2_3",
          marcField: "020",
          fieldName: "ISBN (အပြည်ပြည်ဆိုင်ရာ စာအုပ်စံနှုန်းနံပါတ်)",
          correctValue: "9789997104532",
          options: [
            "978-99971-0-453-2",
            "9789997104532",
            "ISBN 9789997104532",
            "978-99971-0-453-2 (First Edition)"
          ]
        }
      ]
    }
  ];

  const [aiGenerating, setAiGenerating] = useState<boolean>(false);

  useEffect(() => {
    async function fetchCustomAndInit() {
      try {
        const { getCustomQuestions } = await import("../lib/db");
        const cqs = await getCustomQuestions("cataloging");
        const customQuizzes = cqs.map((q: any) => q.questionData);
        
        const combined = [...customQuizzes, ...quizzes];
        const uncompleted = combined.filter(q => !completedQuizIds.includes(q.id));
        const pool = uncompleted.length > 0 ? uncompleted : combined;
        const selected = [...pool].sort(() => Math.random() - 0.5);
        setActiveQuizzes(selected);

        // Load custom questions into the interactive lab books array as well!
        const customLabBooks = customQuizzes.map((q: any) => mapTitlePageToLabBook(q.titlePage, q.id));
        setActiveLabBooks([...customLabBooks, ...labBooks]);
      } catch (err) {
        console.error("Error loading custom cataloging questions:", err);
        const uncompleted = quizzes.filter(q => !completedQuizIds.includes(q.id));
        const pool = uncompleted.length > 0 ? uncompleted : quizzes;
        const selected = [...pool].sort(() => Math.random() - 0.5);
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
        body: JSON.stringify({ gameType: "cataloging" })
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }

      // Save to firestore custom_questions
      const { addCustomQuestion } = await import("../lib/db");
      await addCustomQuestion("cataloging", 1, data);

      // Prepend to active quizzes immediately
      setActiveQuizzes(prev => [data, ...prev]);
      setCurrentQuizIdx(0);
      setMcqAnswers({});
      setMcqChecked(false);
      
      // Also add to activeLabBooks immediately so the user can practice it in the Lab!
      const newLabBook = mapTitlePageToLabBook(data.titlePage, data.id);
      setActiveLabBooks(prev => [newLabBook, ...prev]);
      setCurrentLabIdx(0);
      setLabStep(1);
      setSelectedBlocks([]);
      setStepChecked(false);
      setStepError(null);
      setCardTitleResponsibility("");
      setCardImprint("");
      setCardPhysicalDesc("");
      
      alert("✨ AI ဆရာတော်မှ သင့်အတွက် အသစ်စက်စက် ကတ်တလောက် သင်ခန်းစာမေးခွန်းတစ်ခုကို အောင်မြင်စွာ ဖန်တီးပေးလိုက်ပါပြီ။");
    } catch (err) {
      console.error(err);
      alert("AI သင်ခန်းစာ တောင်းဆိုရန် အဆင်မပြေပါ။ နောက်မှ ပြန်လည်ကြိုးစားပါ။");
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSelectOption = (questionId: string, option: string) => {
    if (mcqChecked) return;
    setMcqAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleCheckMcqAnswers = () => {
    if (activeQuizzes.length === 0) return;
    const quiz = activeQuizzes[currentQuizIdx];
    let correctCount = 0;
    
    quiz.questions.forEach(q => {
      if (mcqAnswers[q.id] === q.correctValue) {
        correctCount++;
      }
    });

    setScore(prev => prev + (correctCount * 35));
    setMcqChecked(true);

    if (correctCount === quiz.questions.length) {
      setSessionCompleted(prev => [...prev, quiz.id]);
    }
  };

  const handleNextQuiz = async () => {
    setMcqAnswers({});
    setMcqChecked(false);
    if (currentQuizIdx < activeQuizzes.length - 1) {
      setCurrentQuizIdx(prev => prev + 1);
    } else {
      setMcqFinished(true);
      const updatedCompleted = [...completedQuizIds, ...sessionCompleted];
      try {
        localStorage.setItem(`sivali_completed_catalog_${user.id}`, JSON.stringify(updatedCompleted));
      } catch (e) {
        console.error(e);
      }
      setCompletedQuizIds(updatedCompleted);

      // Update score in Firestore
      const updatedUser = await updateUserScore(user.id, "cataloging", score);
      if (updatedUser) onUpdateUser(updatedUser);
    }
  };

  const resetMcq = () => {
    setCurrentQuizIdx(0);
    setMcqAnswers({});
    setMcqChecked(false);
    setMcqFinished(false);
    setSessionCompleted([]);
  };

  // ----------------------------------------------------
  // CARD CATALOG & MARC INTERACTIVE LAB STATE & LOGIC
  // ----------------------------------------------------
  const labBooks: LabBook[] = [
    {
      id: "lab_1",
      title: "Sīvali Jātaka and library science",
      subTitle: "A historical guide to monastic catalogs",
      author: "Bhikkhu Nyanika",
      authorInverted: "Nyanika, Bhikkhu",
      edition: "2nd Revised Edition",
      place: "Yangon",
      publisher: "Sarpay Beikman Publishing House",
      year: "2015",
      pages: "245 pages",
      illustrations: "color illustrations, charts",
      size: "23 cm",
      isbn: "978-3-16-148410-0",
      callNumber: "Z695.1 .B8 N92 2015",
      subjectHeading: "Monastic libraries -- Myanmar -- Catalogs"
    },
    {
      id: "lab_2",
      title: "The Art of Monastic Cataloging",
      subTitle: "Preserving ancient palm-leaf manuscripts",
      author: "Prof. Tin Mg Win",
      authorInverted: "Tin Mg Win, Prof.",
      edition: "1st Edition",
      place: "Mandalay",
      publisher: "Universities Press",
      year: "2021",
      pages: "185 pages",
      illustrations: "photos, facsimiles",
      size: "25 cm",
      isbn: "978-99971-0-453-2",
      callNumber: "Z662 .T46 2021",
      subjectHeading: "Manuscripts, Burmese -- Conservation and restoration"
    },
    {
      id: "lab_3",
      title: "Vipassana Meditation Handbook",
      subTitle: "A practical guide to mindfulness of breathing",
      author: "Sayadaw U Jotika",
      authorInverted: "Jotika, Sayadaw U",
      edition: "4th Edition",
      place: "Yangon",
      publisher: "Kaba Aye Publishing",
      year: "2019",
      pages: "142 pages",
      illustrations: "illustrations",
      size: "19 cm",
      isbn: "978-99971-5-124-1",
      callNumber: "BQ5630 .J68 2019",
      subjectHeading: "Vipassana (Meditation) -- Theravada Buddhism"
    },
    {
      id: "lab_4",
      title: "Buddhist Monastic Code & Vinaya Studies",
      subTitle: "An analytical study of the training rules for bhikkhus",
      author: "Daw Khin Myo Aye",
      authorInverted: "Khin Myo Aye, Daw",
      edition: "3rd Edition",
      place: "Yangon",
      publisher: "Sīvali Publishing House",
      year: "2024",
      pages: "310 pages",
      illustrations: "diagrams, tables",
      size: "22 cm",
      isbn: "978-1-2345-678-9",
      callNumber: "BQ2260 .K45 2024",
      subjectHeading: "Buddhist law -- Vinayapitaka -- Handbooks, manuals, etc."
    }
  ];

  const [activeLabBooks, setActiveLabBooks] = useState<LabBook[]>(labBooks);
  const [currentLabIdx, setCurrentLabIdx] = useState<number>(0);
  const labBook = activeLabBooks[currentLabIdx] || activeLabBooks[0] || labBooks[0];

  // Steps in the lab:
  // 1. MARC 245 assembly (Title Statement)
  // 2. MARC 260 / 264 assembly (Imprint/Publication)
  // 3. MARC 300 assembly (Physical Description)
  // 4. MARC Tag matching
  const [labStep, setLabStep] = useState<1 | 2 | 3 | 4 | 5>(1); // Step 5 is complete/feedback

  // Assembly Puzzles States
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [stepChecked, setStepChecked] = useState<boolean>(false);
  const [stepError, setStepError] = useState<string | null>(null);

  // Completed blocks for catalog card live rendering
  const [cardTitleResponsibility, setCardTitleResponsibility] = useState<string>("");
  const [cardImprint, setCardImprint] = useState<string>("");
  const [cardPhysicalDesc, setCardPhysicalDesc] = useState<string>("");

  // Tag matching state
  // User matches rows (e.g. "020", "100", "245", "260", "300", "650")
  const [tagMatches, setTagMatches] = useState<Record<string, string>>({
    "020": "",
    "100": "",
    "245": "",
    "260": "",
    "300": "",
    "650": ""
  });

  const correctTags = {
    "020": "ISBN (အပြည်ပြည်ဆိုင်ရာ စာအုပ်စံနှုန်းနံပါတ်)",
    "100": "Personal Name Main Entry (ရေးသားသူ ပင်မအကွက်)",
    "245": "Title & Statement of Responsibility (ခေါင်းစဉ်နှင့် တာဝန်ခံမှု)",
    "260": "Imprint / Publication Statement (ထုတ်ဝေမှုအချက်အလက်)",
    "300": "Physical Description (ရုပ်ပိုင်းဆိုင်ရာ ဖော်ပြချက်)",
    "650": "Subject Added Entry (ဘာသာရပ်ခေါင်းစဉ်အညွှန်း)"
  };

  const tagOptions = [
    "020",
    "100",
    "245",
    "260",
    "300",
    "650"
  ];

  const tagRows = [
    { key: "020", label: "ISBN (978-3-16-148410-0 etc.)" },
    { key: "100", label: "ရေးသားသူအမည် အလှည့်ဆင့်ရေးနည်း (e.g., Jotika, Sayadaw U)" },
    { key: "245", label: "ခေါင်းစဉ်၊ ကော်လံခွဲ၊ စလတ်စောင်းနှင့် ရေးသူအမည် (e.g., Title : Subtitle / Author.)" },
    { key: "260", label: "ထုတ်ဝေရာမြို့၊ ကော်လံ၊ ထုတ်ဝေသူနှင့် ကော်မာခုနှစ် (e.g., Yangon : Sarpay Beikman, 2015.)" },
    { key: "300", label: "စာမျက်နှာ၊ ကော်လံပုံနှိပ်ချက်၊ စီမီးကော်လံအရွယ်အစား (e.g., 245 p. : ill. ; 23 cm.)" },
    { key: "650", label: "စာအုပ်ခေါင်းစဉ် ဘာသာရပ်အညွှန်းကုဒ် (Subject Headings)" }
  ];

  // Block definitions for assembly steps
  // 1. Title/Statement of responsibility
  const getStep1Blocks = () => {
    return [
      { text: labBook.title, type: "field" },
      { text: " : ", type: "punc" },
      { text: labBook.subTitle, type: "field" },
      { text: " / ", type: "punc" },
      { text: labBook.author, type: "field" },
      { text: ".", type: "punc" }
    ].sort(() => Math.random() - 0.5);
  };

  // 2. Imprint/Publication
  const getStep2Blocks = () => {
    return [
      { text: labBook.place, type: "field" },
      { text: " : ", type: "punc" },
      { text: labBook.publisher, type: "field" },
      { text: ", ", type: "punc" },
      { text: labBook.year, type: "field" },
      { text: ".", type: "punc" }
    ].sort(() => Math.random() - 0.5);
  };

  // 3. Physical Description
  const getStep3Blocks = () => {
    return [
      { text: labBook.pages, type: "field" },
      { text: " : ", type: "punc" },
      { text: labBook.illustrations, type: "field" },
      { text: " ; ", type: "punc" },
      { text: labBook.size, type: "field" },
      { text: ".", type: "punc" }
    ].sort(() => Math.random() - 0.5);
  };

  const [availableBlocks, setAvailableBlocks] = useState<{ text: string, type: string }[]>([]);

  useEffect(() => {
    if (activeTab === "lab") {
      if (labStep === 1) {
        setAvailableBlocks(getStep1Blocks());
        setSelectedBlocks([]);
        setStepChecked(false);
        setStepError(null);
      } else if (labStep === 2) {
        setAvailableBlocks(getStep2Blocks());
        setSelectedBlocks([]);
        setStepChecked(false);
        setStepError(null);
      } else if (labStep === 3) {
        setAvailableBlocks(getStep3Blocks());
        setSelectedBlocks([]);
        setStepChecked(false);
        setStepError(null);
      } else if (labStep === 4) {
        setStepChecked(false);
        setStepError(null);
      }
    }
  }, [currentLabIdx, labStep, activeTab]);

  const handleBlockClick = (blockText: string) => {
    if (stepChecked) return;
    setSelectedBlocks(prev => [...prev, blockText]);
    setAvailableBlocks(prev => prev.filter(b => b.text !== blockText));
  };

  const handleUndoBlock = (blockText: string) => {
    if (stepChecked) return;
    setSelectedBlocks(prev => prev.filter(t => t !== blockText));
    // Determine type
    let type = "field";
    if ([" : ", " / ", ", ", " ; ", "."].includes(blockText)) {
      type = "punc";
    }
    setAvailableBlocks(prev => [...prev, { text: blockText, type }]);
  };

  const handleResetStep = () => {
    if (stepChecked) return;
    if (labStep === 1) setAvailableBlocks(getStep1Blocks());
    else if (labStep === 2) setAvailableBlocks(getStep2Blocks());
    else if (labStep === 3) setAvailableBlocks(getStep3Blocks());
    setSelectedBlocks([]);
    setStepError(null);
  };

  const handleVerifyStep = () => {
    const assembled = selectedBlocks.join("");
    let correct = "";

    if (labStep === 1) {
      correct = `${labBook.title} : ${labBook.subTitle} / ${labBook.author}.`;
      if (assembled === correct) {
        setCardTitleResponsibility(correct);
        setScore(prev => prev + 50);
        setStepChecked(true);
        setStepError(null);
      } else {
        setStepError("အစဉ်လိုက်မမှန်ကန်ပါ သို့မဟုတ် သင်္ကေတ / ကွက်လပ် လွဲမှားနေပါသည်! (AACR2/ISBD စည်းမျဉ်းအရ Title : Subtitle / Author. ဖြစ်ရပါမည်။ သင်္ကေတများ၏ ရှေ့/နောက် ဝှိုက်စပေ့များကို သတိပြုပါ!)");
      }
    } else if (labStep === 2) {
      correct = `${labBook.place} : ${labBook.publisher}, ${labBook.year}.`;
      if (assembled === correct) {
        setCardImprint(correct);
        setScore(prev => prev + 50);
        setStepChecked(true);
        setStepError(null);
      } else {
        setStepError("အစဉ်လိုက်မမှန်ကန်ပါ! (ISBD စည်းမျဉ်းအရ Place : Publisher, Year. ဖြစ်ရပါမည်။ ကော်လံ ' : ' နှင့် ကော်မာ ', ' သုံးစွဲပုံကို မှန်အောင်စီပါ!)");
      }
    } else if (labStep === 3) {
      correct = `${labBook.pages} : ${labBook.illustrations} ; ${labBook.size}.`;
      if (assembled === correct) {
        setCardPhysicalDesc(correct);
        setScore(prev => prev + 50);
        setStepChecked(true);
        setStepError(null);
      } else {
        setStepError("အစဉ်လိုက်မမှန်ကန်ပါ! (ISBD စည်းမျဉ်းအရ Pages : Illustrations ; Size. ဖြစ်ရပါမည်။ စီမီးကော်လံ ' ; ' ၏ ရှေ့နောက် space ကို သတိပြုပါ!)");
      }
    }
  };

  const handleVerifyTags = () => {
    // Check tags matching
    let allCorrect = true;
    const items = Object.entries(tagMatches);
    items.forEach(([tag, val]) => {
      if (val !== tag) {
        allCorrect = false;
      }
    });

    if (allCorrect) {
      setScore(prev => prev + 100);
      setStepChecked(true);
      setStepError(null);
    } else {
      setStepError("တချို့သော MARC 21 Tag များကို လွဲမှားစွာ တွဲစပ်ထားပါသည်! ထပ်မံစစ်ဆေးပေးပါ။");
    }
  };

  const handleNextLabStep = async () => {
    if (labStep < 4) {
      setLabStep(prev => (prev + 1) as any);
    } else {
      // Completed book in lab
      setLabStep(5);
      // Save score in Firebase
      const updatedUser = await updateUserScore(user.id, "cataloging", score);
      if (updatedUser) onUpdateUser(updatedUser);
    }
  };

  const handleNextLabBook = () => {
    setCardTitleResponsibility("");
    setCardImprint("");
    setCardPhysicalDesc("");
    setTagMatches({
      "020": "",
      "100": "",
      "245": "",
      "260": "",
      "300": "",
      "650": ""
    });
    setLabStep(1);
    if (currentLabIdx < labBooks.length - 1) {
      setCurrentLabIdx(prev => prev + 1);
    } else {
      setCurrentLabIdx(0);
    }
  };

  const handleSelectTagMatch = (rowKey: string, matchedTag: string) => {
    setTagMatches(prev => ({
      ...prev,
      [rowKey]: matchedTag
    }));
  };

  return (
    <div className="w-full">
      {/* Header Glassmorphism */}
      <div className="glass-card p-6 rounded-3xl mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="text-pink-400 w-7 h-7" />
            <span>Cataloging & Punctuation Lab</span>
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            စာကြည့်တိုက် ကတ်ပြား ကတ်တလောက်ရေးသွင်းခြင်းနှင့် MARC 21 Tags များ၊ ISBD သင်္ကေတများ လေ့ကျင့်ခန်း
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={handleAskAi}
            disabled={aiGenerating}
            className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-purple-500 border border-pink-400 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(236,72,153,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0 animate-pulse hover:animate-none"
          >
            {aiGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-glow" />}
            <span>{aiGenerating ? "AI ဖန်တီးပေးနေပါသည်..." : "AI သင်ခန်းစာအသစ်တောင်းမည်"}</span>
          </button>
          <div className="bg-white/10 px-3 py-2 rounded-2xl border border-white/20 text-center">
            <div className="text-[10px] text-slate-400">စုစုပေါင်းရမှတ်</div>
            <div className="text-lg font-extrabold text-pink-400">{score} pts</div>
          </div>
          <button 
            onClick={onBack}
            className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10 text-white text-sm transition-all cursor-pointer"
          >
            ပင်မစာမျက်နှာသို့
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-white/10 mb-6 gap-2">
        <button
          onClick={() => {
            setActiveTab("lab");
            resetMcq();
          }}
          className={`px-5 py-3 text-xs sm:text-sm font-extrabold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "lab"
              ? "border-pink-500 text-pink-300 bg-pink-500/10 rounded-t-xl"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4 text-pink-400" />
          <span>(၁) ကတ်ပြားရေးဆွဲနည်းနှင့် သင်္ကေတ လေ့ကျင့်ခန်း (Lab)</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("mcq");
            setLabStep(1);
          }}
          className={`px-5 py-3 text-xs sm:text-sm font-extrabold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "mcq"
              ? "border-purple-500 text-purple-300 bg-purple-500/10 rounded-t-xl"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <FileText className="w-4 h-4 text-purple-400" />
          <span>(၂) RDA/MARC Fields သီအိုရီဉာဏ်စမ်း (MCQ)</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* ========================================== */}
        {/* TAB 1: CARD CATALOGING & PUNCTUATION LAB */}
        {/* ========================================== */}
        {activeTab === "lab" && (
          <motion.div
            key="catalog_lab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Column: Cover & Book Metadata */}
            <div className="lg:col-span-4 space-y-6">
              {/* Title Page cover view */}
              <div className="glass-card p-6 rounded-3xl border border-pink-500/20 relative overflow-hidden shadow-2xl bg-[#140b2f]/90">
                <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl" />
                <div className="text-center pb-4 border-b border-white/10">
                  <span className="text-[10px] uppercase font-mono tracking-widest bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full border border-pink-500/30">
                    TITLE PAGE (မျက်နှာဖုံး)
                  </span>
                </div>

                <div className="py-6 text-center space-y-4">
                  <div className="text-xs text-pink-300 font-bold uppercase tracking-wider">Book Information</div>
                  <h3 className="text-xl font-extrabold text-white leading-relaxed text-glow-pink">
                    {labBook.title}
                  </h3>
                  <p className="text-xs text-slate-300 italic">{labBook.subTitle}</p>
                  
                  <div className="pt-2">
                    <span className="text-[10px] text-slate-400 block">AUTHOR (ရေးသားသူ)</span>
                    <span className="text-sm font-bold text-white">{labBook.author}</span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Edition (ပုံနှိပ်အကြိမ်):</span>
                    <span className="font-bold text-pink-300">{labBook.edition || "1st Edition"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Place (ထုတ်ဝေရာအရပ်):</span>
                    <span className="text-white font-semibold">{labBook.place}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Publisher (ထုတ်ဝေသူ):</span>
                    <span className="text-white font-semibold">{labBook.publisher}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Year (ခုနှစ်):</span>
                    <span className="text-cyan-300 font-bold font-mono">{labBook.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pages (စာမျက်နှာ):</span>
                    <span className="text-white">{labBook.pages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Illustrations (ပုံဖော်ချက်):</span>
                    <span className="text-white truncate max-w-[150px]">{labBook.illustrations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Size (အရွယ်အစား):</span>
                    <span className="text-white">{labBook.size}</span>
                  </div>
                  <div className="flex justify-between bg-white/5 p-2 rounded-xl border border-white/5">
                    <span className="text-slate-400 font-mono">ISBN:</span>
                    <span className="text-white font-bold font-mono">{labBook.isbn}</span>
                  </div>
                </div>
              </div>

              {/* Progress Stepper and Instruction Guide */}
              <div className="glass-card p-5 rounded-3xl border border-white/10 bg-[#0c051a]">
                <h4 className="text-xs font-black text-pink-300 uppercase tracking-widest mb-3">လေ့ကျင့်မှုအဆင့်ဆင့်</h4>
                <div className="space-y-2.5">
                  {[
                    { s: 1, label: "ခေါင်းစဉ်နှင့် တာဝန်ခံမှုဖော်ပြချက် (MARC 245)" },
                    { s: 2, label: "ထုတ်ဝေမှု အချက်အလက် (MARC 260/264)" },
                    { s: 3, label: "ရုပ်ပိုင်းဆိုင်ရာ ဖော်ပြချက် (MARC 300)" },
                    { s: 4, label: "MARC 21 Tag များ တွဲစပ်ခြင်း" },
                    { s: 5, label: "လေ့ကျင့်မှု အောင်မြင်စွာ ပြီးဆုံးခြင်း" }
                  ].map((stepItem) => {
                    const isDone = labStep > stepItem.s;
                    const isCurrent = labStep === stepItem.s;
                    return (
                      <div key={stepItem.s} className="flex items-center gap-3">
                        <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                          isDone 
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                            : isCurrent
                              ? "bg-pink-500 border-pink-400 text-white shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                              : "bg-white/5 border-white/10 text-slate-500"
                        }`}>
                          {isDone ? "✓" : stepItem.s}
                        </div>
                        <span className={`text-xs ${isCurrent ? "text-white font-bold" : isDone ? "text-slate-400 line-through" : "text-slate-500"}`}>
                          {stepItem.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Lab Workspace & Live Catalog Card */}
            <div className="lg:col-span-8 space-y-6">
              {/* Virtual Catalog Index Card Render */}
              <div className="space-y-2">
                <label className="text-xs font-black text-pink-300 uppercase tracking-wider block">
                  VIRTUAL CATALOG CARD (၃ x ၅ လက်မ ကတ်ပြား ကတ်တလောက် ကွန်ပြူတာပုံရိပ်)
                </label>
                <div className="bg-[#FAF6EA] text-[#2c2415] border border-[#e4d9bc] rounded-3xl p-6 shadow-2xl relative font-mono text-[11px] leading-relaxed min-h-[250px] transition-all overflow-hidden flex flex-col justify-between">
                  {/* Card Red Top Horizontal Line */}
                  <div className="absolute top-[55px] left-0 right-0 h-[1px] bg-red-400/40" />
                  
                  {/* Card Blue Vertical Indentation Lines */}
                  {/* First Indentation */}
                  <div className="absolute top-0 bottom-0 left-[65px] w-[1px] bg-blue-400/30" />
                  {/* Second Indentation */}
                  <div className="absolute top-0 bottom-0 left-[85px] w-[1px] bg-blue-400/20" />

                  <div>
                    {/* Call number (Top-Left area, outside left margin) */}
                    <div className="absolute top-4 left-4 text-[10px] font-bold leading-tight select-none">
                      {labBook.callNumber.split(" ").map((part, i) => (
                        <div key={i}>{part}</div>
                      ))}
                    </div>

                    {/* Main Entry - Personal name (Top lines starting at 1st Indent) */}
                    <div className="pl-[72px] pt-1.5 min-h-[28px]">
                      <span className="font-extrabold text-[#111] tracking-wide select-all">
                        {labBook.authorInverted}
                      </span>
                    </div>

                    {/* Body Paragraph - starting at 2nd indent, wrapping back to 1st indent */}
                    <div className="pl-[72px] mt-2 relative">
                      <div className="text-[#333] tracking-wide text-justify select-all whitespace-normal">
                        {/* 2nd indent margin on first line, then regular indent */}
                        <span className="inline-block w-[20px]" />
                        <span>
                          {cardTitleResponsibility || <span className="text-amber-700/35 border-b border-dashed border-amber-600/30">................ [ခေါင်းစဉ်နှင့် ရေးသူ ဖြည့်သွင်းရန်] ................</span>}
                        </span>
                        
                        {cardImprint && (
                          <span className="ml-1">
                            {cardImprint}
                          </span>
                        )}
                      </div>

                      {cardPhysicalDesc && (
                        <div className="mt-2 text-[#333] select-all whitespace-normal">
                          <span className="inline-block w-[20px]" />
                          <span>{cardPhysicalDesc}</span>
                        </div>
                      )}

                      {(cardPhysicalDesc || cardImprint) && (
                        <div className="mt-3 text-[10px] text-[#444] select-all">
                          <span className="inline-block w-[20px]" />
                          <span>1. {labBook.subjectHeading}. I. Title.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hole at bottom of catalog card */}
                  <div className="w-6 h-6 rounded-full border border-amber-300/40 bg-[#f4eecf] mx-auto flex items-center justify-center self-end mb-1 select-none">
                    <div className="w-1 h-1 rounded-full bg-[#FAF6EA]" />
                  </div>
                </div>
              </div>

              {/* Lab Step Interactive Card Controller */}
              <div className="glass-card p-6 md:p-8 rounded-3xl min-h-[280px] flex flex-col justify-between bg-[#160d36]/90 border border-white/10">
                {labStep <= 3 && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-black text-pink-400 uppercase tracking-widest bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
                        အဆင့် {labStep}: Block စီစဉ်ခြင်းနှင့် ISBD သင်္ကေတများ ထည့်သွင်းခြင်း
                      </span>
                      <span className="text-[10px] text-slate-400">AACR2 / ISBD Syntax Rules</span>
                    </div>

                    <p className="text-sm text-slate-200 font-semibold mb-3 leading-relaxed">
                      {labStep === 1 && "ခေါင်းစဉ်နှင့် တာဝန်ခံမှုအပိုင်းကို အောက်ပါကွက်လပ်တွင် အစီအစဉ်တကျဖြစ်အောင် ရွေးချယ်ပါ။ ISBD သင်္ကေတများဖြစ်သည့် ' : ' (ကော်လံ)၊ ' / ' (စလတ်စောင်း) များနှင့် '.' (အစက်) များကို မှန်ကန်စွာ နေရာချပေးပါ။"}
                      {labStep === 2 && "ထုတ်ဝေမှုဆိုင်ရာ အချက်အလက်များကို အစီအစဉ်တကျဖြစ်အောင် ရွေးချယ်ပါ။ ထုတ်ဝေရာမြို့၊ ကော်လံ ' : '၊ ထုတ်ဝေသူ၊ ကော်မာ ', ' နှင့် ထုတ်ဝေနှစ်တို့ကို စနစ်တကျစီပါ။"}
                      {labStep === 3 && "ရုပ်ပိုင်းဆိုင်ရာ ဖော်ပြချက် (Physical Description) ကို စီပါ။ စာမျက်နှာ၊ ပုံဖော်ချက်၊ အရွယ်အစားနှင့် သင်္ကေတများဖြစ်သည့် ' : ' နှင့် ' ; ' တို့ကို မှန်ကန်စွာ တွဲစပ်ပါ။"}
                    </p>

                    {/* Assembled Result Field */}
                    <div className="bg-black/45 p-4 rounded-2xl border border-white/10 min-h-[55px] flex flex-wrap items-center gap-1.5 mb-6">
                      {selectedBlocks.length === 0 ? (
                        <span className="text-xs text-slate-500 italic">အောက်ပါ Block များကို ကလစ်နှိပ်ပြီး အစဉ်လိုက်စီသွင်းပါ...</span>
                      ) : (
                        selectedBlocks.map((blockText, index) => {
                          const isPunc = [" : ", " / ", ", ", " ; ", "."].includes(blockText);
                          return (
                            <button
                              key={index}
                              onClick={() => handleUndoBlock(blockText)}
                              disabled={stepChecked}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1 select-none ${
                                stepChecked 
                                  ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                                  : isPunc
                                    ? "bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500 text-pink-300 cursor-pointer"
                                    : "bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400 text-purple-200 cursor-pointer"
                              }`}
                              title="ကလစ်နှိပ်ပြီး ပြန်ထုတ်ရန်"
                            >
                              <span>{blockText}</span>
                              {!stepChecked && <span className="text-[9px] text-slate-400">✕</span>}
                            </button>
                          );
                        })
                      )}
                    </div>

                    {/* Error Alerts */}
                    {stepError && (
                      <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs mb-4 flex items-start gap-2 animate-shake">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{stepError}</span>
                      </div>
                    )}

                    {stepChecked && (
                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs mb-4 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block mb-0.5">ဂုဏ်ယူပါသည်! အဖြေမှန်ကန်ပါသည်။ (+50 points)</strong>
                          <span className="text-[11px] text-slate-300">ISBD သင်္ကေတများနှင့် ဝှိုက်စပေ့များကို စနစ်တကျ မှန်ကန်စွာ အသုံးပြုနိုင်ခဲ့ပါသည်။</span>
                        </div>
                      </div>
                    )}

                    {/* Available Blocks Pool */}
                    {!stepChecked && (
                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block">
                          ရွေးချယ်ရန် BLOCK များ (AVAILABLE BLOCKS)
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {availableBlocks.map((block, i) => (
                            <button
                              key={i}
                              onClick={() => handleBlockClick(block.text)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all border cursor-pointer ${
                                block.type === "punc"
                                  ? "bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/40 text-pink-300 shadow-[0_0_8px_rgba(236,72,153,0.15)]"
                                  : "bg-[#251552]/80 hover:bg-[#2e1a66] border-white/10 text-white"
                              }`}
                            >
                              {block.text === " : " ? "Colon ( : )" : block.text === " / " ? "Slash ( / )" : block.text === " ; " ? "Semicolon ( ; )" : block.text === ", " ? "Comma ( , )" : block.text === "." ? "Dot ( . )" : block.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: MARC Tag Matching Practice */}
                {labStep === 4 && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-black text-pink-400 uppercase tracking-widest bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
                        အဆင့် ၄: MARC 21 Tags များ တွဲစပ်ခြင်း
                      </span>
                      <span className="text-[10px] text-slate-400">Standard Metadata Tags</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 mb-5">
                      အောက်ပါ စာကြည့်တိုက် cataloging ဖော်ပြချက်တစ်ခုချင်းစီအတွက် မှန်ကန်သော **MARC 21 Tag** ကို ရွေးချယ်ပေးပါ။
                    </p>

                    <div className="space-y-3 mb-6">
                      {tagRows.map((row) => (
                        <div key={row.key} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-white/5 p-3 rounded-2xl border border-white/10">
                          <div className="md:col-span-8">
                            <span className="text-xs text-white font-bold block">{row.label}</span>
                          </div>
                          <div className="md:col-span-4">
                            <select
                              value={tagMatches[row.key]}
                              onChange={(e) => handleSelectTagMatch(row.key, e.target.value)}
                              disabled={stepChecked}
                              className="w-full bg-[#1e0e47] border border-white/20 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-pink-500 cursor-pointer"
                            >
                              <option value="">-- ရွေးချယ်ရန် --</option>
                              {tagOptions.map((opt) => (
                                <option key={opt} value={opt}>Tag {opt}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>

                    {stepError && (
                      <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs mb-4 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>{stepError}</span>
                      </div>
                    )}

                    {stepChecked && (
                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs mb-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <strong className="font-bold">MARC Tags များ အားလုံး မှန်ကန်စွာ တွဲစပ်ပြီးပါပြီ! (+100 points)</strong>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 5: Completed Book Lab Feedback */}
                {labStep === 5 && (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                      <Award className="text-white w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-extrabold text-white mb-2">ဒီစာအုပ်အတွက် လက်တွေ့ ကတ်တလောက် ရေးဆွဲပြီးပါပြီ။</h3>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-6">
                      AACR2 စည်းမျဉ်းများနှင့်အညီ ISBD သင်္ကေတများ (`/ ; : , .`) ကိုလည်းကောင်း၊ MARC 21 standard metadata tags များကိုလည်းကောင်း အောင်မြင်စွာ လေ့ကျင့်နိုင်ခဲ့ပါသည်။
                    </p>

                    <button
                      onClick={handleNextLabBook}
                      className="px-6 py-3 rounded-2xl font-bold bg-pink-500 hover:bg-pink-600 text-white text-xs sm:text-sm shadow-lg flex items-center gap-1.5 mx-auto transition-all cursor-pointer"
                    >
                      <span>နောက်ထပ် စာအုပ်တစ်အုပ် လေ့ကျင့်မည်</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Footer Buttons for Lab */}
                {labStep < 5 && (
                  <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-6">
                    <div>
                      {labStep <= 3 && !stepChecked && (
                        <button
                          onClick={handleResetStep}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>ပြန်စမည်</span>
                        </button>
                      )}
                    </div>

                    <div>
                      {!stepChecked ? (
                        <button
                          onClick={labStep === 4 ? handleVerifyTags : handleVerifyStep}
                          disabled={(labStep <= 3 && selectedBlocks.length === 0) || (labStep === 4 && Object.values(tagMatches).some(v => v === ""))}
                          className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                            ((labStep <= 3 && selectedBlocks.length > 0) || (labStep === 4 && !Object.values(tagMatches).some(v => v === "")))
                              ? "bg-pink-500 hover:bg-pink-600 text-white cursor-pointer shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                              : "bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed"
                          }`}
                        >
                          အဖြေစစ်မည်
                        </button>
                      ) : (
                        <button
                          onClick={handleNextLabStep}
                          className="px-6 py-2.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm flex items-center gap-1 cursor-pointer shadow-md transition-all animate-pulse"
                        >
                          <span>ရှေ့သို့သွားမည်</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================== */}
        {/* TAB 2: THEORY MULTIPLE CHOICE QUESTIONS */}
        {/* ========================================== */}
        {activeTab === "mcq" && (
          <motion.div
            key="catalog_mcq"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {!mcqFinished ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Title Page Render (3D Glass Sheet) */}
                <div className="lg:col-span-5">
                  <div className="glass-card p-6 rounded-3xl h-full border border-white/20 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden bg-[#150a2b]">
                    {/* Visual Glow */}
                    <div className="absolute -top-12 -left-12 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />
                    <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl" />
                    
                    {/* Title Page Content */}
                    <div className="text-center py-6 border-b border-white/10 relative z-10">
                      <span className="text-[10px] tracking-widest font-extrabold text-purple-400 uppercase bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                        TITLE PAGE (မျက်နှာဖုံး)
                      </span>
                      {activeQuizzes.length > 0 && (
                        <>
                          <h3 className="text-xl font-extrabold text-white mt-6 leading-relaxed text-glow-purple">
                            {activeQuizzes[currentQuizIdx]?.titlePage?.title}
                          </h3>
                          {activeQuizzes[currentQuizIdx]?.titlePage?.subTitle && (
                            <p className="text-slate-300 text-xs italic mt-2">
                              {activeQuizzes[currentQuizIdx]?.titlePage?.subTitle}
                            </p>
                          )}
                          {activeQuizzes[currentQuizIdx]?.titlePage?.edition && (
                            <p className="text-cyan-300 text-[10px] font-semibold mt-4 bg-cyan-500/10 inline-block px-3 py-1 rounded-lg border border-cyan-500/20">
                              {activeQuizzes[currentQuizIdx]?.titlePage?.edition}
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    <div className="text-center py-6 relative z-10">
                      <span className="text-[10px] text-slate-400 block mb-1">ရေးသားသူ -</span>
                      <span className="text-base font-bold text-white tracking-wide">
                        {activeQuizzes[currentQuizIdx]?.titlePage?.author}
                      </span>
                    </div>

                    <div className="border-t border-white/10 pt-4 text-center text-xs text-slate-300 space-y-1.5 relative z-10">
                      <div>
                        <span className="text-slate-400">ထုတ်ဝေသူ - </span>
                        <strong className="text-white">{activeQuizzes[currentQuizIdx]?.titlePage?.publisher}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">ထုတ်ဝေရာအရပ် - </span>
                        <strong className="text-white">{activeQuizzes[currentQuizIdx]?.titlePage?.place}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">ခုနှစ် - </span>
                        <strong className="text-cyan-300 font-mono font-bold">{activeQuizzes[currentQuizIdx]?.titlePage?.year}</strong>
                      </div>
                      <div className="bg-white/5 py-1 px-3 rounded-xl border border-white/5 inline-block mt-3">
                        <span className="text-slate-400 font-mono text-[10px]">ISBN: </span>
                        <span className="text-white font-mono font-bold text-[10px] tracking-wider">{activeQuizzes[currentQuizIdx]?.titlePage?.isbn}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Questions Form */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  <div className="glass-card p-6 md:p-8 rounded-3xl flex-1 flex flex-col justify-between bg-[#110724]">
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider block">
                          မေးခွန်းတွဲ {currentQuizIdx + 1} / {activeQuizzes.length}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" /> RDA/MARC Fields
                        </span>
                      </div>

                      <div className="space-y-5">
                        {activeQuizzes[currentQuizIdx]?.questions?.map((q) => {
                          const userAns = mcqAnswers[q.id];
                          const allAnswered = activeQuizzes[currentQuizIdx].questions.every(question => mcqAnswers[question.id] !== undefined);
                          
                          return (
                            <div key={q.id} className="bg-white/5 p-4 rounded-2xl border border-white/10">
                              <label className="text-xs text-purple-300 font-bold block mb-2 uppercase tracking-wide">
                                MARC Field {q.marcField} — <span className="text-white text-xs">{q.fieldName}</span>
                              </label>
                              
                              <div className="grid grid-cols-1 gap-1.5">
                                {q.options.map((opt) => {
                                  const isSelected = userAns === opt;
                                  const isCorrect = opt === q.correctValue;
                                  
                                  let btnClass = "text-left p-3 rounded-xl text-xs border transition-all cursor-pointer flex items-center justify-between text-white border-white/10 bg-white/5 hover:bg-white/10";
                                  if (isSelected && !mcqChecked) {
                                    btnClass = "text-left p-3 rounded-xl text-xs border transition-all cursor-pointer flex items-center justify-between bg-purple-500/20 border-purple-400 text-purple-200 font-medium";
                                  } else if (mcqChecked) {
                                    if (isCorrect) {
                                      btnClass = "text-left p-3 rounded-xl text-xs border transition-all flex items-center justify-between bg-emerald-500/30 border-emerald-400 text-emerald-200 font-medium";
                                    } else if (isSelected) {
                                      btnClass = "text-left p-3 rounded-xl text-xs border transition-all flex items-center justify-between bg-red-500/30 border-red-400 text-red-200 font-medium";
                                    } else {
                                      btnClass = "opacity-40 text-left p-3 rounded-xl text-xs border border-white/15 bg-white/5 text-slate-400 flex items-center justify-between";
                                    }
                                  }

                                  return (
                                    <button
                                      key={opt}
                                      onClick={() => handleSelectOption(q.id, opt)}
                                      disabled={mcqChecked}
                                      className={btnClass}
                                    >
                                      <span>{opt}</span>
                                      {mcqChecked && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                                      {mcqChecked && isSelected && !isCorrect && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 border-t border-white/10 pt-6 mt-6">
                      {!mcqChecked ? (
                        <button
                          onClick={handleCheckMcqAnswers}
                          disabled={activeQuizzes.length > 0 && !activeQuizzes[currentQuizIdx]?.questions?.every(q => mcqAnswers[q.id] !== undefined)}
                          className={`px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
                            (activeQuizzes.length > 0 && activeQuizzes[currentQuizIdx]?.questions?.every(q => mcqAnswers[q.id] !== undefined))
                              ? "bg-purple-500 hover:bg-purple-600 text-white cursor-pointer"
                              : "bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed"
                          }`}
                        >
                          အဖြေစစ်မည်
                        </button>
                      ) : (
                        <button
                          onClick={handleNextQuiz}
                          className="px-6 py-3 rounded-2xl font-bold bg-purple-500 hover:bg-purple-600 text-white text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                        >
                          <span>ရှေ့သို့</span>
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* MCQ FINISHED SCREEN */
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-card p-8 md:p-12 rounded-3xl text-center max-w-xl mx-auto"
              >
                <div className="w-20 h-20 bg-gradient-to-tr from-purple-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <Award className="text-white w-10 h-10" />
                </div>

                <h3 className="text-2xl font-extrabold text-white mb-2">သီအိုရီမေးခွန်းများ ပြီးဆုံးပါပြီ။</h3>
                <p className="text-slate-300 mb-6 text-sm max-w-md mx-auto">
                  စာအုပ်များ၏ RDA / AACR2 MARC fields ဆိုင်ရာ သီအိုရီဗဟုသုတများကို ဆန်းစစ်လေ့ကျင့်မှု ပြီးဆုံးသွားပြီ ဖြစ်သည်။
                </p>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 max-w-xs mx-auto mb-6">
                  <div className="text-xs text-slate-400">ရမှတ်စုစုပေါင်း</div>
                  <div className="text-2xl font-black text-purple-400">{score} pts</div>
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={resetMcq}
                    className="px-5 py-3 rounded-2xl font-bold border border-white/15 hover:bg-white/10 text-white transition-all text-xs sm:text-sm cursor-pointer"
                  >
                    ပြန်ဆော့မည်
                  </button>
                  <button
                    onClick={onBack}
                    className="px-6 py-3 rounded-2xl font-bold bg-purple-500 hover:bg-purple-600 text-white text-xs sm:text-sm cursor-pointer"
                  >
                    ပင်မစာမျက်နှာသို့
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
