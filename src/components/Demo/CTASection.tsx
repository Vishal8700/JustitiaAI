import React from 'react';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';

export const CTASection: React.FC = () => {
  return (
    <div className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="animate-fade-in-up">
          <span className="inline-block px-4 py-2 bg-white bg-opacity-20 text-white rounded-full text-sm font-semibold mb-6">
            ⚡ सीमित समय का ऑफर (Limited Time Offer)
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in-up animation-delay-200">
          Ready to Transform Your
          <span className="block">Indian Legal Practice?</span>
          <span className="block text-3xl md:text-4xl mt-2">अपनी कानूनी प्रैक्टिस को बदलने के लिए तैयार हैं?</span>
        </h2>

        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-400">
          Join thousands of Indian legal professionals who trust Justitia AI powered by Mistral AI for their document analysis and legal consultations based on Indian judicial law.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up animation-delay-600">
          <a
                href="/"
                className="group px-8 py-4 bg-white text-purple-600 rounded-full font-semibold text-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-xl"
                >
                अपना Free Trial शुरू करें
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
        </div>

        {/* Features List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in-up animation-delay-800">
          <div className="flex items-center justify-center gap-3 text-white">
            <CheckCircle className="w-5 h-5 text-green-300" />
            <span>कोई Credit Card नहीं चाहिए</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-white">
            <CheckCircle className="w-5 h-5 text-green-300" />
            <span>14-दिन Free Trial</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-white">
            <CheckCircle className="w-5 h-5 text-green-300" />
            <span>कभी भी Cancel करें</span>
          </div>
        </div>

        {/* Social Proof */}
        <div className="animate-fade-in-up animation-delay-1000">

         
          <p className="text-white font-semibold mt-2">- Develope by Vishal Kumar & Deepanshu Kumar </p>
        </div>
      </div>
    </div>
  );
};