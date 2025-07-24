// rollup.config.js
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { config } from 'dotenv';
import { dirname } from 'path';
import { dts } from 'rollup-plugin-dts';
import { fileURLToPath } from 'url';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const settings = {
    globals: {},
    sourcemap: false,
};

export default [
    {
        input: 'pages/gltf-to-ktx2/gltfTransform.ts',
        output: {
            dir: 'gltf-optimization',
            format: 'es',
            name: 'gltfOptimization',
        },
        plugins: [
            resolve(),
            commonjs({
                include: ['node_modules/ndarray/**', 'node_modules/ndarray-pixels/**', 'node_modules/ndarray-ops/**', 'node_modules/draco3dgltf/**', 'node_modules/is-buffer/**'], // 显式包含问题模块
                transformMixedEsModules: true, // 处理混合ES/CJS模块[6](@ref)
                namedExports: {
                    'draco3dgltf': ['createDecoderModule', 'createEncoderModule'],
                    'buffer': ['isBuffer']
                },
                ignore: ['fs', 'path'], // 忽略fs模块
            }),
            typescript(),
            replace({
                preventAssignment: true,
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV).trim(),
            }),
            terser({
                mangle: {
                }
            })
        ],
    },
    {
        input: 'pages/gltf-to-ktx2/gltfTransform.ts',
        output: {
            file: 'gltf-optimization/gltf-optimization.d.ts',
            format: 'es',
        },
        plugins: [
            dts(),
        ],
    }
];
