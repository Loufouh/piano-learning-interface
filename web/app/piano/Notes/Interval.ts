import type Note from "./Note";

export default class Interval {
	private semitones: number;

	constructor(semitones: number) {
		if (Number.isNaN(semitones)) {
			throw new Error("Invalid Interval");
		}

		this.semitones = Math.abs(semitones);
	}

	public get Semitones(): number {
		return this.semitones;
	}

	public simplified(): Interval {
		return new Interval(this.semitones % 12);
	}

	public diminished(): Interval {
		return new Interval(this.semitones - 1);
	}
	public augmented(): Interval {
		return new Interval(this.semitones + 1);
	}

	public toString(): string {
		const simplified = this.simplified();
		const octaveCount = Math.floor(this.semitones / 12);

		console.log(`[toString], semitones: ${this.semitones}`);

		if (simplified.Semitones === 6) {
			return `d${7 * octaveCount + 5}`;
		}

		let simplifiedNum = 0;

		if (0 === simplified.Semitones) simplifiedNum = 1;
		else if ([1, 2].includes(simplified.Semitones)) simplifiedNum = 2;
		else if ([3, 4].includes(simplified.Semitones)) simplifiedNum = 3;
		else if (5 === simplified.Semitones) simplifiedNum = 4;
		else if (7 === simplified.Semitones) simplifiedNum = 5;
		else if ([8, 9].includes(simplified.Semitones)) simplifiedNum = 6;
		else if ([10, 11].includes(simplified.Semitones)) simplifiedNum = 7;

		const quality = this.isPerfect() ? "P" : this.isMajor() ? "M" : "m";

		return `${quality}${7 * octaveCount + simplifiedNum}`;
	}

	public isMinor() {
		return [1, 3, 8, 10].includes(this.simplified().Semitones);
	}

	public isMajor() {
		return [2, 4, 9, 11].includes(this.simplified().Semitones);
	}

	public isPerfect() {
		return [0, 5, 7].includes(this.simplified().Semitones);
	}

	public isTriton() {
		return [6].includes(this.simplified().Semitones);
	}

	public static fromNotes(note1: Note, note2: Note) {
		return new Interval(note2.MidiCode - note1.MidiCode);
	}

	public static second() {
		return new Interval(2);
	}

	public static third() {
		return new Interval(4);
	}

	public static fourth() {
		return new Interval(5);
	}

	public static fifth() {
		return new Interval(7);
	}

	public static sixth() {
		return new Interval(9);
	}

	public static seventh() {
		return new Interval(11);
	}

	public static octave() {
		return new Interval(12);
	}
}
