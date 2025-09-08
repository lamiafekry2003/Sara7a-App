import CryptoJS from "crypto-js";
export const encrypt = async({plainText})=>{
    return CryptoJS.AES.encrypt(plainText,process.env.ENCRYPTION_KEY).toString()
}
export const decrypt = async({cipherText})=>{
    return CryptoJS.AES.decrypt(cipherText,process.env.ENCRYPTION_KEY).toString(
        CryptoJS.enc.Utf8
    )
}