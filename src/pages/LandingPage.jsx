import React from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { LatestPosts } from '@/components/landing/LatestPosts';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection className="mb-16" />
      <FeaturesSection className="mb-16" />
      <LatestPosts />
    </div>
  );
};

export default LandingPage;