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

6. Success! See https://sleepy-earth-65615.herokuapp.com

`meteor-hero` didn't work, but it helped me figure out what to do:

Deploy
- `meteor-hero` did a bunch of stuff then crashed, so I
- Unzipped V8-Alba.tar.gz, had to move it adjacent to Dockerfile
- Ran `heroku container:push web -a sleepy-earth-65615` (in bundle dir)
- Ran `heroku container:release web -a sleepy-earth-65615` (in bundle dir)

Settings
- Changed MONGODB_URI, MONGO_URL, NODE_ENV manually in heroku dashboard
- Also ran `heroku config:add METEOR_SETTINGS="$(cat /Users/kevinashworth/Developer/bitbucket_projects/V8-Alba/development.settings.json)" -a sleepy-earth-65615`
- These two things are redundant for MONGO_URL, probably

It was `heroku logs --tail -a sleepy-earth-65615` that led me to error "TypeError: Cannot read property 'mlabpass' of undefined"

7. Later:
Ran `meteor build ~/.meteor-hero/builds/build-20190927 --server-only --architecture=os.linux.x86_64` from V8-Alba home dir
Took a little under 10 minutes
`cd ~/.meteor-hero/builds`
copy Dockerfile to, then cd into
`cd build-20190927`
unzip new tarfile
mv Dockerfile into new `bundle` dir, cd into, then
run `heroku container:push web -a sleepy-earth-65615`
oops! run Docker app, run that command again
after several minutes, success, then run
`heroku container:release web -a sleepy-earth-65615`
