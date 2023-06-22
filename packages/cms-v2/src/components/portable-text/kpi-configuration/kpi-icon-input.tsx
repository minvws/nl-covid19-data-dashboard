import * as allIcons from '@corona-dashboard/icons';
import { iconName2filename } from '@corona-dashboard/icons';
import { Box, Button, Dialog, Flex, Grid, Radio, Stack, studioTheme, Text, TextInput, ThemeProvider } from '@sanity/ui';
import FormField from 'part:@sanity/components/formfields/default';
import { PatchEvent, set, unset } from 'part:@sanity/form-builder/patch-event';
import React, { forwardRef, useCallback, useState } from 'react';
import { isDefined } from 'ts-is-present';
import { colors } from '@corona-dashboard/common';

const allIconsToFilename: Record<string, string> = iconName2filename;

const filename2IconName = Object.keys(allIconsToFilename).reduce((aggr, key) => {
  aggr[allIconsToFilename[key]] = key;
  return aggr;
}, {} as Record<string, string>);

export type KpiIconKey = keyof typeof allIcons;

export const KpiIconInput = forwardRef((props: any, ref: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = useCallback(() => setIsOpen(false), []);
  const onOpen = useCallback(() => setIsOpen(true), []);
  const [selectedIcon, setSelectedIcon] = useState<string | undefined>(undefined);

  const { value, onChange, compareValue, type, markers } = props;
  const iconName = value?.length ? filename2IconName[value as any] : undefined;

  const KpiIcon = isDefined(iconName) ? (allIcons[iconName as KpiIconKey] as allIcons.Icon) : undefined;

  const iconInfoCollection = Object.entries(allIcons)
    .filter((entry) => entry[0] !== 'iconName2filename')
    // hide empty icons
    .filter((entry) => entry[1]) as [string, allIcons.Icon][];

  const onChangeIcon = (value: string | undefined) => {
    const setValue = isDefined(value) ? set(allIconsToFilename[value]) : unset();
    setSelectedIcon(value);
    onChange(PatchEvent.from(setValue));
    onClose();
  };

  return (
    <FormField markers={markers} label={type.title} description={type.description} compareValue={compareValue}>
      <TextInput value={value ?? ''} ref={ref} style={{ display: 'none' }} />
      <ThemeProvider theme={studioTheme}>
        <Stack space={3}>
          {KpiIcon === undefined ? (
            <Text>Er is geen icoon geselecteerd</Text>
          ) : (
            <Box style={{ width: '50px', height: '50px' }}>
              <KpiIcon width="50px" height="50px" />
            </Box>
          )}
          <Box>
            <Button onClick={onOpen} text="Verander icoon" />
          </Box>
        </Stack>
        {isOpen && (
          <Dialog header="Kies een icoon" id="dialog-example" onClose={onClose} zOffset={1000}>
            <Box padding={4}>
              <Grid columns={[4, 6]} gap={[1, 1, 2, 3]}>
                {iconInfoCollection.map(([id, GridIcon]) => (
                  <Flex key={id} direction="column" align="center" onClick={() => onChangeIcon(id)} title={id}>
                    <GridIcon width="35px" height="35px" color="black" style={{ border: `2px solid ${selectedIcon === id ? colors.green1 : colors.transparent}` }} />
                    <Radio checked={value === allIconsToFilename[id]} readOnly style={{ display: 'none' }} />
                  </Flex>
                ))}

                <Flex direction="column" align="center" onClick={() => onChangeIcon(undefined)}>
                  <span>Geen icoon</span>
                  <Radio checked={value === undefined} readOnly />
                </Flex>
              </Grid>
            </Box>
          </Dialog>
        )}
      </ThemeProvider>
    </FormField>
  );
});
