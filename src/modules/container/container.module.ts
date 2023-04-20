import axios from "axios";
import { InspectContainer } from "../../types/container/inspect.container.type";
import { ContainerChange } from "../../types/container/container-change.type";
import { ContainerConfig } from "../../types/container/container-config.type";
import { Container } from "../../types/container/container.type";
import { ContainerStats } from "../../types/container/container-stats.type";

export module ContainerModule {
  /**
   * List containers
   * 
   * Returns a list of containers. For details on the format, see the inspect endpoint. 
   * Note that it uses a different, smaller representation of a container than inspecting a single container.
   * For example, the list of linked containers is not propagated.
   * 
   * @param url URL of the docker daemon
   * @param all Default: false - Show all containers. Only running containers are shown by default.
   * @param limit Return this number of most recently created containers, including non-running ones.
   * @param size Default: false - Return the size of container as fields __SizeRw__ and __SizeRootFs__. 
   * @param filters Filters to process on the container list, encoded as JSON ```(a map[string][]string)```. For example, ```{"status": ["paused"]}``` will only return paused containers.
   * 	Available filters:
   * * ```ancestor=(<image-name>[:<tag>], <image id>, or <image@digest>)```
   * * ```before=(<container id> or <container name>)```
   * * ```expose=(<port>[/<proto>]|<startport-endport>/[<proto>])```
   * * ```exited=<int> containers with exit code of <int>```
   * * ```health=(starting|healthy|unhealthy|none)```
   * * ```id=<ID>``` a container's ID
   * * ```isolation=(default|process|hyperv)``` (Windows daemon only)
   * * ```is-task=(true|false)```
   * * ```label=key``` or ```label="key=value"``` of a container label
   * * ```name=<name>``` a container's name
   * * ```network=(<network id> or <network name>)```
   * * ```publish=(<port>[/<proto>]|<startport-endport>/[<proto>])```
   * * ```since=(<container id> or <container name>)```
   * * ```status=(created|restarting|running|removing|paused|exited|dead)```
   * * ```volume=(<volume name>``` or ```<mount point destination>) ```
   * 
   * @returns List of containers
  */
  export function list(url: string, all?: boolean, limit?: number, size?: boolean, filters?: { [key: string]: string[] }) {
    const endpoint = new URL(`${url}/containers/json`);

    if (all) endpoint.searchParams.append('all', all.toString())
    if (limit) endpoint.searchParams.append('limit', limit.toString())
    if (size) endpoint.searchParams.append('size', size.toString())
    if (filters) endpoint.searchParams.append('filters', JSON.stringify(filters))

    return axios.get<Container[] | Error>(endpoint.toString())
      .then(x => x.data)
      .catch(x => {
        throw x.response.data;
      });
  }

  /**
   * Create a container
   * 
   * @param url URL of the docker daemon
   * @param containerConfig Configuration for the container
   * @param name Assign the specified name to the container. Must match *\/?[a-zA-Z0-9][a-zA-Z0-9_.-]+*.
   * @param platform Default: "" - Platform in the format *os[/arch[/variant]]* used for image lookup.
   * When specified, the daemon checks if the requested image is present in the local image cache with the given OS and Architecture, and otherwise returns a 404 status.
   * 
   *  If the option is not set, the host's native OS and Architecture are used to look up the image in the image cache.
   *  However, if no platform is passed and the given image does exist in the local image cache, but its OS or architecture does not match, the container is created with the available image, and a warning is added to the Warnings field in the response, for example;
   *
   * @returns Id of the created container
   */
  export function create(url: string, containerConfig: ContainerConfig, name?: string, platform?: string) {
    const endpoint = new URL(`${url}/containers/create`);

    if (name) endpoint.searchParams.append('name', name)
    if (platform) endpoint.searchParams.append('platform', platform)

    return axios.post<{
      Id: string,
      Warnings: string[]
    } | Error>(endpoint.toString(), containerConfig)
      .then(x => x.data)
      .catch(x => {
        throw x.response.data;
      });
  }

  /**
   * Inspect a container
   * 
   * Return low-level information about a container.
   * 
   * @param url URL of the docker daemon
   * @param id Id of the container
   * @param size Return the size of container as fields *SizeRw* and *SizeRootFs*
   * @returns Container Model 
   */
  export function inspect(url: string, id: string, size?: boolean) {
    const endpoint = new URL(`${url}/containers/${id}/json`);

    if (size) endpoint.searchParams.append('size', size.toString())

    return axios.get<InspectContainer | Error>(endpoint.toString())
      .then(x => x.data)
      .catch(x => {
        throw x.response.data;
      });
  }

  /**
   * List processes running inside a container
   * 
   * On Unix systems, this is done by running the *ps* command. This endpoint is not supported on Windows.
   * 
   * @param url URL of the docker daemon
   * @param id Id of the container
   * @param psArgs Default: *"-ef"* - The arguments to pass to *ps*. For example, *aux*
   * @returns List of processes running inside the container
   */
  export function top(url: string, id: string, psArgs?: string) {
    const endpoint = new URL(`${url}/containers/${id}/top`);

    if (psArgs) endpoint.searchParams.append('ps_args', psArgs)

    return axios.get<{
      Titles: string[],
      Processes: string[][]
    } | Error>(endpoint.toString())
      .then(x => x.data)
      .catch(x => {
        throw x.response.data;
      });
  }

  /**
   * Get container logs
   * 
   * Get stdout and stderr logs from a container.
   * Note: This endpoint works only for containers with the *json-file* or journald *logging driver*.
   * 
   * @param url URL of the docker daemon
   * @param id Id of the container
   * @param follow Default: false - Keep connection after returning logs.
   * @param stdout Default: false - Return logs from stdout
   * @param stderr Default: false - Return logs from stderr
   * @param since Default: 0 - Only return logs since this time, as a UNIX timestamp
   * @param until Default: 0 - Only return logs before this time, as a UNIX timestamp
   * @param timestamps Default: 0 - Only return logs before this time, as a UNIX timestamp
   * @param tail Default: "all" - Only return this number of log lines from the end of the logs. Specify as an integer or all to output all log lines.
   * @returns Logs from the container as stream
   */
  export function logs(url: string, id: string, follow?: boolean, stdout?: boolean, stderr?: boolean, since?: number, until?: number, timestamps?: boolean, tail?: string) {
    const endpoint = new URL(`${url}/containers/${id}/logs`);

    if (follow) endpoint.searchParams.append('follow', follow.toString())
    if (stdout) endpoint.searchParams.append('stdout', stdout.toString())
    if (stderr) endpoint.searchParams.append('stderr', stderr.toString())
    if (since) endpoint.searchParams.append('since', since.toString())
    if (until) endpoint.searchParams.append('until', until.toString())
    if (timestamps) endpoint.searchParams.append('timestamps', timestamps.toString())
    if (tail) endpoint.searchParams.append('tail', tail)

    return axios.get(endpoint.toString(), {
      responseType: 'stream'
    })
      .then(x => x.data)
      .catch(x => {
        throw x.response.data;
      });
  }

  /**
   * Get changes on a container’s filesystem
   * 
   * Returns which files in a container's filesystem have been added, deleted, or modified. The Kind of modification can be one of:
   * * 0: Modified
   * * 1: Added
   * * 2: Deleted
   * 
   * @param url URL of the docker daemon
   * @param id Id of the container
   * @returns List of changes in the container volume
   */
  export function changes(url: string, id: string) {
    const endpoint = new URL(`${url}/containers/${id}/changes`);

    return axios.get<ContainerChange[] | Error>(endpoint.toString())
      .then(x => x.data)
      .catch(x => {
        throw x.response.data;
      });
  }

  /**
   * Export a container
   * 
   * Export the contents of a container as a tarball.
   * 
   * @param url URL of the docker daemon
   * @param id Id of the container
   * @returns Content of the container as stream
   */
  export function backup(url: string, id: string) {
    const endpoint = new URL(`${url}/containers/${id}/export`);

    return axios.get(endpoint.toString(), {
      responseType: 'stream'
    })
      .then(x => x.data)
      .catch(x => {
        throw x.response.data;
      });
  }

  /**
   * Get container stats based on resource usage
   * 
   * Provides stats from a docker container
   * 
   * @param url URL of the Docker Daemon
   * @param id Id of the container
   * @returns Container stats
   */
  export function stats(url: string, id: string) {
    const endpoint = new URL(`${url}/containers/${id}/stats`);

    endpoint.searchParams.append('stream', 'false');
    endpoint.searchParams.append('one-shot', 'true');

    return axios.get<ContainerStats | Error>(endpoint.toString())
      .then(x => x.data)
      .catch(x => {
        throw x.response.data;
      });
  }

  /**
   * Start a container
   * 
   * @param url URL of the Docker Daemon
   * @param id Id of the container
   * @returns Undefined if successful
   */
  export function start(url: string, id: string) {
    const endpoint = new URL(`${url}/containers/${id}/start`);

    return axios.post<Error>(endpoint.toString())
      .then(x => undefined)
      .catch(x => {
        throw x.response.data;
      });
  }

  /**
   * Stop a container
   * 
   * @param url URL of the Docker Daemon 
   * @param id Id of the container
   * @param timeout Timeout before killing container 
   * @returns Undefined if successful
   */
  export function stop(url: string, id: string, timeout?: number) {
    const endpoint = new URL(`${url}/containers/${id}/stop`);

    if (timeout) endpoint.searchParams.append('t', timeout.toString())

    return axios.post<Error>(endpoint.toString())
      .then(x => undefined)
      .catch(x => {
        throw x.response.data;
      });
  }

  /**
   * Restart a container
   * 
   * @param url URL of the Docker Daemon
   * @param id Id of the container
   * @param timeout Timeout before killing container
   * @returns Undefined if successful
   */
  export function restart(url: string, id: string, timeout?: number) {
    const endpoint = new URL(`${url}/containers/${id}/restart`);

    if (timeout) endpoint.searchParams.append('t', timeout.toString())

    return axios.post<Error>(endpoint.toString())
      .then(x => undefined)
      .catch(x => {
        throw x.response.data;
      });
  }

  /**
   * Kill a container
   * 
   * @param url URL of the Docker Daemon
   * @param id Id of the container
   * @param signal Signal to send to the container as an integer or string 
   * @returns Undefined if successful 
   */
  export function kill(url: string, id: string, signal?: string) {
    const endpoint = new URL(`${url}/containers/${id}/kill`);

    if (signal) endpoint.searchParams.append('signal', signal)

    return axios.post<Error>(endpoint.toString())
      .then(x => undefined)
      .catch(x => {
        throw x.response.data;
      });
  }

  /**
   * Update a container
   * 
   * Change various configuration options of a container without having to recreate it.
   * 
   * @param url URL of the Docker Daemon
   * @param id Id of the container
   * @param config Config for the container
   * @returns List of warnings if success
   */
  export function update(url: string, id: string, config: ContainerUpdate) {
    const endpoint = new URL(`${url}/containers/${id}/update`);

    return axios.post<{
      Warnings: [];
    } | Error>(endpoint.toString(), config)
      .then(x => x.data)
      .catch(x => {
        throw x.response.data;
      });
  }

  /**
   * Rename a container
   * 
   * @param url URL of the Docker Daemon
   * @param id Id of the container
   * @param name New name of the container
   * @returns Undefined if successful
   */
  export function rename(url: string, id: string, name: string) {
    const endpoint = new URL(`${url}/containers/${id}/rename`);

    endpoint.searchParams.append('name', name);

    return axios.post<Error>(endpoint.toString())
      .then(x => undefined)
      .catch(x => {
        throw x.response.data;
      });
  }

  /**
   * Pause a container
   * 
   * @param url URL of the Docker Daemon
   * @param id Id of the container
   * @returns Undefined if successful
   */
  export function pause(url: string, id: string) {
    const endpoint = new URL(`${url}/containers/${id}/pause`);

    return axios.post<Error>(endpoint.toString())
      .then(x => undefined)
      .catch(x => {
        throw x.response.data;
      });
  }

  /**
   * Delete stopped containers
   * 
   * @param url URL of the Docker Daemon
   * @returns List with deleted containers 
   */
  export function prune(url: string) {
    const endpoint = new URL(`${url}/containers/prune`);

    return axios.post<{
      ContainersDeleted: string[];
      SpaceReclaimed: number;
    } | Error>(endpoint.toString())
      .then(x => undefined)
      .catch(x => {
        throw x.response.data;
      });
  }
}