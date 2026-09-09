import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Mic, Square, Play, Pause } from "lucide-react";
import { playTapSound, playMatchSound } from "../utils/audio";

const MEM_TRANS = {
  en: {
    title: "My Memories",
    intro: "Record a memory in your own voice — your family can listen anytime.",
    recText: "Tap to record a memory",
    recSub: "A festival, a person, a place you love",
    recActive: "Recording…",
    stopText: "Tap again to stop and save",
    savedMem: "SAVED MEMORIES",
    bihu: "The Bihu festival, 1978",
    grandfather: "How I met your grandfather",
    today: "A memory from today",
    saveMsg: "Saved. Your family can listen to this whenever they like."
  },
  hi: {
    title: "मेरी यादें",
    intro: "अपनी आवाज में एक याद रिकॉर्ड करें — आपका परिवार इसे कभी भी सुन सकता है।",
    recText: "एक याद रिकॉर्ड करने के लिए टैप करें",
    recSub: "एक त्योहार, एक व्यक्ति, एक जगह जिसे आप प्यार करते हैं",
    recActive: "रिकॉर्डिंग चालू है…",
    stopText: "रोकने और सहेजने के लिए फिर से टैप करें",
    savedMem: "सहेजी गई यादें",
    bihu: "बिहू उत्सव, 1978",
    grandfather: "मैं आपके दादाजी से कैसे मिली",
    today: "आज की एक याद",
    saveMsg: "सहेजा गया। आपका परिवार जब चाहे इसे सुन सकता है।"
  },
  as: {
    title: "মোৰ স্মৃতিসমূহ",
    intro: "আপোনাৰ নিজৰ কণ্ঠৰে এটা স্মৃতি ৰেকৰ্ড কৰক — আপোনাৰ পৰিয়ালে যিকোনো সময়তে শুনিব পাৰিব।",
    recText: "স্মৃতি ৰেকৰ্ড কৰিবলৈ টেপ কৰক",
    recSub: "একটা উৎসৱ, এজন ব্যক্তি, আপুনি ভালপোৱা এটুকুৰা ঠাই",
    recActive: "ৰেকৰ্ডিং হৈ আছে…",
    stopText: "বন্ধ কৰিবলৈ আৰু সংৰক্ষণ কৰিবলৈ আকৌ টেপ কৰক",
    savedMem: "সংৰক্ষিত স্মৃতিসমূহ",
    bihu: "বিহু উৎসৱ, ১৯৭৮",
    grandfather: "মই আপোনাৰ ককাদেউতাক কেনেকৈ লগ পালোঁ",
    today: "আজিৰ এটা স্মৃতি",
    saveMsg: "সংৰক্ষণ কৰা হ’ল। আপোনাৰ পৰিয়ালে ইয়াক যিকোনো সময়তে শুনিব পাৰিব।"
  },
  bn: {
    title: "আমার স্মৃতি",
    intro: "আপনার নিজের কণ্ঠে একটি স্মৃতি রেকর্ড করুন — আপনার পরিবার যেকোনো সময় শুনতে পারবে।",
    recText: "একটি স্মৃতি রেকর্ড করতে ট্যাপ করুন",
    recSub: "একটি উৎসব, একজন ব্যক্তি, আপনার প্রিয় একটি জায়গা",
    recActive: "রেকর্ডিং হচ্ছে…",
    stopText: "বন্ধ করতে এবং সংরক্ষণ করতে আবার ট্যাপ করুন",
    savedMem: "সংরক্ষিত স্মৃতি",
    bihu: "বিহু উৎসব, ১৯৭৮",
    grandfather: "আমি কীভাবে আপনার দাদুর সাথে দেখা করেছিলাম",
    today: "আজকের একটি স্মৃতি",
    saveMsg: "সংরক্ষিত হয়েছে। আপনার পরিবার যখন খুশি এটি শুনতে পাবে।"
  },
  br: {
    title: "आंनि गोसोखांफोर",
    intro: "नोंथांनि गावबागावनि रावाव गोसोखांथायफोरखौ रेकर्ड खालाम — नोंथांनि नखराबो जेब्लाबो खोनासंनो हागोन।",
    recText: "गोसोखांथाय रेकर्ड खालामनो थु",
    recSub: "एसेबां रंजानाय, सासे सुबुं, नोंथांनि मोजां मोननाय जायगा",
    recActive: "रेकर्ड जागासिनो…",
    stopText: "बन्द खालामनो आरो दोनथुंनो फिन थु",
    savedMem: "दोनथुमनाय गोसोखांफोर",
    bihu: "बिहु रंजानाय, १९७८",
    grandfather: "आं नोंथांनि आबुंखौ माबोरै लोगो मोनदोंमोन",
    today: "दिनैनि सासे गोसोखांथाय",
    saveMsg: "दोनथुमबाय। नोंथांनि नखराबो जेब्लाबो खोनासंनो हागोन।"
  },
  doi: {
    title: "मेरी यादां",
    intro: "अपनी अवाज़ च इक याद रिकार्ड करो — तुंदा टब्बर इयै कदें वी सुणी सकदा ऐ।",
    recText: "इक याद रिकार्ड करन लई टैप करो",
    recSub: "इक त्यौहार, इक बंदा, इक थाहर जेसगी तुस प्यार करदे ओ",
    recActive: "रिकार्डिंग चालू ऐ…",
    stopText: "रोकन ते बचाने लई दोबारा टैप करो",
    savedMem: "बचायो दी यादां",
    bihu: "बिहू त्यौहार, १९७८",
    grandfather: "मैं तुंदे दादे गी कियां मिली ही",
    today: "अज्ज दी इक याद",
    saveMsg: "बचायो गेया। तुंदा टब्बर इयै कदें वी सुणी सकदा ऐ।"
  },
  gu: {
    title: "મારી યાદો",
    intro: "તમારા પોતાના અવાજમાં એક યાદ રેકોર્ડ કરો — તમારો પરિવાર તેને ગમે ત્યારે સાંભળી શકે છે.",
    recText: "યાદ રેકોર્ડ કરવા માટે ટેప్ કરો",
    recSub: "એક તહેવાર, એક વ્યક્તિ, એક જગ્યા જે તમને ગમે છે",
    recActive: "રેકોર્ડિંગ ચાલુ છે…",
    stopText: "રોકવા અને સાચવવા માટે ફરીથી ટેપ કરો",
    savedMem: "સાચવેલી યાદો",
    bihu: "બીહુ તહેવાર, ૧૯૭૮",
    grandfather: "હું તમારા દાદાને કેવી રીતે મળી",
    today: "આજની એક યાદ",
    saveMsg: "સાચવવામાં આવ્યું. તમારો પરિવાર જ્યારે ઈચ્છે ત્યારે આ સાંભળી શકે છે."
  },
  kn: {
    title: "ನನ್ನ ನೆನಪುಗಳು",
    intro: "ನಿಮ್ಮ ಸ್ವಂತ ಧ್ವನಿಯಲ್ಲಿ ನೆನಪನ್ನು ರೆಕಾರ್ಡ್ ಮಾಡಿ — ನಿಮ್ಮ ಕುಟುಂಬ ಯಾವಾಗ ಬೇಕಾದರೂ ಕೇಳಬಹುದು.",
    recText: "ನೆನಪನ್ನು ರೆకಾರ್ಡ್ ಮಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ",
    recSub: "ಒಂದು ಹಬ್ಬ, ಒಬ್ಬ ವ್ಯಕ್ತಿ, ನೀವು ಇಷ್ಟಪಡುವ ಸ್ಥಳ",
    recActive: "ರೆಕಾರ್ಡಿಂಗ್ ಆಗುತ್ತಿದೆ…",
    stopText: "ನಿಲ್ಲಿಸಲು ಮತ್ತು ಉಳಿಸಲು ಮತ್ತೊಮ್ಮೆ ಟ್ಯಾಪ್ ಮಾಡಿ",
    savedMem: "ಉಳಿಸಿದ ನೆನಪುಗಳು",
    bihu: "ಬಿಹು ಹಬ್ಬ, 1978",
    grandfather: "ನಾನು ನಿಮ್ಮ ತಾತನನ್ನು ಹೇಗೆ ಭేಟಿಯಾದೆ",
    today: "ಇಂದಿನ ಒಂದು ನೆನಪು",
    saveMsg: "ಉಳಿಸಲಾಗಿದೆ. ನಿಮ್ಮ ಕುಟುಂಬದವರು ಯಾವಾಗ ಬೇಕಾದರೂ ಇದನ್ನು ಕೇಳಬಹುದು."
  },
  ks: {
    title: "म्यॉनी याद",
    intro: "पनिनी अवाज़ मन्ज़ अख याद रिकार्ड करिव — तुह्यांद खानदान हेकिये येह कतिये वी बोज़िथ।",
    recText: "अख याद रिकार्ड करने खातिर टैप करिव",
    recSub: "अख त्यौहार, अख शख्स, अख जाय यथ तुस्य प्यार छुव करान",
    recActive: "रिकार्डिंग चालू छु…",
    stopText: "बंद करने ते सहेजने खातिर दोबारा टैप करिव",
    savedMem: "महफूज़ याद",
    bihu: "बिहू त्यौहार, १९७८",
    grandfather: "बॅ क्यथ पाॅठ्य मिली तुह्यांद्य दादस्य",
    today: "अज़ुक अख याद",
    saveMsg: "महफूज़ करन आव। तुह्यांद खानदान हेकिये येह कतिये वी बोज़िथ।"
  },
  kok: {
    title: "म्यो यादवळी",
    intro: "तुमच्या स्वताच्या आवाजांत एक याद रेकॉर्ड करात — तुमचें कुटुंब तें केन्नाय आयकूंक शकता.",
    recText: "एक याद रेकॉर्ड करपाक टॅप करात",
    recSub: "एक उत्सव, एक मनीस, तुमकां आवडपी सुवात",
    recActive: "रेकॉर्डिंग चालू आसा…",
    stopText: "बंद करपाक आनी सांबाळपाक परत टॅप करात",
    savedMem: "सांबाळिल्ल्यो यादो",
    bihu: "बिहू उत्सव, १९७८",
    grandfather: "हांव तुमच्या आजाक कशी मेळ्ळी",
    today: "आजची एक याद",
    saveMsg: "सांबाळ्ळें. तुमचें कुटुंब तें केन्नाय आयकूंक शकता."
  },
  mai: {
    title: "हमर संस्मरण",
    intro: "अपन आवाजमे एकटा याद रिकार्ड करू — अपन परिवार एकरा कहियो सुनि सकैत अछि।",
    recText: "एकटा याद रिकार्ड करबाक लेल टैप करू",
    recSub: "एकटा पाबनि, एकटा लोक, एकटा जगह जेकरा सँ अहाँ स्नेह करैत छी",
    recActive: "रिकार्डिंग चालू अछि…",
    stopText: "रोकबाक आ सहेजबाक लेल दोबारा टैप करू",
    savedMem: "सहेजल गेल याद",
    bihu: "बिहू उत्सव, १९७८",
    grandfather: "हम अहाँक बाबा सँ कना मिललहुँ",
    today: "आजुक एकटा याद",
    saveMsg: "सहेजल गेल। अहाँक परिवार जखन चाहत सुनि सकैत अछि।"
  },
  ml: {
    title: "എന്റെ ഓർമ്മകൾ",
    intro: "നിങ്ങളുടെ സ്വന്തം ശബ്ദത്തിൽ ഒരു ഓർമ്മ റെക്കോർഡ് ചെയ്യുക — നിങ്ങളുടെ കുടുംബത്തിന് എപ്പോൾ വേണമെങ്കിലും ഇത് കേൾക്കാം.",
    recText: "ഒരു ഓർമ്മ റെക്കോർഡ് ചെയ്യാൻ ടാപ്പ് ചെയ്യുക",
    recSub: "ഒരു ഉത്സവം, ഒരു വ്യക്തി, നിങ്ങൾ ഇഷ്ടപ്പെടുന്ന ഒരു സ്ഥലം",
    recActive: "റെക്കോർഡിംഗ് നടക്കുന്നു…",
    stopText: "നിർത്താനും സംരക്ഷിക്കാനും വീണ്ടും ടാപ്പ് ചെയ്യുക",
    savedMem: "സംരക്ഷിച്ച ഓർമ്മകൾ",
    bihu: "ബിഹു ഉത്സവം, 1978",
    grandfather: "ഞാൻ നിങ്ങളുടെ മുത്തശ്ശനെ എങ്ങനെ കണ്ടുമുട്ടി",
    today: "ഇന്നത്തെ ഒരു ഓർമ്മ",
    saveMsg: "സംരക്ഷിച്ചു. നിങ്ങളുടെ കുടുംബത്തിന് എപ്പോൾ വേണമെങ്കിലും ഇത് കേൾക്കാം."
  },
  mni: {
    title: "ঐগী নীংশিংখোল",
    intro: "নশাগী খোঞ্জেলদা নীংশিংবা অমা রেকোর্দ তৌ — নমুংনা অসি থা ওইনা তাবদি য়াই।",
    recText: "নীংশিংবা রেকোর্দ তৌনবা নমউ",
    recSub: "কুম্হৈ অমা, মী অমা, ননা নুংশিবা মফম অমা",
    recActive: "রেকোর্দ তৌরি…",
    stopText: "লেপনবা অমসুং থা ওইনবা অমুক নমউ",
    savedMem: "রেকোর্দ تৌখ্রবা নীংশিংখোল",
    bihu: "বিহু কুম্হৈ, ১৯৭৮",
    grandfather: "ঐনা নপু থৌদোনগা করম্না উনখিবগে",
    today: "ঙসিগী নীংশিংবা অমা",
    saveMsg: "রেকোর্দ তৌখ্রে। নমুংনা পাম্বা মতমদা তাবদি য়াই।"
  },
  mr: {
    title: "माझ्या आठवणी",
    intro: "तुमच्या स्वतःच्या आवाजात एक आठवण रेकॉर्ड करा — तुमचे कुटुंब ती कधीही ऐकू शकते.",
    recText: "एक आठवण रेकॉर्ड करण्यासाठी टॅप करा",
    recSub: "एक सण, एक व्यक्ती, तुमचे आवडते ठिकाण",
    recActive: "रेकॉर्डिंग सुरू आहे…",
    stopText: "थांबवण्यासाठी आणि जतन करण्यासाठी पुन्हा टॅप करा",
    savedMem: "जतन केलेल्या आठवणी",
    bihu: "बिहू सण, १९७८",
    grandfather: "मी तुमच्या आजोबांना कशी भेटले",
    today: "आजची एक आठवण",
    saveMsg: "जतन केले. तुमचे कुटुंब हे कधीही ऐकू शकते."
  },
  ne: {
    title: "मेरो संस्मरण",
    intro: "आफ्नो आवाजमा एउटा सम्झना रेकर्ड गर्नुहोस् — तपाईंको परिवारले जुनसुकै बेला सुन्न सक्छ।",
    recText: "सम्झना रेकर्ड गर्न ट्याप गर्नुहोस्",
    recSub: "एउटा चाडपर्व, एउटा व्यक्ति, तपाईंलाई मनपर्ने ठाउँ",
    recActive: "रेकर्डिङ हुँदैछ…",
    stopText: "रोक्न र सुरक्षित गर्न फेरि ट्याप गर्नुहोस्",
    savedMem: "सुरक्षित गरिएका सम्झनाहरू",
    bihu: "बिहू चाड, १९७८",
    grandfather: "मैले तपाईंको हजुरबुबालाई कसरी भेटें",
    today: "आजको एउटा सम्झना",
    saveMsg: "सुरक्षित गरियो। तपाईंको परिवारले जुनसुकै बेला सुन्न सक्छ।"
  },
  or: {
    title: "ମୋର ସ୍ମୃତି",
    intro: "ନିଜ ସ୍ୱରରେ ଏକ ସ୍ମୃତି ରେକର୍ଡ କରନ୍ତୁ — ଆପଣଙ୍କ ପରିବାର ଯେକୌଣସି ସମୟରେ ଶୁଣିପାରିବେ ।",
    recText: "ଏକ ସ୍ମୃତି ରେକର୍ଡ କରିବା ପାଇଁ ଟ୍ୟାପ୍ କରନ୍ତୁ",
    recSub: "ଏକ ପର୍ବପର୍ବାଣୀ, ଏକ ବ୍ୟକ୍ତି, ଆପଣ ଭଲ ପାଉଥିବା ସ୍ଥାନ",
    recActive: "ରେକର୍ଡିଂ ଚାଲିଛି…",
    stopText: "ବନ୍ଦ କରିବା ଏବଂ ସଂରକ୍ଷଣ କରିବା ପାଇଁ ପୁଣି ଟ୍ୟାପ୍ କରନ୍ତୁ",
    savedMem: "ସଂରକ୍ଷିତ ସ୍ମୃତିସମୂହ",
    bihu: "ବିହୁ ପର୍ବ, ୧୯୭୮",
    grandfather: "ମୁଁ ତୁମର ଜେଜେବାପାଙ୍କୁ କେମିତି ଭେଟିଥିଲି",
    today: "ଆଜିର ଏକ ସ୍ମୃତି",
    saveMsg: "ସଂରକ୍ଷିତ ହେଲା । ଆପଣଙ୍କ ପରିବାର ଯେତେବେଳେ ଚାହିଁବେ ଶୁଣିପାରିବେ ।"
  },
  pa: {
    title: "ਮੇਰੀਆਂ ਯਾਦਾਂ",
    intro: "ਆਪਣੀ ਆਵਾਜ਼ ਵਿੱਚ ਇੱਕ ਯਾਦ ਰਿਕਾਰਡ ਕਰੋ — ਤੁਹਾਡਾ ਪਰਿਵਾਰ ਇਸਨੂੰ ਕਿਸੇ ਵੀ ਸਮੇਂ ਸੁਣ ਸਕਦਾ ਹੈ।",
    recText: "ਯਾਦ ਰਿਕਾਰਡ ਕਰਨ ਲਈ ਟੈਪ ਕਰੋ",
    recSub: "ਇੱਕ ਤਿਉਹਾਰ, ਇੱਕ ਵਿਅਕਤੀ, ਇੱਕ ਥਾਂ ਜਿਸਨੂੰ ਤੁਸੀਂ ਪਿਆਰ ਕਰਦੇ ਹੋ",
    recActive: "ਰਿਕਾਰਡਿੰਗ ਚੱਲ ਰਹੀ ਹੈ…",
    stopText: "ਰੋਕਣ ਅਤੇ ਸੰਭਾਲਣ ਲਈ ਦੁਬਾਰਾ ਟੈਪ ਕਰੋ",
    savedMem: "ਸੰਭਾਲੀਆਂ ਹੋਈਆਂ ਯਾਦਾਂ",
    bihu: "ਬੀਹੂ ਤਿਉਹਾਰ, 1978",
    grandfather: "ਮੈਂ ਤੁਹਾਡੇ ਦਾਦਾ ਜੀ ਨੂੰ ਕਿਵੇਂ ਮਿਲੀ",
    today: "ਅੱਜ ਦੀ ਇੱਕ ਯਾਦ",
    saveMsg: "ਸੰਭਾਲੀ ਗਈ। ਤੁਹਾਡਾ ਪਰਿਵਾਰ ਜਦੋਂ ਚਾਹੇ ਇਸਨੂੰ ਸੁਣ ਸਕਦਾ ਹੈ।"
  },
  sa: {
    title: "मम स्मृतयः",
    intro: "स्वकीये स्वरे स्मृतिं मुद्रयन्तु — भवतः परिवारः यदा कदापि श्रोतुं शक्नोति।",
    recText: "स्मृतिं मुद्रयितुं स्पृशन्तु",
    recSub: "उत्सवः, जनः, भवतः प्रियं स्थानं वा",
    recActive: "मुद्रणं प्रचलति…",
    stopText: "रोधयितुं रक्षितुं च पुनः स्पृशन्तु",
    savedMem: "रक्षिताः स्मृतयः",
    bihu: "बिहू पर्व, १९७८",
    grandfather: "अहं भवतः पितामहं कथं मिलितवती",
    today: "अद्यतनी एका स्मृतिः",
    saveMsg: "रक्षितम्। भवतः परिवारः यदा कदापि श्रोतुं शक्नोति।"
  },
  sat: {
    title: "इञाः दिशौको",
    intro: "अपन आড়াं तेने दिशौ रेकर्ड मे — आमा घरोज के जेब्लाबो खोनासंनो दाड़े।",
    recText: "दिशौ रेकर्ड लागीत् ओता मे",
    recSub: "मीत रस्का पर्व, मीत होड़, आम मोजां जायगा",
    recActive: "रेकर्ड जागाना…",
    stopText: "बन्द लागीत् आर साबाव लागीत् आर ओता मे",
    savedMem: "साबाव दिशौको",
    bihu: "बिहू परब, १९७८",
    grandfather: "इञ आमा हाड़ाम बाबा साओ चेलेका ओपेन लेना",
    today: "तेहेञাঃ मीत दिशौ",
    saveMsg: "साबाव ना। आमा घरोज के जेब्लाबो खोनासंनो दाड़े।"
  },
  sd: {
    title: "منهنجيون يادگيريون",
    intro: "پنهنجي آواز ۾ يادگيري رڪارڊ ڪريو — توهان جو خاندان ڪڏهن به ٻڌي سگهي ٿو.",
    recText: "يادگيري رڪارڊ ڪرڻ لاءِ ٽيپ ڪريو",
    recSub: "هڪ عيد، هڪ ماڻهو، يا جڳهه جيڪا توهان کي پسند هجي",
    recActive: "رڪارڊنگ جاري آهي...",
    stopText: "روڪڻ ۽ محفوظ ڪرڻ لاءِ ٻيهر ٽيپ ڪريو",
    savedMem: "محفوظ ٿيل يادگيريون",
    bihu: "بيهو ميلو، ۱۹७८",
    grandfather: "مان توهان جي ڏاڏي سان ڪيئن مليس",
    today: "اڄ جي هڪ ياد",
    saveMsg: "محفوظ ڪئي وئي. توهان جو خاندان جڏهن چاهي ٻڌي سگهي ٿو."
  },
  ta: {
    title: "என் நினைவுகள்",
    intro: "உங்கள் சொந்த குரலில் ஒரு நினைவை பதிவு செய்யுங்கள் — உங்கள் குடும்பத்தினர் எப்போது வேண்டுமானாலும் கேட்கலாம்.",
    recText: "நினைவை பதிவு செய்ய தட்டவும்",
    recSub: "ஒரு திருவிழா, ஒரு நபர், நீங்கள் விரும்பும் ஒரு இடம்",
    recActive: "பதிவு செய்யப்படுகிறது…",
    stopText: "நிறுத்த மற்றும் சேமிக்க மீண்டும் தட்டவும்",
    savedMem: "சேமிக்கப்பட்ட நினைவுகள்",
    bihu: "பிஹு பண்டிகை, 1978",
    grandfather: "உங்கள் தாத்தாவை நான் எப்படி சந்தித்தேன்",
    today: "இன்றைய ஒரு நினைவு",
    saveMsg: "சேமிக்கப்பட்டது. உங்கள் குடும்பத்தினர் எப்போது வேண்டுமானாலும் இதைக் கேட்கலாம்."
  },
  te: {
    title: "నా జ్ఞాపకాలు",
    intro: "మీ స్వంత గొంతుతో ఒక జ్ఞాపకాన్ని రికార్డ్ చేయండి — మీ కుటుంబం ఎప్పుడైనా వినవచ్చు.",
    recText: "జ్ఞాపకాన్ని రికార్డ్ చేయడానికి నొక్కండి",
    recSub: "ఒక పండుగ, ఒక వ్యక్తి, మీకు నచ్చిన స్థలం",
    recActive: "రికార్డింగ్ అవుతోంది…",
    stopText: "ఆపడానికి మరియు సేవ్ చేయడానికి మళ్లీ నొక్కండి",
    savedMem: "సేవ్ చేసిన జ్ఞాపకాలు",
    bihu: "బిహు పండుగ, 1978",
    grandfather: "నేను మీ తాతయ్యను ఎలా కలుసుకున్నాను",
    today: "నేటి జ్ఞాపకం",
    saveMsg: "సేవ్ చేయబడింది. మీ కుటుంబ సభ్యులు ఎప్పుడైనా వినవచ్చు."
  },
  ur: {
    title: "मेरी यादें",
    intro: "अपनी आवाज में एक याद रिकॉर्ड करें — आप का परिवार इसे कभी भी सुन सकता है।",
    recText: "ایک याद रिकॉर्ड करने के लिए टीप करें",
    recSub: "ایک تہوار، ایک شخص، یا جگہ جسے آپ پسند کرتے ہیں",
    recActive: "ریکارڈنگ ہو رہی ہے…",
    stopText: "روکنے اور محفوظ کرنے کے لیے دوبارہ ٹیپ کریں",
    savedMem: "محفوظ کردہ یادیں",
    bihu: "بیہو تہوار، ۱۹৭८",
    grandfather: "میں آپ کے دادا سے کیسے ملی",
    today: "آج की एक याद",
    saveMsg: "محفوظ کر لی گئی۔ آپ کا خاندان جب چاہے سن سکتا ہے۔"
  }
};

export default function MemoriesScreen({ back, speak, language }) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [playingItem, setPlayingItem] = useState(null);
  const audioRef = useRef(null);

  const t = MEM_TRANS[language] || MEM_TRANS["en"];

  const [recordedMemories, setRecordedMemories] = useState([]);

  const defaultMemories = [
    { titleKey: "bihu", duration: "1:24" },
    { titleKey: "grandfather", duration: "2:10" },
  ];

  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [recording]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  async function startRecording() {
    playTapSound();
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);

        stream.getTracks().forEach((track) => track.stop());

        setRecordedMemories((m) => [
          {
            titleKey: "today",
            audioUrl: audioUrl,
            duration: `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
          },
          ...m
        ]);
        speak(MEM_TRANS["en"].saveMsg, t.saveMsg);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Microphone access failed. Falling back to simulation.", err);
      // Fallback: simulate recording
      setRecording(true);
    }
  }

  function stopRecording() {
    playMatchSound();
    setRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    } else {
      // Fallback save simulation
      if (seconds > 0) {
        setRecordedMemories((m) => [
          {
            titleKey: "today",
            duration: `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
          },
          ...m
        ]);
        speak(MEM_TRANS["en"].saveMsg, t.saveMsg);
      }
    }
    setSeconds(0);
  }

  function playMemory(m, index) {
    playTapSound();
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (playingItem === index) {
      setPlayingItem(null);
      return;
    }

    if (m.audioUrl) {
      const audio = new Audio(m.audioUrl);
      audioRef.current = audio;
      setPlayingItem(index);
      audio.onended = () => {
        setPlayingItem(null);
      };
      audio.play().catch((err) => {
        console.error("Audio playback failed:", err);
        setPlayingItem(null);
      });
    } else {
      const enTitle = MEM_TRANS["en"][m.titleKey] || m.titleKey;
      const regTitle = t[m.titleKey] || m.titleKey;
      speak(`Playing: ${enTitle}`, `Playing: ${regTitle}`);
    }
  }

  const allMemories = [
    ...recordedMemories,
    ...defaultMemories
  ];

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
          {t.title}
        </h2>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ fontSize: 13.5, color: "var(--color-text-muted)", marginBottom: 20, lineHeight: 1.5 }}>
          {t.intro}
        </div>

        <div style={{
          background: recording ? "var(--color-danger-light)" : "var(--color-teal-light)",
          borderRadius: 24,
          padding: "24px 20px",
          textAlign: "center",
          marginBottom: 24,
          border: "1px solid var(--color-teal-soft)",
          transition: "all 0.3s ease"
        }}>
          <button
            onClick={() => (recording ? stopRecording() : startRecording())}
            aria-label={recording ? "Stop recording" : "Start recording"}
            className={recording ? "pulse-listening" : ""}
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              background: recording ? "var(--color-danger)" : "var(--color-teal)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "var(--shadow-sm)"
            }}
          >
            {recording ? <Square size={26} color="white" fill="white" /> : <Mic size={30} color="white" />}
          </button>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--color-text-dark)" }}>
            {recording ? `${t.recActive} ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}` : t.recText}
          </div>
          <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 6 }}>
            {recording ? t.stopText : t.recSub}
          </div>
        </div>

        <div style={{ fontSize: 12.5, fontWeight: 800, color: "var(--color-text-muted)", marginBottom: 12, letterSpacing: "0.5px" }}>
          {t.savedMem}
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {allMemories.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 16px",
                borderRadius: 18,
                background: "white",
                border: "1px solid rgba(8, 81, 92, 0.06)",
                boxShadow: "var(--shadow-sm)"
              }}
            >
              <button
                onClick={() => playMemory(m, i)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  border: "none",
                  background: playingItem === i ? "var(--color-teal-light)" : "var(--color-terracotta-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  cursor: "pointer"
                }}
              >
                {playingItem === i ? (
                  <Pause size={16} color="var(--color-teal)" fill="var(--color-teal)" />
                ) : (
                  <Play size={16} color="var(--color-terracotta)" fill="var(--color-terracotta)" />
                )}
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-dark)" }}>
                  {t[m.titleKey] || m.titleKey}
                </div>
                <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                  {m.duration}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
