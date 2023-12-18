const { expect } = require("chai");
const { ethers, web3, Web3 } = require("hardhat");

describe(" ERC20Token", function() {
  let sender;
  let token;

  beforeEach(async function () {  

    [sender, receiver1, receiver2] = await ethers.getSigners();
    const  ERC20Token = await ethers.getContractFactory("ERC20Token", sender);
    token = await ERC20Token.deploy("ERC20 Token", "ERCT", 1000000000);
    await token.waitForDeployment();

    await token.mint(sender, 100); 
  });

  describe("Transfer", function () {
    it("Should be possible to transfer funds from sender to receiver correct!", async function () {
      await token.transfer(receiver1.address, 20);
      expect(await token.balanceOf(receiver1.address)).to.eq(20);
      expect(await token.balanceOf(sender.address)).to.eq(80);
      await token.transfer(receiver2.address, 30);
      expect(await token.balanceOf(receiver2.address)).to.eq(30);
      expect(await token.balanceOf(sender.address)).to.eq(50);
    });
  });
});