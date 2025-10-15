import React from "react";
import Hero from "../components/HelpAndFaq/Hero";
import ChatBubble from "../components/HelpAndFaq/ChatBubble";
import Faq from "../components/HelpAndFaq/Faq";
import SelectTopic from "../components/HelpAndFaq/SelectTopic";

const HelpAndFAQ = () => {
  return (
    <div>
      <Hero />
      <SelectTopic />
      <Faq />
      <ChatBubble />
    </div>
  );
};

export default HelpAndFAQ;
