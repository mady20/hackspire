require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/6ElE4FVw84RYItOroD5Ebi4KMy6GB0CB',
      accounts: ['b16cbf550166731462ec11e3019993fc97ee8d391aa389900531f004d2afa00a'],
    },
  },
};