import React from "react";
import TranslatedRichText from "../components/TranslatedRichText";

export default function PageTwo() {
  return (
    <>
      <TranslatedRichText wrappingTag="h1">page-one.heading</TranslatedRichText>
      <TranslatedRichText wrappingTag="div">
        page-one.content
      </TranslatedRichText>
    </>
  );
}
