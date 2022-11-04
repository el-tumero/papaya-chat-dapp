import { ethers } from "ethers"
import React, { SetStateAction, useEffect, useState } from "react"
import axios from "axios"
import Cookies from "universal-cookie"
import "./RelationList.css"

interface Props{
    storageContract: ethers.Contract | undefined
    profileContract: ethers.Contract | undefined
    signer: ethers.Signer | undefined
    setReceiver: React.Dispatch<SetStateAction<string | undefined>>
}

function RelationList({storageContract, profileContract, signer, setReceiver}: Props){

    const [newRelationAddress, setNewRelationAddress] = useState<string>()
    const [cookiesClient] = useState<Cookies>(new Cookies())
    const [relations, setRelations] = useState<string[]>()
    
    const ipfsGateway = "https://ipfs.io/ipfs/"

    useEffect(() => {
        if(!relations && cookiesClient){
            const result = cookiesClient.get("relations")
            setRelations(result)
        }

    }, [relations, cookiesClient])

    function Relations(){
        if(relations){

            const profiles:{[key: string]: {name:string, bio:string, photo:string}} = {}

            relations.forEach(relation => {
                const data = localStorage.getItem(relation)
                if(data){
                    profiles[relation] = JSON.parse(data)
                }
                
                console.log(profiles)
            })

            return(
                <div>
                    {relations.map((value, index) => <div className="relation" key={index}>
                        {value}
                        <p className="name">{profiles[value].name}</p>
                        <img src={profiles[value].photo} width={50} />
                        <br />
                        <button onClick={() => setReceiver(value.toLowerCase())}>Connect!</button>
                        </div>)}
                </div>
            )
        }
        return(<div></div>)
    }

    async function addNewRelation(){
        if(storageContract && profileContract && newRelationAddress && signer){
            try {

                const clientAddress = await signer.getAddress()

                if(newRelationAddress.toLowerCase() === clientAddress.toLowerCase()) throw Error("You can't create a relation with youself ;)") 

                const result = await storageContract.getPublicKey(newRelationAddress)
                if(result.length === 0) {
                    throw Error("Current address has not created an account on this service :(")
                }
                const profileCid = await profileContract.activeProfile(newRelationAddress)

                const response = await axios.get(ipfsGateway + profileCid)
                const profile = response.data

                localStorage.setItem(newRelationAddress, JSON.stringify(profile))
                const cookies = cookiesClient

                const relations = cookies.get("relations") as string[]
                if(!relations){
                    cookies.set("relations", [newRelationAddress])
                    console.log("New relation added!")
                    setRelations([newRelationAddress])
                    return
                }

                const found = relations.find(element => element === newRelationAddress)

                if(found){
                    throw Error("Relation is already created!")
                }

                cookies.set("relations", [...relations, newRelationAddress])
                setRelations(current => [...current!, newRelationAddress])

            } catch (error) {
                console.error(error)
            }
        }
        
    }

    return(
        <div>
            <p>Add relation:</p>
            <input placeholder="address" onChange={e => setNewRelationAddress(e.target.value)}/>
            <button onClick={addNewRelation}>Add</button>
            <Relations />
        </div>
    )
}

export default RelationList