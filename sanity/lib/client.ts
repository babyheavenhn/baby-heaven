import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false, // Set to false to get fresh data without CDN cache
    token: process.env.SANITY_API_TOKEN, // Required to access Content Lake releases
    perspective: 'previewDrafts', // Include drafts/releases content
})
