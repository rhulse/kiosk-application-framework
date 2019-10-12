import { createElement, useRef } from "react";
import parse from "react-html-parser";

import { useTranslation } from "react-i18next";
import i18n from "i18next";

export default function TranslateRichText(props) {
  const { t } = useTranslation();
  const contentArea = useRef(null);

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
