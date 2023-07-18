import { suite } from "uvu";
import { asserts } from "uvu/assert";

const nock = require("nock");
nock.disableNetConnect();

// disable Probot logs
process.env.LOG_LEVEL = "fatal";
const { Probot, ProbotOctokit } = require("probot");

const app = require("../app");

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
