import { useRouter } from 'next/router';
import { createContext, ReactNode, useContext, useMemo } from 'react';
import { gmData } from '~/data/gm';
import { vrData } from '~/data/vr';
import { useIntl } from '~/intl';

interface Breadcrumb {
  href: string;
  title: string;
}

export const BreadcrumbsDataContext = createContext<Record<string, string>>({});

/*  
  Sometimes a page's title can't be inferred from the slug or static content,
  but needs to come from CMS data. For this context, we provide a context with
  which you can inject the pageTitle into the component.
  You should provide the pageTitle with the query parameter as the key, eg:
  { 'some-page-slug': 'Some Page Title' } as the breadcrumbsData prop to Layout. 
 */
export const BreadcrumbsDataProvider = ({
  value,
  children,
}: {
  value?: Record<string, string>;
  children: ReactNode;
}) => {
  const mergedValue = useMemo(() => {
    const gmMap = gmData.reduce(
      (acc, curr) => ({ [curr.gemcode]: curr.name, ...acc }),
      {}
    );

    const vrMap = vrData.reduce(
      (acc, curr) => ({ [curr.code]: curr.name, ...acc }),
      {}
    );

    return {
      ...(value ? value : {}),
      ...gmMap,
      ...vrMap,
    };
  }, [value]);

  return (
    <BreadcrumbsDataContext.Provider value={mergedValue}>
      {children}
    </BreadcrumbsDataContext.Provider>
  );
};

export function useBreadcrumbs(): Breadcrumb[] {
  const { pathname, query } = useRouter();
  const { siteText } = useIntl();
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
      if (str === '') return siteText.breadcrumbs.paths.actueel;

      const { key } = getQueryParameter(str);
      str = convertQueryParameter(str);

      if (key) {
        // retrieve the page title from the context
        const pageTitle = ctx[query[key] as string];
        return pageTitle ? pageTitle : str;
      }

      return siteText.breadcrumbs.paths[
        str as keyof typeof siteText.breadcrumbs.paths
      ];
    };

    // '/' gets split into ['', '']. Make sure it doesn't.
    let arr = pathname === '/' ? [''] : pathname.split('/');
    // filter out '' when 'actueel' is in the path, as we'll have a double Actueel breadcrumb otherwise
    arr = arr.includes('actueel') ? arr.filter((x) => x !== '') : arr;

    const breadcrumbs = arr
      .map((x, index, arr) => {
        const href = [...arr.slice(0, index), x]
          .map(convertQueryParameter)
          .join('/');

        return {
          href: href === '' ? '/' : '/' + href,
          title: getTitle(x),
        };
      })
      .filter((x) => {
        // filter out the link to Actueel on all pages but / and the /actueel/.../... pages
        if (pathname === '/') return true;
        if (pathname.includes('actueel')) return true;
        return x.href !== '/';
      });

    return breadcrumbs;
  }, [ctx, pathname, query, siteText]);
}
