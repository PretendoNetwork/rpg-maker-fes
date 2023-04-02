export type GenreIDs =
	1 |  // * Fantasy
	2 |  // * SF
	3 |  // * School Life
	4 |  // * Modern
	5 |  // * Japanese
	6 |  // * Adventure
	7 |  // * Puzzle
	8 |  // * Novel
	9 |  // * Hunt
	10 | // * Original
	11 | // * Romance
	12 | // * Training
	13 | // * Riddle
	14 | // * Horror
	15 | // * Mystery
	16 | // * Classic
	17 | // * Comical
	18 | // * Serious
	19 | // * Heartful
	20 | // * Dark
	21 | // * Chidlren's
	22 | // * Adult
	23 | // * For men
	24 | // * For women
	25 | // * Short
	26 | // * Long
	27 | // * Easy
	28 | // * Difficult
	29 | // * Collabo.
	30 | // * No Battle
	31 | // * Mini Game
	32 | // * Open Tech
	33 | // * movie NG
	34;  // * Updated

export type Genres = {
	[K in `genre${GenreIDs}`]?: 1;
}