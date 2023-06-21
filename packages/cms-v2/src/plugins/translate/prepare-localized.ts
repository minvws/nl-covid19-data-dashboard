import { selectedLanguages$ } from './datastore';

let selectedLanguage = 'nl';
selectedLanguages$.subscribe((selected: any[]) => {
  selectedLanguage = selected.length ? selected[0] : 'nl';
});

export function prepareLocalized(selection: any) {
  const result: any = {};
  for (const prop in selection) {
    const value = selection[prop];
    if (isLocaleObject(value)) {
      if (isLocaleBlock(value)) {
        result[prop] = localeBlockToString(value, selectedLanguage);
      } else {
        result[prop] = value[selectedLanguage];
      }
    } else {
      result[prop] = value;
    }
  }
  return result;
}

function isLocaleObject(obj: any) {
  return typeof obj === 'object' && obj._type?.startsWith('locale');
}

function isLocaleBlock(obj: any) {
  return obj._type === 'localeBlock';
}

function localeBlockToString(block: any, lang: string) {
  return block[lang][0]?.children[0]?.text;
}
