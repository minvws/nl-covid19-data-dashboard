import localefile from './APP_TARGET.json';

export type TLocale = typeof localefile;
export const targetLanguage = process.env.NEXT_PUBLIC_LOCALE || 'nl';

const dictionary: TLocale = localefile;
console.log(dictionary);

export default dictionary;
