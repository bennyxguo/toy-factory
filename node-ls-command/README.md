# Making a Node Command Tool

## Steps

**1 - Initializing node package**

```shell
npm init -y
```

**2 - Create package.json file with 'bin' section**

```json
{
  "name": "node-ls-command",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "TriDiamond <code.tridiamond@gmail.com>",
  "license": "ISC",
  "bin": {
    // <-- here
    "nls": "index.js"
  }
}
```

**3 - Add comment to index.js file to allow it to be treated like an executable.**

```shell
chmod +x index.js
```

**4 - Add comment to index.js file to allow it to be treated like an executable.**

```javascript
// Add to beginning of your script file
#!/usr/bin/env node
```

**5 - Link our project.**

```shell
npm link
```

## Bad Example

> Callback functions are called indefinitely in time

```javascript
#!/usr/bin/env node

const fs = require('fs')

fs.readdir(process.cwd(), (err, filenames) => {
  if (err) throw new Error(`[Read Directory Failed]: ${err}`)

  for (let filename of filenames) {
    fs.lstat(filename, (err, stats) => {
      if (err) console.log(err)

      console.log(filename, stats.isFile())
    })
  }
  console.log(filenames)
})
```

## Solutions

### Solution 1

> Maintain an array of results from ease lstat. As each callback is invoked, add the stats object to this array.When array is full, log everything in it.

```javascript
#!/usr/bin/env node

const fs = require('fs')

fs.readdir(process.cwd(), (err, filenames) => {
  if (err) throw new Error(`[Read Directory Failed]: ${err}`)

  const allStats = Array(filenames.length).fill(null)

  for (let filename of filenames) {
    const index = filenames.indexOf(filename)
    fs.lstat(filename, (err, stats) => {
      if (err) console.log(err)

      allStats[index] = stats

      const ready = allStats.every((stats) => {
        return stats
      })

      if (ready) {
        allStats.forEach((stats, index) => {
          console.log(filename[index], stats.isFile())
        })
      }
    })
  }
})
```

### Solution 2

> Wrap the lstat call with a promise, use async/await to process lstat call one at a time.

```javascript
#!/usr/bin/env node

const fs = require('fs')
const util = require('util')

fs.readdir(process.cwd(), async (err, filenames) => {
  if (err) throw new Error(`[Read Directory Failed]: ${err}`)

  for (let filename of filenames) {
    try {
      const stats = await lstat(filename)
      console.log(filename, stats.isFile())
    } catch (err) {
      console.log(err)
    }
  }
})

// Method 1
// Creat a promise base function wrap around our lstat
const lstat = (filename) => {
  return new Promise((resolve, reject) => {
    fs.lstat(filename, (err, stats) => {
      if (err) reject(err)
      resolve(stats)
    })
  })
}

// Method 2
// Turn the method into promise base function
const lstat = util.promisify(fs.lstat)

// Method 3
//Using build in promise function
const { lstat } = fs.promises
```

However the downside of this solution is that, all lstat calls are ran in serial order. Therefore if each call takes 1s, running 500 files will take 500s.

_This solution will lost the advantage of using parallel processing._

### Solution 3 - `BEST`

> Wrap the lstat call with a promise, use async/wait + the Promise.all helper method to process lstat calls all at once

```javascript
#!/usr/bin/env node

const fs = require('fs')

const { lstat } = fs.promises

fs.readdir(process.cwd(), async (err, filenames) => {
  if (err) throw new Error(`[Read Directory Failed]: ${err}`)

  const statPromises = filenames.map((filename) => {
    return lstat(filename)
  })

  const allStats = await Promise.all(statPromises)

  for (let stats of allStats) {
    const index = allStats.indexOf(stats)
    console.log(filenames[index], stats.isFile())
  }
})
```
