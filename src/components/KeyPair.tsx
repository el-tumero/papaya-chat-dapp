import { ethers, Signer } from "ethers"
import { SetStateAction, useEffect, useState } from "react"
import KeyPairDatabase from "../KeyPairDatabase"
import axios from "axios"
import convertToBase64 from "../utils/convertToBase64"
import doneIcon from "../icons/doneicon.png"
import notDoneIcon from "../icons/notdoneicon.png"
import loadingIcon from "../icons/loadingicon.gif"
import "./KeyPair.css"
import { Blob, NFTStorage } from "nft.storage"


interface Props {
    signer: Signer | undefined
    storageContract: ethers.Contract | undefined
    profileContract: ethers.Contract | undefined
    isAccountInitialized: boolean
    setOpenKeyPairScreen: React.Dispatch<SetStateAction<boolean>>
}

interface Profile{
    name: string
    bio: string
    photo: string
}

function KeyPair({signer, storageContract, profileContract, setOpenKeyPairScreen, isAccountInitialized}:Props){

    const [db] = useState<KeyPairDatabase>(new KeyPairDatabase())
    const [selectedFile, setSelectedFile] = useState<File>()
    const [profileName, setProfileName] = useState<string>("")
    const [profileBio, setProfileBio] = useState<string>("")
    const [isKeyPairInDb, setIsKeyPairInDb] = useState<boolean>()
    // const [isPublicKeyOnBlockchain, setIsPublicKeyOnBlockchain] = useState<boolean>()
    const [steps, setSteps] = useState<("done" | "notdone" | "loading")[]>(["notdone", "notdone", "notdone", "notdone"])
    const [currentProfile, setCurrentProfile] = useState<Profile>()


    // const ipfsServiceUrl = "http://localhost:8000"
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
                    copy[1] = state ? "done" : "notdone"
                    return copy
                })
            })

            checkProfile()
            
            
        }
    }, [])

    async function checkProfile(){
        if(signer && profileContract){
            try {
                const address = await signer.getAddress()
                const cid = await profileContract.activeProfile(address)
                if(cid){
                    
                    setSteps(prev => {
                        const copy = [...prev]
                        copy[3] = "loading"
                        return copy
                    })
                    
                    const response = await axios.get(ipfsGateway + cid)
                    
                    setSteps(prev => {
                        const copy = [...prev]
                        copy[3] = "done"
                        return copy
                    })

                    setCurrentProfile(response.data)

                    // console.log(response.data)
                }
                
            } catch (error) {
                console.log("Profile not created or is currently in state of creation :0")
            }

        }
        
    }

    async function createProfile(){
        if(selectedFile && profileContract){

            setSteps(prev => {
                const copy = [...prev]
                copy[3] = "loading"
                return copy
            })

            const imageAsBase64 = await convertToBase64(selectedFile)
            const profileObj = {name: profileName, bio: profileBio, photo: imageAsBase64}
            const content = new Blob([JSON.stringify(profileObj)])
            const ipfsClient = new NFTStorage({token: process.env.REACT_APP_NFTSTORAGE_API_KEY})

            try {
                const cid = await ipfsClient.storeBlob(content)

                const tx = await profileContract.mint(cid)
                const receipt = await tx.wait()

                setSteps(prev => {
                    const copy = [...prev]
                    copy[3] = "done"
                    return copy
                })

                alert("Profile created! cid: " + cid)
                document.location.reload()
                // console.log(receipt) 
            } catch (error) {
                alert(error)
                setSteps(prev => {
                    const copy = [...prev]
                    copy[3] = "notdone"
                    return copy
                })
            }
        }
        
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
        setSteps(prev => {
            const copy = [...prev]
            copy[0] = "done"
            return copy
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
            
            if(!record){
                return false
            }
            
            const key = record.pair!.publicKey

            const exported = await window.crypto.subtle.exportKey(
                "jwk",
                key
            )
            const exportKeyOutput = JSON.stringify(exported)
            
            return exportKeyOutput
        })

        if(key === false){
            setSteps(prev => {
                const copy = [...prev]
                copy[1] = "notdone"
                return copy
            })
            alert("Key pair is not initialized!")
            throw Error("Key pair is not initialized!")
        }


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

    function ShowProfile(){
        if(currentProfile){
            return <div className="profileBox">
                <img src={currentProfile.photo} width={64} alt="profile photo" />
                <big className="name">{currentProfile.name}</big>
                <small className="bio">"{currentProfile.bio}"</small>
            </div>
        }
        return <></>
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
            {isAccountInitialized &&
            <div className="goBackButton"><small className="goBackText" onClick={() => setOpenKeyPairScreen(false)}>← go back</small></div>
            }
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
            <ShowProfile />
            <h5 className="newProfileTitle">New profile</h5>
            <input type="text" placeholder="name" onChange={e => setProfileName(e.target.value)} />
            <input type="text" placeholder="bio" onChange={e => setProfileBio(e.target.value)}/>
            <input type="file" onChange={e => setSelectedFile(e.target.files![0])} />
            <div className="keyPairButton" onClick={createProfile}>
                Create profile! <ShowIcon stepId={3} />
            </div>

            
        </div>
        
    )
}

export default KeyPair