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

export function getArchivedRoutes() {
  /**
   * Add the same keys that are part of the archived_metrics array
   * in the nl-layout and gm-layout files
   */

  const archivedPaths = {
    nl: {
      nursing_home_care: () => '/landelijk/kwetsbare-groepen-70-plussers',
      reproduction_number: () => '/landelijk/reproductiegetal',
      corona_thermometer: () => '/landelijk/corona-thermometer',
      compliance: () => '/landelijk/gedrag',
      positive_tests: () => '/landelijk/positieve-testen',
      disabled_care: () => '/landelijk/gehandicaptenzorg',
      elderly_at_home: () => '/landelijk/thuiswonende-70-plussers',
      coronamelder_app: () => '/landelijk/coronamelder',
      infectious_people: () => '/landelijk/besmettelijke-mensen',
      general_practitioner_suspicions: () => '/landelijk/klachten-bij-huisartsen',
    },

    gm: {
      positive_tests: (code: string) => `/gemeente/${code}/positieve-testen`,
      mortality: (code: string) => `/gemeente/${code}/sterfte`,
    },
  } as const;

  return archivedPaths;
}
