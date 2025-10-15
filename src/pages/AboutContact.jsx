import React from "react";
import Hero from "../components/AboutContact/Hero";
import Mission from "../components/AboutContact/Mission";
import WhyChooseUs from "../components/AboutContact/WhyChooseUs";
import PricingTable from "../components/AboutContact/PricingTable";
import GetInTouch from "../components/AboutContact/GetInTouch";
import MapSection from "../components/AboutContact/MapSection";
import Stats from "../components/AboutContact/Stats";

const AboutContact = () => {
  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Mission Statement */}
      <Mission />

      {/* stats */}
      <Stats />
      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Pricing Table */}
      <PricingTable />

      {/* Get In Touch Form */}
      <GetInTouch />

      {/* Map Section */}
      <MapSection />
    </div>
  );
};

export default AboutContact;
