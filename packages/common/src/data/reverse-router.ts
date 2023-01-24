export function getReverseRouter(isMobile: boolean) {
  const reverseRouter = {
    topical: {
      nl: '/',
    },

    general: {
      over: () => '/over',
      artikelen: () => '/artikelen',
      veelgesteldeVragen: () => '/veelgestelde-vragen',
      verantwoording: () => '/verantwoording',
      overRisiconiveaus: () => '/over-risiconiveaus',
      toegankelijkheid: () => '/toegankelijkheid',
      contact: () => '/contact',
    },

    nl: {
      index: () => (isMobile ? `/landelijk` : reverseRouter.nl.rioolwater()),
      vaccinaties: () => `/landelijk/vaccinaties`,
      positiefGetesteMensen: () => `/landelijk/positief-geteste-mensen`,
      besmettelijkeMensen: () => `/landelijk/besmettelijke-mensen`,
      reproductiegetal: () => `/landelijk/reproductiegetal`,
      sterfte: () => `/landelijk/sterfte`,
      ziekenhuisopnames: () => `/landelijk/ziekenhuis-opnames`,
      intensiveCareOpnames: () => `/landelijk/intensive-care-opnames`,
      kwetsbareGroepen: () => `/landelijk/kwetsbare-groepen-70-plussers`,
      gehandicaptenzorg: () => `/landelijk/gehandicaptenzorg`,
      thuiswonendeOuderen: () => `/landelijk/thuiswonende-ouderen`,
      rioolwater: () => `/landelijk/rioolwater`,
      verdenkingenHuisartsen: () => `/landelijk/verdenkingen-huisartsen`,
      gedrag: () => `/landelijk/gedrag`,
      geldendeAdviezen: () => `/landelijk/geldende-adviezen`,
      coronamelder: () => `/landelijk/coronamelder`,
      brononderzoek: () => `/landelijk/brononderzoek`,
      varianten: () => `/landelijk/varianten`,
    },

    vr: {
      index: (code?: string) => (code ? (isMobile ? `/veiligheidsregio/${code}` : reverseRouter.vr.rioolwater(code)) : '/veiligheidsregio'),
      geldendeAdviezen: (code: string) => `/veiligheidsregio/${code}/geldende-adviezen`,
      vaccinaties: (code: string) => `/veiligheidsregio/${code}/vaccinaties`,
      positiefGetesteMensen: (code: string) => `/veiligheidsregio/${code}/positief-geteste-mensen`,
      sterfte: (code: string) => `/veiligheidsregio/${code}/sterfte`,
      ziekenhuisopnames: (code: string) => `/veiligheidsregio/${code}/ziekenhuis-opnames`,
      kwetsbareGroepen: (code: string) => `/veiligheidsregio/${code}/kwetsbare-groepen-70-plussers`,
      gehandicaptenzorg: (code: string) => `/veiligheidsregio/${code}/gehandicaptenzorg`,
      thuiswonendeOuderen: (code: string) => `/veiligheidsregio/${code}/thuiswonende-ouderen`,
      rioolwater: (code: string) => `/veiligheidsregio/${code}/rioolwater`,
      gedrag: (code: string) => `/veiligheidsregio/${code}/gedrag`,
      brononderzoek: (code: string) => `/veiligheidsregio/${code}/brononderzoek`,
    },

    gm: {
      index: (code?: string) => (code ? (isMobile ? `/gemeente/${code}` : reverseRouter.gm.rioolwater(code)) : '/gemeente'),
      positiefGetesteMensen: (code: string) => `/gemeente/${code}/positief-geteste-mensen`,
      sterfte: (code: string) => `/gemeente/${code}/sterfte`,
      ziekenhuisopnames: (code: string) => `/gemeente/${code}/ziekenhuis-opnames`,
      rioolwater: (code: string) => `/gemeente/${code}/rioolwater`,
      vaccinaties: (code: string) => `/gemeente/${code}/vaccinaties`,
    },
  } as const;

  return reverseRouter;
}
