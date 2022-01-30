import { MerkleNode, Hash } from "./merkleNode";
import { keccak256 } from "ethereumjs-util";
const treeify = require("object-treeify");

export enum Position {
  LEFT,
  RIGHT,
}

export class InclusionProof {
  public position: Position;
  public nodeHash: Hash;

  constructor(position: Position, hash: Hash) {
    this.position = position;
    this.nodeHash = hash;
  }
}

export class InclusionProof2 {
  public position: Position;
  public nodeHash: string;

  constructor(position: Position, hash: string) {
    this.position = position;
    this.nodeHash = hash;
  }
}


export class MerkleTree {
  private _root: MerkleNode;

  private _leaves: Array<MerkleNode> = [];

  private _nodes: Array<MerkleNode> = [];

  public static from(nodes: MerkleNode[]): MerkleTree {
    // @ts-ignore
    return new MerkleTree(nodes);
  }

  private constructor(nodes: Array<MerkleNode>) {
    this._root = MerkleNode.empty();
    this.buildTree(nodes);
  }

  private buildTree(leaves: Array<MerkleNode>) {
    this._leaves.push(...leaves);
    let nodes = leaves;
    while (nodes.length > 1) {
      nodes = this.buildMerkleTree(nodes);
      this._nodes.push(...nodes);
    }

    this._root = this._nodes[this._nodes.length - 1];
  }

  private buildMerkleTree(nodes: Array<MerkleNode>): Array<MerkleNode> {
    const parents: Array<MerkleNode> = [];
    for (let i = 0; i < nodes.length; i = i + 2) {
      if (i + 1 < nodes.length) {
        parents.push(MerkleNode.from(nodes[i], nodes[i + 1]));
      } else {
        parents.push(MerkleNode.from(nodes[i], null));
      }
    }
    return parents;
  }

  public AppendLeafNode(newLeaf: MerkleNode): void {
    this._leaves.push(newLeaf);

    if (this._leaves.length === 0) {
      this._root = newLeaf;
      return;
    }

    let nodes = this._leaves;
    this._nodes = [];
    while (nodes.length > 1) {
      nodes = this.buildMerkleTree(nodes);
      this._nodes.push(...nodes);
    }

    this._root = this._nodes[this._nodes.length - 1];
  }

  public AddNodeLeaves(nodes: Array<MerkleNode>): void {
    this.buildMerkleTree(nodes);
  }

  public findLeaf(hash: Hash): MerkleNode | null {
    let node = null;
    this._leaves.forEach((leaf) => {
      if (leaf.hash.equals(hash)) {
        node = leaf;
      }
    });
    return node;
  }

  public getInclusionProof(leafHash: Hash): Array<InclusionProof> {
    const hashProof: Array<InclusionProof> = [];
    const leafNode = this.findLeaf(leafHash);
    if (!leafNode) return [];

    if (this._leaves.length === 1) {
      return [{ position: Position.LEFT, nodeHash: leafNode.hash }];
    }

    this.doGetInclusionProof(hashProof, leafNode.parent, leafNode);
    return hashProof;
  }

  private doGetInclusionProof(
    hashProof: Array<InclusionProof>,
    parent: MerkleNode | null,
    child: MerkleNode | null
  ): void {
    if (parent) {
      const nextChild = parent.left === child ? parent.right : parent.left;
      const positionNode =
        parent.left === child ? Position.RIGHT : Position.LEFT;
      hashProof.push(<InclusionProof>{
        position: positionNode,
        nodeHash: nextChild?.hash,
      });
      // @ts-ignore
      this.doGetInclusionProof(hashProof, parent.parent, child.parent);
    }
  }

  public getRootNode(): MerkleNode {
    return this._root;
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
          : keccak256(Buffer.concat([computeHash, proof.nodeHash]));
    });

    return rootHash.equals(computeHash);
  }

  private traversTreeHierarchy(): object {
    return this.doTraversTree(this._root);
  }

  private doTraversTree(node: MerkleNode): object {
    let leftNode = null;
    let rightNode = null;
    const treeObj = { [node.hash.toString("hex")]: null };

    if (node.left !== null) {
      leftNode = this.doTraversTree(node.left);

      if (node.right !== null) {
        rightNode = this.doTraversTree(node.right);
      }
    }

    // @ts-ignore
    if (leftNode) {
      const leftNodeKey = Object.keys(leftNode)[0];
      // @ts-ignore
      const obj = { [leftNodeKey]: leftNode[leftNodeKey] };
      let rightNodeKey = null;
      if (rightNode) {
        rightNodeKey = Object.keys(rightNode)[0];
        // @ts-ignore
        obj[rightNodeKey] = rightNode[rightNodeKey];
      }

      const treeObjKey = Object.keys(treeObj)[0];
      // @ts-ignore
      treeObj[treeObjKey] = obj;
    }
    return treeObj;
  }

  public toString(): string {
    const tree = this.traversTreeHierarchy();
    return treeify(tree, {});
  }
}
