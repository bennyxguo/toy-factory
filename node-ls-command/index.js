#!/usr/bin/env node

const fs = require('fs')
const chalk = require('chalk')
const path = require('path')

const { lstat } = fs.promises

const targetDir = process.argv[2] || process.cwd()

fs.readdir(targetDir, async (err, filenames) => {
  if (err) throw new Error(`[Read Directory Failed]: ${err}`)

  const statPromises = filenames.map((filename) => {
    return lstat(path.join(targetDir, filename))
  })

  const allStats = await Promise.all(statPromises)
  const results = []

  for (let stats of allStats) {
    const index = allStats.indexOf(stats)

    if (stats.isFile()) {
      results.push(filenames[index])
      // console.log(filenames[index])
    } else {
      results.push(chalk.cyan.bold(filenames[index]))
    }
  }

  console.log(...results)
})
