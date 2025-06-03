import React from 'react';
import { Hero } from '../components/Hero/Hero';
import { FeaturedProducts } from '../components/FeaturedProducts/FeaturedProducts';
import { WhyChooseUs } from '../components/WhyChooseUs/WhyChooseUs';

export const HomePage = () => {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <WhyChooseUs />
    </>
  );
};

export default HomePage;