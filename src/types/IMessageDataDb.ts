import IMessageData from "./IMessageData";

export default interface IMessageDataDb{
    [key: string]: {timestamp:number, content:string | undefined}[]
}