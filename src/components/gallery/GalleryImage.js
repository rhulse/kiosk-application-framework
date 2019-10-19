import React from "react";
import { translateText } from "../TranslatedRichText";

export default function GalleryImage({ src, imageKey }) {
  return (
    <div className="gallery-image">
      <img src={src} alt="meaningful text" />
      <div className="gallery-image__information">
        <div className="gallery-image__title">
          {translateText(`${imageKey}.title`)}
        </div>
        <div className="gallery-image__description">
          {translateText(`${imageKey}.description`)}
        </div>
        <div className="gallery-image__copyright">
          {translateText(`${imageKey}.copyright`)}
        </div>
      </div>
    </div>
  );
}
