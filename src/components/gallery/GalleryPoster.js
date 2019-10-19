import React, { useState } from "react";
import Icon, { picture } from "../Icon";

import { translateText } from "../TranslatedRichText";
import allGalleryData from "../../content/galleryData";
import Gallery from "./Gallery";

export default function GalleryPoster({ galleryID }) {
  const [showGallery, setShowGallery] = useState(false);
  const galleryData = allGalleryData[galleryID];
  const galleryI18nKey = `galleries.${galleryID}`;

  const openGallery = () => {
    setShowGallery(true);
  };

  const onClose = () => {
    setShowGallery(false);
  };

  return (
    <>
      <div className="poster" onClick={openGallery}>
        <Icon icon={picture} size="5x" />
        <div className="poster__information">
          <div className="name">{translateText(`${galleryI18nKey}.name`)}</div>
          <div className="duration">
            {galleryData.images.length} {translateText("misc.images")}
          </div>
        </div>
      </div>
      {showGallery && (
        <Gallery
          showGallery={showGallery}
          galleryData={galleryData}
          galleryI18nKey={galleryI18nKey}
          onClose={onClose}
        />
      )}
    </>
  );
}
