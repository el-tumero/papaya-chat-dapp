import { ethers, Signer } from "ethers"
import { useState } from "react"
import KeyPairDatabase from "../KeyPairDatabase"

interface Props {
    signer: Signer | undefined
    contract: ethers.Contract | undefined
}


function KeyPair({signer, contract}:Props){

    const [db] = useState<KeyPairDatabase>(new KeyPairDatabase())

    async function generateKeyPair(){
        const keyPair = await window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 1024,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256"
            },
            true,
            ["encrypt", "decrypt"]
        )

        db.transaction("rw", db.keyPairs, async () => {
            const result = await db.keyPairs.toArray()
            if(result.length === 0) {
                console.log("New keypair")
                await db.keyPairs.add({pair: keyPair})
            }
            // console.log(result)
        })
    }
    
    async function exportPublicKey(){
        db.transaction("r", db.keyPairs, async () => {
            const [record] = await db.keyPairs.toArray()
            
            console.log(record)

            const key = record.pair!.publicKey


            const exported = await window.crypto.subtle.exportKey(
                "spki",
                key
            )


            // const exportedAsString = enc.encode(exported)
            const exportedAsString = String.fromCharCode.apply<null, any, string>(null, new Uint8Array(exported))
            console.log(exportedAsString)

            const res = await contract!.setPublicKey(exportedAsString)
            console.log(res)


        })
    }

    async function checkPublicKey(){
        if(contract && signer){
            const accountAddress = await signer.getAddress()
            const res = await contract.getPublicKey(accountAddress) 
            console.log(res)
        }
    }


    return(
        <div>
            <div onClick={generateKeyPair}>
                Generate key pair
            </div>
            <div onClick={exportPublicKey}>
                Show public key!
            </div>
            <div onClick={checkPublicKey}>
                Show public key!
            </div>
        </div>
        
    )
}

export default KeyPair