
// import { Button } from "@/components/ui/button";
// import { Search, Brain, Image as ImageIcon, Zap, Plus, Upload,Loader2 } from "lucide-react";
// import { useChatStore } from "@/store/chatStore";
// import { useNavigate } from "react-router-dom";
// import { useToast } from "@/hooks/use-toast";
// import { useState } from "react";
// import PDFToText from "react-pdftotext";
// import axios from "axios"; 
// import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// interface MainContentProps {
//   // No props needed since user data comes from store
// }

// const MainContent = () => {
//   const { addChat, setCurrentChat, user } = useChatStore();
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [isProcessing, setIsProcessing] = useState(false);

//   const handleNewChat = () => {
//     try {
//       const newChat = {
//         id: Date.now().toString(),
//         title: "New Legal Consultation",
//         messages: [],
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       };
      
//       addChat(newChat);
//       setCurrentChat(newChat.id);
//       navigate(`/chat/${newChat.id}`);
//       console.log("New chat created:", newChat);
//     } catch (error) {
//       console.error("Error creating new chat:", error);
//       toast({
//         title: "Error",
//         description: "Failed to create a new chat. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleActionClick = (action: string) => {
//     toast({
//       title: `${action} Feature`,
//       description: `${action} functionality would be implemented here.`,
//     });
//   };

//   // Extract text from PDF using react-pdftotext
//   const extractTextFromPDF = async (file: File): Promise<string> => {
//     try {
//       const text = await PDFToText(file); // Call PDFToText directly with the file
//       console.log(`Extracted text from ${file.name}:`, text);
//       if (!text || text.trim().length < 10) {
//         throw new Error("No readable text found in PDF.");
//       }
//       return text.trim();
//     } catch (error) {
//       console.error("PDF extraction error:", error);
//       throw new Error(`Failed to extract text from PDF: ${error.message}`);
//     }
//   };

//   // Extract text from image using OpenRouter AI
//   const extractTextFromImage = async (file: File): Promise<string> => {
//     return new Promise(async (resolve, reject) => {
//       try {
//         const reader = new FileReader();
//         reader.onload = async function (e) {
//           try {
//             const dataUrl = e.target?.result as string;
//             const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//               method: "POST",
//               headers: {
//                 Authorization: "Bearer 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",
//                 "HTTP-Referer": window.location.origin,
//                 "X-Title": "LegalAI Consultancy Bot",
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 model: "mistralai/mistral-small-3.2-24b-instruct:free",
//                 messages: [
//                   {
//                     role: "user",
//                     content: [
//                       {
//                         type: "text",
//                         text: `You are a specialized OCR system for legal documents. Extract ALL visible text from this image with these requirements:
// 1. EXTRACT COMPLETE TEXT: Transcribe every word, number, and symbol.
// 2. MAINTAIN STRUCTURE: Preserve formatting, paragraphs, and sections.
// 3. IDENTIFY DOCUMENT TYPE: Determine if it's a contract, agreement, etc.
// 4. PRESERVE LEGAL ELEMENTS: Focus on clause numbers, legal terminology, dates, signatures, party names, terms, and penalties.
// 5. OUTPUT FORMAT: Provide clean, readable text for legal analysis.
// Text from image:`,
//                       },
//                       {
//                         type: "image_url",
//                         image_url: { url: dataUrl },
//                       },
//                     ],
//                   },
//                 ],
//               }),
//             });

//             if (!response.ok) throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
//             const data = await response.json();
//             if (data.error) throw new Error(`API Error: ${data.error.message || "Unknown error"}`);
//             const extractedText = data.choices?.[0]?.message?.content || "";
//             if (!extractedText.trim()) throw new Error("No text extracted from the image");
//             resolve(extractedText.trim());
//           } catch (apiError) {
//             console.error("OpenRouter API Error:", apiError);
//             reject(new Error(`Failed to extract text from image: ${apiError.message}`));
//           }
//         };
//         reader.onerror = () => reject(new Error("Failed to read image file"));
//         reader.readAsDataURL(file);
//       } catch (error) {
//         reject(error);
//       }
//     });
//   };

//   // Analyze legal document using OpenRouter AI with Mistral
//   const analyzeLegalDocument = async (extractedText: string): Promise<string> => {
//     try {
//       const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           Authorization: "Bearer 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",
//           "HTTP-Referer": window.location.origin,
//           "X-Title": "LegalAI Consultancy Bot",
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: "mistralai/mistral-small-3.2-24b-instruct:free",
//           messages: [
//             {
//               role: "system",
//               content: `You are an expert legal consultant specializing in Indian judiciary laws. Your expertise covers:
// - Indian Contract Act, 1872
// - Indian Evidence Act, 1872
// - Code of Civil Procedure, 1908
// - Indian Constitution
// - Consumer Protection Act, 2019
// - Arbitration and Conciliation Act, 1996
// - Indian Partnership Act, 1932
// - Sale of Goods Act, 1930
// - Negotiable Instruments Act, 1881
// - Transfer of Property Act, 1882
// Analyze documents with focus on legal compliance, risk assessment, and Indian law applicability.`,
//             },
//             {
//               role: "user",
//               content: `Provide a comprehensive legal analysis of the following document under Indian judiciary laws:
// **DOCUMENT TEXT:**
// ${extractedText}
// **ANALYSIS REQUIREMENTS:**
// 1. Document Classification: Identify the type of legal document.
// 2. Legal Validity Assessment: Check compliance with Indian laws.
// 3. Clause Analysis: Review each major clause for legal soundness, enforceability, and potential risks.
// 4. Compliance Check: Verify adherence to applicable Indian statutes.
// 5. Risk Assessment: Identify legal vulnerabilities.
// 6. Recommendations: Suggest improvements and safeguards.
// 7. Relevant Legal Sections: Cite specific Indian law sections.
// 8. Red Flags: Highlight problematic clauses or missing elements.
// Provide a detailed, professional legal consultation report.`,
//             },
//           ],
//         }),
//       });

//       if (!response.ok) throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
//       const data = await response.json();
//       if (data.error) throw new Error(`API Error: ${data.error.message || "Unknown error"}`);
//       const analysis = data.choices?.[0]?.message?.content || "";
//       if (!analysis.trim()) throw new Error("No analysis generated");
//       return analysis.trim();
//     } catch (error) {
//       console.error("Legal Analysis Error:", error);
//       return `# Legal Analysis Report
// ## Document Review Summary
// Due to a technical issue, this is a preliminary review.
// ## Key Areas to Review:
// 1. Contract Validity: Verify under Section 10, Indian Contract Act, 1872.
// 2. Consideration: Ensure lawful per Section 23.
// 3. Capacity: Confirm legal capacity.
// 4. Free Consent: Check for coercion or fraud.
// 5. Legality: Ensure lawful object.
// ## Recommended Actions:
// - Detailed review by legal counsel.
// - Compliance verification.
// - Enforceability assessment.
// - Risk mitigation.
// ## Disclaimer:
// Preliminary analysis only. Consult a legal professional.
// **Error**: ${error.message}
// **Retry**: Upload again or contact support.`;
//     }
//   };

//   const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     // Reset file input
//     event.target.value = "";

//     if (file.type === "application/pdf" || file.type.startsWith("image/")) {
//       setSelectedFile(file);
//       setIsProcessing(true);
      
//       toast({
//         title: "Processing Document",
//         description: `Extracting text from "${file.name}"...`,
//       });

//       let extractedText = "";

//       try {
//         // Process file based on type
//         if (file.type === "application/pdf") {
//           extractedText = await extractTextFromPDF(file);
//         } else if (file.type.startsWith("image/")) {
//           extractedText = await extractTextFromImage(file);
//         }

//         if (!extractedText.trim()) {
//           throw new Error("No text extracted from the file.");
//         }

//         toast({
//           title: "Text Extracted",
//           description: `Successfully extracted text from "${file.name}". Analyzing...`,
//         });

//         // Analyze the extracted text
//         const aiResponse = await analyzeLegalDocument(extractedText);

//         // Create new chat with extracted text and AI response
//         const newChat = {
//           id: Date.now().toString(),
//           title: `Legal Analysis: ${file.name}`,
//           messages: [
//             {
//               id: crypto.randomUUID(),
//               text: `📄 **Document Uploaded:** ${file.name}\n\n**Extracted Content:**\n${extractedText.substring(0, 500)}${extractedText.length > 500 ? "..." : ""}`,
//               isUser: true,
//               timestamp: new Date().toISOString(),
//             },
//             {
//               id: crypto.randomUUID(),
//               text: aiResponse,
//               isUser: false,
//               timestamp: new Date().toISOString(),
//             },
//           ],
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//         };

//         addChat(newChat);
//         setCurrentChat(newChat.id);
//         navigate(`/chat/${newChat.id}`);
        
//         toast({
//           title: "Analysis Complete",
//           description: `Legal analysis for "${file.name}" is ready.`,
//         });
//       } catch (error) {
//         console.error("Error processing file:", error);
//         toast({
//           title: "Processing Error",
//           description: `Failed to process "${file.name}". ${error.message}`,
//           variant: "destructive",
//         });
//       } finally {
//         setIsProcessing(false);
//         setSelectedFile(null);
//       }
//     } else {
//       toast({
//         title: "Invalid File Type",
//         description: "Please upload a PDF or image file (JPG, PNG).",
//         variant: "destructive",
//       });
//     }
//   };

//   const actionButtons = [
//     { icon: Search, label: "Legal Search" },
//     { icon: Brain, label: "Legal Advice" },
//     { icon: ImageIcon, label: "Document Analysis" },
//     { icon: Zap, label: "Clause Verification" },
//   ];

//   const getGreeting = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return "Good Morning";
//     if (hour < 18) return "Good Afternoon";
//     return "Good Evening";
//   };

//   if (!user) {
//     return (
//       <div className="flex-1 flex items-center justify-center p-8">
//         <div className="text-center max-w-md">
//           <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center">
//             <DotLottieReact
//               src="https://lottie.host/e52b3dc2-923d-47a2-b135-70a24b9c7ac4/m7qdPrHCBZ.lottie"
//               loop
//               autoplay
//               className="w-16 h-16"
//             />
//           </div>
//           <h1 className="text-2xl font-semibold text-foreground mb-2">
//             Please Log In
//           </h1>
//           <p className="text-lg text-muted-foreground mb-4">
//             Log in via the sidebar to access Justitia.ai Consultancy.
//           </p>
//           <p className="text-sm text-muted-foreground">
//             ✨ Use the Google login option in the sidebar to get started...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 flex flex-col">
//       {/* Header */}
//       <div className="p-6 border-border">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <span className="text-sm text-muted-foreground">Justitia.ai Consultancy Services</span>
//           </div>
//           <Button
//             onClick={handleNewChat}
//             className="bg-primary hover:bg-primary-dark text-primary-foreground font-medium px-4 py-2 rounded-lg flex items-center gap-2"
//           >
//             <Plus className="w-4 h-4" />
//             New Consultation
//           </Button>
//         </div>
//       </div>

//       {/* Main Content Area */}
//       <div className="flex-1 flex items-center justify-center p-8">
//         <div className="text-center max-w-md">
//           {/* Welcome Avatar */}
//           <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center">
//             <DotLottieReact
//               src="https://lottie.host/e52b3dc2-923d-47a2-b135-70a24b9c7ac4/m7qdPrHCBZ.lottie"
//               loop
//               autoplay
//               className="w-16 h-16"
//             />
//           </div>

//           {/* Welcome Message */}
//           <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-pink-500 via-purple-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
//             {getGreeting()}, {user.name}
//           </h1>

//           <h2 className="text-xl mb-8 font-semibold text-white">
//             How Can I{" "}
//             <span className="bg-gradient-to-r from-pink-500 via-purple-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent font-bold">
//               Assist You with Legal Matters Today?
//             </span>
//           </h2>


//           {/* Action Buttons */}
//           <div className="flex justify-center gap-4 mb-8">
//             {actionButtons.map((action) => {
//               const Icon = action.icon;
//               return (
//                 <Button
//                   key={action.label}
//                   variant="outline"
//                   onClick={() => handleActionClick(action.label)}
//                   className="flex items-center gap-2 px-4 py-2 rounded-lg border-border hover:bg-muted"
//                 >
//                   <Icon className="w-4 h-4" />
//                   <span className="text-sm">{action.label}</span>
//                 </Button>
//               );
//             })}
//           </div>

//           {/* Document Upload */}
//           <div className="mb-8">
//   <div className="relative inline-block">
//     <input
//       id="file-upload"
//       type="file"
//       accept="*/*"
//       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//       onChange={handleFileChange}
//       disabled={isProcessing}
//     />
//     <Button
//       variant="outline"
//       disabled={isProcessing}
//       className="flex items-center gap-2 px-4 py-2 rounded-lg border-border hover:bg-muted disabled:opacity-50 pointer-events-none"
//     >
//       {isProcessing ? (
//         <Loader2 className="w-4 h-4 animate-spin" />
//       ) : (
//         <Upload className="w-4 h-4" />
//       )}
//       <span className="text-sm">
//         {isProcessing ? "Processing..." : "Upload Document (PDF/Image)"}
//       </span>
//     </Button>
//   </div>
//   <p className="text-xs text-muted-foreground mt-2">
//     Upload legal documents to verify flaws, correctness, clauses, and sections under Indian judiciary laws.
//   </p>
//   {selectedFile && (
//     <p className="text-xs text-primary mt-1">
//       Selected: {selectedFile.name}
//     </p>
//   )}
// </div>

//           {/* Quick Start Text */}
//           <p className="text-sm text-muted-foreground">
//             ✨ Ask a legal query, upload a document, or request consultation on Indian laws...
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainContent;

import { Button } from "@/components/ui/button";
import { Search, Brain, Image as ImageIcon, Zap, Plus, Upload, Loader2 } from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import PDFToText from "react-pdftotext";
import axios from "axios";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface MainContentProps {
  // No props needed since user data comes from store
}

const MainContent = () => {
  const { addChat, setCurrentChat, user } = useChatStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNewChat = () => {
    try {
      const newChat = {
        id: Date.now().toString(),
        title: "New Legal Consultation",
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      addChat(newChat);
      setCurrentChat(newChat.id);
      navigate(`/chat/${newChat.id}`);
      console.log("New chat created:", newChat);
    } catch (error) {
      console.error("Error creating new chat:", error);
      toast({
        title: "Error",
        description: "Failed to create a new chat. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleActionClick = (action: string) => {
    toast({
      title: `${action} Feature`,
      description: `${action} functionality would be implemented here.`,
    });
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const text = await PDFToText(file);
      console.log(`Extracted text from ${file.name}:`, text);
      if (!text || text.trim().length < 10) {
        throw new Error("No readable text found in PDF.");
      }
      return text.trim();
    } catch (error) {
      console.error("PDF extraction error:", error);
      throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
  };

  const extractTextFromImage = async (file: File): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = async function (e) {
          try {
            const dataUrl = e.target?.result as string;
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
              method: "POST",
              headers: {
                Authorization: "Bearer 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",
                "HTTP-Referer": window.location.origin,
                "X-Title": "LegalAI Consultancy Bot",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "mistralai/mistral-small-3.2-24b-instruct:free",
                messages: [
                  {
                    role: "user",
                    content: [
                      {
                        type: "text",
                        text: `You are a specialized OCR system for legal documents. Extract ALL visible text from this image with these requirements:
1. EXTRACT COMPLETE TEXT: Transcribe every word, number, and symbol.
2. MAINTAIN STRUCTURE: Preserve formatting, paragraphs, and sections.
3. IDENTIFY DOCUMENT TYPE: Determine if it's a contract, agreement, etc.
4. PRESERVE LEGAL ELEMENTS: Focus on clause numbers, legal terminology, dates, signatures, party names, terms, and penalties.
5. OUTPUT FORMAT: Provide clean, readable text for legal analysis.
Text from image:`,
                      },
                      {
                        type: "image_url",
                        image_url: { url: dataUrl },
                      },
                    ],
                  },
                ],
              }),
            });

            if (!response.ok) throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
            const data = await response.json();
            if (data.error) throw new Error(`API Error: ${data.error.message || "Unknown error"}`);
            const extractedText = data.choices?.[0]?.message?.content || "";
            if (!extractedText.trim()) throw new Error("No text extracted from the image");
            resolve(extractedText.trim());
          } catch (apiError) {
            console.error("OpenRouter API Error:", apiError);
            reject(new Error(`Failed to extract text from image: ${apiError.message}`));
          }
        };
        reader.onerror = () => reject(new Error("Failed to read image file"));
        reader.readAsDataURL(file);
      } catch (error) {
        reject(error);
      }
    });
  };

  const analyzeLegalDocument = async (extractedText: string): Promise<string> => {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: "Bearer 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",
          "HTTP-Referer": window.location.origin,
          "X-Title": "LegalAI Consultancy Bot",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-small-3.2-24b-instruct:free",
          messages: [
            {
              role: "system",
              content: `You are an expert legal consultant specializing in Indian judiciary laws. Your expertise covers:
- Indian Contract Act, 1872
- Indian Evidence Act, 1872
- Code of Civil Procedure, 1908
- Indian Constitution
- Consumer Protection Act, 2019
- Arbitration and Conciliation Act, 1996
- Indian Partnership Act, 1932
- Sale of Goods Act, 1930
- Negotiable Instruments Act, 1881
- Transfer of Property Act, 1882
Analyze documents with focus on legal compliance, risk assessment, and Indian law applicability.`,
            },
            {
              role: "user",
              content: `Provide a comprehensive legal analysis of the following document under Indian judiciary laws:
**DOCUMENT TEXT:**
${extractedText}
**ANALYSIS REQUIREMENTS:**
1. Document Classification: Identify the type of legal document.
2. Legal Validity Assessment: Check compliance with Indian laws.
3. Clause Analysis: Review each major clause for legal soundness, enforceability, and potential risks.
4. Compliance Check: Verify adherence to applicable Indian statutes.
5. Risk Assessment: Identify legal vulnerabilities.
6. Recommendations: Suggest improvements and safeguards.
7. Relevant Legal Sections: Cite specific Indian law sections.
8. Red Flags: Highlight problematic clauses or missing elements.
Provide a detailed, professional legal consultation report.`,
            },
          ],
        }),
      });

      if (!response.ok) throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
      const data = await response.json();
      if (data.error) throw new Error(`API Error: ${data.error.message || "Unknown error"}`);
      const analysis = data.choices?.[0]?.message?.content || "";
      if (!analysis.trim()) throw new Error("No analysis generated");
      return analysis.trim();
    } catch (error) {
      console.error("Legal Analysis Error:", error);
      return `# Legal Analysis Report
## Document Review Summary
Due to a technical issue, this is a preliminary review.
## Key Areas to Review:
1. Contract Validity: Verify under Section 10, Indian Contract Act, 1872.
2. Consideration: Ensure lawful per Section 23.
3. Capacity: Confirm legal capacity.
4. Free Consent: Check for coercion or fraud.
5. Legality: Ensure lawful object.
## Recommended Actions:
- Detailed review by legal counsel.
- Compliance verification.
- Enforceability assessment.
- Risk mitigation.
## Disclaimer:
Preliminary analysis only. Consult a legal professional.
**Error**: ${error.message}
**Retry**: Upload again or contact support.`;
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    event.target.value = "";

    if (file.type === "application/pdf" || file.type.startsWith("image/")) {
      setSelectedFile(file);
      setIsProcessing(true);
      
      toast({
        title: "Processing Document",
        description: `Extracting text from "${file.name}"...`,
      });

      let extractedText = "";

      try {
        if (file.type === "application/pdf") {
          extractedText = await extractTextFromPDF(file);
        } else if (file.type.startsWith("image/")) {
          extractedText = await extractTextFromImage(file);
        }

        if (!extractedText.trim()) {
          throw new Error("No text extracted from the file.");
        }

        toast({
          title: "Text Extracted",
          description: `Successfully extracted text from "${file.name}". Analyzing...`,
        });

        const aiResponse = await analyzeLegalDocument(extractedText);

        const newChat = {
          id: Date.now().toString(),
          title: `Legal Analysis: ${file.name}`,
          messages: [
            {
              id: crypto.randomUUID(),
              text: `📄 **Document Uploaded:** ${file.name}\n\n**Extracted Content:**\n${extractedText.substring(0, 500)}${extractedText.length > 500 ? "..." : ""}`,
              isUser: true,
              timestamp: new Date().toISOString(),
            },
            {
              id: crypto.randomUUID(),
              text: aiResponse,
              isUser: false,
              timestamp: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        addChat(newChat);
        setCurrentChat(newChat.id);
        navigate(`/chat/${newChat.id}`);
        
        toast({
          title: "Analysis Complete",
          description: `Legal analysis for "${file.name}" is ready.`,
        });
      } catch (error) {
        console.error("Error processing file:", error);
        toast({
          title: "Processing Error",
          description: `Failed to process "${file.name}". ${error.message}`,
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
        setSelectedFile(null);
      }
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF or image file (JPG, PNG).",
        variant: "destructive",
      });
    }
  };

  const actionButtons = [
    { icon: Search, label: "Legal Search" },
    { icon: Brain, label: "Legal Advice" },
    { icon: ImageIcon, label: "Document Analysis" },
    { icon: Zap, label: "Clause Verification" },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center">
            <DotLottieReact
              src="https://lottie.host/e52b3dc2-923d-47a2-b135-70a24b9c7ac4/m7qdPrHCBZ.lottie"
              loop
              autoplay
              className="w-16 h-16"
            />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Please Log In
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            Log in via the sidebar to access Justitia.ai Consultancy.
          </p>
          <p className="text-sm text-muted-foreground">
            ✨ Use the Google login option in the sidebar to get started...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-6 border-border">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Justitia.ai Consultancy Services</span>
          </div>
          <Button
            onClick={handleNewChat}
            className="bg-primary hover:bg-primary-dark text-primary-foreground font-medium px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Consultation
          </Button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center">
            <DotLottieReact
              src="https://lottie.host/e52b3dc2-923d-47a2-b135-70a24b9c7ac4/m7qdPrHCBZ.lottie"
              loop
              autoplay
              className="w-16 h-16"
            />
          </div>

          <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-pink-500 via-purple-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
            {getGreeting()}, {user.name}
          </h1>

          <h2 className="text-xl mb-8 font-semibold text-white">
            How Can I{" "}
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent font-bold">
              Assist You with Legal Matters Today?
            </span>
          </h2>

          <div className="flex justify-center gap-4 mb-8">
            {actionButtons.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.label}
                  variant="outline"
                  onClick={() => handleActionClick(action.label)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border-border hover:bg-muted"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{action.label}</span>
                </Button>
              );
            })}
          </div>

          <div className="mb-8">
            <div className="relative inline-block">
              <input
                id="file-upload"
                type="file"
                accept="*/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                disabled={isProcessing}
              />
              <Button
                variant="outline"
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border-border hover:bg-muted disabled:opacity-50 pointer-events-none"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span className="text-sm">
                  {isProcessing ? "Processing..." : "Upload Document (PDF/Image)"}
                </span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Upload legal documents to verify flaws, correctness, clauses, and sections under Indian judiciary laws.
            </p>
            {selectedFile && (
              <p className="text-xs text-primary mt-1">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            ✨ Ask a legal query, upload a document, or request consultation on Indian laws...
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainContent;