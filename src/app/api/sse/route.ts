import { db } from "@/lib/prisma"
export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
    const encoder = new TextEncoder()
    const customReadable = new ReadableStream({
        async start(controller) {
            const sendPoints = async () => {
                try {
                    const points = await db.points.findMany({
                        include: {
                            user: true,
                            intraScores: true
                        },
                        orderBy: {
                            score: 'asc'
                        },
                        take: 10 // Limit the number of records
                    });
                    // get current players 
                    const players = await db.gameSession.findMany({
                        where: {
                            isActive: true
                        },
                        include: {
                            user: true
                        }
                    })
                    console.log({ points, players: players.map((p: { user: any }) => p.user) })
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ points, players: players.map((p: { user: any }) => p.user) })}\n\n`));
                } catch (error) {
                    console.error('Error fetching points:', error);
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify([])}\n\n`));
                }
            }

            // Send initial data
            await sendPoints()

            // Set up interval to send data every second
            const interval = setInterval(sendPoints, 1000)

            // Clean up interval when the connection is closed
            request.signal.addEventListener('abort', () => {
                clearInterval(interval)
                controller.close()
            })
        },
    })

    return new Response(customReadable, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Connection": "keep-alive",
            "Content-Encoding": "none",
            "Cache-Control": "no-cache, no-transform",
            "Content-Type": "text/event-stream; charset=utf-8",
        },
    })
}