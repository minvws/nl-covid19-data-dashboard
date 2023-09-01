const { gmRedirects } = require('./gmRedirects');

async function redirects() {
  return [
    {
      source: '/over-risiconiveaus',
      destination: '/',
      permanent: false,
    },
    {
      source: '/actueel',
      destination: '/',
      permanent: false,
    },
    {
      source: '/apple-touch-icon.png',
      destination: '/images/touch-icon.png',
      permanent: false,
    },
    {
      source: '/apple-touch-icon-120x120-precomposed.png',
      destination: '/images/touch-icon.png',
      permanent: false,
    },
    {
      source: '/apple-touch-icon-120x120.png',
      destination: '/images/touch-icon.png',
      permanent: false,
    },
    {
      source: '/apple-touch-icon-152x152-precomposed.png',
      destination: '/images/touch-icon.png',
      permanent: false,
    },
    {
      source: '/apple-touch-icon-152x152.png',
      destination: '/images/touch-icon.png',
      permanent: false,
    },
    {
      source: '/apple-touch-icon-precomposed.png',
      destination: '/images/touch-icon.png',
      permanent: false,
    },
    {
      source: '/veiligheidsregio/:gm(gm|GM|gM|Gm):nr(\\d{4}):slash(/{0,1}):page*',
      destination: '/gemeente/GM:nr',
      permanent: false,
    },
    // Redirects for former topical pages GM -> dedicated GM page
    {
      source: '/actueel/gemeente/:gm(gm|GM|gM|Gm):nr(\\d{4}):slash(/{0,1}):page*',
      destination: '/gemeente/GM:nr',
      permanent: false,
    },
    // Redirects for OSIRIS change
    {
      source: '/landelijk/verpleeghuiszorg',
      destination: '/landelijk/kwetsbare-groepen-70-plussers',
      permanent: true,
    },
    // Redirects for municipal reorganizations
    ...gmRedirects.map(({ from, to }) => ({
      source: `/gemeente/:gm(gm|GM|gM|Gm):nr(${from.join('|')})/:page*`,
      destination: `/gemeente/GM${to}/:page*`,
      permanent: true,
    })),
    // Redirects for the NL pages
    {
      source: '/landelijk/ziekenhuis-opnames',
      destination: '/landelijk/ziekenhuizen-in-beeld',
      permanent: true,
    },
    // Redirects for the archived pages (COR-1420)
    // NL level
    {
      source: '/landelijk/intensive-care-opnames',
      destination: '/landelijk/ziekenhuizen-in-beeld',
      permanent: true,
    },
    {
      source: '/landelijk/ziekenhuizen-en-zorg',
      destination: '/landelijk/ziekenhuizen-in-beeld',
      permanent: true,
    },
    {
      source: '/landelijk/positief-geteste-mensen',
      destination: '/landelijk/positieve-testen',
      permanent: true,
    },
    {
      source: '/landelijk/thuiswonende-ouderen',
      destination: '/landelijk/thuiswonende-70-plussers',
      permanent: true,
    },
    {
      source: '/landelijk/verdenkingen-huisartsen',
      destination: '/landelijk/klachten-bij-huisartsen',
      permanent: true,
    },
    // GM level
    {
      source: '/gemeente/:code/positief-geteste-mensen',
      destination: '/gemeente/:code/positieve-testen',
      permanent: true,
    },
    // Redirect for COR-1705
    {
      source: '/landelijk/testen',
      destination: '/landelijk/infectieradar',
      permanent: true,
    },
  ];
}

module.exports = {
  redirects,
};
