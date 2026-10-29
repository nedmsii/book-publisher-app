import type en from "./dictionaries/en";

export type Dictionary = typeof en;

export type GenreKey = keyof Dictionary["genres"];
