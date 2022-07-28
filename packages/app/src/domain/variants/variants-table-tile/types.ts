export interface Variants {
  alpha: {
    name: string;
    country_of_origin: string;
  };
  beta: {
    name: string;
    country_of_origin: string;
  };
  chi: {
    name: string;
    country_of_origin: string;
  };
  delta: {
    name: string;
    country_of_origin: string;
  };
  epsilon: {
    name: string;
    country_of_origin: string;
  };
  eta: {
    name: string;
    country_of_origin: string;
  };
  gamma: {
    name: string;
    country_of_origin: string;
  };
  iota: {
    name: string;
    country_of_origin: string;
  };
  kappa: {
    name: string;
    country_of_origin: string;
  };
  lambda: {
    name: string;
    country_of_origin: string;
  };
  mu: {
    name: string;
    country_of_origin: string;
  };
  nu: {
    name: string;
    country_of_origin: string;
  };
  omega: {
    name: string;
    country_of_origin: string;
  };
  'omicron b_1_1_529': {
    name: string;
    country_of_origin: string;
  };
  'omicron ba_1': {
    name: string;
    country_of_origin: string;
  };
  'omicron ba_2': {
    name: string;
    country_of_origin: string;
  };
  'omicron ba_3': {
    name: string;
    country_of_origin: string;
  };
  'omicron ba_4': {
    name: string;
    country_of_origin: string;
  };
  'omicron ba_5': {
    name: string;
    country_of_origin: string;
  };
  'omicron ba_2_12_1': {
    name: string;
    country_of_origin: string;
  };
  other: {
    name: string;
    country_of_origin: string;
  };
  other_graph: {
    name: string;
    country_of_origin: string;
  };
  other_table: {
    name: string;
    country_of_origin: string;
  };
  phi: {
    name: string;
    country_of_origin: string;
  };
  pi: {
    name: string;
    country_of_origin: string;
  };
  psi: {
    name: string;
    country_of_origin: string;
  };
  rho: {
    name: string;
    country_of_origin: string;
  };
  sigma: {
    name: string;
    country_of_origin: string;
  };
  tau: {
    name: string;
    country_of_origin: string;
  };
  theta: {
    name: string;
    country_of_origin: string;
  };
  upsilon: {
    name: string;
    country_of_origin: string;
  };
  xi: {
    name: string;
    country_of_origin: string;
  };
  zeta: {
    name: string;
    country_of_origin: string;
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
