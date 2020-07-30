import nl from './nl.json';
import en from './en.json';

interface ILocale {
  [prop: string]: any;
}

const languages: any = { en, nl };

const targetLanguage: string = process.env.NEXT_PUBLIC_LOCALE || 'nl';
const dictionary = languages[targetLanguage];

export default dictionary;
