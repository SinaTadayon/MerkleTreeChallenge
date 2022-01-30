import { expect } from "chai";
import { keccak256 } from "ethereumjs-util";
import { MerkleTree } from "../dapp/merkleTree";
import { MerkleNode } from "../dapp/merkleNode";
import { MerkleTreeOptimized } from "../dapp/merkleTreeOptimized";

describe("Merkle Tree Js Tests", function () {
  it("Should build merkle tree from data", async function () {
    // given
    const leaves = ["a", "b", "c"].map((x) =>
      MerkleNode.of(keccak256(Buffer.from(x)))
    );
    const tree = MerkleTree.from(leaves);
    tree.AppendLeafNode(MerkleNode.of(keccak256(Buffer.from("d"))));

    // when
    const proof = tree.getInclusionProof(keccak256(Buffer.from("c")));

    // then
    expect(
      MerkleTree.verifyProof(
        proof,
        keccak256(Buffer.from("c")),
        tree.getRootNode().hash
      )
    ).to.be.equal(true);
  });

  it("Should build merkle root from data", async function () {
    // given
    const leafA = keccak256(Buffer.from("a"));
    const leafB = keccak256(Buffer.from("b"));
    const leafC = keccak256(Buffer.from("c"));
    const leafD = keccak256(Buffer.from("d"));
    const leafE = keccak256(Buffer.from("e"));

    // when
    const tree = new MerkleTreeOptimized(leafA);
    tree.AppendLeaf(leafB);
    tree.AppendLeaf(leafC);
    tree.AppendLeaf(leafD);

    // then
    expect(tree.merkleRoot.toString("hex")).to.be.equal(
      "68203f90e9d07dc5859259d7536e87a6ba9d345f2552b5b9de2999ddce9ce1bf"
    );

    // tree.AppendLeaf(leafE);
  });
});
