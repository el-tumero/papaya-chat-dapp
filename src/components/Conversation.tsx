import { useEffect, useState } from "react"
import {JSEncrypt} from "jsencrypt"

function Conversation() {
    
    const [encryptor] = useState<JSEncrypt>(new JSEncrypt())
    const [decryptor] = useState<JSEncrypt>(new JSEncrypt())

    const [message, setMessage] = useState<string>("Hello")
    const [encryptedMessage, setEncryptedMessage] = useState<string>("")

    useEffect(() => {
        const publicKey = `
        -----BEGIN PUBLIC KEY-----
        MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDlOJu6TyygqxfWT7eLtGDwajtN
        FOb9I5XRb6khyfD1Yt3YiCgQWMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76
        xFxdU6jE0NQ+Z+zEdhUTooNRaY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4
        gwQco1KRMDSmXSMkDwIDAQAB
        -----END PUBLIC KEY-----`;

        encryptor.setPublicKey(publicKey)
    }, [encryptor])

    useEffect(() => {
        const privateKey = `
        -----BEGIN RSA PRIVATE KEY-----
        MIICXQIBAAKBgQDlOJu6TyygqxfWT7eLtGDwajtNFOb9I5XRb6khyfD1Yt3YiCgQ
        WMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76xFxdU6jE0NQ+Z+zEdhUTooNR
        aY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4gwQco1KRMDSmXSMkDwIDAQAB
        AoGAfY9LpnuWK5Bs50UVep5c93SJdUi82u7yMx4iHFMc/Z2hfenfYEzu+57fI4fv
        xTQ//5DbzRR/XKb8ulNv6+CHyPF31xk7YOBfkGI8qjLoq06V+FyBfDSwL8KbLyeH
        m7KUZnLNQbk8yGLzB3iYKkRHlmUanQGaNMIJziWOkN+N9dECQQD0ONYRNZeuM8zd
        8XJTSdcIX4a3gy3GGCJxOzv16XHxD03GW6UNLmfPwenKu+cdrQeaqEixrCejXdAF
        z/7+BSMpAkEA8EaSOeP5Xr3ZrbiKzi6TGMwHMvC7HdJxaBJbVRfApFrE0/mPwmP5
        rN7QwjrMY+0+AbXcm8mRQyQ1+IGEembsdwJBAN6az8Rv7QnD/YBvi52POIlRSSIM
        V7SwWvSK4WSMnGb1ZBbhgdg57DXaspcwHsFV7hByQ5BvMtIduHcT14ECfcECQATe
        aTgjFnqE/lQ22Rk0eGaYO80cc643BXVGafNfd9fcvwBMnk0iGX0XRsOozVt5Azil
        psLBYuApa66NcVHJpCECQQDTjI2AQhFc1yRnCU/YgDnSpJVm1nASoRUnU8Jfm3Oz
        uku7JUXcVpt08DFSceCEX9unCuMcT72rAQlLpdZir876
        -----END RSA PRIVATE KEY-----`;
        decryptor.setPrivateKey(privateKey)
    }, [decryptor])
    
    function encryptMessage(){
        const enrypted = encryptor.encrypt(message)
        console.log(enrypted)
        if(enrypted) setEncryptedMessage(enrypted)
    }    

    function decryptMessage(){
        const decrypted = decryptor.decrypt(encryptedMessage)
        if(decrypted) console.log(decrypted)
    }

    return(
        <div>
            <input type="text" onChange={e => setMessage(e.target.value)} />
            <div onClick={encryptMessage}>
                Encrypt!
            </div>

            <div onClick={decryptMessage}>
                Decrypt!
            </div>
        </div>
        
    )

}

export default Conversation