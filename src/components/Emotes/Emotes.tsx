import "./Emotes.css"
import doneIcon from "../../icons/doneicon.png"
import notDoneIcon from "../../icons/notdoneicon.png"
import loadingIcon from "../../icons/loadingicon.gif"
import { SetStateAction, useEffect, useState } from "react"
import { Blob, NFTStorage } from "nft.storage"
import convertToBase64 from "../../utils/convertToBase64"
import getHeightAndWidthFromDataUrl from "../../utils/getHeightAndWidthFromDataUrl"
import Cookies from "universal-cookie"
import axios from "axios"

interface Props{
    setOpenEmotesScreen: React.Dispatch<SetStateAction<boolean>>
}

export default function Emotes({setOpenEmotesScreen}:Props){

    const [uploadedState, setUploadedState] = useState<"done" | "loading" | "notdone">("notdone")
    const [yourEmotesState, setYourEmotesState] = useState<"done" | "loading" | "notdone">("notdone")
    const [selectedFile, setSelectedFile] = useState<File>()
    const [emoteCommand, setEmoteCommand] = useState<string>()
    const [cookiesClient] = useState<Cookies>(new Cookies())
    const [emotesData, setEmotesData] = useState<{command: string, image: string}[]>()
    const [totalEmotesNumber, setTotalEmotesNumber] = useState<number>(0)

    const ipfsGateway = "https://ipfs.io/ipfs/"

    useEffect(() => {
        const emotesNames = cookiesClient.get("emotes") as string[]
        if(emotesNames){
            setYourEmotesState("loading")

            setTotalEmotesNumber(emotesNames.length)

            emotesNames.forEach(name => {
                const cid = localStorage.getItem(name)
                axios.get(ipfsGateway + cid).then(response => {
                    setEmotesData(prev => prev ? [...prev, response.data] : [response.data])
                    
                }).catch(error => {
                    alert("Sometimes IPFS needs more time")
                })
            })
        }
    },[])

    useEffect(() => {
        if(emotesData && (emotesData.length === totalEmotesNumber)){
            setYourEmotesState("done")
        }
    }, [totalEmotesNumber, emotesData])


    function ShowIcon({state}:{state:any}){
        switch (state) {
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


    async function uploadEmote(){
        if(selectedFile && emoteCommand){
            try {
                setUploadedState("loading")
                const acceptedImageTypes = ['image/jpeg', 'image/png']
                if(!acceptedImageTypes.includes(selectedFile['type'])) throw Error("Unsupported image type")
                const ipfsClient = new NFTStorage({token: process.env.REACT_APP_NFTSTORAGE_API_KEY})
                const imageAsBase64 = await convertToBase64(selectedFile) as string
                const {height, width} = await getHeightAndWidthFromDataUrl(imageAsBase64)
                if(height !== 32 || width !== 32) throw Error("Emote has unsupported dimensions!")
                const emoteObj = new Blob([JSON.stringify({command: emoteCommand, image: imageAsBase64})])
                const cid = await ipfsClient.storeBlob(emoteObj)
                
                const emotesCookie = cookiesClient.get("emotes")

                console.log(emotesCookie)

                if(!emotesCookie){
                    cookiesClient.set("emotes", [emoteCommand], {expires: new Date(2147483647 * 1000)})
                    localStorage.setItem(emoteCommand, cid)
                }else{
                    cookiesClient.set("emotes", [...emotesCookie, emoteCommand], {expires: new Date(2147483647 * 1000)})
                    localStorage.setItem(emoteCommand, cid)
                }

           
                setUploadedState("done")
                
                
            } catch (error) {
                alert(error)
                setUploadedState("notdone")
            }

        }

    }


    return <div className="emotesContainer">
        <div className="goBackButton"><small className="goBackText" onClick={() => setOpenEmotesScreen(false)}>← go back</small></div>
        <h2 className="emotesTitle">Emotes</h2>
        <h5>Upload your emote:  <ShowIcon state={uploadedState}></ShowIcon></h5>
        <input type="text" onChange={e => setEmoteCommand(e.target.value)} placeholder="command"/>
        <input type="file" onChange={e => setSelectedFile(e.target.files![0])} />
        <button onClick={uploadEmote}>Upload</button>
       
        <h5>Your emotes: <ShowIcon state={yourEmotesState}></ShowIcon></h5>
        
        {emotesData && emotesData.map((value, index) => (<div className="emoteRecord" key={index}><small>{value.command}</small><img src={value.image} alt="emoteImage" /></div>))}
    </div>
}