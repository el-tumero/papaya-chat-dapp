import {ethers} from "hardhat"
import getAbi from "./getAbi"
import createInterfaceForClient from "./createIntefaceForClient"

async function main() {

    const [deployer] = await ethers.getSigners()

    const PapayaStorage = await ethers.getContractFactory("PapayaStorage")
    const papayaStorage = await PapayaStorage.deploy()

    await papayaStorage.deployed()

    const address = papayaStorage.address

    const abi = getAbi("PapayaStorage")

    createInterfaceForClient("PapayaStorage", abi, address)

    // deployer.sendTransaction({
    //     to: metamaskWalletAddress,
    //     value: ethers.BigNumber.from("10000000000000000000")
    // })

    console.log("Deployed!")
}

main().catch(error => {
    console.error(error)
    process.exitCode = 1
})