'use client'
import type { NextPage } from 'next';
import { CountdownComponent } from "@/components"

import { GamePlay } from "@/components"
import { useSession } from 'next-auth/react';
const Home: NextPage = () => {
    const { data: session } = useSession()
    const target = new Date("September 23, 2024 08:00:00").getTime();
    const now = new Date().getTime();
    const timeLeft = target - now;
    return (
        <div className="bsg">
            {timeLeft <= 0 ? <>
                <GamePlay />
            </> : CountdownComponent({ session, url: '/api/auth/signin', targetDate: '2024-09-23T08:00:00' })}
        </div>
    );
};


export default Home;