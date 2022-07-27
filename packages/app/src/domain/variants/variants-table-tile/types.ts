export interface Variants {
  B_1_1_529: string;
  BA_1: string;
  BA_2: string;
  BA_4: string;
  BA_5: string;
  'BA_2+S:L452X': string;
  BA_2_12_1: string;
  BA_3: string;
  B_1_617_2: string;
  B_1_351: string;
  P_1: string;
  B_1_1_7: string;
  B_1_621: string;
  C_37: string;
  BA_2_75: string;
  other_table: string;
  other_graph: string;
}

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
  varianten: Variants;
  description: string;
  geen_percentage_cijfer: string;
  geen_percentage_cijfer_tooltip: string;
};
