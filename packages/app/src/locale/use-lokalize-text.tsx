import {
  createFlattenTexts,
  parseLocaleTextDocument,
} from '@corona-dashboard/common';
import '@reach/combobox/styles.css';
import { MutationEvent } from '@sanity/client';
import css from '@styled-system/css';
import { flatten, unflatten } from 'flat';
import { debounce } from 'lodash';
import set from 'lodash/set';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Subscription } from 'rxjs';
import styled from 'styled-components';
import { isDefined } from 'ts-is-present';
import DatabaseIcon from '~/assets/database.svg';
import { getClient } from '~/lib/sanity';
import { LanguageKey, languages } from '~/locale';
import { LokalizeText } from '~/types/cms';
import { useHotkey } from '~/utils/hotkey/use-hotkey';
import { useIsMountedRef } from '~/utils/use-is-mounted-ref';

export function useLokalizeText(
  locale: LanguageKey,
  { enableHotReload }: { enableHotReload?: boolean }
) {
  const isMountedRef = useIsMountedRef();
  const [displayMode, setDisplayMode] = useState<'path' | 'live'>();

  useHotkey(
    'shift+t',
    () => setDisplayMode((x) => (x === 'path' ? 'live' : 'path')),
    {
      isDisabled: !(enableHotReload && isDefined(displayMode)),
      disableTextInputs: true,
    }
  );

  const [text, setText] = useState(languages[locale]);
  const textRef = useRef(text);
  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    if (!enableHotReload || !isDefined(displayMode)) {
      setText(languages[locale]);
      return;
    }

    const setTextDebounced = debounce(setText, 500);
    const query = `*[_type == 'lokalizeText']`;

    getClient()
      .then((client) => client.fetch(query))
      .then((documents: LokalizeText[]) => {
        const flattenTexts = createFlattenTexts(documents)[locale];
        setText(() => unflatten(flattenTexts, { object: true }));
      })
      .catch((err) => console.error(err));

    let subscription: Subscription | undefined;

    getClient().then(
      (client) =>
        (subscription = client
          .listen(query)
          .subscribe((update: MutationEvent<LokalizeText>) => {
            if (!isMountedRef.current) return;

            /**
             * we currently only handle "updates" to existing (draft) documents.
             * This means for example that the "discard changes" action is not
             * handled.
             */
            if (!update.result) return;

            const { key, localeText } = parseLocaleTextDocument(update.result);

            /**
             * We'll mutate text which lives in a reference and update the text
             * state with a debounced handler. Otherwise the app can become quite
             * slow when someone is typing in sanity lokalizeText documents.
             */
            set(textRef.current, key, localeText[locale]);
            setTextDebounced(() => JSON.parse(JSON.stringify(textRef.current)));
          }))
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [enableHotReload, displayMode, locale, isMountedRef]);

  const paths = useMemo(
    () =>
      displayMode === 'path'
        ? /**
           * Here we map all locale text object values to their "path"
           */
          (unflatten(
            Object.keys(flatten(text)).reduce((res, key) => {
              res[key] = key.replace(/\./g, '::');
              return res;
            }, {} as Record<string, string>),
            { object: true }
          ) as typeof text)
        : undefined,
    [displayMode, text]
  );

  const toggleEl = enableHotReload ? (
    <ToggleButton
      isActive={isDefined(displayMode)}
      onClick={() =>
        setDisplayMode((x) => (!x ? 'live' : x === 'live' ? 'path' : undefined))
      }
      color={displayMode === 'live' ? 'green' : 'blue'}
    />
  ) : null;

  return [paths || text, toggleEl] as const;
}

function ToggleButton({
  isActive,
  onClick,
  color,
}: {
  isActive: boolean;
  onClick: () => void;
  color?: 'green' | 'blue';
}) {
  return (
    <Container isActive={isActive}>
      <StyledToggleButton isActive={isActive} color={color} onClick={onClick}>
        <DatabaseIcon
          style={{
            width: 20,
            height: 20,
            display: 'block',
          }}
        />
      </StyledToggleButton>
    </Container>
  );
}

const Container = styled.div<{ isActive: boolean }>((x) =>
  css({
    opacity: x.isActive ? 1 : 0,
    '&:hover': { opacity: 1 },
    transition: 'opacity 100ms linear',
    position: 'fixed',
    bottom: 0,
    right: 0,
    p: 3,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    zIndex: 9999,
  })
);
const StyledToggleButton = styled.div<{ isActive: boolean; color?: string }>(
  (x) =>
    css({
      cursor: 'pointer',
      borderRadius: 1,
      color: x.isActive ? 'white' : 'black',
      bg: x.isActive ? x.color : 'transparent',
      transition: 'all 100ms linear',
      p: 1,
      display: 'inline-block',
    })
);
