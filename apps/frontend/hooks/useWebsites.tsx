import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_BASE_URL } from "@/config";
import { Website } from "@/interfaces";





export function useWebsites() {
    const [ websites, setWebsites ] = useState<Website[]>([]);
    const { getToken } = useAuth();

    async function refreshWebsites() {
        const token = await getToken();

        const response = await axios.get(`${BACKEND_BASE_URL}api/v1/websites`, {
            headers: {
                Authorization: token
            }
        });

        setWebsites(response.data.data);
    }

    useEffect(()=>{
        refreshWebsites(); 

        const interval = setInterval(() => {
            refreshWebsites();
        }, 1000 * 60 * 1);

        return () => clearInterval(interval);
    }, []);

    return {websites, refreshWebsites}
}