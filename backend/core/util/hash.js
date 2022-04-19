import crypto from "crypto";
export function createHash( payLoad ){
 return crypto.createHash('sha256').update(payLoad).digest('hex')
}