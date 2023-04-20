export interface HostConfig {
  Binds: string[];
  Links: string[];
  Memory: number;
  MemorySwap: number;
  MemoryReservation: number;
  NanoCpus: number;
  CpuPercent: number;
  CpuShares: number;
  CpuPeriod: number;
  CpuRealtimePeriod: number;
  CpuRealtimeRuntime: number;
  CpuQuota: number;
  CpusetCpus: string;
  CpusetMems: string;
  MaximumIOps: number;
  MaximumIOBps: number;
  BlkioWeight: number;
  BlkioWeightDevice: string[];
  BlkioDeviceReadBps: string[];
  BlkioDeviceReadIOps: string[];
  BlkioDeviceWriteBps: string[];
  BlkioDeviceWriteIOps: string[];
  DeviceRequests: string[];
  MemorySwappiness: number;
  OomKillDisable: boolean;
  OomScoreAdj: number;
  PidMode: string;
  PidsLimit: number;
  PortBindings: {
    [key: string]: {
      HostIp?: string;
      HostPort?: string;
    }[];
  };
  PublishAllPorts: boolean;
  Privileged: boolean;
  ReadonlyRootfs: boolean;
  Dns: string[];
  DnsOptions: string[];
  DnsSearch: string[];
  VolumesFrom: string[];
  CapAdd: string[];
  CapDrop: string[];
  GroupAdd: string[];
  RestartPolicy: {
    Name?: string;
    MaximumRetryCount?: number;
  };
  AutoRemove: boolean;
  NetworkMode: string;
  Devices: string[];
  Ulimits: {
    Name: string;
    Soft: number;
    Hard: number;
  }[];
  LogConfig: {
    Type?: string;
    Config?: {
      [key: string]: string;
    };
  };
  SecurityOpt: string[];
  StorageOpt: {
    [key: string]: string;
  };
  CgroupParent: string;
  VolumeDriver: string;
  ShmSize: number;
}