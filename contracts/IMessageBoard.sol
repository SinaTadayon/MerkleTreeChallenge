//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.11;

interface IMessageBoard {

    enum Position {
        LEFT,
        RIGHT
    }

    struct IncProof {
        Position position;
        bytes32 nodeHash;
    }

    event NewUserAdd(address indexed sender);

    event NewTwitMessage(address indexed sender, string message);

    function addUser(address newUser) external; 

    function twitMessage(
        IncProof[] calldata iproof,
        string calldata message
    ) external;
}
