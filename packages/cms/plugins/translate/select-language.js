/* eslint-disable complexity */

import React from "react";
import PropTypes from "prop-types";

import {
  studioTheme,
  ThemeProvider,
  Inline,
  Label,
  TabList,
  Tab,
} from "@sanity/ui";
import Flag from "react-world-flags";

const LanguagePropType = PropTypes.shape({
  id: PropTypes.string,
  title: PropTypes.string,
});
export default class SelectLanguage extends React.Component {
  static propTypes = {
    languages: PropTypes.arrayOf(LanguagePropType),
    selected: PropTypes.arrayOf(LanguagePropType),
    onChange: PropTypes.func,
  };

  state = { isOpen: false };
  refElement = React.createRef();

  handleLangCheckboxChange = (event) => {
    const id = event.target.getAttribute("data-lang-id");
    this.props.onChange([id]);
  };

  render() {
    const { isOpen } = this.state;
    const { languages, selected } = this.props;
    const allIsSelected = languages.length === selected.length;
    const refElement =
      this.refElement &&
      this.refElement.current &&
      this.refElement.current._element;

    return (
      <ThemeProvider theme={studioTheme}>
        <Inline space={[3]}>
          <Label size={2}>Select a language:</Label>

          <TabList space={1}>
            {languages.map((lang) => (
              <Tab
                icon={
                  <Flag
                    code={lang.id === "en" ? "gb" : lang.id}
                    width="24"
                    height="12"
                  />
                }
                label={lang.title}
                onClick={() => this.props.onChange([lang.id])}
                selected={selected.includes(lang.id)}
                space={2}
              />
            ))}
          </TabList>
        </Inline>
      </ThemeProvider>
    );
  }
}
