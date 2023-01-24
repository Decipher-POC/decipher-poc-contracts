const hre = require("hardhat");


async function main() {
    const signers = await ethers.getSigners();
    const deployed = await hre.deployments.all();

    const POC = await hre.ethers.getContractFactory("POC");
    const poc = await POC.attach(deployed.POC.address);

    const currentEpoch = await poc.epoch();
    console.log(`Current Epoch is #${currentEpoch}.`);


    for (const signer of signers) {
        let balances = [];
        let balance = 0;

        for (let i = 0; i <= currentEpoch; i++) {
            balance = await poc.balanceOfEpoch(signer.address, i);
            balances.push(balance);
        }
        let votingWeight = await poc.votingWeightOf(signer.address);

        console.log(`[Epoch #${currentEpoch}] Account ${signer.address} has ${balances} balances → ${votingWeight} Voting Weight.`);
    }
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
