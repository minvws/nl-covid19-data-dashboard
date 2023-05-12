import { gmData, vrData } from '@corona-dashboard/common';
import { useRouter } from 'next/router';
import { createContext, ReactNode, useContext, useMemo } from 'react';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

interface Breadcrumb {
  href: string;
  title: string;
  redirectLabel?: string;
}

export const BreadcrumbsDataContext = createContext<Record<string, string>>({});

/*  
  Sometimes a page's title can't be inferred from the slug or static content,
  but needs to come from CMS data. For this context, we provide a context with
  which you can inject the pageTitle into the component.
  You should provide the pageTitle with the query parameter as the key, eg:
  { 'some-page-slug': 'Some Page Title' } as the breadcrumbsData prop to Layout. 
 */
export const BreadcrumbsDataProvider = ({ value, children }: { value?: Record<string, string>; children: ReactNode }) => {
  const mergedValue = useMemo(() => {
    const gmMap = gmData.reduce((acc, curr) => ({ [curr.gemcode]: curr.name, ...acc }), {});

    const vrMap = vrData.reduce((acc, curr) => ({ [curr.code]: curr.name, ...acc }), {});

    return {
      ...(value ? value : {}),
      ...gmMap,
      ...vrMap,
    };
  }, [value]);

  return <BreadcrumbsDataContext.Provider value={mergedValue}>{children}</BreadcrumbsDataContext.Provider>;
};

// VR/GM pages that are NOT in Actueel should have a redirect label

export function useBreadcrumbs(): Breadcrumb[] {
  const { pathname, query } = useRouter();
  const { commonTexts } = useIntl();
  const ctx = useContext(BreadcrumbsDataContext);

  return useMemo(() => {
    const getQueryParameter = (str: string) => {
      // Extract text between square brackets: https://stackoverflow.com/questions/2403122/regular-expression-to-extract-text-between-square-brackets
      const regexp = /(\[([^\]]+)\])/;
      const matches = str.match(regexp);
      const param = matches?.[2];
      return { key: param };
    };

    const convertQueryParameter = (str: string): string => {
      const { key } = getQueryParameter(str);
      return key ? (query[key] as string) : str;
    };

    const getTitle = (str: string): string => {
      if (str === '') return commonTexts.breadcrumbs.paths.actueel;

      const { key } = getQueryParameter(str);
      str = convertQueryParameter(str);

      if (key) {
        // retrieve the page title from the context
        const pageTitle = ctx[query[key] as string];
        return pageTitle ? pageTitle : str;
      }

      return commonTexts.breadcrumbs.paths[str as keyof typeof commonTexts.breadcrumbs.paths];
    };

    const getRedirectLabel = (str: string): string | undefined => {
      str = convertQueryParameter(str);

      switch (str) {
        case 'landelijk':
        case 'actueel': {
          return replaceVariablesInText(commonTexts.breadcrumbs.redirects.template, {
            page: commonTexts.breadcrumbs.redirects[str as keyof typeof commonTexts.breadcrumbs.redirects],
          });
        }
        case 'gemeente': {
          // /gemeente and /veiligheidsregio and their /actueel counterparts do not redirect, return.
          return undefined;
        }
        default: {
          // actueel pages, apart from 'actueel' itself, have no redirects. Return early
          if (pathname.includes('actueel')) return;

          // this is the more complex case where we have a str with a gm/vr code
          if (str.includes('GM')) {
            const pageTemplate = replaceVariablesInText(commonTexts.breadcrumbs.redirects['gemeente'], {
              name: ctx[str],
            });

            return replaceVariablesInText(commonTexts.breadcrumbs.redirects.template, {
              page: pageTemplate,
            });
          }
        }
      }
    };

    // '/' gets split into ['', '']. Make sure it doesn't.
    let arr = pathname === '/' ? [''] : pathname.split('/');
    // filter out '' when 'actueel' is in the path, as we'll have a double Actueel breadcrumb otherwise
    arr = arr.includes('actueel') ? arr.filter((x) => x !== '') : arr;

    const breadcrumbs = arr
      .map((x, index, arr) => {
        const href = [...arr.slice(0, index), x].map(convertQueryParameter).join('/');

        return {
          href: href.startsWith('/') ? href : `/${href}`,
          title: getTitle(x),
          redirectLabel: getRedirectLabel(x),
        };
      })
      .filter((x) => {
        // filter out the link to Actueel on all pages but / and the /actueel/.../... pages
        if (pathname === '/') return true;
        if (pathname.includes('actueel')) return true;
        return x.href !== '/';
      });

    return breadcrumbs;
  }, [ctx, pathname, query, commonTexts]);
}
