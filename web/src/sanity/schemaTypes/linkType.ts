import { LinkIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'
import { LinkMetadataInput } from '../components/UrlInput'

export const linkType = defineType({
    name: 'link',
    title: 'Curated Link',
    type: 'document',
    icon: LinkIcon,
    fields: [
        defineField({
            name: 'url',
            title: 'URL',
            type: 'url',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            description: 'Fetched automatically from OG tags, but can be edited.',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'image',
            title: 'Cover Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'url',
            media: 'image',
        },
    },
    components: {
        input: LinkMetadataInput,
    },
})
