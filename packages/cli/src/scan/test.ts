const siteText = {
  key: {
    key2: {
      key3: 'yes',
    },
  },
};

const instance = siteText.key;
const instance2 = instance.key2;
const instance3 = instance2.key3;

const instance4 = siteText.key;
const instance5 = siteText.key;
const instance6 = siteText.key.key2;
const instance7 = siteText.key.key2.key3;

export {};
