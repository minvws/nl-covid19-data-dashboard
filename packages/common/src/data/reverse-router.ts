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
      patientenInBeeld: (code: string) => `/gemeente/${code}/patienten-in-beeld`,
      rioolwater: (code: string) => `/gemeente/${code}/rioolwater`,
      deCoronaprik: (code: string) => `/gemeente/${code}/de-coronaprik`,
      lijstweergave: () => '/gemeente/lijstweergave',
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
      patientenInBeeld: (code: string) => `/gemeente/${code}/patienten-in-beeld`,
    },

    dataExplained: {
      nursing_home_care: () => '/verantwoording/kwetsbare-groepen-en-70-plussers',
      pressure_on_health_care: () => '/verantwoording/druk-op-de-zorg-verzuimcijfers-nza',
      reproduction_number: () => '/verantwoording/reproductiegetal',
      compliance: () => '/verantwoording/gedrag',
      positive_tests: () => '/verantwoording/positieve-testen',
      mortality: () => '/verantwoording/sterfte-rivm',
      disabled_care: () => '/verantwoording/gehandicaptenzorg',
      elderly_at_home: () => '/verantwoording/thuiswonende-70-plussers',
      contact_research: () => '/verantwoording/bron-en-contactonderzoek-ggd-en',
      coronamelder_app: () => '/verantwoording/coronamelder',
      vaccinations: () => '/verantwoording/leveringen-en-voorraden-vaccins-and-vaccinatiebereidheid',
      contagious_people: () => '/verantwoording/besmettelijke-mensen',
      patients_with_complaints: () => '/verantwoording/patienten-met-klachten-bij-de-huisarts',
    },
  } as const;

  return archivedPaths;
}
