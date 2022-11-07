import { ethers, Signer } from "ethers"
import { SetStateAction, useEffect, useState } from "react"
import KeyPairDatabase from "../KeyPairDatabase"
import axios from "axios"
import convertToBase64 from "../utils/convertToBase64"
import doneIcon from "../icons/doneicon.png"
import notDoneIcon from "../icons/notdoneicon.png"
import loadingIcon from "../icons/loadingicon.gif"
import "./KeyPair.css"


interface Props {
    signer: Signer | undefined
    storageContract: ethers.Contract | undefined
    profileContract: ethers.Contract | undefined
    setOpenKeyPairScreen: React.Dispatch<SetStateAction<boolean>>
}


function KeyPair({signer, storageContract, profileContract, setOpenKeyPairScreen}:Props){

    const [db] = useState<KeyPairDatabase>(new KeyPairDatabase())
    const [selectedFile, setSelectedFile] = useState<File>()
    const [profileName, setProfileName] = useState<string>("")
    const [isKeyPairInDb, setIsKeyPairInDb] = useState<boolean>()
    // const [isPublicKeyOnBlockchain, setIsPublicKeyOnBlockchain] = useState<boolean>()
    const [steps, setSteps] = useState<("done" | "notdone" | "loading")[]>(["notdone", "notdone", "notdone"])

    const ipfsServiceUrl = "http://localhost:8000"
    const ipfsGateway = "https://ipfs.io/ipfs/"

    useEffect(() => {
        if(isKeyPairInDb === true) {
            setSteps(prev => {
                const copy = [...prev]
                copy[0] = "done"
                return copy
            })
        }

        if(isKeyPairInDb === undefined){
            db.transaction("r", db.keyPairs, async() => {
                const result = await db.keyPairs.toArray()
                if(result.length !== 0) return true
                return false
            }).then(state => setIsKeyPairInDb(state))
        }
    }, [isKeyPairInDb])

    useEffect(() => {
        if(storageContract && signer){
            setSteps(prev => {
                const copy = [...prev]
                copy[1] = "loading"
                return copy
            })

            storageContract.checkIfAddressIsInitialized().then((state:boolean) => {
                setSteps(prev => {
                    const copy = [...prev]
                    copy[1] = "done"
                    return copy
                })
            })
        }
    }, [])

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

        if(isKeyPairInDb === true) {
            alert("Key pair is already generated!")
            return
        }

        db.transaction("rw", db.keyPairs, async () => {
            await db.keyPairs.add({pair: keyPair})
            console.log("New key pair!")
        })
    }
    
    async function exportPublicKey(){
        setSteps(prev => {
            const copy = [...prev]
            copy[1] = "loading"
            return copy
        })

        const key = await db.transaction("r", db.keyPairs, async () => {
            const [record] = await db.keyPairs.toArray()
            
            console.log(record)

            const key = record.pair!.publicKey

            const exported = await window.crypto.subtle.exportKey(
                "jwk",
                key
            )
            const exportKeyOutput = JSON.stringify(exported)
            
            return exportKeyOutput
        })

        const tx = await storageContract!.setPublicKey(key)
        const receipt = await tx.wait()
        if(receipt){
            setSteps(prev => {
                const copy = [...prev]
                copy[1] = "done"
                return copy
            })
        }
        console.log(receipt)
        
    }

    async function checkPublicKey(){
        if(storageContract && signer){
            setSteps(prev => {
                const copy = [...prev]
                copy[2] = "loading"
                return copy
            })
            
            const accountAddress = await signer.getAddress()
            const result = await storageContract.getPublicKey(accountAddress)
            
            if(!result){
                setSteps(prev => {
                    const copy = [...prev]
                    copy[2] = "notdone"
                    return copy
                })
                return
            }

            alert(result)
            setSteps(prev => {
                const copy = [...prev]
                copy[2] = "done"
                return copy
            })
            
        }
    }

    function ShowIcon({stepId}:{stepId:number}){
        switch (steps[stepId]) {
            case "done":
                return <img src={doneIcon} alt={"done"} width={30}></img>
                break
            case "loading":
                return <img src={loadingIcon} alt={"loading"} width={30}></img>
                break
            case "notdone":
                return <img src={notDoneIcon} alt={"notdone"} width={30} />
            default:
                return <></>
        }
    }


    return(
        <div className="container">
            <div className="goBackButton"><small className="goBackText" onClick={() => setOpenKeyPairScreen(false)}>← go back</small></div>
            <h1>Options</h1>
            <h3 className="keysTitle">Keys</h3>
            <div className="keyPairButton" onClick={generateKeyPair}>
                Generate key pair <ShowIcon stepId={0} />
            </div>
            <div className="keyPairButton" onClick={exportPublicKey}>
                Publish public key on blockchain <ShowIcon stepId={1} />
            </div>
            <div className="keyPairButton" onClick={checkPublicKey}>
                Check public key! <ShowIcon stepId={2} />
            </div>
            <h3 className="profileTitle">Profile</h3>
            <input type="text" placeholder="name" onChange={e => setProfileName(e.target.value)} />
            <input type="text" placeholder="bio" />
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