const hre = require("hardhat");


async function main() {
    const signers = await ethers.getSigners();
    const deployed = await hre.deployments.all();

    const POC = await hre.ethers.getContractFactory("POC");
    const poc = await POC.attach(deployed.POC.address);

    // Epoch #0
    console.log("Epoch #0");
    let currentEpoch = await poc.epoch();
    for (const signer of signers) {

        const mintTx = await poc.mint(signer.address, 1000);
        await mintTx.wait();

        let balances = [];
        let balance = 0;

        for (let i = 0; i <= currentEpoch; i++) {
            balance = await poc.balanceOfEpoch(signer.address, i);
            balances.push(balance);
        }
        let votingWeight = await poc.votingWeightOf(signer.address);

        console.log(`[Epoch #${currentEpoch}] Account ${signer.address} has ${balances} balances → ${votingWeight} Voting Weight.`);
    };

    // Epoch #1
    console.log("Epoch #1");

    const pocWithSigner = await poc.connect(signers[0]);
    const createEpochTx = await pocWithSigner.createEpoch();
    await createEpochTx.wait();
    currentEpoch = await poc.epoch();

    for (const signer of signers) {

        const mintTx = await poc.mint(signer.address, 1000);
        await mintTx.wait();

        let balances = [];
        let balance = 0;

        for (let i = 0; i <= currentEpoch; i++) {
            balance = await poc.balanceOfEpoch(signer.address, i);
            balances.push(balance);
        }
        let votingWeight = await poc.votingWeightOf(signer.address);

        console.log(`[Epoch #${currentEpoch}] Account ${signer.address} has ${balances} balances → ${votingWeight} Voting Weight.`);
    };
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
