import { expect } from "chai";
import { ethers } from "ethers";
import { waffle } from "hardhat";

import MessageBoard from "../artifacts/contracts/MessageBoard.sol/MessageBoard.json";
import { keccak256, stripHexPrefix } from "ethereumjs-util";
import { MerkleNode } from "../dapp/merkleNode";
import { MerkleTree } from "../dapp/merkleTree";

const { provider, deployContract } = waffle;

export enum Position {
  LEFT,
  RIGHT,
}

export interface IncProof {
  position: Position;
  nodeHash: string;
}

describe("Merkle Tree Solidity Tests ", function () {
  let messageBoard: ethers.Contract;
  let adminWallet: ethers.Wallet;
  let userAccount1: ethers.Wallet;
  let userAccount2: ethers.Wallet;
  let userAccount3: ethers.Wallet;
  let userAccount4: ethers.Wallet;
  let userAccount5: ethers.Wallet;
  let userAccount6: ethers.Wallet;

  let tree: any;
  before(async () => {
    [
      adminWallet,
      userAccount1,
      userAccount2,
      userAccount3,
      userAccount4,
      userAccount5,
      userAccount6,
    ] = provider.getWallets();

    const leaves = [
      userAccount1,
      userAccount2,
      userAccount3,
      userAccount4,
      userAccount5,
      userAccount6,
    ].map((account) => {
      // console.log(`account Address: ${account.address}`);
      return MerkleNode.of(
        keccak256(Buffer.from(stripHexPrefix(account.address), "hex"))
      );
    });
    tree = MerkleTree.from(leaves);
    messageBoard = await deployContract(adminWallet, MessageBoard);
  });

  it("Should deployment message board success", async () => {
    expect(await messageBoard.messageBoard()).to.be.equal(
      "Welcome to Message Board !!!"
    );
  });

  it("Should user account1 could not send message to board", async () => {
    // given

    const leaf = MerkleNode.of(
      keccak256(Buffer.from(stripHexPrefix(userAccount1.address), "hex"))
    );
    const oneLeafTree = MerkleTree.from([leaf]);
    const incProofs = oneLeafTree
      .getInclusionProof(keccak256(Buffer.from(userAccount1.address)))
      .map((proof) => {
        return {
          position: proof.position,
          nodeHash: "0x" + proof.nodeHash.toString("hex"),
        };
      });

    await expect(
      messageBoard.twitMessage(incProofs, "Hello World")
    ).to.be.revertedWith(
      "access denied, you haven't any permission to twit message."
    );
  });

  it("Should admin add user account to board", async () => {
    // when and then
    await expect(
      messageBoard.connect(adminWallet).addUser(userAccount1.address)
    )
      .to.be.emit(messageBoard, "NewUserAdd")
      .withArgs(userAccount1.address);
  });

  it("Should user account1 send message to board", async () => {
    // given
    const treeOne = MerkleTree.from([
      MerkleNode.of(
        keccak256(Buffer.from(stripHexPrefix(userAccount1.address), "hex"))
      ),
    ]);

    const incProofs = treeOne
      .getInclusionProof(
        keccak256(Buffer.from(stripHexPrefix(userAccount1.address), "hex"))
      )
      .map((proof) => {
        return {
          position: proof.position,
          nodeHash: "0x" + proof.nodeHash.toString("hex"),
        };
      });

    // when
    await expect(
      messageBoard.connect(userAccount1).twitMessage(incProofs, "Hello World 1")
    )
      .to.be.emit(messageBoard, "NewTwitMessage")
      .withArgs(userAccount1.address, "Hello World 1");

    // then
    expect(await messageBoard.messageBoard()).to.be.equal("Hello World 1");
  });

  it("Should admin add user account2 to board", async () => {
    // when and then
    await expect(
      messageBoard.connect(adminWallet).addUser(userAccount2.address)
    )
      .to.be.emit(messageBoard, "NewUserAdd")
      .withArgs(userAccount2.address);
  });

  it("Should user account2 send message to board", async () => {
    // given
    const treeTwoNodes = MerkleTree.from([
      MerkleNode.of(
        keccak256(Buffer.from(stripHexPrefix(userAccount1.address), "hex"))
      ),
      MerkleNode.of(
        keccak256(Buffer.from(stripHexPrefix(userAccount2.address), "hex"))
      ),
    ]);

    const iproof = treeTwoNodes.getInclusionProof(
      keccak256(Buffer.from(stripHexPrefix(userAccount2.address), "hex"))
    );

    await expect(
      messageBoard.connect(userAccount2).twitMessage(iproof, "Hello World 2")
    )
      .to.be.emit(messageBoard, "NewTwitMessage")
      .withArgs(userAccount2.address, "Hello World 2");

    // then
    expect(await messageBoard.messageBoard()).to.be.equal("Hello World 2");
  });

  it("Should admin add user accounts to board", async () => {
    // when and then
    await expect(
      messageBoard.connect(adminWallet).addUser(userAccount3.address)
    )
      .to.be.emit(messageBoard, "NewUserAdd")
      .withArgs(userAccount3.address);

    await expect(
      messageBoard.connect(adminWallet).addUser(userAccount4.address)
    )
      .to.be.emit(messageBoard, "NewUserAdd")
      .withArgs(userAccount4.address);

    await expect(
      messageBoard.connect(adminWallet).addUser(userAccount5.address)
    )
      .to.be.emit(messageBoard, "NewUserAdd")
      .withArgs(userAccount5.address);

    await expect(
      messageBoard.connect(adminWallet).addUser(userAccount6.address)
    )
      .to.be.emit(messageBoard, "NewUserAdd")
      .withArgs(userAccount6.address);
  });

  it("Should user account5 send message to board", async () => {
    // given
    const treeSixNodes = MerkleTree.from([
      MerkleNode.of(
        keccak256(Buffer.from(stripHexPrefix(userAccount1.address), "hex"))
      ),
      MerkleNode.of(
        keccak256(Buffer.from(stripHexPrefix(userAccount2.address), "hex"))
      ),
      MerkleNode.of(
        keccak256(Buffer.from(stripHexPrefix(userAccount3.address), "hex"))
      ),
      MerkleNode.of(
        keccak256(Buffer.from(stripHexPrefix(userAccount4.address), "hex"))
      ),
      MerkleNode.of(
        keccak256(Buffer.from(stripHexPrefix(userAccount5.address), "hex"))
      ),
      MerkleNode.of(
        keccak256(Buffer.from(stripHexPrefix(userAccount6.address), "hex"))
      ),
    ]);

    // const iproof = treeSixNodes.getInclusionProof(
    //   keccak256(Buffer.from(stripHexPrefix(userAccount5.address), "hex"))
    // );

    const incProofs = treeSixNodes
      .getInclusionProof(
        keccak256(Buffer.from(stripHexPrefix(userAccount5.address), "hex"))
      )
      .map((proof) => {
        return {
          position: proof.position,
          nodeHash: proof.nodeHash
            ? "0x" + proof.nodeHash.toString("hex")
            : "0x0000000000000000000000000000000000000000000000000000000000000000",
        };
      });

    await expect(
      messageBoard.connect(userAccount5).twitMessage(incProofs, "Hello World 5")
    )
      .to.be.emit(messageBoard, "NewTwitMessage")
      .withArgs(userAccount5.address, "Hello World 5");

    // then
    expect(await messageBoard.messageBoard()).to.be.equal("Hello World 5");
  });
});
