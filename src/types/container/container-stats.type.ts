export interface ContainerStats {
  read: string;
  pids_stats: {
    current: number;
  };
  networks: {
    eth0: any;
    eth5: any;
  };
  memory_stats: {
    stats: any;
    max_usage: number;
    usage: number;
    failcnt: number;
    limit: number;
  };
  blkio_stats: any;
  cpu_stats: {
    cpu_usage: any;
    system_cpu_usage: number;
    online_cpus: number;
    throttling_data: any;
  };
  precpu_stats: {
    cpu_usage: any;
    system_cpu_usage: number;
    online_cpus: number;
    throttling_data: any;
  };
}