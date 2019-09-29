import React from "react";
import TranslatedRichText from "../components/TranslatedRichText";

export default function PageThree() {
  return (
    <div className="page">
      <TranslatedRichText wrappingTag="h1">
        page-three.heading
      </TranslatedRichText>
      <TranslatedRichText wrappingTag="div">
        page-three.content
      </TranslatedRichText>
    </div>
  );
}
