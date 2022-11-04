import { ethers } from "ethers"
import { DataConnection, Peer } from "peerjs"
import { useEffect, useState } from "react"
import Cookies from "universal-cookie"
import KeyPairDatabase from "../../KeyPairDatabase"
import str2ab from "../../utils/str2ab"
import "./MessageBox.css"

interface Props{
    senderAddress: string | undefined,
    receiverAddress: string | undefined,
    contract: ethers.Contract | undefined
    setReceiver: React.Dispatch<React.SetStateAction<string | undefined>>
}

function MessageBox({senderAddress, receiverAddress, contract, setReceiver}:Props){

    const [messages, setMessages] = useState<string[]>([])
    const [typedMessage, setTypedMessage] = useState<string>("")
    const [connection, setConnection] = useState<DataConnection>()
    const [receiverPublicKey, setReceiverPublicKey] = useState<CryptoKey>()
    const [senderKeyPair, setSenderKeyPair] = useState<CryptoKeyPair>()
    
    useEffect(() => {
        if(!connection && senderKeyPair && receiverPublicKey){
            console.log("Trying to connect!")
            const cookies = new Cookies()
            const signature = cookies.get("signature")
            createConnection(signature)
        }
    }, [connection, senderKeyPair, receiverPublicKey])

    useEffect(() => {
        getPublicKeyFromBlockchain()
        getKeyPairFromDatabase()
    }, [])

    // useEffect(() => {
    //     if(receiverPublicKey) console.log(receiverPublicKey)
    // }, [receiverPublicKey])

    // useEffect(() => {
    //     if(senderKeyPair) console.log(senderKeyPair)
    // }, [senderKeyPair])


    async function getPublicKeyFromBlockchain(){
        if(contract){
            const publicKeyStr = await contract.getPublicKey(receiverAddress) as string
            const binPublicKey = str2ab(publicKeyStr)
            try {
                const publicKey = await window.crypto.subtle.importKey("spki", binPublicKey, {
                    name: "RSA-OAEP",
                    hash: "SHA-256"
                },
                true,
                ["encrypt"])

                setReceiverPublicKey(publicKey)
            } catch (error) {
                console.log(error)
            }
        }   
    }

    async function getKeyPairFromDatabase(){
        const db = new KeyPairDatabase()

        db.transaction("r", db.keyPairs, async () => {
            const [result] = await db.keyPairs.toArray()
            if(result.pair) setSenderKeyPair(result.pair)
        })
    }

    function createConnection(signature: string){
        if(senderAddress && receiverAddress){
            const peer = new Peer(senderAddress, {host: "localhost", port: 9000, path: "/", token: signature})
            const conn = peer.connect(receiverAddress)

           
            conn.on("open", () => {
                console.log("Connection (send channel) is open!")
                setConnection(conn)
            })

            peer.on("connection", (conn) => {
                console.log("Connection (receive channel) is open!")
                conn.on("data", async(data) => {

                    try {
                        const decrypted = await window.crypto.subtle.decrypt(
                            {
                                name: "RSA-OAEP"
                            },
                            senderKeyPair!.privateKey,
                            data as ArrayBuffer
                        )

                        const decoded = new TextDecoder("utf-8").decode(decrypted)
                        setMessages(current => [...current, decoded])
                        
                    } catch (error) {
                        console.log(error)
                    }
                   
                })
            })


            conn.on("close", () => {
                console.log("User disconnected")
            })

        }
    }

    async function sendMessage(){
        setMessages(current => [...current, typedMessage])

        const enc = new TextEncoder()
        const encodedMessage = enc.encode(typedMessage)

        const encryptedMessage = await window.crypto.subtle.encrypt({
            name: "RSA-OAEP"
        },
        receiverPublicKey!,
        encodedMessage
        )

        connection?.send(encryptedMessage)
    }



    return(
        <div>
            <p className="text">Sending messages as {senderAddress}</p>
            <p className="text">To: {receiverAddress}</p>
            <div className="messages">
                {messages.map((message, index) => (<p className="message" key={index}>{message}</p>))}
            </div>
            <input type="text" className="input" onChange={e => setTypedMessage(e.target.value)} />
            <button className="sendButton" onClick={() => { sendMessage() }}>Send</button>
            <button onClick={() => setReceiver(undefined)}>Close conversation</button>
        </div>
    )
}

export default MessageBox