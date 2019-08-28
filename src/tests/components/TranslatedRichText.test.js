import React from "react";
import ReactDOM from "react-dom";
import { create } from "react-test-renderer";

import TranslatedRichText from "../../components/TranslatedRichText";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<TranslatedRichText />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it("renders the component with no props or content", () => {
  const component = create(<TranslatedRichText />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders the component with a specified span type", () => {
  const component = create(<TranslatedRichText tagType="span" />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders the component with a specified span type and class", () => {
  const component = create(
    <TranslatedRichText tagType="span" className="css-class" />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
