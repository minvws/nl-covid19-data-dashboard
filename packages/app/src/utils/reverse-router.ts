import { MunicipalityPageName } from '~/components/choropleth/select-handlers/types';

// prettier-ignore
export const reverseRouter = {
  actueel: {
    vr: (code: string) => `/actueel/veiligheidsregio/${code}`,
    gm: (code: string) => `/actueel/gemeente/${code}`
  },

  gm: {
    index: (code: string) => `/gemeente/${code}`,
    positiefGetesteMensen: (code: string) => `/gemeente/${code}/positief-geteste-mensen`,
    sterfte: (code: string) => `/gemeente/${code}/sterfte`,
    ziekenhuisopnames: (code: string) => `/gemeente/${code}/ziekenhuis-opnames`,
    rioolwater: (code: string) => `/gemeente/${code}/rioolwater`,
  },

  vr: {
    index: (code: string) => `/veiligheidsregio/${code}`,
    maatregelen: (code: string) => `/veiligheidsregio/${code}/maatregelen`,
    risiconiveau: (code: string) => `/veiligheidsregio/${code}/risiconiveau`,
    positiefGetesteMensen: (code: string) => `/veiligheidsregio/${code}/positief-geteste-mensen`,
    sterfte: (code: string) => `/veiligheidsregio/${code}/sterfte`,
    ziekenhuisopnames: (code: string) => `/veiligheidsregio/${code}/ziekenhuis-opnames`,
    verpleeghuiszorg: (code: string) => `/veiligheidsregio/${code}/verpleeghuiszorg`,
    gehandicaptenzorg: (code: string) => `/veiligheidsregio/${code}/gehandicaptenzorg`,
    thuiswonendeOuderen: (code: string) => `/veiligheidsregio/${code}/thuiswonende-ouderen`,
    rioolwater: (code: string) => `/veiligheidsregio/${code}/rioolwater`,
    gedrag: (code: string) => `/veiligheidsregio/${code}/gedrag`,
  }
} as const

/**
 * legacy
 */

export function getMunicipalityRoute(
  page: MunicipalityPageName | 'index',
  code: string
) {
  switch (page) {
    case 'index':
      return reverseRouter.gm.index(code);
    case 'actueel':
      return reverseRouter.actueel.gm(code);
    case 'positief-geteste-mensen':
      return reverseRouter.gm.positiefGetesteMensen(code);
    case 'sterfte':
      return reverseRouter.gm.sterfte(code);
    case 'ziekenhuis-opnames':
      return reverseRouter.gm.ziekenhuisopnames(code);
    case 'rioolwater':
      return reverseRouter.gm.rioolwater(code);
  }

  throw new Error(`Unknown municipality page ${page}`);
}

export function getSafetyRegionRoute(
  page: MunicipalityPageName | 'index',
  code: string
) {
  switch (page) {
    case 'index':
      return reverseRouter.gm.index(code);
    case 'actueel':
      return reverseRouter.actueel.gm(code);
    case 'positief-geteste-mensen':
      return reverseRouter.gm.positiefGetesteMensen(code);
    case 'sterfte':
      return reverseRouter.gm.sterfte(code);
    case 'ziekenhuis-opnames':
      return reverseRouter.gm.ziekenhuisopnames(code);
    case 'rioolwater':
      return reverseRouter.gm.rioolwater(code);
  }

  throw new Error(`Unknown municipality page ${page}`);
}
