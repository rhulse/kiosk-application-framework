import { createElement } from "react";
import parse from "react-html-parser";

import "../i18n";
import { useTranslation } from "react-i18next";

export default function TranslateRichText(props) {
  const { t } = useTranslation();

  const tag = props.wrappingTag || "div";
  let elementProps = {};
  const contentKey = props.children || "no key was set";

  if (props.className !== undefined) {
    elementProps = { className: props.className };
  }
  // const elementProps =
  const parsedContent = parse(t(contentKey));

  if (props.wrappingTag === undefined) {
    return parsedContent;
  } else {
    return createElement(tag, elementProps, parsedContent);
  }
}
