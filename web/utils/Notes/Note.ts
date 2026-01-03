import { BASE_NOTES, type BaseNote, isLowerThan } from "./BaseNote";
import type Interval from "./Interval";

export default class Note {
	public static readonly A0_MIDI_CODE = 21;
	public static readonly C0_THEORIC_CODE = 12;

	private baseNote: BaseNote;
	private octave: number;

	constructor(baseNote: BaseNote, octave: number) {
		if (
			octave < 0 ||
			octave > 9 ||
			(isLowerThan(baseNote, "A") && octave > 0)
		) {
		}
		this.baseNote = baseNote;
		this.octave = octave;
	}

	public static fromMidiCode(midiCode: number) {
		if (midiCode < Note.A0_MIDI_CODE || midiCode > 127) {
			throw new Error("Invalid Note");
		}

		const noteIndex = midiCode - Note.C0_THEORIC_CODE;

		const baseNote = BASE_NOTES[noteIndex % 12];
		const octave = Math.floor(noteIndex / 12);

		return new Note(baseNote, octave);
	}

	public get BaseNote(): BaseNote {
		return this.baseNote;
	}

	public get Octave(): number {
		return this.octave;
	}

	public get MidiCode(): number {
		return (
			Note.C0_THEORIC_CODE +
			BASE_NOTES.indexOf(this.baseNote) +
			12 * this.octave
		);
	}

	public transposeUp(interval: Interval): Note {
		return Note.fromMidiCode(this.MidiCode + interval.Semitones);
	}

	public transposeDown(interval: Interval): Note {
		return Note.fromMidiCode(this.MidiCode - interval.Semitones);
	}

	public toString(): string {
		return `${this.baseNote}${this.octave}`;
	}

	static fromString(str: string): Note {
		const fixedCase =
			str[0].toUpperCase() + (str.slice(1, -1) + str.slice(-1)).toLowerCase();

		const baseNote: BaseNote = fixedCase.slice(0, -1) as BaseNote;
		const octave = parseInt(fixedCase.slice(-1), 10);

		return new Note(baseNote, octave);
	}
}
