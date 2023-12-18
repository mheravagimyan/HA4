const hre = require("hardhat");

async function main() {
  const ERC20Token = await hre.ethers.getContractFactory("ERC20Token");
  const token = await ERC20Token.deploy("ERC20 Token", "ERCT", 1000000000);

  await token.waitForDeployment();

  console.log(
    `ERC20Token contract deployed to address ${await token.getAddress()}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
