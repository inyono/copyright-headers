module.exports = () => {
  return {
    files: ['src/**/*.ts'],
    tests: ['__tests__/**/*.ts'],
    env: {
      type: 'node',
      runner: 'node'
    },
    testFramework: 'jest'
  }
}
