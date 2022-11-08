import axios from "axios"
import { SetStateAction, useEffect, useState } from "react"

interface Props{
    relations: string[] | undefined
    setReceiver: React.Dispatch<SetStateAction<string | undefined>>
    profiles: {[key: string]: {name:string, bio:string, photo:string, online:boolean}} | undefined
}

export default function Relations({relations, setReceiver, profiles}:Props){

    if(profiles) return(
        <div>
            {relations!.map((value, index) => <div className="relation" key={index}>
                {value}
                <p className="name">{profiles[value].name}</p>
                {profiles[value].online ? <div style={{color: "green", marginBottom: 5}}>online</div> : <div style={{color: "red", marginBottom: 5}}>not here</div>}
                <img src={profiles[value].photo} width={50} />
                <p style={{fontSize: 12, margin: 0, marginTop: 10}}>{profiles[value].bio}</p>
                <br />
                <div className="connectButton" onClick={() => setReceiver(value.toLowerCase())}>Connect!</div>
                </div>)}
        </div>
    )
    
    return(<div></div>)
}