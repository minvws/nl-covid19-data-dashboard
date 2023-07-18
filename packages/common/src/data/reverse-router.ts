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
      index: () => (isMobile ? '/landelijk' : reverseRouter.nl.rioolwater()),
      vaccinaties: () => '/landelijk/vaccinaties',
      positiefGetesteMensen: () => '/landelijk/positief-geteste-mensen',
      testen: () => '/landelijk/testen',
      besmettelijkeMensen: () => '/landelijk/besmettelijke-mensen',
      reproductiegetal: () => '/landelijk/reproductiegetal',
      sterfte: () => '/landelijk/sterfte',
      ziekenhuisopnames: () => '/landelijk/ziekenhuis-opnames',
      intensiveCareOpnames: () => '/landelijk/intensive-care-opnames',
      ziekenhuizenEnZorg: () => '/landelijk/ziekenhuizen-en-zorg',
      patientenInBeeld: () => '/landelijk/patienten-in-beeld',
      kwetsbareGroepen: () => '/landelijk/kwetsbare-groepen-70-plussers',
      gehandicaptenzorg: () => '/landelijk/gehandicaptenzorg',
      thuiswonendeOuderen: () => '/landelijk/thuiswonende-ouderen',
      rioolwater: () => '/landelijk/rioolwater',
      verdenkingenHuisartsen: () => '/landelijk/verdenkingen-huisartsen',
      coronaThermometer: () => '/landelijk/corona-thermometer',
      gedrag: () => '/landelijk/gedrag',
      coronamelder: () => '/landelijk/coronamelder',
      varianten: () => '/landelijk/varianten',
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
