import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import BannerGrid from '../components/BannerGrid';
import BlogPreview from '../components/BlogPreview';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <BannerGrid />
      <BlogPreview />
      <Footer />
    </div>
  );
};

export default Home;
