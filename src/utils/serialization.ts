// Json serialize, if data is bytes, skip.
export function bytesOrJsonStringify<T>(data: T): Uint8Array {
  const isUint8Array = (data as Uint8Array).byteLength && (data as Uint8Array).byteLength === (data as Uint8Array).length;
  return isUint8Array ? new Uint8Array(data as Uint8Array) : new Uint8Array(Buffer.from(JSON.stringify(data)));
}

// Json deserialize
export function jsonParse<T>(rawData: Uint8Array): T {
  return JSON.parse(Buffer.from(rawData).toString())
}
