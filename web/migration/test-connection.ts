import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-11-30',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
})

async function test() {
    try {
        const user = await client.users.getMe()
        console.log('Logged in as:', user.name)
    } catch (err) {
        console.error('Login failed:', err)
    }
}

test()
