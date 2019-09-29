import React from "react";
import TranslatedRichText from "../components/TranslatedRichText";

export default function PageFour() {
  return (
    <div className="page">
      <TranslatedRichText wrappingTag="h1">
        page-four.heading
      </TranslatedRichText>
      <TranslatedRichText wrappingTag="div">
        page-four.content
      </TranslatedRichText>
    </div>
  );
}
