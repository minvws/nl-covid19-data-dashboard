/* eslint-disable complexity */

import { useValidationStatus } from '@sanity/react-hooks';
import { Marker } from '@sanity/types';
import {
  Inline,
  Label,
  studioTheme,
  Tab,
  TabList,
  ThemeProvider,
} from '@sanity/ui';
import React, { useMemo } from 'react';
import { MdErrorOutline } from 'react-icons/md';
import Flag from 'react-world-flags';
import schema from '../../schemas/schema';

/** @TODO move this interface to `supported-languages.js` when it's converted to TS */
interface Language {
  id: string;
  title: string;
  isDefault: boolean;
}

interface SelectLanguageProps {
  languages: Language[];
  /**
   * `selected` should map to the id-property of a Language instance
   * @TODO rename to `value`.
   */
  selected: string;
  onChange: (...args: any[]) => void;
  document: any;
}

export default function SelectLanguage(props: SelectLanguageProps) {
  const { languages, selected, onChange, document } = props;

  const validation = useValidationStatus(document.id, document.type);

  const validationErrors = extractValidationErrorsPerLanguage(
    validation.markers,
    languages
  );

  const hasLocaleFields = useMemo(() => {
    return findLocaleFields(document.id, schema);
  }, [document.id, schema]);

  if (!hasLocaleFields) {
    return null;
  }

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
              /* @ts-expect-error Tab is not properly typed and can receive Button props (eg space) */
              space={2}
            />
          ))}
        </TabList>
      </Inline>
    </ThemeProvider>
  );
}

function extractValidationErrorsPerLanguage(
  markers: Marker[],
  languages: Language[]
) {
  return languages.reduce((aggr, lang) => {
    aggr[lang.id] = markers.some(checkForLanguage(lang.id));
    return aggr;
  }, {} as Record<string, boolean>);
}

function checkForLanguage(languageId: string) {
  return (marker: Marker) =>
    marker.path.length === 2 && marker.path[1] === languageId;
}

/* @TODO type schema to be type of imported schema */
function findLocaleFields(documentId: string, schema: any) {
  const docSchema = schema._original.types.find(
    (doc: any) => doc.name === documentId
  );
  if (!docSchema) {
    return true;
  }
  return docSchema.fields.some((field: { type: string }) =>
    field.type.startsWith('locale')
  );
}
