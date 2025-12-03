"use client";

import { useEffect, useRef } from "react";

class Color {
    r: number;
    g: number;
    b: number;
    constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    toText(): string {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }

    static random() {
        return new Color(
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255)
        );
    }

    static lerp(a: Color, b: Color, t: number) {
        return new Color(
            a.r + (b.r - a.r) * t,
            a.g + (b.g - a.g) * t,
            a.b + (b.b - a.b) * t
        );
    }
}

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    let ctx;
    let canvas;

    let lastTime = Date.now();
    let time;
    let deltaTime;

    const colorChangeDuration = 1000; 
    let timeSinceLastChange = 0;
    let startingColor: Color = Color.random();
    let targetColor: Color = Color.random();
    let currentColor: Color;

    function draw() {
        time = Date.now();
        deltaTime = time - lastTime;
        lastTime = time;

        timeSinceLastChange += deltaTime;

        const currentColor = Color.lerp(
            startingColor,
            targetColor,
            timeSinceLastChange / colorChangeDuration
        );
        ctx!.fillStyle = currentColor.toText();
        ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

        if(timeSinceLastChange > colorChangeDuration) {
            startingColor = targetColor;
            targetColor = Color.random();
            timeSinceLastChange = 0;
        }

        requestAnimationFrame(draw);
    }
    useEffect(() => {
        canvas = canvasRef.current!;
        ctx = canvas?.getContext("2d");

        requestAnimationFrame(draw);
    }, [])

    const ratio = 16 / 9;
    const scale = 20;
    const classHeight = 30;

    return (
        <canvas 
            className={`w-[${classHeight*ratio}] h-[${classHeight}]`}
            width={classHeight*ratio*scale}
            height={classHeight*scale}
            ref={canvasRef} 
        ></canvas>
    );
}