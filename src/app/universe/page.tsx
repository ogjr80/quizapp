'use client'
import type { NextPage } from 'next';
import { CountdownComponent } from "@/components"

import { GamePlay } from "@/components"
const Home: NextPage = () => {
    const target = new Date("September 20, 2024 20:00:00").getTime();
    const now = new Date().getTime();
    const timeLeft = target - now;
    return (
        <div className="bsg">
            {timeLeft <= 0 ? <>
                <GamePlay />
            </> : CountdownComponent({ url: '/api/auth/signin', targetDate: '2024-09-20T20:00:00' })}
        </div>
    );
};

export default Home;