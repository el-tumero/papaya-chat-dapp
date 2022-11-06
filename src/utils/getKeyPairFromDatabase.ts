import { resolve } from "path"
import KeyPairDatabase from "../KeyPairDatabase"

export default function getKeyPairFromDatabase(){
    return new Promise<CryptoKeyPair>((resolve, reject) => {
        const db = new KeyPairDatabase()
        db.transaction("r", db.keyPairs, async () => {
        const [data] = await db.keyPairs.toArray()
        if(data.pair) resolve(data.pair)
    })
    })
    
}