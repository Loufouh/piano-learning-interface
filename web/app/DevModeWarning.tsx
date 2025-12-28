"use client";

import { useState } from "react";

export default function DevModeWarning() {
    const [isVisible, setIsVisible] = useState(true);

    return (
        <>
            {isVisible && (
                <div
                    className="flex justify-center items-center bg-red-600 min-h-10 font-bold text-green-300 animate-bounce"
                >
                    <h1>Dev Mode is on - SECURITY LOW (set NODE_ENV=production)</h1>
                    <button
                        className="bg-yellow-300 rounded w-10 text-black cursor-pointer y-10"
                        onClick={() => setIsVisible(false)}
                    >
                        X
                    </button>
                </div>
            )}
        </>
    )
}