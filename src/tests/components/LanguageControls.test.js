import React from "react";
import ReactDOM from "react-dom";
import { create } from "react-test-renderer";

import LanguageControls from "../../components/LanguageControls";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<LanguageControls />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it("renders the component with no props", () => {
  const component = create(<LanguageControls />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders the component with one language", () => {
  const locales = [{ code: "en", name: "English" }];
  const component = create(<LanguageControls locales={locales} />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders the component with two languages", () => {
  const locales = [
    { code: "en", name: "English" },
    { code: "fr", name: "french" }
  ];
  const component = create(<LanguageControls locales={locales} />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
