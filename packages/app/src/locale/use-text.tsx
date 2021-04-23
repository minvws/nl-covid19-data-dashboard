import '@reach/combobox/styles.css';
import { MutationEvent } from '@sanity/client';
import css from '@styled-system/css';
import { flatten, unflatten } from 'flat';
import { debounce } from 'lodash';
import set from 'lodash/set';
import { useEffect, useMemo, useRef, useState } from 'react';
import DatabaseIcon from '~/assets/database.svg';
import { client } from '~/lib/sanity';
import { LanguageKey, languages } from '~/locale';
import { LokalizeText } from '~/types/cms';
import { useHotkey } from '~/utils/hotkey/use-hotkey';

export function useLokalizeText(
  locale: LanguageKey,
  { enableHotReload }: { enableHotReload?: boolean }
) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isPathMode, setIsPathMode] = useState(false);

  useHotkey('shift+t', () => setIsPathMode((x) => !x), {
    isDisabled: !(enableHotReload && isEnabled),
    disableTextInputs: true,
  });

  const [text, setText] = useState(languages[locale]);
  const textRef = useRef(text);
  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    if (!(enableHotReload && isEnabled)) {
      setText(languages[locale]);
      return;
    }

    const setTextDebounced = debounce(setText, 500);
    const query = `*[_type == 'lokalizeText']`;

    client.fetch(query).then((documents: LokalizeText[]) => {
      const flattenTexts = createFlattenTexts(documents)[locale];
      setText(() => unflatten(flattenTexts, { object: true }));
    });

    const subscription = client
      .listen(query)
      .subscribe((update: MutationEvent<LokalizeText>) => {
        if (!update.result) return;

        const { key, localeText } = parseLocaleTextDocument(update.result);

        /**
         * We'll mutate text which lives in a reference and update the text
         * state with a debounced handler. Otherwise the app can become quite
         * slow when someone is typing in sanity lokalizeText documents.
         */
        set(textRef.current, key, localeText[locale]);
        setTextDebounced(() => JSON.parse(JSON.stringify(textRef.current)));
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [enableHotReload, isEnabled, locale]);

  const paths = useMemo(
    () =>
      isPathMode
        ? (unflatten(
            Object.keys(flatten(text)).reduce((res, key) => {
              res[key] = key.replace(/\./g, '::');
              return res;
            }, {} as Record<string, string>),
            { object: true }
          ) as typeof text)
        : undefined,
    [isPathMode, text]
  );

  const toggleEl = enableHotReload ? (
    <>
      <div
        onClick={() => setIsEnabled((x) => !x)}
        css={css({
          position: 'fixed',
          bottom: 10,
          right: 30,
          cursor: 'pointer',
          zIndex: 9999,
          borderRadius: 1,
          bg: isEnabled ? 'green' : 'transparent',
          p: 1,
        })}
      >
        <DatabaseIcon
          style={{
            width: 20,
            height: 20,
            display: 'block',
            color: isEnabled ? 'white' : 'gray',
          }}
        />
      </div>
    </>
  ) : null;

  return [paths || text, toggleEl] as const;
}

function createFlattenTexts(documents: LokalizeText[]) {
  const nl: Record<string, string> = {};
  const en: Record<string, string> = {};

  const drafts = documents.filter((x) => x._id.startsWith('drafts.'));
  const published = documents.filter((x) => !x._id.startsWith('drafts.'));

  for (const document of published) {
    const { key, localeText } = parseLocaleTextDocument(document);
    nl[key] = localeText.nl;
    en[key] = localeText.en;
  }

  for (const document of drafts) {
    const { key, localeText } = parseLocaleTextDocument(document);
    nl[key] = localeText.nl;
    en[key] = localeText.en;
  }

  return { nl, en };
}

function parseLocaleTextDocument(document: LokalizeText) {
  /**
   * paths inside the `__root` subject should be placed under the path
   * in the root of the exported json
   */
  const key =
    document.subject === '__root'
      ? document.path
      : `${document.subject}.${document.path}`;

  const nl = document.displayEmpty ? '' : document.text.nl?.trim() || '';
  const en = document.displayEmpty ? '' : document.text.en?.trim() || nl;

  return { key, localeText: { nl, en } };
}
