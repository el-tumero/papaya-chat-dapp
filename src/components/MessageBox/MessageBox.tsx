import { ethers } from "ethers"
import { DataConnection, Peer } from "peerjs"
import { disconnect } from "process"
import { useEffect, useRef, useState } from "react"
import { Socket } from "socket.io-client"
import getKeyPairFromDatabase from "../../utils/getKeyPairFromDatabase"
import "./MessageBox.css"
import IMessageData from "../../types/IMessageData"
import getPublicKeyFromBlockchain from "../../utils/getPublicKeyFromBlockchain"
import IMessageDataDb from "../../types/IMessageDataDb"

interface Props{
    senderAddress: string | undefined,
    receiverAddress: string | undefined,
    contract: ethers.Contract | undefined
    setReceiver: React.Dispatch<React.SetStateAction<string | undefined>>
    socket: Socket | undefined
    messageDb: IMessageDataDb
}



function MessageBox({senderAddress, receiverAddress, contract, setReceiver, socket, messageDb}:Props){

    const [messages, setMessages] = useState<string[]>([])
    const [typedMessage, setTypedMessage] = useState<string>("")
    const [receiverPublicKey, setReceiverPublicKey] = useState<CryptoKey>()
    
    const ref = useRef<HTMLInputElement>(null)


    useEffect(() => {
        if(contract && receiverAddress){
            getPublicKeyFromBlockchain(contract, receiverAddress).then(result => {
                if(result){
                    setReceiverPublicKey(result)
                }
            })
        }
    }, [receiverPublicKey])

    useEffect(() => {
        if(receiverAddress && messageDb[receiverAddress]){
            
            // console.log(messageDb)
            setMessages(prev => { return messageDb[receiverAddress].map(element => element.content!) })
        }
        
    }, [messageDb])

    
    // useEffect(() => {
    //     if(senderKeyPair && receiverPublicKey){
    //         console.log("Trying to connect!")
    //     }
    // }, [senderKeyPair, receiverPublicKey])


    async function sendMessage(){
        if(!socket || !receiverPublicKey) return
        setMessages(current => [...current, typedMessage])

        const enc = new TextEncoder()
        const encodedMessage = enc.encode(typedMessage)

        const encryptedMessage = await window.crypto.subtle.encrypt({
            name: "RSA-OAEP"
        },
        receiverPublicKey,
        encodedMessage
        )

        const message:IMessageData = {
            timestamp: Date.now(),
            from: senderAddress!,
            to: receiverAddress!,
            content: encryptedMessage
        }
        
        socket.send(message)

        ref.current!.value = ""
    }





    return(
        <div>
            <p className="text">Sending messages as {senderAddress}</p>
            <p className="text">To: {receiverAddress}</p>
            <div className="messages">
                {messages.map((message, index) => (<p className="message" key={index}>{message}</p>))}
            </div>
            <input type="text" className="input" ref={ref} onChange={e => setTypedMessage(e.target.value)} />
            <button className="sendButton" onClick={() => { sendMessage() }}>Send</button>
        </div>
    )
}

export default MessageBox