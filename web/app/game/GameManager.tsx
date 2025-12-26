"use client";

import { useState } from "react";
import Game from "./Game";

export default function GameManager() {
    const [isStarted, setIsStarted] = useState(false);
    return (
        <>
            {isStarted ? (
                <Game />
            ) : (
                <button
                    className="bg-green-400 p-5 rounded text-white text-3xl"
                    onClick={() => setIsStarted(true)}
                >
                    Start
                </button>
            )}
        </>
    );
}