import { SiteText } from '~/locale';

export type TableText = {
  anderen_tooltip: string;
  omschrijving: string;
  omschrijving_zonder_placeholders: string;
  titel: string;
  kolommen: {
    aantal_monsters: string;
    eerst_gevonden: string;
    percentage: string;
    variant_titel: string;
    vorige_meting: string;
  };
  verschil: { gelijk: string; meer: string; minder: string };
  variantCodes: SiteText['common']['variant_codes'];
  description: string;
  geen_percentage_cijfer: string;
  geen_percentage_cijfer_tooltip: string;
};
