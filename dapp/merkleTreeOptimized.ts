import { Hash } from "./merkleNode";
import { keccak256 } from "ethereumjs-util";

/**
 * This algorithm of merkle tree optimized for used in solidity
 */
export class MerkleTreeOptimized {
  private leafNodeCount: number = 0;

  private treeHeight: number = 0;

  private rootNodes: Array<Hash> = [];

  private lastLeafNode: Hash;

  constructor(leafHash: Hash) {
    this.lastLeafNode = Buffer.from("");
    this.AppendLeaf(leafHash);
  }

  public AppendLeaf(leafHash: Hash) {
    if (this.leafNodeCount === 0) {
      this.leafNodeCount++;
      this.rootNodes[1] = leafHash;
      this.lastLeafNode = leafHash;
      this.treeHeight++;
      return;
    }

    let newMerkleRoot;
    let isTreeHeightChanged = false;
    this.leafNodeCount++;

    if (2 ** this.treeHeight < this.leafNodeCount) {
      this.treeHeight++;
      isTreeHeightChanged = true;
    }

    // check left and right position
    if (this.leafNodeCount % 2 !== 0) {
      newMerkleRoot = leafHash;
    } else {
      newMerkleRoot = keccak256(Buffer.concat([this.lastLeafNode, leafHash]));
    }

    for (let h = 1; h < this.treeHeight; h++) {
      if (isTreeHeightChanged && h < this.treeHeight - 1) {
        this.rootNodes[h] = newMerkleRoot;
        continue;
      }
      newMerkleRoot = keccak256(
        Buffer.concat([this.rootNodes[h], newMerkleRoot])
      );
    }

    this.rootNodes[this.treeHeight] = newMerkleRoot;
    this.lastLeafNode = leafHash;
  }

  get merkleRoot(): Hash {
    return this.rootNodes[this.treeHeight];
  }
}
