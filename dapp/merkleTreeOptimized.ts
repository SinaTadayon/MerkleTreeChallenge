import { Hash } from "./merkleNode";
import { keccak256 } from "ethereumjs-util";
import { InclusionProof, Position } from "./merkleTree";

/**
 * This algorithm of merkle tree optimized for used in solidity
 */
export class MerkleTreeOptimized {
  private leafNodeCount: number = 0;

  private treeHeight: number = 0;

  private rootNodes: Array<Hash> = [];

  constructor(leafHash: Hash) {
    this.AppendLeaf(leafHash);
  }

  public AppendLeaf(leafHash: Hash) {
    let newMerkleRoot;
    let isOdd = false;
    this.leafNodeCount++;

    if (2 ** this.treeHeight < this.leafNodeCount) {
      this.treeHeight++;
    }

    // check left and right position
    if (this.leafNodeCount % 2 !== 0) {
      newMerkleRoot = leafHash;
      isOdd = true;
    } else {
      newMerkleRoot = keccak256(Buffer.concat([this.rootNodes[0], leafHash]));
    }

    for (let h = 1; h < this.treeHeight; h++) {
      // calculate merkle root
      const upNodeReminder = this.leafNodeCount % 2 ** (h + 1);
      if (upNodeReminder === 0 || upNodeReminder > 2 ** h) {
        newMerkleRoot = keccak256(
          Buffer.concat([this.rootNodes[h], newMerkleRoot])
        );
      }

      // update root node h
      else if (upNodeReminder <= 2 ** h) {
        if (h === 1 && !isOdd) {
          this.rootNodes[h] = newMerkleRoot;
        } else {
          const reminder = this.leafNodeCount % 2 ** h;
          if (reminder === 0 || reminder > 2 ** h / 2) {
            this.rootNodes[h] = newMerkleRoot;
          }
        }
      }
    }

    this.rootNodes[this.treeHeight] = newMerkleRoot;
    this.rootNodes[0] = leafHash;
  }

  public static verifyProof(
    inclusionProof: Array<InclusionProof>,
    leafHash: Hash,
    rootHash: Hash
  ): boolean {
    let computeHash = leafHash;
    inclusionProof.forEach((proof) => {
      computeHash =
        proof.position === Position.LEFT
          ? keccak256(Buffer.concat([proof.nodeHash, computeHash]))
          : proof.nodeHash
          ? keccak256(Buffer.concat([computeHash, proof.nodeHash]))
          : computeHash;
    });

    return rootHash.equals(computeHash);
  }

  get merkleRoot(): Hash {
    // @ts-ignore
    return this.rootNodes[this.treeHeight];
  }
}
