workflow "PR Event" {
  on = "pull_request"
  resolves = ["npm run test"]
}

action "npm install" {
  uses = "actions/npm@master"
  args = "install"
}

action "npm run lint" {
  uses = "actions/npm@master"
  args = "run lint"
  needs = ["npm install"]
}

action "npm run test" {
  uses = "actions/npm@master"
  needs = ["npm run lint"]
  args = "run test"
}
