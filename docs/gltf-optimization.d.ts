declare function toKTX2UASTC(data: Uint8Array, MimeType: string, isSRGB: boolean): Promise<Uint8Array<ArrayBuffer> | null>;

interface IGLTFOptimizationOptions {
    maxSize?: number;
    hasJoin?: boolean;
    hasPalette?: boolean;
    hasFlatten?: boolean;
    hasKtx2?: boolean;
}
/**
 * GLB模型优化压缩方法
 * @param { ArrayBuffer } gltf gltf 模型文件ArrayBuffer
 * @param { IGLTFOptimizationOptions } options  压缩选项参数
 * @returns { Promise<ArrayBuffer> } 返回压缩后的glTF模型文件ArrayBuffer
 */
declare function gltfOptimization(gltf: ArrayBuffer, options?: IGLTFOptimizationOptions): Promise<Uint8Array<ArrayBufferLike>>;

export { type IGLTFOptimizationOptions, gltfOptimization, toKTX2UASTC };
