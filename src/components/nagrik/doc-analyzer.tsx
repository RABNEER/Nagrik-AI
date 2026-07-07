"use client";

import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/translations";
import { useApp } from "@/lib/store";
import type { DocAnalysis } from "@/lib/types";
import { 
  FileText, Upload, AlertCircle, CheckCircle2, Loader2, Sparkles, 
  RotateCcw, Info, Check, Eye
} from "lucide-react";
import { AnimatedSphere } from "./animated-sphere";
import { cn } from "@/lib/utils";

export function DocAnalyzer() {
  const { toast } = useToast();
  const { lang } = useTranslation();
  const { goChatWith } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<DocAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Localized UI helper
  const tLocal = (key: string): string => {
    const data: Record<string, Record<string, string>> = {
      en: {
        title: "AI Document Analyzer",
        subtitle: "Upload a photo of your Aadhaar card, PAN card, or other document. The AI will securely check if it is complete and readable.",
        dropzone: "Drag and drop your document image here, or click to browse",
        hint: "Supported formats: JPG, PNG, WEBP (Max 5MB). In compliance with DPDP Act, your data is processed securely and is never stored.",
        analyze: "Analyze Document",
        analyzing: "Analyzing document details...",
        resultsTitle: "Analysis Results",
        docType: "Detected Document Type",
        status: "Status",
        complete: "Complete & Valid",
        incomplete: "Issues Detected",
        extracted: "Extracted Information (Masked)",
        issues: "Issues / Flags",
        reasons: "Recommended Corrective Actions",
        discuss: "Discuss with AI Companion",
        reset: "Reset & Upload New",
        noIssues: "No issues detected. Your document looks clear and complete!",
      },
      hi: {
        title: "एआई दस्तावेज़ विश्लेषक",
        subtitle: "अपने आधार कार्ड, पैन कार्ड या अन्य दस्तावेज़ की एक तस्वीर अपलोड करें। एआई सुरक्षित रूप से जांच करेगा कि यह पूर्ण और पठनीय है या नहीं।",
        dropzone: "अपने दस्तावेज़ की छवि यहाँ खींचें और छोड़ें, या ब्राउज़ करने के लिए क्लिक करें",
        hint: "समर्थित प्रारूप: JPG, PNG, WEBP (अधिकतम 5MB)। DPDP अधिनियम के अनुपालन में, आपका डेटा सुरक्षित रूप से संसाधित होता है और कभी संग्रहीत नहीं होता है।",
        analyze: "दस्तावेज़ का विश्लेषण करें",
        analyzing: "दस्तावेज़ विवरण का विश्लेषण किया जा रहा है...",
        resultsTitle: "विश्लेषण परिणाम",
        docType: "पहचाना गया दस्तावेज़ प्रकार",
        status: "स्थिति",
        complete: "पूर्ण और मान्य",
        incomplete: "समस्याएं पाई गईं",
        extracted: "निकाली गई जानकारी (मास्क की हुई)",
        issues: "समस्याएं / झंडे",
        reasons: "अनुशंसित सुधारात्मक कार्रवाइयां",
        discuss: "AI साथी से चर्चा करें",
        reset: "रीसेट करें और नया अपलोड करें",
        noIssues: "कोई समस्या नहीं मिली। आपका दस्तावेज़ स्पष्ट और पूर्ण लग रहा है!",
      },
      bn: {
        title: "AI নথি বিশ্লেষক",
        subtitle: "আপনার আধার কার্ড, প্যান কার্ড বা অন্যান্য নথির ছবি আপলোড করুন। নথিটি সম্পূর্ণ ও পাঠযোগ্য কিনা তা এআই পরীক্ষা করবে।",
        dropzone: "আপনার নথির ছবি এখানে ড্র্যাগ এবং ড্রপ করুন, অথবা ব্রাউজ করতে ক্লিক করুন",
        hint: "সমর্থিত ফর্ম্যাট: JPG, PNG, WEBP (সর্বোচ্চ ৫এমবি)। DPDP আইন মেনে আপনার ডেটা নিরাপদে প্রসেস করা হয় এবং কখনো সংরক্ষণ করা হয় না।",
        analyze: "নথি বিশ্লেষণ করুন",
        analyzing: "নথির বিবরণ বিশ্লেষণ করা হচ্ছে...",
        resultsTitle: "বিশ্লেষণ ফলাফল",
        docType: "সনাক্তকৃত নথির ধরণ",
        status: "অবস্থা",
        complete: "সম্পূর্ণ ও বৈধ",
        incomplete: "ত্রুটি সনাক্ত হয়েছে",
        extracted: "উদ্ধৃত তথ্য (সুরক্ষিত)",
        issues: "সমস্যা / ত্রুটিসমূহ",
        reasons: "প্রস্তাবিত সংশোধনী পদক্ষেপ",
        discuss: "AI সহকারীর সাথে আলোচনা করুন",
        reset: "রিসেট করুন ও নতুন আপলোড করুন",
        noIssues: "কোন সমস্যা পাওয়া যায়নি। আপনার নথিটি পরিষ্কার এবং সম্পূর্ণ দেখাচ্ছে!",
      },
      ta: {
        title: "AI ஆவண பகுப்பாய்வி",
        subtitle: "உங்கள் ஆதார் அட்டை, பான் அட்டை அல்லது இதர ஆவணத்தின் புகைப்படத்தைப் பதிவேற்றவும். அது முழுமையாகவும் படிக்கக்கூடியதாகவும் உள்ளதா என்பதை AI சரிபார்க்கும்.",
        dropzone: "உங்கள் ஆவணப் படத்தைப் பதிவேற்ற இங்கே இழுத்துப் போடவும், அல்லது தேட கிளிக் செய்யவும்",
        hint: "அனுமதிக்கப்பட்ட கோப்புகள்: JPG, PNG, WEBP (அதிகபட்சம் 5MB). DPDP சட்டப்படி, உங்கள் ஆவணத் தகவல்கள் பாதுகாப்பாகப் பகுப்பாய்வு செய்யப்படும், எங்கும் சேமிக்கப்படாது.",
        analyze: "ஆவணத்தைப் பகுப்பாய்வு செய்",
        analyzing: "ஆவண விவரங்கள் பகுப்பாய்வு செய்யப்படுகின்றன...",
        resultsTitle: "பகுப்பாய்வு முடிவுகள்",
        docType: "கண்டறியப்பட்ட ஆவண வகை",
        status: "நிலை",
        complete: "முழுமையானது & செல்லுபடியாகும்",
        incomplete: "குறைபாடுகள் கண்டறியப்பட்டன",
        extracted: "கண்டறியப்பட்ட விவரங்கள் (மறைக்கப்பட்டது)",
        issues: "பிரச்சினைகள் / குறைபாடுகள்",
        reasons: "பரிந்துரைக்கப்பட்ட திருத்த நடவடிக்கைகள்",
        discuss: "AI உதவியாளருடன் உரையாடுங்கள்",
        reset: "புதிய கோப்பை பதிவேற்றுக",
        noIssues: "குறைபாடுகள் எதுவும் கண்டறியப்படவில்லை. உங்கள் ஆவணம் தெளிவாகவும் முழுமையாகவும் உள்ளது!",
      },
      mr: {
        title: "एआय कागदपत्र विश्लेषक",
        subtitle: "तुमच्या आधार कार्ड, पॅन कार्ड किंवा इतर कागदपत्रांचा फोटो अपलोड करा. कागदपत्र पूर्ण आणि वाचण्यायोग्य आहे की नाही हे एआय सुरक्षितपणे तपासेल.",
        dropzone: "तुमच्या कागदपत्राची प्रतिमा येथे ड्रॅग आणि ड्रॉप करा किंवा ब्राउझ करण्यासाठी क्लिक करा",
        hint: "समर्थित स्वरूपने: JPG, PNG, WEBP (कमाल 5MB). DPDP कायद्याचे अनुपालन करून, तुमचा डेटा सुरक्षितपणे वापरला जातो आणि कधीही साठवला जात नाही.",
        analyze: "कागदपत्राचे विश्लेषण करा",
        analyzing: "कागदपत्राच्या तपशीलांचे विश्लेषण केले जात आहे...",
        resultsTitle: "विश्लेषण निकाल",
        docType: "ओळखलेला कागदपत्राचा प्रकार",
        status: "स्थिती",
        complete: "पूर्ण आणि वैध",
        incomplete: "त्रुटी आढळल्या",
        extracted: "काढलेली माहिती (मास्क केलेली)",
        issues: "त्रुटी / समस्या",
        reasons: "शिफारस केलेल्या सुधारात्मक कृती",
        discuss: "AI सोबत्याशी चर्चा करा",
        reset: "रिसेट करा आणि नवीन अपलोड करा",
        noIssues: "कोणतीही त्रुटी आढळली नाही. तुमचे कागदपत्र स्पष्ट आणि पूर्ण दिसत आहे!",
      }
    };
    const activeLang = lang === "auto" ? "en" : lang;
    return data[activeLang]?.[key] || data["en"]?.[key] || key;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({ title: "File size exceeds 5MB", variant: "destructive" });
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setAnalysis(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (!droppedFile.type.startsWith("image/")) {
        toast({ title: "Please upload an image file (JPG, PNG, WEBP)", variant: "destructive" });
        return;
      }
      if (droppedFile.size > 5 * 1024 * 1024) {
        toast({ title: "File size exceeds 5MB", variant: "destructive" });
        return;
      }
      setFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
      setAnalysis(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("lang", lang);

      const res = await fetch("/api/doc-analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to analyze document");
      setAnalysis(data.analysis);
    } catch (err: any) {
      toast({
        title: "Analysis Failed",
        description: err.message || "Failed to process image.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setAnalysis(null);
  };

  const handleDiscuss = () => {
    if (analysis) {
      goChatWith(`I uploaded my ${analysis.docType}. Tell me how to apply for benefits using this or correct the issues found.`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center py-20">
        <div className="w-32 h-32 relative flex items-center justify-center bg-card rounded-full border border-border mb-6">
          <AnimatedSphere />
          <div className="absolute inset-0 rounded-full border-2 border-trust/10 animate-ping pointer-events-none" />
        </div>
        <p className="text-sm font-medium text-trust animate-pulse">{tLocal("analyzing")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-trust/10 flex items-center justify-center text-trust">
            <FileText className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{tLocal("title")}</h1>
        </div>
        <p className="text-sm text-muted-fg mb-8 leading-relaxed">
          {tLocal("subtitle")}
        </p>

        {!previewUrl ? (
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-trust/40 hover:bg-muted/10 transition-all text-center"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              id="file-input"
            />
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-fg">
              <Upload className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">{tLocal("dropzone")}</p>
              <p className="text-xs text-muted-fg leading-relaxed max-w-md mx-auto">{tLocal("hint")}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Image Preview */}
            <div className="space-y-4">
              <div className="border border-border rounded-lg overflow-hidden bg-muted relative aspect-[4/3] flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Document Preview"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              {!analysis && (
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-secondary text-foreground hover:bg-muted font-medium py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
                  >
                    {tLocal("reset")}
                  </button>
                  <button
                    onClick={handleAnalyze}
                    className="flex-1 bg-trust text-white hover:bg-trust/95 font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    {tLocal("analyze")}
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Analysis Results */}
            <div className="space-y-6">
              {analysis ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <h2 className="text-lg font-bold text-foreground">{tLocal("resultsTitle")}</h2>
                    <button
                      onClick={handleReset}
                      className="text-xs text-muted-fg hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      {tLocal("reset")}
                    </button>
                  </div>

                  {/* Doc Type & Status */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-fg uppercase tracking-widest">{tLocal("docType")}</p>
                    <p className="text-sm font-bold text-foreground">{analysis.docType}</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-semibold text-muted-fg">{tLocal("status")}:</span>
                      {analysis.isComplete ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-success/15 text-success">
                          <CheckCircle2 className="w-3 h-3" />
                          {tLocal("complete")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-warning/15 text-warning">
                          <AlertCircle className="w-3 h-3" />
                          {tLocal("incomplete")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Extracted Fields */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-fg uppercase tracking-widest">{tLocal("extracted")}</p>
                    <div className="border border-border rounded-lg overflow-hidden bg-background">
                      <table className="w-full text-xs text-left">
                        <tbody>
                          {Object.entries(analysis.extractedFields).map(([key, val]) => (
                            <tr key={key} className="border-b border-border last:border-none">
                              <td className="px-4 py-2.5 font-medium text-muted-fg bg-muted/20 w-1/3">{key}</td>
                              <td className="px-4 py-2.5 text-foreground font-mono">{val || "N/A"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Issues */}
                  {analysis.issues.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-destructive uppercase tracking-widest flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {tLocal("issues")}
                      </p>
                      <ul className="text-xs text-muted-fg pl-5 list-disc space-y-1">
                        {analysis.issues.map((issue, idx) => (
                          <li key={idx} className="text-destructive font-medium">{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Corrective Actions */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-foreground uppercase tracking-widest flex items-center gap-1">
                      <Info className="w-4 h-4 text-trust" />
                      {tLocal("reasons")}
                    </p>
                    <ul className="text-xs text-muted-fg pl-5 space-y-1.5">
                      {analysis.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-success flex-shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Discuss Button */}
                  <button
                    onClick={handleDiscuss}
                    className="w-full bg-secondary text-foreground hover:bg-muted font-medium py-3 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-trust" />
                    {tLocal("discuss")}
                  </button>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-border border-dashed rounded-lg bg-muted/10">
                  <Eye className="w-8 h-8 text-muted-fg/60 mb-2" />
                  <p className="text-sm font-semibold text-foreground">{tLocal("analyze")}</p>
                  <p className="text-xs text-muted-fg leading-relaxed max-w-xs mt-1">
                    Click the button below the preview to run the AI checker on your uploaded document.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
