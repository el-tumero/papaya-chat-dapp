export default async function jwkToCryptoKey(jwk:object){
    const key = await window.crypto.subtle.importKey(
        "jwk",
        jwk,
        {
            name: "ECDH",
            namedCurve: "P-384"
        },
        true,
        []
    )
    return key
}