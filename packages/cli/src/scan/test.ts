import locale from './test.json';

export type Locale = typeof locale;

const siteText: Locale = locale;

function yea() {
  const instance = siteText.key;
}

const instance = siteText.key;
const instance3 = instance.key2;

const instance4 = siteText.key;
const instance5 = siteText.key;
const instance7 = siteText.key4;

export {};
