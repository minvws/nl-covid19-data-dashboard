export interface Variants {
  alpha: {
    name: string;
    countryOfOrigin: string;
  };
  beta: {
    name: string;
    countryOfOrigin: string;
  };
  chi: {
    name: string;
    countryOfOrigin: string;
  };
  delta: {
    name: string;
    countryOfOrigin: string;
  };
  epsilon: {
    name: string;
    countryOfOrigin: string;
  };
  eta: {
    name: string;
    countryOfOrigin: string;
  };
  gamma: {
    name: string;
    countryOfOrigin: string;
  };
  iota: {
    name: string;
    countryOfOrigin: string;
  };
  kappa: {
    name: string;
    countryOfOrigin: string;
  };
  lambda: {
    name: string;
    countryOfOrigin: string;
  };
  mu: {
    name: string;
    countryOfOrigin: string;
  };
  nu: {
    name: string;
    countryOfOrigin: string;
  };
  omega: {
    name: string;
    countryOfOrigin: string;
  };
  omicron: {
    name: string;
    countryOfOrigin: string;
  };
  other: {
    name: string;
    countryOfOrigin: string;
  };
  other_graph: {
    name: string;
    countryOfOrigin: string;
  };
  other_table: {
    name: string;
    countryOfOrigin: string;
  };
  phi: {
    name: string;
    countryOfOrigin: string;
  };
  pi: {
    name: string;
    countryOfOrigin: string;
  };
  psi: {
    name: string;
    countryOfOrigin: string;
  };
  rho: {
    name: string;
    countryOfOrigin: string;
  };
  sigma: {
    name: string;
    countryOfOrigin: string;
  };
  tau: {
    name: string;
    countryOfOrigin: string;
  };
  theta: {
    name: string;
    countryOfOrigin: string;
  };
  upsilon: {
    name: string;
    countryOfOrigin: string;
  };
  xi: {
    name: string;
    countryOfOrigin: string;
  };
  zeta: {
    name: string;
    countryOfOrigin: string;
  };
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
