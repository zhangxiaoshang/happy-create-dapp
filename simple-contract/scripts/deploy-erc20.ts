import { ethers } from "hardhat";

async function deployMyToken() {
  const totalSupply = ethers.utils.parseEther("10000");

  const MyToken = await ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy(totalSupply);

  await myToken.deployed();

  console.log(`MyToken deployed to ${myToken.address}, total supply 10000`);
}

async function main() {
  await deployMyToken();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
