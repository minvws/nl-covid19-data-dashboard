export const headers = async () => {
  return [
    {
      source: '/:all*(svg|jpg|png|woff|woff2)',
      locale: false,
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=9999999999, must-revalidate',
        },
      ],
    },
  ];
};
