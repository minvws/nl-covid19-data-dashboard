import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";

import {
  Grid,
  Flex,
  Radio,
  studioTheme,
  ThemeProvider,
  Heading,
  Dialog,
  Box,
  Text,
  Button,
  Stack,
} from "@sanity/ui";

import PatchEvent, { set, unset } from "part:@sanity/form-builder/patch-event";

import { restrictionIcons } from "./icons";

const createPatchFrom = (value) =>
  PatchEvent.from(value === "" ? unset() : set(String(value)));

export default function Icon(props) {
  const [open, setOpen] = useState(false);
  const onClose = useCallback(() => setOpen(false), []);
  const onOpen = useCallback(() => setOpen(true), []);

  const { type, value, onChange } = props;

  // hide empty icons
  var allIcons = Object.entries(restrictionIcons).filter((entry) => entry[1]);

  return (
    <ThemeProvider theme={studioTheme}>
      <Stack space="3">
        <Heading as="div" size={0}>
          {type.title}
        </Heading>
        {value === undefined && <Text>No icon selected</Text>}
        {value !== undefined && (
          <Box>
            <img src={restrictionIcons[value]} width="36" height="36" />
          </Box>
        )}

        <Box>
          <Button onClick={onOpen} text="Change icon" tone="brand" />
        </Box>
      </Stack>
      {open && (
        <Dialog
          header="Example"
          id="dialog-example"
          onClose={onClose}
          zOffset={1000}
        >
          <Box padding={4}>
            <Text>Verander icoon</Text>
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
          </Box>
        </Dialog>
      )}
    </ThemeProvider>
  );
}

Icon.propTypes = {
  type: PropTypes.shape({
    title: PropTypes.string,
  }).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
