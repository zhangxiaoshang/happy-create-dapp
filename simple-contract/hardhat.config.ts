import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.17",

  networks: {
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/IOZ6yEPqzaUSbJPSezDnLy7rddYLWO4i",
      chainId: 5,
      accounts: [
        "9112117a00de9e070f420bdc17271f2901e55eebec19e1588285778d084be6c4", // mrc-admin 0x4729AfEdb3f552cE06Ff7Be42870933B3aA079c9
      ],
    },
  },
};

export default config;
