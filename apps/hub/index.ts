import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import { randomUUIDv7, type ServerWebSocket } from "bun";
import type {HubMessage, HubSignUpMessage} from "common/types";
import {prismaClient} from "db/client";

const availableValidators: {validatorId: string, socket: ServerWebSocket<unknown>, publicKey: string}[] = [];

const callbacks: { [key: string]: (data: HubMessage) => void } = {};
const COST_PER_VALIDATION = 100; // in lamports


Bun.serve({
    port: 8080,
    fetch(req, server) {
        if(server.upgrade(req)){
            return;
        } else {
            return new Response("Not a websocket");
        }
    },
    websocket: {
        async message(ws: ServerWebSocket, message: string) {
            let data: HubMessage;
            try {
                data = JSON.parse(message);
            } catch (e) {
                ws.send(JSON.stringify({
                    message: "Invalid message format"
                }));
                return ;
            }
            
            if (data.type === "signup") {
                const verified = verifyMessage(
                    `Signed message for ${data.data.callbackId},  ${data.data.publicKey}`,
                    data.data.signedMessage,
                    data.data.publicKey);

                if(verified) {
                    await signupHandler(ws, data.data);
                }
                
            } else if (data.type === "validate") {
                callbacks[data.data.callBackId](data);
                delete callbacks[data.data.callBackId];
            }
        },
    }
});

async function signupHandler(ws: ServerWebSocket, {callbackId, signedMessage, publicKey, location, ip}: HubSignUpMessage) {
    let validator = await prismaClient.validator.findFirst({
        where: {
            publicKey: publicKey
        }
    });

    //TODO: Given the ip, return the location
    if (!validator) {
        validator = await prismaClient.validator.create({
            data: {
                publicKey,
                location,
                ip
            }
        });
    }

    ws.send(JSON.stringify({
        type: "signup",
        callbackId: callbackId,
        validatorId: validator.id
    }));

    availableValidators.push({
        validatorId: validator.id,
        socket: ws,
        publicKey: validator.publicKey
    });
}

function verifyMessage(message: string, signedMessage: string, publicKey: string) {
    const messageArray = new TextEncoder().encode(message);

    return nacl.sign.detached.verify(
        messageArray, 
        new Uint8Array(JSON.parse(signedMessage)),
        new PublicKey(publicKey).toBytes()
    );
}


setInterval(async ()=> {
    const websitesToMonitor = await prismaClient.website.findMany({
        where: {
            disabled: false
        }
    });

    for (const website of websitesToMonitor) {
        for (const validator of availableValidators) {
            const callbackId = randomUUIDv7();
            console.log(`Sending validate to ${validator.validatorId} ${website.url}`);
            validator.socket.send(JSON.stringify({
                type: "validate",
                data: {
                    callbackId: callbackId,
                    url: website.url,
                    websiteid: website.id
                }
            }));

            callbacks[callbackId] = async function(data: HubMessage) {
                if(data.type === "validate") {
                    const {callBackId, signedMessage, websiteId, validatorId, timestamp, status, latency} = data.data;

                    const verified = verifyMessage(
                        `Replying to ${callBackId}`,
                        signedMessage,
                        validator.publicKey
                    );

                    if (!verified) {
                        return;
                    }
                    
                    await prismaClient.$transaction(async (tx) => {
                        await tx.websiteTick.create({
                            data: {
                                websiteId: websiteId,
                                validatorId: validatorId,
                                timestamp: new Date().getMilliseconds.toString(),
                                status: status,
                                latency: latency,
                            }
                        });

                        await tx.validator.update({
                            where: {
                                id: validatorId,
                            },
                            data: {
                                pendingPayouts: {increment: COST_PER_VALIDATION}
                            }
                        })
                    });    
                }   
            }
        }
    }
}, 180 * 1000);