export const BASE_NOTES = [
	"C",
	"Db",
	"D",
	"Eb",
	"E",
	"F",
	"Gb",
	"G",
	"Ab",
	"A",
	"Bb",
	"B",
] as const;
export type BaseNote = (typeof BASE_NOTES)[number];

export function isLowerThan(n1: BaseNote, n2: BaseNote): boolean {
	return BASE_NOTES.indexOf(n1) < BASE_NOTES.indexOf(n2);
}
