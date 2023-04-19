export interface Mount {
  Name: string;
  Source: string;
  Destination: string;
  Driver: string;
  Mode: string;
  RW: boolean;
  Propagation: string;
}