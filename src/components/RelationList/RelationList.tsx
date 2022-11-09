import { ethers } from "ethers"
import React, { SetStateAction, useEffect, useState } from "react"
import axios from "axios"
import Cookies from "universal-cookie"
import "./RelationList.css"
import Relations from "./Relations"
import PapayaLogo from "../../icons/papaya-logo.svg"

interface Props{
    storageContract: ethers.Contract | undefined
    profileContract: ethers.Contract | undefined
    signer: ethers.Signer | undefined
    setReceiver: React.Dispatch<SetStateAction<string | undefined>>
    setOpenKeyPairScreen: React.Dispatch<SetStateAction<boolean>>
    setOpenEmotesScreen: React.Dispatch<SetStateAction<boolean>>
}

function RelationList({storageContract, profileContract, signer, setReceiver, setOpenKeyPairScreen, setOpenEmotesScreen}: Props){

    const [newRelationAddress, setNewRelationAddress] = useState<string>()
    const [cookiesClient] = useState<Cookies>(new Cookies())
    const [relations, setRelations] = useState<string[]>()
    const [profiles, setProfiles] = useState<{[key: string]: {name:string, bio:string, photo:string, online:boolean}}>()
    const [onlineStatusChecked, setOnlineStatusChecked] = useState<boolean>(false)
    const [firstRun, setFirstRun] = useState<boolean>(true)

    const ipfsGateway = "https://ipfs.io/ipfs/"

    useEffect(() => {
        if(!relations && cookiesClient && firstRun){
            const result = cookiesClient.get("relations")
            setRelations(result)
            setFirstRun(false)
        }

    }, [relations, cookiesClient, firstRun])

    useEffect(() => {
        // console.log("#change")
        const _profiles:{[key: string]: {name:string, bio:string, photo:string, online:boolean}} = {}
        if(relations && !profiles ){
            relations.forEach(relation => {
                const data = localStorage.getItem(relation)
                if(data){
                    _profiles[relation] = JSON.parse(data)
                    _profiles[relation].online = false
                }
            })
            console.log("profiles set")
            setProfiles(_profiles) 
            setOnlineStatusChecked(false)

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

    async function refreshRelations() {

        async function refresh(relation:string){
            try {
                const result = await storageContract?.getPublicKey(relation)
                if(result.length === 0) {
                    throw Error("Current address has not created an account on this service :(")
                }
                localStorage.setItem("p"+relation.toLowerCase(), result)

                const profileCid = await profileContract?.activeProfile(relation)

                const response = await axios.get(ipfsGateway + profileCid)
                const profile = response.data

                localStorage.setItem(relation.toLowerCase(), JSON.stringify(profile))

                setRelations(prev => prev ? [...prev, relation] : [relation])

            } catch (error) {
                console.error(error)   
            }   
        }

        
        if(relations){
            setRelations(undefined)
            setProfiles(undefined)
            const relationsC = cookiesClient.get("relations") as string[]
            const refreshPromises = relationsC.map(address => refresh(address))

            await Promise.all(refreshPromises)
        }
        
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
                localStorage.setItem("p"+newRelationAddress.toLowerCase(), result)

                const profileCid = await profileContract.activeProfile(newRelationAddress)

                //console.log(profileCid)

                const response = await axios.get(ipfsGateway + profileCid)
                const profile = response.data

                localStorage.setItem(newRelationAddress.toLowerCase(), JSON.stringify(profile))
                const cookies = cookiesClient

                

                const relations = cookies.get("relations") as string[]
                if(!relations){
                    cookies.set("relations", [newRelationAddress.toLowerCase()], {expires: new Date(2147483647 * 1000)})
                    console.log("New relation added!")
                    setRelations([newRelationAddress.toLowerCase()])
                    return
                }

                const found = relations.find(element => element === newRelationAddress.toLowerCase())

                if(found){
                    throw Error("Relation is already created! ")
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
            
            <div className="topBar">
                <div className="menuButtons">
                    <small className="optionsText" onClick={() => setOpenKeyPairScreen(true)}>options</small>
                    <small className="emotesText" onClick={() => setOpenEmotesScreen(true)} >emotes</small>
                </div>
                <div className="logoContainer">
                    <small>papaya</small>
                    <img src={PapayaLogo} width={32} alt="papayalogo" />
                </div>
                
            </div>
            <h2 className="relationsTitle">Relations</h2>
            <p>Add relation:</p>
            <input type="text" placeholder="address" onChange={e => setNewRelationAddress(e.target.value)}/>
            <button onClick={addNewRelation}>Add</button>
            <button onClick={refreshRelations}>Refresh</button>
            <Relations relations={relations} profiles={profiles} setReceiver={setReceiver} />
        </div>
    )
}

export default RelationList