import axios from "axios"
import { useEffect, useState } from "react"

async function getEmoteImage(cid:string){
    const response = await axios.get("https://"+cid+".ipfs.nftstorage.link")
    return response.data.image as string
}

function EmoteImage({cid}:{cid:string}){
    const [base64, setBase64] = useState<string>()

    useEffect(() => {
        if(!base64){
            getEmoteImage(cid).then(dataUrl => setBase64(dataUrl))
        } 
   }, [base64]) 

   if(base64) return <img src={base64} width={16}></img>
   
   return <></>

}

export default EmoteImage