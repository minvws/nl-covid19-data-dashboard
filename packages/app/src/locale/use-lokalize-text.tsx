import { createFlatTexts } from '@corona-dashboard/common';
import '@reach/combobox/styles.css';
import { MutationEvent, SanityDocument } from '@sanity/client';
import css from '@styled-system/css';
import { flatten, unflatten } from 'flat';
import { debounce } from 'lodash';
import set from 'lodash/set';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { Subscription } from 'rxjs';
import styled from 'styled-components';
import DatabaseIcon from '~/assets/database.svg';
import { Box } from '~/components/base';
import { VisuallyHidden } from '~/components/visually-hidden';
import { getClient } from '~/lib/sanity';
import { LanguageKey, languages, SiteText } from '~/locale';
import { LokalizeText } from '~/types/cms';

const datasets = ['development', 'production', 'keys'] as const;
export type Dataset = typeof datasets[number];

const query = `*[_type == 'lokalizeText']`;
const enableHotReload = process.env.NEXT_PUBLIC_PHASE === 'develop';

/**
 * This hook will return an object which contains all lokalize translations.
 *
 * Additionally, with a configured environment variable it can also connect with
 *  Sanity to receive real-time updates of (draft) lokalize keys.
 *
 * If enabled, a button will be rendered at the bottom-right which is only
 * visible on hover.
 */
export function useLokalizeText(initialLocale: LanguageKey) {
  const [isActive, setIsActive] = useState(false);
  const [locale, setLocale] = useState(initialLocale);
  const [text, setText] = useState<SiteText>(languages[locale]);
  const lokalizeTextsRef = useRef<SanityDocument<LokalizeText>[]>([]);

  const [dataset, setDataset] = useState<typeof datasets[number]>(
    process.env.NEXT_PUBLIC_SANITY_DATASET as 'development'
  );

  const toggleButton = enableHotReload ? (
    <ToggleButton isActive={isActive} onClick={() => setIsActive((x) => !x)}>
      <Toggle values={[...datasets]} onToggle={setDataset} value={dataset} />
      <Toggle
        values={Object.keys(languages) as LanguageKey[]}
        onToggle={setLocale}
        value={locale}
      />
    </ToggleButton>
  ) : null;

  useEffect(() => {
    let isCancelled = false;
    let subscription: Subscription | undefined;

    function updateSiteText() {
      if (isCancelled) return;
      const flatTexts = createFlatTexts(lokalizeTextsRef.current);
      setText(() => unflatten(flatTexts[locale], { object: true }));
    }

    const updateSiteTextDebounced = debounce(updateSiteText, 1000, {
      trailing: true,
    });

    if (!isActive) {
      setText(languages[initialLocale]);
    }

    if (isActive) {
      if (dataset === 'keys') {
        return setText(mapSiteTextValuesToKeys(languages[locale]));
      }

      getClient(dataset).then(async (client) => {
        const texts: SanityDocument<LokalizeText>[] = await client.fetch(query);
        lokalizeTextsRef.current = texts;

        updateSiteText();

        subscription = client
          .listen(query)
          .subscribe((update: MutationEvent<LokalizeText>) => {
            /**
             * `appear`-transition is emitted for newly created documents/drafts
             */
            if (update.transition === 'appear' && update.result) {
              lokalizeTextsRef.current.push(update.result);
              updateSiteTextDebounced();
            }

            /**
             * `update`-transition is emitted for updated documents/drafts
             */
            if (update.transition === 'update' && update.result) {
              const index = lokalizeTextsRef.current.findIndex(
                (x) => x._id === update.documentId
              );

              if (index > -1) {
                lokalizeTextsRef.current[index] = update.result;
                updateSiteTextDebounced();
              }
            }

            /**
             * `disappear`-transition is emitted for deleted documents/drafts
             */
            if (update.transition === 'disappear') {
              const index = lokalizeTextsRef.current.findIndex(
                (x) => x._id === update.documentId
              );
              if (index > -1) {
                lokalizeTextsRef.current.splice(index, 1);
                updateSiteTextDebounced();
              }
            }
          });
      });

      return () => {
        isCancelled = true;
        subscription?.unsubscribe();
      };
    }
  }, [initialLocale, dataset, isActive, locale]);

  return [text, toggleButton, dataset] as const;
}

/**
 * replace values with their paths, eg:
 *
 * input:
 *     { foo: { bar: 1, baz: 2 }}
 *
 * output:
 *     { foo: { bar: 'foo.bar', baz: 'foo.baz' }}
 */
function mapSiteTextValuesToKeys(siteText: SiteText) {
  const keys = Object.keys(flatten(siteText));

  const obj = keys.reduce(
    (result, key) => set(result, key, key),
    {} as Record<string, string>
  );

  return unflatten(obj, { object: true }) as SiteText;
}

interface ToggleProps<T extends string> {
  values: T[];
  value: T;
  onToggle: (value: T) => void;
}

function Toggle<T extends string>({ values, value, onToggle }: ToggleProps<T>) {
  return (
    <Box
      border="1px solid"
      borderColor="silver"
      mx={2}
      borderRadius={1}
      overflow="hidden"
    >
      {values.map((x, i) => (
        <label
          key={x}
          css={css({
            px: 2,
            borderRight: values[i + 1] ? '1px solid' : undefined,
            borderColor: 'silver',
            display: 'inline-block',
            bg: x === value ? 'blue' : 'white',
            color: x === value ? 'white' : 'inherit',
            cursor: x === value ? 'default' : 'pointer',
            transition: 'background 100ms linear',
            '&:hover': { bg: x === value ? 'blue' : 'tileGray' },
          })}
        >
          <VisuallyHidden>
            <input
              type="radio"
              checked={x === value}
              onChange={() => onToggle(x)}
            />
          </VisuallyHidden>
          {x}
        </label>
      ))}
    </Box>
  );
}

function ToggleButton({
  isActive,
  onClick,
  color,
  children,
}: {
  isActive: boolean;
  onClick: () => void;
  children: ReactNode;
  color?: 'green' | 'blue';
}) {
  return (
    <Container isActive={isActive}>
      <DisplayOnHover>{isActive && children}</DisplayOnHover>
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

const DisplayOnHover = styled.div(
  css({
    opacity: 0,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    transition: 'opacity 100ms linear',
  })
);

const Container = styled.div<{ isActive: boolean }>((x) =>
  css({
    opacity: x.isActive ? 1 : 0,
    '&:hover': {
      opacity: 1,
      [DisplayOnHover]: { opacity: 1 },
    },
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
      bg: x.isActive ? 'blue' : 'transparent',
      transition: 'all 100ms linear',
      p: 1,
      display: 'inline-block',
    })
);
