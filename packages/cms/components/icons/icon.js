import React from "react";
import PropTypes from "prop-types";

import { Grid, Flex, Radio, studioTheme, ThemeProvider } from "@sanity/ui";

import PatchEvent, { set, unset } from "part:@sanity/form-builder/patch-event";

import { restrictionIcons } from "./icons";

const createPatchFrom = (value) =>
  PatchEvent.from(value === "" ? unset() : set(String(value)));

export default class Icon extends React.Component {
  static propTypes = {
    type: PropTypes.shape({
      title: PropTypes.string,
    }).isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  };

  // this is called by the form builder whenever this input should receive focus
  focus() {
    this._inputElement.focus();
  }

  render() {
    const { type, value, onChange } = this.props;

    // hide empty icons
    var allIcons = Object.entries(restrictionIcons).filter((entry) => entry[1]);

    return (
      <ThemeProvider theme={studioTheme}>
        <div>{type.title}</div>

        <Grid columns={[4, 6]} gap={[1, 1, 2, 3]}>
          {allIcons.map((icon) => {
            return (
              <Flex
                key={icon[0]}
                direction="column"
                align="center"
                onClick={(event) => onChange(createPatchFrom(icon[0]))}
              >
                <img src={icon[1]} width="36" height="36" />
                <Radio checked={value === icon[0]} readOnly />
              </Flex>
            );
          })}

          <Flex
            direction="column"
            align="center"
            onClick={(event) => onChange(createPatchFrom(""))}
          >
            <span>Geen icoon</span>
            <Radio checked={value === undefined} readOnly />
          </Flex>
        </Grid>
      </ThemeProvider>
    );
  }
}
