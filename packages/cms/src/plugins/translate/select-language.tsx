/* eslint-disable complexity */

import { useValidationStatus } from '@sanity/react-hooks';
import { ValidationMarker } from '@sanity/types';
import { Inline, studioTheme, Tab as TabAlias, TabList, ThemeProvider } from '@sanity/ui';
import React from 'react';
import Flag from 'react-world-flags';
import { SupportedLanguage, SupportedLanguageId } from '../../language/supported-languages';

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

  const validationErrors = extractValidationErrorsPerLanguage(validation.markers, languages);

  return (
    <ThemeProvider theme={studioTheme}>
      <Inline space={[3]}>
        <TabList space={1}>
          {languages.map((lang) => (
            <Tab
              style={{
                border: validationErrors[lang.id] ? '1px solid red' : undefined,
              }}
              key={lang.id}
              icon={<Flag code={lang.id === 'en' ? 'gb' : lang.id} width="24px" height="12px" />}
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

function extractValidationErrorsPerLanguage(markers: ValidationMarker[], languages: SupportedLanguage[]) {
  return languages.reduce<{ en: boolean; nl: boolean }>((errors, lang) => {
    errors[lang.id] = markers.some(checkForLanguage(lang.id));
    return errors;
  }, {} as any) as { en: boolean; nl: boolean };
}

function checkForLanguage(languageId: SupportedLanguageId) {
  return (marker: ValidationMarker) => marker.path[marker.path.length - 1] === languageId;
}
