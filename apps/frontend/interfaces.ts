export interface WebsiteTick {
    id: string,
    timestamp: string,
    status: string,
    latency: number
}

export interface Website {
    id: string,
    url: string,
    userId: string,
    disabled: boolean
    ticks: WebsiteTick[]
}