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
                            user: true
                        },
                        orderBy: {
                            score: 'asc'
                        },
                        take: 100 // Limit the number of records
                    });

                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(points)}\n\n`));
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