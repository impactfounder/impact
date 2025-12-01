import { createClient } from '@sanity/client'
import { JSDOM } from 'jsdom'
import { htmlToBlocks } from '@sanity/block-tools'
import { Schema } from '@sanity/schema'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

// Load Ghost Data
const ghostDataPath = path.join(process.cwd(), 'migration', 'ghost.json')
const ghostData = JSON.parse(fs.readFileSync(ghostDataPath, 'utf-8'))

// Sanity Client
const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: '2024-11-30',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN!,
})

// Schema for block-tools
const defaultSchema = Schema.compile({
    name: 'default',
    types: [
        {
            type: 'object',
            name: 'blogPost',
            fields: [
                {
                    title: 'Body',
                    name: 'body',
                    type: 'array',
                    of: [{ type: 'block' }],
                },
            ],
        },
    ],
})

const blockContentType = defaultSchema
    .get('blogPost')
    .fields.find((field: any) => field.name === 'body').type

// Helper to upload image
async function uploadImage(url: string) {
    try {
        const response = await fetch(url)
        if (!response.ok) throw new Error(`Failed to fetch: ${url}`)
        const buffer = await response.arrayBuffer()
        const asset = await client.assets.upload('image', Buffer.from(buffer), {
            filename: path.basename(url),
        })
        return asset
    } catch (error) {
        console.error(`Error uploading ${url}:`, error)
        return null
    }
}

async function migrate() {
    const posts = ghostData.db[0].data.posts
    // Include both 'post' and 'page' types
    const postsToMigrate = posts.filter(
        (p: any) => (p.type === 'post' || p.type === 'page') && p.status === 'published'
    )

    console.log(`Found ${postsToMigrate.length} items to migrate.`)

    for (const post of postsToMigrate) {
        console.log(`Migrating: ${post.title} (${post.type})`)

        // 1. Process Image
        let mainImage = null
        if (post.feature_image) {
            const imageUrl = post.feature_image.replace(
                '__GHOST_URL__',
                'https://jaewook.ghost.io'
            )
            const asset = await uploadImage(imageUrl)
            if (asset) {
                mainImage = {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: asset._id,
                    },
                }
            }
        }
// 배포 트리거용 주석
        // 2. Process HTML to Portable Text
        let body: any[] = []
        if (post.html) {
            const html = post.html.replace(/__GHOST_URL__/g, 'https://jaewook.ghost.io')
            try {
                body = htmlToBlocks(html, blockContentType, {
                    parseHtml: (html) => new JSDOM(html).window.document,
                })
            } catch (err) {
                console.error(`Failed to convert HTML for ${post.title}:`, err)
            }
        }

        // 3. Create Sanity Document
        const doc = {
            _type: 'post',
            _id: `ghost-${post.id}`,
            title: post.title,
            slug: { _type: 'slug', current: post.slug },
            publishedAt: new Date(post.published_at).toISOString(),
            mainImage,
            body,
        }

        try {
            await client.createOrReplace(doc)
            console.log(`✅ Created: ${post.title}`)
        } catch (err) {
            console.error(`❌ Failed: ${post.title}`, err)
        }
    }

    console.log('\n🎉 Migration complete!')
}

migrate().catch(console.error)
