import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { scenes } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const db = getDb();
        const result = await db.select().from(scenes).where(eq(scenes.key, 'latest')).limit(1);

        if (result.length === 0) {
            return NextResponse.json(null);
        }

        return NextResponse.json(JSON.parse(result[0].data));
    } catch (error) {
        console.error('Error fetching scene:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const db = getDb();
        const body = await request.json();
        const sceneData = JSON.stringify(body);

        await db.insert(scenes)
            .values({ key: 'latest', data: sceneData })
            .onConflictDoUpdate({ target: scenes.key, set: { data: sceneData, updatedAt: new Date() } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving scene:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
