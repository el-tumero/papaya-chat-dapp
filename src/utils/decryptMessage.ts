export default async function decryptMessage(encrypted:ArrayBuffer, keypair:CryptoKeyPair){
    try {
        const decrypted = await window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP"
            },
            keypair.privateKey,
            encrypted
        )

        const decoded = new TextDecoder("utf-8").decode(decrypted)
        return decoded
        
    } catch (error) {
        console.log(error)
    }
}