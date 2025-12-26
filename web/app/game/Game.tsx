"use client";

import { useEffect, useRef, useState } from "react";
import { startPlaying, stopPlaying } from "../utils/GameLoopEngine";
import clsx from "clsx";
import { draw, setup } from "./gameLoop";

export default function Game() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ratio, setRatio] = useState(1);

    const scale = 30;
    const classHeight = 10;

    useEffect(() => {
        setRatio(window.innerWidth / window.innerHeight);
    }, []);

    useEffect(() => {
        const ctx = canvasRef.current!.getContext("2d");

        if (!ctx)
            return;

        setup();
        startPlaying(draw, ctx!);

        return stopPlaying;
    }, [])

    return (
        <>
            <canvas
                className={clsx(
                    `w-[${classHeight * ratio}] h-[${classHeight}]`,
                )}
                width={classHeight * ratio * scale}
                height={classHeight * scale}
                ref={canvasRef}
            >
            </canvas>
        </>
    );
}