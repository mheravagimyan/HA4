const hre = require("hardhat");

async function main() {
  const Grade = await hre.ethers.getContractFactory("Grade");
  const grade = await Grade.deploy();

  await grade.waitForDeployment();

  console.log(
    `Grade contract deployed to address ${await grade.getAddress()}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
