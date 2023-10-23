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
      deCoronaprik: () => '/landelijk/de-coronaprik',
      positieveTesten: () => '/landelijk/positieve-testen',
      infectieradar: () => '/landelijk/infectieradar',
      besmettelijkeMensen: () => '/landelijk/besmettelijke-mensen',
      reproductiegetal: () => '/landelijk/reproductiegetal',
      sterfte: () => '/landelijk/sterfte',
      ziekenhuisopnames: () => '/landelijk/ziekenhuis-opnames',
      intensiveCareOpnames: () => '/landelijk/intensive-care-opnames',
      ziekenhuizenInBeeld: () => '/landelijk/ziekenhuizen-in-beeld',
      patientenInBeeld: () => '/landelijk/patienten-in-beeld',
      kwetsbareGroepen: () => '/landelijk/kwetsbare-groepen-70-plussers',
      gehandicaptenzorg: () => '/landelijk/gehandicaptenzorg',
      thuiswonende70Plussers: () => '/landelijk/thuiswonende-70-plussers',
      rioolwater: () => '/landelijk/rioolwater',
      klachtenBijHuisartsen: () => '/landelijk/klachten-bij-huisartsen',
      coronaThermometer: () => '/landelijk/corona-thermometer',
      gedrag: () => '/landelijk/gedrag',
      coronamelder: () => '/landelijk/coronamelder',
      varianten: () => '/landelijk/varianten',
    },

    gm: {
      index: (code?: string) => (code ? (isMobile ? `/gemeente/${code}` : reverseRouter.gm.rioolwater(code)) : '/gemeente'),
      positieveTesten: (code: string) => `/gemeente/${code}/positieve-testen`,
      sterfte: (code: string) => `/gemeente/${code}/sterfte`,
      ziekenhuisopnames: (code: string) => `/gemeente/${code}/ziekenhuis-opnames`,
      rioolwater: (code: string) => `/gemeente/${code}/rioolwater`,
      deCoronaprik: (code: string) => `/gemeente/${code}/de-coronaprik`,
    },
  } as const;

  return reverseRouter;
}
