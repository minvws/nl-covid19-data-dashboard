import BasisregelsAfstand from '~/assets/restrictions/basisregels_afstand.svg';
import BasisregelsDrukte from '~/assets/restrictions/basisregels_drukte.svg';
import BasisregelsElleboog from '~/assets/restrictions/basisregels_elleboog.svg';
import BasisregelsHandenWassen from '~/assets/restrictions/basisregels_handenwassen.svg';
import BasisregelsMondkapje from '~/assets/restrictions/basisregels_mondkapje.svg';
import ContactBeroepen from '~/assets/restrictions/contactberoepen.svg';
import Groepen from '~/assets/restrictions/groepen.svg';
import HorecaBestellen from '~/assets/restrictions/horeca-en-evenementen_bestellen.svg';
import HorecaEtenEnDrinken from '~/assets/restrictions/horeca-en-evenementen_etendrinken.svg';
import HorecaEvenementen from '~/assets/restrictions/horeca-en-evenementen_evenementen.svg';
import OnderwijsKinderopvang from '~/assets/restrictions/onderwijs-en-kinderopvang_kinderopvang.svg';
import OnderwijsNoodopvang from '~/assets/restrictions/onderwijs-en-kinderopvang_noodopvang.svg';
import OnderwijsOpAfstand from '~/assets/restrictions/onderwijs-en-kinderopvang_op-afstand.svg';
import PubliekeLocaties from '~/assets/restrictions/publiek-toegankelijke-locaties.svg';
import SportBinnen from '~/assets/restrictions/sport_binnensportlocaties.svg';
import SportBuiten from '~/assets/restrictions/sport_buiten.svg';
import SportWedstrijden from '~/assets/restrictions/sport_wedstrijden.svg';
import Thuis from '~/assets/restrictions/thuis.svg';
import VervoerReizenBlijfThuis from '~/assets/restrictions/vervoer-en-reizen_blijfthuis.svg';
import VervoerReizenBuitenland from '~/assets/restrictions/vervoer-en-reizen_buitenland.svg';
import WinkelsAlcohol from '~/assets/restrictions/winkelen-en-boodschappen_alcohol.svg';
import WinkelsBoodschappen from '~/assets/restrictions/winkelen-en-boodschappen_open.svg';

export const restrictionIcons: Record<string, any> = {
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
  '41_onderwijs_39': OnderwijsOpAfstand,
  '41_onderwijs_40': OnderwijsKinderopvang,
  '41_onderwijs_41': OnderwijsNoodopvang,
};
