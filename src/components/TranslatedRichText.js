import { createElement, useRef, useEffect } from "react";
import parse from "react-html-parser";

import { useGloss } from "../contexts/GlossContext";

import { useTranslation } from "react-i18next";
import i18n from "i18next";

/*
 * NOTE: We are attaching the (imported) gloss handlers here, rather than globally,
 * as this is where the translation change happens.
 * Only this component re-renders, meaning this is where we must attach the events each time
 */

export default function TranslateRichText(props) {
  const { t } = useTranslation();
  const contentArea = useRef(null);
  const [gloss] = useGloss();

  useEffect(() => {
    /*
        This check avoids a race condition if this component renders before the gloss is added
        to the global state. This is Not Ideal(TM), but is best solution I could find.
        It avoids prop drilling, and encapsulates all the gloss bahavior in one place,
        improving maintainability.
        - RH  
    */

    if (gloss !== null) {
      // any time there is a render (i.e for a change of language), we check for gloss elements and attach the handler
      const containerElement = contentArea.current;
      gloss.addGlossListeners(containerElement);
      return () => {
        gloss.removeGlossListeners(containerElement);
      };
    }
  });

  const contentKey =
    props.children ||
    "WARNING: content key or text required inside <TranslateRichText> tag.";
  let parsedContent = parse(t(contentKey));

  const tag = props.wrappingTag || "div";

  let elementProps = { ref: contentArea };
  if (props.className !== undefined) {
    elementProps = { ...elementProps, className: props.className };
  }
  const element = createElement(tag, elementProps, parsedContent);

  return element;
}

export function translateText(contentKey) {
  return parse(i18n.t(contentKey));
}
