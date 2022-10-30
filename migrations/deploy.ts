import {ethers} from "hardhat"

async function main() {
    const HelloWorld = await ethers.getContractFactory("HelloWorld")
    const helloworld = await HelloWorld.deploy()

    await helloworld.deployed()

    console.log(helloworld.address)

    console.log("Deployed!")
}

main().catch(error => {
    console.error(error)
    process.exitCode = 1
})