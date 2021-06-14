# Node WatchIt Command Tool

> Contain the same feature as Nodemon, where it can watch a file, when this file changes, it will re-execute the file.

## Challenges

- Need to detect when a file changes
  - -> Use a package called '[chokidar](https://www.npmjs.com/package/chokidar)' to detect file changes
- It would be nice to provide some help to users of our CLI tool
  - -> Use a package called '[caporal](https://www.npmjs.com/package/caporal)' to build our CLI tool
- Need to figure out how to execute some JS code from within a JS program
  - -> Use the standard library module '`child_process`' to execute program

## Understanding StdIO

1. Use a terminal to create a `Process`
2. When this Process is created, it assigns `three different communication channels`
   - _stdin_ - can be used to receive information coming from the terminal
   - _stdout_ - When the process do a console.log or printing out information, the process will send that information out through stdout.
   - _stderr_ - If the an error is encountered, it will be emitted out though stderr.

### Child Process

- Child Process will have it's own three communication channels
- But these channels by default are not hooked to a terminal
- In nodeJS the `stdIO` option is used to define where to send information for this three channels.

> Example: if `stdIO` is set to `inherit`, all the channels will be linked to the parent Process.

## Compare Asynchronous Process Creation Methods

- child_process.exec(command[,option][,callback])
- child_process.execFile(file[,args][,callback])
- child_process.fork(modulePath[,args][,options])
- child_process.spawn(command[,args][,callback])

> The main difference between these functions are wether they are executed inside `Shell` and wether or not the output are passed back to the program (terminal) through a `Stream`.

_What is a Shell?_

- The terminal can be understand as the displaying interface or program for the Shell program
- The Shell is what is executing and running all the commands that are typed in the terminal
- Having the shell, we can pipe two or more commands together, where each program can receive the output of the previous command
  - Eg. `cat index.js | wc -l`
  - This command will print out all the code in index.js, then pass all the content to the `wc` program to count the content and find out how many lines this code has.
  - These passing and execution of two programs won't be possible without `Shell`, the mastermind behind the terminal.

_What is a Stream?_

- Referring to how information from standard I/O of that child process gets sent back to our primary process
- In NodeJS without a stream, all the output of the child-process will be logged and collected by NodeJS, and send them back to us through a callback function in two variables, `stdout` and `stderr`.
- With streaming of information, any `console.log` or output, they will be sent back to the primary process immediately as they are outputted in the child process.

|            | Shell? | Stream? |
| ---------- | ------ | ------- |
| `exec`     | yes    | no      |
| `execFile` | no     | no      |
| `spawn`    | no     | yes     |
| `fork`     | no     | yes     |

> At the end of the day, all four functions are base on the function `spawn`, because all the feature provided by all other function can be configured in spawn!
