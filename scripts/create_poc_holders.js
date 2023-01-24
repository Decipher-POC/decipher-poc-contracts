const hre = require("hardhat");


async function main() {
    const signers = await ethers.getSigners();
    const deployed = await hre.deployments.all();

    const POC = await hre.ethers.getContractFactory("POC");
    const poc = await POC.attach(deployed.POC.address);

    signers.forEach(async (signer) => {
        await poc.mint(signer.address, 1000);

        const pocWithSigner = await poc.connect(signer);
        const balance = await poc.balanceOf(signer.address);
        const votingWeight = await poc.balanceOf(signer.address);

        console.log(`Account ${signer.address} has ${balance} $POC, and ${votingWeight} Voting Weight.`);
    });
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
