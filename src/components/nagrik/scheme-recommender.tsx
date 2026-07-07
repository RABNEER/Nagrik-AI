"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/translations";
import { useApp } from "@/lib/store";
import type { SchemeRecommendation, UserProfile } from "@/lib/types";
import { Loader2, Sparkles, User, MapPin, Calendar, HelpCircle, Briefcase, ExternalLink, MessageSquare, ArrowLeft } from "lucide-react";
import { AnimatedSphere } from "./animated-sphere";
import { cn } from "@/lib/utils";

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry"
];

const GENDERS = [
  { value: "Male", label: "Male / पुरुष" },
  { value: "Female", label: "Female / महिला" },
  { value: "Other", label: "Other / अन्य" }
];

const CATEGORIES = [
  { value: "General", label: "General / सामान्य" },
  { value: "OBC", label: "OBC / अन्य पिछड़ा वर्ग" },
  { value: "SC", label: "SC / अनुसूचित जाति" },
  { value: "ST", label: "ST / अनुसूचित जनजाति" },
  { value: "EWS", label: "EWS / आर्थिक रूप से कमजोर वर्ग" }
];

const INCOME_RANGES = [
  { value: "Under 1 Lakh", label: "Under ₹1 Lakh" },
  { value: "1 Lakh - 3 Lakh", label: "₹1 Lakh - ₹3 Lakh" },
  { value: "3 Lakh - 6 Lakh", label: "₹3 Lakh - ₹6 Lakh" },
  { value: "Above 6 Lakh", label: "Above ₹6 Lakh" }
];

export function SchemeRecommender() {
  const { toast } = useToast();
  const { lang } = useTranslation();
  const { goChatWith, setView } = useApp();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<SchemeRecommendation[]>([]);
  const [step, setStep] = useState<"form" | "results">("form");

  const [profile, setProfile] = useState<UserProfile>({
    state: "Maharashtra",
    age: "25",
    gender: "Female",
    category: "General",
    income: "1 Lakh - 3 Lakh"
  });

  // Localized UI helper
  const tLocal = (key: string): string => {
    const data: Record<string, Record<string, string>> = {
      en: {
        title: "Personalized Scheme Finder",
        subtitle: "Enter your profile details to discover government schemes, scholarships, and benefits you are eligible for.",
        state: "State of Residence",
        age: "Age (Years)",
        gender: "Gender",
        category: "Social Category",
        income: "Annual Household Income",
        find: "Find Schemes",
        finding: "Matching profiles...",
        resultsTitle: "Recommended Schemes",
        resultsSub: "Based on your profile, here are the top matching government programs.",
        eligibility: "Why you match:",
        documents: "Required Documents:",
        discuss: "Discuss with AI Companion",
        visit: "Visit Portal",
        back: "Back to Form",
      },
      hi: {
        title: "व्यक्तिगत योजना खोजक",
        subtitle: "सरकारी योजनाओं, छात्रवृत्तियों और लाभों की खोज के लिए अपनी प्रोफ़ाइल दर्ज करें जिनके लिए आप पात्र हैं।",
        state: "निवास का राज्य",
        age: "आयु (वर्ष)",
        gender: "लिंग",
        category: "सामाजिक श्रेणी",
        income: "वार्षिक पारिवारिक आय",
        find: "योजनाएं खोजें",
        finding: "प्रोफ़ाइल मिलान किया जा रहा है...",
        resultsTitle: "अनुशंसित योजनाएं",
        resultsSub: "आपकी प्रोफ़ाइल के आधार पर, यहाँ शीर्ष मिलान वाले सरकारी कार्यक्रम हैं।",
        eligibility: "आप क्यों पात्र हैं:",
        documents: "आवश्यक दस्तावेज:",
        discuss: "AI साथी से चर्चा करें",
        visit: "पोर्टल पर जाएं",
        back: "फॉर्म पर वापस जाएं",
      },
      bn: {
        title: "ব্যক্তিগত প্রকল্প সন্ধানকারী",
        subtitle: "আপনার যোগ্য সরকারি প্রকল্প, বৃত্তির সন্ধান করতে আপনার প্রোফাইলের বিবরণ দিন।",
        state: "বসবাসের রাজ্য",
        age: "বয়স (বছর)",
        gender: "লিঙ্গ",
        category: "সামাজিক বিভাগ",
        income: "বার্ষিক পারিবারিক আয়",
        find: "প্রকল্প খুঁজুন",
        finding: "প্রোফাইল মেলানো হচ্ছে...",
        resultsTitle: "প্রস্তাবিত প্রকল্পসমূহ",
        resultsSub: "আপনার প্রোফাইলের ভিত্তিতে যোগ্য সরকারি প্রোগ্রামগুলি নিচে দেওয়া হল।",
        eligibility: "কেন আপনি যোগ্য:",
        documents: "প্রয়োজনীয় নথিপত্র:",
        discuss: "AI সহকারীর সাথে আলোচনা করুন",
        visit: "পোর্টাল ভিজিট করুন",
        back: "ফর্মে ফিরে যান",
      },
      ta: {
        title: "தனிப்பயனாக்கப்பட்ட திட்டக் கண்டறிவி",
        subtitle: "நீங்கள் தகுதிபெறும் அரசு திட்டங்கள், உதவித்தொகைகளைக் கண்டறிய உங்கள் விவரங்களை உள்ளிடவும்.",
        state: "வசிக்கும் மாநிலம்",
        age: "வயது (ஆண்டுகள்)",
        gender: "பாலினம்",
        category: "சமூகப் பிரிவு",
        income: "ஆண்டு குடும்ப வருமானம்",
        find: "திட்டங்களைக் கண்டறி",
        finding: "விவரங்கள் பொருத்தப்படுகின்றன...",
        resultsTitle: "பரிந்துரைக்கப்பட்ட திட்டங்கள்",
        resultsSub: "உங்கள் விவரங்களின் அடிப்படையில், உங்களுக்கான அரசு திட்டங்கள் கீழே உள்ளவை.",
        eligibility: "நீங்கள் ஏன் தகுதிபெறுகிறீர்கள்:",
        documents: "தேவையான ஆவணங்கள்:",
        discuss: "AI உதவியாளருடன் உரையாடுங்கள்",
        visit: "தளத்திற்குச் செல்லவும்",
        back: "படிவத்திற்குத் திரும்புக",
      },
      mr: {
        title: "व्यक्तिगत योजना शोधक",
        subtitle: "तुम्ही ज्या सरकारी योजना, शिष्यवृत्ती आणि लाभांसाठी पात्र आहात ते शोधण्यासाठी तुमचे तपशील प्रविष्ट करा.",
        state: "राहण्याचे राज्य",
        age: "वय (वर्षे)",
        gender: "लिंग",
        category: "सामाजिक प्रवर्ग",
        income: "वार्षिक कौटुंबिक उत्पन्न",
        find: "योजना शोधा",
        finding: "प्रोफाइल जुळवली जात आहे...",
        resultsTitle: "शिफारस केलेल्या योजना",
        resultsSub: "तुमच्या प्रोफाइलच्या आधारे, सर्वोत्तम जुळणाऱ्या सरकारी योजना खालीलप्रमाणे आहेत.",
        eligibility: "तुम्ही का पात्र आहात:",
        documents: "आवश्यक कागदपत्रे:",
        discuss: "AI सोबत्याशी चर्चा करा",
        visit: "पोर्टलला भेट द्या",
        back: "फॉर्मवर परत जा",
      }
    };
    const activeLang = lang === "auto" ? "en" : lang;
    return data[activeLang]?.[key] || data["en"]?.[key] || key;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, lang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to recommend schemes");
      setRecommendations(data.recommendations);
      setStep("results");
    } catch (err: any) {
      toast({
        title: "Recommendation Failed",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDiscuss = (schemeName: string) => {
    goChatWith(`Tell me more about ${schemeName}, eligibility, and application steps.`);
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center py-20">
        <div className="w-32 h-32 relative flex items-center justify-center bg-card rounded-full border border-border mb-6">
          <AnimatedSphere />
          <div className="absolute inset-0 rounded-full border-2 border-trust/10 animate-ping pointer-events-none" />
        </div>
        <p className="text-sm font-medium text-trust animate-pulse">{tLocal("finding")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {step === "form" ? (
        <div className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-trust/10 flex items-center justify-center text-trust">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{tLocal("title")}</h1>
          </div>
          <p className="text-sm text-muted-fg mb-8 leading-relaxed">
            {tLocal("subtitle")}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* State Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-trust" />
                  {tLocal("state")}
                </label>
                <select
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  className="w-full bg-background border-2 border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-ring transition-colors"
                >
                  {STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Age Input */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-trust" />
                  {tLocal("age")}
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                  className="w-full bg-background border-2 border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-ring transition-colors"
                  required
                />
              </div>

              {/* Gender Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold flex items-center gap-1.5">
                  <User className="w-4 h-4 text-trust" />
                  {tLocal("gender")}
                </label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  className="w-full bg-background border-2 border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-ring transition-colors"
                >
                  {GENDERS.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>

              {/* Category Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-trust" />
                  {tLocal("category")}
                </label>
                <select
                  value={profile.category}
                  onChange={(e) => setProfile({ ...profile, category: e.target.value })}
                  className="w-full bg-background border-2 border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-ring transition-colors"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Income Range Dropdown */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-semibold flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-trust" />
                  {tLocal("income")}
                </label>
                <select
                  value={profile.income}
                  onChange={(e) => setProfile({ ...profile, income: e.target.value })}
                  className="w-full bg-background border-2 border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-ring transition-colors"
                >
                  {INCOME_RANGES.map((inc) => (
                    <option key={inc.value} value={inc.value}>{inc.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-trust text-white hover:bg-trust/95 font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              {tLocal("find")}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep("form")}
              className="flex items-center gap-2 text-sm text-muted-fg hover:text-foreground transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              {tLocal("back")}
            </button>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{tLocal("resultsTitle")}</h1>
            <p className="text-sm text-muted-fg mt-1">
              {tLocal("resultsSub")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {recommendations.length > 0 ? (
              recommendations.map((rec, i) => (
                <div key={i} className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col justify-between gap-4 hover:border-trust/30 transition-all">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-trust/10 text-trust">
                        {rec.category}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-foreground">{rec.name}</h2>
                    <p className="text-sm text-muted-fg leading-relaxed">{rec.description}</p>
                    
                    <div className="pt-2 border-t border-border mt-3">
                      <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-trust" />
                        {tLocal("eligibility")}
                      </p>
                      <p className="text-xs text-muted-fg mt-1 pl-5">{rec.eligibility}</p>
                    </div>

                    <div className="pt-2 mt-2">
                      <p className="text-xs font-semibold text-foreground">
                        {tLocal("documents")}
                      </p>
                      <ul className="text-xs text-muted-fg mt-1 pl-5 list-disc space-y-0.5">
                        {rec.documents.map((doc, idx) => (
                          <li key={idx}>{doc}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border mt-2">
                    <button
                      onClick={() => handleDiscuss(rec.name)}
                      className="flex-1 bg-secondary text-foreground hover:bg-muted font-medium py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      {tLocal("discuss")}
                    </button>
                    {rec.portalLink && (
                      <a
                        href={rec.portalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-trust text-white hover:bg-trust/95 font-medium py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {tLocal("visit")}
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-fg">
                No matching schemes found. Try adjusting your profile filters.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
