export interface Head {
    charset?: string
    description?: string
    image?: string
    twitter?: TwitterHead
}

interface TwitterHead {
    card?: string
}
