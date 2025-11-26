// Instagram Basic Display API endpoint
// This will fetch the 4 most recent posts from Instagram

import { NextResponse } from 'next/server';

export async function GET() {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!accessToken) {
        return NextResponse.json(
            { error: 'Instagram access token not configured', posts: [] },
            { status: 200 }
        );
    }

    try {
        // Fetch user's media from Instagram Basic Display API
        const response = await fetch(
            `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${accessToken}&limit=4`,
            { next: { revalidate: 3600 } } // Cache for 1 hour
        );

        if (!response.ok) {
            throw new Error('Failed to fetch from Instagram API');
        }

        const data = await response.json();

        return NextResponse.json({
            posts: data.data || [],
        });
    } catch (error) {
        console.error('Instagram API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch Instagram posts', posts: [] },
            { status: 200 }
        );
    }
}
