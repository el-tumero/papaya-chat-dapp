import fs from "fs"
import path from "path"

interface ContractClientInteface {
    address: string
    abi: any,
}

export default async function createInterfaceForClient(contractName:string, abi:any, address:string){
    try {
        const dir = path.resolve(
            __dirname,
            `../src/abis/${contractName}.json`
        )

        const data:ContractClientInteface = {
            abi,
            address
        }
        
        fs.writeFileSync(dir, JSON.stringify(data))


    } catch (error) {
        console.log(error)
    }
}