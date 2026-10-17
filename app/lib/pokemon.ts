export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: { front_default: string | null; other?: { "official-artwork"?: { front_default: string | null } } };
  types: { type: { name: string } }[];
}
