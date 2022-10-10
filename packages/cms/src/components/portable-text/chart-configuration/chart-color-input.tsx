import { colors } from '@corona-dashboard/common';
import { Box, Button, Dialog, Flex, Grid, Radio, studioTheme, Text, ThemeProvider } from '@sanity/ui';
import FormField from 'part:@sanity/components/formfields/default';
import { PatchEvent, set } from 'part:@sanity/form-builder/patch-event';
import React, { forwardRef, useCallback, useState } from 'react';

export const flatDataColors = Object.keys(colors).reduce<Record<string, string>>((aggr: Record<string, string>, key: string) => {
  const colorValue = colors[key as keyof typeof colors];
  if (typeof colorValue === 'string') {
    aggr[key] = colorValue;
  } else if (typeof colorValue === 'object') {
    Object.keys(colorValue)
      .filter((x) => typeof colorValue[x as keyof typeof colorValue] === 'string')
      .forEach((x) => {
        const compoundKey = `${key}___${x}`;
        aggr[compoundKey] = colorValue[x as keyof typeof colorValue] as string;
      });
  }
  return aggr;
}, {} as Record<string, string>);

export const ChartColorInput = forwardRef((props: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = useCallback(() => setIsOpen(false), []);
  const onOpen = useCallback(() => setIsOpen(true), []);

  const { value, onChange, type, compareValue, markers } = props;
  const colorProperty = value?.length ? value.replaceAll('.', '___') : undefined;

  const onChangeColor = (value: string) => {
    onChange(PatchEvent.from(set(value)));
  };

  return (
    <FormField label={type.title} description={type.description} compareValue={compareValue} markers={markers}>
      <ThemeProvider theme={studioTheme}>
        <Flex style={{ gap: 10, alignItems: 'center' }}>
          {colorProperty === undefined ? (
            <Text size={1}>
              Er is geen kleur
              <br />
              geselecteerd
            </Text>
          ) : (
            <Box
              style={{
                width: '25px',
                height: '25px',
                borderRadius: '4px',
                backgroundColor: flatDataColors[colorProperty],
                border: `1px solid ${colors.gray2}`,
              }}
            ></Box>
          )}
          <Box>
            <Button onClick={onOpen} text="Verander kleur" />
          </Box>
        </Flex>
        {isOpen && (
          <Dialog header="Kies een kleur" id="dialog-example" onClose={onClose} zOffset={1000}>
            <Box padding={4}>
              <Grid columns={[4, 6]} gap={[1, 1, 2, 3]}>
                {Object.entries(flatDataColors).map(([id, color]) => (
                  <Flex key={id} direction="column" align="center" onClick={() => onChangeColor(id.replaceAll('___', '.'))} title={id}>
                    <Box
                      style={{
                        width: '25px',
                        height: '25px',
                        backgroundColor: color,
                        borderRadius: '4px',
                        border: `1px solid ${colors.gray2}`,
                      }}
                    />
                    <Radio checked={colorProperty === id} readOnly />
                  </Flex>
                ))}

                <Flex direction="column" align="center" onClick={() => onChange(undefined)}>
                  <span>Geen kleur</span>
                  <Radio checked={colorProperty === undefined} readOnly />
                </Flex>
              </Grid>
            </Box>
          </Dialog>
        )}
      </ThemeProvider>
    </FormField>
  );
});
