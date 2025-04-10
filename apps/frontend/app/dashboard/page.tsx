"use client"

import { Button } from "@/components/ui/button"
import { useWebsites } from "@/hooks/useWebsites"
import { useState } from "react"
import { Website } from "@/interfaces"
import { Badge } from "@/components/ui/badge"

function DashboardHeader() {
    return <div className="flex justify-between items-center w-full">
        <div className="flex justify-between items-center">
            <div className="px-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
            </div>
            <div className="text-base">Uptime Monitor</div>
        </div>
        <div>
            <Button>+ Add Website</Button>
        </div>
    </div>
}


function WebsiteCard({website}: {website: Website}) {
    const [isExpanded, setIsExpanded] = useState(false);
    
    //TODO: handling for empty ticks
    const latestTick = website.ticks[0];
    let statusColor;
    if(latestTick.status === "Good") {
        statusColor = "bg-green-500";
    } else if (latestTick.status === "Bad") {
        statusColor = "bg-red-500";
    } else {
        statusColor = "bg-grey-500";
    }

    return <div className="flex flex-col bg-[#1c2029] rounded-2xl p-4.5">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <Badge className={`w-4 h-4 m-2 rounded-full ${statusColor}`}></Badge>
                    {website.url}
                </div>
                <div className="flex items-center">
                    66.7% uptime
                    <button
                        onClick={()=>setIsExpanded(prev=> !prev)}>
                        <svg className={`ml-4 w-6 h-6 size-4.5 transition-transform duration-300 ${isExpanded ? "rotate-180" : "rotate-0"}`}
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-90" : "max-h-0"}`}>
                {
                    isExpanded &&
                    <div>
                        <div className="border border-gray-600 my-3"></div>
                        Last 30 minutes status: 
                        <div>
                            {[...Array(10)].map(()=>
                                <Badge rounded-md className="bg-green-500 w-8 m-0.5"></Badge>
                            )}
                        </div>
                        {`Last Checked ${latestTick.timestamp}`}    
                    </div>    
                }
            </div>
            
    </div>
}


function WebsiteCardComponent({websites}: {websites: Website[]}) {
    return <div className="flex flex-col">
        {websites.map((website, index)=>
            <div key={index}>
                <WebsiteCard website={website}/>
            </div>    
        )}
    </div>
}




export default function DashboardComponent() {
    const {websites, refreshWebsites} = useWebsites();

    return <div className="flex flex-col px-100 space-y-10">
        <DashboardHeader/>
        <div></div>
        <WebsiteCardComponent websites={websites}/>
    </div>
}