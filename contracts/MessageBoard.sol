//SPDX-License-Identifier: Unlicense
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

    function twitMessage(IncProof[] calldata iproof, string calldata message) external override {
            bool isVerified = _verifyProof(iproof);
            require(isVerified, "access denied, you haven't any permission to twit message.");
            messageBoard = message;
            emit NewTwitMessage(msg.sender, message);
    }

    function _verifyProof(IncProof[] calldata iproof) internal view returns (bool) {
        bytes32 computeHash = keccak256(abi.encodePacked(msg.sender)); 
        bytes32 rootHash = _rootNodes[_treeHeight];
        for (uint8 i = 0; i < iproof.length; i++) {
            computeHash = iproof[i].position == Position.LEFT
                ? keccak256(abi.encodePacked(iproof[i].nodeHash, computeHash))
                : keccak256(abi.encodePacked(computeHash, iproof[i].nodeHash));
        }

        return computeHash == rootHash;
    }

}
