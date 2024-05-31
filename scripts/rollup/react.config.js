import { getBaseRollupPlugins, getPackageJson, resolvePkgPath } from './utils'
import RollupPkgJson from 'rollup-plugin-generate-package-json'

const { name, module } = getPackageJson('react');
const pkgPath = resolvePkgPath(name);

const pkgDistPath = resolvePkgPath(name, true)

export default [
  {
    input: `${pkgPath}/${module}`,
    output: {
      file: `${pkgDistPath}/react.js`,
      name: 'index.js',
      format: 'umd'
    },
    plugins: [...getBaseRollupPlugins(), RollupPkgJson({
      inputFolder: pkgPath,
      outputFolder: pkgDistPath,
      baseContents: ({ name, description, version }) => ({
        name,
        description,
        version,
        main: 'index.js'
      })
    })]
  },
  {
    input: `${pkgPath}/src/jsx.ts`,
    output: [
      {
        file: `${pkgDistPath}/jsx-runtime.js`,
        name: 'jsx-runtime.js',
        format: 'umd'
      },
      {
        file: `${pkgDistPath}/jsx-dev-runtime.js`,
        name: 'jsx-runtime.js',
        format: 'umd'
      }
    ],
    plugins: getBaseRollupPlugins()
  }
]