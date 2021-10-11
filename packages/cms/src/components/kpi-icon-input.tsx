import * as allIcons from '@corona-dashboard/icons';
import { iconName2filename } from '@corona-dashboard/icons';
import {
  Box,
  Button,
  Dialog,
  Flex,
  Grid,
  Radio,
  Stack,
  studioTheme,
  Text,
  ThemeProvider,
} from '@sanity/ui';
import React, { useCallback, useState } from 'react';
import { isDefined } from 'ts-is-present';

const filename2IconName = Object.keys(iconName2filename).reduce((aggr, key) => {
  aggr[iconName2filename[key]] = key;
  return aggr;
}, {} as Record<string, string>);

export type KpiIconKey = keyof typeof allIcons;

interface KpiIconInputProps {
  value?: KpiIconKey;
  onChange: (event: string) => void;
}
export function KpiIconInput(props: KpiIconInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = useCallback(() => setIsOpen(false), []);
  const onOpen = useCallback(() => setIsOpen(true), []);

  const { value, onChange } = props;
  const iconName = value?.length ? filename2IconName[value as any] : undefined;

  const TheIcon = isDefined(iconName)
    ? (allIcons[iconName as KpiIconKey] as allIcons.Icon)
    : undefined;

  const iconInfoCollection = Object.entries(allIcons)
    .filter((entry) => entry[0] !== 'iconName2filename')
    // hide empty icons
    .filter((entry) => entry[1]) as [string, allIcons.Icon][];

  return (
    <ThemeProvider theme={studioTheme}>
      <Stack space={3}>
        {TheIcon === undefined ? (
          <Text>Er is geen icoon geselecteerd</Text>
        ) : (
          <Box style={{ width: '40px', height: '40px', marginBottom: '1rem' }}>
            <TheIcon />
          </Box>
        )}

        <Box>
          <Button onClick={onOpen} text="Verander icoon" />
        </Box>
      </Stack>
      {isOpen && (
        <Dialog
          header="Kies een icoon"
          id="dialog-example"
          onClose={onClose}
          zOffset={1000}
        >
          <Box padding={4}>
            <Grid columns={[4, 6]} gap={[1, 1, 2, 3]}>
              {iconInfoCollection.map(([id, GridIcon]) => (
                <Flex
                  key={id}
                  direction="column"
                  align="center"
                  onClick={() => onChange(iconName2filename[id])}
                  title={id}
                >
                  <GridIcon />
                  <Radio checked={value === iconName2filename[id]} readOnly />
                </Flex>
              ))}

              <Flex
                direction="column"
                align="center"
                onClick={() => onChange('')}
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
