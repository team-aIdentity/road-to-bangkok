// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
	struct Candidate {
		string name;
		uint voteCount;
	}

	address public owner;
	mapping(address => bool) public voters;
	Candidate[] public candidates;
	address[] public voterList;

	constructor(string[] memory candidateNames) {
		owner = msg.sender; // 배포자를 owner로 설정
		for (uint i = 0; i < candidateNames.length; i++) {
			candidates.push(Candidate({
				name: candidateNames[i],
				voteCount: 0
			}));
		}
	}

	function vote(uint candidateIndex) public {
		require(!voters[msg.sender], "Already voted.");
		require(candidateIndex < candidates.length, "Invalid candidate.");

		voters[msg.sender] = true;
		voterList.push(msg.sender); // 투표한 주소를 목록에 추가
		candidates[candidateIndex].voteCount++;
	}

	function getCandidates() public view returns (Candidate[] memory) {
		return candidates;
	}

	function resetVotes() public {
		require(msg.sender == owner, "Only owner can reset votes.");
		for (uint i = 0; i < candidates.length; i++) {
			candidates[i].voteCount = 0;
		}
		for (uint i = 0; i < voterList.length; i++) {
			voters[voterList[i]] = false;
		}
		delete voterList; // 투표자 목록 초기화
	}
}
