/**
 * Serialize data in JSON format, if data type is `Uint8Array`, skip serialize.
 */
export function stringifyJsonOrBytes<T>(data: T): Buffer {
  const isUint8Array = (data as Uint8Array).byteLength && (data as Uint8Array).byteLength === (data as Uint8Array).length;
  return isUint8Array ? Buffer.from(data as Uint8Array) : Buffer.from(JSON.stringify(data));
}

/**
 * Deserialize data in JSON format.
 */
export function parseJson<T>(rawData: Uint8Array): T {
  return JSON.parse(Buffer.from(rawData).toString())
}
