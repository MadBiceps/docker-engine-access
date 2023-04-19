import { HostConfig } from "./host-config.type";
import { Labels } from "./labels.type";
import { Mount } from "./mount.type";
import { Network } from "./network.type";
import { Port } from "./port.type";

export interface Container {
  Id: string;
  Names: string[];
  Image: string;
  ImageID: string;
  Command: string;
  Created: number;
  State: string;
  Status: string;
  Ports: Port[];
  Labels: Labels;
  SizeRw: number;
  SizeRootFs: number;
  HostConfig: HostConfig;
  NetworkSettings: Network;
  Mounts: Mount[];
}
