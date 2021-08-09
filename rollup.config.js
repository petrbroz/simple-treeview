import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';

const VanillaConfig = {
    input: 'src/VanillaTreeView.ts',
    output: {
        file: 'dist/treeview.vanilla.js',
        format: 'es'
    },
    plugins: [
        typescript(),
        copy({
            targets: [
                { src: 'src/VanillaTreeView.css', dest: 'dist', rename: 'treeview.vanilla.css' }
            ]
        })
    ]
};

const BootstrapConfig = {
    input: 'src/BootstrapTreeView.ts',
    output: {
        file: 'dist/treeview.bootstrap.js',
        format: 'es'
    },
    plugins: [
        typescript(),
        copy({
            targets: [
                { src: 'src/BootstrapTreeView.css', dest: 'dist', rename: 'treeview.bootstrap.css' }
            ]
        })
    ]
};

export default [
    VanillaConfig,
    BootstrapConfig
];
