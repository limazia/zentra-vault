type WrapKeyResult = {
  wrappedKey: string
  keyId: string
}

type UnwrapKeyParams = {
  wrappedKey: string
  keyId: string
}

export abstract class KeyManagementPort {
  abstract wrapKey(key: Buffer): Promise<WrapKeyResult>
  abstract unwrapKey(params: UnwrapKeyParams): Promise<Buffer>
}
