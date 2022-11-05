import KeyPairDatabase from "../KeyPairDatabase"

export default async function getKeyPairFromDatabase(result:(pair:CryptoKeyPair) => void){
    const db = new KeyPairDatabase()
    db.transaction("r", db.keyPairs, async () => {
        const [data] = await db.keyPairs.toArray()
        if(data.pair) result(data.pair)
    })
}