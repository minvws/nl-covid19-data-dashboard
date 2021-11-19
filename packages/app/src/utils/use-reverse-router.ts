import { useMemo } from 'react';
import { useFeature } from '~/lib/features';
import { useBreakpoints } from './use-breakpoints';

export type ReverseRouter = ReturnType<typeof useReverseRouter>;

export function useReverseRouter() {
  const breakpoints = useBreakpoints();
  const isMobile = !breakpoints.md;

  const vaccinationGmPagefeature = useFeature('gmVaccinationPage');

  return useMemo(() => {
    const reverseRouter = {
      actueel: {
        vr: (code: string) => `/actueel/veiligheidsregio/${code}`,
        gm: (code: string) => `/actueel/gemeente/${code}`,
      },

      algemeen: {
        over: () => '/over',
        veelgesteldeVragen: () => '/veelgestelde-vragen',
        verantwoording: () => '/verantwoording',
        overRisiconiveaus: () => '/over-risiconiveaus',
        toegankelijkheid: () => '/toegankelijkheid',
        contact: () => '/contact',
      },

      in: {
        index: () =>
          isMobile
            ? `/internationaal`
            : reverseRouter.in.positiefGetesteMensen(),
        positiefGetesteMensen: () => `/internationaal/positief-geteste-mensen`,
        varianten: () => `/internationaal/varianten`,
      },

      nl: {
        index: () => (isMobile ? `/landelijk` : reverseRouter.nl.vaccinaties()),
        vaccinaties: () => `/landelijk/vaccinaties`,
        positiefGetesteMensen: () => `/landelijk/positief-geteste-mensen`,
        besmettelijkeMensen: () => `/landelijk/besmettelijke-mensen`,
        reproductiegetal: () => `/landelijk/reproductiegetal`,
        sterfte: () => `/landelijk/sterfte`,
        ziekenhuisopnames: () => `/landelijk/ziekenhuis-opnames`,
        intensiveCareOpnames: () => `/landelijk/intensive-care-opnames`,
        verpleeghuiszorg: () => `/landelijk/verpleeghuiszorg`,
        gehandicaptenzorg: () => `/landelijk/gehandicaptenzorg`,
        thuiswonendeOuderen: () => `/landelijk/thuiswonende-ouderen`,
        rioolwater: () => `/landelijk/rioolwater`,
        verdenkingenHuisartsen: () => `/landelijk/verdenkingen-huisartsen`,
        gedrag: () => `/landelijk/gedrag`,
        maatregelen: () => `/landelijk/maatregelen`,
        coronamelder: () => `/landelijk/coronamelder`,
        brononderzoek: () => `/landelijk/brononderzoek`,
        varianten: () => `/landelijk/varianten`,
      },

      vr: {
        index: (code?: string) =>
          code
            ? isMobile
              ? `/veiligheidsregio/${code}`
              : reverseRouter.vr.vaccinaties(code)
            : '/veiligheidsregio',
        maatregelen: (code: string) => `/veiligheidsregio/${code}/maatregelen`,
        vaccinaties: (code: string) => `/veiligheidsregio/${code}/vaccinaties`,
        positiefGetesteMensen: (code: string) =>
          `/veiligheidsregio/${code}/positief-geteste-mensen`,
        sterfte: (code: string) => `/veiligheidsregio/${code}/sterfte`,
        ziekenhuisopnames: (code: string) =>
          `/veiligheidsregio/${code}/ziekenhuis-opnames`,
        verpleeghuiszorg: (code: string) =>
          `/veiligheidsregio/${code}/verpleeghuiszorg`,
        gehandicaptenzorg: (code: string) =>
          `/veiligheidsregio/${code}/gehandicaptenzorg`,
        thuiswonendeOuderen: (code: string) =>
          `/veiligheidsregio/${code}/thuiswonende-ouderen`,
        rioolwater: (code: string) => `/veiligheidsregio/${code}/rioolwater`,
        gedrag: (code: string) => `/veiligheidsregio/${code}/gedrag`,
        brononderzoek: (code: string) =>
          `/veiligheidsregio/${code}/brononderzoek`,
      },

      gm: {
        index: (code?: string) =>
          code
            ? vaccinationGmPagefeature.isEnabled
              ? isMobile
                ? `/gemeente/${code}`
                : reverseRouter.gm.vaccinaties(code)
              : isMobile
              ? `/gemeente/${code}`
              : reverseRouter.gm.ziekenhuisopnames(code)
            : `/gemeente`,
        positiefGetesteMensen: (code: string) =>
          `/gemeente/${code}/positief-geteste-mensen`,
        sterfte: (code: string) => `/gemeente/${code}/sterfte`,
        ziekenhuisopnames: (code: string) =>
          `/gemeente/${code}/ziekenhuis-opnames`,
        rioolwater: (code: string) => `/gemeente/${code}/rioolwater`,
        vaccinaties: (code: string) => `/gemeente/${code}/vaccinaties`,
      },
    } as const;

    return reverseRouter;
  }, [isMobile, vaccinationGmPagefeature]);
}
