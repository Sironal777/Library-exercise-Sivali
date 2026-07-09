export interface LccClass {
  code: string;
  name: string;
  burmeseName: string;
  subclasses?: {
    code: string;
    name: string;
    burmeseName: string;
  }[];
}

export interface LccBookPractice {
  id: string;
  title: string;
  description: string;
  correctClass: string;     // Primary class letter, e.g. "Q", "B", "T"
  correctSubclass: string;  // Subclass code, e.g. "QA", "BQ", "TK"
  subclassNameMyan: string; // Burmese name of subclass, e.g. "သင်္ချာ (Mathematics)"
  explanation: string;      // Burmese detailed cataloger explanation
}

export const lccClasses: LccClass[] = [
  {
    code: "A",
    name: "General Works",
    burmeseName: "အထွေထွေနှင့် ဗဟုသုတအဝဝဆိုင်ရာစာပေများ",
    subclasses: [
      { code: "AC", name: "Collections. Series. Collected works", burmeseName: "စုစည်းထားသော စာစုများနှင့် စာစဉ်များ" },
      { code: "AE", name: "Encyclopedias", burmeseName: "စွယ်စုံကျမ်းများ" },
      { code: "AG", name: "Dictionaries and other general reference works", burmeseName: "အထွေထွေ အကိုးအကားကျမ်းများနှင့် ပြဋ္ဌာန်းချက်များ" },
      { code: "AM", name: "Museums. Collectors and collecting", burmeseName: "ပြတိုက်များ၊ စုဆောင်းမှုနှင့် စုဆောင်းသူများ" },
      { code: "AN", name: "Newspapers", burmeseName: "သတင်းစာများ" },
      { code: "AP", name: "Periodicals", burmeseName: "မဂ္ဂဇင်းနှင့် ဂျာနယ်များ (သီးသန့်ကာလအပိုင်းအခြားထွက်)" },
      { code: "AY", name: "Yearbooks. Almanacs. Directories", burmeseName: "နှစ်ချုပ်စာအုပ်များ၊ ပြက္ခဒိန်များနှင့် လမ်းညွှန်များ" },
      { code: "AZ", name: "History of scholarship and learning", burmeseName: "ပညာသင်ကြားမှုနှင့် သင်ယူမှုဆိုင်ရာ သမိုင်းကြောင်း" }
    ]
  },
  {
    code: "B",
    name: "Philosophy. Psychology. Religion",
    burmeseName: "ဒဿနိကဗေဒ၊ စိတ်ပညာနှင့် ဘာသာရေး",
    subclasses: [
      { code: "B", name: "Philosophy (General)", burmeseName: "အထွေထွေ ဒဿနိကဗေဒ" },
      { code: "BC", name: "Logic", burmeseName: "ယုတ္တိဗေဒ" },
      { code: "BD", name: "Speculative philosophy", burmeseName: "စိန္တာမယဒဿနိကဗေဒ" },
      { code: "BF", name: "Psychology", burmeseName: "စိတ်ပညာရပ်" },
      { code: "BH", name: "Aesthetics", burmeseName: "ဝေဖန်ဆန်းစစ်မှုနှင့် အလှအပဗေဒ (ရသဗေဒ)" },
      { code: "BJ", name: "Ethics", burmeseName: "ကျင့်ဝတ်နှင့် လူမှုနီတိပညာ" },
      { code: "BL", name: "Religions. Mythology", burmeseName: "အထွေထွေဘာသာရေးနှင့် ဒဏ္ဍာရီများ" },
      { code: "BM", name: "Judaism", burmeseName: "ဂျူးဘာသာရေး" },
      { code: "BP", name: "Islam. Bahaism. Theosophy", burmeseName: "အစ္စလာမ်ဘာသာ၊ ဘာဟိုင်းဘာသာနှင့် သီအိုဆိုဖီ" },
      { code: "BQ", name: "Buddhism", burmeseName: "ဗုဒ္ဓဘာသာ (BQ စာပေနှင့် ကျမ်းဂန်များ)" },
      { code: "BR", name: "Christianity", burmeseName: "ခရစ်ယာန်ဘာသာ" }
    ]
  },
  {
    code: "C",
    name: "Auxiliary Sciences of History",
    burmeseName: "သမိုင်းကူပညာရပ်များ (သမိုင်းအထောက်အကူပြုသိပ္ပံ)",
    subclasses: [
      { code: "CB", name: "History of Civilization", burmeseName: "လူ့ယဉ်ကျေးမှု သမိုင်းစဉ်" },
      { code: "CC", name: "Archaeology", burmeseName: "ရှေးဟောင်းသုတေသနပညာ" },
      { code: "CD", name: "Archives. Seals", burmeseName: "မော်ကွန်းတိုက်ပညာနှင့် တံဆိပ်ခတ်နှိပ်မှုများ" },
      { code: "CE", name: "Technical Chronology. Calendar", burmeseName: "အချိန်တွက်ချက်မှုပညာနှင့် ပြက္ခဒိန်စနစ်များ" },
      { code: "CJ", name: "Numismatics", burmeseName: "ဒင်္ဂါးနှင့် အကြွေစေ့များ လေ့လာမှုပညာ" },
      { code: "CN", name: "Inscriptions. Epigraphy", burmeseName: "ကျောက်စာနှင့် ကမ္ပည်းစာပညာ" },
      { code: "CR", name: "Heraldry", burmeseName: "အဆောင်အယောင်နှင့် တံဆိပ်အမှတ်အသားများ" },
      { code: "CS", name: "Genealogy", burmeseName: "ဆွေစဉ်မျိုးဆက် လေ့လာမှုဗေဒ" },
      { code: "CT", name: "Biography", burmeseName: "အတ္ထုပ္ပတ္တိများ" }
    ]
  },
  {
    code: "D",
    name: "History: General and Old World",
    burmeseName: "ကမ္ဘာ့သမိုင်း (အာရှ၊ ဥရောပ၊ အာဖရိက သမိုင်းအဝဝ)",
    subclasses: [
      { code: "D", name: "History (General)", burmeseName: "အထွေထွေ ကမ္ဘာ့သမိုင်း" },
      { code: "DA", name: "Great Britain", burmeseName: "ဗြိတိန်နိုင်ငံသမိုင်း" },
      { code: "DC", name: "France", burmeseName: "ပြင်သစ်နိုင်ငံသမိုင်း" },
      { code: "DD", name: "Germany", burmeseName: "ဂျာမနီနိုင်ငံသမိုင်း" },
      { code: "DF", name: "Greece", burmeseName: "ဂရိနိုင်ငံသမိုင်း" },
      { code: "DG", name: "Italy", burmeseName: "အီတလီနိုင်ငံသမိုင်း" },
      { code: "DK", name: "Russia. Soviet Union. Poland", burmeseName: "ရုရှား၊ ဆိုဗီယက်ယူနီယံဟောင်းနှင့် ပိုလန်သမိုင်း" },
      { code: "DS", name: "Asia", burmeseName: "အာရှတိုက်သမိုင်း (မြန်မာနိုင်ငံသမိုင်းသည် DS527 တွင်ရှိသည်)" },
      { code: "DT", name: "Africa", burmeseName: "အာဖရိကတိုက်သမိုင်း" },
      { code: "DU", name: "Oceania (South Seas)", burmeseName: "အိုရှေးနီးယားနှင့် ပစိဖိတ်သမိုင်း" }
    ]
  },
  {
    code: "E",
    name: "History: America",
    burmeseName: "အမေရိကတိုက် အထွေထွေနှင့် အမေရိကန်ပြည်ထောင်စုသမိုင်း",
    subclasses: [
      { code: "E", name: "America (General) & United States (General)", burmeseName: "အမေရိကတိုက်နှင့် အမေရိကန်အထွေထွေသမိုင်း" }
    ]
  },
  {
    code: "F",
    name: "History: America Local",
    burmeseName: "အမေရိကန်ပြည်နယ်ဒေသတွင်းသမိုင်းနှင့် ဗြိတိသျှ/ပြင်သစ်အမေရိကသမိုင်း",
    subclasses: [
      { code: "F", name: "United States Local History & Canada, Latin America", burmeseName: "အမေရိကန်ဒေသန္တရ၊ ကနေဒါနှင့် လက်တင်အမေရိကသမိုင်း" }
    ]
  },
  {
    code: "G",
    name: "Geography. Anthropology. Recreation",
    burmeseName: "ပထဝီဝင်၊ လူသားဗေဒ၊ အားကစားနှင့် ဖျော်ဖြေရေး",
    subclasses: [
      { code: "G", name: "Geography (General). Atlases. Maps", burmeseName: "အထွေထွေပထဝီဝင်၊ မြေပုံညွှန်းစာအုပ်နှင့် မြေပုံများ" },
      { code: "GA", name: "Mathematical geography. Cartography", burmeseName: "သင်္ချာနည်းကျပထဝီဝင်နှင့် မြေပုံဆွဲပညာ" },
      { code: "GB", name: "Physical geography", burmeseName: "ရူပပထဝီဝင် (သဘာဝမြေမျက်နှာသွင်ပြင်)" },
      { code: "GC", name: "Oceanography", burmeseName: "သမုဒ္ဒရာဗေဒ" },
      { code: "GE", name: "Environmental Sciences", burmeseName: "ပတ်ဝန်းကျင်ထိန်းသိမ်းရေး သိပ္ပံပညာရပ်များ" },
      { code: "GF", name: "Human ecology. Anthropogeography", burmeseName: "လူမှုဂေဟစနစ်နှင့် လူသားပထဝီဝင်" },
      { code: "GN", name: "Anthropology", burmeseName: "လူသားဗေဒ (လူမျိုးနွယ်စုများ လေ့လာခြင်း)" },
      { code: "GR", name: "Folklore", burmeseName: "ပုံပြင်၊ ဒဏ္ဍာရီနှင့် ရိုးရာစကားရပ်များ" },
      { code: "GT", name: "Manners and customs (General)", burmeseName: "ရိုးရာဓလေ့ထုံးတမ်းများနှင့် လူမှုယဉ်ကျေးမှုများ" },
      { code: "GV", name: "Recreation. Leisure. Athletics", burmeseName: "အားကစား၊ ကစားနည်းများ၊ ကိုယ်ကာယနှင့် ဖျော်ဖြေရေး" }
    ]
  },
  {
    code: "H",
    name: "Social Sciences",
    burmeseName: "လူမှုရေးသိပ္ပံပညာရပ်များ (စီးပွားရေးနှင့် လူမှုဗေဒ)",
    subclasses: [
      { code: "H", name: "Social sciences (General)", burmeseName: "အထွေထွေ လူမှုရေးသိပ္ပံ" },
      { code: "HA", name: "Statistics", burmeseName: "စာရင်းအင်းကိန်းဂဏန်းများ လေ့လာမှုပညာ" },
      { code: "HB", name: "Economic theory. Demography", burmeseName: "စီးပွားရေးသီအိုရီနှင့် လူဦးရေစာရင်းဗေဒ" },
      { code: "HC", name: "Economic history and conditions", burmeseName: "စီးပွားရေးသမိုင်းနှင့် လက်ရှိအခြေအနေများ" },
      { code: "HD", name: "Industries. Land use. Labor", burmeseName: "စက်မှုလက်မှုလုပ်ငန်း၊ မြေယာအသုံးချမှုနှင့် အလုပ်သမားရေးရာ" },
      { code: "HE", name: "Transportation and communications", burmeseName: "သယ်ယူပို့ဆောင်ရေးနှင့် ဆက်သွယ်ရေးလုပ်ငန်းများ" },
      { code: "HF", name: "Commerce (Accounting, Business)", burmeseName: "ကုန်သွယ်မှု (စာရင်းကိုင်နှင့် စီးပွားရေးစီမံခန့်ခွဲမှု)" },
      { code: "HG", name: "Finance (Money, Banking, Insurance)", burmeseName: "ဘဏ္ဍာရေး (ငွေကြေး၊ ဘဏ်လုပ်ငန်းနှင့် အာမခံလုပ်ငန်း)" },
      { code: "HM", name: "Sociology (General)", burmeseName: "အထွေထွေ လူမှုဗေဒ" },
      { code: "HN", name: "Social history. Social problems", burmeseName: "လူမှုရေးသမိုင်း၊ လူမှုရေးပြဿနာများနှင့် ပြုပြင်ပြောင်းလဲမှု" },
      { code: "HQ", name: "The family. Marriage. Women", burmeseName: "မိသားစု၊ အိမ်ထောင်ရေး၊ အမျိုးသမီးရေးရာနှင့် လိင်မှုလေ့လာချက်" },
      { code: "HS", name: "Societies: secret, benevolent", burmeseName: "အသင်းအဖွဲ့များ၊ အများအကျိုးပြုအသင်းများနှင့် လျှို့ဝှက်အသင်းများ" },
      { code: "HT", name: "Communities. Classes. Races", burmeseName: "လူမှုအသိုင်းအဝိုင်းများ၊ လူတန်းစားများနှင့် လူမျိုးစုများ" },
      { code: "HV", name: "Social pathology. Criminology. Welfare", burmeseName: "လူမှုရေးဆိုင်ရာ ချို့ယွင်းချက်များ၊ မှုခင်းဗေဒနှင့် လူမှုဝန်ထမ်း" },
      { code: "HX", name: "Socialism. Communism. Anarchism", burmeseName: "ဆိုရှယ်လစ်စနစ်၊ ကွန်မြူနစ်စနစ်နှင့် အနာဂတ်ဝါဒများ" }
    ]
  },
  {
    code: "J",
    name: "Political Science",
    burmeseName: "နိုင်ငံရေးသိပ္ပံပညာရပ်များ",
    subclasses: [
      { code: "J", name: "General legislative and executive papers", burmeseName: "ဥပဒေပြုရေးနှင့် အုပ်ချုပ်ရေးဆိုင်ရာ အထွေထွေစာရွက်စာတမ်းများ" },
      { code: "JA", name: "Political science (General)", burmeseName: "အထွေထွေ နိုင်ငံရေးသိပ္ပံ" },
      { code: "JC", name: "Political theory", burmeseName: "နိုင်ငံရေးသီအိုရီနှင့် ဝါဒများ" },
      { code: "JF", name: "Political institutions & Public administration", burmeseName: "နိုင်ငံရေးအဖွဲ့အစည်းများနှင့် ပြည်သူ့ဝန်ထမ်းစီမံခန့်ခွဲမှု" },
      { code: "JK", name: "Political institutions (United States)", burmeseName: "အမေရိကန်ပြည်ထောင်စု နိုင်ငံရေးအဖွဲ့အစည်းများ" },
      { code: "JQ", name: "Political institutions (Asia, Africa, Australia)", burmeseName: "အာရှ၊ အာဖရိက၊ အိုရှေးနီးယား နိုင်ငံရေးအဖွဲ့အစည်းများ (မြန်မာနိုင်ငံ JQ1062)" },
      { code: "JS", name: "Local government. Municipal government", burmeseName: "ဒေသန္တရအစိုးရနှင့် စည်ပင်သာယာရေးအုပ်ချုပ်မှု" },
      { code: "JV", name: "Colonies and colonization. Immigration", burmeseName: "ကိုလိုနီနယ်ချဲ့မှု၊ ရွှေ့ပြောင်းနေထိုင်မှုနှင့် လူဝင်မှုကြီးကြပ်ရေး" },
      { code: "JZ", name: "International relations", burmeseName: "နိုင်ငံတကာဆက်ဆံရေးပညာရပ်" }
    ]
  },
  {
    code: "K",
    name: "Law",
    burmeseName: "ဥပဒေပညာရပ်များ",
    subclasses: [
      { code: "K", name: "Law in general. Comparative law", burmeseName: "အထွေထွေဥပဒေနှင့် နှိုင်းယှဉ်ဥပဒေပညာ" },
      { code: "KB", name: "Religious law in general", burmeseName: "ဘာသာရေးဆိုင်ရာ အထွေထွေဥပဒေများ" },
      { code: "KBP", name: "Islamic law", burmeseName: "အစ္စလာမ်သာသနာ့ဥပဒေ (Sharia)" },
      { code: "KBQ", name: "Buddhist law", burmeseName: "ဗုဒ္ဓဘာသာဆိုင်ရာ ဓမ္မသတ်နှင့် ဝိနည်းဥပဒေများ" },
      { code: "KD", name: "Law of the United Kingdom and Ireland", burmeseName: "ယူကေနှင့် အိုင်ယာလန်ဥပဒေ" },
      { code: "KF", name: "Law of the United States", burmeseName: "အမေရိကန်ပြည်ထောင်စုဥပဒေ" },
      { code: "KI", name: "Law of Indigenous peoples", burmeseName: "ဌာနေတိုင်းရင်းသားများ၏ ရိုးရာဥပဒေ" },
      { code: "KK", name: "Law of Germany", burmeseName: "ဂျာမနီဥပဒေ" },
      { code: "KP", name: "Law of Myanmar", burmeseName: "မြန်မာနိုင်ငံတော် ဖွဲ့စည်းပုံနှင့် ပြစ်မှု/တရားမ ဥပဒေများ" },
      { code: "KZ", name: "Law of nations. International Law", burmeseName: "နိုင်ငံတကာဥပဒေနှင့် သဘောတူစာချုပ်များ" }
    ]
  },
  {
    code: "L",
    name: "Education",
    burmeseName: "ပညာရေးနှင့် သင်ကြားမှုပညာရပ်များ",
    subclasses: [
      { code: "L", name: "Education (General)", burmeseName: "အထွေထွေ ပညာရေး" },
      { code: "LA", name: "History of education", burmeseName: "ပညာရေးသမိုင်းကြောင်း" },
      { code: "LB", name: "Theory and practice of education (Teaching)", burmeseName: "ပညာရေးသီအိုရီနှင့် လက်တွေ့သင်ကြားမှုစနစ် (ဆရာဖြစ်ပညာ)" },
      { code: "LC", name: "Special aspects of education (Literacy)", burmeseName: "ပညာရေးဆိုင်ရာ အထူးကဏ္ဍများ (စာတတ်မြောက်ရေး၊ အသက်မွေးဝမ်းကျောင်း)" },
      { code: "LG", name: "Individual institutions (Asia, Africa)", burmeseName: "အာရှ၊ အာဖရိက တက္ကသိုလ်ကျောင်းများ (မြန်မာနိုင်ငံ တက္ကသိုလ်များ)" },
      { code: "LT", name: "Textbooks", burmeseName: "ပြဋ္ဌာန်းစာအုပ်များနှင့် လေ့ကျင့်ခန်းစာအုပ်များ" }
    ]
  },
  {
    code: "M",
    name: "Music",
    burmeseName: "ဂီတနှင့် တေးသီချင်းဆိုင်ရာစာပေများ",
    subclasses: [
      { code: "M", name: "Music (Scores)", burmeseName: "တေးသီချင်းသင်္ကေတများ (နုတ်စ်နှင့် သံစဉ်စာရွက်များ)" },
      { code: "ML", name: "Literature of music", burmeseName: "ဂီတသမိုင်း၊ သီချင်းစာသားများနှင့် အတ္ထုပ္ပတ္တိများ" },
      { code: "MT", name: "Instruction and study", burmeseName: "ဂီတတီးခတ်မှု သင်ကြားရေးနှင့် လေ့ကျင့်ရေးစနစ်" }
    ]
  },
  {
    code: "N",
    name: "Fine Arts",
    burmeseName: "ပန်းချီ၊ ပန်းပု၊ ဗိသုကာနှင့် အနုပညာရပ်များ",
    subclasses: [
      { code: "N", name: "Visual arts (General)", burmeseName: "အထွေထွေ အမြင်အနုပညာရပ်များ" },
      { code: "NA", name: "Architecture", burmeseName: "ဗိသုကာလက်ရာနှင့် ဒီဇိုင်းပညာရပ်" },
      { code: "NB", name: "Sculpture", burmeseName: "ပန်းပုထုဆစ်ခြင်းပညာ" },
      { code: "NC", name: "Drawing. Design. Illustration", burmeseName: "ပန်းချီဆွဲခြင်း၊ ဒီဇိုင်းရေးဆွဲခြင်းနှင့် သရုပ်ဖော်ပုံပညာ" },
      { code: "ND", name: "Painting", burmeseName: "ဆေးရေးပန်းချီပညာရပ်" },
      { code: "NE", name: "Printmaking", burmeseName: "ပုံနှိပ်ပန်းချီထွင်းခြင်းပညာ" },
      { code: "NK", name: "Decorative arts", burmeseName: "အလှဆင်အနုပညာနှင့် ပရိဘောဂဒီဇိုင်း" },
      { code: "NX", name: "Arts in general", burmeseName: "အထွေထွေ အနုပညာပေါင်းစုံလေ့လာချက်" }
    ]
  },
  {
    code: "P",
    name: "Language and Literature",
    burmeseName: "ဘာသာစကား၊ သဒ္ဒါနှင့် စာပေအနုပညာ",
    subclasses: [
      { code: "P", name: "Philology. Linguistics (General)", burmeseName: "ဘာသာဗေဒနှင့် ဘာသာစကားဆိုင်ရာ အထွေထွေလေ့လာချက်" },
      { code: "PA", name: "Classical languages (Greek, Latin)", burmeseName: "ဂရိနှင့် လက်တင် ရှေးဟောင်းဘာသာစကားနှင့် စာပေ" },
      { code: "PE", name: "English language", burmeseName: "အင်္ဂလိပ်ဘာသာစကား၊ သဒ္ဒါနှင့် သင်ကြားရေး (PE1128 EFL)" },
      { code: "PJ", name: "Oriental languages and literatures", burmeseName: "အရှေ့တိုင်း ဘာသာစကားများနှင့် စာပေ" },
      { code: "PK", name: "Indo-Iranian (Sanskrit, Pali)", burmeseName: "အင်ဒို-အီရန်ဘာသာစကားများ (သက္ကတနှင့် ပါဠိသဒ္ဒါကျမ်းများ)" },
      { code: "PL", name: "Languages of Eastern Asia, Myanmar", burmeseName: "အရှေ့အာရှနှင့် မြန်မာဘာသာစကား/စာပေ (PL3921-3929 မြန်မာစာ)" },
      { code: "PN", name: "Literature (General) & Journalism, Film", burmeseName: "အထွေထွေစာပေသီအိုရီ၊ သတင်းစာပညာနှင့် ရုပ်ရှင်" },
      { code: "PR", name: "English literature", burmeseName: "အင်္ဂလိပ်ဂန္ထဝင်စာပေနှင့် ကဗျာဝတ္ထုများ" },
      { code: "PS", name: "American literature", burmeseName: "အမေရိကန်စာပေနှင့် ပြဇာတ်ဝတ္ထုများ" },
      { code: "PZ", name: "Fiction and juvenile literature", burmeseName: "ကလေးပုံပြင်များ၊ လူငယ်ဝတ္ထုများနှင့် ရုပ်ပြစာအုပ်များ" }
    ]
  },
  {
    code: "Q",
    name: "Science",
    burmeseName: "သိပ္ပံပညာရပ်များ (ရူပ၊ ဓာတု၊ ဇီဝ၊ ကွန်ပျူတာ)",
    subclasses: [
      { code: "Q", name: "Science (General)", burmeseName: "အထွေထွေ သဘာဝသိပ္ပံ" },
      { code: "QA", name: "Mathematics (Computer Science)", burmeseName: "သင်္ချာ (ကွန်ပျူတာသိပ္ပံနှင့် ဆော့ဖ်ဝဲသည် QA76 တွင်ရှိသည်)" },
      { code: "QB", name: "Astronomy", burmeseName: "နက္ခတ္တဗေဒနှင့် အာကာသသိပ္ပံ" },
      { code: "QC", name: "Physics", burmeseName: "ရူပဗေဒ" },
      { code: "QD", name: "Chemistry", burmeseName: "ဓာတုဗေဒ" },
      { code: "QE", name: "Geology", burmeseName: "ပထဝီဝင်မြေဆီလွှာဗေဒနှင့် ဘူမိဗေဒ" },
      { code: "QH", name: "Natural history - Biology", burmeseName: "သဘာဝသမိုင်းနှင့် ဇီဝဗေဒ" },
      { code: "QK", name: "Botany", burmeseName: "ရုက္ခဗေဒ (အပင်များလေ့လာခြင်း)" },
      { code: "QL", name: "Zoology", burmeseName: "သတ္တဗေဒ (တိရစ္ဆာန်များလေ့လာခြင်း)" },
      { code: "QM", name: "Human anatomy", burmeseName: "လူ့ခန္ဓာကိုယ်ဖွဲ့စည်းပုံလေ့လာမှုပညာ" },
      { code: "QP", name: "Physiology", burmeseName: "ဇီဝကမ္မဗေဒ" },
      { code: "QR", name: "Microbiology", burmeseName: "အဏုဇီဝဗေဒ (ဗိုင်းရပ်စ်နှင့် ဘက်တီးရီးယားလေ့လာခြင်း)" }
    ]
  },
  {
    code: "R",
    name: "Medicine",
    burmeseName: "ကျန်းမာရေးနှင့် ဆေးဘက်ဆိုင်ရာပညာရပ်များ",
    subclasses: [
      { code: "R", name: "Medicine (General)", burmeseName: "အထွေထွေ ဆေးပညာ" },
      { code: "RA", name: "Public health", burmeseName: "ပြည်သူ့ကျန်းမာရေးနှင့် ဆေးရုံစီမံခန့်ခွဲမှု" },
      { code: "RB", name: "Pathology", burmeseName: "ရောဂါဗေဒ" },
      { code: "RC", name: "Internal medicine (Psychiatry)", burmeseName: "ပြည်တွင်းဆေးကုသမှုပညာ (စိတ်ရောဂါကုသမှုဗေဒ RC435)" },
      { code: "RD", name: "Surgery", burmeseName: "ခွဲစိတ်ကုသမှုပညာရပ်" },
      { code: "RE", name: "Ophthalmology", burmeseName: "မျက်စိရောဂါကုသမှုပညာ" },
      { code: "RK", name: "Dentistry", burmeseName: "သွားဘက်ဆိုင်ရာ ဆေးပညာရပ်" },
      { code: "RL", name: "Dermatology", burmeseName: "အရေပြားရောဂါဗေဒ" },
      { code: "RM", name: "Therapeutics. Pharmacology", burmeseName: "ဆေးဝါးကုထုံးနှင့် ဆေးဝါးဗေဒ (ဖော်စပ်နည်း)" },
      { code: "RS", name: "Pharmacy and materia medica", burmeseName: "ဆေးဝါးပစ္စည်းထုတ်လုပ်မှုနှင့် ဆေးဝါးဆိုင်ရာများ" },
      { code: "RT", name: "Nursing", burmeseName: "သူနာပြုအတတ်ပညာရပ်" },
      { code: "RX", name: "Homeopathy", burmeseName: "ဟိုမီယိုပတ်သီ သဘာဝကုထုံးစနစ်" }
    ]
  },
  {
    code: "S",
    name: "Agriculture",
    burmeseName: "စိုက်ပျိုးရေး၊ မွေးမြူရေးနှင့် သစ်တောရေးရာ",
    subclasses: [
      { code: "S", name: "Agriculture (General)", burmeseName: "အထွေထွေ စိုက်ပျိုးရေးပညာ" },
      { code: "SB", name: "Plant culture (Horticulture)", burmeseName: "အပင်စိုက်ပျိုးမှုအတတ်နှင့် ဥယျာဉ်ခြံစိုက်ပျိုးရေး" },
      { code: "SD", name: "Forestry", burmeseName: "သစ်တောပညာနှင့် သစ်တောထိန်းသိမ်းရေး" },
      { code: "SF", name: "Animal culture (Veterinary)", burmeseName: "တိရစ္ဆာန်မွေးမြူရေးနှင့် တိရစ္ဆာန်ဆေးကုသရေးပညာ" },
      { code: "SH", name: "Aquaculture. Fisheries", burmeseName: "ငါးလုပ်ငန်း၊ ငါးမွေးမြူရေးနှင့် ရေထွက်ပစ္စည်း" },
      { code: "SK", name: "Hunting sports", burmeseName: "အမဲလိုက်အားကစားနှင့် တောရိုင်းတိရစ္ဆာန်ထိန်းသိမ်းမှု" }
    ]
  },
  {
    code: "T",
    name: "Technology",
    burmeseName: "နည်းပညာနှင့် အင်ဂျင်နီယာအတတ်ပညာရပ်များ",
    subclasses: [
      { code: "T", name: "Technology (General)", burmeseName: "အထွေထွေ နည်းပညာရပ်" },
      { code: "TA", name: "Engineering (General). Civil engineering", burmeseName: "အထွေထွေအင်ဂျင်နီယာနှင့် မြို့ပြအင်ဂျင်နီယာပညာရပ်" },
      { code: "TC", name: "Hydraulic engineering", burmeseName: "ရေအားလျှပ်စစ်နှင့် ရေစီမံခန့်ခွဲမှုအင်ဂျင်နီယာ" },
      { code: "TD", name: "Environmental technology. Sanitary engineering", burmeseName: "ပတ်ဝန်းကျင်ထိန်းသိမ်းရေး နည်းပညာနှင့် မိလ္လာမြောင်းစနစ်" },
      { code: "TE", name: "Highway engineering", burmeseName: "လမ်းတံတားဖောက်လုပ်မှု အင်ဂျင်နီယာပညာရပ်" },
      { code: "TH", name: "Building construction", burmeseName: "အဆောက်အဦဆောက်လုပ်ရေးနှင့် မီးဘေးကာကွယ်ရေး (TH9111)" },
      { code: "TJ", name: "Mechanical engineering", burmeseName: "စက်မှုအင်ဂျင်နီယာပညာရပ်" },
      { code: "TK", name: "Electrical engineering. Computer engineering", burmeseName: "လျှပ်စစ်အင်ဂျင်နီယာ၊ အီလက်ထရောနစ်နှင့် ကွန်ပျူတာနည်းပညာ" },
      { code: "TL", name: "Motor vehicles. Aeronautics. Astronautics", burmeseName: "မော်တော်ယာဉ်၊ လေကြောင်းနှင့် အာကာသယာဉ်နည်းပညာ" },
      { code: "TN", name: "Mining engineering. Metallurgy", burmeseName: "သတ္တုတွင်းအင်ဂျင်နီယာနှင့် သတ္တုဗေဒ" },
      { code: "TP", name: "Chemical technology", burmeseName: "ဓာတုနည်းပညာထုတ်လုပ်မှုနှင့် စိမ်ရည်ချက်လုပ်ငန်း" },
      { code: "TR", name: "Photography", burmeseName: "ဓာတ်ပုံရိုက်ကူးခြင်းပညာ" },
      { code: "TS", name: "Manufactures", burmeseName: "ကုန်ထုတ်လုပ်မှုနည်းပညာနှင့် ကုန်ကြမ်းထုတ်လုပ်ခြင်း" },
      { code: "TT", name: "Handicrafts. Arts and crafts", burmeseName: "လက်မှုပညာရပ်နှင့် အနုပညာလက်မှုပစ္စည်းများ" },
      { code: "TX", name: "Home economics (Cooking)", burmeseName: "အိမ်တွင်းစီးပွားရေး၊ အာဟာရဗေဒနှင့် ဟင်းချက်နည်းပညာ" }
    ]
  },
  {
    code: "U",
    name: "Military Science",
    burmeseName: "စစ်ဘက်ဆိုင်ရာပညာရပ်များနှင့် စစ်ဗျူဟာ",
    subclasses: [
      { code: "U", name: "Military science (General)", burmeseName: "အထွေထွေ စစ်ပညာရပ်" },
      { code: "UA", name: "Armies: Organization, distribution", burmeseName: "တပ်မတော်ဖွဲ့စည်းပုံ၊ တပ်ရင်းတပ်ဖွဲ့များ ဖြန့်ခွဲမှု" },
      { code: "UB", name: "Military administration", burmeseName: "စစ်ဘက်စီမံခန့်ခွဲမှုနှင့် အုပ်ချုပ်ရေး" },
      { code: "UG", name: "Military engineering. Air forces", burmeseName: "စစ်ဘက်ဆိုင်ရာအင်ဂျင်နီယာနှင့် လေတပ်ဖွဲ့များ" },
      { code: "UH", name: "Other military services", burmeseName: "အခြားစစ်ဘက်ဆိုင်ရာ ဝန်ဆောင်မှုများနှင့် စစ်ဘက်ဆေးကုသရေး" }
    ]
  },
  {
    code: "V",
    name: "Naval Science",
    burmeseName: "ရေတပ်နှင့် ရေကြောင်းသိပ္ပံပညာရပ်များ",
    subclasses: [
      { code: "V", name: "Naval science (General)", burmeseName: "အထွေထွေ ရေတပ်ပညာရပ်" },
      { code: "VA", name: "Navies: Organization, distribution", burmeseName: "ရေတပ်ဖွဲ့စည်းပုံနှင့် ဖြန့်ခွဲမှုအခြေအနေ" },
      { code: "VG", name: "Other naval services", burmeseName: "အခြားရေတပ်ဆိုင်ရာဝန်ဆောင်မှုများ" },
      { code: "VK", name: "Navigation. Merchant marine", burmeseName: "ရေကြောင်းသွားလာမှုနှင့် ကုန်သည်ရေတပ်သင်္ဘောများ" },
      { code: "VM", name: "Naval architecture. Shipbuilding", burmeseName: "သင်္ဘောဒီဇိုင်းနှင့် သင်္ဘောတည်ဆောက်မှုအင်ဂျင်နီယာ" }
    ]
  },
  {
    code: "Z",
    name: "Bibliography. Library Science. Information Resources",
    burmeseName: "စာအုပ်နှင့် ပုံနှိပ်လုပ်ငန်းသမိုင်း၊ စာကြည့်တိုက်ပညာရပ်",
    subclasses: [
      { code: "Z", name: "Libraries and Library Science", burmeseName: "စာကြည့်တိုက်များ၊ စာစုစာရင်းနှင့် စာကြည့်တိုက်သိပ္ပံ (ကတ်တလောက် Z695)" },
      { code: "ZA", name: "Information resources (General)", burmeseName: "အထွေထွေ သတင်းအချက်အလက် အရင်းအမြစ်များနှင့် အင်တာနက်ရှာဖွေမှု" }
    ]
  }
];

export const lccBooksBank: LccBookPractice[] = [
  {
    id: "lcc_b1",
    title: "Theravada Abhidhamma Studies",
    description: "A profound analysis of the seven books of Abhidhamma Pitaka, discussing consciousness, mental factors, matter, and Nibbana in detail.",
    correctClass: "B",
    correctSubclass: "BQ",
    subclassNameMyan: "ဗုဒ္ဓဘာသာ (Buddhism)",
    explanation: "အဘိဓမ္မာနှင့် ဗုဒ္ဓကျမ်းစာလေ့လာချက်ဖြစ်သောကြောင့် ဘာသာရေး (B) ၏ ကဏ္ဍခွဲဖြစ်သော ဗုဒ္ဓဘာသာ (BQ) အောက်တွင် ထည့်သွင်းရပါမည်။"
  },
  {
    id: "lcc_b2",
    title: "Introduction to Python Programming and Software Engineering",
    description: "Covers the syntax of Python, objects, classes, logic, memory management, and how to design scalable web application backends.",
    correctClass: "Q",
    correctSubclass: "QA",
    subclassNameMyan: "သင်္ချာနှင့် ကွန်ပျူတာသိပ္ပံ (Mathematics & Computer Science)",
    explanation: "ကွန်ပျူတာဆော့ဖ်ဝဲရေးဆွဲနည်းနှင့် Programming ဘာသာရပ်များကို LCC စနစ်တွင် သိပ္ပံ (Q) အုပ်စုဝင် သင်္ချာနှင့်ကွန်ပျူတာသိပ္ပံ (QA) အောက်၌ အမျိုးအစားခွဲခြားပါသည်။"
  },
  {
    id: "lcc_b3",
    title: "The Pagan Kingdom: History and Monastic Monuments of Bagan",
    description: "An intensive historic survey of the Pagan Dynasty from King Anawrahta to King Kyaswa, focus on temple architectures and ancient stone inscriptions.",
    correctClass: "D",
    correctSubclass: "DS",
    subclassNameMyan: "အာရှသမိုင်း (Asia History)",
    explanation: "ပုဂံခေတ်မြန်မာ့သမိုင်းဖြစ်သောကြောင့် ကမ္ဘာ့သမိုင်း (D) ၏ အောက်ရှိ အာရှတိုက်သမိုင်း (DS) အုပ်စုတွင် သတ်မှတ်ရပါမည်။ (မြန်မာ့သမိုင်းညွှန်းကုဒ်မှာ DS527 ဖြစ်သည်)"
  },
  {
    id: "lcc_b4",
    title: "Clinical Pediatric Medicine & Vaccine Schedules",
    description: "Comprehensive textbook detailing healthcare protocols, diagnosis, and prescription guidelines for infants, young children, and adolescents.",
    correctClass: "R",
    correctSubclass: "RJ",
    subclassNameMyan: "ကလေးကျန်းမာရေးနှင့် ကုသမှု (Pediatrics)",
    explanation: "ကလေးဆေးပညာနှင့် ကျန်းမာရေးစောင့်ရှောက်မှု ဖြစ်သောကြောင့် ဆေးပညာ (R) ၏ ကဏ္ဍခွဲဖြစ်သော ကလေးဆေးကုသမှုဗေဒ (RJ) တွင် ရှိပါသည်။"
  },
  {
    id: "lcc_b5",
    title: "Organic Chemistry: Carbon Structures and Synthesis",
    description: "Studies the atomic structures, properties, reactions, and synthesis of organic molecules containing carbon atoms.",
    correctClass: "Q",
    correctSubclass: "QD",
    subclassNameMyan: "ဓာတုဗေဒ (Chemistry)",
    explanation: "အော်ဂဲနစ်ဓာတုဗေဒ စာအုပ်ဖြစ်သောကြောင့် သိပ္ပံ (Q) ၏ ကဏ္ဍခွဲဖြစ်သော ဓာတုဗေဒ (QD) အောက်တွင် တည်ရှိပါသည်။"
  },
  {
    id: "lcc_b6",
    title: "Double-Entry Bookkeeping & Modern Corporate Accounting",
    description: "An essential manual on recording daily financial transactions, ledger preparation, balance sheets, and tax filing audits for corporate firms.",
    correctClass: "H",
    correctSubclass: "HF",
    subclassNameMyan: "ကုန်သွယ်မှုနှင့် စီးပွားရေးစီမံ (Commerce & Business)",
    explanation: "စာရင်းကိုင်ပညာနှင့် ဘဏ္ဍာရေးစာရင်းစစ်နည်းလမ်းများသည် လူမှုရေးသိပ္ပံ (H) ၏ ကဏ္ဍခွဲဖြစ်သော ကုန်သွယ်ရေးနှင့် လုပ်ငန်းစီမံခန့်ခွဲမှု (HF) အောက်တွင် ပါဝင်သည်။"
  },
  {
    id: "lcc_b7",
    title: "Burmese Grammar and Lexicography of Old Inscriptions",
    description: "A linguistic study of the evolution of the Burmese alphabet, syntax, pronunciation rules, and spelling since the 11th century Bagan ink writings.",
    correctClass: "P",
    correctSubclass: "PL",
    subclassNameMyan: "အရှေ့အာရှနှင့် မြန်မာဘာသာစကား (East Asian & Burmese Languages)",
    explanation: "မြန်မာသဒ္ဒါနှင့် ဘာသာစကားဆိုင်ရာ လေ့လာချက်ဖြစ်သောကြောင့် ဘာသာစကားနှင့် စာပေ (P) အုပ်စုဝင် အရှေ့အာရှ/မြန်မာဘာသာစကား (PL) တွင် သတ်မှတ်ရပါမည်။"
  },
  {
    id: "lcc_b8",
    title: "The Library Cataloging Manual: RDA and MARC21 Standards",
    description: "Step-by-step guidance on creating bibliographic records, handling authority controls, and applying punctuation rules for physical index cards.",
    correctClass: "Z",
    correctSubclass: "Z",
    subclassNameMyan: "စာကြည့်တိုက်ပညာ (Library Science)",
    explanation: "ကတ်တလောက်ရေးသွင်းနည်းနှင့် စာကြည့်တိုက်စီမံခန့်ခွဲမှုသည် LCC တွင် သီးခြားသတ်မှတ်ထားသော အက္ခရာ (Z) အောက်တွင် ရှိပါသည်။"
  },
  {
    id: "lcc_b9",
    title: "Design of Reinforced Concrete Structures and Foundations",
    description: "Engineering specifications for structural columns, stress resistance, soil load-bearing capacity, and bridge pillars.",
    correctClass: "T",
    correctSubclass: "TA",
    subclassNameMyan: "အထွေထွေနှင့် မြို့ပြအင်ဂျင်နီယာ (General & Civil Engineering)",
    explanation: "ကွန်ကရစ်အဆောက်အဦများနှင့် မြေအောက်အုတ်မြစ် တည်ဆောက်မှုအင်ဂျင်နီယာသည် နည်းပညာ (T) အုပ်စုဝင် မြို့ပြအင်ဂျင်နီယာ (TA) အောက်၌ ရှိပါသည်။"
  },
  {
    id: "lcc_b10",
    title: "The Mind Unveiled: Cognitive Psychology and Memory Systems",
    description: "Explores how the human brain processes sensory stimuli, stores short-term working memory, and recalls information from long-term memory networks.",
    correctClass: "B",
    correctSubclass: "BF",
    subclassNameMyan: "စိတ်ပညာ (Psychology)",
    explanation: "ဦးနှောက်၏ မှတ်ဉာဏ်နှင့် အချက်အလက်တုံ့ပြန်မှုဆိုင်ရာ သိမြင်မှုစိတ်ပညာဖြစ်၍ ဒဿန/စိတ်ပညာ (B) အုပ်စုဝင် စိတ်ပညာရပ် (BF) တွင် တည်ရှိသည်။"
  },
  {
    id: "lcc_b11",
    title: "Encyclopædia of Global Monastic Traditions",
    description: "An exhaustive multi-volume reference work documenting the monastic orders, daily schedules, and rule sheets of monks and nuns globally.",
    correctClass: "A",
    correctSubclass: "AE",
    subclassNameMyan: "စွယ်စုံကျမ်းများ (Encyclopedias)",
    explanation: "ဘာသာရပ်ပေါင်းစုံ စုစည်းဖော်ပြထားသော စွယ်စုံကျမ်းကြီးဖြစ်သောကြောင့် အထွေထွေ (A) ၏ ကဏ္ဍခွဲဖြစ်သော စွယ်စုံကျမ်းများ (AE) တွင် ထည့်ရမည်။"
  },
  {
    id: "lcc_b12",
    title: "Microbial Pathogens: Virology and Infectious Diseases",
    description: "Deep dive into the molecular structure of RNA viruses, bacteria colonies, and replication mechanisms that trigger global epidemics.",
    correctClass: "Q",
    correctSubclass: "QR",
    subclassNameMyan: "အဏုဇီဝဗေဒ (Microbiology)",
    explanation: "ဗိုင်းရပ်စ်နှင့် ပိုးမွှားများအကြောင်း သိပ္ပံနည်းကျလေ့လာမှုဖြစ်သောကြောင့် သိပ္ပံ (Q) ၏ ကဏ္ဍခွဲဖြစ်သော အဏုဇီဝဗေဒ (QR) အောက်တွင် ရှိပါသည်။"
  },
  {
    id: "lcc_b13",
    title: "Constitutional Law of the Republic of the Union of Myanmar",
    description: "A meticulous legal compilation and analytical study of the executive, legislative, and judicial boundaries under the Myanmar constitution.",
    correctClass: "K",
    correctSubclass: "KP",
    subclassNameMyan: "မြန်မာနိုင်ငံဥပဒေ (Law of Myanmar)",
    explanation: "မြန်မာနိုင်ငံတော်၏ တရားဥပဒေနှင့် ဖွဲ့စည်းပုံအခြေခံဥပဒေဖြစ်၍ ဥပဒေ (K) အုပ်စုဝင် မြန်မာဥပဒေကဏ္ဍ (KP) အောက်တွင် ပါဝင်ပါသည်။"
  },
  {
    id: "lcc_b14",
    title: "Modern Rice Farming Techniques and Soil Nutrition",
    description: "Agronomic guidelines for growing high-yield paddy fields in tropical climates, focusing on nitrogen fertilizer formulas and pest management.",
    correctClass: "S",
    correctSubclass: "SB",
    subclassNameMyan: "အပင်စိုက်ပျိုးမှုအတတ် (Plant Culture / Horticulture)",
    explanation: "စပါးစိုက်ပျိုးရေးနှင့် မြေဆီလွှာအဟာရထိန်းသိမ်းနည်းဖြစ်သောကြောင့် စိုက်ပျိုးရေး (S) ၏ ကဏ္ဍခွဲဖြစ်သော သီးနှံ/အပင်စိုက်ပျိုးရေး (SB) တွင် ပါဝင်ပါသည်။"
  },
  {
    id: "lcc_b15",
    title: "Electrical Grid Integration and High Voltage Transformers",
    description: "Mathematical models and wiring diagrams for connecting wind power plants into national high-voltage power transmission networks.",
    correctClass: "T",
    correctSubclass: "TK",
    subclassNameMyan: "လျှပ်စစ်နှင့် ကွန်ပျူတာအင်ဂျင်နီယာ (Electrical & Computer Engineering)",
    explanation: "လျှပ်စစ်ဓာတ်အားလိုင်းနှင့် ထရန်စဖော်မာ နည်းပညာဖြစ်သောကြောင့် နည်းပညာ (T) ၏ ကဏ္ဍခွဲဖြစ်သော လျှပ်စစ်နှင့်ကွန်ပျူတာအင်ဂျင်နီယာ (TK) အောက်တွင် ရှိပါသည်။"
  },
  {
    id: "lcc_b16",
    title: "History of Classical European Architecture: From Athens to Rome",
    description: "Traces the structural engineering and style of marble temples, arches, domes, columns, and public forums in Ancient Greece and Italy.",
    correctClass: "N",
    correctSubclass: "NA",
    subclassNameMyan: "ဗိသုကာပညာ (Architecture)",
    explanation: "ရှေးဟောင်းဂရိနှင့် ရောမခေတ် အဆောက်အဦဒီဇိုင်းလက်ရာများအကြောင်းဖြစ်၍ အနုပညာ (N) ၏ ကဏ္ဍခွဲဖြစ်သော ဗိသုကာပညာ (NA) အောက်၌ ရှိပါသည်။"
  },
  {
    id: "lcc_b17",
    title: "Sociology of the Digital Age: Communities and Social Media",
    description: "An analysis of human social networks, cybercultures, online group identity, and digital polarization in contemporary societies.",
    correctClass: "H",
    correctSubclass: "HM",
    subclassNameMyan: "အထွေထွေလူမှုဗေဒ (General Sociology)",
    explanation: "လူမှုအဖွဲ့အစည်းများနှင့် အွန်လိုင်းလူမှုအပြုအမူများဆိုင်ရာ လူမှုဗေဒလေ့လာချက်ဖြစ်၍ လူမှုရေးသိပ္ပံ (H) အုပ်စုဝင် အထွေထွေလူမှုဗေဒ (HM) တွင် သတ်မှတ်သည်။"
  },
  {
    id: "lcc_b18",
    title: "The Battle of Mandalay: World War II Military Tactics",
    description: "A chronological battlefield record of the military strategies, logistics, and air support maneuvers during the 1945 liberation of Upper Burma.",
    correctClass: "D",
    correctSubclass: "DS",
    subclassNameMyan: "အာရှသမိုင်း (Asia History)",
    explanation: "ဒုတိယကမ္ဘာ့စစ်အတွင်း မန္တလေးတိုက်ပွဲ သမိုင်းစဉ်ဖြစ်သောကြောင့် ကမ္ဘာ့သမိုင်း (D) ၏ ကဏ္ဍခွဲဖြစ်သော အာရှသမိုင်း (DS) တွင် ထည့်သွင်းရပါမည်။"
  },
  {
    id: "lcc_b19",
    title: "Sayadaw's Guide to Monastic School Classroom Management",
    description: "Pedagogical guidelines for monastics to handle large classrooms, structure lesson plans, and deliver ethical values to primary children.",
    correctClass: "L",
    correctSubclass: "LB",
    subclassNameMyan: "သင်ကြားရေးသီအိုရီနှင့် လက်တွေ့ (Theory & Practice of Teaching)",
    explanation: "စာသင်ခန်းစီမံခန့်ခွဲမှုနှင့် ဆရာဖြစ်ပညာရပ်ဆိုင်ရာ သင်ကြားမှုလမ်းညွှန်ဖြစ်သောကြောင့် ပညာရေး (L) ၏ ကဏ္ဍခွဲဖြစ်သော သင်ကြားမှုသီအိုရီနှင့်လက်တွေ့ (LB) အောက်၌ တည်ရှိသည်။"
  },
  {
    id: "lcc_b20",
    title: "Ancient Greek Logic and Speculative Thought",
    description: "Deals with Aristotle's syllogisms, truth tables, arguments, and speculative reasoning of the early Western classical philosophers.",
    correctClass: "B",
    correctSubclass: "BC",
    subclassNameMyan: "ယုတ္တိဗေဒ (Logic)",
    explanation: "အယူအဆများ၏ အမှားအမှန် ခွဲခြားပုံနှင့် ယုတ္တိဗေဒဆိုင်ရာ လေ့လာချက်ဖြစ်သောကြောင့် ဒဿနိကဗေဒ (B) ၏ ကဏ္ဍခွဲဖြစ်သော ယုတ္တိဗေဒ (BC) တွင် ထည့်ရမည်။"
  },
  {
    id: "lcc_b21",
    title: "The Dictionary of Ancient Pali and Sanskrit Terminology",
    description: "A comprehensive reference containing definitions, word roots, and grammatical origins of ancient monastic scriptures.",
    correctClass: "P",
    correctSubclass: "PK",
    subclassNameMyan: "ပါဠိနှင့် သက္ကတဘာသာစကား (Sanskrit & Pali Languages)",
    explanation: "ပါဠိနှင့်သက္ကတစကားလုံးများဆိုင်ရာ အဘိဓာန်ဖြစ်၍ ဘာသာစကားနှင့် စာပေ (P) ၏ ကဏ္ဍခွဲဖြစ်သော အင်ဒို-အီရန် ဘာသာစကားများ (PK) တွင် ရှိပါသည်။"
  },
  {
    id: "lcc_b22",
    title: "Criminology: Theories of Deviance and Correctional Facilities",
    description: "Studies the sociological drivers of crime, biological traits of repeat offenders, and the structural design of rehabilitative prison systems.",
    correctClass: "H",
    correctSubclass: "HV",
    subclassNameMyan: "လူမှုရေးဆိုင်ရာချို့ယွင်းချက်များနှင့် မှုခင်းဗေဒ (Social Pathology & Criminology)",
    explanation: "မှုခင်းဖြစ်ပွားရခြင်း အကြောင်းရင်းများနှင့် လူမှုဝန်ထမ်းစနစ်ဖြစ်သောကြောင့် လူမှုရေးသိပ္ပံ (H) အောက်ရှိ လူမှုချို့ယွင်းချက်၊ မှုခင်းဗေဒနှင့် ဝန်ထမ်း (HV) တွင် ထည့်သွင်းရပါမည်။"
  },
  {
    id: "lcc_b23",
    title: "Marine Biology: Coral Reef Ecology and Ocean Currents",
    description: "Studies the diverse lifeforms residing within deep sea coral reefs, ocean temperature currents, and photosynthesis in marine organisms.",
    correctClass: "Q",
    correctSubclass: "QH",
    subclassNameMyan: "သဘာဝသမိုင်းနှင့် ဇီဝဗေဒ (Natural History & Biology)",
    explanation: "ပင်လယ်ပြင် ရေအောက်ဇီဝဂေဟစနစ်အကြောင်း လေ့လာခြင်းဖြစ်၍ သိပ္ပံ (Q) ၏ ကဏ္ဍခွဲဖြစ်သော ဇီဝဗေဒ (QH) အောက်တွင် သတ်မှတ်သည်။"
  },
  {
    id: "lcc_b24",
    title: "The World Almanac and Book of Facts 2026",
    description: "A global sourcebook presenting demographic populations, election percentages, sport records, climate statistics, and country directories.",
    correctClass: "A",
    correctSubclass: "AY",
    subclassNameMyan: "အချက်အလက်နှစ်ချုပ်များနှင့် လမ်းညွှန်များ (Almanacs & Directories)",
    explanation: "နှစ်ပတ်လည် သတင်းအချက်အလက်နှင့် မှတ်တမ်းအချက်အလက် စုစည်းမှုဖြစ်သဖြင့် အထွေထွေ (A) အုပ်စုဝင် နှစ်ချုပ်စာအုပ်များနှင့် လမ်းညွှန်များ (AY) အောက်၌ ပါဝင်သည်။"
  },
  {
    id: "lcc_b25",
    title: "Traditional Burmese Puppetry and Marionette Theater",
    description: "An illustrated history of Yokthe Pwe, detailing wood carving techniques, string controls, epic story lines, and court music configurations.",
    correctClass: "P",
    correctSubclass: "PN",
    subclassNameMyan: "အထွေထွေစာပေနှင့် ပြဇာတ်၊ ရုပ်ရှင် (Literature & Theater)",
    explanation: "ရုပ်သေးစင်ပြဇာတ်နှင့် ဖျော်ဖြေမှုအနုပညာဖြစ်သောကြောင့် ဘာသာစကား/စာပေ (P) ၏ ကဏ္ဍခွဲဖြစ်သော ပြဇာတ်၊ ဖျော်ဖြေရေးနှင့် ရုပ်ရှင် (PN) အောက်တွင် ထည့်ရမည်။"
  },
  {
    id: "lcc_b26",
    title: "The Anatomy of the Human Brain & Nerve Bundles",
    description: "An advanced laboratory textbook detailing the physical sections, lobes, ventricles, and synapses of the human central nervous system.",
    correctClass: "Q",
    correctSubclass: "QM",
    subclassNameMyan: "လူ့ခန္ဓာကိုယ်ဖွဲ့စည်းပုံ (Human Anatomy)",
    explanation: "ခန္ဓာဗေဒ လေ့လာချက်စာအုပ်ဖြစ်သောကြောင့် သိပ္ပံ (Q) ၏ ကဏ္ဍခွဲဖြစ်သော လူ့ခန္ဓာကိုယ်ဖွဲ့စည်းပုံလေ့လာမှုဗေဒ (QM) တွင် ရှိပါသည်။"
  },
  {
    id: "lcc_b27",
    title: "Forestry Silviculture & Teak Tree Preservation in Myanmar",
    description: "Technical instructions for establishing nursery systems, pruning schedules, and pest mitigation guidelines for natural teak wood reserves.",
    correctClass: "S",
    correctSubclass: "SD",
    subclassNameMyan: "သစ်တောပညာ (Forestry)",
    explanation: "သစ်တောစိုက်ပျိုးရေးနှင့် ကျွန်းပင်များ ထိန်းသိမ်းစောင့်ရှောက်ရေးနည်းပညာဖြစ်သဖြင့် စိုက်ပျိုးရေး (S) ၏ ကဏ္ဍခွဲဖြစ်သော သစ်တောပညာ (SD) တွင် သတ်မှတ်သည်။"
  },
  {
    id: "lcc_b28",
    title: "A Treatise on International Air Law and Commercial Aviation",
    description: "Legal treaties and aviation boundaries governing transcontinental passenger flights, custom duties, and high altitude traffic security.",
    correctClass: "K",
    correctSubclass: "KZ",
    subclassNameMyan: "နိုင်ငံတကာဥပဒေ (International Law)",
    explanation: "နိုင်ငံအချင်းချင်း သဘောတူညီထားသော လေကြောင်းပိုင်နက်နှင့် နိုင်ငံတကာဥပဒေဖြစ်သောကြောင့် ဥပဒေ (K) ၏ ကဏ္ဍခွဲဖြစ်သော နိုင်ငံတကာဥပဒေ (KZ) တွင် ရှိပါသည်။"
  },
  {
    id: "lcc_b29",
    title: "Aerodynamics: Fighter Jet Jet Engines and Wings Design",
    description: "Explores the mechanical formulas, fluid resistance, thrust vectoring, and structural wings alloy configuration of military aviation fighters.",
    correctClass: "T",
    correctSubclass: "TL",
    subclassNameMyan: "မော်တော်ယာဉ်နှင့် လေကြောင်းအင်ဂျင်နီယာ (Motor Vehicles & Aeronautics)",
    explanation: "လေကြောင်းပျံသန်းမှုနှင့် လေယာဉ်ဒီဇိုင်း အင်ဂျင်နီယာပညာရပ်ဖြစ်၍ နည်းပညာ (T) ၏ ကဏ္ဍခွဲဖြစ်သော လေကြောင်း/မော်တော်ယာဉ် (TL) တွင် ရှိပါသည်။"
  },
  {
    id: "lcc_b30",
    title: "Theravada Vinaya Pitaka: Rules of Monastic Order for Bhikkhus",
    description: "Translates and analyzes the 227 rules of training (Patimokkha) for monks, detailing legal procedures for monastic assembly and offenses.",
    correctClass: "B",
    correctSubclass: "BQ",
    subclassNameMyan: "ဗုဒ္ဓဘာသာ (Buddhism)",
    explanation: "ရဟန်းဝိနည်းတော်များနှင့် သံဃာ့ကျင့်ဝတ်ဆိုင်ရာ ကျမ်းစာဖြစ်သဖြင့် ဘာသာရေး (B) အောက်ရှိ ဗုဒ္ဓဘာသာ (BQ) ကဏ္ဍတွင် ထားရှိရမည်။"
  },
  {
    id: "lcc_b31",
    title: "Introduction to Numismatics: Ancient Gold Coins of Southeast Asia",
    description: "Detailed catalog analyzing the alloy compounds, casting processes, and script letters stamped on Pyu and Mon-Dvaravati gold coins.",
    correctClass: "C",
    correctSubclass: "CJ",
    subclassNameMyan: "ဒင်္ဂါးလေ့လာမှုပညာ (Numismatics)",
    explanation: "ရှေးဟောင်းဒင်္ဂါးပြားများနှင့် အကြွေစေ့များအကြောင်း သုတေသနပြုလေ့လာခြင်းဖြစ်သဖြင့် သမိုင်းကူပညာရပ် (C) ၏ ကဏ္ဍခွဲဖြစ်သော ဒင်္ဂါးဗေဒ (CJ) တွင် တည်ရှိသည်။"
  },
  {
    id: "lcc_b32",
    title: "A Study of Macroeconomic Theory and Monetary Policies",
    description: "Presents Keynesian models, inflation factors, interest rate dynamics, and global supply chain impacts on national Gross Domestic Product (GDP).",
    correctClass: "H",
    correctSubclass: "HB",
    subclassNameMyan: "စီးပွားရေးသီအိုရီ (Economic Theory)",
    explanation: "မက်ခရိုစီးပွားရေးသီအိုရီနှင့် ငွေကြေးမူဝါဒများအကြောင်းဖြစ်၍ လူမှုရေးသိပ္ပံ (H) ၏ ကဏ္ဍခွဲဖြစ်သော စီးပွားရေးသီအိုရီ (HB) တွင် အမျိုးအစားခွဲခြားရပါမည်။"
  },
  {
    id: "lcc_b33",
    title: "Sarpay Beikman: A History of Burmese Book Publishing",
    description: "Chronicles the history of the Myanmar Translation Society (Sarpay Beikman), detailing printing presses, translation guilds, and literary awards.",
    correctClass: "Z",
    correctSubclass: "Z",
    subclassNameMyan: "ပုံနှိပ်ထုတ်ဝေရေးနှင့် စာကြည့်တိုက် (Publishing & Libraries)",
    explanation: "စာပေထုတ်ဝေရေးနှင့် စာအုပ်ပုံနှိပ်လုပ်ငန်း သမိုင်းကြောင်းဖြစ်သဖြင့် LCC စနစ်တွင် စာအုပ်ထုတ်ဝေရေး၊ ပုံနှိပ်နှင့်စာကြည့်တိုက်ပညာ (Z) အောက်တွင် ရှိပါသည်။"
  },
  {
    id: "lcc_b34",
    title: "Ethical Leadership: Moral Philosophy in Public Office",
    description: "An analysis of deontological and utilitarian ethics applied to government governance, policy fairness, and public trust management.",
    correctClass: "B",
    correctSubclass: "BJ",
    subclassNameMyan: "ကျင့်ဝတ်နှင့် လူမှုနီတိ (Ethics)",
    explanation: "ကိုယ်ကျင့်တရားဆိုင်ရာ ဒဿနနှင့် ပြည်သူ့ဝန်ထမ်းကျင့်ဝတ်များအကြောင်းဖြစ်၍ ဒဿန (B) အောက်ရှိ ကျင့်ဝတ်ပညာ (BJ) တွင် ထည့်သွင်းရမည်။"
  },
  {
    id: "lcc_b35",
    title: "Encyclopedic Dictionary of Global Flora and Botanical Taxonomy",
    description: "An exhaustive reference volume documenting the botanical names, plant structures, and climate zones of over 10,000 global flower species.",
    correctClass: "Q",
    correctSubclass: "QK",
    subclassNameMyan: "ရုက္ခဗေဒ (Botany)",
    explanation: "ကမ္ဘာ့အပင်များနှင့် ပန်းမန်များအကြောင်း ရုက္ခဗေဒစနစ်တကျ ဖော်ပြချက်ဖြစ်၍ သိပ္ပံ (Q) ၏ ကဏ္ဍခွဲဖြစ်သော ရုက္ခဗေဒ (QK) တွင် ရှိပါသည်။"
  },
  {
    id: "lcc_b36",
    title: "Traditional Oil Painting Techniques of Mandalay Artists",
    description: "Describes canvas preparation, pigment mixing with linseed oil, brushwork methods, and shading styles of the 19th century Mandalay court artists.",
    correctClass: "N",
    correctSubclass: "ND",
    subclassNameMyan: "ဆေးရေးပန်းချီပညာ (Painting)",
    explanation: "ပန်းချီရေးဆွဲခြင်းနှင့် ဆေးဆိုးနည်းစနစ်များအကြောင်းဖြစ်သောကြောင့် အနုပညာ (N) ၏ ကဏ္ဍခွဲဖြစ်သော ဆေးရေးပန်းချီ (ND) အောက်တွင် ရှိပါသည်။"
  },
  {
    id: "lcc_b37",
    title: "English for Foreign Learners: Advanced Syntax & Grammar Drills",
    description: "A workbook with exercises on passive voice, conditional clauses, and prepositions, designed for non-native English speaking students.",
    correctClass: "P",
    correctSubclass: "PE",
    subclassNameMyan: "အင်္ဂလိပ်ဘာသာစကား (English Language)",
    explanation: "အင်္ဂလိပ်စာ သင်ကြားရေးနှင့် သဒ္ဒါလေ့ကျင့်ခန်းဖြစ်သဖြင့် ဘာသာစကား/စာပေ (P) ၏ ကဏ္ဍခွဲဖြစ်သော အင်္ဂလိပ်ဘာသာစကား (PE) တွင် ထားရှိရမည်။"
  },
  {
    id: "lcc_b38",
    title: "International Banking Regulation: Basel IV Standards",
    description: "Analysis of global banking reserve ratios, stress-testing formulas, liquidity requirements, and risk oversight for central banks.",
    correctClass: "H",
    correctSubclass: "HG",
    subclassNameMyan: "ဘဏ္ဍာရေး (Finance)",
    explanation: "ဘဏ်လုပ်ငန်းဆိုင်ရာ စည်းမျဉ်းများနှင့် ဘဏ္ဍာရေးစနစ်များဖြစ်သောကြောင့် လူမှုရေးသိပ္ပံ (H) ၏ ကဏ္ဍခွဲဖြစ်သော ဘဏ္ဍာရေး (HG) တွင် ရှိပါသည်။"
  },
  {
    id: "lcc_b39",
    title: "Archaeological Excavations of Hanlin Pyu Ancient City",
    description: "A research monograph documenting the brick structures, iron artifacts, bead designs, and radiocarbon dating of the UNESCO World Heritage site.",
    correctClass: "C",
    correctSubclass: "CC",
    subclassNameMyan: "ရှေးဟောင်းသုတေသန (Archaeology)",
    explanation: "ရှေးဟောင်းဟန်လင်းမြို့တော် တူးဖော်တွေ့ရှိချက်ဖြစ်သောကြောင့် သမိုင်းကူပညာရပ် (C) အောက်ရှိ ရှေးဟောင်းသုတေသန (CC) တွင် ထည့်သွင်းရပါမည်။"
  },
  {
    id: "lcc_b40",
    title: "Sanitary Engineering and Urban Sewage Treatment Plants",
    description: "Blueprints and biological formulas for configuring municipal water filtration units, sludge treatment, and drainage systems.",
    correctClass: "T",
    correctSubclass: "TD",
    subclassNameMyan: "ပတ်ဝန်းကျင်နည်းပညာနှင့် မိလ္လာစနစ် (Environmental Technology)",
    explanation: "မြို့ပြမိလ္လာမြောင်းနှင့် ရေဆိုးသန့်စင်မှုဆိုင်ရာ သန့်ရှင်းရေးအင်ဂျင်နီယာဖြစ်သဖြင့် နည်းပညာ (T) ၏ ကဏ္ဍခွဲဖြစ်သော ပတ်ဝန်းကျင်နည်းပညာ (TD) တွင် ပါဝင်သည်။"
  },
  {
    id: "lcc_b41",
    title: "Theravada Meditation: Sati-Patthana Vipassana Manual",
    description: "Practical instructions for cultivating mindfulness of breathing, bodily movements, and feelings, based on the Maha Satipatthana Sutta.",
    correctClass: "B",
    correctSubclass: "BQ",
    subclassNameMyan: "ဗုဒ္ဓဘာသာ (Buddhism)",
    explanation: "ဝိပဿနာ ကမ္မဋ္ဌာန်းတရားအားထုတ်နည်း လမ်းညွှန်ဖြစ်သဖြင့် ဘာသာရေး (B) ၏ ကဏ္ဍခွဲဖြစ်သော ဗုဒ္ဓဘာသာ (BQ) အောက်တွင် ရှိပါသည်။"
  },
  {
    id: "lcc_b42",
    title: "Advanced Organic Chemistry: Principles and Industry Applications",
    description: "Focuses on carbon bonding, molecular orbitals, reaction mechanisms, and the synthesis of polymers in modern pharmaceutical industries.",
    correctClass: "Q",
    correctSubclass: "QD",
    subclassNameMyan: "ဓာတုဗေဒ (Chemistry)",
    explanation: "အဆင့်မြင့်ဓာတုဗေဒ ဘာသာရပ်ဖြစ်သောကြောင့် သိပ္ပံ (Q) ၏ ကဏ္ဍခွဲဖြစ်သော ဓာတုဗေဒ (QD) အောက်၌ အမျိုးအစားခွဲခြားသည်။"
  },
  {
    id: "lcc_b43",
    title: "International Relations in the Asia-Pacific: Diplomacy and Trade",
    description: "A geopolitical analysis of treaty frameworks, maritime routes security, and diplomatic summits between major powers in Asia.",
    correctClass: "J",
    correctSubclass: "JZ",
    subclassNameMyan: "နိုင်ငံတကာဆက်ဆံရေး (International Relations)",
    explanation: "နိုင်ငံတကာသံတမန်ရေးရာနှင့် မဟာဗျူဟာမြောက် ဆက်ဆံရေးများအကြောင်းဖြစ်၍ နိုင်ငံရေးသိပ္ပံ (J) ၏ ကဏ္ဍခွဲဖြစ်သော နိုင်ငံတကာဆက်ဆံရေး (JZ) တွင် တည်ရှိသည်။"
  },
  {
    id: "lcc_b44",
    title: "Constitutional Law: Principles of Judicial Review and Human Rights",
    description: "Comparative study of constitution drafting, power balancing between parliament and courts, and the protection of civil liberties.",
    correctClass: "K",
    correctSubclass: "K",
    subclassNameMyan: "အထွေထွေဥပဒေ (Law in General)",
    explanation: "အခြေခံဥပဒေရေးဆွဲမှုဆိုင်ရာ အထွေထွေနှင့် နှိုင်းယှဉ်ဥပဒေလေ့လာချက်ဖြစ်၍ ဥပဒေ (K) ၏ အထွေထွေကဏ္ဍ (K) တွင် ရှိပါသည်။"
  },
  {
    id: "lcc_b45",
    title: "Library Education and Curriculum Design for Future Archivists",
    description: "Guidelines for academic institutions to structure library science degrees, cataloging courses, and digital preservation lab trainings.",
    correctClass: "Z",
    correctSubclass: "Z",
    subclassNameMyan: "စာကြည့်တိုက်ပညာ (Library Science)",
    explanation: "စာကြည့်တိုက်ပညာရှင်များ သင်တန်းပေးမှုဆိုင်ရာ သင်ရိုးညွှန်းတမ်းဖြစ်၍ LCC စနစ်တွင် စာကြည့်တိုက်နှင့် သတင်းအချက်အလက်ပညာ (Z) တွင် ထားရှိသည်။"
  },
  {
    id: "lcc_b46",
    title: "Manual of Classic Western Music Orchestration and Symphony",
    description: "A technical guide for conductors to coordinate string sections, brass, woodwinds, and percussion for full scale symphonies.",
    correctClass: "M",
    correctSubclass: "MT",
    subclassNameMyan: "ဂီတသင်ကြားရေးနှင့် လေ့ကျင့်ရေး (Music Instruction)",
    explanation: "သံစုံတီးဝိုင်း ညှိနှိုင်းတီးခတ်မှုဆိုင်ရာ လက်တွေ့သင်ကြားမှုစနစ်ဖြစ်သောကြောင့် ဂီတ (M) ၏ ကဏ္ဍခွဲဖြစ်သော ဂီတသင်ကြားရေး (MT) တွင် ရှိပါသည်။"
  },
  {
    id: "lcc_b47",
    title: "Traditional Burmese Architecture: King Mindon's Golden Palace",
    description: "Studies the traditional wooden architecture, multi-tiered roofs (pyatthat), and gold leaf decorations of the Mandalay Royal Palace complex.",
    correctClass: "N",
    correctSubclass: "NA",
    subclassNameMyan: "ဗိသုကာပညာ (Architecture)",
    explanation: "ရိုးရာမြန်မာ့နန်းတော်ဗိသုကာ ဒီဇိုင်းအဆောက်အဦဖြစ်၍ အနုပညာ (N) ၏ ကဏ္ဍခွဲဖြစ်သော ဗိသုကာပညာ (NA) အောက်၌ ရှိပါသည်။"
  },
  {
    id: "lcc_b48",
    title: "The Chronicles of King Bayinnaung and the Toungoo Empire",
    description: "A detailed history of the military campaigns, consolidation, and administrative policies of the Second Myanmar Empire in the 16th century.",
    correctClass: "D",
    correctSubclass: "DS",
    subclassNameMyan: "အာရှသမိုင်း (Asia History)",
    explanation: "တောင်ငူခေတ်မြန်မာ့သမိုင်းဖြစ်၍ ကမ္ဘာ့သမိုင်း (D) ၏ ကဏ္ဍခွဲဖြစ်သော အာရှသမိုင်း (DS) အောက်၌ ထားရှိရပါမည်။"
  },
  {
    id: "lcc_b49",
    title: "Teaching Methods for Vocational Schools and Craft Guilds",
    description: "Pedagogical handbook for training master carpenters, welders, and industrial mechanics in corporate vocational environments.",
    correctClass: "L",
    correctSubclass: "LB",
    subclassNameMyan: "သင်ကြားမှုသီအိုရီနှင့် လက်တွေ့ (Theory & Practice of Teaching)",
    explanation: "သက်မွေးဝမ်းကျောင်းပညာရပ်များ သင်ကြားပြသမှု နည်းစနစ်လမ်းညွှန်ဖြစ်၍ ပညာရေး (L) ၏ ကဏ္ဍခွဲဖြစ်သော သင်ကြားမှုသီအိုရီ (LB) အောက်တွင် ရှိပါသည်။"
  },
  {
    id: "lcc_b50",
    title: "Modern Food Science, Home Nutrition, and Healthy Cooking",
    description: "A manual on calculating caloric intake, preserving vitamin density, and designing low-cholesterol meals for domestic environments.",
    correctClass: "T",
    correctSubclass: "TX",
    subclassNameMyan: "အိမ်တွင်းစီးပွားရေးနှင့် ဟင်းချက်နည်းပညာ (Home Economics / Cooking)",
    explanation: "အာဟာရဓာတ်တွက်ချက်မှုနှင့် ဟင်းချက်ခြင်းဆိုင်ရာ အိမ်တွင်းစီးပွားရေးသိပ္ပံဖြစ်၍ နည်းပညာ (T) ၏ ကဏ္ဍခွဲဖြစ်သော အိမ်တွင်းစီးပွားရေး (TX) တွင် ပါဝင်သည်။"
  }
];
