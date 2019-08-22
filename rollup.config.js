import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const getBabelOptions = ({ useESModules }) => ({
    exclude: /node_modules/,
    runtimeHelpers: true,
    extensions: ['.ts'],
    plugins: [
        ['@babel/transform-runtime', { useESModules }],
        '@babel/proposal-class-properties',
        '@babel/proposal-object-rest-spread',
    ],
});

const nodeResolveOptions = {
    extensions: ['.js', '.ts'],
};

const input = './src/index.ts';
const name = 'i18nextLocalforageBackend';
const externalDynamic = id => !id.startsWith('.') && !id.startsWith('/') && !id.includes(':');
const externalStatic = ['localforage'];
const globals = {
    localforage: 'localforage',
};

export default [
    {
        input,
        output: { format: 'cjs', file: pkg.main },
        external: externalDynamic,
        plugins: [
            babel(getBabelOptions({ useESModules: false })),
        ],
    },
    {
        input,
        output: { format: 'esm', file: pkg.module },
        external: externalDynamic,
        plugins: [
            babel(getBabelOptions({ useESModules: true })),
        ],
    },
    {
        input,
        output: {
            format: 'umd',
            file: `dist/umd/${name}.js`,
            name,
            globals,
        },
        external: externalStatic,
        plugins: [
            babel(getBabelOptions({ useESModules: true })),
            nodeResolve(nodeResolveOptions),
            commonjs(),
        ],
    },
    {
        input,
        output: {
            format: 'umd',
            file: `dist/umd/${name}.min.js`,
            name,
            globals,
        },
        external: externalStatic,
        plugins: [
            babel(getBabelOptions({ useESModules: true })),
            nodeResolve(nodeResolveOptions),
            commonjs(),
            terser(),
        ],
    },
];
