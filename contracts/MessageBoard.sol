//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "hardhat/console.sol";
import "./ACL.sol";
import "./MerkleTree.sol";
import "./IMessageBoard.sol";

contract MessageBoard is IMessageBoard, ACL, MerkleTree {
    
    string public messageBoard;


    constructor() {
        messageBoard = "Welcome to Message Board !!!";
    }


    function addUser(address newUser) external override onlyAdmin {
        bytes32 addressHash = keccak256(abi.encodePacked(newUser));
        _appendUserAddress(addressHash);
        emit NewUserAdd(newUser);
    } 

    function twitMessage(InclusionProof[] calldata proof, string calldata message) external override {
            bool isVerified = _verifyProof(proof);
            require(isVerified, "access denied, you haven't any permission to twit message.");
            messageBoard = message;
            emit NewTwitMessage(msg.sender, message);
    }

    function _verifyProof(InclusionProof[] calldata proof) internal view returns (bool) {
        bytes32 computeHash = keccak256(abi.encodePacked(msg.sender)); 
        bytes32 rootHash = _rootNodes[_treeHeight];
        if (_leafNodeCount == 1) {
            return _rootNodes[_treeHeight] == proof[0].nodeHash;
        }

        for (uint8 i = 0; i < proof.length; i++) {
            computeHash = proof[i].position == Position.LEFT
                ? keccak256(abi.encodePacked(proof[i].nodeHash, computeHash))
                : proof[i].nodeHash != 0x0000000000000000000000000000000000000000000000000000000000000000
                ? keccak256(abi.encodePacked(computeHash, proof[i].nodeHash))
                : computeHash;
        }

        return computeHash == rootHash;
    }

}
