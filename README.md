# Papaya Dapp Chat

<img src="./public/favicon.svg" width=75 />
<!-- ![logo](/public/favicon.svg) -->

## Project Description

Papaya Chat is the chat app that uses decentralized solutions. Made by [el-tumero](https://github.com/el-tumero) (tumerpl@gmail.com). The purpose of the application is to create safe place for online conversations. This safety comes from encryption and storing user data (username, photo, bio) on blockchain and IPFS. Smart contracts are deployed on Binance Smartchain Testnet.

### Usage and demo

upcoming

### How it works?

#### Initialization

![init_diagram](/screenshots/init_diagram.png)

These steps are done under the hood while on first user's entry (initialization):

1. User generates a key pair (ECDH) using Subtle Crypto Web API inside a browser
2. Then stores them in IndexedDB inside a browser
3. Sends public key to blockchain - thanks to that blockchain address of user is connected with public key of application
4. Next user creates a profile - name, bio, photo and uploads it to IPFS via nft.storage API
5. Then he saves its CID on blockchain and mints NFT
6. Account is fully created

#### Messaging

![init_diagram](/screenshots/messaging_diagram.png)

These steps are done under the hood while user establish conversation with diffrent user:

1. User downloads his mate's public key from blockchain (smart contract)
2. Creates common key from his mate's public key and user's private key thanks to Eliptic Curve Diffie Helman algorithm (ECDH) - this common key encrypts conversation with the AES algorithm.
3. User downloads his mate's profile from IPFS
4. User connect to relay server and start messaging

The presented diagrams in a simplified way show the operation of the application mechanisms. In the application code, the mechanisms are more elaborate and complex. Here I have introduced their essence.

## Technologies used

- Front end written in React and Typescript (src folder)

- SubtleCrypto Web API - for generating keys and encrypting messages (ECDH)

- Smart contracts are written in Solidity with OpenZeppelin (stored in contracts folder) compiled using Hardhat framework

- Relay server is written in Typescript uses Express and Socket.io <https://github.com/el-tumero/papaya-relay>

- IPFS and nft.storage API

### Examples of IPFS & nft.storage usage (in code)

- Saving profile to IPFS and creating NFT [src/components/Keypair.tsx](/src/components/KeyPair.tsx#L125)

```ts
            const imageAsBase64 = await convertToBase64(selectedFile)
            const profileObj = {name: profileName, bio: profileBio, photo: imageAsBase64}
            const content = new Blob([JSON.stringify(profileObj)])
            const ipfsClient = new NFTStorage({token: process.env.REACT_APP_NFTSTORAGE_API_KEY})

            try {
                const cid = await ipfsClient.storeBlob(content)

                const tx = await profileContract.mint(cid)
                const receipt = await tx.wait()

                setSteps(prev => {
                    const copy = [...prev]
                    copy[3] = "done"
                    return copy
                })

                alert("Profile created! cid: " + cid)
                document.location.reload()
                // console.log(receipt) 
            } catch (error) {
                alert(error)
                setSteps(prev => {
                    const copy = [...prev]
                    copy[3] = "notdone"
                    return copy
                })
            }
```

- Downloading user's profile [src/components/Keypair.tsx](/src/components/KeyPair.tsx#L85) - it's used for preview

```ts
                const address = await signer.getAddress()
                const cid = await profileContract.activeProfile(address)
                if(cid){
                    
                    setSteps(prev => {
                        const copy = [...prev]
                        copy[3] = "loading"
                        return copy
                    })
                    
                    const response = await axios.get(ipfsGateway + cid)
                    
                    setSteps(prev => {
                        const copy = [...prev]
                        copy[3] = "done"
                        return copy
                    })

                    setCurrentProfile(response.data)
```

- Downloading mate's profile, during the creation of "relation" [src/components/RelationList/RelationList.tsx](/src/components/RelationList/RelationList.tsx#L112) - profile is saved to browser's localStorage

```ts
                const clientAddress = await signer.getAddress()

                if(newRelationAddress.toLowerCase() === clientAddress.toLowerCase()) throw Error("You can't create a relation with youself ;)") 

                const result = await storageContract.getPublicKey(newRelationAddress)
                if(result.length === 0) {
                    throw Error("Current address has not created an account on this service :(")
                }
                localStorage.setItem("p"+newRelationAddress.toLowerCase(), result)

                const profileCid = await profileContract.activeProfile(newRelationAddress)

                //console.log(profileCid)

                const response = await axios.get(ipfsGateway + profileCid)
                const profile = response.data

                localStorage.setItem(newRelationAddress.toLowerCase(), JSON.stringify(profile))
                const cookies = cookiesClient
```

- Uploading custom emote [src/components/Emotes/Emotes.tsx](/src/components/Emotes/Emotes.tsx#L74)

```ts
               const acceptedImageTypes = ['image/jpeg', 'image/png']
                if(!acceptedImageTypes.includes(selectedFile['type'])) throw Error("Unsupported image type")
                const ipfsClient = new NFTStorage({token: process.env.REACT_APP_NFTSTORAGE_API_KEY})
                const imageAsBase64 = await convertToBase64(selectedFile) as string
                const {height, width} = await getHeightAndWidthFromDataUrl(imageAsBase64)
                if(height !== 32 || width !== 32) throw Error("Emote has unsupported dimensions!")
                const emoteObj = new Blob([JSON.stringify({command: emoteCommand, image: imageAsBase64})])
                const cid = await ipfsClient.storeBlob(emoteObj)
```

- Donwloading custom emotes [src/components/MessageBox/EmoteImage.tsx](/src/components/MessageBox/EmoteImage.tsx#L4)

```ts
                async function getEmoteImage(cid:string){
                    const response = await axios.get("https://"+cid+".ipfs.nftstorage.link")
                    return response.data.image as string
                }
```

## Authors

- [@el-tumero](https://github.com/el-tumero)
