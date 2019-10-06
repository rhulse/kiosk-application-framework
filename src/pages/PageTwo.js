import React from "react";
import TranslatedRichText from "../components/TranslatedRichText";

export default function PageThree() {
  return (
    <>
      <TranslatedRichText wrappingTag="h1">page-two.heading</TranslatedRichText>
      <TranslatedRichText wrappingTag="div">
        page-two.content
      </TranslatedRichText>
    </>
  );
}
