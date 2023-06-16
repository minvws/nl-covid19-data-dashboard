import { colors } from '@corona-dashboard/common';
import * as allIcons from '@corona-dashboard/icons';
import { iconName2filename } from '@corona-dashboard/icons';
import { Box, Button, Dialog, Flex, Grid, Radio, Stack, Text, TextInput } from '@sanity/ui';
import { useState } from 'react';
import { PatchEvent, StringInputProps, set, unset } from 'sanity';

const allIconsToFilename: Record<string, string> = iconName2filename;

const filename2IconName = Object.keys(allIconsToFilename).reduce((aggr, key) => {
  aggr[allIconsToFilename[key]] = key;
  return aggr;
}, {} as Record<string, string>);

export type IconKey = keyof typeof allIcons;

export const IconInput = (props: StringInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | undefined>(undefined);

  const { value = '', onChange } = props;
  const iconName = value?.length ? filename2IconName[value as any] : undefined;

  const Icon = !!iconName ? (allIcons[iconName as IconKey] as allIcons.Icon) : undefined;

  const iconInfoCollection = Object.entries(allIcons)
    .filter((entry) => entry[0] !== 'iconName2filename')
    .filter((entry) => entry[1]) as [string, allIcons.Icon][];

  const onChangeIcon = (value: string | undefined) => {
    const setValue = !!value ? set(allIconsToFilename[value]) : unset();
    setSelectedIcon(value);
    onChange(PatchEvent.from(setValue));
    setIsOpen(false);
  };

  return (
    <>
      <Stack space={3}>
        <Box display="none">
          <TextInput value={value} readOnly />
        </Box>

        {Icon === undefined ? <Text size={1}>Er is nog geen icoon geselecteerd.</Text> : <Icon width="50px" height="50px" />}

        <Box>
          <Button padding={3} tone="primary" text="Verander icoon" onClick={() => setIsOpen(true)} style={{ cursor: 'pointer' }} />
        </Box>
      </Stack>

      {isOpen && (
        <Dialog header="Kies een icoon" id="icon-dialog" onClose={() => setIsOpen(false)}>
          <Box padding={4}>
            <Grid columns={6} gap={2}>
              {iconInfoCollection.map(([id, Icon]) => (
                <Flex key={id} direction="column" align="center" onClick={() => onChangeIcon(id)} title={id} style={{ cursor: 'pointer' }}>
                  <Icon key={id} width="48px" style={{ border: selectedIcon === id ? `2px solid ${colors.blue3}` : undefined }} />
                  <Radio checked={value === allIconsToFilename[id]} readOnly style={{ display: 'none' }} />
                </Flex>
              ))}

              <Flex direction="column" align="center" justify="center" onClick={() => onChangeIcon(undefined)} style={{ cursor: 'pointer' }}>
                <span>Geen icoon</span>
              </Flex>
            </Grid>
          </Box>
        </Dialog>
      )}
    </>
  );
};
