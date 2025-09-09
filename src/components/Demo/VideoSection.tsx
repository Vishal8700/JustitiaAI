import React from 'react';
import { Play, Award, Clock, Target } from 'lucide-react';

export const VideoSection: React.FC = () => {
  return (
    <div className="py-24 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in-up">
  <span className="text-purple-600 dark:text-purple-400 font-semibold text-lg mb-4 block">
    <span className="block py-2">भारतीय कानूनी AI को देखें</span> (See It In Action)
  </span>

  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
    <span className="block py-2">देखें कैसे Justitia AI</span>
    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent block py-2">
      Indian Legal Work को Transform करता है
    </span>
  </h2>

  <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
    Discover how our Mistral AI-powered Indian legal assistant can streamline your workflow and provide expert-level insights on Indian judicial law
  </p>
</div>


        {/* Video Container */}
        <div className="relative mb-16 animate-fade-in-up animation-delay-200">
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 group cursor-pointer">
            {/* Placeholder for YouTube video - Replace with your video */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-500 via-white to-green-500 opacity-90 group-hover:opacity-80 transition-opacity duration-300">
              <div className="text-center">
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-12 h-12 text-blue-800 ml-1" fill="currentColor" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-2">Indian Legal AI Demo</h3>
                <p className="text-blue-800">Watch our comprehensive overview</p>
              </div>
            </div>
            
            {/* Replace this div with your YouTube embed */}
            <div className="absolute inset-0 flex items-center justify-center">
  <div className="text-center w-full h-full">
    <video
      src="./video.mp4"
      controls
      loop
      className="rounded-lg shadow-lg w-full h-full object-cover"
    >
      Your browser does not support the video tag.
    </video>
  </div>
</div>

          </div>
        </div>

        {/* Video Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up animation-delay-400">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">India's Leading</h4>
            <p className="text-blue-700 dark:text-blue-300">Mistral AI technology trusted by Indian legal professionals and law firms</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-xl">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-2">तुरंत परिणाम (Instant)</h4>
            <p className="text-purple-700 dark:text-purple-300">Get comprehensive Indian legal analysis in seconds, not hours</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-xl">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">सटीक परिणाम (Precise)</h4>
            <p className="text-green-700 dark:text-green-300">99.9% accuracy in Indian legal document analysis and insights</p>
          </div>
        </div>
      </div>
    </div>
  );
};