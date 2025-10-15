import React from "react";
import Hero from "../components/ServicesRendered/Hero";
import ServicesRenderedSection from "../components/ServicesRendered/ServicesRendered";
import WorkProcess from "../components/ServicesRendered/WorkProcess";
import Contact from "../components/ServicesRendered/Contact";



const ServicesRendered = () => {
  return (
    <div>
      {/* Hero Section */}
      <Hero />

      <ServicesRenderedSection />

      
      <WorkProcess />

      <Contact/>

    </div>


  );
};

export default ServicesRendered;
