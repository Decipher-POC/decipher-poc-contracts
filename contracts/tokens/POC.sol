// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.0;


import "./extensions/ERC20Epochs.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";


contract POC is ERC20Epochs, Ownable {
    constructor() ERC20Epochs("Decipher POC", "POC") {
    }

    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }

    function createEpoch() override public onlyOwner returns (uint256) {
        return super.createEpoch();
    }

    // Examples for POC(Proof of Contribution) specific logics.
    function decimals() public pure override returns (uint8) {
        return 0;
    }

    // Governance: Voting Weight
    function votingWeightOf(address account) public view returns (uint256) {
        uint currentEpoch = epoch();
        uint votingWeight = 0;

        for (uint i = 0; i <= currentEpoch; i++) {
            uint numerator = Math.sqrt((1 + balanceOfEpoch(account, i))); // Quadratic voting.
            uint denominator = (1 + currentEpoch - i); // High weight on recent epoch.
            uint votingWeightOnEpoch = numerator/denominator;
            votingWeight += votingWeightOnEpoch;
        }

        return votingWeight;
    }
}
