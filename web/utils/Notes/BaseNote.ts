export const BASE_NOTES = [
	"A",
	"Bb",
	"B",
	"C",
	"Db",
	"D",
	"Eb",
	"E",
	"F",
	"Gb",
	"G",
	"Ab",
] as const;
export type BaseNote = (typeof BASE_NOTES)[number];
