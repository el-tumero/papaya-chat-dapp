import { ethers } from "ethers"
import React, { SetStateAction, useEffect, useState } from "react"
import axios from "axios"
import Cookies from "universal-cookie"
import "./RelationList.css"
import Relations from "./Relations"

interface Props{
    storageContract: ethers.Contract | undefined
    profileContract: ethers.Contract | undefined
    signer: ethers.Signer | undefined
    setReceiver: React.Dispatch<SetStateAction<string | undefined>>
    setOpenKeyPairScreen: React.Dispatch<SetStateAction<boolean>>
}

function RelationList({storageContract, profileContract, signer, setReceiver, setOpenKeyPairScreen}: Props){

    const [newRelationAddress, setNewRelationAddress] = useState<string>()
    const [cookiesClient] = useState<Cookies>(new Cookies())
    const [relations, setRelations] = useState<string[]>()
    const [profiles, setProfiles] = useState<{[key: string]: {name:string, bio:string, photo:string, online:boolean}}>()
    const [onlineStatusChecked, setOnlineStatusChecked] = useState<boolean>(false)

    const ipfsGateway = "https://ipfs.io/ipfs/"

    useEffect(() => {
        if(!relations && cookiesClient){
            const result = cookiesClient.get("relations")
            setRelations(result)
        }

    }, [relations, cookiesClient])

    useEffect(() => {
        const _profiles:{[key: string]: {name:string, bio:string, photo:string, online:boolean}} = {}
        if(relations && !profiles ){
            relations.forEach(relation => {
                const data = localStorage.getItem(relation)
                if(data){
                    _profiles[relation] = JSON.parse(data)
                    _profiles[relation].online = false
                }
            })
            setProfiles(_profiles) 

        }

        if(profiles && !onlineStatusChecked){
            axios.get(process.env.REACT_APP_SERVER_URL+"/online").then(response => {
                const onlineList = response.data as string[]
                onlineList.forEach(onlineAddress => {
                    if(profiles[onlineAddress]) {
                        // console.log(profiles[onlineAddress])
                        setProfiles(prev => ({...prev, [onlineAddress]: {...prev![onlineAddress], online: true }}))
                        setOnlineStatusChecked(true)
                    }
                })
            })
        }
        
    }, [profiles, relations, onlineStatusChecked])

    

    async function addNewRelation(){
        if(storageContract && profileContract && newRelationAddress && signer){
            try {

                const clientAddress = await signer.getAddress()

                if(newRelationAddress.toLowerCase() === clientAddress.toLowerCase()) throw Error("You can't create a relation with youself ;)") 

                const result = await storageContract.getPublicKey(newRelationAddress)
                if(result.length === 0) {
                    throw Error("Current address has not created an account on this service :(")
                }
                localStorage.setItem("p"+newRelationAddress.toLowerCase(), result)

                const profileCid = await profileContract.activeProfile(newRelationAddress)

                console.log(profileCid)

                const response = await axios.get(ipfsGateway + profileCid)
                const profile = response.data

                localStorage.setItem(newRelationAddress.toLowerCase(), JSON.stringify(profile))
                const cookies = cookiesClient

                const relations = cookies.get("relations") as string[]
                if(!relations){
                    cookies.set("relations", [newRelationAddress.toLowerCase()])
                    console.log("New relation added!")
                    setRelations([newRelationAddress.toLowerCase()])
                    return
                }

                const found = relations.find(element => element === newRelationAddress.toLowerCase())

                if(found){
                    throw Error("Relation is already created!")
                }

                cookies.set("relations", [...relations, newRelationAddress.toLowerCase()])
                setRelations(current => [...current!, newRelationAddress.toLowerCase()])

            } catch (error:any) {
                if(error.code === "CALL_EXCEPTION") {
                    alert("Given address did not create a profile :(")
                    return
                }
                alert(error)
                console.error(error)
            }
        }
        
    }

    return(
        <div className="container">
            <div className="optionsButton"><small className="optionsText" onClick={() => setOpenKeyPairScreen(true)}>options</small></div>
            <h2 className="relationsTitle">Relations</h2>
            <p>Add relation:</p>
            <input type="text" placeholder="address" onChange={e => setNewRelationAddress(e.target.value)}/>
            <button onClick={addNewRelation}>Add</button>
            <Relations relations={relations} profiles={profiles} setReceiver={setReceiver} />
        </div>
    )
}

export default RelationList