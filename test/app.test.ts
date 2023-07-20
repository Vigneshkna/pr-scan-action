// import * as suite from "uvu";
// //const suite = require("uvu");
// import * as asserts  from "uvu/assert";
// //const asserts = require("uvu/assert");

// import nock from "nock";
// //const nock = require("nock");
// nock.disableNetConnect();

// // disable Probot logs
// process.env.LOG_LEVEL = "fatal";
// import * as Probot from"probot";
// //const Probot = require("probot");

// import * as app from "../app.js";
// //const app = require("../app.js");

// /** @type {import('probot').Probot */
// let probot;
// const test = suite.suite("app");
// test.before.each(() => {
//   probot = new Probot.Probot({
//     id: 1,
//     githubToken: "test",
//     Octokit: Probot.ProbotOctokit.defaults({
//       throttle: { enabled: false },
//       retry: { enabled: false },
//     }),
//   });
//   probot.load(app.app);
// });

// test("recieves issues.opened event", async function () {
//   const mock = nock("https://api.github.com")
//     // create new check run
//     .post(
//       "/repos/probot/example-github-action/issues/1/comments",
//       (requestBody) => {
//         asserts.equal(requestBody, { body: "Hello, World!" });

//         return true;
//       }
//     )
//     .reply(201, {});

//   await probot.receive({
//     name: "issues",
//     id: "1",
//     payload: {
//       action: "opened",
//       repository: {
//         owner: {
//           login: "probot",
//         },
//         name: "example-github-action",
//       },
//       issue: {
//         number: 1,
//       },
//     },
//   });

//   asserts.equal(mock.activeMocks(), mock.activeMocks());
// });

// test.run();

const { suite } = require("uvu");
const assert = require("uvu/assert");

const nock = require("nock");
nock.disableNetConnect();

// disable Probot logs
process.env.LOG_LEVEL = "fatal";
const { Probot, ProbotOctokit } = require("probot");

const app = require("../app.ts");

/** @type {import('probot').Probot */
let probot;
const test = suite("app");
test.before.each(() => {
  probot = new Probot({
    id: 1,
    githubToken: "test",
    Octokit: ProbotOctokit.defaults({
      throttle: { enabled: false },
      retry: { enabled: false },
    }),
  });
  probot.load(app);
});

test("recieves issues.opened event", async function () {
  const mock = nock("https://api.github.com")
    // create new check run
    .post(
      "/repos/probot/example-github-action/issues/1/comments",
      (requestBody) => {
        assert.equal(requestBody, { body: "Hello, World!" });

        return true;
      }
    )
    .reply(201, {});

  await probot.receive({
    name: "issues",
    id: "1",
    payload: {
      action: "opened",
      repository: {
        owner: {
          login: "probot",
        },
        name: "example-github-action",
      },
      issue: {
        number: 1,
      },
    },
  });

  assert.equal(mock.activeMocks(), []);
});

test.run();
