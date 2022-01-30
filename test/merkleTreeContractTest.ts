import { expect } from "chai";
import { ethers } from "ethers";
import { waffle } from "hardhat";

import MessageBoard from "../artifacts/contracts/MessageBoard.sol/MessageBoard.json";
import {keccak256} from "ethereumjs-util";
import {MerkleNode, Hash} from "../dapp/merkleNode";
import {MerkleTree} from "../dapp/merkleTree";

const { provider, deployMockContract, deployContract } = waffle;

// export enum Position {
//   LEFT,
//   RIGHT,
// }
// export interface IncProof {
//   position: Position;
//   nodeHash: string;
// }
//

describe("Merkle Tree Solidity Tests ", function () {
    let messageBoard: ethers.Contract;
    let adminWallet: ethers.Wallet;
    let userAccount1: ethers.Wallet;
    let userAccount2: ethers.Wallet;
    let userAccount3: ethers.Wallet;
    let userAccount4: ethers.Wallet;
    let userAccount5: ethers.Wallet;
    let userAccount6: ethers.Wallet;
    let userAccount7: ethers.Wallet;

    let userAddress1: string;
    let userAddress2: string;
    let userAddress3: string;
    let userAddress4: string;
    let userAddress5: string;
    let userAddress6: string;

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
            userAccount7,
        ] = provider.getWallets();

        userAddress1 = await userAccount1.getAddress();
        userAddress2 = await userAccount2.getAddress();
        userAddress3 = await userAccount3.getAddress();
        userAddress4 = await userAccount4.getAddress();
        userAddress5 = await userAccount5.getAddress();
        userAddress6 = await userAccount6.getAddress();

        const leaves = [
              userAddress1,
              userAddress2,
              userAddress3,
              userAddress4,
              userAddress5,
              userAddress6,
            ].map((account) =>
              MerkleNode.of(keccak256(Buffer.from(account)))
            );
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
        const iproof = tree.getInclusionProof(
            keccak256(Buffer.from(userAddress1))
        );

        await expect(messageBoard.twitMessage(iproof, "Hello World")).to.be.revertedWith(
            "access denied, you haven't any permission to twit message.");
    });

    it("Should admin could user add to board", async () => {
        // when
        await expect(messageBoard.connect(adminWallet).addUser(userAddress1))
          .to.be.emit(messageBoard, "NewUserAdd")
          .withArgs(userAddress1);
    });

    it("Should user account1 send message to board", async () => {
        // given
        let treeOne = MerkleTree.from([ MerkleNode.of(keccak256(Buffer.from(userAddress1)))])
        const iproof = treeOne.getInclusionProof(
            keccak256(Buffer.from(userAddress1))
        );

        await expect(messageBoard.twitMessage(iproof, "Hello World"))
            .to.be.emit(messageBoard, "NewTwitMessage")
            .withArgs(userAddress1, "Hello World")
    });

});
