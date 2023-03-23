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
    // Redirects for former topical pages GM/VR -> dedicated GM/VR page
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
      destination: `/landelijk/ziekenhuizen-en-zorg`,
      permanent: true,
    },
    {
      source: '/landelijk/intensive-care-opnames',
      destination: `/landelijk/ziekenhuizen-en-zorg`,
      permanent: true,
    },
    // Redirects for unpublished articles - COR-1232
    {
      source: '/artikelen/wat-betekent-de-britse-variant-voor-nederland',
      destination: '/artikelen',
      permanent: true,
    },
    {
      source: '/artikelen/hoe-weten-we-hoeveel-besmettelijke-mensen-er-zijn',
      destination: '/artikelen',
      permanent: true,
    },
    {
      source: '/artikelen/waarom-mogelijke-situaties-van-besmetting-niet-altijd-te-zien-zijn-op-het-dashboard',
      destination: '/artikelen',
      permanent: true,
    },
  ];
}

module.exports = {
  redirects,
};
