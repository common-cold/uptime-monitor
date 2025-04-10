export interface ValidatorSignUpMessage {
    callbackId: string,
    validatorId: string
}

export interface ValidatorValidateMessage {
    callbackId: string,
    url: string,
    websiteId: string
}

export interface HubSignUpMessage {
    callbackId: string,
    signedMessage: string,
    publicKey: string,
    location: string,
    ip: string  
}   

export interface HubValidateSignupMessage {
    callBackId: string,
    signedMessage: string,
    websiteId: string,
    validatorId: string, 
    timestamp: string
    status: "Good" | "Bad",
    latency: number
}

export type ValidatorMessage = {
    type: "signup",
    data: ValidatorSignUpMessage
} | {
    type: "validate",
    data: ValidatorValidateMessage
}

export type HubMessage = {
    type: "signup",
    data: HubSignUpMessage
} | {
    type: "validate",
    data: HubValidateSignupMessage
}