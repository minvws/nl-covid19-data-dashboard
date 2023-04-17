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
      besmettelijkeMensen: () => '/landelijk/besmettelijke-mensen',
      coronamelder: () => '/landelijk/coronamelder',
      gedrag: () => '/landelijk/gedrag',
      gehandicaptenzorg: () => '/landelijk/gehandicaptenzorg',
      index: () => (isMobile ? '/landelijk' : reverseRouter.nl.rioolwater()),
      intensiveCareOpnames: () => '/landelijk/intensive-care-opnames',
      kwetsbareGroepen: () => '/landelijk/kwetsbare-groepen-70-plussers',
      patientenInBeeld: () => '/landelijk/patienten-in-beeld',
      positiefGetesteMensen: () => '/landelijk/positief-geteste-mensen',
      reproductiegetal: () => '/landelijk/reproductiegetal',
      rioolwater: () => '/landelijk/rioolwater',
      sterfte: () => '/landelijk/sterfte',
      testen: () => '/landelijk/testen',
      thuiswonendeOuderen: () => '/landelijk/thuiswonende-ouderen',
      vaccinaties: () => '/landelijk/vaccinaties',
      varianten: () => '/landelijk/varianten',
      verdenkingenHuisartsen: () => '/landelijk/verdenkingen-huisartsen',
      ziekenhuisopnames: () => '/landelijk/ziekenhuis-opnames',
      ziekenhuizenEnZorg: () => '/landelijk/ziekenhuizen-en-zorg',
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
