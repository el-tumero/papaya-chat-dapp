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
import deriveSecretKey from "../../utils/deriveSecretKey"
import encryptMessage from "../../utils/encryptMessage"
import axios from "axios"
import EmoteImage from "./EmoteImage"
import { clear } from "console"


interface Props{
    senderAddress: string | undefined,
    receiverAddress: string | undefined,
    contract: ethers.Contract | undefined
    setReceiver: React.Dispatch<React.SetStateAction<string | undefined>>
    socket: Socket | undefined
    messageDb: IMessageDataDb
}



function MessageBox({senderAddress, receiverAddress, contract, setReceiver, socket, messageDb}:Props){

    const [messages, setMessages] = useState<{content: string, me?:boolean}[]>([])
    const [typedMessage, setTypedMessage] = useState<string>("")
    const [receiverPublicKey, setReceiverPublicKey] = useState<CryptoKey>()
    const [lastMessage, setLastMessage] = useState<string>("")
    // const [senderMessages, setSenderMessages] = useState<{content:string | undefined, timestamp:number}[]>([]) 
    
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
        if(!localStorage.getItem("c"+receiverAddress)){
            localStorage.setItem("c"+receiverAddress, JSON.stringify([]))
        }
    }, [])

    useEffect(() => {

        if(receiverAddress && !messageDb[receiverAddress]){
            // setMessages(senderMessages.map(element => element.content!))
            const _senderMessages = localStorage.getItem("c" + receiverAddress)
            if(_senderMessages) {
                const senderMessagesObj = JSON.parse(_senderMessages) as {content:string | undefined, timestamp:number}[]
                const senderMessagesObjWithMe = senderMessagesObj.map(msg => ({content: msg.content, timestamp: msg.timestamp, me: true }))
                const convMessages = senderMessagesObjWithMe
                convMessages.sort((a, b) => a.timestamp - b.timestamp)
                setMessages(convMessages.map(element => ({content: element.content!, me: element.me}) ))
            }
        }

        if(receiverAddress && messageDb[receiverAddress]){

            const receiverMessages = messageDb[receiverAddress] as {timestamp: number; content: string | undefined, me:boolean}[]

            const _senderMessages = localStorage.getItem("c" + receiverAddress)

            if(_senderMessages) {
                const senderMessagesObj = JSON.parse(_senderMessages) as {content:string | undefined, timestamp:number}[] 
                
                const senderMessagesObjWithMe = senderMessagesObj.map(msg => ({content: msg.content, timestamp: msg.timestamp, me: true }))

                // console.log(senderMessagesObjWithMe)

                const convMessages = senderMessagesObjWithMe.concat(receiverMessages) 

                convMessages.sort((a, b) => a.timestamp - b.timestamp)

                setMessages(convMessages.map(element => ({content: element.content!, me: element.me}) ))

            }
        }        
    }, [messageDb, lastMessage])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages])

    
    async function sendMessage(){
        if(!socket || !receiverPublicKey) return

        // setSenderMessages(current => [...current, {content: typedMessage, timestamp: Date.now()}])

        setLastMessage(typedMessage)

        let msg = typedMessage

        if(typedMessage[0] === "!" && typedMessage[1] === "!"){
            const emoteName = typedMessage.substring(2)
            const cid = localStorage.getItem(emoteName)
            if(cid){
                msg = "!!"+cid
            }else{
                msg = emoteName
            }
        }

        const sentMessagesHistory = localStorage.getItem("c"+receiverAddress)
        if(sentMessagesHistory){
            const sentMessagesHistoryObj = JSON.parse(sentMessagesHistory)
            localStorage.setItem("c"+receiverAddress, JSON.stringify([...sentMessagesHistoryObj, {content: msg, timestamp: Date.now()}]))
        }

        

        const enc = new TextEncoder()
        const encodedMessage = enc.encode(msg)

        const pair = await getKeyPairFromDatabase()

        const secret = await deriveSecretKey(pair.privateKey, receiverPublicKey)

        const encryptedMessage = await encryptMessage(secret, encodedMessage)
    
        const message:IMessageData = {
            timestamp: Date.now(),
            from: senderAddress!,
            to: receiverAddress!,
            content: encryptedMessage,
        }
        
        // console.log(message)

       

        socket.send(message)

        inputRef.current!.value = ""
        setTypedMessage("")
        
       
    }

    function clear(){
        localStorage.setItem("c"+receiverAddress, JSON.stringify([]))
        setLastMessage("")
    }

   

    return(
        <div className="messageBoxContainer">
            <p className="text">Sending messages as {senderAddress}</p>
            <p className="text">To: {receiverAddress}</p>
            <div className="messages">
                {messages.map((message, index) => (<p className="message" key={index}>{message.me ? <b style={{color: "green"}} >me: </b> : "mate: " }{ message.content.substring(0, 2) === "!!" ? <EmoteImage cid={message.content.substring(2)}></EmoteImage> : message.content}</p>))}
                <div ref={bottomRef}></div>
            </div>
            <div>
                <input type="text"  className="input" ref={inputRef} onChange={e => setTypedMessage(e.target.value)} onKeyDown={e => { if(e.key === "Enter") sendMessage() }} />
                <button className="sendButton" onClick={() => { sendMessage() }}>Send</button>
                <button className="clear" onClick={() => clear()}>Clear</button>
                <button onClick={() => setReceiver(undefined)}>Close</button>
            </div>
            

        </div>
    )
}

export default MessageBox