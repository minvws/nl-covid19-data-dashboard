import afstand_sporten from './assets/restrictions/afstand-sporten.svg';
import alcohol_verkoop from './assets/restrictions/alcohol-verkoop.svg';
import avondklok from './assets/restrictions/avondklok.svg';
import BasisregelsAfstand from './assets/restrictions/basisregels_afstand.svg';
import BasisregelsDrukte from './assets/restrictions/basisregels_drukte.svg';
import BasisregelsElleboog from './assets/restrictions/basisregels_elleboog.svg';
import BasisregelsGeenBezoek from './assets/restrictions/basisregels_geen-bezoek.svg';
import BasisregelsHandenWassen from './assets/restrictions/basisregels_handenwassen.svg';
import BasisregelsMondkapje from './assets/restrictions/basisregels_mondkapje.svg';
import BasisregelsTesten from './assets/restrictions/basisregels_testen.svg';
import BasisregelsThuisBlijven from './assets/restrictions/basisregels_blijf-thuis.svg';
import bezoek from './assets/restrictions/bezoek.svg';
import bibliotheken from './assets/restrictions/bibliotheken.svg';
import binnensporten from './assets/restrictions/binnensporten.svg';
import ContactBeroepen from './assets/restrictions/contactberoepen.svg';
import eenPersoonDoorgestreept from './assets/restrictions/een-persoon-doorgestreept.svg';
import gedeeltelijkOpenRugzak from './assets/restrictions/gedeeltelijk-open-rugzak.svg';
import geen_entertainment from './assets/restrictions/geen-entertainment.svg';
import geenWedstrijden from './assets/restrictions/geen-wedstrijden.svg';
import Groepen from './assets/restrictions/groepen.svg';
import horeca_evenementen from './assets/restrictions/horeca_evenementen.svg';
import HorecaBestellen from './assets/restrictions/horeca-en-evenementen_bestellen.svg';
import HorecaEtenEnDrinken from './assets/restrictions/horeca-en-evenementen_etendrinken.svg';
import HorecaEvenementen from './assets/restrictions/horeca-en-evenementen_evenementen.svg';
import klok_2100 from './assets/restrictions/klok-2100.svg';
import kunstcultuur_musea from './assets/restrictions/kunstcultuur_musea.svg';
import lopend from './assets/restrictions/lopend.svg';
import max_aantal_bezoekers from './assets/restrictions/max-aantal-bezoekers.svg';
import meerdaagse_evenementen from './assets/restrictions/meerdaagse-evenementen.svg';
import OnderwijsKinderopvang from './assets/restrictions/onderwijs-en-kinderopvang_kinderopvang.svg';
import OnderwijsNoodopvang from './assets/restrictions/onderwijs-en-kinderopvang_noodopvang.svg';
import OnderwijsOpAfstand from './assets/restrictions/onderwijs-en-kinderopvang_op-afstand.svg';
import ontmoetingen_bezoek from './assets/restrictions/ontmoetingen_bezoek.svg';
import openingstijden from './assets/restrictions/openingstijden.svg';
import PubliekeLocaties from './assets/restrictions/publiek-toegankelijke-locaties.svg';
import recreatie from './assets/restrictions/recreatie.svg';
import reizen from './assets/restrictions/reizen.svg';
import SportBinnen from './assets/restrictions/sport_binnensportlocaties.svg';
import SportBuiten from './assets/restrictions/sport_buiten.svg';
import sporterMetZweetband from './assets/restrictions/sporter-met-zweetband.svg';
import SportWedstrijden from './assets/restrictions/sport_wedstrijden.svg';
import Stap1Avondklok from './assets/restrictions/stap-1_avondklok.svg';
import Stap1HorecaMax from './assets/restrictions/stap_1-horeca_max.svg';
import Stap1HorecaPerTafel from './assets/restrictions/stap_1-horeca_pertafel.svg';
import Stap1HorecaReserveren from './assets/restrictions/stap_1-horeca_reserveren.svg';
import Stap1HorecaSportAccomodaties from './assets/restrictions/stap_1-horeca_sportaccomodaties.svg';
import Stap1HorecaTerras from './assets/restrictions/stap_1-horeca_terras.svg';
import Stap1HorecaVerplaatsen from './assets/restrictions/stap_1-horeca_verplaatsen.svg';
import Stap1OnderwijsBibliotheek from './assets/restrictions/stap_1-onderwijs_bibliotheek.svg';
import Stap1OnderwijsOpen from './assets/restrictions/stap_1-onderwijs_open.svg';
import Stap1Theorie from './assets/restrictions/stap_1-theorie.svg';
import Stap1Thuisbezoek from './assets/restrictions/stap_1-thuisbezoek.svg';
import Stap1Uitvaarten from './assets/restrictions/stap_1-uitvaarten.svg';
import Stap1WikelsOpen from './assets/restrictions/stap_1-winkels_open.svg';
import Stap1WinkelsAlleen from './assets/restrictions/stap_1-winkels_alleen.svg';
import Stap1WinkelsMarkten from './assets/restrictions/stap_1-winkels_markten.svg';
import Stap1WinkelsMax from './assets/restrictions/stap_1-winkels_max.svg';
import testbewijs from './assets/restrictions/testbewijs.svg';
import Thuis from './assets/restrictions/thuis.svg';
import toegangsbewijzen from './assets/restrictions/toegangsbewijzen.svg';
import VervoerReizenBlijfThuis from './assets/restrictions/vervoer-en-reizen_blijfthuis.svg';
import VervoerReizenBuitenland from './assets/restrictions/vervoer-en-reizen_buitenland.svg';
import VervoerReizenOV from './assets/restrictions/vervoer-en-reizen_ov.svg';
import WinkelsAlcohol from './assets/restrictions/winkelen-en-boodschappen_alcohol.svg';
import WinkelsBoodschappen from './assets/restrictions/winkelen-en-boodschappen_open.svg';

export type RestrictionIcon = keyof typeof restrictionIcons;

export const restrictionIcons = {
  '41_er_op_uit_1': null,
  '41_er_op_uit_2': null,
  '41_samenkomst_3': null,
  '41_horeca_4': null,
  '41_horeca_5': null,
  '41_horeca_6': null,
  '41_bezoek_7': null,
  '41_bezoek_8': null,
  '41_winkels_9': null,
  '41_winkels_10': null,
  '41_winkels_11': null,
  '41_ov_12': null,
  '41_ov_13': null,
  '41_sport_14': null,
  '41_sport_15': null,
  '41_sport_16': null,
  '41_sport_17': null,
  '0_algemeen_18': OnderwijsOpAfstand,
  '0_algemeen_19': BasisregelsAfstand,
  '0_algemeen_20': BasisregelsDrukte,
  '0_algemeen_21': BasisregelsHandenWassen,
  '0_algemeen_22': BasisregelsElleboog,
  '0_algemeen_23': BasisregelsMondkapje,
  '0_algemeen_42': BasisregelsThuisBlijven,
  '0_algemeen_43': BasisregelsTesten,
  '0_algemeen_44': BasisregelsGeenBezoek,
  '41_bezoek_24': Thuis,
  '41_er_op_uit_25': Groepen,
  '41_samenkomst_26': PubliekeLocaties,
  '41_horeca_27': HorecaEtenEnDrinken,
  '41_horeca_28': HorecaBestellen,
  '41_horeca_29': HorecaEvenementen,
  '41_winkels_30': PubliekeLocaties,
  '41_winkels_31': WinkelsBoodschappen,
  '41_winkels_32': WinkelsAlcohol,
  '41_contactberoep_33': ContactBeroepen,
  '41_sport_34': SportBuiten,
  '41_sport_35': SportBinnen,
  '41_sport_36': SportWedstrijden,
  '41_ov_37': VervoerReizenBlijfThuis,
  '41_ov_38': VervoerReizenBuitenland,
  '41_ov_45': VervoerReizenOV,
  '41_onderwijs_39': OnderwijsOpAfstand,
  '41_onderwijs_40': OnderwijsKinderopvang,
  '41_onderwijs_41': OnderwijsNoodopvang,
  avondklok,
  bezoek,
  lopend,
  eenPersoonDoorgestreept,
  gedeeltelijkOpenRugzak,
  geenWedstrijden,
  sporterMetZweetband,
  'stap_1-horeca_max': Stap1HorecaMax,
  'stap_1-horeca_per_tafel': Stap1HorecaPerTafel,
  'stap_1-horeca_reserveren': Stap1HorecaReserveren,
  'stap_1-horeca_sportaccomodaties': Stap1HorecaSportAccomodaties,
  'stap_1-horeca_terras': Stap1HorecaTerras,
  'stap_1-horeca_verplaatsen': Stap1HorecaVerplaatsen,
  'stap_1-onderwijs_bibliotheek': Stap1OnderwijsBibliotheek,
  'stap_1-onderwijs_open': Stap1OnderwijsOpen,
  'stap_1-theorie': Stap1Theorie,
  'stap_1-thuisbezoek': Stap1Thuisbezoek,
  'stap_1-uitvaarten': Stap1Uitvaarten,
  'stap_1-winkels_alleen': Stap1WinkelsAlleen,
  'stap_1-winkels_markten': Stap1WinkelsMarkten,
  'stap_1-winkels_max': Stap1WinkelsMax,
  'stap_1-winkels_open': Stap1WikelsOpen,
  'stap-1_avondklok': Stap1Avondklok,
  testbewijs,
  reizen,
  recreatie,
  binnensporten,
  bibliotheken,
  horeca_evenementen,
  kunstcultuur_musea,
  ontmoetingen_bezoek,
  afstand_sporten,
  alcohol_verkoop,
  max_aantal_bezoekers,
  meerdaagse_evenementen,
  openingstijden,
  toegangsbewijzen,
  klok_2100,
  geen_entertainment,
} as const;
