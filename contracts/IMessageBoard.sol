//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

interface IMessageBoard {

    enum Position {
        LEFT,
        RIGHT
    }

    struct InclusionProof {
        Position position;
        bytes32 nodeHash;
    }

    event NewUserAdd(address indexed sender);

    event NewTwitMessage(address indexed sender, string message);

    function addUser(address newUser) external; 

    function twitMessage(
        InclusionProof[] calldata proof,
        string calldata message
    ) external;
}
