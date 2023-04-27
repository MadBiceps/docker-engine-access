export interface Image {
  Id: string;
  ParentId: string;
  RepoTags: string[];
  RepoDigests: string[];
  Created: string;
  Size: number;
  SharedSize: number;
  VirtualSize: number;
  Labels: {[key: string]: string};
  Containers: number;
}