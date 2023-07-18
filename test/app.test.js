import { suite } from "uvu";
import * as asserts  from "uvu/assert";

import nock from "nock";
nock.disableNetConnect();

// disable Probot logs
process.env.LOG_LEVEL = "fatal";
import * as Probot from"probot";

import * as app from "../app.js";

/** @type {import('probot').Probot */
let probot;
const test = suite("app");
test.before.each(() => {
  probot = new Probot({
    id: 1,
    githubToken: "test",
    Octokit: Probot.ProbotOctokit.defaults({
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
        asserts.equal(requestBody, { body: "Hello, World!" });

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

  asserts.equal(mock.activeMocks(), []);
});

test.run();
