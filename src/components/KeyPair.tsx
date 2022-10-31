import forge from "node-forge"
import { ethers, Signer } from "ethers"
import papayaStorageData from "../abis/PapayaStorage.json"
import { useEffect, useState } from "react"
import Dexie, {Table} from "dexie"


interface Props {
    signer: Signer | undefined
}

interface KeyPairRecord {
    id?:number
    pair?:CryptoKeyPair 
}

class KeyPairsDatabase extends Dexie {
    public keyPairs!: Table<KeyPairRecord, number>

    public constructor() {
        super("KeyPairsDatabase")
        this.version(1).stores({
            keyPairs: "++id,pair"
        })
    }
}

function KeyPair({signer}:Props){

    const [publicKey, setPublicKey] = useState<string>()
    const [contract, setContract] = useState<ethers.Contract>()

    useEffect(() => {
        if(signer){
            const {address, abi} = papayaStorageData
            const papayaStorageContract = new ethers.Contract(address, abi, signer)
            setContract(papayaStorageContract)
            console.log("Contract initialized!")
        }
    }, [signer])


    async function generateKeyPair(){

        const db = new KeyPairsDatabase()

        // const keyPair = await window.crypto.subtle.generateKey(
        //     {
        //         name: "RSA-OAEP",
        //         modulusLength: 1024,
        //         publicExponent: new Uint8Array([1, 0, 1]),
        //         hash: "SHA-256"
        //     },
        //     true,
        //     ["encrypt", "decrypt"]
        // )

        // let keypair:CryptoKeyPair

        db.transaction('r', db.keyPairs, async () => {
            const result = await db.keyPairs.where("id").equals(1).toArray()

            const keypair = result[0].pair!

            console.log(keypair)

            const enc = new TextEncoder()
            const dec = new TextDecoder("utf-8")
            const encoded = enc.encode("Hello")


            const encrypted = await window.crypto.subtle.encrypt(
                {
                    name: "RSA-OAEP"
                },
                keypair.publicKey,
                encoded
            )

            console.log(encrypted)
            const decrypted = await window.crypto.subtle.decrypt(
                {
                    name: "RSA-OAEP"
                },
                keypair.privateKey,
                encrypted
            )

            console.log(dec.decode(decrypted))

            

            // console.log(result)
        })

        
        // export

            
        // console.log(keyPair)
    }

    



    async function sendTransaction(){
        if(contract && signer && publicKey){
            const res = await contract.setPublicKey(publicKey)
            console.log(res)
        }   
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
            <div onClick={sendTransaction}>
                Send transaction!
            </div>
            <div onClick={checkPublicKey}>
                Show public key!
            </div>
        </div>
        
    )
}

export default KeyPair