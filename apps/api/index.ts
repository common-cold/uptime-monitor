import express from "express"
import cors from "cors"
import { authMiddleware } from "./middleware";
import { prismaClient } from "db/client"

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/v1/website", authMiddleware, async (req, res) => {
    const userId = req.userId!;
    const { url } = req.body!; 

    const data = await prismaClient.website.create({
        data: {
            url: url,
            userId: userId,
        }
    });

    res.json({
        id: data.id
    });
    
});

app.get("/api/v1/website/status", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const websiteId = req.query.websiteId as unknown as string;

    const data = await prismaClient.website.findFirst({
        where: {
            id: websiteId,
            userId: userId
        },
        include: {
            ticks: true
        }
    });

    res.json({
        data
    });

});

app.get("/api/v1/websites", authMiddleware, async (req, res) => {
    const userId = req.userId;

    const data = await prismaClient.website.findMany({
        where: {
            userId: userId,
            disabled: false
        },
        include: {
            ticks: true 
        }
    });

    res.json({
        data
    });
});

app.delete("/api/v1/website/", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const websiteId = req.body.websiteId;

    const data = await prismaClient.website.update({
        where: {
            id: websiteId,
            userId: userId
        },
        data: {
            disabled: true
        }
    });

    res.json({data});
});


app.listen(8080);