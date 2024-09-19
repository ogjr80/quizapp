'use client';
import { CountdownComponent } from "@opherlabs/components";
import React from "react";
export default function Home() {
  return (
    <div>
          { CountdownComponent({ url: '/api/auth/signin', targetDate: '2024-09-26T20:00:00' })}
    </div>
  )
}
