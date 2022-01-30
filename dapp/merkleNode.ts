import { keccak256 } from "ethereumjs-util";

export type Hash = Buffer;

export class MerkleNode {
  /**
   * Left subtree
   */
  private _left: MerkleNode | null;

  /**
   * Right subtree
   */
  private _right: MerkleNode | null;

  /**
   * Parent subtree
   */
  private _parent: MerkleNode | null;

  /**
   * Hash that is either provide or Compute
   */
  private _hash: Hash;

  /**
   * Create leaf Node factory from keccak 256
   */
  public static of(dataHash: Hash): MerkleNode {
    return new MerkleNode(dataHash);
  }

  /**
   * Create leaf Node factory
   */
  public static ofData(data: string): MerkleNode {
    return new MerkleNode(keccak256(Buffer.from(data)));
  }

  /**
   * Create Parent Node factory
   * @param leftNode
   * @param rightNode
   * @constructor default constructor
   */
  public static from(
    leftNode: MerkleNode,
    rightNode: MerkleNode | null
  ): MerkleNode {
    const parentNode = new MerkleNode(null);
    parentNode.initParentNode(leftNode, rightNode);
    return parentNode;
  }

  public static empty(): MerkleNode {
    return new MerkleNode(null);
  }

  private constructor(hash: any) {
    this._hash = hash;
    this._right = null;
    this._left = null;
    this._parent = null;
  }

  public setLeftNode(leftNode: MerkleNode) {
    if (!leftNode) return;
    this._left = leftNode;
    this._left._parent = this;
    this.computeHash();
  }

  public setRightNode(rightNode: MerkleNode) {
    this._right = rightNode;
    if (rightNode) this._right._parent = this;
    this.computeHash();
  }

  public initParentNode(leftNode: MerkleNode, rightNode: MerkleNode | null) {
    this._left = leftNode;
    this._left._parent = this;
    this._right = rightNode;
    if (this._right) this._right._parent = this;
    this.computeHash();
  }

  public isLeaf(): boolean {
    return !this._left && !this._right;
  }

  /**
   * Computes the hash based on the node bottom-up . If no right child
   * exists, do not repeat the left node, but carry the left node's hash up.
   */
  public computeHash() {
    if (this._left && this._right) {
      this._hash = keccak256(
        Buffer.concat([this._left._hash, this._right._hash])
      );
    } else if (this._left) {
      this._hash = this._left._hash;
    }
  }

  get left(): MerkleNode | null {
    return this._left;
  }

  get right(): MerkleNode | null {
    return this._right;
  }

  get parent(): MerkleNode | null {
    return this._parent;
  }

  get hash(): Hash {
    return this._hash;
  }

  public toString(): string {
    return this._hash.toString();
  }
}
