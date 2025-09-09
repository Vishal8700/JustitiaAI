import React from 'react';
import { Scale, Building, Heart, Home, Briefcase, Users } from 'lucide-react';

export const IndianLegalSpecialties: React.FC = () => {
  const specialties = [
    {
      icon: Scale,
      title: "Constitutional Law",
      description: "संविधान कानून",
      areas: ["Fundamental Rights", "Article 32 Petitions", "PIL", "Constitutional Amendments"],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Building,
      title: "Corporate Law",
      description: "कॉर्पोरेट कानून",
      areas: ["Companies Act 2013", "SEBI Regulations", "Mergers & Acquisitions", "Corporate Governance"],
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Heart,
      title: "Family Law",
      description: "पारिवारिक कानून",
      areas: ["Hindu Marriage Act", "Muslim Personal Law", "Divorce Proceedings", "Child Custody"],
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: Home,
      title: "Property Law",
      description: "संपत्ति कानून",
      areas: ["Transfer of Property Act", "Registration Act", "RERA Compliance", "Land Acquisition"],
      color: "from-green-500 to-green-600"
    },
    {
      icon: Briefcase,
      title: "Criminal Law",
      description: "आपराधिक कानून",
      areas: ["IPC Sections", "CrPC Procedures", "POCSO Act", "Cyber Crime Laws"],
      color: "from-red-500 to-red-600"
    },
    {
      icon: Users,
      title: "Civil Law",
      description: "दीवानी कानून",
      areas: ["CPC Procedures", "Contract Act", "Tort Law", "Consumer Protection"],
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  return (
    <div className="py-24 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 animate-fade-in-up">
          <span className="text-orange-600 dark:text-orange-400 font-semibold text-lg mb-4 block">
            भारतीय कानूनी विशेषज्ञता (Indian Legal Specialties)
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Trained on Complete
            <span className="bg-gradient-to-r from-orange-500 via-white to-green-500 bg-clip-text text-transparent block">
              Indian Judicial System
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our Mistral AI is comprehensively trained on all major Indian legal acts, procedures, and judicial precedents
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialties.map((specialty, index) => (
            <div key={index} className={`group relative bg-gradient-to-br ${specialty.color} p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-fade-in-up`} style={{animationDelay: `${index * 0.2}s`}}>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <specialty.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">
                  {specialty.title}
                </h3>
                
                <p className="text-white text-opacity-80 mb-6 text-lg">
                  {specialty.description}
                </p>
                
                <ul className="space-y-2">
                  {specialty.areas.map((area, areaIndex) => (
                    <li key={areaIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-white text-opacity-90">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-white bg-opacity-10 rounded-full blur-xl"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-white bg-opacity-10 rounded-full blur-lg"></div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center animate-fade-in-up animation-delay-1200">
          <div className="bg-gradient-to-r from-orange-100 to-green-100 dark:from-orange-900 dark:to-green-900 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Powered by Mistral AI with Indian Legal Expertise
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-lg max-w-4xl mx-auto">
              Our AI model is specifically fine-tuned on Indian legal corpus including Supreme Court judgments, 
              High Court decisions, legal acts, and procedural codes to provide accurate and contextual legal assistance 
              for Indian legal practitioners and citizens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};