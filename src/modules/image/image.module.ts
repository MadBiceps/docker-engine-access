import axios from "axios"
import { Image } from '../../types/image/image.type'
import { BasicAuth } from "../../types/auth/basic-auth.type"
import { TokenAuth } from "../../types/auth/token-auth.type"
import { ImageInfo } from "../../types/image/image-info.type";

export module ImageModule {
  /**
   * 
   * @param url URL of the docker daemon
   * @param all Default: false - Show all images. Only images from a final layer (no children) are shown by default.
   * @param filters A JSON encoded value of the filters (a map[string][]string) to process on the images list.
   * Available filters:
   * ```before=(<image-name>[:<tag>], <image id> or <image@digest>)```
   * ```dangling=true```
   * ```label=key``` or ```label="key=value"``` of an image label
   * ```reference=(<image-name>[:<tag>])```
   * ```since=(<image-name>[:<tag>]```, ```<image id>``` or ```<image@digest>```)
   * @param sharedSize Default: false - Compute and show shared size as a SharedSize field on each image.
   * @param digests Default: false - Show digest information as a RepoDigests field on each image.
   * @returns Images from the docker system
   */
  export function list(url: string, all?: boolean, filters?: { [key: string]: string[] }, sharedSize?: boolean, digests?: boolean) {
    const endpoint = new URL(`${url}/images/json`);

    if (all) endpoint.searchParams.append('all', all.toString())
    if (filters) endpoint.searchParams.append('filters', JSON.stringify(filters))
    if (sharedSize) endpoint.searchParams.append('sharedSize', sharedSize.toString())
    if (digests) endpoint.searchParams.append('digests', digests.toString())

    return axios.get<Image[] | Error>(endpoint.toString())
      .then(x => x.data)
      .catch(x => {
        throw x.response.data;
      });
  }

  /**
   * Build an image
   * 
   * Build an image from a tar archive with a Dockerfile in it.
   * 
   * The Dockerfile specifies how the image is built from the tar archive. It is typically in the archive's root, but can be at a different path or have a different name by specifying the dockerfile parameter. See the Dockerfile reference for more information.
   * 
   * The Docker daemon performs a preliminary validation of the Dockerfile before starting the build, and returns an error if the syntax is incorrect. After that, each instruction is run one-by-one until the ID of the new image is output.
   * 
   * The build is canceled if the client drops the connection by quitting or being killed.
   * 
   * @param url URL of the Docker Daemon
   * @param binary Binary Data for the container
   * @param contentType Default: application/x-tar - Content Type of the data
   * @param registryConfig Config of the registries
   * @param dockerfile Default: "Dockerfile" - Path within the build context to the Dockerfile. This is ignored if remote is specified and points to an external Dockerfile.
   * @param tags	A name and optional tag to apply to the image in the name:tag format. If you omit the tag the default latest value is assumed
   * @param extraHosts Extra hosts to add to /etc/hosts
   * @param remote A Git repository URI or HTTP/HTTPS context URI. If the URI points to a single text file, the file’s contents are placed into a file called Dockerfile and the image is built from that file. If the URI points to a tarball, the file is downloaded by the daemon and the contents therein used as the context for the build. If the URI points to a tarball and the dockerfile parameter is also specified, there must be a file with the corresponding path inside the tarball.
   * @param quiet Default: false - Suppress verbose build output.
   * @param noCache Default: false - Do not use the cache when building the image.
   * @param cacheFrom JSON array of images used for build cache resolution.
   * @param pull Attempt to pull the image even if an older image exists locally.
   * @param removeIntermediate Default: true - Remove intermediate containers after a successful build.
   * @param forceRemoveIntermediate Default: false - Always remove intermediate containers, even upon failure.
   * @param memoryLimit Set memory limit for build.
   * @param memorySwap Total memory (memory + swap). Set as -1 to disable swap.
   * @param cpuShares CPU shares (relative weight).
   * @param cpuSetCpus CPUs in which to allow execution (e.g., 0-3, 0,1).
   * @param cpuPeriod The length of a CPU period in microseconds
   * @param cpuQuota Microseconds of CPU time that the container can get in a CPU period.
   * @param buildArgs JSON map of string pairs for build-time variables. Users pass these values at build-time. Docker uses the buildargs as the environment context for commands run via the Dockerfile RUN instruction, or for variable expansion in other Dockerfile instructions. This is not meant for passing secret values.
   * For example, the build arg FOO=bar would become {"FOO":"bar"} in JSON. This would result in the query parameter buildargs={"FOO":"bar"}. Note that {"FOO":"bar"} should be URI component encoded
   * @param shmSize Size of /dev/shm in bytes. The size must be greater than 0. If omitted the system uses 64MB.
   * @param squash Squash the resulting images layers into a single layer. (Experimental release only.)
   * @param labels Arbitrary key/value labels to set on the image, as a JSON map of string pairs.
   * @param networkMode Sets the networking mode for the run commands during build. Supported standard values are: bridge, host, none, and container:<name|id>. Any other value is taken as a custom network's name or ID to which this container should connect to.
   * @param platform Default: "" - Platform in the format os[/arch[/variant]]
   * @param target Default: "" - Target build stage
   * @param outputs Default: "" - BuildKit output configuration
   * @returns Undefined if it was successful
   */
  export function build(
    url: string,
    binary: Buffer,
    contentType?: string,
    registryConfig?: {
      [registry: string]: {
        username: string,
        password: string
      }
    },
    dockerfile?: string,
    tags?: string[],
    extraHosts?: string,
    remote?: string,
    quiet?: boolean,
    noCache?: boolean,
    cacheFrom?: string,
    pull?: string,
    removeIntermediate?: boolean,
    forceRemoveIntermediate?: boolean,
    memoryLimit?: number,
    memorySwap?: number,
    cpuShares?: number,
    cpuSetCpus?: string,
    cpuPeriod?: number,
    cpuQuota?: number,
    buildArgs?: { [key: string]: string },
    shmSize?: number,
    squash?: boolean,
    labels?: { [key: string]: string },
    networkMode?: string,
    platform?: string,
    target?: string,
    outputs?: string) {
    const endpoint = new URL(`${url}/build`)

    if (dockerfile) endpoint.searchParams.append('dockerfile', dockerfile);
    if (tags) tags.forEach(x => endpoint.searchParams.append('t', x));
    if (extraHosts) endpoint.searchParams.append('extrahosts', extraHosts);
    if (remote) endpoint.searchParams.append('remote', remote);
    if (quiet) endpoint.searchParams.append('q', quiet.toString());
    if (noCache) endpoint.searchParams.append('nocache', noCache.toString());
    if (cacheFrom) endpoint.searchParams.append('cachefrom', cacheFrom);
    if (pull) endpoint.searchParams.append('pull', pull);
    if (removeIntermediate) endpoint.searchParams.append('rm', removeIntermediate.toString());
    if (forceRemoveIntermediate) endpoint.searchParams.append('forcerm', forceRemoveIntermediate.toString());
    if (memoryLimit) endpoint.searchParams.append('memory', memoryLimit.toString());
    if (memorySwap) endpoint.searchParams.append('memswap', memorySwap.toString());
    if (cpuShares) endpoint.searchParams.append('cpushares', cpuShares.toString());
    if (cpuSetCpus) endpoint.searchParams.append('cpusetcpus', cpuSetCpus);
    if (cpuPeriod) endpoint.searchParams.append('cpuperiod', cpuPeriod.toString());
    if (cpuQuota) endpoint.searchParams.append('cpuquota', cpuQuota.toString());
    if (buildArgs) endpoint.searchParams.append('buildargs', JSON.stringify(buildArgs));
    if (shmSize) endpoint.searchParams.append('shmsize', shmSize.toString());
    if (squash) endpoint.searchParams.append('squash', squash.toString());
    if (labels) endpoint.searchParams.append('labels', JSON.stringify(labels));
    if (networkMode) endpoint.searchParams.append('networkmode', networkMode);
    if (platform) endpoint.searchParams.append('platform', platform);
    if (target) endpoint.searchParams.append('target', target);
    if (outputs) endpoint.searchParams.append('outputs', outputs);

    return axios.post<undefined | Error>(endpoint.toString(), binary.toString(), {
      headers: {
        'Content-Type': contentType ?? 'application/x-tar',
        'Content-Length': binary.byteLength,
        'X-Registry-Config': registryConfig !== undefined ? Buffer.from(JSON.stringify(registryConfig)).toString('base64') : undefined
      }
    })
      .then(x => x.data)
      .catch(x => { throw x.response.data });
  }

  /**
   * Delete builder cache
   * 
   * @param url URL of the Docker Daemon
   * @param keepStorage Amount of disk space in bytes to keep for cache
   * @param all Remove all types of build cache
   * @param filters A JSON encoded value of the filters (a map[string][]string) to process on the list of build cache objects.
   * Available filters:
   * * until=\<duration\>: duration relative to daemon's time, during which build cache was not used, in Go's duration format (e.g., '24h')
   * * id=\<id\>
   * * parent=\<id\>
   * * type=\<string\>
   * * description=\<string\>
   * * inuse
   * * shared
   * * private
   * @returns 
   */
  export function buildPrune(url: string, keepStorage?: number, all?: boolean, filters?: { [key: string]: string[] }) {
    const endpoint = new URL(`${url}/build/prune`);

    if (keepStorage) endpoint.searchParams.append('keep-storage', keepStorage.toString());
    if (all) endpoint.searchParams.append('all', all.toString());
    if (filters) endpoint.searchParams.append('filters', JSON.stringify(filters))

    return axios.post<{
      CacheDeleted: string[];
      SpaceReclaimed: number;
    } | Error>(endpoint.toString())
      .then(x => x.data)
      .catch(x => {
        throw x.response.data
      });
  }

  /**
   * Create an image
   * 
   * Create an image by either pulling it from a registry or importing it.
   * 
   * @param url URL of the Docker Daemon
   * @param binary Tar archive containing Dockerfile and context files to build from. This parameter may be passed as a URL or as a value of the tar parameter.
   * @param authConfig Authentication Config
   * @param fromImage Name of the image to pull. The name may include a tag or digest. This parameter may only be used when pulling an image. The pull is cancelled if the HTTP connection is closed.
   * @param fromSrc Source to import. The value may be a URL from which the image can be retrieved or - to read the image from the request body. This parameter may only be used when importing an image.
   * @param repo Repository name given to an image when it is imported. The repo may include a tag. This parameter may only be used when importing an image.
   * @param tag Tag or digest. If empty when pulling an image, this causes all tags for the given image to be pulled.
   * @param message Set commit message for imported image.
   * @param changes Apply Dockerfile instructions to the image that is created, for example: changes=ENV DEBUG=true. Note that ENV DEBUG=true should be URI component encoded.
   * Supported Dockerfile instructions: CMD|ENTRYPOINT|ENV|EXPOSE|ONBUILD|USER|VOLUME|WORKDIR
   * @param platform Default: "" - Platform in the format os[/arch[/variant]].
   * 
   * When used in combination with the fromImage option, the daemon checks if the given image is present in the local image cache with the given OS and Architecture, and otherwise attempts to pull the image. If the option is not set, the host's native OS and Architecture are used. If the given image does not exist in the local image cache, the daemon attempts to pull the image with the host's native OS and Architecture. If the given image does exists in the local image cache, but its OS or architecture does not match, a warning is produced.
   * 
   * When used with the fromSrc option to import an image from an archive, this option sets the platform information for the imported image. If the option is not set, the host's native OS and Architecture are used for the imported image.
   * @returns Undefined if successful, otherwise an error
   */
  export function create(url: string, binary?: Buffer, authConfig?: BasicAuth | TokenAuth, fromImage?: string, fromSrc?: string, repo?: string, tag?: string, message?: string, changes?: string[], platform?: string) {
    const endpoint = new URL(`${url}/images/create`);

    if ((binary === undefined && fromSrc === undefined) || (binary !== undefined && fromSrc !== undefined)) {
      throw Error('Create mode is not clear. Use fromSrc or binary');
    }

    endpoint.searchParams.append('fromSrc', fromSrc ?? '-');

    if (fromImage) endpoint.searchParams.append('fromImage', fromImage);
    if (repo) endpoint.searchParams.append('repo', repo);
    if (tag) endpoint.searchParams.append('tag', tag);
    if (message) endpoint.searchParams.append('message', message);
    if (changes) endpoint.searchParams.append('changes', JSON.stringify(changes));
    if (platform) endpoint.searchParams.append('platform', platform);

    return axios.post<undefined | Error>(endpoint.toString(), binary, {
      headers: {
        'X-Registry-Config': authConfig !== undefined ? Buffer.from(JSON.stringify(authConfig)).toString('base64') : undefined
      }
    })
      .then(x => x.data)
      .catch(x => { throw x.response.data });
  }

  /**
   * Inspect an image
   * 
   * Return low-level information about an image.
   * 
   * @param url Url of the Docker Daemon
   * @param name Name of the image
   * @returns Image information's
   */
  export function inspect(url: string, name: string) {
    const endpoint = new URL(`${url}/images/${name}/json`);

    return axios.get<ImageInfo | Error>(endpoint.toString())
      .then(x => x.data)
      .catch(x => { throw x.response.data });
  }

  

}