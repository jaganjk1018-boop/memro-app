import React, { useState, useEffect, useRef } from "react";
import { 
  RotateCcw, 
  ArrowLeft, 
  Gamepad2, 
  Timer, 
  Award, 
  CheckCircle, 
  Volume2, 
  Play, 
  Check, 
  X, 
  ChevronRight, 
  Eye, 
  Home, 
  Music 
} from "lucide-react";
import { 
  playTapSound, 
  playMatchSound, 
  playWinSound,
  playBirdSound,
  playRainSound,
  playTempleBellSound,
  playVehicleSound
} from "../utils/audio";

// --- Language Fallback & Helper Systems ---
const LANGUAGE_FALLBACKS = {
  karbi: "as",
  mising: "as",
  nyishi: "hi",
  adi: "hi",
  apatani: "hi",
  monpa: "hi",
  galo: "hi",
  tangkhul: "mni",
  thadou: "mni",
  paite: "mni",
  hmar: "mni",
  khasi: "en",
  garo: "en",
  jaintia: "en",
  mizo: "en",
  lai: "en",
  mara: "en",
  nagamese: "as",
  ao: "en",
  angami: "en",
  sumi: "en",
  lotha: "en",
  konyak: "en",
  kokborok: "bn",
  sikkimese: "ne",
  lepcha: "ne"
};

function getLangCode(lang) {
  return LANGUAGE_FALLBACKS[lang] || lang || "en";
}

const SELECTOR_TRANSLATIONS = {
  en: {
    header: "Cognitive Games",
    desc: "Choose an exercise to keep your memory sharp and mind active today.",
    matchTitle: "Memory Match",
    matchSub: "Flip and match pairs of traditional Indian icons.",
    objTitle: "Object Recognition",
    objSub: "Identify everyday objects such as cups, clocks, and apples.",
    whereTitle: "Where Is It?",
    whereSub: "Connect familiar items like toothbrushes with where they go.",
    soundTitle: "Sound Memory Game",
    soundSub: "Listen to everyday sounds and identify what you heard.",
    difficultyLabel: "Difficulty: ",
    playAgain: "Play Again",
    saveFinish: "Save & Finish",
    completed: "Game Completed!",
    score: "Cognitive Score",
    moves: "Moves",
    time: "Time",
    round: "Round",
    of: "of"
  },
  hi: {
    header: "संज्ञानात्मक खेल",
    desc: "अपनी याददाश्त और दिमाग को सक्रिय रखने के लिए एक खेल चुनें।",
    matchTitle: "मेमोरी मैच",
    matchSub: "चित्रों के जोड़ों को खोजें और मिलाएँ।",
    objTitle: "वस्तु पहचान",
    objSub: "कप, घड़ी, और सेब जैसी रोज़मर्रा की चीज़ों को पहचानें।",
    whereTitle: "वस्तु कहाँ रखें?",
    whereSub: "टूथब्रश जैसी दैनिक चीजों को उनके सही स्थान से जोड़ें।",
    soundTitle: "आवाज मेमोरी",
    soundSub: "रोजमर्रा की आवाजें सुनें और पहचानें।",
    difficultyLabel: "कठिनाई: ",
    playAgain: "फिर से खेलें",
    saveFinish: "पूरा करें और सहेजें",
    completed: "खेल समाप्त!",
    score: "संज्ञानात्मक स्कोर",
    moves: "चालें",
    time: "समय",
    round: "दौर",
    of: "का"
  },
  ta: {
    header: "அறிவுசார் விளையாட்டுகள்",
    desc: "உங்கள் நினைவகத்தை கூர்மையாகவும் சுறுசுறுப்பாகவும் வைத்திருக்க ஒரு விளையாட்டைத் தேர்ந்தெடுக்கவும்.",
    matchTitle: "நினைவக போட்டி",
    matchSub: "இணை படங்களைக் கண்டுபிடித்து பொருத்தவும்.",
    objTitle: "பொருள் அடையாளம்",
    objSub: "தினசரி உபயோகிக்கும் பொருட்களை அடையாளம் காணவும்.",
    whereTitle: "இது எங்கே?",
    whereSub: "பற்பசை போன்ற பொருட்களை அவற்றின் இருப்பிடத்துடன் இணைக்கவும்.",
    soundTitle: "ஒலி நினைவகம்",
    soundSub: "தினசரி ஒலிகளைக் கேட்டு அடையாளம் காணவும்.",
    difficultyLabel: "கடினத்தன்மை: ",
    playAgain: "மீண்டும் விளையாடு",
    saveFinish: "முடிக்கவும் மற்றும் சேமிக்கவும்",
    completed: "விளையாட்டு முடிந்தது!",
    score: "அறிவுசார் மதிப்பெண்",
    moves: "நகர்வுகள்",
    time: "நேரம்",
    round: "சுற்று",
    of: "இல்"
  },
  bn: {
    header: "জ্ঞানীয় খেলাধুলা",
    desc: "আপনার স্মৃতিশক্তি ও মনকে সক্রিয় রাখতে একটি খেলা বেছে নিন।",
    matchTitle: "মেমরি ম্যাচ",
    matchSub: "ছবির জোড়া খুঁজে মিল করুন।",
    objTitle: "বস্তু সনাক্তকরণ",
    objSub: "কাপ, ঘড়ি এবং আপেলের মতো দৈনন্দিন বস্তু সনাক্ত করুন।",
    whereTitle: "এটি কোথায় থাকে?",
    whereSub: "টুথব্রাশের মতো পরিচিত জিনিসগুলি সঠিক জায়গার সাথে যুক্ত করুন।",
    soundTitle: "শব্দ মেমরি",
    soundSub: "দৈনন্দিন শব্দ শুনুন এবং সনাক্ত করুন।",
    difficultyLabel: "কঠিনতা: ",
    playAgain: "আবার খেলুন",
    saveFinish: "সম্পন্ন ও সংরক্ষণ",
    completed: "খেলা সমাপ্ত!",
    score: "জ্ঞানীয় স্কোর",
    moves: "চাল",
    time: "সময়",
    round: "রাউন্ড",
    of: "এর"
  },
  as: {
    header: "জ্ঞানাত্মক খেলসমূহ",
    desc: "আপোনাৰ স্মৃতিশক্তি চোকা আৰু মন সক্ৰিয় কৰি ৰাখিবলৈ এটা খেল বাছি লওক।",
    matchTitle: "মেমৰী মেচ",
    matchSub: "ছবিৰ যোৰাবোৰ বিচাৰি মিলাওক।",
    objTitle: "বস্তু চিনাক্তকৰণ",
    objSub: "কাপ, ঘড়ী আৰু আপেলৰ দৰে দৈনিক ব্যৱহৃত বস্তু চিনাক্ত কৰক।",
    whereTitle: "এইটো ক’ত থাকে?",
    whereSub: "টুথব্ৰাছৰ দৰে জনাজাত বস্তুবোৰ সঠিক স্থানৰ সৈতে সংযোগ কৰক।",
    soundTitle: "শব্দ মেমৰী",
    soundSub: "দৈনিক শব্দসমূহ শুনক আৰু চিনাক্ত কৰক।",
    difficultyLabel: "কঠিনতা: ",
    playAgain: "পুনৰ খেলক",
    saveFinish: "পূৰ্ণ কৰক আৰু সাঁচি থওক",
    completed: "খেল সমাপ্ত!",
    score: "জ্ঞানাত্মক নম্বৰ",
    moves: "চাল",
    time: "সময়",
    round: "ৰাউণ্ড",
    of: "ৰ"
  },
  ne: {
    header: "संज्ञानात्मक खेलहरू",
    desc: "आफ्नो स्मरणशक्ति र दिमागलाई सक्रिय राख्न एउटा खेल रोज्नुहोस्।",
    matchTitle: "मेमोरी म्याच",
    matchSub: "चित्रहरूको जोडी खोज्नुहोस् र मिलाउनुहोस्।",
    objTitle: "वस्तु पहिचान",
    objSub: "कप, घडी, र स्याउ जस्ता दैनिक वस्तुहरू पहिचान गर्नुहोस्।",
    whereTitle: "यो कहाँ छ?",
    whereSub: "मन्जन जस्ता परिचित वस्तुहरू तिनीहरू राख्ने ठाउँसँग मिलाउनुहोस्।",
    soundTitle: "आवाज मेमोरी",
    soundSub: "दैनिक आवाजहरू सुन्नुहोस् र पहिचान गर्नुहोस्।",
    difficultyLabel: "कठिनाइ: ",
    playAgain: "फेरि खेल्नुहोस्",
    saveFinish: "बचत गर्नुहोस् र समाप्त गर्नुहोस्",
    completed: "खेल समाप्त भयो!",
    score: "संज्ञानात्मक स्कोर",
    moves: "चाल",
    time: "समय",
    round: "चरण",
    of: "को"
  },
  mni: {
    header: "কোগ্নিটিভ শান্নবশিং",
    desc: "নহাকী নীংশিংবা কনখৎনবা অমসুং ৱাখল সক্ৰিয় ওইনবা শান্নবা অমা খনবীয়ু।",
    matchTitle: "মেমোরি মেচ",
    matchSub: "লাই অমসুং লাই ফংবা খুদমশিং মচান খন্দুনা মেচ তৌ।",
    objTitle: "পোৎশক শকখঙবা",
    objSub: "কাপ, পুং অমসুং সেবগুম্বা নোংমগী পোৎশকশিং শকখঙউ।",
    whereTitle: "মসি কদাইদনো?",
    whereSub: "টুথব্রসগুম্বা নোংমগী পোৎশকশিং মখোয় থমফম অসিগা মেচ তৌ।",
    soundTitle: "খোঞ্জেল মেমোরি",
    soundSub: "নোংমগী খোঞ্জেলশিং তাদুনা শকখঙউ।",
    difficultyLabel: "অরুবা: ",
    playAgain: "অমুক্ক শান্নৌ",
    saveFinish: "তুংশিনব অমসুং লোইশিনবা",
    completed: "শান্নবা লোইখ্রে!",
    score: "কোগ্নিটিভ স্কোর",
    moves: "মুভশিং",
    time: "মতম",
    round: "রাউণ্ড",
    of: "গী"
  }
};

const SPEAK_VOCALS = {
  en: {
    startMatch: "Started Memory Match. Find the matching pairs.",
    startObj: "Started Object Recognition. Look at the image and tap the correct option.",
    startWhere: "Started Where Is It? memory game. Answer where each object belongs.",
    startSound: "Started Sound Memory. Tap play to listen to a sound, then identify it.",
    startDiff: "Started a new {diff} game.",
    congratsMatch: "Congratulations Amma! You finished in {moves} moves and scored {score} points!",
    foundMatch: "You found a match!",
    wellDoneObj: "Well done! You got {score} out of {total} correct!",
    greatJobWhere: "Great job Amma! You matched {score} out of {total} correct!",
    wonderfulSound: "Wonderful! You recognized {score} out of {total} sounds correctly!"
  },
  hi: {
    startMatch: "मेमोरी मैच खेल शुरू। एक जैसे जोड़ों को खोजें।",
    startObj: "वस्तु पहचान खेल शुरू। वस्तु देखें और सही नाम पर छुएं।",
    startWhere: "दैनिक वस्तु स्मृति खेल शुरू। बताएं कि प्रत्येक वस्तु कहां रखी जाती है।",
    startSound: "आवाज स्मृति खेल शुरू। आवाज सुनने के लिए प्ले दबाएं, फिर उसे पहचानें।",
    startDiff: "एक नया {diff} खेल शुरू किया गया है।",
    congratsMatch: "बधाई हो अम्मा! आपने {moves} चालों में खेल पूरा कर लिया और {score} अंक प्राप्त किए!",
    foundMatch: "आपको एक मिलान मिल गया!",
    wellDoneObj: "बहुत बढ़िया! आपने {total} में से {score} सही पहचाने!",
    greatJobWhere: "बहुत बढ़िया अम्मा! आपने {total} में से {score} वस्तुओं का सही मिलान किया!",
    wonderfulSound: "बहुत सुंदर! आपने {total} में से {score} आवाजों की सही पहचान की!"
  },
  ta: {
    startMatch: "நினைவக போட்டி விளையாட்டு தொடங்கியது. பொருத்தம் படங்களை கண்டறியவும்.",
    startObj: "பொருள் அடையாளம் காணும் விளையாட்டு தொடங்கியது. படத்தை பார்த்து சரியான விடையை தேர்வு செய்யவும்.",
    startWhere: "இருப்பிடம் கண்டறியும் விளையாட்டு தொடங்கியது. ஒவ்வொரு பொருளும் எங்கு செல்லும் என்று கூறவும்.",
    startSound: "ஒலி நினைவக விளையாட்டு தொடங்கியது. ஒலியைக் கேட்க பிளே பொத்தானை அழுத்தவும்.",
    startDiff: "புதிய {diff} விளையாட்டு தொடங்கியது.",
    congratsMatch: "வாழ்த்துகள் அம்மா! நீங்கள் {moves} நகர்வுகளில் விளையாட்டை முடித்து {score} புள்ளிகள் பெற்றுள்ளீர்கள்!",
    foundMatch: "பொருத்தம் கண்டறியப்பட்டது!",
    wellDoneObj: "நன்று! நீங்கள் {total} கேள்விகளில் {score} சரியான விடைகளைக் கண்டறிந்துள்ளீர்கள்!",
    greatJobWhere: "மிக நன்று அம்மா! நீங்கள் {total} பொருட்களில் {score} சரியான பொருத்தங்களைக் கண்டறிந்துள்ளீர்கள்!",
    wonderfulSound: "அருமை! நீங்கள் {total} ஒலிகளில் {score} சரியான ஒலிகளை அடையாளம் கண்டுள்ளீர்கள்!"
  },
  bn: {
    startMatch: "মেমরি ম্যাচ খেলা শুরু। ছবির জোড়া খুঁজে মিল করুন।",
    startObj: "বস্তু সনাক্তকরণ খেলা শুরু। ছবি দেখে সঠিক বিকল্পে ট্যাপ করুন।",
    startWhere: "এটি কোথায় থাকে খেলা শুরু। প্রতিটি বস্তু কোথায় রাখা হয় বলুন।",
    startSound: "শব্দ মেমরি খেলা শুরু। শব্দ শুনতে প্লে করুন, তারপর সনাক্ত করুন।",
    startDiff: "নতুন {diff} খেলা শুরু হয়েছে।",
    congratsMatch: "অভিনন্দন আম্মা! আপনি {moves} চালে খেলা সম্পন্ন করেছেন এবং {score} স্কোর করেছেন!",
    foundMatch: "আপনি জোড়া পেয়েছেন!",
    wellDoneObj: "সাবাস! আপনি {total} টির মধ্যে {score} টি সঠিক করেছেন!",
    greatJobWhere: "সাবাস আম্মা! আপনি {total} টির মধ্যে {score} টি সঠিক মিল করেছেন!",
    wonderfulSound: "চমৎকার! আপনি {total} টির মধ্যে {score} টি সঠিক শব্দ সনাক্ত করেছেন!"
  },
  as: {
    startMatch: "মেমৰী মেচ খেল আৰম্ভ হৈছে। মিল থকা ছবিবোৰ বিচাৰক।",
    startObj: "বস্তু চিনাক্তকৰণ খেল আৰম্ভ হৈছে। ছবিখন চাওক আৰু সঠিক বিকল্পত টিপক।",
    startWhere: "এইটো ক’ত থাকে খেল আৰম্ভ হৈছে। প্ৰতিটো বস্তু ক’ত থোৱা হয় কওক।",
    startSound: "শব্দ মেমৰী খেল আৰম্ভ হৈছে। শব্দ শুনিবলৈ প্লে কৰক, তাৰ পিছত চিনাক্ত কৰক।",
    startDiff: "এটা নতুন {diff} খেল আৰম্ভ হৈছে।",
    congratsMatch: "অভিনন্দন আইতা! আপুনি {moves} টা চালত খেল সমাপ্ত কৰিলে আৰু {score} নম্বৰ পালে!",
    foundMatch: "আপুনি এটা মিল বিচাৰি পালে!",
    wellDoneObj: "সুন্দৰ! আপুনি {total} টাৰ ভিতৰত {score} টা শুদ্ধকৈ কৰিলে!",
    greatJobWhere: "সুন্দৰ আইতা! আপুনি {total} টাৰ ভিতৰত {score} টা শুদ্ধকৈ মিলালে!",
    wonderfulSound: "চমৎকাৰ! আপুনি {total} টাৰ ভিতৰত {score} টা শব্দ শুদ্ধকৈ চিনাক্ত কৰিলে!"
  },
  ne: {
    startMatch: "मेमोरी म्याच खेल सुरु भयो। मिल्ने जोडीहरू खोज्नुहोस्।",
    startObj: "वस्तु पहिचान खेल सुरु भयो। चित्र हेरेर सही विकल्पमा ट्याप गर्नुहोस्।",
    startWhere: "यो कहाँ छ खेल सुरु भयो। प्रत्येक वस्तु कहाँ राखिन्छ भन्नुहोस्।",
    startSound: "आवाज मेमोरी खेल सुरु भयो। आवाज सुन्न प्ले गर्नुहोस् र पहिचान गर्नुहोस्।",
    startDiff: "नयाँ {diff} खेल सुरु भयो।",
    congratsMatch: "बधाई छ आमा! तपाईंले {moves} चालमा खेल पूरा गरी {score} अंक प्राप्त गर्नुभयो!",
    foundMatch: "तपाईंले एउटा जोडी फेला पार्नुभयो!",
    wellDoneObj: "राम्रो! तपाईंले {total} मध्ये {score} सही पहिचान गर्नुभयो!",
    greatJobWhere: "राम्रो आमा! तपाईंले {total} मध्ये {score} वस्तु सही ठाउँमा मिलाउनुभयो!",
    wonderfulSound: "अद्भुत! तपाईंले {total} मध्ये {score} आवाज सही पहिचान गर्नुभयो!"
  },
  mni: {
    startMatch: "মেমোরি মেচ শান্নবা হৌরে। মেচ তৌবা যোরাশিং থীউ।",
    startObj: "পোৎশক শকখঙবা শান্নবা হৌরে। লাই অদু য়েংদুনা চুম্বা অপসন থীউ।",
    startWhere: "মসি কদাইদনো শান্নবা হৌরে। পোৎশকশিং কদাইদা থম্বনো তাকপীয়ু।",
    startSound: "खोঞ্জেল মেমোরি শান্নবা হৌরে। খোঞ্জেল তানবা প্লে তৌ অমসুং শকখঙউ।",
    startDiff: "অনৌবা {diff} শান্নবা অমা হৌরে।",
    congratsMatch: "নুমীৎ নুংঙাইরে ইমা! নহাক্না {moves} মুভতা লোইশিল্লে অমসুং স্কোর {score} ফংখ্রে!",
    foundMatch: "নহাক্না মেচ অমা ফংখ্রে!",
    wellDoneObj: "য়াম্না ফরে! নহাক্না {total} গী মনুংদা {score} চুম্না শকখঙখ্রে!",
    greatJobWhere: "য়াম্না ফরে ইমা! নহাক্না {total} গী মনুংদা {score} পোৎশক চুম্না মেচ তৌখ্রে!",
    wonderfulSound: "য়াম্না ফরে! নহাক্না {total} গী মনুংদা {score} খোঞ্জেল চুম্না শকখঙখ্রে!"
  }
};

const WORD_TRANSLATIONS = {
  bn: {
    "Cup": "কাপ", "Spoon": "চামচ", "Plate": "থালা",
    "Clock": "ঘড়ি", "Key": "চাবি", "Lock": "তালা",
    "Apple": "আপেল", "Mango": "আম", "Banana": "কলা",
    "Umbrella": "ছাতা", "Hat": "টুপি", "Bag": "ব্যাগ",
    "Glasses": "চশমা", "Ring": "আংটি", "Watch": "হাতঘড়ি",
    "Book": "বই", "Pen": "কলম", "Paper": "কাগজ",
    "Hammer": "হাতুড়ি", "Shoe": "জুতো", "Sock": "মোজা", "Slipper": "চটি জুতো",
    "Bathroom": "বাথরুম", "Kitchen": "রান্নাঘর", "Bedroom": "শোবার ঘর",
    "Fridge / Kitchen": "ফ্রিজ / রান্নাঘর", "Wardrobe": "আলমারি",
    "Wardrobe / Bedroom": "আলমারি / শোবার ঘর", "Garden": "বাগান",
    "Living Room": "বসার ঘর", "Balcony": "বারান্দা",
    "Bedroom / Bed": "শোবার ঘর / বিছানা", "Keyholder / Near door": "চাবির রিং / দরজার পাশে",
    "We keep the toothbrush in the bathroom.": "আমরা টুথব্রাশ বাথরুমে রাখি।",
    "We keep milk in the fridge or kitchen to keep it fresh.": "আমরা দুধ তাজা রাখতে ফ্রিজে বা রান্নাঘরে রাখি।",
    "We keep clothes neatly in the wardrobe or bedroom closet.": "আমরা জামাকাপড় আলমারিতে বা শোবার ঘরে পরিপাটি করে রাখি।",
    "We keep the frying pan in the kitchen for cooking.": "আমরা রান্নার জন্য কড়াই রান্নাঘরে রাখি।",
    "We keep the pillow on the bed in the bedroom.": "আমরা বালিশ শোবার ঘরে বিছানার ওপর রাখি।",
    "We keep the keys on the keyholder near the entrance door.": "আমরা চাবি দরজার পাশে চাবির হোল্ডারে রাখি।",
    "Where do you keep the toothbrush?": "আপনি টুথব্রাশ কোথায় রাখেন?",
    "Where do you keep the milk?": "দুধ কোথায় রাখা হয়?",
    "Where do you keep your clothes?": "আপনি আপনার জামাকাপড় কোথায় রাখেন?",
    "Where do you keep the frying pan?": "ভাজার কড়াই কোথায় রাখা হয়?",
    "Where do you keep the pillow?": "বালিশ কোথায় রাখা হয়?",
    "Where do you keep the key to the main door?": "প্রধান দরজার চাবি কোথায় রাখা হয়?"
  },
  as: {
    "Cup": "কাপ", "Spoon": "চামুচ", "Plate": "কাঁহী",
    "Clock": "ঘড়ী", "Key": "চাবি", "Lock": "তালা",
    "Apple": "আপেল", "Mango": "আম", "Banana": "কল",
    "Umbrella": "ছাতি", "Hat": "টুপী", "Bag": "বেগ",
    "Glasses": "চশমা", "Ring": "আঙুঠি", "Watch": "হাতঘড়ী",
    "Book": "কিতাপ", "Pen": "কলম", "Paper": "কাগজ",
    "Hammer": "হাতুৰী", "Shoe": "জোতা", "Sock": "মোজা", "Slipper": "চটি জোতা",
    "Bathroom": "বাথৰুম", "Kitchen": "ৰান্ধনীশাল", "Bedroom": "শোৱা কোঠা",
    "Fridge / Kitchen": "ফ্ৰীজ / ৰান্ধনীশাল", "Wardrobe": "আলমাৰী",
    "Wardrobe / Bedroom": "আলমাৰী / শোৱা কোঠা", "Garden": "বাগিচা",
    "Living Room": "বহাকোঠা", "Balcony": "বাৰাণ্ডা",
    "Bedroom / Bed": "শোৱা কোঠা / বিছনা", "Keyholder / Near door": "চাবি ষ্টেণ্ড / দুৱাৰৰ কাষত",
    "We keep the toothbrush in the bathroom.": "আমি টুথব্ৰাছ বাথৰুমত ৰাখোঁ।",
    "We keep milk in the fridge or kitchen to keep it fresh.": "আমি গাখীৰ সতেজ কৰি ৰাখিবলৈ ফ্ৰীজ বা ৰান্ধনীশালত ৰাখোঁ।",
    "We keep clothes neatly in the wardrobe or bedroom closet.": "আমি কাপোৰবোৰ আলমাৰীত বা শোৱা কোঠাত পৰিপাটিকৈ ৰাখোঁ।",
    "We keep the frying pan in the kitchen for cooking.": "আমি ৰন্ধনৰ বাবে ফ্ৰাইং পেন ৰান্ধনীশালত ৰাখোঁ।",
    "We keep the pillow on the bed in the bedroom.": "আমি গাৰু শোৱা কোঠাত বিছনাৰ ওপৰত ৰাখোঁ।",
    "We keep the keys on the keyholder near the entrance door.": "আমি চাবিবোৰ প্ৰৱেশ দুৱাৰৰ কাষৰ চাবি ষ্টেণ্ডত ৰাখোঁ।",
    "Where do you keep the toothbrush?": "আপুনি টুথব্ৰাছ ক’ত ৰাখে?",
    "Where do you keep the milk?": "গাখীৰ ক’ত থোৱা হয়?",
    "Where do you keep your clothes?": "আপুনি নিজৰ কাপোৰ ক’ত ৰাখে?",
    "Where do you keep the frying pan?": "কেৰাহী ক’ত থোৱা হয়?",
    "Where do you keep the pillow?": "গাৰু ক’ত থোৱা হয়?",
    "Where do you keep the key to the main door?": "মূল দুৱাৰৰ চাবি ক’ত থোৱা হয়?"
  },
  ne: {
    "Cup": "कप", "Spoon": "चम्चा", "Plate": "प्लेट",
    "Clock": "घडी", "Key": "चाबी", "Lock": "ताला",
    "Apple": "स्याउ", "Mango": "आँप", "Banana": "केरा",
    "Umbrella": "छाता", "Hat": "टोपी", "Bag": "झोला",
    "Glasses": "चस्मा", "Ring": "औंठी", "Watch": "घडी",
    "Book": "किताब", "Pen": "कलम", "Paper": "कागज",
    "Hammer": "हथौड़ा", "Shoe": "जुत्ता", "Sock": "मोजा", "Slipper": "चप्पल",
    "Bathroom": "बाथरुम", "Kitchen": "भान्सा", "Bedroom": "सुत्ने कोठा",
    "Fridge / Kitchen": "फ्रिज / भान्सा", "Wardrobe": "दराज",
    "Wardrobe / Bedroom": "दराज / सुत्ने कोठा", "Garden": "बगैंचा",
    "Living Room": "बैठक कोठा", "Balcony": "कौसी",
    "Bedroom / Bed": "सुत्ने कोठा / ओछ्यान", "Keyholder / Near door": "चाबी झुन्ड्याउने ठाउँ",
    "We keep the toothbrush in the bathroom.": "हामी ब्रस बाथरुममा राख्छौं।",
    "We keep milk in the fridge or kitchen to keep it fresh.": "हामी दूध ताजा राख्न फ्रिज वा भान्सामा राख्छौं।",
    "We keep clothes neatly in the wardrobe or bedroom closet.": "हामी कपडाहरू दराज वा कोठामा मिलाएर राख्छौं।",
    "We keep the frying pan in the kitchen for cooking.": "हामी प्यान खाना पकाउन भान्सामा राख्छौं।",
    "We keep the pillow on the bed in the bedroom.": "हामी तकिया सुत्ने कोठाको ओछ्यानमा राख्छौं।",
    "We keep the keys on the keyholder near the entrance door.": "हामी चाबी ढोका नजिकै राख्छौं।",
    "Where do you keep the toothbrush?": "तपाईं ब्रस कहाँ राख्नुहुन्छ?",
    "Where do you keep the milk?": "दूध कहाँ राखिन्छ?",
    "Where do you keep your clothes?": "तपाईं आफ्नो कपडा कहाँ राख्नुहुन्छ?",
    "Where do you keep the frying pan?": "प्यान कहाँ राखिन्छ?",
    "Where do you keep the pillow?": "तकिया कहाँ राखिन्छ?",
    "Where do you keep the key to the main door?": "मूल ढोकाको चाबी कहाँ राखिन्छ?"
  },
  mni: {
    "Cup": "কাপ", "Spoon": "চামচ", "Plate": "পুখম",
    "Clock": "পুং", "Key": "সো", "Lock": "থিংজিন",
    "Apple": "সেব", "Mango": "হৈনৌ", "Banana": "লফোই",
    "Umbrella": "সেকপিল", "Hat": "কোপি", "Bag": "খাউ",
    "Glasses": "সমিত", "Ring": "খুদোপ", "Watch": "খুৎপুং",
    "Book": "লাইরিক", "Pen": "পেন", "Paper": "চে",
    "Hammer": "নমেং", "Shoe": "খুপাক", "Sock": "উমখুপ", "Slipper": "চপ্পল",
    "Bathroom": "লুফোম", "Kitchen": "চাংশঙ", "Bedroom": "তুমফম",
    "Fridge / Kitchen": "ফ্রিজ / চাংশঙ", "Wardrobe": "বাক্স",
    "Wardrobe / Bedroom": "আলমারি / তুমফম", "Garden": "লৈকোই",
    "Living Room": "ফমফম", "Balcony": "বারান্দা",
    "Bedroom / Bed": "তুমফম / ফমুং", "Keyholder / Near door": "সো থমফম",
    "We keep the toothbrush in the bathroom.": "ঐখোয়না টুথব্রস অসি লুফোমদা থম্মি।",
    "We keep milk in the fridge or kitchen to keep it fresh.": "ঐখোয়না সংগোম অসি ফ্রিজ নত্রগা চাংশঙদা থম্মি।",
    "We keep clothes neatly in the wardrobe or bedroom closet.": "ঐখোয়না ফিজোলশিং অসি আলমারিদা থম্মি।",
    "We keep the frying pan in the kitchen for cooking.": "ঐখোয়না কড়াই অসি চাংশঙদা থম্মি।",
    "We keep the pillow on the bed in the bedroom.": "ঐখোয়না মনাক অসি ফমুংদা থম্মি।",
    "We keep the keys on the keyholder near the entrance door.": "ঐখোয়না সো অসি থোং মনাক্তা থম্মি।",
    "Where do you keep the toothbrush?": "নহাক্না টুথব্রস কদাইদা থম্বনো?",
    "Where do you keep the milk?": "সংগোম কদাইদা থম্বনো?",
    "Where do you keep your clothes?": "নহাক্না ফিজোল কদাইদা থম্বনো?",
    "Where do you keep the frying pan?": "কড়াই কদাইদা থম্বনো?",
    "Where do you keep the pillow?": "মনাক কদাইদা থম্বনো?",
    "Where do you keep the key to the main door?": "থোংগী সো কদাইদা থম্বনো?"
  }
};

const HINDI_WORDS = {
  "Cup": "कप", "Spoon": "चम्मच", "Plate": "थाली",
  "Clock": "घड़ी", "Key": "चाबी", "Lock": "ताला",
  "Apple": "सेब", "Mango": "आम", "Banana": "केला",
  "Umbrella": "छाता", "Hat": "टोपी", "Bag": "बस्ता",
  "Glasses": "चश्मा", "Ring": "अंगूठी", "Watch": "घड़ी",
  "Book": "किताब", "Pen": "कलम", "Paper": "कागज़",
  "Hammer": "हथौड़ा", "Shoe": "जूता", "Sock": "मोज़ा", "Slipper": "चप्पल",
  "Bathroom": "बाथरूम", "Kitchen": "रसोई", "Bedroom": "शयनकक्ष",
  "Fridge / Kitchen": "रेफ्रिजरेटर / रसोई", "Wardrobe": "अलमारी",
  "Wardrobe / Bedroom": "अलमारी / शयनकक्ष", "Garden": "बगीचा",
  "Living Room": "बैठक", "Balcony": "बालकनी",
  "Bedroom / Bed": "शयनकक्ष / बिस्तर", "Keyholder / Near door": "चाबी का स्टैंड / दरवाजे के पास",
  "We keep the toothbrush in the bathroom.": "हम टूथब्रश को बाथरूम में रखते हैं।",
  "We keep milk in the fridge or kitchen to keep it fresh.": "दूध को ताजा रखने के लिए हम फ्रिज या रसोई में रखते हैं।",
  "We keep clothes neatly in the wardrobe or bedroom closet.": "हम कपड़ों को अलमारी या शयनकक्ष में सफाई से रखते हैं।",
  "We keep the frying pan in the kitchen for cooking.": "हम कड़ाही को खाना पकाने के लिए रसोई में रखते हैं।",
  "We keep the pillow on the bed in the bedroom.": "हम तकिया शयनकक्ष में बिस्तर पर रखते हैं।",
  "We keep the keys on the keyholder near the entrance door.": "हम चाबियों को दरवाजे के पास चाबी स्टैंड में रखते हैं।",
  "Where do you keep the toothbrush?": "आप टूथब्रश कहाँ रखते हैं?",
  "Where do you keep the milk?": "दूध कहाँ रखा जाता है?",
  "Where do you keep your clothes?": "आप अपने कपड़े कहाँ रखते हैं?",
  "Where do you keep the frying pan?": "कड़ाही (फ्राइंग पैन) कहाँ रखी जाती है?",
  "Where do you keep the pillow?": "तकिया कहाँ रखा जाता है?",
  "Where do you keep the key to the main door?": "मुख्य दरवाजे की चाबी कहाँ रखी जाती है?"
};

const TAMIL_WORDS = {
  "Cup": "கோப்பை", "Spoon": "கரண்டி", "Plate": "தட்டு",
  "Clock": "கடிகாரம்", "Key": "சாவி", "Lock": "பூட்டு",
  "Apple": "ஆப்பிள்", "Mango": "மாம்பழம்", "Banana": "வாழைப்பழம்",
  "Umbrella": "குடை", "Hat": "தொப்பி", "Bag": "பை",
  "Glasses": "கண்ணாடி", "Ring": "மோதிரம்", "Watch": "கடிகாரம்",
  "Book": "புத்தகம்", "Pen": "பேனா", "Paper": "காகிதம்",
  "Hammer": "சுத்தியல்", "Shoe": "காலணி", "Sock": "கால் உறை", "Slipper": "செருப்பு",
  "Bathroom": "குளியலறை", "Kitchen": "சமையலறை", "Bedroom": "படுக்கையறை",
  "Fridge / Kitchen": "குளிர்சாதன பெட்டி / சமையலறை", "Wardrobe": "அலமாரி",
  "Wardrobe / Bedroom": "அலமாரி / படுக்கையறை", "Garden": "தோட்டம்",
  "Living Room": "வரவேற்பு அறை", "Balcony": "பால்கனி",
  "Bedroom / Bed": "படுக்கையறை / கட்டில்", "Keyholder / Near door": "சாவி ஸ்டாண்ட் / கதவுக்கு அருகில்",
  "We keep the toothbrush in the bathroom.": "நாம் பற்பசையை குளியலறையில் வைப்போம்.",
  "We keep milk in the fridge or kitchen to keep it fresh.": "பாலை பிரெஷ்ஷாக வைக்க குளிர்சாதன பெட்டி அல்லது சமையலறையில் வைப்போம்.",
  "We keep clothes neatly in the wardrobe or bedroom closet.": "ஆடைகளை அலமாரி அல்லது படுக்கையறையில் வைப்போம்.",
  "We keep the frying pan in the kitchen for cooking.": "சமைப்பதற்காக வறுக்கும் பாத்திரத்தை சமையலறையில் வைப்போம்.",
  "We keep the pillow on the bed in the bedroom.": "தலையணையை படுக்கையறையில் கட்டிலின் மீது வைப்போம்.",
  "We keep the keys on the keyholder near the entrance door.": "சாவி ஸ்டாண்டில் அல்லது கதவுக்கு அருகில் சாவியை வைப்போம்.",
  "Where do you keep the toothbrush?": "பற்பசையை எங்கு வைப்பீர்கள்?",
  "Where do you keep the milk?": "பாலை எங்கு வைப்பீர்கள்?",
  "Where do you keep your clothes?": "உங்கள் ஆடைகளை எங்கு வைப்பீர்கள்?",
  "Where do you keep the frying pan?": "வறுக்கும் பாத்திரத்தை எங்கு வைப்பீர்கள்?",
  "Where do you keep the pillow?": "தலையணையை எங்கு வைப்பீர்கள்?",
  "Where do you keep the key to the main door?": "முக்கிய கதவின் சாவியை எங்கு வைப்பீர்கள்?"
};

function translateWord(word, lang) {
  const code = getLangCode(lang);
  if (code === "hi" && word in HINDI_WORDS) return HINDI_WORDS[word];
  if (code === "ta" && word in TAMIL_WORDS) return TAMIL_WORDS[word];
  if (WORD_TRANSLATIONS[code] && word in WORD_TRANSLATIONS[code]) {
    return WORD_TRANSLATIONS[code][word];
  }
  return word;
}

// --- Original Memory Match Config ---
const ALL_ICONS = ["🪔", "🥁", "🐘", "🌸", "🎋", "🦚", "🥭", "🏛️", "🥥", "🦜"];

const DIFFICULTY_SETTINGS = {
  easy: { pairs: 6, cols: 3, label: "Easy (6 Pairs)", labelHi: "आसान (6 जोड़े)" },
  medium: { pairs: 8, cols: 4, label: "Medium (8 Pairs)", labelHi: "मध्यम (8 जोड़े)" },
  hard: { pairs: 10, cols: 4, label: "Hard (10 Pairs)", labelHi: "कठिन (10 जोड़े)" }
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(difficulty) {
  const { pairs } = DIFFICULTY_SETTINGS[difficulty];
  const selectedIcons = ALL_ICONS.slice(0, pairs);
  return shuffle([...selectedIcons, ...selectedIcons]).map((icon, i) => ({
    id: i,
    icon,
    flipped: false,
    matched: false,
  }));
}

// --- Object Recognition Config ---
const OBJECTS = [
  { name: "Cup", nameHi: "कप", nameTa: "கோப்பை", emoji: "☕", options: ["Cup", "Spoon", "Plate"], optionsHi: ["कप", "चम्मच", "थाली"], optionsTa: ["கோப்பை", "கரண்டி", "தட்டு"] },
  { name: "Clock", nameHi: "घड़ी", nameTa: "கடிகாரம்", emoji: "⏰", options: ["Clock", "Key", "Lock"], optionsHi: ["घड़ी", "चाबी", "ताला"], optionsTa: ["கடிகாரம்", "சாவி", "பூட்டு"] },
  { name: "Apple", nameHi: "सेब", nameTa: "ஆப்பிள்", emoji: "🍎", options: ["Apple", "Mango", "Banana"], optionsHi: ["सेब", "आम", "केला"], optionsTa: ["ஆப்பிள்", "மாம்பழம்", "வாழைப்பழம்"] },
  { name: "Umbrella", nameHi: "छाता", nameTa: "குடை", emoji: "🌂", options: ["Umbrella", "Hat", "Bag"], optionsHi: ["छाता", "टोपी", "बस्ता"], optionsTa: ["குடை", "தொப்பி", "பை"] },
  { name: "Glasses", nameHi: "चश्मा", nameTa: "கண்ணாடி", emoji: "👓", options: ["Glasses", "Ring", "Watch"], optionsHi: ["चश्मा", "अंगूठी", "घड़ी"], optionsTa: ["கண்ணாடி", "மோதிரம்", "கடிகாரம்"] },
  { name: "Book", nameHi: "किताब", nameTa: "புத்தகம்", emoji: "📖", options: ["Book", "Pen", "Paper"], optionsHi: ["किताब", "कलम", "कागज़"], optionsTa: ["புத்தகம்", "பேனா", "காகிதம்"] },
  { name: "Key", nameHi: "चाबी", nameTa: "சாवि", emoji: "🔑", options: ["Key", "Lock", "Hammer"], optionsHi: ["चाबी", "ताला", "हथौड़ा"], optionsTa: ["சாவி", "பூட்டு", "சுத்தியல்"] },
  { name: "Shoe", nameHi: "जूता", nameTa: "காலணி", emoji: "👟", options: ["Shoe", "Sock", "Slipper"], optionsHi: ["जूता", "मोज़ा", "चप्पल"], optionsTa: ["காலணி", "கால் உறை", "செருப்பு"] }
];

const objTranslations = {
  en: {
    question: "Identify the object below:",
    correctText: "Correct! That is a",
    incorrectText: "Not quite. That is a",
    next: "Next Object",
    results: "Results",
    scoreMsg: "You identified {correct} out of {total} objects correctly!",
    finish: "Save & Finish"
  },
  hi: {
    question: "नीचे दी गई वस्तु को पहचानें:",
    correctText: "सही! यह एक",
    incorrectText: "गलत। यह एक",
    next: "अगला ऑब्जेक्ट",
    results: "परिणाम",
    scoreMsg: "आपने {total} में से {correct} वस्तुओं की सही पहचान की!",
    finish: "पूरा करें और सहेजें"
  },
  ta: {
    question: "கீழே உள்ள பொருளை அடையாளம் காணவும்:",
    correctText: "சரி! இது ஒரு",
    incorrectText: "தவறு. இது ஒரு",
    next: "அடுத்த பொருள்",
    results: "முடிவுகள்",
    scoreMsg: "நீங்கள் {total} பொருட்களில் {correct} பொருட்களை சரியாக அடையாளம் கண்டுள்ளீர்கள்!",
    finish: "முடிக்கவும் மற்றும் சேமிக்கவும்"
  },
  bn: {
    question: "নীচের বস্তুটি সনাক্ত করুন:",
    correctText: "সঠিক! এটি একটি",
    incorrectText: "ঠিক নয়। এটি একটি",
    next: "পরবর্তী বস্তু",
    results: "ফলাফল",
    scoreMsg: "আপনি {total} টির মধ্যে {correct} টি বস্তু সঠিকভাবে সনাক্ত করেছেন!",
    finish: "সম্পন্ন ও সংরক্ষণ"
  },
  as: {
    question: "তলৰ বস্তুটো চিনাক্ত কৰক:",
    correctText: "শুদ্ধ! এইটো এটা",
    incorrectText: "শুদ্ধ নহয়। এইটো এটা",
    next: "পৰৱৰ্তী বস্তু",
    results: "ফলাফল",
    scoreMsg: "আপুনি {total} টাৰ ভিতৰত {correct} টা বস্তু শুদ্ধকৈ চিনাক্ত কৰিলে!",
    finish: "পূৰ্ণ কৰক আৰু সাঁচি থওক"
  },
  ne: {
    question: "तलको वस्तु पहिचान गर्नुहोस्:",
    correctText: "सही! यो एक",
    incorrectText: "भएन। यो एक",
    next: "अर्को वस्तु",
    results: "नतिजा",
    scoreMsg: "तपाईंले {total} मध्ये {correct} वस्तुहरू सही पहिचान गर्नुभयो!",
    finish: "बचत र समाप्त"
  },
  mni: {
    question: "মখাগী পোৎশক অসি শকখঙউ:",
    correctText: "চুম্লে! মসি",
    incorrectText: "চুমদে। মসি",
    next: "মথংগী পোৎশক",
    results: "ফল",
    scoreMsg: "নহাক্না {total} গী মনুংদা {correct} পোৎশক চুম্না শকখঙলে!",
    finish: "তুংশিনব অমসুং লোইশিনবা"
  }
};

// --- Where Is It? Config ---
const DAILY_MEMORY_QUESTIONS = [
  {
    question: "Where do you keep the toothbrush?",
    options: ["Bathroom", "Kitchen", "Bedroom"],
    correct: "Bathroom",
    emoji: "🪥",
    explain: "We keep the toothbrush in the bathroom."
  },
  {
    question: "Where do you keep the milk?",
    options: ["Fridge / Kitchen", "Bathroom", "Wardrobe"],
    correct: "Fridge / Kitchen",
    emoji: "🥛",
    explain: "We keep milk in the fridge or kitchen to keep it fresh."
  },
  {
    question: "Where do you keep your clothes?",
    options: ["Wardrobe / Bedroom", "Bathroom", "Garden"],
    correct: "Wardrobe / Bedroom",
    emoji: "👕",
    explain: "We keep clothes neatly in the wardrobe or bedroom closet."
  },
  {
    question: "Where do you keep the frying pan?",
    options: ["Kitchen", "Living Room", "Bathroom"],
    correct: "Kitchen",
    emoji: "🍳",
    explain: "We keep the frying pan in the kitchen for cooking."
  },
  {
    question: "Where do you keep the pillow?",
    options: ["Bedroom / Bed", "Kitchen", "Balcony"],
    correct: "Bedroom / Bed",
    emoji: "🛌",
    explain: "We keep the pillow on the bed in the bedroom."
  },
  {
    question: "Where do you keep the key to the main door?",
    options: ["Keyholder / Near door", "Garden", "Bathroom"],
    correct: "Keyholder / Near door",
    emoji: "🔑",
    explain: "We keep the keys on the keyholder near the entrance door."
  }
];

const whereTranslations = {
  en: {
    question: "Where does this item go?",
    correctText: "Correct!",
    incorrectText: "Not quite.",
    next: "Next Item",
    results: "Daily Memory Results",
    scoreMsg: "You completed {correct} out of {total} daily item matches!",
    finish: "Save & Finish"
  },
  hi: {
    question: "यह वस्तु कहाँ रखी जाती है?",
    correctText: "सही!",
    incorrectText: "गलत।",
    next: "अगली वस्तु",
    results: "दैनिक स्मृति परिणाम",
    scoreMsg: "आपने {total} में से {correct} वस्तुओं का सही मिलान किया!",
    finish: "पूरा करें और सहेजें"
  },
  ta: {
    question: "இந்த பொருள் எங்கு செல்லும்?",
    correctText: "சரி!",
    incorrectText: "தவறு.",
    next: "அடுத்த பொருள்",
    results: "தினசரி நினைவக முடிவுகள்",
    scoreMsg: "நீங்கள் {total} பொருள்களில் {correct} பொருள்களை சரியாகப் பொருத்தீர்க்கிறீர்கள்!",
    finish: "முடிக்கவும் மற்றும் சேமிக்கவும்"
  },
  bn: {
    question: "এই বস্তুটি কোথায় রাখা হয়?",
    correctText: "সঠিক!",
    incorrectText: "ঠিক নয়।",
    next: "পরবর্তী বস্তু",
    results: "দৈনন্দিন স্মৃতি ফলাফল",
    scoreMsg: "আপনি {total} টির মধ্যে {correct} টি বস্তু সঠিকভাবে মিল করেছেন!",
    finish: "সম্পন্ন ও সংরক্ষণ"
  },
  as: {
    question: "এই বস্তুটো ক’ত থোৱা হয়?",
    correctText: "শুদ্ধ!",
    incorrectText: "শুদ্ধ নহয়।",
    next: "পৰৱৰ্তী বস্তু",
    results: "দৈনিক স্মৃতি ফলাফল",
    scoreMsg: "আপুনি {total} টাৰ ভিতৰত {correct} টা বস্তু শুদ্ধকৈ মিলালে!",
    finish: "পূৰ্ণ কৰক আৰু সাঁচি থওক"
  },
  ne: {
    question: "यो वस्तु कहाँ राखिन्छ?",
    correctText: "सही!",
    incorrectText: "भएन।",
    next: "अर्को वस्तु",
    results: "दैनिक स्मृति नतिजा",
    scoreMsg: "तपाईंले {total} मध्ये {correct} वस्तुहरू सही स्थानमा मिलाउनुभयो!",
    finish: "बचत र समाप्त"
  },
  mni: {
    question: "পোৎশক অসি কদাইদা থম্বনো?",
    correctText: "চুম্লে!",
    incorrectText: "চুমদে।",
    next: "মথংগী পোৎশক",
    results: "নোংমগী নীংশিংবা ফল",
    scoreMsg: "নহাক্না {total} গী মনুংদা {correct} পোৎশক চুম্না মেচ তৌখ্রে!",
    finish: "তুংশিনব অমসুং লোইশিনবা"
  }
};

// --- Sound Memory Config ---
const SOUNDS_POOL = [
  {
    id: "bird",
    name: "Bird sound",
    nameHi: "चिड़िया की आवाज",
    nameTa: "பறவையின் ஒலி",
    emoji: "🐦",
    play: () => playBirdSound(),
    desc: "Bird chirping",
    descHi: "चिड़िया की आवाज",
    descTa: "பறவையின் ஒலி"
  },
  {
    id: "rain",
    name: "Rain sound",
    nameHi: "बारिश की आवाज",
    nameTa: "மழையின் ஒலி",
    emoji: "🌧️",
    play: () => playRainSound(),
    desc: "Rain sound",
    descHi: "बारिश की आवाज",
    descTa: "மழையின் ஒலி"
  },
  {
    id: "bell",
    name: "Temple bell sound",
    nameHi: "मंदिर की घंटी की आवाज",
    nameTa: "கோவில் மணியின் ஒலி",
    emoji: "🔔",
    play: () => playTempleBellSound(),
    desc: "Temple bell sound",
    descHi: "मंदिर की घंटी की आवाज",
    descTa: "கோவில் மணியின் ஒலி"
  },
  {
    id: "vehicle",
    name: "Vehicle horn",
    nameHi: "वाहनों के हॉर्न की आवाज",
    nameTa: "வாகன ஹார்ன் ஒலி",
    emoji: "🚗",
    play: () => playVehicleSound(),
    desc: "Vehicle horn",
    descHi: "वाहनों के हॉर्न की आवाज",
    descTa: "வாகன ஹார்ன் ஒலி"
  }
];

const soundTranslations = {
  en: {
    listenBtn: "Listen to Sound",
    playing: "Playing Sound...",
    question: "Which sound did you hear?",
    correctText: "Correct! That was the",
    incorrectText: "Not quite. That was the",
    next: "Next Sound",
    results: "Sound Memory Results",
    scoreMsg: "You identified {correct} out of {total} sounds correctly!",
    finish: "Save & Finish"
  },
  hi: {
    listenBtn: "आवाज सुनें",
    playing: "आवाज बज रही है...",
    question: "आपने कौन सी आवाज सुनी?",
    correctText: "सही! वह थी",
    incorrectText: "गलत। वह थी",
    next: "अगली आवाज",
    results: "आवाज मेमोरी परिणाम",
    scoreMsg: "आपने {total} में से {correct} आवाजों की सही पहचान की!",
    finish: "पूरा करें और सहेजें"
  },
  ta: {
    listenBtn: "ஒலியைக் கேளுங்கள்",
    playing: "ஒலி ஒலிக்கிறது...",
    question: "நீங்கள் என்ன ஒலியைக் கேட்டீர்கள்?",
    correctText: "சரி! அது",
    incorrectText: "தவறு. அது",
    next: "அடுத்த ஒலி",
    results: "ஒலி நினைவக முடிவுகள்",
    scoreMsg: "நீங்கள் {total} ஒலிகளில் {correct} ஒலிகளை சரியாக அடையாளம் கண்டுள்ளீர்கள்!",
    finish: "முடிக்கவும் மற்றும் சேமிக்கவும்"
  },
  bn: {
    listenBtn: "শব্দ শুনুন",
    playing: "শব্দ বাজছে...",
    question: "আপনি কোন শব্দটি শুনেছেন?",
    correctText: "সঠিক! এটি ছিল",
    incorrectText: "ঠিক নয়। এটি ছিল",
    next: "পরবর্তী শব্দ",
    results: "শব্দ মেমরি ফলাফল",
    scoreMsg: "আপনি {total} টির মধ্যে {correct} টি শব্দ সঠিকভাবে সনাক্ত করেছেন!",
    finish: "সম্পন্ন ও সংরক্ষণ"
  },
  as: {
    listenBtn: "শব্দ শুনক",
    playing: "শব্দ বাজি আছে...",
    question: "আপুনি কি শব্দ শুনিলে?",
    correctText: "শুদ্ধ! এইটো আছিল",
    incorrectText: "শুদ্ধ নহয়। এইটো আছিল",
    next: "পৰৱৰ্তী শব্দ",
    results: "শব্দ স্মৃতি ফলাফল",
    scoreMsg: "আপুনি {total} টাৰ ভিতৰত {correct} টা শব্দ শুদ্ধকৈ চিনাক্ত কৰিলে!",
    finish: "পূৰ্ণ কৰক আৰু সাঁচি থওক"
  },
  ne: {
    listenBtn: "आवाज सुन्नुहोस्",
    playing: "आवाज बज्दैछ...",
    question: "तपाईंले कुन आवाज सुन्नुभयो?",
    correctText: "सही! यो आवाज",
    incorrectText: "भएन। यो आवाज",
    next: "अर्को आवाज",
    results: "आवाज मेमोरी नतिजा",
    scoreMsg: "तपाईंले {total} मध्ये {correct} आवाजहरू सही पहिचान गर्नुभयो!",
    finish: "बचत र समाप्त"
  },
  mni: {
    listenBtn: "খোঞ্জেল তাবিউ",
    playing: "খোঞ্জেল শান্নরি...",
    question: "নহাক্না কদাইগী খোঞ্জেল তাখিবনো?",
    correctText: "চুম্লে! মসি",
    incorrectText: "চুমদে। মসি",
    next: "মথংগী খোঞ্জেল",
    results: "খোঞ্জেল স্মৃতি ফল",
    scoreMsg: "নহাক্না {total} গী মনুংদা {correct} খোঞ্জেল চুম্না শকখঙলে!",
    finish: "তুংশিনব অমসুং লোইশিনবা"
  }
};

export default function GameScreen({ back, onGameComplete, speak, adaptiveRecommendation, setAdaptiveRecommendation, language = "en" }) {
  const langCode = getLangCode(language);
  const v = SPEAK_VOCALS[langCode] || SPEAK_VOCALS["en"];
  const enV = SPEAK_VOCALS["en"];

  const [activeGame, setActiveGame] = useState(null); // null (selector) | "match" | "object" | "where" | "sound"

  // Unified difficulty (easy, medium, hard)
  const [difficulty, setDifficulty] = useState("medium");

  // --- Original Memory Match State ---
  const [deck, setDeck] = useState([]);
  const [flippedIds, setFlippedIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState(false);
  
  // Timer state (Memory Match)
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // --- Object Recognition State ---
  const [objIndex, setObjIndex] = useState(0);
  const [objSelected, setObjSelected] = useState(null);
  const [objScore, setObjScore] = useState(0);
  const [objRounds, setObjRounds] = useState([]);
  const [objFinished, setObjFinished] = useState(false);
  const [objTimer, setObjTimer] = useState(0);
  const objStartTimeRef = useRef(null);

  // --- Where Is It State ---
  const [whereIndex, setWhereIndex] = useState(0);
  const [whereSelected, setWhereSelected] = useState(null);
  const [whereScore, setWhereScore] = useState(0);
  const [whereRounds, setWhereRounds] = useState([]);
  const [whereFinished, setWhereFinished] = useState(false);
  const [whereTimer, setWhereTimer] = useState(0);
  const whereStartTimeRef = useRef(null);

  // --- Sound Memory State ---
  const [soundIndex, setSoundIndex] = useState(0);
  const [soundSelected, setSoundSelected] = useState(null);
  const [soundScore, setSoundScore] = useState(0);
  const [soundRounds, setSoundRounds] = useState([]);
  const [soundFinished, setSoundFinished] = useState(false);
  const [soundTimer, setSoundTimer] = useState(0);
  const soundStartTimeRef = useRef(null);
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  // --- Dynamic Option Sorters per Difficulty ---
  const initObjectGame = (diff) => {
    const numRounds = diff === "easy" ? 3 : diff === "medium" ? 4 : 6;
    const shuffled = shuffle(OBJECTS).slice(0, numRounds).map(round => {
      let indices = [0, 1, 2];
      let extraOption = null;
      if (diff === "easy") {
        indices = shuffle([0, Math.random() < 0.5 ? 1 : 2]);
      } else if (diff === "medium") {
        indices = shuffle([0, 1, 2]);
      } else if (diff === "hard") {
        const other = OBJECTS.filter(o => o.name !== round.name);
        extraOption = other[Math.floor(Math.random() * other.length)];
        indices = shuffle([0, 1, 2, 3]);
      }
      return { ...round, indices, extraOption };
    });
    setObjRounds(shuffled);
    setObjIndex(0);
    setObjSelected(null);
    setObjScore(0);
    setObjFinished(false);
    setObjTimer(0);
    objStartTimeRef.current = Date.now();
  };

  const initWhereGame = (diff) => {
    const numRounds = diff === "easy" ? 3 : diff === "medium" ? 4 : 6;
    const shuffled = shuffle(DAILY_MEMORY_QUESTIONS).slice(0, numRounds).map(round => {
      const correctIdx = round.options.indexOf(round.correct);
      const incorrectIndices = [0, 1, 2].filter(idx => idx !== correctIdx);
      
      let indices = [0, 1, 2];
      let extraOption = null;
      if (diff === "easy") {
        indices = shuffle([correctIdx, incorrectIndices[Math.floor(Math.random() * incorrectIndices.length)]]);
      } else if (diff === "medium") {
        indices = shuffle([0, 1, 2]);
      } else if (diff === "hard") {
        const otherQuestions = DAILY_MEMORY_QUESTIONS.filter(q => q.question !== round.question);
        const randomQ = otherQuestions[Math.floor(Math.random() * otherQuestions.length)];
        const possibleExtras = randomQ.options.filter(opt => !round.options.includes(opt));
        const extraEng = possibleExtras.length ? possibleExtras[0] : "Garden";
        
        const extraIdx = randomQ.options.indexOf(extraEng);
        extraOption = {
          en: extraEng,
          hi: HINDI_WORDS[extraEng] || "बगीचा",
          ta: TAMIL_WORDS[extraEng] || "தோட்டம்"
        };
        indices = shuffle([0, 1, 2, 3]);
      }
      return { ...round, indices, extraOption };
    });
    setWhereRounds(shuffled);
    setWhereIndex(0);
    setWhereSelected(null);
    setWhereScore(0);
    setWhereFinished(false);
    setWhereTimer(0);
    whereStartTimeRef.current = Date.now();
  };

  const initSoundGame = (diff) => {
    const numRounds = diff === "easy" ? 3 : 4; 
    const shuffled = shuffle(SOUNDS_POOL).slice(0, numRounds).map(round => {
      const correctIdx = SOUNDS_POOL.findIndex(s => s.id === round.id);
      const otherIdxs = [0, 1, 2, 3].filter(idx => idx !== correctIdx);
      
      let indices = [0, 1, 2, 3];
      if (diff === "easy") {
        indices = shuffle([correctIdx, otherIdxs[Math.floor(Math.random() * otherIdxs.length)]]);
      } else if (diff === "medium") {
        const shuffledOthers = shuffle(otherIdxs);
        indices = shuffle([correctIdx, shuffledOthers[0], shuffledOthers[1]]);
      } else if (diff === "hard") {
        indices = shuffle([0, 1, 2, 3]);
      }
      return { ...round, indices };
    });
    setSoundRounds(shuffled);
    setSoundIndex(0);
    setSoundSelected(null);
    setSoundScore(0);
    setSoundFinished(false);
    setSoundTimer(0);
    soundStartTimeRef.current = Date.now();
    setIsPlayingSound(false);
  };

  const selectGame = (game) => {
    playTapSound();
    if (game === "match") {
      setDeck(buildDeck(difficulty));
      setFlippedIds([]);
      setMoves(0);
      setLocked(false);
      setWon(false);
      setSeconds(0);
      setActiveGame("match");
      speak(enV.startMatch, v.startMatch);
    } else if (game === "object") {
      initObjectGame(difficulty);
      setActiveGame("object");
      speak(enV.startObj, v.startObj);
    } else if (game === "where") {
      initWhereGame(difficulty);
      setActiveGame("where");
      speak(enV.startWhere, v.startWhere);
    } else if (game === "sound") {
      initSoundGame(difficulty);
      setActiveGame("sound");
      speak(enV.startSound, v.startSound);
    }
  };

  // --- Timer effect for active games ---
  useEffect(() => {
    let interval = null;
    if (activeGame === "match" && !won) {
      startTimeRef.current = Date.now() - seconds * 1000;
      interval = setInterval(() => {
        setSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } else if (activeGame === "object" && !objFinished) {
      objStartTimeRef.current = Date.now() - objTimer * 1000;
      interval = setInterval(() => {
        setObjTimer(Math.floor((Date.now() - objStartTimeRef.current) / 1000));
      }, 1000);
    } else if (activeGame === "where" && !whereFinished) {
      whereStartTimeRef.current = Date.now() - whereTimer * 1000;
      interval = setInterval(() => {
        setWhereTimer(Math.floor((Date.now() - whereStartTimeRef.current) / 1000));
      }, 1000);
    } else if (activeGame === "sound" && !soundFinished) {
      soundStartTimeRef.current = Date.now() - soundTimer * 1000;
      interval = setInterval(() => {
        setSoundTimer(Math.floor((Date.now() - soundStartTimeRef.current) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeGame, won, objFinished, whereFinished, soundFinished]);

  // --- General Difficulty Switcher ---
  const handleDifficultyChange = (diff) => {
    playTapSound();
    setDifficulty(diff);
    
    if (activeGame === "match") {
      setDeck(buildDeck(diff));
      setFlippedIds([]);
      setMoves(0);
      setLocked(false);
      setWon(false);
      setSeconds(0);
    } else if (activeGame === "object") {
      initObjectGame(diff);
    } else if (activeGame === "where") {
      initWhereGame(diff);
    } else if (activeGame === "sound") {
      initSoundGame(diff);
    }
    
    if (adaptiveRecommendation === diff) {
      setAdaptiveRecommendation("");
    }
    speak(enV.startDiff.replace("{diff}", diff), v.startDiff.replace("{diff}", diff));
  };

  const applyAdaptiveRecommendation = () => {
    if (adaptiveRecommendation) {
      handleDifficultyChange(adaptiveRecommendation);
      setAdaptiveRecommendation("");
    }
  };

  // --- Memory Match Logic ---
  useEffect(() => {
    if (activeGame === "match" && deck.length && deck.every((c) => c.matched)) {
      setWon(true);
      playWinSound();
      
      const baseScores = { easy: 85, medium: 100, hard: 115 };
      const idealMoves = { easy: 6, medium: 8, hard: 10 };
      const base = baseScores[difficulty];
      const movePenalty = (moves - idealMoves[difficulty]) * 4;
      const timePenalty = Math.floor(seconds / 3);
      const score = Math.max(50, base - Math.max(0, movePenalty) - timePenalty);
      
      speak(
        enV.congratsMatch.replace("{moves}", moves).replace("{score}", score),
        v.congratsMatch.replace("{moves}", moves).replace("{score}", score)
      );
      
      if (onGameComplete) {
        onGameComplete({
          gameName: "Memory Match",
          difficulty: difficulty.toUpperCase(),
          score,
          moves,
          time: seconds,
          details: `Moves: ${moves} | Time: ${seconds}s`,
          date: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
          timestamp: Date.now()
        });
      }
    }
  }, [deck]);

  function handleFlip(card) {
    if (locked || card.flipped || card.matched || flippedIds.length === 2) return;
    
    playTapSound();
    const nextDeck = deck.map((c) => (c.id === card.id ? { ...c, flipped: true } : c));
    const nextFlipped = [...flippedIds, card.id];
    setDeck(nextDeck);
    setFlippedIds(nextFlipped);

    if (nextFlipped.length === 2) {
      setLocked(true);
      setMoves((m) => m + 1);
      const [a, b] = nextFlipped.map((id) => nextDeck.find((c) => c.id === id));
      
      if (a.icon === b.icon) {
        setTimeout(() => {
          setDeck((d) => d.map((c) => (c.id === a.id || c.id === b.id ? { ...c, matched: true } : c)));
          setFlippedIds([]);
          setLocked(false);
          playMatchSound();
          speak(enV.foundMatch, v.foundMatch);
        }, 400);
      } else {
        setTimeout(() => {
          setDeck((d) => d.map((c) => (c.id === a.id || c.id === b.id ? { ...c, flipped: false } : c)));
          setFlippedIds([]);
          setLocked(false);
        }, 800);
      }
    }
  }

  // --- Object Recognition Logic ---
  const handleObjectAnswer = (optionKey) => {
    if (objSelected !== null) return;
    setObjSelected(optionKey);
    const round = objRounds[objIndex];
    const isCorrect = optionKey === round.name;
    const tr = objTranslations[getLangCode(language)] || objTranslations["en"];
    
    const trEn = objTranslations["en"];
    
    if (isCorrect) {
      setObjScore((s) => s + 1);
      playMatchSound();
      const speakName = translateWord(round.name, language);
      speak(
        `${trEn.correctText} ${round.name.toLowerCase()}.`,
        `${tr.correctText} ${speakName}.`
      );
    } else {
      playTapSound();
      const speakName = translateWord(round.name, language);
      speak(
        `${trEn.incorrectText} ${round.name.toLowerCase()}.`,
        `${tr.incorrectText} ${speakName}.`
      );
    }
  };

  const nextObjectRound = () => {
    playTapSound();
    if (objIndex + 1 < objRounds.length) {
      setObjIndex((i) => i + 1);
      setObjSelected(null);
    } else {
      setObjFinished(true);
      playWinSound();
      const finalScorePoints = Math.round(40 + (objScore / objRounds.length) * 60);
      
      speak(
        enV.wellDoneObj.replace("{score}", objScore).replace("{total}", objRounds.length),
        v.wellDoneObj.replace("{score}", objScore).replace("{total}", objRounds.length)
      );

      if (onGameComplete) {
        onGameComplete({
          gameName: "Object Recognition",
          difficulty: difficulty.toUpperCase(),
          score: finalScorePoints,
          time: objTimer,
          details: `Correct: ${objScore}/${objRounds.length} | Time: ${objTimer}s`,
          date: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
          timestamp: Date.now()
        });
      }
    }
  };

  // --- Where Is It Logic ---
  const handleWhereAnswer = (optionKey) => {
    if (whereSelected !== null) return;
    const round = whereRounds[whereIndex];
    const isCorrect = optionKey === round.correct;
    setWhereSelected(optionKey);
    const tr = whereTranslations[getLangCode(language)] || whereTranslations["en"];
    
    if (isCorrect) {
      setWhereScore((s) => s + 1);
      playMatchSound();
    } else {
      playTapSound();
    }
    
    const trEn = whereTranslations["en"];
    const explanationEn = round.explain || `We keep the ${round.correct.toLowerCase()} in the ${round.correct.toLowerCase()}.`;
    const explanation = translateWord(explanationEn, language);
    const correctPrefix = isCorrect ? tr.correctText : tr.incorrectText;
    const correctPrefixEn = isCorrect ? trEn.correctText : trEn.incorrectText;
    
    speak(
      `${correctPrefixEn} ${explanationEn}`,
      `${correctPrefix} ${explanation}`
    );
  };

  const nextWhereRound = () => {
    playTapSound();
    if (whereIndex + 1 < whereRounds.length) {
      setWhereIndex((i) => i + 1);
      setWhereSelected(null);
    } else {
      setWhereFinished(true);
      playWinSound();
      const finalScorePoints = Math.round(40 + (whereScore / whereRounds.length) * 60);
      
      speak(
        enV.greatJobWhere.replace("{score}", whereScore).replace("{total}", whereRounds.length),
        v.greatJobWhere.replace("{score}", whereScore).replace("{total}", whereRounds.length)
      );

      if (onGameComplete) {
        onGameComplete({
          gameName: "Where Is It?",
          difficulty: difficulty.toUpperCase(),
          score: finalScorePoints,
          time: whereTimer,
          details: `Matched: ${whereScore}/${whereRounds.length} | Time: ${whereTimer}s`,
          date: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
          timestamp: Date.now()
        });
      }
    }
  };

  // --- Sound Memory Logic ---
  const triggerPlaySound = (soundObj) => {
    if (isPlayingSound) return;
    playTapSound();
    setIsPlayingSound(true);
    soundObj.play();
    
    setTimeout(() => {
      setIsPlayingSound(false);
    }, 2800);
  };

  const handleSoundAnswer = (soundId) => {
    if (soundSelected !== null) return;
    setSoundSelected(soundId);
    const round = soundRounds[soundIndex];
    const isCorrect = soundId === round.id;
    const tr = soundTranslations[getLangCode(language)] || soundTranslations["en"];
    
    const trEn = soundTranslations["en"];
    
    if (isCorrect) {
      setSoundScore((s) => s + 1);
      playMatchSound();
      const nameVoice = getLangCode(language) === "hi" ? round.nameHi : getLangCode(language) === "ta" ? round.nameTa : round.name;
      speak(
        `${trEn.correctText} ${round.name.toLowerCase()}.`,
        `${tr.correctText} ${nameVoice}`
      );
    } else {
      playTapSound();
      const nameVoice = getLangCode(language) === "hi" ? round.nameHi : getLangCode(language) === "ta" ? round.nameTa : round.name;
      speak(
        `${trEn.incorrectText} ${round.name.toLowerCase()}.`,
        `${tr.incorrectText} ${nameVoice}`
      );
    }
  };

  const nextSoundRound = () => {
    playTapSound();
    if (soundIndex + 1 < soundRounds.length) {
      setSoundIndex((i) => i + 1);
      setSoundSelected(null);
    } else {
      setSoundFinished(true);
      playWinSound();
      const finalScorePoints = Math.round(40 + (soundScore / soundRounds.length) * 60);
      
      speak(
        enV.wonderfulSound.replace("{score}", soundScore).replace("{total}", soundRounds.length),
        v.wonderfulSound.replace("{score}", soundScore).replace("{total}", soundRounds.length)
      );

      if (onGameComplete) {
        onGameComplete({
          gameName: "Sound Memory",
          difficulty: difficulty.toUpperCase(),
          score: finalScorePoints,
          time: soundTimer,
          details: `Identified: ${soundScore}/${soundRounds.length} | Time: ${soundTimer}s`,
          date: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
          timestamp: Date.now()
        });
      }
    }
  };

  // --- Unified Difficulty Panel UI ---
  const renderDifficultySelector = () => (
    <div style={{ 
      display: "flex", 
      gap: 6, 
      marginBottom: 14,
      background: "var(--color-teal-light)",
      padding: 4,
      borderRadius: 14,
      border: "1px solid var(--color-teal-soft)"
    }}>
      {["easy", "medium", "hard"].map((diff) => (
        <button
          key={diff}
          onClick={() => handleDifficultyChange(diff)}
          style={{
            flex: 1,
            padding: "8px 4px",
            border: "none",
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            background: difficulty === diff ? "var(--color-teal)" : "transparent",
            color: difficulty === diff ? "white" : "var(--color-teal)",
            transition: "all 0.2s"
          }}
        >
          {diff.toUpperCase()}
        </button>
      ))}
    </div>
  );

  // Retrieve current translations based on active fallback language
  const resolvedLang = getLangCode(language);
  const t = SELECTOR_TRANSLATIONS[resolvedLang] || SELECTOR_TRANSLATIONS["en"];

  // --- RENDER GAME SELECTOR ---
  if (activeGame === null) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <button
            onClick={back}
            aria-label="Go back"
            style={{
              border: "none",
              background: "var(--color-teal-light)",
              borderRadius: 14,
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--color-teal)"
            }}
          >
            <ArrowLeft size={22} />
          </button>
          <h2 style={{ fontSize: 22, color: "var(--color-text-dark)", fontWeight: 800 }}>
            {t.header}
          </h2>
        </div>

        <p style={{ fontSize: 13.5, color: "var(--color-text-muted)", marginBottom: 20, lineHeight: 1.5 }}>
          {t.desc}
        </p>

        {/* Global difficulty selection pre-game */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-teal)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
            {t.difficultyLabel} {difficulty.toUpperCase()}
          </div>
          {renderDifficultySelector()}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1, overflowY: "auto", paddingBottom: 20 }}>
          {/* Card 1: Memory Match */}
          <button 
            className="btn-big" 
            onClick={() => selectGame("match")}
            style={{ margin: 0, padding: 18 }}
          >
            <div className="btn-big-icon-container" style={{ background: "var(--color-teal)", width: 50, height: 50, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
              🎴
            </div>
            <div style={{ flex: 1 }}>
              <div className="btn-big-title" style={{ fontSize: 16.5 }}>
                {t.matchTitle}
              </div>
              <div className="btn-big-sub" style={{ fontSize: 12, lineHeight: 1.4 }}>
                {t.matchSub}
              </div>
            </div>
          </button>

          {/* Card 2: Object Recognition */}
          <button 
            className="btn-big" 
            onClick={() => selectGame("object")}
            style={{ margin: 0, padding: 18 }}
          >
            <div className="btn-big-icon-container" style={{ background: "var(--color-terracotta)", width: 50, height: 50, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
              🔍
            </div>
            <div style={{ flex: 1 }}>
              <div className="btn-big-title" style={{ fontSize: 16.5 }}>
                {t.objTitle}
              </div>
              <div className="btn-big-sub" style={{ fontSize: 12, lineHeight: 1.4 }}>
                {t.objSub}
              </div>
            </div>
          </button>

          {/* Card 3: Where Is It? */}
          <button 
            className="btn-big" 
            onClick={() => selectGame("where")}
            style={{ margin: 0, padding: 18 }}
          >
            <div className="btn-big-icon-container" style={{ background: "var(--color-gold)", width: 50, height: 50, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
              🏠
            </div>
            <div style={{ flex: 1 }}>
              <div className="btn-big-title" style={{ fontSize: 16.5 }}>
                {t.whereTitle}
              </div>
              <div className="btn-big-sub" style={{ fontSize: 12, lineHeight: 1.4 }}>
                {t.whereSub}
              </div>
            </div>
          </button>

          {/* Card 4: Sound Memory */}
          <button 
            className="btn-big" 
            onClick={() => selectGame("sound")}
            style={{ margin: 0, padding: 18 }}
          >
            <div className="btn-big-icon-container" style={{ background: "var(--color-teal-medium)", width: 50, height: 50, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
              🎵
            </div>
            <div style={{ flex: 1 }}>
              <div className="btn-big-title" style={{ fontSize: 16.5 }}>
                {t.soundTitle}
              </div>
              <div className="btn-big-sub" style={{ fontSize: 12, lineHeight: 1.4 }}>
                {t.soundSub}
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER MEMORY MATCH GAME ---
  if (activeGame === "match") {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Top Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <button
            onClick={() => { playTapSound(); setActiveGame(null); }}
            aria-label="Go back"
            style={{
              border: "none",
              background: "var(--color-teal-light)",
              borderRadius: 14,
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--color-teal)"
            }}
          >
            <ArrowLeft size={22} />
          </button>
          <h2 style={{ fontSize: 22, color: "var(--color-text-dark)", fontWeight: 800 }}>
            {t.matchTitle}
          </h2>
        </div>

        {/* Adaptive Recommendation Banner */}
        {!won && adaptiveRecommendation && adaptiveRecommendation !== difficulty && (
          <div style={{
            background: "var(--color-gold-light)",
            border: "1px solid #fde68a",
            borderRadius: 16,
            padding: "10px 14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
            animation: "matchPulse 0.5s ease"
          }}>
            <div style={{ fontSize: 12, color: "#78350f", fontWeight: 600 }}>
              💡 Suggested level: <strong>{adaptiveRecommendation.toUpperCase()}</strong>
            </div>
            <button
              onClick={applyAdaptiveRecommendation}
              style={{
                border: "none",
                background: "var(--color-gold)",
                color: "white",
                padding: "6px 12px",
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Switch
            </button>
          </div>
        )}

        {/* Difficulty Selector */}
        {!won && renderDifficultySelector()}

        {/* Info bar */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          fontSize: 14, 
          color: "var(--color-text-muted)",
          marginBottom: 16,
          padding: "8px 12px",
          background: "var(--color-bg-warm)",
          borderRadius: 12,
          fontWeight: 600
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Gamepad2 size={16} color="var(--color-teal)" />
            <span>{t.moves}: {moves}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Timer size={16} color="var(--color-terracotta)" />
            <span>{t.time}: {seconds}s</span>
          </div>
        </div>

        {won ? (
          <div style={{ textAlign: "center", padding: "30px 10px", background: "var(--color-teal-light)", borderRadius: 24, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div style={{ fontSize: 60, marginBottom: 12, animation: "matchPulse 1s infinite" }}>🎉</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: "var(--color-teal)", marginBottom: 6 }}>
              {resolvedLang === "hi" ? "शानदार खेल!" : resolvedLang === "ta" ? "சிறப்பாக விளையாடினீர்கள்!" : "Well played!"}
            </h3>
            <p style={{ fontSize: 14, color: "var(--color-text-muted)", marginBottom: 18, lineHeight: 1.5 }}>
              Completed <strong style={{ color: "var(--color-text-dark)" }}>{difficulty} level</strong> in <strong style={{ color: "var(--color-text-dark)" }}>{moves} {t.moves.toLowerCase()}</strong> and <strong style={{ color: "var(--color-text-dark)" }}>{seconds} seconds</strong>.
            </p>
            
            <div style={{
              background: "white",
              padding: "12px 20px",
              borderRadius: 18,
              boxShadow: "var(--shadow-md)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 24,
              border: "1px solid var(--color-teal-soft)"
            }}>
              <Award size={24} color="var(--color-gold)" />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 10, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>{t.score}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--color-teal)" }}>
                  {Math.max(50, (difficulty === "easy" ? 85 : difficulty === "medium" ? 100 : 115) - (moves - (difficulty === "easy" ? 6 : difficulty === "medium" ? 8 : 10)) * 4 - Math.floor(seconds / 3))} pts
                </div>
              </div>
            </div>

            <button
              onClick={() => handleDifficultyChange(difficulty)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                borderRadius: 16,
                border: "none",
                background: "var(--color-teal)",
                color: "white",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(8, 81, 92, 0.2)"
              }}
            >
              <RotateCcw size={16} /> {t.playAgain}
            </button>
          </div>
        ) : (
          <div 
            className="game-grid"
            style={{
              gridTemplateColumns: `repeat(${DIFFICULTY_SETTINGS[difficulty]?.cols || 4}, 1fr)`
            }}
          >
            {deck.map((card) => (
              <button
                key={card.id}
                onClick={() => handleFlip(card)}
                className={`game-card ${card.flipped ? "flipped" : ""} ${card.matched ? "matched" : ""}`}
                aria-label={card.flipped || card.matched ? `revealed ${card.icon}` : "hidden card"}
                style={{
                  fontSize: difficulty === "hard" ? "26px" : "32px",
                  height: "72px"
                }}
              >
                {/* 
                  Fix mirrored emoji issue: Emojis look reversed/mirrored when card rotates 180deg.
                  Here we rotate the span 180deg back to cancel out the mirroring.
                */}
                {card.flipped || card.matched ? (
                  <span style={{ display: "inline-block", transform: card.flipped ? "rotateY(180deg)" : "none" }}>
                    {card.icon}
                  </span>
                ) : ""}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- RENDER OBJECT RECOGNITION ---
  if (activeGame === "object") {
    const tr = objTranslations[resolvedLang] || objTranslations["en"];
    const currentRound = objRounds[objIndex];

    // Helper to get formatted options list based on difficulty mapping
    const getOptionsForRound = (round) => {
      if (!round || !round.indices) return [];
      const baseEng = round.options;
      return round.indices.map(idx => {
        if (idx === 3 && round.extraOption) {
          return {
            key: round.extraOption.name,
            label: translateWord(round.extraOption.name, language)
          };
        }
        return {
          key: baseEng[idx],
          label: translateWord(baseEng[idx], language)
        };
      });
    };

    const displayOptions = getOptionsForRound(currentRound);

    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <button
            onClick={() => { playTapSound(); setActiveGame(null); }}
            aria-label="Go back"
            style={{
              border: "none",
              background: "var(--color-teal-light)",
              borderRadius: 14,
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--color-teal)"
            }}
          >
            <ArrowLeft size={22} />
          </button>
          <h2 style={{ fontSize: 21, color: "var(--color-text-dark)", fontWeight: 800 }}>
            {t.objTitle}
          </h2>
        </div>

        {/* Difficulty Selection */}
        {!objFinished && renderDifficultySelector()}

        {objFinished ? (
          <div style={{ textAlign: "center", padding: "30px 10px", background: "var(--color-teal-light)", borderRadius: 24, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div style={{ fontSize: 60, marginBottom: 12, animation: "matchPulse 1s infinite" }}>🏆</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: "var(--color-teal)", marginBottom: 6 }}>
              {t.completed}
            </h3>
            <p style={{ fontSize: 14, color: "var(--color-text-muted)", marginBottom: 20, lineHeight: 1.5, padding: "0 10px" }}>
              {tr.scoreMsg.replace("{correct}", objScore).replace("{total}", objRounds.length)}
            </p>

            <div style={{
              background: "white",
              padding: "12px 20px",
              borderRadius: 18,
              boxShadow: "var(--shadow-md)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 24,
              border: "1px solid var(--color-teal-soft)"
            }}>
              <Award size={24} color="var(--color-gold)" />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 10, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>{t.score}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--color-teal)" }}>
                  {Math.round(40 + (objScore / objRounds.length) * 60)} pts
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, width: "100%" }}>
              <button
                onClick={() => selectGame("object")}
                style={{
                  flex: 1,
                  padding: "14px",
                  borderRadius: 16,
                  border: "2px solid var(--color-teal-soft)",
                  background: "white",
                  color: "var(--color-teal)",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                {t.playAgain}
              </button>
              <button
                onClick={() => { playTapSound(); setActiveGame(null); }}
                style={{
                  flex: 1,
                  padding: "14px",
                  borderRadius: 16,
                  border: "none",
                  background: "var(--color-teal)",
                  color: "white",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "var(--shadow-sm)"
                }}
              >
                {t.saveFinish}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Progress and timer */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, color: "var(--color-text-muted)", marginBottom: 16 }}>
              <span>{t.round} {objIndex + 1} {t.of} {objRounds.length}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Timer size={14} color="var(--color-terracotta)" />
                {objTimer}s
              </span>
            </div>

            {/* Display card */}
            <div style={{
              background: "white",
              borderRadius: 24,
              border: "1px solid var(--color-teal-soft)",
              boxShadow: "var(--shadow-md)",
              padding: "24px 16px",
              textAlign: "center",
              marginBottom: 16,
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}>
              <div style={{
                width: 130,
                height: 130,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--color-teal-light) 0%, var(--color-teal-soft) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 70,
                marginBottom: 20,
                boxShadow: "inset 0 4px 10px rgba(8, 81, 92, 0.08)",
                border: "2px solid white",
                animation: "matchPulse 1s ease"
              }}>
                {currentRound?.emoji}
              </div>

              <div style={{ fontSize: 16, color: "var(--color-text-dark)", fontWeight: 700, marginBottom: 16 }}>
                {tr.question}
              </div>

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 10 }}>
                {displayOptions.map((opt, idx) => {
                  const isSelected = objSelected === opt.key;
                  const isCorrect = opt.key === currentRound?.name;
                  
                  let btnStyle = {};
                  if (objSelected !== null) {
                    if (isCorrect) {
                      btnStyle = {
                        backgroundColor: "var(--color-success-light)",
                        borderColor: "var(--color-success)",
                        color: "var(--color-success)"
                      };
                    } else if (isSelected) {
                      btnStyle = {
                        backgroundColor: "var(--color-danger-light)",
                        borderColor: "var(--color-danger)",
                        color: "var(--color-danger)"
                      };
                    } else {
                      btnStyle = { opacity: 0.5 };
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={objSelected !== null}
                      onClick={() => handleObjectAnswer(opt.key)}
                      className="family-option-btn"
                      style={{ ...btnStyle, margin: 0 }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        {objSelected !== null && isCorrect && <Check size={16} />}
                        {objSelected !== null && isSelected && !isCorrect && <X size={16} />}
                        {opt.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom navigation */}
            {objSelected !== null && (
              <button
                onClick={nextObjectRound}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  width: "100%",
                  padding: "16px",
                  borderRadius: 18,
                  border: "none",
                  background: "var(--color-teal)",
                  color: "white",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "var(--shadow-sm)",
                  marginTop: "auto"
                }}
              >
                <span>{tr.next}</span>
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // --- RENDER WHERE IS IT ---
  if (activeGame === "where") {
    const tr = whereTranslations[resolvedLang] || whereTranslations["en"];
    const currentRound = whereRounds[whereIndex];

    const getWhereOptionsForRound = (round) => {
      if (!round || !round.indices) return [];
      const baseEng = round.options;
      return round.indices.map(idx => {
        if (idx === 3 && round.extraOption) {
          return {
            key: round.extraOption.en,
            label: translateWord(round.extraOption.en, language)
          };
        }
        return {
          key: baseEng[idx],
          label: translateWord(baseEng[idx], language)
        };
      });
    };

    const displayOptions = getWhereOptionsForRound(currentRound);
    const questionText = translateWord(currentRound?.question, language);

    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <button
            onClick={() => { playTapSound(); setActiveGame(null); }}
            aria-label="Go back"
            style={{
              border: "none",
              background: "var(--color-teal-light)",
              borderRadius: 14,
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--color-teal)"
            }}
          >
            <ArrowLeft size={22} />
          </button>
          <h2 style={{ fontSize: 21, color: "var(--color-text-dark)", fontWeight: 800 }}>
            {t.whereTitle}
          </h2>
        </div>

        {/* Difficulty Selector */}
        {!whereFinished && renderDifficultySelector()}

        {whereFinished ? (
          <div style={{ textAlign: "center", padding: "30px 10px", background: "var(--color-teal-light)", borderRadius: 24, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div style={{ fontSize: 60, marginBottom: 12, animation: "matchPulse 1s infinite" }}>🏠</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: "var(--color-teal)", marginBottom: 6 }}>
              {t.completed}
            </h3>
            <p style={{ fontSize: 14, color: "var(--color-text-muted)", marginBottom: 20, lineHeight: 1.5, padding: "0 10px" }}>
              {tr.scoreMsg.replace("{correct}", whereScore).replace("{total}", whereRounds.length)}
            </p>

            <div style={{
              background: "white",
              padding: "12px 20px",
              borderRadius: 18,
              boxShadow: "var(--shadow-md)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 24,
              border: "1px solid var(--color-teal-soft)"
            }}>
              <Award size={24} color="var(--color-gold)" />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 10, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>{t.score}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--color-teal)" }}>
                  {Math.round(40 + (whereScore / whereRounds.length) * 60)} pts
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, width: "100%" }}>
              <button
                onClick={() => selectGame("where")}
                style={{
                  flex: 1,
                  padding: "14px",
                  borderRadius: 16,
                  border: "2px solid var(--color-teal-soft)",
                  background: "white",
                  color: "var(--color-teal)",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                {t.playAgain}
              </button>
              <button
                onClick={() => { playTapSound(); setActiveGame(null); }}
                style={{
                  flex: 1,
                  padding: "14px",
                  borderRadius: 16,
                  border: "none",
                  background: "var(--color-teal)",
                  color: "white",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "var(--shadow-sm)"
                }}
              >
                {t.saveFinish}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Progress and timer */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, color: "var(--color-text-muted)", marginBottom: 16 }}>
              <span>{t.round} {whereIndex + 1} {t.of} {whereRounds.length}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Timer size={14} color="var(--color-terracotta)" />
                {whereTimer}s
              </span>
            </div>

            {/* Display card */}
            <div style={{
              background: "white",
              borderRadius: 24,
              border: "1px solid var(--color-teal-soft)",
              boxShadow: "var(--shadow-md)",
              padding: "24px 16px",
              textAlign: "center",
              marginBottom: 16,
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}>
              <div style={{
                width: 110,
                height: 110,
                borderRadius: 24,
                background: "var(--color-teal-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 60,
                marginBottom: 20,
                border: "2px solid var(--color-teal-soft)",
                boxShadow: "var(--shadow-sm)"
              }}>
                {currentRound?.emoji}
              </div>

              <div style={{ fontSize: 17, color: "var(--color-text-dark)", fontWeight: 800, marginBottom: 16, lineHeight: 1.4 }}>
                {questionText}
              </div>

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 10 }}>
                {displayOptions.map((opt, idx) => {
                  const isSelected = whereSelected === opt.key;
                  const isCorrect = opt.key === currentRound?.correct;
                  
                  let btnStyle = {};
                  if (whereSelected !== null) {
                    if (isCorrect) {
                      btnStyle = {
                        backgroundColor: "var(--color-success-light)",
                        borderColor: "var(--color-success)",
                        color: "var(--color-success)"
                      };
                    } else if (isSelected) {
                      btnStyle = {
                        backgroundColor: "var(--color-danger-light)",
                        borderColor: "var(--color-danger)",
                        color: "var(--color-danger)"
                      };
                    } else {
                      btnStyle = { opacity: 0.5 };
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={whereSelected !== null}
                      onClick={() => handleWhereAnswer(opt.key)}
                      className="family-option-btn"
                      style={{ ...btnStyle, margin: 0 }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", gap: 8 }}>
                        {whereSelected !== null && isCorrect && <Check size={16} />}
                        {whereSelected !== null && isSelected && !isCorrect && <X size={16} />}
                        {opt.label}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanatory feedback */}
              {whereSelected !== null && (
                <div style={{ 
                  marginTop: 18, 
                  padding: 12, 
                  background: "var(--color-teal-light)", 
                  borderRadius: 16, 
                  fontSize: 13, 
                  color: "var(--color-teal-medium)", 
                  fontWeight: 600,
                  lineHeight: 1.5,
                  width: "100%"
                }}>
                  💡 {translateWord(currentRound?.explain, language)}
                </div>
              )}
            </div>

            {/* Bottom button */}
            {whereSelected !== null && (
              <button
                onClick={nextWhereRound}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  width: "100%",
                  padding: "16px",
                  borderRadius: 18,
                  border: "none",
                  background: "var(--color-teal)",
                  color: "white",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "var(--shadow-sm)",
                  marginTop: "auto"
                }}
              >
                <span>{tr.next}</span>
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // --- RENDER SOUND MEMORY GAME ---
  if (activeGame === "sound") {
    const tr = soundTranslations[resolvedLang] || soundTranslations["en"];
    const currentRound = soundRounds[soundIndex];

    const getSoundOptionsForRound = (round) => {
      if (!round || !round.indices) return [];
      return round.indices.map(idx => {
        const soundItem = SOUNDS_POOL[idx];
        const localizedLabel = translateWord(soundItem.name, language);
        return {
          key: soundItem.id,
          label: localizedLabel,
          emoji: soundItem.emoji
        };
      });
    };

    const displayOptions = getSoundOptionsForRound(currentRound);

    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <button
            onClick={() => { playTapSound(); setActiveGame(null); }}
            aria-label="Go back"
            style={{
              border: "none",
              background: "var(--color-teal-light)",
              borderRadius: 14,
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--color-teal)"
            }}
          >
            <ArrowLeft size={22} />
          </button>
          <h2 style={{ fontSize: 21, color: "var(--color-text-dark)", fontWeight: 800 }}>
            {t.soundTitle}
          </h2>
        </div>

        {/* Difficulty Selector */}
        {!soundFinished && renderDifficultySelector()}

        {soundFinished ? (
          <div style={{ textAlign: "center", padding: "30px 10px", background: "var(--color-teal-light)", borderRadius: 24, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div style={{ fontSize: 60, marginBottom: 12, animation: "matchPulse 1s infinite" }}>🎵</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: "var(--color-teal)", marginBottom: 6 }}>
              {t.completed}
            </h3>
            <p style={{ fontSize: 14, color: "var(--color-text-muted)", marginBottom: 20, lineHeight: 1.5, padding: "0 10px" }}>
              {tr.scoreMsg.replace("{correct}", soundScore).replace("{total}", soundRounds.length)}
            </p>

            <div style={{
              background: "white",
              padding: "12px 20px",
              borderRadius: 18,
              boxShadow: "var(--shadow-md)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 24,
              border: "1px solid var(--color-teal-soft)"
            }}>
              <Award size={24} color="var(--color-gold)" />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 10, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>{t.score}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--color-teal)" }}>
                  {Math.round(40 + (soundScore / soundRounds.length) * 60)} pts
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, width: "100%" }}>
              <button
                onClick={() => selectGame("sound")}
                style={{
                  flex: 1,
                  padding: "14px",
                  borderRadius: 16,
                  border: "2px solid var(--color-teal-soft)",
                  background: "white",
                  color: "var(--color-teal)",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                {t.playAgain}
              </button>
              <button
                onClick={() => { playTapSound(); setActiveGame(null); }}
                style={{
                  flex: 1,
                  padding: "14px",
                  borderRadius: 16,
                  border: "none",
                  background: "var(--color-teal)",
                  color: "white",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "var(--shadow-sm)"
                }}
              >
                {t.saveFinish}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Progress and timer */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, color: "var(--color-text-muted)", marginBottom: 16 }}>
              <span>{t.round} {soundIndex + 1} {t.of} {soundRounds.length}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Timer size={14} color="var(--color-terracotta)" />
                {soundTimer}s
              </span>
            </div>

            {/* Display card */}
            <div style={{
              background: "white",
              borderRadius: 24,
              border: "1px solid var(--color-teal-soft)",
              boxShadow: "var(--shadow-md)",
              padding: "24px 16px",
              textAlign: "center",
              marginBottom: 16,
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}>
              {/* Play Audio Button */}
              <button
                onClick={() => triggerPlaySound(currentRound)}
                disabled={isPlayingSound}
                className={isPlayingSound ? "pulse-listening" : ""}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  border: "none",
                  background: isPlayingSound ? "var(--color-terracotta)" : "var(--color-teal)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "var(--shadow-md)",
                  transition: "all 0.3s ease",
                  marginBottom: 14
                }}
              >
                {isPlayingSound ? (
                  <Volume2 size={36} className="spin-animation" style={{ animationDuration: "3s" }} />
                ) : (
                  <Play size={36} style={{ marginLeft: 6 }} />
                )}
              </button>

              <div style={{ fontSize: 15, color: isPlayingSound ? "var(--color-terracotta)" : "var(--color-text-muted)", fontWeight: 700, marginBottom: 20 }}>
                {isPlayingSound ? tr.playing : tr.listenBtn}
              </div>

              <div style={{ fontSize: 16, color: "var(--color-text-dark)", fontWeight: 800, marginBottom: 16 }}>
                {tr.question}
              </div>

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 10 }}>
                {displayOptions.map((opt, idx) => {
                  const isSelected = soundSelected === opt.key;
                  const isCorrect = opt.key === currentRound?.id;
                  
                  let btnStyle = {};
                  if (soundSelected !== null) {
                    if (isCorrect) {
                      btnStyle = {
                        backgroundColor: "var(--color-success-light)",
                        borderColor: "var(--color-success)",
                        color: "var(--color-success)"
                      };
                    } else if (isSelected) {
                      btnStyle = {
                        backgroundColor: "var(--color-danger-light)",
                        borderColor: "var(--color-danger)",
                        color: "var(--color-danger)"
                      };
                    } else {
                      btnStyle = { opacity: 0.5 };
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={soundSelected !== null}
                      onClick={() => handleSoundAnswer(opt.key)}
                      className="family-option-btn"
                      style={{ ...btnStyle, margin: 0 }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        {soundSelected !== null && isCorrect && <Check size={16} />}
                        {soundSelected !== null && isSelected && !isCorrect && <X size={16} />}
                        <span>{opt.emoji}</span>
                        <span>{opt.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom navigation */}
            {soundSelected !== null && (
              <button
                onClick={nextSoundRound}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  width: "100%",
                  padding: "16px",
                  borderRadius: 18,
                  border: "none",
                  background: "var(--color-teal)",
                  color: "white",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "var(--shadow-sm)",
                  marginTop: "auto"
                }}
              >
                <span>{tr.next}</span>
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
}
