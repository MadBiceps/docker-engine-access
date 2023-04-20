import { Labels } from "../labels.type";
import { Mount } from "../mount.type";
import { NetworkSettings } from "./network-settings.type";
import { Port } from "../port.type";

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
  HostConfig: {
    NetworkMode: string,
  };
  NetworkSettings: NetworkSettings;
  Mounts: Mount[];
}
