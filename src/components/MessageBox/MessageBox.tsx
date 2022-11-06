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
    const [senderMessages, setSenderMessages] = useState<{content:string | undefined, timestamp:number}[]>([]) 
    
    const inputRef = useRef<HTMLInputElement>(null)
    const bottomRef = useRef<HTMLDivElement>(null)


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

        if(receiverAddress && !messageDb[receiverAddress]){
            setMessages(senderMessages.map(element => element.content!))
        }

        if(receiverAddress && messageDb[receiverAddress]){

            const receiverMessages = messageDb[receiverAddress]

            const convMessages = senderMessages.concat(receiverMessages)


            convMessages.sort((a, b) => a.timestamp - b.timestamp)
            setMessages(convMessages.map(element => element.content!))

            

            // console.log(messageDb)
            // setMessages(prev => { return messageDb[receiverAddress].map(element => element.content!) })
        }

            
    }, [messageDb, senderMessages])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages])

    
    async function sendMessage(){
        if(!socket || !receiverPublicKey) return

        setSenderMessages(current => [...current, {content: typedMessage, timestamp: Date.now()}])
        // setMessages(current => [...current, typedMessage])

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

        inputRef.current!.value = ""
        setTypedMessage("")
    }





    return(
        <div>
            <p className="text">Sending messages as {senderAddress}</p>
            <p className="text">To: {receiverAddress}</p>
            <div className="messages">
                {messages.map((message, index) => (<p className="message" key={index}>{message}</p>))}
                <div ref={bottomRef}></div>
            </div>
            <input type="text" className="input" ref={inputRef} onChange={e => setTypedMessage(e.target.value)} onKeyDown={e => { if(e.key === "Enter") sendMessage() }} />
            <button className="sendButton" onClick={() => { sendMessage() }}>Send</button>

        </div>
    )
}

export default MessageBox