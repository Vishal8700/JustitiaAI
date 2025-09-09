import React from 'react';
import { MessageSquare, FileText, GitBranch, Zap, Shield, Users } from 'lucide-react';
import { FeatureCard } from './FeatureCard';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "Mistral AI-Powered Legal Chat",
      description: "Engage in natural conversations with our Mistral AI assistant trained on Indian judicial law for instant legal guidance and consultation.",
      features: [
        "Hindi & English language support",
        "Real-time Indian legal advice",
        "IPC, CrPC, CPC knowledge base",
        "Constitutional law expertise"
      ],
      gradient: "bg-gradient-to-r from-blue-500 to-blue-600",
      delay: "animation-delay-200"
    },
    {
      icon: FileText,
      title: "Indian Legal Document Analysis",
      description: "Upload Indian legal documents (PDFs/images) for comprehensive analysis with insights on Indian law compliance and recommendations.",
      features: [
        "Indian legal document recognition",
        "Contract & agreement analysis",
        "Compliance with Indian laws",
        "Hindi document support"
      ],
      gradient: "bg-gradient-to-r from-purple-500 to-purple-600",
      delay: "animation-delay-400"
    },
    {
      icon: GitBranch,
      title: "Multi-Case Management",
      description: "Manage multiple Indian legal cases simultaneously with our advanced multi-session chat system for different practice areas.",
      features: [
        "Civil & Criminal case tracking",
        "Family law consultations",
        "Corporate law analysis",
        "Property law guidance"
      ],
      gradient: "bg-gradient-to-r from-green-500 to-green-600",
      delay: "animation-delay-600"
    },
    {
      icon: Zap,
      title: "Indian Law Insights",
      description: "Get immediate insights on Indian legal matters, identify potential issues under Indian law, and receive actionable recommendations.",
      features: [
        "Indian law compliance check",
        "Jurisdiction-specific advice",
        "Supreme Court precedents",
        "High Court judgments analysis"
      ],
      gradient: "bg-gradient-to-r from-yellow-500 to-orange-500",
      delay: "animation-delay-800"
    },
    {
      icon: Shield,
      title: "Secure & India Compliant",
      description: "Enterprise-grade security with full compliance to Indian data protection laws and legal industry standards.",
      features: [
        "Data localization in India",
        "IT Act 2000 compliant",
        "Digital India certified",
        "Indian legal audit trails"
      ],
      gradient: "bg-gradient-to-r from-red-500 to-pink-500",
      delay: "animation-delay-1000"
    },
    {
      icon: Users,
      title: "Law Firm Collaboration",
      description: "Collaborate with your Indian law firm team, share case insights, and work together on complex Indian legal matters.",
      features: [
        "Multi-lawyer workspaces",
        "Case file sharing",
        "Client consultation notes",
        "Senior-junior access control"
      ],
      gradient: "bg-gradient-to-r from-indigo-500 to-purple-500",
      delay: "animation-delay-1200"
    }
  ];

  return (
    <div className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 animate-fade-in-up">
          <span className="text-blue-600 dark:text-blue-400 font-semibold text-lg block">
  <span className="block py-2">भारतीय कानूनी सुविधाएं</span> (Core Features)
</span>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Indian Legal Practice के लिए
           <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block py-2">
  सब कुछ जो आपको चाहिए
</span>


          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive Mistral AI-powered tools designed specifically for Indian legal system to revolutionize how you handle legal documents and consultations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
};