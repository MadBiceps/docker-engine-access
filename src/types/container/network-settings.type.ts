export interface NetworkSettings {
  Networks: {
    [key: string]: {
      NetworkID: string;
      EndpointID: string;
      Gateway: string;
      IPAddress: string;
      IPPrefixLen: number;
      IPv6Gateway: string;
      GlobalIPv6Address: string;
      GlobalIPv6PrefixLen: number;
      MacAddress: string;
    };
  };
}