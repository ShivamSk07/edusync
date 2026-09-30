// EdSync Multilingual Indian Localization System
// Lightweight React hook with zero external dependencies & IndexedDB / localStorage persistence.

import { useCallback, useEffect, useState } from "react";

export type SupportedLanguage =
  | "en" // English
  | "hi" // Hindi (हिन्दी)
  | "mr" // Marathi (मराठी)
  | "bn" // Bengali (বাংলা)
  | "ta" // Tamil (தமிழ்)
  | "te" // Telugu (తెలుగు)
  | "gu" // Gujarati (ગુજરાતી)
  | "kn" // Kannada (ಕನ್ನಡ)
  | "ml" // Malayalam (മലയാളം)
  | "pa" // Punjabi (ਪੰਜਾਬੀ)
  | "or"; // Odia (ଓଡ଼ିଆ)

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  speechCode: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", speechCode: "en-IN" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", speechCode: "hi-IN" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", speechCode: "mr-IN" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", speechCode: "bn-IN" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", speechCode: "ta-IN" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", speechCode: "te-IN" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", speechCode: "gu-IN" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", speechCode: "kn-IN" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", speechCode: "ml-IN" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", speechCode: "pa-IN" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", speechCode: "or-IN" },
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Nav
    "nav.dashboard": "Academic Dashboard",
    "nav.study": "Curriculum & Syllabus",
    "nav.ai": "Academic AI Tutor",
    "nav.resources": "Offline Resource Vault",
    "nav.opportunities": "Scholarships & Exams",
    "nav.career": "Career Roadmaps",
    "nav.mentorship": "Faculty Mentorship",
    "nav.progress": "Learning Analytics",
    "nav.profile": "Student Profile & Settings",

    // Header & Shell
    "shell.portal_tag": "National Academic Portal Aligned",
    "shell.offline_ready": "Offline Database Active",
    "shell.online": "Portal Connected",
    "shell.sign_out": "Sign Out",
    "shell.back": "Back",
    "shell.lang_select": "Select Language",
    "shell.govt_accreditation": "Accredited to CBSE / ICSE / State Board Curriculum",

    // Dashboard
    "dash.official_title": "Student Academic Repository & Learning Dashboard",
    "dash.welcome": "Welcome back",
    "dash.academic_session": "Academic Session 2025-26",
    "dash.student_card": "Institutional Student Pass",
    "dash.class": "Class",
    "dash.board": "Academic Board",
    "dash.school": "Institution",
    "dash.today_target": "Daily Study Target",
    "dash.syllabus_coverage": "Curriculum Coverage",
    "dash.study_streak": "Active Learning Streak",
    "dash.total_hours": "Cumulative Study Hours",
    "dash.subject_breakdown": "Prescribed Subject Mastery Matrix",
    "dash.subject_status_verified": "Curriculum Mapped",
    "dash.add_study_time": "Log Prescribed Study Session",
    "dash.minutes": "minutes",
    "dash.chapters_completed": "chapters completed",
    "dash.quick_access": "Academic Action Desk",
    "dash.ncert_books": "NCERT Digital Textbooks",
    "dash.question_bank": "Official Question Bank",
    "dash.ai_tutor_desk": "AI Academic Assistance",
    "dash.career_guidance": "Higher Education Pathways",
    "dash.analytics_view": "Progress & Assessment",

    // AI Study Buddy
    "ai.title": "EdSync Academic AI Tutor",
    "ai.subtitle": "Interactive syllabus explanations, formula derivations & multilingual voice assistance",
    "ai.speak_query": "Voice Input (Speak in English or Hindi)",
    "ai.listen_answer": "Listen Audio",
    "ai.stop_audio": "Stop Audio",
    "ai.input_placeholder": "Enter academic concept, formula, or tap microphone...",
    "ai.ask_button": "Submit Question",
    "ai.clear_chat": "Clear Session",
    "ai.copy": "Copy Explanation",
    "ai.listening": "Listening to voice query...",
    "ai.thinking": "Processing curriculum-aligned explanation...",
    "ai.no_questions": "Select an academic subject or speak your doubt below.",

    // Language Modal
    "lang_modal.title": "Choose Your Preferred Language",
    "lang_modal.subtitle": "EdSync will customize all syllabus content, dashboard metrics, and AI audio responses to your language.",
    "lang_modal.confirm": "Continue with Selected Language",
    "lang_modal.change_anytime": "You can change this anytime from top navigation or Settings.",
  },

  hi: {
    // Nav
    "nav.dashboard": "शैक्षणिक डैशबोर्ड",
    "nav.study": "पाठ्यक्रम एवं अध्ययन",
    "nav.ai": "एआई शैक्षणिक शिक्षक",
    "nav.resources": "ऑफ़लाइन ई-पुस्तकालय",
    "nav.opportunities": "छात्रवृत्ति एवं प्रतियोगी परीक्षाएं",
    "nav.career": "करियर एवं उच्च शिक्षा",
    "nav.mentorship": "मार्गदर्शन एवं शिक्षक",
    "nav.progress": "प्रगति एवं रिपोर्ट",
    "nav.profile": "विद्यार्थी प्रोफ़ाइल व सेटिंग्स",

    // Header & Shell
    "shell.portal_tag": "राष्ट्रीय शिक्षा नीति संरेखित",
    "shell.offline_ready": "ऑफ़लाइन मोड सक्रिय",
    "shell.online": "पोर्टल कनेक्टेड",
    "shell.sign_out": "लॉग आउट",
    "shell.back": "पीछे जाएं",
    "shell.lang_select": "भाषा बदलें",
    "shell.govt_accreditation": "सीबीएसई / आईसीएसई / राज्य बोर्ड पाठ्यक्रम मान्यता प्राप्त",

    // Dashboard
    "dash.official_title": "राष्ट्रीय शैक्षणिक अध्ययन एवं प्रगति पोर्टल",
    "dash.welcome": "स्वागत है",
    "dash.academic_session": "शैक्षणिक सत्र 2025-26",
    "dash.student_card": "विद्यार्थी शैक्षणिक पहचान पत्र",
    "dash.class": "कक्षा",
    "dash.board": "शिक्षा बोर्ड",
    "dash.school": "विद्यालय / संस्थान",
    "dash.today_target": "दैनिक अध्ययन लक्ष्य",
    "dash.syllabus_coverage": "पाठ्यक्रम पूर्णता",
    "dash.study_streak": "निरंतर अध्ययन दिवस",
    "dash.total_hours": "कुल अध्ययन समय",
    "dash.subject_breakdown": "विषयवार पाठ्यक्रम प्रगति तालिका",
    "dash.subject_status_verified": "सत्यापित पाठ्यक्रम",
    "dash.add_study_time": "अध्ययन समय दर्ज करें",
    "dash.minutes": "मिनट",
    "dash.chapters_completed": "अध्याय पूर्ण",
    "dash.quick_access": "त्वरित शैक्षणिक सेवाएं",
    "dash.ncert_books": "एनसीईआरटी डिजिटल पुस्तकें",
    "dash.question_bank": "आधिकारिक प्रश्न बैंक",
    "dash.ai_tutor_desk": "एआई अध्ययन सहायता",
    "dash.career_guidance": "उच्च शिक्षा मार्गदर्शन",
    "dash.analytics_view": "प्रगति विश्लेषण",

    // AI Study Buddy
    "ai.title": "एडसिंक एआई शैक्षणिक शिक्षक",
    "ai.subtitle": "विषयवार स्पष्टीकरण, सूत्र, उदाहरण एवं द्विभाषी वॉइस उत्तर",
    "ai.speak_query": "बोलकर पूछें (हिंदी या अंग्रेजी)",
    "ai.listen_answer": "ऑडियो सुनें",
    "ai.stop_audio": "ऑडियो रोकें",
    "ai.input_placeholder": "अपना प्रश्न या सूत्र लिखें, या माइक दबाकर बोलें...",
    "ai.ask_button": "प्रश्न पूछें",
    "ai.clear_chat": "सत्र साफ़ करें",
    "ai.copy": "उत्तर कॉपी करें",
    "ai.listening": "आपकी आवाज़ सुनी जा रही है...",
    "ai.thinking": "पाठ्यक्रम अनुसार उत्तर तैयार किया जा रहा है...",
    "ai.no_questions": "नीचे दिए गए विषय का चयन करें या माइक से बोलकर पूछें।",

    // Language Modal
    "lang_modal.title": "अपनी पसंदीदा भाषा चुनें",
    "lang_modal.subtitle": "एडसिंक आपकी चुनी हुई भाषा में संपूर्ण पाठ्यक्रम, डैशबोर्ड और एआई ऑडियो सहायता प्रदान करेगा।",
    "lang_modal.confirm": "इस भाषा के साथ आगे बढ़ें",
    "lang_modal.change_anytime": "आप इसे कभी भी ऊपर दिए गए बटन या सेटिंग्स से बदल सकते हैं।",
  },

  mr: {
    "nav.dashboard": "शैक्षणिक डॅशबोर्ड",
    "nav.study": "अभ्यासक्रम व धडे",
    "nav.ai": "एआय अभ्यास मार्गदर्शक",
    "nav.resources": "ऑफलाईन ग्रंथालय",
    "nav.opportunities": "शिष्यवृत्ती व परीक्षा",
    "nav.career": "करिअर मार्गदर्शन",
    "nav.mentorship": "शिक्षक मार्गदर्शन",
    "nav.progress": "प्रगती विश्लेषण",
    "nav.profile": "विद्यार्थी प्रोफाइल व सेटिंग्ज",
    "shell.portal_tag": "महाराष्ट्र व राष्ट्रीय शिक्षण संरेखित",
    "shell.offline_ready": "ऑफलाइन मोड सुरू",
    "shell.online": "ऑनलाइन कनेक्टेड",
    "shell.sign_out": "बाहेर पडा",
    "shell.back": "मागे जा",
    "shell.lang_select": "भाषा निवडा",
    "shell.govt_accreditation": "मान्यताप्राप्त अधिकृत अभ्यासक्रम",
    "dash.official_title": "विद्यार्थी शैक्षणिक प्रगती व अभ्यास पोर्टल",
    "dash.welcome": "स्वागत आहे",
    "dash.academic_session": "शैक्षणिक वर्ष २०२५-२६",
    "dash.student_card": "विद्यार्थी ओळख पत्र",
    "dash.class": "इयत्ता",
    "dash.board": "शिक्षण मंडळ",
    "dash.school": "शाळा / महाविद्यालय",
    "dash.today_target": "दैनिक अभ्यास उद्दिष्ट",
    "dash.syllabus_coverage": "अभ्यासक्रम पूर्णता",
    "dash.study_streak": "सलग अभ्यास दिवस",
    "dash.total_hours": "एकूण अभ्यास तास",
    "dash.subject_breakdown": "विषयवार अभ्यासक्रम प्रगती",
    "dash.subject_status_verified": "मान्यताप्राप्त",
    "dash.add_study_time": "अभ्यास वेळ नोंदवा",
    "dash.minutes": "मिनिटे",
    "dash.chapters_completed": "धडे पूर्ण",
    "dash.quick_access": "महत्त्वाच्या शैक्षणिक सेवा",
    "dash.ncert_books": "ई-पुस्तके",
    "dash.question_bank": "प्रश्नपत्रिका संच",
    "dash.ai_tutor_desk": "एआय शिक्षक मदत",
    "dash.career_guidance": "करिअर वाटा",
    "dash.analytics_view": "प्रगती अहवाल",
    "ai.title": "एडसिंक एआय अभ्यास मार्गदर्शक",
    "ai.subtitle": "मराठी व इंग्रजीमध्ये संकल्पना स्पष्टीकरण",
    "ai.speak_query": "माइकने बोला",
    "ai.listen_answer": "उत्तर ऐका",
    "ai.stop_audio": "थांबवा",
    "ai.input_placeholder": "कोणताही प्रश्न विचारा किंवा माइकने बोला...",
    "ai.ask_button": "विचारा",
    "ai.clear_chat": "साफ करा",
    "ai.copy": "कॉपी करा",
    "ai.listening": "ऐकत आहे...",
    "ai.thinking": "उत्तर तयार होत आहे...",
    "ai.no_questions": "खालील विषयांपैकी एक निवडा किंवा प्रश्न विचारा.",
    "lang_modal.title": "तुमची भाषा निवडा",
    "lang_modal.subtitle": "एडसिंक तुमच्या निवडलेल्या भाषेत डॅशबोर्ड आणि अभ्यास सामग्री उपलब्ध करेल.",
    "lang_modal.confirm": "निवडलेल्या भाषेसह सुरू करा",
    "lang_modal.change_anytime": "तुम्ही हे कधीही बदलू शकता.",
  },

  bn: {
    "nav.dashboard": "অ্যাকাডেমিক ড্যাশবোর্ড",
    "nav.study": "পাঠ্যক্রম ও সিলেবাস",
    "nav.ai": "এআই শিক্ষণ সহায়ক",
    "nav.resources": "অফলাইন রিসোর্স ভল্ট",
    "nav.opportunities": "বৃত্তি ও প্রতিযোগিতামূলক পরীক্ষা",
    "nav.career": "ক্যারিয়ার রোডম্যাপ",
    "nav.mentorship": "শিক্ষক মেন্টরশিপ",
    "nav.progress": "অগ্রগতি বিশ্লেষণ",
    "nav.profile": "শিক্ষার্থী প্রোফাইল",
    "shell.portal_tag": "জাতীয় শিক্ষা পোর্টাল সমন্বিত",
    "shell.offline_ready": "অফলাইন সক্রিয়",
    "shell.online": "অনলাইন সংযুক্ত",
    "shell.sign_out": "লগ আউট",
    "shell.back": "ফিরে যান",
    "shell.lang_select": "ভাষা নির্বাচন",
    "shell.govt_accreditation": "সিবিএসই / আইসিএসই / রাজ্য বোর্ড অনুমোদিত",
    "dash.official_title": "শিক্ষার্থী একাডেমিক অগ্রগতি পোর্টাল",
    "dash.welcome": "স্বাগতম",
    "dash.academic_session": "শিক্ষাবর্ষ ২০২৫-২৬",
    "dash.student_card": "শিক্ষার্থী প্রাতিষ্ঠানিক পাস",
    "dash.class": "শ্রেণী",
    "dash.board": "শিক্ষা বোর্ড",
    "dash.school": "বিদ্যালয়",
    "dash.today_target": "দৈনিক পড়ার লক্ষ্য",
    "dash.syllabus_coverage": "সিলেবাস সম্পন্ন",
    "dash.study_streak": "অধ্যয়নের ধারাবাহিকতা",
    "dash.total_hours": "মোট অধ্যয়নের সময়",
    "dash.subject_breakdown": "বিষয়ভিত্তিক সিলেবাস অগ্রগতি",
    "dash.subject_status_verified": "যাচাইকৃত",
    "dash.add_study_time": "পড়ার সময় যোগ করুন",
    "dash.minutes": "মিনিট",
    "dash.chapters_completed": "অধ্যায় সমাপ্ত",
    "dash.quick_access": "দ্রুত সেবা",
    "dash.ncert_books": "ডিজিটাল পাঠ্যবই",
    "dash.question_bank": "প্রশ্নব্যাংক",
    "dash.ai_tutor_desk": "এআই সহায়তা",
    "dash.career_guidance": "ভবিষ্যত পথপ্রদর্শন",
    "dash.analytics_view": "বিশ্লেষণ",
    "ai.title": "এডসিঙ্ক এআই শিক্ষক",
    "ai.subtitle": "ভয়েস ও টেক্সট সহ ধারণার স্পষ্ট ব্যাখ্যা",
    "ai.speak_query": "ভয়েস ইনপুট",
    "ai.listen_answer": "অডিও শুনুন",
    "ai.stop_audio": "অডিও থামান",
    "ai.input_placeholder": "যেকোনো প্রশ্ন লিখুন বা বলুন...",
    "ai.ask_button": "জিজ্ঞাসা করুন",
    "ai.clear_chat": "মুছে ফেলুন",
    "ai.copy": "কপি করুন",
    "ai.listening": "শোনা হচ্ছে...",
    "ai.thinking": "উত্তর প্রস্তুত করা হচ্ছে...",
    "ai.no_questions": "একটি বিষয় নির্বাচন করুন বা প্রশ্ন করুন।",
    "lang_modal.title": "আপনার পছন্দের ভাষা নির্বাচন করুন",
    "lang_modal.subtitle": "এডসিঙ্ক আপনার ভাষায় পাঠ্যক্রম ও সহায়তা প্রদান করবে।",
    "lang_modal.confirm": "নিশ্চিত করুন",
    "lang_modal.change_anytime": "যেকোনো সময় পরিবর্তনযোগ্য।",
  },

  ta: {
    "nav.dashboard": "கல்வி டாஷ்போர்டு",
    "nav.study": "பாடத்திட்டம் & கல்வி",
    "nav.ai": "AI கல்வி ஆசிரியர்",
    "nav.resources": "ஆஃப்லைன் பாடநூல்கள்",
    "nav.opportunities": "உதவித்தொகை & தேர்வுகள்",
    "nav.career": "தொழில் வழிகாட்டுதல்",
    "nav.mentorship": "ஆசிரியர் வழிகாட்டுதல்",
    "nav.progress": "முன்னேற்ற பகுப்பாய்வு",
    "nav.profile": "மாணவர் சுயவிவரம்",
    "shell.portal_tag": "தேசிய கல்வி பாடத்திட்டம்",
    "shell.offline_ready": "ஆஃப்லைன் தயார்",
    "shell.online": "இணைய இணைப்பு உள்ளது",
    "shell.sign_out": "வெளியேறு",
    "shell.back": "பின்செல்",
    "shell.lang_select": "மொழியை மாற்றவும்",
    "shell.govt_accreditation": "அங்கீகரிக்கப்பட்ட பாடத்திட்டம்",
    "dash.official_title": "மாணவர் கல்வி முன்னேற்ற தளம்",
    "dash.welcome": "வணக்கம்",
    "dash.academic_session": "கல்வியாண்டு 2025-26",
    "dash.student_card": "மாணவர் அடையாள அட்டை",
    "dash.class": "வகுப்பு",
    "dash.board": "கல்வி வாரியம்",
    "dash.school": "பள்ளி",
    "dash.today_target": "இன்றைய படிப்பு இலக்கு",
    "dash.syllabus_coverage": "பாடத்திட்ட நிறைவு",
    "dash.study_streak": "தொடர் படிப்பு நாட்கள்",
    "dash.total_hours": "மொத்த படிப்பு நேரம்",
    "dash.subject_breakdown": "பாடம் வாரியான முன்னேற்றம்",
    "dash.subject_status_verified": "சரிபார்க்கப்பட்டது",
    "dash.add_study_time": "படிப்பு நேரத்தை சேர்க்கவும்",
    "dash.minutes": "நிமிடங்கள்",
    "dash.chapters_completed": "பாடங்கள் முடிந்தது",
    "dash.quick_access": "விரைவு இணைப்புகள்",
    "dash.ncert_books": "டிஜிட்டல் பாடநூல்கள்",
    "dash.question_bank": "வினா வங்கி",
    "dash.ai_tutor_desk": "AI உதவி மையம்",
    "dash.career_guidance": "உயர் கல்வி வழிகாட்டுதல்",
    "dash.analytics_view": "பகுப்பாய்வு",
    "ai.title": "எட்சிங்க் AI ஆசிரியர்",
    "ai.subtitle": "கருத்துக்கள் மற்றும் சமன்பாடுகளுக்கான விளக்கம்",
    "ai.speak_query": "பேசி கேட்கவும்",
    "ai.listen_answer": "பதிலை கேளுங்கள்",
    "ai.stop_audio": "நிறுத்து",
    "ai.input_placeholder": "கேள்விகளை தட்டச்சு செய்யவும் அல்லது பேசவும்...",
    "ai.ask_button": "கேள்",
    "ai.clear_chat": "அழி",
    "ai.copy": "நகலெடு",
    "ai.listening": "கேட்கிறது...",
    "ai.thinking": "பதில் தயாராகிறது...",
    "ai.no_questions": "பாடத்தைத் தேர்வு செய்யவும்.",
    "lang_modal.title": "மொழியை தேர்ந்தெடுக்கவும்",
    "lang_modal.subtitle": "உங்கள் மொழியில் அனைத்து தகவல்களும் காட்டப்படும்.",
    "lang_modal.confirm": "தொடரவும்",
    "lang_modal.change_anytime": "எப்போது வேண்டுமானாலும் மாற்றலாம்.",
  },

  te: {
    "nav.dashboard": "విద్యా డాష్‌బోర్డ్",
    "nav.study": "సిలబస్ & అభ్యాసం",
    "nav.ai": "AI విద్యా ట్యూటర్",
    "nav.resources": "ఆఫ్‌లైన్ లైబ్రరీ",
    "nav.opportunities": "స్కాలర్‌షిప్‌లు & పరీక్షలు",
    "nav.career": "కెరీర్ మార్గదర్శనం",
    "nav.mentorship": "ఉపాధ్యాయుల సలహాలు",
    "nav.progress": "పురోగతి విశ్లేషణ",
    "nav.profile": "విద్యార్థి ప్రొఫైల్",
    "shell.portal_tag": "జాతీయ విద్యా పోర్టల్ సమలేఖనం",
    "shell.offline_ready": "ఆఫ్‌లైన్ సిద్ధంగా ఉంది",
    "shell.online": "ఆన్‌లైన్ కనెక్ట్ చేయబడింది",
    "shell.sign_out": "లాగ్ అవుట్",
    "shell.back": "వెనుకకు",
    "shell.lang_select": "భాషను మార్చండి",
    "shell.govt_accreditation": "గుర్తింపు పొందిన అధికారిక సిలబస్",
    "dash.official_title": "విద్యార్థి విద్యా పురోగతి పోర్టల్",
    "dash.welcome": "స్వాగతం",
    "dash.academic_session": "విద్యా సంవత్సరం 2025-26",
    "dash.student_card": "విద్యార్థి పాస్",
    "dash.class": "తరగతి",
    "dash.board": "విద్యా మండలి",
    "dash.school": "పాఠశాల",
    "dash.today_target": "రోజువారీ లక్ష్యం",
    "dash.syllabus_coverage": "సిలబస్ పురోగతి",
    "dash.study_streak": "నిరంతర అధ్యయన రోజులు",
    "dash.total_hours": "మొత్తం అధ్యయన సమయం",
    "dash.subject_breakdown": "సబ్జెక్టు వారీగా పురోగతి",
    "dash.subject_status_verified": "ధృవీకరించబడింది",
    "dash.add_study_time": "సమయాన్ని నమోదు చేయండి",
    "dash.minutes": "నిమిషాలు",
    "dash.chapters_completed": "అధ్యాయాలు పూర్తయ్యాయి",
    "dash.quick_access": "ముఖ్యమైన లింకులు",
    "dash.ncert_books": "డిజిటల్ పుస్తకాలు",
    "dash.question_bank": "ప్రశ్న బ్యాంక్",
    "dash.ai_tutor_desk": "AI సహాయం",
    "dash.career_guidance": "ఉన్నత విద్య",
    "dash.analytics_view": "పురోగతి నివేదిక",
    "ai.title": "ఎడ్‌సింక్ AI ట్యూటర్",
    "ai.subtitle": "వాయిస్ మరియు టెక్స్ట్ ద్వారా సులభమైన వివరణలు",
    "ai.speak_query": "వాయిస్ ఇన్‌పుట్",
    "ai.listen_answer": "సమాధానం వినండి",
    "ai.stop_audio": "ఆపు",
    "ai.input_placeholder": "ఏదైనా ప్రశ్న అడగండి లేదా మాట్లాడండి...",
    "ai.ask_button": "అడగండి",
    "ai.clear_chat": "క్లియర్",
    "ai.copy": "కాపీ చేయండి",
    "ai.listening": "వింటోంది...",
    "ai.thinking": "సమాధానం సిద్ధమవుతోంది...",
    "ai.no_questions": "సబ్జెక్ట్‌ను ఎంచుకోండి.",
    "lang_modal.title": "మీ భాషను ఎంచుకోండి",
    "lang_modal.subtitle": "మీకు నచ్చిన భాషలో అభ్యాస సహాయాన్ని పొందండి.",
    "lang_modal.confirm": "కొనసాగించండి",
    "lang_modal.change_anytime": "ఎప్పుడైనా మార్చుకోవచ్చు.",
  },

  gu: {
    "nav.dashboard": "શૈક્ષણિક ડેશબોર્ડ",
    "nav.study": "અભ્યાસક્રમ અને શિક્ષણ",
    "nav.ai": "AI અભ્યાસ શિક્ષક",
    "nav.resources": "ઑફલાઇન પુસ્તકાલય",
    "nav.opportunities": "શિષ્યવૃત્તિ અને પરીક્ષાઓ",
    "nav.career": "કારકિર્દી માર્ગદર્શન",
    "nav.mentorship": "શિક્ષક માર્ગદર્શન",
    "nav.progress": "પ્રગતિ વિશ્લેષણ",
    "nav.profile": "વિદ્યાર્થી પ્રોફાઇલ",
    "shell.portal_tag": "રાષ્ટ્રીય શિક્ષણ નીતિ સંરેખિત",
    "shell.offline_ready": "ઑફલાઇન સક્રિય",
    "shell.online": "ઓનલાઇન કનેક્ટેડ",
    "shell.sign_out": "લૉગ આઉટ",
    "shell.back": "પાછળ જાઓ",
    "shell.lang_select": "ભાષા પસંદ કરો",
    "shell.govt_accreditation": "માન્યતા પ્રાપ્ત અભ્યાસક્રમ",
    "dash.official_title": "વિદ્યાર્થી શૈક્ષણિક પોર્ટલ",
    "dash.welcome": "સ્વાગત છે",
    "dash.academic_session": "શૈક્ષણિક વર્ષ ૨૦૨૫-૨૬",
    "dash.student_card": "વિદ્યાર્થી ઓળખ કાર્ડ",
    "dash.class": "ધોરણ",
    "dash.board": "શિક્ષણ બોર્ડ",
    "dash.school": "શાળા",
    "dash.today_target": "દૈનિક અભ્યાસ લક્ષ્ય",
    "dash.syllabus_coverage": "અભ્યાસક્રમ પૂર્ણતા",
    "dash.study_streak": "સતત અભ્યાસ દિવસો",
    "dash.total_hours": "કુલ અભ્યાસ સમય",
    "dash.subject_breakdown": "વિષયવાર પ્રગતિ",
    "dash.subject_status_verified": "પ્રમાણિત",
    "dash.add_study_time": "સમય ઉમેરો",
    "dash.minutes": "મિનિટ",
    "dash.chapters_completed": "પ્રકરણો પૂર્ણ",
    "dash.quick_access": "ઝડપી સેવાઓ",
    "dash.ncert_books": "NCERT પુસ્તકો",
    "dash.question_bank": "પ્રશ્ન બેંક",
    "dash.ai_tutor_desk": "AI મદદ",
    "dash.career_guidance": "ઉચ્ચ શિક્ષણ",
    "dash.analytics_view": "પ્રગતિ અહેવાલ",
    "ai.title": "એડસિંક AI શિક્ષક",
    "ai.subtitle": "ખ્યાલો અને સૂત્રોની સરળ સમજૂતી",
    "ai.speak_query": "બોલીને પૂછો",
    "ai.listen_answer": "જવાબ સાંભળો",
    "ai.stop_audio": "અટકાવો",
    "ai.input_placeholder": "કોઈપણ પ્રશ્ન પૂછો...",
    "ai.ask_button": "પૂછો",
    "ai.clear_chat": "સાફ કરો",
    "ai.copy": "કૉપિ કરો",
    "ai.listening": "સાંભળી રહ્યું છે...",
    "ai.thinking": "જવાબ તૈયાર થઈ રહ્યો છે...",
    "ai.no_questions": "વિષય પસંદ કરો.",
    "lang_modal.title": "તમારી ભાષા પસંદ કરો",
    "lang_modal.subtitle": "એડસિંક તમારી ભાષામાં શિક્ષણ પૂરું પાડશે.",
    "lang_modal.confirm": "ચાલુ રાખો",
    "lang_modal.change_anytime": "તમે કોઈપણ સમયે બદલી શકો છો.",
  },

  kn: {
    "nav.dashboard": "ಶೈಕ್ಷಣಿಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "nav.study": "ಪಠ್ಯಕ್ರಮ ಮತ್ತು ಕಲಿಕೆ",
    "nav.ai": "AI ಕಲಿಕಾ ಸಹಾಯಕ",
    "nav.resources": "ಆಫ್‌ಲೈನ್ ಲೈಬ್ರರಿ",
    "nav.opportunities": "ವಿದ್ಯಾರ್ಥಿವೇತನ ಮತ್ತು ಪರೀಕ್ಷೆಗಳು",
    "nav.career": "ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನ",
    "nav.mentorship": "ಶಿಕ್ಷಕರ ಮಾರ್ಗದರ್ಶನ",
    "nav.progress": "ಪ್ರಗತಿ ವಿಶ್ಲೇಷಣೆ",
    "nav.profile": "ವಿದ್ಯಾರ್ಥಿ ಪ್ರೊಫೈಲ್",
    "shell.portal_tag": "ರಾಷ್ಟ್ರೀಯ ಶೈಕ್ಷಣಿಕ ಪೋರ್ಟಲ್",
    "shell.offline_ready": "ಆಫ್‌ಲೈನ್ ಸಿದ್ಧವಾಗಿದೆ",
    "shell.online": "ಆನ್‌ಲೈನ್ ಸಂಪರ್ಕಗೊಂಡಿದೆ",
    "shell.sign_out": "ಸೈನ್ ಔಟ್",
    "shell.back": "ಹಿಂದಕ್ಕೆ",
    "shell.lang_select": "ಭಾಷೆ ಬದಲಾಯಿಸಿ",
    "shell.govt_accreditation": "ಅಧಿಕೃತ ಪಠ್ಯಕ್ರಮ ಮಾನ್ಯತೆ",
    "dash.official_title": "ವಿದ್ಯಾರ್ಥಿ ಶೈಕ್ಷಣಿಕ ಪ್ರಗತಿ ಪೋರ್ಟಲ್",
    "dash.welcome": "ಸ್ವಾಗತ",
    "dash.academic_session": "ಶೈಕ್ಷಣಿಕ ವರ್ಷ 2025-26",
    "dash.student_card": "ವಿದ್ಯಾರ್ಥಿ ಗುರುತಿನ ಚೀಟಿ",
    "dash.class": "ತರಗತಿ",
    "dash.board": "ಶಿಕ್ಷಣ ಮಂಡಳಿ",
    "dash.school": "ಶಾಲೆ",
    "dash.today_target": "ದೈನಂದಿನ ಅಧ್ಯಯನ ಗುರಿ",
    "dash.syllabus_coverage": "ಪಠ್ಯಕ್ರಮ ಪೂರ್ಣಗೊಂಡಿದೆ",
    "dash.study_streak": "ನಿರಂತರ ಅಧ್ಯಯನದ ದಿನಗಳು",
    "dash.total_hours": "ಒಟ್ಟು ಅಧ್ಯಯನ ಸಮಯ",
    "dash.subject_breakdown": "ವಿಷಯವಾರು ಪ್ರಗತಿ",
    "dash.subject_status_verified": "ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
    "dash.add_study_time": "ಸಮಯವನ್ನು ನಮೂದಿಸಿ",
    "dash.minutes": "ನಿಮಿಷಗಳು",
    "dash.chapters_completed": "ಅಧ್ಯಾಯಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ",
    "dash.quick_access": "ತ್ವರಿತ ಸೇವೆಗಳು",
    "dash.ncert_books": "ಡಿಜಿಟಲ್ ಪುಸ್ತಕಗಳು",
    "dash.question_bank": "ಪ್ರಶ್ನೆ ಕೋಶ",
    "dash.ai_tutor_desk": "AI ನೆರವು",
    "dash.career_guidance": "ಉನ್ನತ ಶಿಕ್ಷಣ",
    "dash.analytics_view": "ವಿಶ್ಲೇಷಣೆ",
    "ai.title": "ಎಡ್‌ಸಿಂಕ್ AI ಟ್ಯೂಟರ್",
    "ai.subtitle": "ಸ್ಪಷ್ಟ ವಿವರಣೆಗಳು ಮತ್ತು ವಾಯ್ಸ್ ಬೆಂಬಲ",
    "ai.speak_query": "ಧ್ವನಿ ಇನ್‌ಪುಟ್",
    "ai.listen_answer": "ಉತ್ತರವನ್ನು ಆಲಿಸಿ",
    "ai.stop_audio": "ನಿಲ್ಲಿಸಿ",
    "ai.input_placeholder": "ಯಾವುದೇ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ...",
    "ai.ask_button": "ಕೇಳಿ",
    "ai.clear_chat": "ತೆರವುಗೊಳಿಸಿ",
    "ai.copy": "ಕಾಪಿ ಮಾಡಿ",
    "ai.listening": "ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದೆ...",
    "ai.thinking": "ಉತ್ತರ ಸಿದ್ಧವಾಗುತ್ತಿದೆ...",
    "ai.no_questions": "ವಿಷಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    "lang_modal.title": "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    "lang_modal.subtitle": "ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯಲ್ಲಿ ಕಲಿಕೆಯನ್ನು ಮುಂದುವರಿಸಿ.",
    "lang_modal.confirm": "ಮುಂದುವರಿಯಿರಿ",
    "lang_modal.change_anytime": "ಯಾವಾಗ ಬೇಕಾದರೂ ಬದಲಾಯಿಸಬಹುದು.",
  },

  ml: {
    "nav.dashboard": "വിദ്യാഭ്യാസ ഡാഷ്‌ബോർഡ്",
    "nav.study": "സിലബസും പഠനവും",
    "nav.ai": "AI പഠന സഹായി",
    "nav.resources": "ഓഫ്‌ലൈൻ ലൈബ്രറി",
    "nav.opportunities": "സ്കോളർഷിപ്പുകളും പരീക്ഷകളും",
    "nav.career": "കരിയർ ഗൈഡൻസ്",
    "nav.mentorship": "അധ്യാപക മാർഗ്ഗനിർദ്ദേശം",
    "nav.progress": "പുരോഗതി റിപ്പോർട്ട്",
    "nav.profile": "വിദ്യാർത്ഥി പ്രൊഫൈൽ",
    "shell.portal_tag": "ദേശീയ വിദ്യാഭ്യാസ പോർട്ടൽ",
    "shell.offline_ready": "ഓഫ്‌ലൈൻ സജീവം",
    "shell.online": "ഓൺലൈൻ ലഭ്യമാണ്",
    "shell.sign_out": "ലോഗ് ഔട്ട്",
    "shell.back": "പിന്നോട്ട്",
    "shell.lang_select": "ഭാഷ തിരഞ്ഞെടുക്കുക",
    "shell.govt_accreditation": "അംഗീകൃത പാഠ്യപദ്ധതി",
    "dash.official_title": "വിദ്യാർത്ഥി അക്കാദമിക് പോർട്ടൽ",
    "dash.welcome": "സ്വാഗതം",
    "dash.academic_session": "അധ്യയന വർഷം 2025-26",
    "dash.student_card": "വിദ്യാർത്ഥി പാസ്",
    "dash.class": "ക്ലാസ്",
    "dash.board": "വിദ്യാഭ്യാസ ബോർഡ്",
    "dash.school": "സ്കൂൾ",
    "dash.today_target": "ദിവസേനയുള്ള ലക്ഷ്യം",
    "dash.syllabus_coverage": "സിലബസ് പുരോഗതി",
    "dash.study_streak": "പഠന ദിനങ്ങൾ",
    "dash.total_hours": "ആകെ പഠന സമയം",
    "dash.subject_breakdown": "വിഷയാടിസ്ഥാനത്തിലുള്ള പുരോഗതി",
    "dash.subject_status_verified": "സ്ഥിരീകരിച്ചത്",
    "dash.add_study_time": "സമയം രേഖപ്പെടുത്തുക",
    "dash.minutes": "മിനിറ്റുകൾ",
    "dash.chapters_completed": "അധ്യായങ്ങൾ പൂർത്തിയായി",
    "dash.quick_access": "പ്രധാന ലിങ്കുകൾ",
    "dash.ncert_books": "പാഠപുസ്തകങ്ങൾ",
    "dash.question_bank": "ചോദ്യപേപ്പർ ബാങ്ക്",
    "dash.ai_tutor_desk": "AI അധ്യാപകൻ",
    "dash.career_guidance": "ഉന്നത വിദ്യാഭ്യാസം",
    "dash.analytics_view": "റിപ്പോർട്ട്",
    "ai.title": "എഡ്സിങ്ക് AI ട്യൂട്ടർ",
    "ai.subtitle": "വ്യക്തമായ വിശദീകരണങ്ങൾ ശബ്ദത്തിൽ കേൾക്കാം",
    "ai.speak_query": "സംസാരിച്ചു ചോദിക്കുക",
    "ai.listen_answer": "ഉത്തരം കേൾക്കുക",
    "ai.stop_audio": "നിർത്തുക",
    "ai.input_placeholder": "സംശയങ്ങൾ ചോദിക്കുക...",
    "ai.ask_button": "ചോദിക്കുക",
    "ai.clear_chat": "മായ്ക്കുക",
    "ai.copy": "പകർപ്പുക",
    "ai.listening": "ശ്രദ്ധിക്കുന്നു...",
    "ai.thinking": "ഉത്തരം തയ്യാറാകുന്നു...",
    "ai.no_questions": "വിഷയം തിരഞ്ഞെടുക്കുക.",
    "lang_modal.title": "ഭാഷ തിരഞ്ഞെടുക്കുക",
    "lang_modal.subtitle": "നിങ്ങളുടെ മാതൃഭാഷയിൽ പഠനം തുടരുക.",
    "lang_modal.confirm": "തുടരുക",
    "lang_modal.change_anytime": "എപ്പോൾ വേണമെങ്കിലും മാറ്റാം.",
  },

  pa: {
    "nav.dashboard": "ਅਕਾਦਮਿਕ ਡੈਸ਼ਬੋਰਡ",
    "nav.study": "ਸਿਲੇਬਸ ਅਤੇ ਅਧਿਐਨ",
    "nav.ai": "AI ਅਧਿਆਪਕ",
    "nav.resources": "ਆਫ਼ਲਾਈਨ ਲਾਇਬ੍ਰੇਰੀ",
    "nav.opportunities": "ਵਜ਼ੀਫ਼ੇ ਅਤੇ ਪ੍ਰੀਖਿਆਵਾਂ",
    "nav.career": "ਕਰੀਅਰ ਮਾਰਗਦਰਸ਼ਨ",
    "nav.mentorship": "ਅਧਿਆਪਕ ਮਾਰਗਦਰਸ਼ਨ",
    "nav.progress": "ਤਰੱਕੀ ਰਿਪੋਰਟ",
    "nav.profile": "ਵਿਦਿਆਰਥੀ ਪ੍ਰੋਫਾਈਲ",
    "shell.portal_tag": "ਰਾਸ਼ਟਰੀ ਸਿੱਖਿਆ ਪੋਰਟਲ",
    "shell.offline_ready": "ਆਫ਼ਲਾਈਨ ਕਿਰਿਆਸ਼ੀਲ",
    "shell.online": "ਆਨਲਾਈਨ ਜੁੜਿਆ",
    "shell.sign_out": "ਲੌਗ ਆਉਟ",
    "shell.back": "ਵਾਪਸ ਜਾਓ",
    "shell.lang_select": "ਭਾਸ਼ਾ ਚੁਣੋ",
    "shell.govt_accreditation": "ਮਾਨਤਾ ਪ੍ਰਾਪਤ ਸਿਲੇਬਸ",
    "dash.official_title": "ਵਿਦਿਆਰਥੀ ਅਕਾਦਮਿਕ ਪੋਰਟਲ",
    "dash.welcome": "ਜੀ ਆਇਆਂ ਨੂੰ",
    "dash.academic_session": "ਵਿੱਦਿਅਕ ਸੈਸ਼ਨ 2025-26",
    "dash.student_card": "ਵਿਦਿਆਰਥੀ ਪਛਾਣ ਪੱਤਰ",
    "dash.class": "ਜਮਾਤ",
    "dash.board": "ਸਿੱਖਿਆ ਬੋਰਡ",
    "dash.school": "ਸਕੂਲ",
    "dash.today_target": "ਰੋਜ਼ਾਨਾ ਅਧਿਐਨ ਟੀਚਾ",
    "dash.syllabus_coverage": "ਸਿਲੇਬਸ ਮੁਕੰਮਲ",
    "dash.study_streak": "ਲਗਾਤਾਰ ਪੜ੍ਹਾਈ ਦੇ ਦਿਨ",
    "dash.total_hours": "ਕੁੱਲ ਪੜ੍ਹਾਈ ਦਾ ਸਮਾਂ",
    "dash.subject_breakdown": "ਵਿਸ਼ੇ ਅਨੁਸਾਰ ਤਰੱਕੀ",
    "dash.subject_status_verified": "ਪ੍ਰਮਾਣਿਤ",
    "dash.add_study_time": "ਸਮਾਂ ਦਰਜ ਕਰੋ",
    "dash.minutes": "ਮਿੰਟ",
    "dash.chapters_completed": "ਅਧਿਆਇ ਪੂਰੇ",
    "dash.quick_access": "ਜ਼ਰੂਰੀ ਲਿੰਕ",
    "dash.ncert_books": "ਡਿਜੀਟਲ ਕਿਤਾਬਾਂ",
    "dash.question_bank": "ਪ੍ਰਸ਼ਨ ਬੈਂਕ",
    "dash.ai_tutor_desk": "AI ਸਹਾਇਤਾ",
    "dash.career_guidance": "ਉੱਚ ਸਿੱਖਿਆ",
    "dash.analytics_view": "ਤਰੱਕੀ ਵਿਸ਼ਲੇਸ਼ਣ",
    "ai.title": "ਐਡਸਿੰਕ AI ਟਿਊਟਰ",
    "ai.subtitle": "ਸੰਕਲਪਾਂ ਦੀ ਸਪੱਸ਼ਟ ਵਿਆਖਿਆ ਅਤੇ ਆਵਾਜ਼ ਸਹਾਇਤਾ",
    "ai.speak_query": "ਬੋਲ ਕੇ ਪੁੱਛੋ",
    "ai.listen_answer": "ਜਵਾਬ ਸੁਣੋ",
    "ai.stop_audio": "ਰੋਕੋ",
    "ai.input_placeholder": "ਕੋਈ ਵੀ ਪ੍ਰਸ਼ਨ ਪੁੱਛੋ...",
    "ai.ask_button": "ਪੁੱਛੋ",
    "ai.clear_chat": "ਸਾਫ਼ ਕਰੋ",
    "ai.copy": "ਕਾਪੀ ਕਰੋ",
    "ai.listening": "ਸੁਣ ਰਿਹਾ ਹੈ...",
    "ai.thinking": "ਜਵਾਬ ਤਿਆਰ ਹੋ ਰਿਹਾ ਹੈ...",
    "ai.no_questions": "ਵਿਸ਼ਾ ਚੁਣੋ।",
    "lang_modal.title": "ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ",
    "lang_modal.subtitle": "ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਵਿੱਚ ਪੜ੍ਹਾਈ ਕਰੋ।",
    "lang_modal.confirm": "ਜਾਰੀ ਰੱਖੋ",
    "lang_modal.change_anytime": "ਕਿਸੇ ਵੀ ਸਮੇਂ ਬਦਲ ਸਕਦੇ ਹੋ।",
  },

  or: {
    "nav.dashboard": "ଶିକ୍ଷାଗତ ଡ୍ୟାସବୋର୍ଡ",
    "nav.study": "ପାଠ୍ୟକ୍ରମ ଏବଂ ଅଧ୍ୟୟନ",
    "nav.ai": "AI ଶିକ୍ଷା ସହାୟକ",
    "nav.resources": "ଅଫଲାଇନ୍ ଇ-ପାଠାଗାର",
    "nav.opportunities": "ବୃତ୍ତି ଏବଂ ପରୀକ୍ଷା",
    "nav.career": "କ୍ୟାରିଅର୍ ମାର୍ଗଦର୍ଶନ",
    "nav.mentorship": "ଶିକ୍ଷକ ମାର୍ଗଦର୍ଶନ",
    "nav.progress": "ପ୍ରଗତି ରିପୋର୍ଟ",
    "nav.profile": "ଛାତ୍ର ପ୍ରୋଫାଇଲ୍",
    "shell.portal_tag": "ଜାତୀୟ ଶିକ୍ଷା ପୋର୍ଟାଲ୍",
    "shell.offline_ready": "ଅଫଲାଇନ୍ ସକ୍ରିୟ",
    "shell.online": "ଅନଲାଇନ୍ ସଂଯୋଗ",
    "shell.sign_out": "ଲଗ୍ ଆଉଟ୍",
    "shell.back": "ପଛକୁ ଯାଆନ୍ତୁ",
    "shell.lang_select": "ଭାଷା ବଦଳାନ୍ତୁ",
    "shell.govt_accreditation": "ଅନୁମୋଦିତ ପାଠ୍ୟକ୍ରମ",
    "dash.official_title": "ଛାତ୍ର ଶିକ୍ଷାଗତ ଅଧ୍ୟୟନ ପୋର୍ଟାଲ୍",
    "dash.welcome": "ସ୍ୱାଗତ",
    "dash.academic_session": "ଶିକ୍ଷାବର୍ଷ ୨୦୨୫-୨୬",
    "dash.student_card": "ଛାତ୍ର ପରିଚୟ ପତ୍ର",
    "dash.class": "ଶ୍ରେଣୀ",
    "dash.board": "ଶିକ୍ଷା ବୋର୍ଡ",
    "dash.school": "ବିଦ୍ୟାଳୟ",
    "dash.today_target": "ଦୈନିକ ଅଧ୍ୟୟନ ଲକ୍ଷ୍ୟ",
    "dash.syllabus_coverage": "ପାଠ୍ୟକ୍ରମ ସମାପ୍ତ",
    "dash.study_streak": "ଅଧ୍ୟୟନ ଦିବସ",
    "dash.total_hours": "ମୋଟ ଅଧ୍ୟୟନ ସମୟ",
    "dash.subject_breakdown": "ବିଷୟବାର ପ୍ରଗତି",
    "dash.subject_status_verified": "ଯାଞ୍ଚ ହୋଇଛି",
    "dash.add_study_time": "ସମୟ ଯୋଡ଼ନ୍ତୁ",
    "dash.minutes": "ମିନିଟ୍",
    "dash.chapters_completed": "ଅଧ୍ୟାୟ ସମ୍ପୂର୍ଣ୍ଣ",
    "dash.quick_access": "ଦ୍ରୁତ ସେବା",
    "dash.ncert_books": "ଡିଜିଟାଲ୍ ବହି",
    "dash.question_bank": "ପ୍ରଶ୍ନ ବ୍ୟାଙ୍କ",
    "dash.ai_tutor_desk": "AI ସହାୟତା",
    "dash.career_guidance": "ଉଚ୍ଚ ଶିକ୍ଷା",
    "dash.analytics_view": "ପ୍ରଗତି ବିଶ୍ଳେଷଣ",
    "ai.title": "ଏଡସିଙ୍କ AI ଶିକ୍ଷକ",
    "ai.subtitle": "ଧାରଣା ଏବଂ ସୂତ୍ରର ସ୍ପଷ୍ଟ ବ୍ୟାଖ୍ୟା",
    "ai.speak_query": "ଭଏସ୍ ଇନପୁଟ୍",
    "ai.listen_answer": "ଉତ୍ତର ଶୁଣନ୍ତୁ",
    "ai.stop_audio": "ବନ୍ଦ କରନ୍ତୁ",
    "ai.input_placeholder": "କୌଣସି ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ...",
    "ai.ask_button": "ପଚାରନ୍ତୁ",
    "ai.clear_chat": "ସଫା କରନ୍ତୁ",
    "ai.copy": "କପି କରନ୍ତୁ",
    "ai.listening": "ଶୁଣୁଛି...",
    "ai.thinking": "ଉତ୍ତର ପ୍ରସ୍ତୁତ ହେଉଛି...",
    "ai.no_questions": "ବିଷୟ ଚୟନ କରନ୍ତୁ।",
    "lang_modal.title": "ଆପଣଙ୍କର ଭାଷା ବାଛନ୍ତୁ",
    "lang_modal.subtitle": "ଆପଣଙ୍କ ପସନ୍ଦର ଭାଷାରେ ଅଧ୍ୟୟନ କରନ୍ତୁ।",
    "lang_modal.confirm": "ଆଗକୁ ବଢ଼ନ୍ତୁ",
    "lang_modal.change_anytime": "ଯେକୌଣସି ସମୟରେ ବଦଳାଇ ପାରିବେ।",
  },
};

const LANG_STORAGE_KEY = "edsync.language";
const LANG_MODAL_SHOWN_KEY = "edsync.lang_prompted";

let currentGlobalLanguage: SupportedLanguage = "en";
let isGlobalModalOpen = false;

function readSavedLang(): SupportedLanguage {
  if (typeof window === "undefined") return "en";
  try {
    const raw = localStorage.getItem(LANG_STORAGE_KEY);
    if (raw && TRANSLATIONS[raw as SupportedLanguage]) {
      return raw as SupportedLanguage;
    }
  } catch {
    /* storage unavailable */
  }
  return "en";
}

export function useI18n() {
  const [hydrated, setHydrated] = useState(false);
  const [language, setLangState] = useState<SupportedLanguage>(currentGlobalLanguage);
  const [isModalOpen, setModalState] = useState<boolean>(isGlobalModalOpen);

  const refresh = useCallback(() => {
    const saved = readSavedLang();
    currentGlobalLanguage = saved;
    setLangState(saved);
  }, []);

  useEffect(() => {
    refresh();
    setHydrated(true);

    if (typeof window !== "undefined") {
      try {
        const hasPrompted = localStorage.getItem(LANG_MODAL_SHOWN_KEY);
        if (!hasPrompted) {
          isGlobalModalOpen = true;
          setModalState(true);
        }
      } catch {
        /* storage unavailable */
      }
    }

    const onChange = () => {
      refresh();
      setModalState(isGlobalModalOpen);
    };

    window.addEventListener("edsync:language", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("edsync:language", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);

  const setLanguage = useCallback((next: SupportedLanguage) => {
    currentGlobalLanguage = next;
    setLangState(next);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LANG_STORAGE_KEY, next);
        localStorage.setItem(LANG_MODAL_SHOWN_KEY, "true");
        window.dispatchEvent(new Event("edsync:language"));
      } catch {
        /* storage unavailable */
      }
    }
  }, []);

  const openLanguageModal = useCallback(() => {
    isGlobalModalOpen = true;
    setModalState(true);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("edsync:language"));
    }
  }, []);

  const closeLanguageModal = useCallback(() => {
    isGlobalModalOpen = false;
    setModalState(false);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LANG_MODAL_SHOWN_KEY, "true");
        window.dispatchEvent(new Event("edsync:language"));
      } catch {
        /* storage unavailable */
      }
    }
  }, []);

  function t(key: string, defaultText?: string): string {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (dict[key]) return dict[key];
    if (TRANSLATIONS.en[key]) return TRANSLATIONS.en[key];
    return defaultText ?? key;
  }

  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return {
    language,
    currentLangObj,
    setLanguage,
    t,
    isModalOpen,
    openLanguageModal,
    closeLanguageModal,
    hydrated,
  };
}
