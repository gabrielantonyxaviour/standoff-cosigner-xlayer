// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ReceiptRegistry {
    struct Receipt {
        address actor;
        bytes32 digest;
        bytes32 previous;
        string uri;
        uint256 timestamp;
    }

    mapping(bytes32 => Receipt) public receipts;

    event ReceiptAnchored(
        bytes32 indexed receiptHash,
        address indexed actor,
        bytes32 indexed digest,
        bytes32 previous,
        string uri
    );

    error ReceiptAlreadyExists(bytes32 receiptHash);
    error EmptyReceiptHash();

    function anchor(bytes32 receiptHash, address actor, bytes32 digest, bytes32 previous, string calldata uri) external {
        if (receiptHash == bytes32(0)) revert EmptyReceiptHash();
        if (receipts[receiptHash].timestamp != 0) revert ReceiptAlreadyExists(receiptHash);

        receipts[receiptHash] = Receipt({
            actor: actor,
            digest: digest,
            previous: previous,
            uri: uri,
            timestamp: block.timestamp
        });

        emit ReceiptAnchored(receiptHash, actor, digest, previous, uri);
    }
}
