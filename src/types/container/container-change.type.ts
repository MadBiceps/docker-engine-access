export interface ContainerChange {
  Path: string;
  Kind: ContainerChangeKind;
}

export enum ContainerChangeKind {
  Modify = 0,
  Added = 1,
  Deleted = 2
}