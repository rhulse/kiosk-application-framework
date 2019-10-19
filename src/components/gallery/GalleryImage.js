import React from "react";
import { translateText } from "../TranslatedRichText";

export default function GalleryImage({ src, imageI18nKey }) {
  return (
    <div className="gallery-image">
      <img src={src} alt="meaningful text" />
      <div className="gallery-image__information">
        <div className="gallery-image__title">
          {translateText(`${imageI18nKey}.title`)}
        </div>
        <div className="gallery-image__description">
          {translateText(`${imageI18nKey}.description`)}
        </div>
        <div className="gallery-image__copyright">
          {translateText(`${imageI18nKey}.copyright`)}
        </div>
      </div>
    </div>
  );
}
