import { BASE_NOTES, type BaseNote } from "./BaseNote";

export default class Note {
	public static readonly A0_MIDI_CODE = 21;

	private baseNote: BaseNote;
	private octave: number;

	constructor(midiCode: number) {
		if (midiCode < Note.A0_MIDI_CODE || midiCode > 127) {
			throw new Error("Invalid Note");
		}

		const noteIndex = midiCode - Note.A0_MIDI_CODE;

		this.baseNote = BASE_NOTES[noteIndex % 12];
		this.octave = Math.floor(noteIndex / 12);
	}

	public shiftBySemitones(shift: number): Note {
		return new Note(this.MidiCode + shift);
	}

	public get BaseNote(): BaseNote {
		return this.baseNote;
	}

	public get Octave(): number {
		return this.octave;
	}

	public get MidiCode(): number {
		return (
			Note.A0_MIDI_CODE + BASE_NOTES.indexOf(this.baseNote) + 12 * this.octave
		);
	}

	public toString(): string {
		return `${this.baseNote}${this.octave}`;
	}

	static fromString(str: string): Note {
		const fixedCase =
			str[0].toUpperCase() + (str.slice(1, -1) + str.slice(-1)).toLowerCase();

		const note: BaseNote = fixedCase.slice(0, -1) as BaseNote;
		const octave = parseInt(fixedCase.slice(-1), 10);

		return new Note(Note.A0_MIDI_CODE + BASE_NOTES.indexOf(note) + 12 * octave);
	}
}
