import Dexie, {Table} from "dexie"

interface KeyPairRecord {
    id?:number
    pair?:CryptoKeyPair 
}

export default class KeyPairDatabase extends Dexie {
    public keyPairs!: Table<KeyPairRecord, number>

    public constructor() {
        super("KeyPairDatabase")
        this.version(1).stores({
            keyPairs: "++id,pair"
        })
    }
}
