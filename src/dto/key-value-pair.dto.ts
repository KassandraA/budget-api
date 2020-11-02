export class KeyValuePairDto {
  key: string;
  value: string;
}

export interface KeyValuePairsArrayDto {
  pairs: KeyValuePairDto[];
}
