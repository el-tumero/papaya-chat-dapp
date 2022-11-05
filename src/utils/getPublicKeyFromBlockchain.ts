import { ethers } from "ethers"
import str2ab from "./str2ab"

export default async function getPublicKeyFromBlockchain(contract:ethers.Contract, address:string){
    if(contract){
        const publicKeyStr = await contract.getPublicKey(address) as string
        const binPublicKey = str2ab(publicKeyStr)
        try {
            const publicKey = await window.crypto.subtle.importKey("spki", binPublicKey, {
                name: "RSA-OAEP",
                hash: "SHA-256"
            },
            true,
            ["encrypt"])

            return publicKey
        } catch (error) {
            console.log(error)
        }
    }   
}