import React from "react";
import Hero from "../components/LandingPage/Hero";
import OfferedServices from "../components/LandingPage/OfferedServices";
import StatsSection from "../components/LandingPage/StatsSection";
import LatestProject from "../components/LandingPage/LatestProject";
import OnlineBooking from "../components/LandingPage/OnlineBooking";
import Testimonial from "../components/LandingPage/Testimonial";
import Reviews from "../components/LandingPage/Review";

const LandingPage = () => {
  return (
    <>
      <Hero />
      {/* <OfferedServices /> */}
      <Reviews/>

      <StatsSection />

      {/* <LatestProject /> */}

      {/* <OnlineBooking /> */}

      <Testimonial />
    </>
  );
};

export default LandingPage;
