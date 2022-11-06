import { ethers } from "ethers"
import str2ab from "./str2ab"

export default async function getPublicKeyFromBlockchain(contract:ethers.Contract, address:string){
    if(contract){
        const key = await contract.getPublicKey(address) as string
        const jwk = JSON.parse(key)

        try {
            const publicKey = await window.crypto.subtle.importKey(
                "jwk",
                jwk,
                {
                    name: "ECDH",
                    namedCurve: "P-384"
                },
                true,
                []
            )

            return publicKey
        } catch (error) {
            console.log(error)
        }
    }   
}