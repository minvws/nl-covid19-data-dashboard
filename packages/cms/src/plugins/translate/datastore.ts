import { intersection } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, publishReplay, refCount, startWith, tap } from 'rxjs/operators';
import { filterField, supportedLanguages } from './config';

const onSelect$ = new BehaviorSubject(['nl']);

export const setLangs = (languages: string[]) => onSelect$.next(languages);

const persistOn = (key: string, defaultValue: any) => (input$: Observable<any>) => {
  let persisted;
  try {
    persisted = JSON.parse(window.localStorage.getItem(key) || '');
  } catch (err) {
    console.error(err);
  } // eslint-disable-line no-empty

  return input$.pipe(
    startWith(persisted || defaultValue),
    tap((value) => {
      window.localStorage.setItem(key, JSON.stringify(value));
    })
  );
};

const SUPPORTED_LANG_IDS = supportedLanguages.map((lang) => lang.id);

export const selectedLanguages$ = onSelect$.pipe(
  map((selectedLangs) => intersection(selectedLangs, SUPPORTED_LANG_IDS)),
  publishReplay(1),
  refCount(),
  persistOn('language-filter/selected-languages', SUPPORTED_LANG_IDS)
);

export const filterFn$ = selectedLanguages$.pipe(
  map((langs) => {
    return (enclosingType: any, field: any) => filterField(enclosingType, field, langs);
  })
);
