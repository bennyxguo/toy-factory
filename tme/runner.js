const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const render = require('./render')

const forbiddenDirs = ['node_modules']

class Runner {
  constructor() {
    this.testFiles = []
  }

  async runTests() {
    for (let file of this.testFiles) {
      console.log(chalk.gray(`---- ${file.shortName} \n`))
      // Global render function to create JSDOM
      global.render = render

      // Hook to be run before each test case.
      const beforeEaches = []
      global.beforeEach = (fn) => {
        beforeEaches.push(fn)
      }

      // Register `it()` function to the node global variable
      // it() now can be used across any files
      global.it = async (desc, fn) => {
        beforeEaches.forEach((func) => func())
        try {
          await fn()
          console.log(`${chalk.green('\t✔')} ${chalk.cyan(desc)}`)
        } catch (err) {
          const message = err.message.replace(/\n/g, '\n\t\t')
          console.log(`${chalk.red('\t✖')} ${chalk.cyan(desc)}`)
          console.log('\t', chalk.red(message))
        }
      }

      // Try Catch to catch any file syntax or other errors.
      try {
        require(file.name)
      } catch (err) {
        console.log(err)
      }
    }
  }

  async collectFiles(targetPath) {
    const files = await fs.promises.readdir(targetPath)

    // Breath first search algorithm for file tree searching.
    for (let file of files) {
      const filepath = path.join(targetPath, file)
      const stats = await fs.promises.lstat(filepath)

      if (stats.isFile() && file.includes('.test.js')) {
        this.testFiles.push({ name: filepath, shortName: file })
      } else if (stats.isDirectory() && !forbiddenDirs.includes(file)) {
        const childFiles = await fs.promises.readdir(filepath)
        files.push(
          ...childFiles.map((f) => {
            // Join the parent folder name
            return path.join(file, f)
          })
        )
      }
    }

    return files
  }
}

module.exports = Runner
