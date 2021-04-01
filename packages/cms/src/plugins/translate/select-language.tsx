/* eslint-disable complexity */

import { useValidationStatus } from '@sanity/react-hooks';
import { ValidationMarker } from '@sanity/types';
import {
  Inline,
  Label,
  studioTheme,
  Tab as TabAlias,
  TabList,
  ThemeProvider,
} from '@sanity/ui';
import React from 'react';
import { MdErrorOutline } from 'react-icons/md';
import Flag from 'react-world-flags';
import {
  SupportedLanguage,
  SupportedLanguageId,
} from '../../language/supported-languages';

const Tab: any = TabAlias;

type SelectLanguageProps = {
  languages: SupportedLanguage[];
  selected: string[];
  onChange: (selected: string[]) => void;
  document: any;
};

export default function SelectLanguage(props: SelectLanguageProps) {
  const { languages, selected, onChange, document } = props;

  const validation = useValidationStatus(document.id, document.type);

  const validationErrors = extractValidationErrorsPerLanguage(
    validation.markers,
    languages
  );

  return (
    <ThemeProvider theme={studioTheme}>
      <Inline space={[3]}>
        <Label size={2}>Kies een taal:</Label>

        <TabList space={1}>
          {languages.map((lang) => (
            <Tab
              style={{
                border: validationErrors[lang.id] ? '1px solid red' : undefined,
              }}
              key={lang.id}
              icon={
                <>
                  <Flag
                    code={lang.id === 'en' ? 'gb' : lang.id}
                    width="24"
                    height="12"
                  />
                  {validationErrors[lang.id] ? (
                    <MdErrorOutline
                      color={validationErrors[lang.id] ? 'red' : undefined}
                    />
                  ) : null}
                </>
              }
              label={lang.title}
              onClick={() => onChange([lang.id])}
              selected={selected.includes(lang.id)}
              padding={2}
            />
          ))}
        </TabList>
      </Inline>
    </ThemeProvider>
  );
}

function extractValidationErrorsPerLanguage(
  markers: ValidationMarker[],
  languages: SupportedLanguage[]
) {
  return languages.reduce<{ en: boolean; nl: boolean }>((errors, lang) => {
    errors[lang.id] = markers.some(checkForLanguage(lang.id));
    return errors;
  }, {} as any) as { en: boolean; nl: boolean };
}

function checkForLanguage(languageId: SupportedLanguageId) {
  return (marker: ValidationMarker) =>
    marker.path[marker.path.length - 1] === languageId;
}
