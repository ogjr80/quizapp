'use client'
import React, { useEffect, useState } from 'react';
import { Points } from '@prisma/client';
export const PointsSubscriber: React.FC = () => {

    const [data, setData] = useState<Points[]>([]);

    useEffect(() => {
        const eventSource = new EventSource('/api/sse');
        eventSource.onmessage = (event) => {
            const newData = JSON.parse(event.data);
            setData(newData); // Append new data to existing state
        };

        eventSource.onerror = (error) => {
            console.error('SSE error:', error);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []); // Remove 'data' from the dependency array

    return (
        <div>
            <h1>Scores from Database</h1>
            <ul>
                <pre>
                    {JSON.stringify({ data, }, null, 2)}
                </pre>
            </ul>
        </div>
    );
};

export default PointsSubscriber;