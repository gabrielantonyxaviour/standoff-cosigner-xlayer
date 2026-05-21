// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract StandoffGateway is EIP712, ReentrancyGuard {
    enum Verdict {
        Reject,
        Approve
    }

    struct Intent {
        address target;
        uint256 value;
        bytes data;
        uint256 nonce;
        uint256 deadline;
        bytes32 policyHash;
        bytes32 metadataHash;
    }

    struct Approval {
        bytes32 intentHash;
        Verdict verdict;
        bytes32 evidenceHash;
        uint256 deadline;
        bytes signature;
    }

    bytes32 private constant INTENT_TYPEHASH =
        keccak256(
            "Intent(address target,uint256 value,bytes32 dataHash,uint256 nonce,uint256 deadline,bytes32 policyHash,bytes32 metadataHash)"
        );
    bytes32 private constant APPROVAL_TYPEHASH =
        keccak256("Approval(bytes32 intentHash,uint8 verdict,bytes32 evidenceHash,uint256 deadline)");

    mapping(address => bool) public coSigners;
    mapping(bytes32 => bool) public executed;

    address public immutable owner;
    uint256 public immutable requiredApprovals;

    event IntentExecuted(bytes32 indexed intentHash, address indexed target, uint256 value, bytes result);
    event IntentBlocked(bytes32 indexed intentHash, address indexed signer, bytes32 evidenceHash);

    error ApprovalExpired(address signer);
    error DuplicateSigner(address signer);
    error ExecutionFailed(bytes returnData);
    error IntentExpired();
    error IntentAlreadyExecuted(bytes32 intentHash);
    error InvalidIntentTarget();
    error InvalidMsgValue();
    error MismatchedDigest();
    error MissingQuorum(uint256 approvals, uint256 required);
    error RejectedByCoSigner(address signer, bytes32 evidenceHash);
    error UnknownCoSigner(address signer);

    constructor(address[] memory initialCoSigners, uint256 required) EIP712("StandoffGateway", "1") {
        owner = msg.sender;
        requiredApprovals = required;

        for (uint256 i = 0; i < initialCoSigners.length; i++) {
            coSigners[initialCoSigners[i]] = true;
        }
    }

    function hashIntent(Intent calldata intent) public view returns (bytes32) {
        return _hashTypedDataV4(
            keccak256(
                abi.encode(
                    INTENT_TYPEHASH,
                    intent.target,
                    intent.value,
                    keccak256(intent.data),
                    intent.nonce,
                    intent.deadline,
                    intent.policyHash,
                    intent.metadataHash
                )
            )
        );
    }

    function hashApproval(Approval calldata approval) public view returns (bytes32) {
        return _hashTypedDataV4(
            keccak256(
                abi.encode(
                    APPROVAL_TYPEHASH,
                    approval.intentHash,
                    approval.verdict,
                    approval.evidenceHash,
                    approval.deadline
                )
            )
        );
    }

    function recoverApprovalSigner(Approval calldata approval) public view returns (address) {
        return ECDSA.recover(hashApproval(approval), approval.signature);
    }

    function execute(Intent calldata intent, Approval[] calldata approvals)
        external
        payable
        nonReentrant
        returns (bytes memory result)
    {
        if (intent.target == address(0)) revert InvalidIntentTarget();
        if (intent.deadline < block.timestamp) revert IntentExpired();
        if (msg.value != intent.value) revert InvalidMsgValue();

        bytes32 intentHash = hashIntent(intent);
        if (executed[intentHash]) revert IntentAlreadyExecuted(intentHash);

        uint256 approvalCount = _validateApprovals(intentHash, approvals);
        if (approvalCount < requiredApprovals) revert MissingQuorum(approvalCount, requiredApprovals);

        executed[intentHash] = true;
        (bool ok, bytes memory returnData) = intent.target.call{value: intent.value}(intent.data);
        if (!ok) revert ExecutionFailed(returnData);

        emit IntentExecuted(intentHash, intent.target, intent.value, returnData);
        return returnData;
    }

    function _validateApprovals(bytes32 intentHash, Approval[] calldata approvals) private returns (uint256) {
        address[] memory seen = new address[](approvals.length);
        uint256 approvalCount;

        for (uint256 i = 0; i < approvals.length; i++) {
            Approval calldata approval = approvals[i];
            if (approval.intentHash != intentHash) revert MismatchedDigest();

            address signer = recoverApprovalSigner(approval);
            if (!coSigners[signer]) revert UnknownCoSigner(signer);
            if (approval.deadline < block.timestamp) revert ApprovalExpired(signer);

            for (uint256 j = 0; j < approvalCount; j++) {
                if (seen[j] == signer) revert DuplicateSigner(signer);
            }

            if (approval.verdict != Verdict.Approve) {
                emit IntentBlocked(intentHash, signer, approval.evidenceHash);
                revert RejectedByCoSigner(signer, approval.evidenceHash);
            }

            seen[approvalCount] = signer;
            approvalCount++;
        }

        return approvalCount;
    }
}
