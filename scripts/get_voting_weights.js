const hre = require("hardhat");


async function main() {
    const signers = await ethers.getSigners();
    const deployed = await hre.deployments.all();

    const POC = await hre.ethers.getContractFactory("POC");
    const poc = await POC.attach(deployed.POC.address);

    const currentEpoch = await poc.epoch();
    console.log("Current Epoch is #${currentEpoch}.");

    signers.forEach(async (signer) => {
        const pocWithSigner = await poc.connect(signer);
        const balance = await poc.balanceOf(signer.address);
        const votingWeight = await poc.votingWeightOf(signer.address);

        console.log(`[Epoch #${currentEpoch}] Account ${signer.address} has ${balance} $POC, and ${votingWeight} Voting Weight.`);
    });
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
