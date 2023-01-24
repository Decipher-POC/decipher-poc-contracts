const hre = require("hardhat");


async function main() {
    const signers = await ethers.getSigners();
    const deployed = await hre.deployments.all();

    const POC = await hre.ethers.getContractFactory("POC");
    const poc = await POC.attach(deployed.POC.address);

    // Epoch #0
    console.log("Epoch #0");

    signers.forEach(async (signer) => {
        const mintTx = await poc.mint(signer.address, 1000);
        await mintTx.wait();

        const pocWithSigner = await poc.connect(signer);
        const balance = await poc.balanceOf(signer.address);
        const votingWeight = await poc.votingWeightOf(signer.address);

        console.log(`[Epoch #0] Account ${signer.address} has ${balance} $POC, and ${votingWeight} Voting Weight.`);
    });

    // Epoch #1
    console.log("Epoch #1");

    const pocWithSigner = await poc.connect(signers[0]);
    const createEpochTx = await pocWithSigner.createEpoch();
    await createEpochTx.wait();

    signers.forEach(async (signer) => {
        const mintTx = await poc.mint(signer.address, 1000);
        await mintTx.wait();

        const pocWithSigner = await poc.connect(signer);
        const balance = await poc.balanceOf(signer.address);
        const votingWeight = await poc.votingWeightOf(signer.address);

        console.log(`[Epoch #1] Account ${signer.address} has ${balance} $POC, and ${votingWeight} Voting Weight.`);
    });
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
