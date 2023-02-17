import { ethers } from "hardhat";

async function deployLock() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  const lockedAmount = ethers.utils.parseEther("1");

  const Lock = await ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

  await lock.deployed();

  console.log(
    `Lock with 1 ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
  );
}
async function deployMyToken() {
  const totalSupply = ethers.utils.parseEther("10000");

  const MyToken = await ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy(totalSupply);

  await myToken.deployed();

  console.log(`MyToken deployed to ${myToken.address}, total supply 10000`);
}
async function deployTypes() {
  const Types = await ethers.getContractFactory("Types");
  const types = await Types.deploy();

  await types.deployed();

  console.log(`Types deployed to ${types.address}`);
}

async function main() {
  await deployLock();
  await deployMyToken();
  await deployTypes();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
