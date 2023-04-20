import { HostConfig } from "./host.config.type";

export interface ContainerConfig {
  Hostname: string;
  Domainname: string;
  User: string;
  AttachStdin: boolean;
  AttachStdout: boolean;
  AttachStderr: boolean;
  Tty: boolean;
  OpenStdin: boolean;
  StdinOnce: boolean;
  Env: string[];
  Cmd: string[];
  Entrypoint: string;
  Image: string;
  Labels: {
    [key: string]: string;
  };
  Volumes: {
    [key: string]: {};
  };
  WorkingDir: string;
  NetworkDisabled: boolean;
  MacAddress: string;
  ExposedPorts: {
    [key: string]: {};
  };
  StopSignal: string;
  StopTimeout: number;
  HostConfig: HostConfig;
  NetworkingConfig: {
    EndpointsConfig: {
      [key: string]: {};
    }
  };
}