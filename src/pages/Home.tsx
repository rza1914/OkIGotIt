import React from 'react';
import Hero from '../components/Hero';
import BannerGrid from '../components/BannerGrid';
import BlogPreview from '../components/BlogPreview';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <BannerGrid />
      <BlogPreview />
    </div>
  );
};

export default Home;
