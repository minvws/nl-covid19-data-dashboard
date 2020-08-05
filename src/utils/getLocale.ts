export default function getLocale(): string {
  return process.env.NEXT_PUBLIC_LOCALE || 'nl';
}
