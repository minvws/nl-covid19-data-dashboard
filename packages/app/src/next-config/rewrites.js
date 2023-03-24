async function rewrites() {
  return {
    beforeFiles: [
      {
        source: '/gemeente/(g|G)(m|M):nr(\\d{4})/:page*',
        destination: '/gemeente/GM:nr/:page*',
      },
    ],
  };
}

module.exports = {
  rewrites,
};
