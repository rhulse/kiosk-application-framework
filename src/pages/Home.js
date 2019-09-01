import React from "react";

import TranslatedRichText from "../components/TranslatedRichText";

export default function Home() {
  return (
    <>
      <TranslatedRichText wrappingTag="h1">home.heading</TranslatedRichText>
      <TranslatedRichText wrappingTag="div" className="content">
        home.content
      </TranslatedRichText>
    </>
  );
}
