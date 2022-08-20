const config = {
  screens: {
    Splash: {
      path: "signup/:id",
      parse: {
        id: (id)=> `${id}`,
      },
    },
  },
};

const Linking = {
  prefixes: ["https://rojgar.biz"],
  config,
};

export default Linking;