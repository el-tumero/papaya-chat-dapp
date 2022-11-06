import { ethers, Signer } from "ethers"
import { useState } from "react"
import KeyPairDatabase from "../KeyPairDatabase"
import axios from "axios"
import convertToBase64 from "../utils/convertToBase64"

interface Props {
    signer: Signer | undefined
    storageContract: ethers.Contract | undefined
    profileContract: ethers.Contract | undefined
}


function KeyPair({signer, storageContract, profileContract}:Props){

    const [db] = useState<KeyPairDatabase>(new KeyPairDatabase())
    const [selectedFile, setSelectedFile] = useState<File>()
    const [profileName, setProfileName] = useState<string>("")

    const ipfsServiceUrl = "http://localhost:8000"
    const ipfsGateway = "https://ipfs.io/ipfs/"

    async function createProfile(){
        if(selectedFile){
            const imageAsBase64 = await convertToBase64(selectedFile)
            const response = await axios.post(ipfsServiceUrl, {name: profileName, bio: "Hello!", photo: imageAsBase64})
            if(response.data.cid && profileContract){
                const contractResponse = await profileContract.mint(response.data.cid)
                console.log(contractResponse)
            }
        }
        
    }

    async function showProfile(){
        if(profileContract && signer){
            const accountAddress = await signer.getAddress()
            console.log(accountAddress)
            const ipfsCid = await profileContract.activeProfile(accountAddress) //!
            const response = await axios.get(ipfsGateway + ipfsCid)
            const data = response.data
            console.log(data)

        }
        
        // 
    }

    async function generateKeyPair(){
        const keyPair = await window.crypto.subtle.generateKey(
            {
                name: "ECDH",
                namedCurve: "P-384"
            },
            true,
            ["deriveKey"]
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
                "jwk",
                key
            )
            const exportKeyOutput = JSON.stringify(exported, null, " ")
            const res = await storageContract!.setPublicKey(exportKeyOutput)
            console.log(res)


        })
    }

    async function checkPublicKey(){
        if(storageContract && signer){
            const accountAddress = await signer.getAddress()
            const res = await storageContract.getPublicKey(accountAddress) 
            console.log(res)
        }
    }


    return(
        <div>
            <div onClick={generateKeyPair}>
                Generate key pair
            </div>
            <div onClick={exportPublicKey}>
                Export public key!
            </div>
            <div onClick={checkPublicKey}>
                Show public key!
            </div>
            <br />
            <input type="text" placeholder="name" onChange={e => setProfileName(e.target.value)} />
            <input type="file" onChange={e => setSelectedFile(e.target.files![0])} />
            <div onClick={createProfile}>
                Create profile!
            </div>
            <div onClick={showProfile}>
                Console profile
            </div>

        </div>
        
    )
}

export default KeyPair