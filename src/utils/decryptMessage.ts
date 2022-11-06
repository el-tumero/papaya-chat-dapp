export default async function decryptMessage(encrypted:ArrayBuffer, secret:CryptoKey){

    try {
        const iv = Uint8Array.from([30, 101, 166, 160, 141, 236, 60, 68, 112, 204, 81, 64])
        const decrypted = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv
            },
            secret,
            encrypted
        )

        const decoded = new TextDecoder("utf-8").decode(decrypted)
        return decoded
        
    } catch (error) {
        console.log(error)
    }
}