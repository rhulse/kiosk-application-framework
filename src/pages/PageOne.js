import React from "react";
import TranslatedRichText from "../components/TranslatedRichText";
import GalleryPoster from "../components/gallery/GalleryPoster";

export default function PageOne() {
  return (
    <>
      <TranslatedRichText wrappingTag="h1">page-one.heading</TranslatedRichText>
      <TranslatedRichText wrappingTag="div">
        page-one.content
      </TranslatedRichText>
      <GalleryPoster galleryID={"testGallery"} />
    </>
  );
}
