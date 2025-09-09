import React from 'react';
import { ThemeProvider } from '../components/theme-provider';
import { ThemeToggle } from '../components/ThemeToggle';
import { HeroSection } from '../components/Demo/HeroSection';
import { FeaturesSection } from '../components/Demo/FeaturesSection';
import { IndianLegalSpecialties } from '../components/Demo/IndianLegal';
import { VideoSection } from '../components/Demo/VideoSection';
import { CTASection } from '../components/Demo/CTASection';

const Library = () => {
  return (
    <ThemeProvider>
  <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 relative">
    {/* Floating Theme Toggle */}
    <div className="absolute top-4 right-4 z-50">
      <ThemeToggle />
    </div>
    <HeroSection />
    <FeaturesSection />
    <IndianLegalSpecialties />
    <VideoSection />
    <CTASection />
  </div>
</ThemeProvider>

  );
};

export default Library;