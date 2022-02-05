import { expect } from "chai";
import { keccak256, stripHexPrefix } from "ethereumjs-util";
import { MerkleTree } from "../dapp/merkleTree";
import { MerkleNode } from "../dapp/merkleNode";
import { MerkleTreeOptimized } from "../dapp/merkleTreeOptimized";
import { IncProof } from "./merkleTreeContractTest";

describe("Merkle Tree Js Tests", function () {
  it("Should build merkle tree from data", async function () {
    // given
    const leaves = ["a", "b", "c", "d", "e", "f"].map((x) =>
      MerkleNode.of(keccak256(Buffer.from(x)))
    );
    const tree = MerkleTree.from(leaves);
    tree.AppendLeafNode(MerkleNode.of(keccak256(Buffer.from("g"))));

    // when
    const proof = tree.getInclusionProof(keccak256(Buffer.from("e")));

    // then
    expect(
      MerkleTree.verifyProof(
        proof,
        keccak256(Buffer.from("e")),
        tree.getRootNode().hash
      )
    ).to.be.equal(true);
  });

  it("Should build merkle root from data", async function () {
    // given
    const leaves = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
    ].map((x) => MerkleNode.of(keccak256(Buffer.from(x))));
    const merkleTree = MerkleTree.from(leaves);

    const leafA = keccak256(Buffer.from("a"));
    const leafB = keccak256(Buffer.from("b"));
    const leafC = keccak256(Buffer.from("c"));
    const leafD = keccak256(Buffer.from("d"));
    const leafE = keccak256(Buffer.from("e"));
    const leafF = keccak256(Buffer.from("f"));
    const leafG = keccak256(Buffer.from("g"));
    const leafH = keccak256(Buffer.from("h"));
    const leafI = keccak256(Buffer.from("i"));
    const leafJ = keccak256(Buffer.from("j"));
    const leafK = keccak256(Buffer.from("k"));
    const leafL = keccak256(Buffer.from("l"));
    const leafM = keccak256(Buffer.from("m"));
    const leafN = keccak256(Buffer.from("n"));
    const leafO = keccak256(Buffer.from("o"));
    const leafP = keccak256(Buffer.from("p"));
    const leafQ = keccak256(Buffer.from("q"));
    const leafR = keccak256(Buffer.from("r"));
    const leafS = keccak256(Buffer.from("s"));
    const leafT = keccak256(Buffer.from("t"));
    const leafU = keccak256(Buffer.from("u"));
    const leafV = keccak256(Buffer.from("v"));
    const leafW = keccak256(Buffer.from("w"));
    const leafX = keccak256(Buffer.from("x"));
    const leafY = keccak256(Buffer.from("y"));
    const leafZ = keccak256(Buffer.from("z"));
    const leaf1 = keccak256(Buffer.from("1"));
    const leaf2 = keccak256(Buffer.from("2"));
    const leaf3 = keccak256(Buffer.from("3"));
    const leaf4 = keccak256(Buffer.from("4"));
    const leaf5 = keccak256(Buffer.from("5"));
    const leaf6 = keccak256(Buffer.from("6"));
    const leaf7 = keccak256(Buffer.from("7"));
    const leaf8 = keccak256(Buffer.from("8"));
    const leaf9 = keccak256(Buffer.from("9"));
    const leaf10 = keccak256(Buffer.from("10"));

    const treeOptimized = new MerkleTreeOptimized(leafA);
    treeOptimized.AppendLeaf(leafB);
    treeOptimized.AppendLeaf(leafC);
    treeOptimized.AppendLeaf(leafD);
    treeOptimized.AppendLeaf(leafE);
    treeOptimized.AppendLeaf(leafF);
    treeOptimized.AppendLeaf(leafG);
    treeOptimized.AppendLeaf(leafH);
    treeOptimized.AppendLeaf(leafI);
    treeOptimized.AppendLeaf(leafJ);
    treeOptimized.AppendLeaf(leafK);
    treeOptimized.AppendLeaf(leafL);
    treeOptimized.AppendLeaf(leafM);
    treeOptimized.AppendLeaf(leafN);
    treeOptimized.AppendLeaf(leafO);
    treeOptimized.AppendLeaf(leafP);
    treeOptimized.AppendLeaf(leafQ);
    treeOptimized.AppendLeaf(leafR);
    treeOptimized.AppendLeaf(leafS);
    treeOptimized.AppendLeaf(leafT);
    treeOptimized.AppendLeaf(leafU);
    treeOptimized.AppendLeaf(leafV);
    treeOptimized.AppendLeaf(leafW);
    treeOptimized.AppendLeaf(leafX);
    treeOptimized.AppendLeaf(leafY);
    treeOptimized.AppendLeaf(leafZ);
    treeOptimized.AppendLeaf(leaf1);
    treeOptimized.AppendLeaf(leaf2);
    treeOptimized.AppendLeaf(leaf3);
    treeOptimized.AppendLeaf(leaf4);
    treeOptimized.AppendLeaf(leaf5);
    treeOptimized.AppendLeaf(leaf6);
    treeOptimized.AppendLeaf(leaf7);
    treeOptimized.AppendLeaf(leaf8);
    treeOptimized.AppendLeaf(leaf9);
    treeOptimized.AppendLeaf(leaf10);

    // when
    const aProof = merkleTree.getInclusionProof(keccak256(Buffer.from("a")));
    const bProof = merkleTree.getInclusionProof(keccak256(Buffer.from("b")));
    const cProof = merkleTree.getInclusionProof(keccak256(Buffer.from("c")));
    const dProof = merkleTree.getInclusionProof(keccak256(Buffer.from("d")));
    const eProof = merkleTree.getInclusionProof(keccak256(Buffer.from("e")));
    const fProof = merkleTree.getInclusionProof(keccak256(Buffer.from("f")));
    const gProof = merkleTree.getInclusionProof(keccak256(Buffer.from("g")));
    const hProof = merkleTree.getInclusionProof(keccak256(Buffer.from("h")));
    const iProof = merkleTree.getInclusionProof(keccak256(Buffer.from("i")));
    const jProof = merkleTree.getInclusionProof(keccak256(Buffer.from("j")));
    const kProof = merkleTree.getInclusionProof(keccak256(Buffer.from("k")));
    const lProof = merkleTree.getInclusionProof(keccak256(Buffer.from("l")));
    const mProof = merkleTree.getInclusionProof(keccak256(Buffer.from("m")));
    const nProof = merkleTree.getInclusionProof(keccak256(Buffer.from("n")));
    const oProof = merkleTree.getInclusionProof(keccak256(Buffer.from("o")));
    const pProof = merkleTree.getInclusionProof(keccak256(Buffer.from("p")));
    const qProof = merkleTree.getInclusionProof(keccak256(Buffer.from("q")));
    const rProof = merkleTree.getInclusionProof(keccak256(Buffer.from("r")));
    const sProof = merkleTree.getInclusionProof(keccak256(Buffer.from("s")));
    const tProof = merkleTree.getInclusionProof(keccak256(Buffer.from("t")));
    const uProof = merkleTree.getInclusionProof(keccak256(Buffer.from("u")));
    const vProof = merkleTree.getInclusionProof(keccak256(Buffer.from("v")));
    const wProof = merkleTree.getInclusionProof(keccak256(Buffer.from("w")));
    const xProof = merkleTree.getInclusionProof(keccak256(Buffer.from("x")));
    const yProof = merkleTree.getInclusionProof(keccak256(Buffer.from("y")));
    const zProof = merkleTree.getInclusionProof(keccak256(Buffer.from("z")));
    const _1Proof = merkleTree.getInclusionProof(keccak256(Buffer.from("1")));
    const _2Proof = merkleTree.getInclusionProof(keccak256(Buffer.from("2")));
    const _3Proof = merkleTree.getInclusionProof(keccak256(Buffer.from("3")));
    const _4Proof = merkleTree.getInclusionProof(keccak256(Buffer.from("4")));
    const _5Proof = merkleTree.getInclusionProof(keccak256(Buffer.from("5")));
    const _6Proof = merkleTree.getInclusionProof(keccak256(Buffer.from("6")));
    const _7Proof = merkleTree.getInclusionProof(keccak256(Buffer.from("7")));
    const _8Proof = merkleTree.getInclusionProof(keccak256(Buffer.from("8")));
    const _9Proof = merkleTree.getInclusionProof(keccak256(Buffer.from("9")));
    const _10Proof = merkleTree.getInclusionProof(keccak256(Buffer.from("10")));

    // then
    expect(merkleTree.getRootNode().hash.toString("hex")).to.be.equal(
      treeOptimized.merkleRoot.toString("hex")
    );
    expect(
      MerkleTreeOptimized.verifyProof(aProof, leafA, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(bProof, leafB, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(cProof, leafC, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(dProof, leafD, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(eProof, leafE, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(fProof, leafF, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(gProof, leafG, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(hProof, leafH, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(iProof, leafI, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(jProof, leafJ, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(kProof, leafK, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(lProof, leafL, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(mProof, leafM, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(nProof, leafN, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(oProof, leafO, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(pProof, leafP, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(qProof, leafQ, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(rProof, leafR, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(sProof, leafS, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(tProof, leafT, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(uProof, leafU, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(vProof, leafV, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(wProof, leafW, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(xProof, leafX, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(yProof, leafY, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(zProof, leafZ, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(_1Proof, leaf1, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(_2Proof, leaf2, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(_3Proof, leaf3, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(_4Proof, leaf4, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(_5Proof, leaf5, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(_6Proof, leaf6, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(_7Proof, leaf7, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(_8Proof, leaf8, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(_9Proof, leaf9, treeOptimized.merkleRoot)
    ).to.equal(true);
    expect(
      MerkleTreeOptimized.verifyProof(
        _10Proof,
        leaf10,
        treeOptimized.merkleRoot
      )
    ).to.equal(true);
  });
});
