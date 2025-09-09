import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        <div className="mb-8 animate-fade-in-up">
          <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold mb-6">
            Powered by Mistral AI • Trained on Indian Judicial Law
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight animate-fade-in-up animation-delay-200">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Justitia AI
          </span>
          <br />
          Indian Legal Consultancy Service
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-400">
          Transform your Indian legal document analysis with Mistral AI-powered intelligence. 
          Get instant insights on IPC, CrPC, CPC, and Constitutional law with expert-level consultations.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-600">
          <button
            onClick={() => (window.location.href = "/")}
            className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
            शुरू करें (Start Free Trial)
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          
          <button className="group px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full font-semibold text-lg border border-gray-300 dark:border-gray-600 hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2">
            <Play className="w-5 h-5" />
            डेमो देखें (Watch Demo)
          </button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up animation-delay-800">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">50k+</div>
            <div className="text-gray-600 dark:text-gray-400">Indian Legal Documents Analyzed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">99.9%</div>
            <div className="text-gray-600 dark:text-gray-400">Accuracy on Indian Law</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-2">15+</div>
            <div className="text-gray-600 dark:text-gray-400">Indian Languages Supported</div>
          </div>
        </div>
      </div>
    </div>
  );
};