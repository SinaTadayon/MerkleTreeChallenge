//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.11;

abstract contract MerkleTree {

    /// support about 2^32 users whitelist
    bytes32[32] internal _rootNodes;

    bytes32 internal _lastLeafNode;

    uint32 internal _leafNodeCount;

    uint8 internal _treeHeight;


    function _appendUserAddress(bytes32 addressHash) internal {
        if (_leafNodeCount == 0) {
            _leafNodeCount++;
            _rootNodes[1] = addressHash;
            _lastLeafNode = addressHash;
            _treeHeight++;
            return;
        }

        bytes32 newMerkleRoot;
        bool isTreeHeightChanged = false;
        _leafNodeCount++;

        if (2 ** _treeHeight < _leafNodeCount) {
            _treeHeight++;
            isTreeHeightChanged = true;
        }

        // check left and right position
        if (_leafNodeCount % 2 != 0) {
            newMerkleRoot = addressHash;
        } else {
            newMerkleRoot = keccak256(abi.encodePacked(_lastLeafNode, addressHash));
        }

        for (uint8 h = 1; h < _treeHeight; h++) {
            if (isTreeHeightChanged && h < _treeHeight - 1) {
                _rootNodes[h] = newMerkleRoot;
                continue;
            }
            newMerkleRoot = keccak256(abi.encodePacked(_rootNodes[h], newMerkleRoot));
        }

        _rootNodes[_treeHeight] = newMerkleRoot;
        _lastLeafNode = addressHash;
    }
}
