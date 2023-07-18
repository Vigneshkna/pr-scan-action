/**
 * @param {import('probot').Probot} app
 */

import * as Octokit from "@octokit/rest";
import * as Utils from "./config/global-utils.js";

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
    const user = Utils.getCurrentUser(context);

    var truffleOutput = "",
      snykOutput = "";

    const { owner, repo } = context.repo();

    // Get the workflows for the repository
    const response = await Octokit.actions.listWorkflowRunsForRepo({
      owner,
      repo,
    });

    // Iterate over the workflow runs and retrieve error details
    const workflowRuns = response.data.workflow_runs.filter(
      (w) =>
        workflowName.includes(w.name) &&
        w.conclusion === "failure" &&
        w.event === "pull_request"
    );

    for (const run of workflowRuns) {
      if (run.conclusion === "failure" && run.event === "pull_request") {
        const jobsResponse = await Octokit.actions.listJobsForWorkflowRun({
          owner,
          repo,
          run_id: run.id,
        });

        // Iterate over jobs and find the failed step
        for (const job of jobsResponse.data.jobs) {
          const jobDetails = await Octokit.actions.getJobForWorkflowRun({
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
                  await Octokit.actions.downloadJobLogsForWorkflowRun({
                    owner,
                    repo,
                    job_id: job.id,
                  });

                var truffleLogOutput = logResponse.data;
                app.log.error(`logOutput Truffle ->: ${logResponse.data}`);

                truffleOutput = parseLogOutput(truffleLogOutput, "truffle");
              } else if (
                (step.conclusion === "failure" ||
                  step.conclusion === "skipped") &&
                  Utils.checkStringContains(step.name, "snyk") &&
                step.conclusion != "success"
              ) {
                // Retrieve the response of the failed step
                const logResponse =
                  await Octokit.actions.downloadJobLogsForWorkflowRun({
                    owner,
                    repo,
                    job_id: job.id,
                  });

                var snykLogOutput = logResponse.data;
                snykOutput = Utils.parseLogOutput(snykLogOutput, "snyk");
              }
            }
          }
        }
      }
    }

    var truffleSecrets =
      "<h3>Secrets Bot</h3>\n" +
      (truffleOutput === ""
        ? `<i>All good in the hood no uncovered secrets found in raised Pull-Request.</i>`
        : truffleOutput);
    var snykSecrets =
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
