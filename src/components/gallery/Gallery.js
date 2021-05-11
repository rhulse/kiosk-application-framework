import React, { useRef } from "react";
import { createPortal } from "react-dom";

import { useHistory } from "react-router-dom";

import FullScreenOverlayContainer from "../FullScreenOverlay";
import RoutableCarousel from "../../components/RoutableCarousel";
import GalleryImage from "./GalleryImage";

/* 
  Anaylytics for the Gallery component are handled
  automatically in the RoutableCarousel.

  TODO: Add thumbnail nav, with analytics
*/

export default function Gallery({
  showGallery = false,
  onClose,
  galleryData,
  galleryI18nKey,
}) {
  const history = useHistory();
  const lastRoute = useRef(null);

  const baseRoute = galleryData.galleryPath;

  if (lastRoute.current === null) {
    lastRoute.current = history.location.pathname;
    const firstRoute = baseRoute + galleryData.images[0].path;
    history.push(firstRoute);
  }

  const resetRouteAndClose = () => {
    history.push(lastRoute.current);
    lastRoute.current = null;
    onClose();
  };

  return createPortal(
    <FullScreenOverlayContainer
      show={showGallery}
      className="gallery"
      onClose={resetRouteAndClose}
    >
      <RoutableCarousel carouselName={"Gallery"}>
        {galleryData.images.map((image, idx) => {
          return (
            <GalleryImage
              key={image.key}
              imageI18nKey={`${galleryI18nKey}.${image.key}`}
              number={idx}
              path={baseRoute + image.path}
              src={image.sourceFile}
            />
          );
        })}
      </RoutableCarousel>
    </FullScreenOverlayContainer>,
    document.body
  );
}
