//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "hardhat/console.sol";

abstract contract MerkleTree {

    /// support about 2^32 users whitelist
    bytes32[32] internal _rootNodes;

    uint32 internal _leafNodeCount;

    uint8 internal _treeHeight;

    function _appendUserAddress(bytes32 addressHash) internal {
        bytes32 newMerkleRoot;
        bool isOdd = false;
        _leafNodeCount++;

        if (2 ** _treeHeight < _leafNodeCount) {
            _treeHeight++;
        }

        // check left and right position
        if (_leafNodeCount % 2 != 0) {
            newMerkleRoot = addressHash;
            isOdd = true;
        } else {
            newMerkleRoot = keccak256(abi.encodePacked(_rootNodes[0], addressHash));
        }

        for (uint8 h = 1; h < _treeHeight; h++) {
            // calculate merkle root
            uint256 upNodeReminder = _leafNodeCount % 2 ** (h + 1);
            if (upNodeReminder == 0 || upNodeReminder > 2 ** h) {
                newMerkleRoot = keccak256(abi.encodePacked(_rootNodes[h], newMerkleRoot));
            }

            // update root node h
            else if (upNodeReminder <= 2 ** h) {
                if (h == 1 && !isOdd) {
                    _rootNodes[h] = newMerkleRoot;
                } else {
                    uint256 reminder = _leafNodeCount % 2 ** h;
                    if (reminder == 0 || reminder > 2 ** h / 2) {
                        _rootNodes[h] = newMerkleRoot;
                    }
                }
            }
        }

        _rootNodes[_treeHeight] = newMerkleRoot;
        _rootNodes[0] = addressHash;
    }
}
