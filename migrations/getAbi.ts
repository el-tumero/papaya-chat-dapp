import fs from "fs"
import path from "path"

export default function getAbi(contractName:string){
    try {
        const dir = path.resolve(
            __dirname,
            `../artifacts/contracts/${contractName}.sol/${contractName}.json`
        )

        const file = fs.readFileSync(dir, "utf-8")
        const json = JSON.parse(file)
        const abi = json.abi

        return abi
    } catch (error) {
        console.log(error)
    }
}