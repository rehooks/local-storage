/**
 * @type {jest.ProjectConfig}
 */
module.exports = {
  roots: [
    '<rootDir>/test'
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json'
    }
  }
}
