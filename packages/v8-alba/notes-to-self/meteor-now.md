2019-07-29
Following along https://docs.vulcanjs.org/deployment.html#Meteor-Now

1. Ran this from command line:

METEOR_PACKAGE_DIRS="/Users/kevinashworth/Developer/github_clones/Vulcan/packages" meteor-now -d -e ROOT_URL=https://v8alba.now.sh -e NODE_ENV=development -e MONGO_URL=***REMOVED***

Takes several minutes.

2. Error:

[debug] [2019-09-23T05:32:30.492Z] Error: Error: Free Docker deployment capacity exceeded in this region. Please consider upgrading to Now 2.0 (https://zeit.co/upgrade) for alternative ways to build your project or try again later.
Error: Free Docker deployment capacity exceeded in this region. Please consider upgrading to Now 2.0 (https://zeit.co/upgrade) for alternative ways to build your project or try again later.
    at M.retry (/snapshot/repo/dist/index.js:1:1784476)
    at process.\_tickCallback (internal/process/next_tick.js:68:7)
Error! Free Docker deployment capacity exceeded in this region. Please consider upgrading to Now 2.0 (https://zeit.co/upgrade) for alternative ways to build your project or try again later.
✖ [METEOR-NOW] - Something went wrong with now [
    {
        "code": 1,
        "signal": null
    }
]

3. Try without custom domain:

METEOR_PACKAGE_DIRS="/Users/kevinashworth/Developer/github_clones/Vulcan/packages" meteor-now -d -e NODE_ENV=development -e MONGO_URL=***REMOVED***

4. See meteor-now-errors.txt

5. Trying `meteor-hero` instead:

METEOR_PACKAGE_DIRS="/Users/kevinashworth/Developer/github_clones/Vulcan/packages" meteor-hero -e NODE_ENV=development -e MONGO_URL=***REMOVED***
