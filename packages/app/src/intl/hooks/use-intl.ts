import { isSameDay, isToday, isYesterday, subDays } from 'date-fns';
import { useContext, useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { AllLanguages } from '~/locale';
import { assert } from '~/utils/assert';
import { IntlContext } from '..';

// TypeScript is missing some types for `Intl.DateTimeFormat`.
// https://github.com/microsoft/TypeScript/issues/35865
interface DateTimeFormatOptions extends Intl.DateTimeFormatOptions {
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
}

type formatStyle =
  | 'time'
  | 'long'
  | 'medium'
  | 'iso'
  | 'axis'
  | 'axis-with-year'
  | 'weekday-medium'
  | 'day-month';

// Adding the Europe/Amsterdam time zone manually since its the only being used.
// The data was pulled from the @formatjs/add-golden-ts.js file.
if ('DateTimeFormat' in Intl && (Intl.DateTimeFormat as any).__addTZData) {
  const EATimeZone =
    'Europe/Amsterdam|,0,248,0|-1ygf4wk,33,248,0|-s0dvkk,71,249,1|-rsimck,33,248,0|-ridkok,71,249,1|-rage0k,33,248,0|-r0dfck,71,249,1|-qr0e0k,33,248,0|-qhae0k,71,249,1|-q8abck,33,248,0|-pykbck,71,249,1|-ppk8ok,33,248,0|-pfu8ok,71,249,1|-p6u60k,33,248,0|-oxizck,71,249,1|-ong0ok,33,248,0|-obazck,71,249,1|-o4py0k,33,248,0|-nvpvck,71,249,1|-nlzvck,33,248,0|-n9hvck,71,249,1|-n39sok,33,248,0|-mrsu0k,71,249,1|-mkjq0k,33,248,0|-m90wok,71,249,1|-m1tnck,33,248,0|-lq74ok,71,249,1|-liqm0k,33,248,0|-l7f7ck,71,249,1|-l00jck,33,248,0|-kona0k,71,249,1|-khagok,33,248,0|-k5vcok,71,249,1|-jyke0k,33,248,0|-jmom0k,71,249,1|-jfubck,33,248,0|-j49nck,71,249,1|-iwra0k,33,248,0|-ilhq0k,71,249,1|-ie17ck,33,248,0|-i2psok,71,249,1|-hvb4ok,33,248,0|-hjw0ok,71,249,1|-hcl20k,33,248,0|-h0r4ok,71,249,1|-gypack,129,250,1|-gtuzdc,2,3,0|-gic61c,129,250,1|-gb4wpc,2,3,0|-fzk8pc,129,250,1|-fs1vdc,2,3,0|-fgorlc,7,7,1|-e6dzw0,6,6,0|-dytrw0,7,7,1|-dp3rw0,6,6,0|-dfqqk0,7,7,1|-d6dp80,6,6,0|-cx0nw0,7,7,1|-cofek0,6,6,0|3s9ms0,7,7,1|419pg0,6,6,0|4azpg0,7,7,1|4kcqs0,6,6,0|4tps40,7,7,1|532tg0,6,6,0|5cstg0,7,7,1|5lsw40,6,6,0|5v5xg0,7,7,1|64iys0,6,6,0|6dw040,7,7,1|6n91g0,6,6,0|6wm2s0,7,7,1|75z440,6,6,0|7fc5g0,7,7,1|7p25g0,6,6,0|7yf6s0,7,7,1|87s840,6,6,0|8h59g0,7,7,1|8qias0,6,6,0|8zvc40,7,7,1|998dg0,6,6,0|9iles0,7,7,1|9ryg40,6,6,0|a1bhg0,7,7,1|aaois0,6,6,0|ak1k40,7,7,1|atrk40,6,6,0|b34lg0,7,7,1|bchms0,6,6,0|bluo40,7,7,1|bv7pg0,6,6,0|c4kqs0,7,7,1|cdxs40,6,6,0|cnatg0,7,7,1|cwnus0,6,6,0|d60w40,7,7,1|dfdxg0,6,6,0|dp3xg0,7,7,1|dzwtg0,6,6,0|e7u040,7,7,1|eimw40,6,6,0|eqk2s0,7,7,1|f1cys0,6,6,0|f9a5g0,7,7,1|fkg040,6,6,0|fs0840,7,7,1|g362s0,6,6,0|gaqas0,7,7,1|glw5g0,6,6,0|gttc40,7,7,1|h4m840,6,6,0|hcjes0,7,7,1|hncas0,6,6,0|hv9hg0,7,7,1|i6fc40,6,6,0|idzk40,7,7,1|ip5es0,6,6,0|iwpms0,7,7,1|j7vhg0,6,6,0|jffpg0,7,7,1|jqlk40,6,6,0|jyiqs0,7,7,1|k9bms0,6,6,0|kh8tg0,7,7,1|ks1pg0,6,6,0|kzyw40,7,7,1|lb4qs0,6,6,0|lioys0,7,7,1|ltutg0,6,6,0|m1f1g0,7,7,1|mckw40,6,6,0|mki2s0,7,7,1|mvays0,6,6,0|n385g0,7,7,1|ne11g0,6,6,0|nly840,7,7,1|nwr440,6,6,0|o4oas0,7,7,1|ofu5g0,6,6,0|onedg0,7,7,1|oyk840,6,6,0|p64g40,7,7,1|phaas0,6,6,0|pp7hg0,7,7,1|q00dg0,6,6,0|q7xk40,7,7,1|qiqg40,6,6,0|qqnms0,7,7,1|r1thg0,6,6,0|r9dpg0,7,7,1|rkjk40,6,6,0|rs3s40,7,7,1|s39ms0,6,6,0|sb6tg0,7,7,1|slzpg0,6,6,0|stww40,7,7,1|t4ps40,6,6,0|tcmys0,7,7,1|tnfus0,6,6,0|tvd1g0,7,7,1|u6iw40,6,6,0|ue3440,7,7,1|up8ys0,6,6,0|uwt6s0,7,7,1|v7z1g0,6,6,0|vfw840,7,7,1|vqp440,6,6,0|vymas0,7,7,1|w9f6s0,6,6,0|whcdg0,7,7,1|wsi840,6,6,0|x02g40,7,7,1|xb8as0,6,6,0|xisis0,7,7,1|xtydg0,6,6,0|y1ilg0,7,7,1|ycog40,6,6,0|yklms0,7,7,1|yveis0,6,6,0|z3bpg0,7,7,1|ze4lg0,6,6,0';
  (Intl.DateTimeFormat as any).__addTZData({
    zones: [EATimeZone],
    abbrvs:
      'LMT|GMT|+0020|PMT|WET|WEST|CET|CEST|-01|EET|EEST|+00|+01|SAST|CAT|CAST|EAT|WAT|MMT|+0230|+0245|WAST|+0130|AST|AWT|APT|AHST|AHDT|YST|AKST|AKDT|-03|-02|AMT|-04|MST|CST|PST|MDT|CDT|BMT|ADT|-0530|-05|PDT|MWT|MPT|EST|EDT|CMT|-0430|CWT|CPT|SJMT|PWT|PPT|EWT|EPT|QMT|-0345|HMT|KMT|YDT|BST|FFMT|-0330|-0230|-0130|PPMT|SMT|SDMT|NST|NDT|NWT|NPT|NDDT|YWT|YPT|YDDT|-00|MDDT|+05|+06|+07|+12|+13|+14|+11|+04|+03|+0730|+08|+09|+10|+0530|+0630|IST|IDT|PLMT|HKT|HKST|HKWT|JST|IMT|+0720|WIB|+0930|WIT|JMT|IDDT|+0430|PKT|PKST|+0545|+0820|WITA|KST|KDT|TBMT|TMT|+0330|JDT|FMT|ACST|ACDT|AEST|AEDT|AWST|AWDT|+0120|CEMT|MSK|MSD|DMT|BDST|WEMT|MDST|RMT|LST|SET|WMT|+0220|-1130|-11|-10|NZMT|NZST|NZDT|PMMT|-06|GST|GDT|ChST|HST|HDT|HWT|HPT|-12|+1112|+1130|+1230|-1030|-0930|+1220',
    offsets:
      '-qw|0|-1g|xc|kc|fl|2s0|5k0|-2vw|-2s0|5sl|8c0|-1ek|-zg|-2g0|56o|460|60w|mo|618|-1zw|-226|6tg|6y0|7n0|2sc|2fw|1vw|360|12wo|-rrc|-rs0|-p00|-m80|-8xc|-8c0|-5k0|-aog|-b40|-74s|-jho|-jg0|-go0|-dw0|-b1h|-8z8|-gc0|-fa0|-dps|-lip|-a44|-g2g|-ce8|-ce4|-ci0|-9ow|-eq8|-eso|-g8c|-jn8|-fkd|-adw|-crn|-m9k|-jfw|-fdn|-l0g|-cxs|-gio|-74o|-b3o|-grg|-es8|-ejc|-ars|-af0|-bs0|-f94|-f9c|-kjs|-e7y|15rv|-ow5|-cmc|-9uc|-e9o|-eac|-lwa|-6m4|-fz8|-fzc|-b44|-bb8|-iio|-jpg|-glg|-id0|-bzw|-iks|-aer|-9q0|-6y0|-460|-ebu|-dpe|-jc4|-a7s|-a84|-a7o|-kr6|-de8|-ddo|-be4|-bu0|-c8p|-6go|-jdo|-ck0|-a4o|-d3a|-cy0|-cyo|-8ms|-9rg|-6zg|-jyw|-g5g|-gj0|-lo4|-ep8|-mss|-p0c|-hzo|e90|dw0|go0|jg0|6nk|wv8|xc0|1040|12w0|uk0|9b4|b40|al4|at8|884|880|98c|im4|6ko|dtc|la4|ku0|m80|l0g|p00|rs0|l7c|esc|esk|fa0|i20|6q0|gqs|gcw|n98|a8o|cqo|6ds|6hz|jr4|jqu|l56|nm0|gz0|jb5|js0|kdc|q20|qe0|6iu|6ig|ctc|ci0|tdo|cf0|fss|fz0|gd4|eva|h72|ity|j8d|kfk|n5c|l0y|rxc|m40|-189c|meo|66g|g5c|fcs|dl6|9ic|k8w|nac|9jk|c4g|8ng|qfc|ceh|nig|mhj|mi0|ctz|8an|9iw|9q0|glo|pvn|fqf|jsk|g7w|of7|o0y|b89|af5|88o|-4r4|-5aw|-c06|-2uo|-4cs|-194|-34o|-42o|pnw|t60|sc8|q70|o88|ra4|qug|lgc|s04|wk|3ok|3pc|a4|4e4|3so|2h4|t6|4u0|3j8|5c8|5bo|2bw|-15o|-169|1lr|-zo|4md|5d4|5ew|5ng|97c|-1p9|-23|150|-ok|2os|53s|53c|1d8|6yh|707|9s7|ck7|1zo|2o8|4gy|78y|2b8|99w|6bc|6ao|4bg|3cc|2se|4l0|3o8|44o|30x|4os|3w0|4fc|6hc|1kw|1dm|a9o|dm0|anc|a9s|yv4|-vsw|-vy0|-uk0|wd4|vy0|yq0|st4|r8w|-12k4|s3w|v64|x4w|-glc|tmc|-13v0|qt0|-t8e|-t60|-qe0|uzk|-xc0|vpc|v3s|v40|uto|-15rg|owk|-11d8|tas|r94|-tl4|-rp4|w1g|y88|y9c|uus',
  });
}

// See https://formatjs.io/docs/polyfills/intl-datetimeformat/#default-timezone for details
if ('__setDefaultTimeZone' in Intl.DateTimeFormat) {
  (Intl.DateTimeFormat as any).__setDefaultTimeZone('Europe/Amsterdam');
}

// Helper functions

function isDayBeforeYesterday(date: Date) {
  return isSameDay(date, subDays(Date.now(), 2));
}

type DateDefinition = Date | { seconds: number } | { milliseconds: number };

/**
 * Utility to create a Date from seconds or milliseconds
 * eg:
 *
 *     getDate({      seconds: 1616066567 })
 *     getDate({ milliseconds: 1616066567880 })
 */
function parseDateDefinition(dateDefinition: DateDefinition) {
  if (dateDefinition instanceof Date) {
    return dateDefinition;
  }

  if ('seconds' in dateDefinition && isDefined(dateDefinition.seconds)) {
    return new Date(dateDefinition.seconds * 1000);
  }

  if (
    'milliseconds' in dateDefinition &&
    isDefined(dateDefinition.milliseconds)
  ) {
    return new Date(dateDefinition.milliseconds);
  }

  throw new Error(`Unknown date input: ${JSON.stringify(dateDefinition)}`);
}

export type IntlContextProps = ReturnType<typeof useIntlHelperContext>;

export function useIntlHelperContext(locale: string, siteText: AllLanguages) {
  return useMemo(() => {
    // Number formatting
    const NumberFormat = new Intl.NumberFormat(locale);

    function formatNumber(value: number | string | undefined | null): string {
      if (typeof value === 'undefined' || value === null) return '-';

      return NumberFormat.format(Number(value));
    }

    function formatPercentage(
      value: number,
      options?: {
        maximumFractionDigits: number;
      }
    ) {
      return new Intl.NumberFormat(locale, options).format(value);
    }

    // Start of date formatting

    // Define all styles of formatting
    const Time = new Intl.DateTimeFormat(locale, {
      timeStyle: 'short',
      timeZone: 'Europe/Amsterdam',
    } as DateTimeFormatOptions);

    const Long = new Intl.DateTimeFormat(locale, {
      dateStyle: 'long',
      timeStyle: 'short',
      timeZone: 'Europe/Amsterdam',
    } as DateTimeFormatOptions);

    const Medium = new Intl.DateTimeFormat(locale, {
      dateStyle: 'long',
      timeZone: 'Europe/Amsterdam',
    } as DateTimeFormatOptions);

    // Day Month or Month Day depending on the locale
    const DayMonth = new Intl.DateTimeFormat(locale, {
      month: 'long',
      day: 'numeric',
      timeZone: 'Europe/Amsterdam',
    });

    const DayMonthShort = new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: 'numeric',
      timeZone: 'Europe/Amsterdam',
    });

    const DayMonthShortYear = new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'Europe/Amsterdam',
    });

    const WeekdayMedium = new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      timeZone: 'Europe/Amsterdam',
    } as DateTimeFormatOptions);

    // The actual functions

    /**
     * This formatting-cache will improve date formatting performance in
     * I̶n̶t̶e̶r̶n̶e̶t̶ ̶E̶x̶p̶l̶o̶r̶e̶r̶ Safari.
     * Formatting a date could easily take 20ms+, this is now reduced to < 1ms.
     */
    const formatCache: Record<string, string> = {};

    function getFormattedDate(date: Date, style: formatStyle) {
      switch (style) {
        case 'time': // '09:24'
          return Time.format(date);

        case 'iso': // '2020-07-23T10:01:16.000Z'
          return new Date(date).toISOString();

        case 'long': // '23 juli 2020 om 12:01'
          return Long.format(date);

        case 'medium': // '23 juli 2020'
          return Medium.format(date);

        case 'axis': // '23 jul'
          return DayMonthShort.format(date).replace(/\./g, '');

        case 'axis-with-year': // '23 jul. 2021'
          return DayMonthShortYear.format(date);

        case 'weekday-medium':
          return WeekdayMedium.format(date);

        case 'day-month':
        default:
          return DayMonth.format(date);
      }
    }

    /**
     * Returns one of `vandaag` | `gisteren` | `eergisteren`.
     * If given date is more than 2 days ago it will return `undefined`.
     */
    function formatRelativeDate(dateDefinition: DateDefinition) {
      const date = parseDateDefinition(dateDefinition);

      if (typeof window === 'undefined') {
        throw new Error('formatRelativeDate cannot be called server-side');
      }

      return isToday(date)
        ? siteText.utils.date_today
        : isYesterday(date)
        ? siteText.utils.date_yesterday
        : isDayBeforeYesterday(date)
        ? siteText.utils.date_day_before_yesterday
        : undefined;
    }

    function formatDate(
      dateOrTimestamp: Date | number,
      style: formatStyle = 'day-month'
    ) {
      const date =
        dateOrTimestamp instanceof Date
          ? dateOrTimestamp
          : new Date(dateOrTimestamp as number);

      const cacheKey = `${date.getTime()}-${style}`;
      const dateCached = formatCache[cacheKey];

      if (dateCached) return dateCached;

      const formattedDate = getFormattedDate(date, style);
      formatCache[cacheKey] = formattedDate;

      return formattedDate;
    }

    /**
     * formatDateFromTo expects 2 dates and will return them as strings to be
     * rendered as a date range with respect for a range spanning multiple months.
     *
     * eg.
     *
     *     formatDateFromTo(1 maart, 7 maart)
     *     output: ['1', '7 maart']
     *
     * or:
     *
     *    formatDateFromTo(29 maart, 4 april)
     *    output: ['29 maart', '4 april']
     */
    function formatDateSpan(
      startDateDefinition: DateDefinition,
      endDateDefinition: DateDefinition
    ) {
      const startDate = parseDateDefinition(startDateDefinition);
      const endDate = parseDateDefinition(endDateDefinition);

      const isSameMonth = startDate.getMonth() === endDate.getMonth();

      const startDateText = isSameMonth
        ? `${startDate.getDate()}`
        : formatDate(startDate);
      const endDateText = formatDate(endDate);

      return [startDateText, endDateText] as [start: string, end: string];
    }

    function formatDateFromSeconds(seconds: number, style?: formatStyle) {
      assert(!isNaN(seconds), 'seconds is NaN');

      /**
       * JavaScript uses milliseconds since EPOCH, therefore the value
       * formatted by the format() function needs to be multiplied by 1000
       * to format to an accurate dateTime
       */

      const milliseconds = seconds * 1000;

      return formatDateFromMilliseconds(milliseconds, style);
    }

    function formatDateFromMilliseconds(
      milliseconds: number,
      style?: formatStyle
    ) {
      assert(!isNaN(milliseconds), 'milliseconds is NaN');

      return formatDate(new Date(milliseconds), style);
    }

    return {
      formatNumber,
      formatPercentage,
      formatDate,
      formatDateFromSeconds,
      formatDateFromMilliseconds,
      formatRelativeDate,
      formatDateSpan,
      siteText,
      locale,
    };
  }, [locale, siteText]);
}

export function useIntl() {
  const intlContext = useContext(IntlContext);

  // Return all localized helpers
  return intlContext;
}
