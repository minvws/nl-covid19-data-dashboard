import { RouterDataScopeKey } from '@corona-dashboard/common';
import { SiteText } from '~/locale/site-text';
import { ReverseRouter } from '~/utils/use-reverse-router';

type GetBackButtonValueParams = {
  currentPageScope: RouterDataScopeKey | 'general' | undefined;
  currentCode: string | undefined;
  isMenuOpen: boolean;
  reverseRouter: ReverseRouter;
  commonTexts: SiteText['common'];
};

export const getBackButtonValues = ({ currentPageScope, currentCode, isMenuOpen, reverseRouter, commonTexts }: GetBackButtonValueParams) => {
  switch (currentPageScope) {
    case 'nl':
      /**
       * (On mobile devices) The NL scope is special in that it has two levels of "going back", i.e. going back to the menu from an NL page and
       * further going back to the home page from the menu. This is why isMenuOpen needs to be checked here to pass the correct values to the button.
       */
      return {
        url: isMenuOpen ? reverseRouter.topical.nl : reverseRouter.nl.index(),
        text: isMenuOpen ? commonTexts.nav.back_topical.nl : commonTexts.nav.back_all_metrics.nl,
      };
    case 'gm':
      return {
        url: isMenuOpen ? reverseRouter.gm.index() : reverseRouter.gm.index(currentCode),
        text: isMenuOpen ? commonTexts.nav.back_to_gemeente_map : commonTexts.nav.back_all_metrics.gm,
      };
    case 'general':
      if (isMenuOpen) break;
      return {
        url: reverseRouter.general.verantwoording(),
        text: commonTexts.nav.back_all_metrics.data_explanation,
      };
    default:
      return {
        url: undefined,
        text: '',
      };
  }
};
