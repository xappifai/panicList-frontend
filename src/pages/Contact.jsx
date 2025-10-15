import React from "react";
import Hero from "../components/Contact/Hero";
import GetInTouch from "../components/Contact/GetInTouch";
import MapSection from "../components/Contact/MapSection";
import ContactInfo from "../components/Contact/ContactInfo";


const Contact = () => {
  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Contact Info */}
      <ContactInfo />

      {/* Get In Touch Form */}
      <GetInTouch />

      {/* Map Section */}
      <MapSection />



    </div>
  );
};

export default Contact;
