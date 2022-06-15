async function rewrites() {
  return {
    beforeFiles: [
      {
        source: '/gemeente/(g|G)(m|M):nr(\\d{4})/:page*',
        destination: '/gemeente/GM:nr/:page*',
      },
      {
        source: '/veiligheidsregio/(v|V)(r|R):nr(\\d{2})/:page*',
        destination: '/veiligheidsregio/VR:nr/:page*',
      },
    ],
  };
}

module.exports = {
  rewrites,
};
