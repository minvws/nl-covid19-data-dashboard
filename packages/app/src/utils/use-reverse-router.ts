import { useMemo } from 'react';
import { useBreakpoints } from './use-breakpoints';

export function useReverseRouter() {
  const breakpoints = useBreakpoints();
  const openMenuSuffix = !breakpoints.md ? '?menu=1' : '';

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
      },

      nl: {
        index: () => reverseRouter.nl.vaccinaties() + openMenuSuffix,
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
      },

      vr: {
        index: (code?: string) =>
          code
            ? reverseRouter.vr.risiconiveau(code) + openMenuSuffix
            : '/veiligheidsregio',
        maatregelen: (code: string) => `/veiligheidsregio/${code}/maatregelen`,
        risiconiveau: (code: string) =>
          `/veiligheidsregio/${code}/risiconiveau`,
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
            ? reverseRouter.gm.ziekenhuisopnames(code) + openMenuSuffix
            : `/gemeente`,
        positiefGetesteMensen: (code: string) =>
          `/gemeente/${code}/positief-geteste-mensen`,
        sterfte: (code: string) => `/gemeente/${code}/sterfte`,
        ziekenhuisopnames: (code: string) =>
          `/gemeente/${code}/ziekenhuis-opnames`,
        rioolwater: (code: string) => `/gemeente/${code}/rioolwater`,
      },
    } as const;

    return reverseRouter;
  }, [openMenuSuffix]);
}
