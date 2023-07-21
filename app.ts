/**
 * @param {import('probot').Probot} app
 */

// import * as Octokit from "@octokit/rest";
//import * as Utils from "./config/global-utils";
const { Octokit } = require("@octokit/rest");
const Utils = require("./config/global-utils.ts")

//const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

module.exports = (app) => {
  app.log("Yay! The app was loaded!");

  const workflowName = ["Snyk Bot scan", "TruffleHog Bot scan"];

  app.on("issues.opened", async (context) => {
    app.log("Yay! The new issues opened!");
    return context.octokit.issues.createComment(
      context.issue({ body: "Hello, World!" })
    );
  });

  app.on(["pull_request.opened", "pull_request.reopened"], async (context) => {
    app.log.info("Yay, the New Pr is raised!");
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    console.log(process.env.GITHUB_TOKEN);
    const user = Utils.getCurrentUser(context);
    let truffleOutput = "",
      snykOutput = "";

    const { owner, repo } = context.repo();

    // Get the workflows for the repository
    const response = await context.octokit.actions.listWorkflowRunsForRepo({
      owner,
      repo,
    });
    app.log.info(response);

    // Iterate over the workflow runs and retrieve error details
    const workflowRuns = response.data.workflow_runs.filter(
      (w) =>
        workflowName.includes(w.name) &&
        w.conclusion === "failure" &&
        w.event === "pull_request"
    );

    for (const run of workflowRuns) {
      if (run.conclusion === "failure" && run.event === "pull_request") {
        const jobsResponse = await context.octokit.actions.listJobsForWorkflowRun({
          owner,
          repo,
          run_id: run.id,
        });

        // Iterate over jobs and find the failed step
        for (const job of jobsResponse.data.jobs) {
          const jobDetails = await context.octokit.actions.getJobForWorkflowRun({
            owner,
            repo,
            job_id: job.id,
          });

          const steps = jobDetails.data.steps.filter((w) =>
            workflowName.includes(w.name)
          );
          const { conclusion } = jobDetails.data;
          if (conclusion === "failure") {
            for (const step of steps) {
              if (
                (step.conclusion === "failure" ||
                  step.conclusion === "skipped") &&
                  Utils.checkStringContains(step.name, "truffle") &&
                step.conclusion != "success"
              ) {
                // Retrieve the response of the failed step
                const logResponse =
                  await context.octokit.actions.downloadJobLogsForWorkflowRun({
                    owner,
                    repo,
                    job_id: job.id,
                  });

                let truffleLogOutput = logResponse.data;
                app.log.error(`logOutput Truffle ->: ${logResponse.data}`);

                truffleOutput = Utils.parseLogOutput(truffleLogOutput, "truffle");
              } else if (
                (step.conclusion === "failure" ||
                  step.conclusion === "skipped") &&
                  Utils.checkStringContains(step.name, "snyk") &&
                step.conclusion != "success"
              ) {
                // Retrieve the response of the failed step
                const logResponse =
                  await context.octokit.actions.downloadJobLogsForWorkflowRun({
                    owner,
                    repo,
                    job_id: job.id,
                  });

                let snykLogOutput = logResponse.data;
                snykOutput = Utils.parseLogOutput(snykLogOutput, "snyk");
              }
            }
          }
        }
      }
    }

    let truffleSecrets =
      "<h3>Secrets Bot</h3>\n" +
      (truffleOutput === ""
        ? `<i>All good in the hood no uncovered secrets found in raised Pull-Request.</i>`
        : truffleOutput);
    let snykSecrets =
      "<h3>SCA Bot</h3> \n" +
      (snykOutput === ""
        ? `<i>All good in the hood no vulnerable package found in raised Pull-Request.</i>`
        : snykOutput);

    const msg = context.issue({
      body:
        `Hey @${user} 👋, Thanks for contributing the new Pull Request !!` +
        truffleSecrets +
        snykSecrets +
        Utils.footer,
    });

    return context.octokit.issues.createComment(msg);
  });
};