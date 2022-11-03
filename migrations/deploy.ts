import {ethers} from "hardhat"
import getAbi from "./getAbi"
import createInterfaceForClient from "./createIntefaceForClient"

async function main() {

    const [deployer] = await ethers.getSigners()

    const PapayaStorage = await ethers.getContractFactory("PapayaStorage")
    const papayaStorage = await PapayaStorage.deploy()

    const PapayaProfile = await ethers.getContractFactory("PapayaProfile")
    const papayaProfile = await PapayaProfile.deploy()

    await papayaStorage.deployed()
    await papayaProfile.deployed



    const abiPapayaStorage = getAbi("PapayaStorage")
    const abiPapayaProfile = getAbi("PapayaProfile")

    createInterfaceForClient("PapayaStorage", abiPapayaStorage, papayaStorage.address)
    createInterfaceForClient("PapayaProfile", abiPapayaProfile, papayaProfile.address)

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