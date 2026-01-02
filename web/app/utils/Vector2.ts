
export class Vector2 {
    constructor(public x: number, public y: number) {
        this.x = x;
        this.y = y;
    }

    static add(a: Vector2, b: Vector2) {
        return new Vector2(a.x + b.x, a.y + b.y);
    }

    static lerp(a: Vector2, b: Vector2, t: number) {
        return new Vector2(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
    }
}