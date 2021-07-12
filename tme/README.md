# Testing Framework - TME (Test Me)

## Requirements

- Must be Node-based CLI framework
- Must be able to test browser-based JS apps
- Must require very minimum setup
- Must be able to test a _whole_ application, not just one little widget
- CLI must have a `watch mode`, so we don't have to keep restarting it over and over
- CLI must automatically find and run all files in our project that have a name of `.test.js`

## Implementation Plan

- File Collection
- Test environment setup
- Test file execution
- Report results

### File Collection

- Find all ending in `*.test.js` recursively through a folder
- Store a reference to each file we find
- After getting a full list of the test files, execute them one by one
