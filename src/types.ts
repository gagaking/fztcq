export type Category = 'top' | 'bottom';

export interface TopAttributes {
  itemType: string;
  shoulder: string;
  fit: string;
  sleeveLength: string;
  sleeveType: string;
  cuff: string;
  length: string;
  hem: string;
  collar: string;
}

export interface BottomAttributes {
  itemType: string;
  fit: string;
  rise: string;
  length: string;
  cuff: string;
  details: string[];
}

export interface AnchorConfig {
  reference: string;
  offset: number;
}

export interface AppState {
  category: Category;
  topAttributes: TopAttributes;
  bottomAttributes: BottomAttributes;
  topAnchor: AnchorConfig;
  bottomAnchor: AnchorConfig;
  pantsLengthAnchor: AnchorConfig; // Bottom length
}
