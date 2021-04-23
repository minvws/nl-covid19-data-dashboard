import {
  createFlatTexts,
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

/**
 * This hook will return an object which contains all lokalize translations.
 *
 * Additionally, with `enableHotReload: true` it can also connect with Sanity
 * to receive real-time (hot) updates of draft translations.
 *
 * If enabled a tiny button will be rendered at the bottom-right which is only
 * visible on hover.
 *
 * This button cycles through three states:
 *
 * - undefined (gray): app is rendered with translations from filesystem
 * - live (green): app is listening to real-time sanity updates
 * - paths (blue): app is displaying the pathnames of every key instead of the value
 *
 * The live/paths state can also be toggled with shortkey shift+t.
 */
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

    const setTextDebounced = debounce(setText, 1000, { trailing: true });
    const query = `*[_type == 'lokalizeText']`;

    let subscription: Subscription | undefined;

    getClient()
      .then(async (client) => {
        const documents = await client.fetch(query);
        if (!isMountedRef.current) return;

        const flatTexts = createFlatTexts(documents)[locale];

        setText(() => unflatten(flatTexts, { object: true }));

        subscription = client
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
          });
      })
      .catch((err) => console.error(err));

    return () => {
      subscription?.unsubscribe();
    };
  }, [enableHotReload, displayMode, locale, isMountedRef]);

  const paths = useMemo(() => {
    if (displayMode === 'path') {
      const keys = Object.keys(flatten(text));

      const obj = keys.reduce(
        (result, key) => set(result, key, key.replace(/\./g, '::')),
        {} as Record<string, string>
      );

      return unflatten(obj, { object: true }) as typeof text;
    }
  }, [displayMode, text]);

  const toggleButton = enableHotReload ? (
    <ToggleButton
      isActive={isDefined(displayMode)}
      onClick={() =>
        setDisplayMode((x) => (!x ? 'live' : x === 'live' ? 'path' : undefined))
      }
      color={displayMode === 'live' ? 'green' : 'blue'}
    />
  ) : null;

  return [paths || text, toggleButton] as const;
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
