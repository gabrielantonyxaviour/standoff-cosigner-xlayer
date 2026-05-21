// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TestRecipient {
    event Received(address indexed sender, uint256 amount, bytes data);

    receive() external payable {
        emit Received(msg.sender, msg.value, "");
    }

    fallback() external payable {
        emit Received(msg.sender, msg.value, msg.data);
    }
}
