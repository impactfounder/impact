import { Button, Stack, useToast, Box } from '@sanity/ui'
import { useCallback, useState } from 'react'
import { set, type ObjectInputProps } from 'sanity'

export function LinkMetadataInput(props: ObjectInputProps) {
    const { onChange, members, renderDefault } = props
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    // Find the URL member to get its value
    const urlMember = members.find((member) => member.kind === 'field' && member.name === 'url')

    // Safe access to value
    // @ts-ignore
    const urlValue = urlMember?.field?.value

    const handleFetch = useCallback(async () => {
        if (!urlValue) {
            toast.push({ status: 'error', title: 'URL is missing' })
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch(`/api/og?url=${encodeURIComponent(urlValue)}`)
            const data = await response.json()

            if (data.error) throw new Error(data.error)

            const patches = [
                set(data.title, ['title']),
                set(data.description, ['description']),
            ]

            onChange(patches)

            toast.push({
                status: 'success',
                title: 'Metadata Fetched',
                description: 'Title and Description updated.',
            })
        } catch (err) {
            console.error(err)
            toast.push({
                status: 'error',
                title: 'Fetch Failed',
                description: 'Could not fetch metadata.',
            })
        } finally {
            setIsLoading(false)
        }
    }, [urlValue, onChange, toast])

    return (
        <Stack space={3}>
            {renderDefault({
                ...props,
                renderDefault: undefined
            })}
            <Box padding={2}>
                <Button
                    mode="ghost"
                    tone="primary"
                    onClick={handleFetch}
                    text={isLoading ? 'Fetching Metadata...' : '✨ Auto-Fill Metadata'}
                    disabled={isLoading || !urlValue}
                />
            </Box>
        </Stack>
    )
}
