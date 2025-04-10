import { prismaClient } from "../src";

const USER_ID = "2";

async function seed() {
    await prismaClient.user.create({
        data: {
            id: USER_ID,
            email: "prajjwalkohli1@gmail.com"
        }
    });

    const website = await prismaClient.website.create({
        data: {
            url: "abc.com",
            userId: USER_ID,
        }
    });

    const validator = await prismaClient.validator.create({
        data: {
            publicKey: "0xjfdklsdlkslfs",
            location: "Delhi",
            ip: "192.168.00"
        }
    });
    
    await prismaClient.websiteTick.create({
        data: {
            websiteId: website.id,
            validatorId: validator.id,
            timestamp: new Date(), 
            status: "Good",
            latency: 1000,
        }
    });

    await prismaClient.websiteTick.create({
        data: {
            websiteId: website.id,
            validatorId: validator.id,
            timestamp: new Date(Date.now() - 1000 * 60 * 10), 
            status: "Bad",
            latency: 1000,
        }
    });

    await prismaClient.websiteTick.create({
        data: {
            websiteId: website.id,
            validatorId: validator.id,
            timestamp: new Date(Date.now() - 1000 * 60 * 20), 
            status: "Good",
            latency: 1000,
        }
    });

}

seed();