"use client";

import { useEffect, useRef } from "react";
import { startPlaying, stopPlaying } from "../utils/GameLoopEngine";
import clsx from "clsx";
import { draw, setup } from "./gameLoop";

export default function GameCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const ratio = window.innerWidth / window.innerHeight;
    const scale = 30;
    const classHeight = 10;

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