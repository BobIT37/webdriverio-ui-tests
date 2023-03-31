//@ts-nocheck
import type { Options } from "@wdio/types";
import { config as dotenv } from "dotenv";
import allure from "@wdio/allure-reporter"
import * as browserList from "./browser.conf";
import * as fs from 'fs-extra';
import dayjs from "dayjs";
import { promisify } from "util";
import { exec } from "child_process";
import axios from "axios";

const promiseExec = promisify(exec);

dotenv({ path: "test.config.env" });

let debug = process.env.DEBUG

const browsers = [];

if (browserList.isRunner) {
  const envBrowsers = (process.env.TARGET_BROWSER as string).split(" ");
  for (let i = 0; i < envBrowsers.length; i++) {
    const element = browserList[envBrowsers[i]];
    if (element) {
      browsers.push(element);
    }
  }
} else {
  for (let i = 4; i < process.argv.length; i++) {
    const element = browserList[process.argv[i]];
    if (element) {
      browsers.push(element);
    }
  }
}

export const config: Options.Testrunner = {
  autoCompileOpts: {
    autoCompile: true,

    tsNodeOpts: {
      transpileOnly: true,
      project: "./tsconfig.json",
    },
  },

  specs: [
    `./test/features/**/*.feature`
],

  exclude: [],

  maxInstances: 3,

  capabilities: browsers,

  logLevel: debug === "Y" ? "info": "error", //'info',

  bail: 0,

  baseUrl: process.env.prod == "docker" ? 'http://bobit-frontend:80' : 'http://localhost:8000',

  waitforTimeout: 10000,

  connectionRetryTimeout: 120000,

  connectionRetryCount: 1,

  services: [
    [
      "selenium-standalone",
      {
        drivers: {
          chrome: "latest",
          firefox: "latest",
          chromiumedge: "110.0.1587.69",
          safari: "latest",
        },
      },
    ],
  ],

  framework: "cucumber",

  reporters: ["spec", "cucumberjs-json",
    ['allure',
        {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: true,
            useCucumberStepReporter: true
        }
    ]
],

  /**
   * Cucumber Options
   */
  cucumberOpts: {
    require: [
        `./test/features/step-definitions/*.ts`
    ],

    backtrace: false,

    requireModule: [],

    dryRun: false,

    failFast: false,

    snippets: true,

    source: true,

    strict: false,

    tagExpression: "",

    timeout: 120000,

    ignoreUndefinedDefinitions: false,
  },

  /**
   * Environment execution
   * @param uri
   * @param feature
   */
  afterFeature: function (uri, feature) {
    allure.addEnvironment("Environment: ", process.env.ENV)
     },

  /**
   * Remove the `.tmp/` folder and Allure folder that holds the json and report files
   */
  onPrepare: () => {
    try {
      fs.rmSync(".tmp/json", { recursive: true });
      fs.rmSync("./allure-results", {recursive: true, force:true});
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log("JSON or Allure reports couldn't be found.");
      } else {
        console.log(error);
      }
    }
  },

  /**
   * This provides to get TestID from feature file
   * Runs before a Cucumber Scenario.
   * @param {ITestCaseHookParameter} world    world object containing information on pickle and test step
   * @param {Object}                 context  Cucumber World object
   */
  beforeScenario: function (world, context) {
    //console.log(`>> World> ${JSON.stringify(world)}`)
    let arr = world.pickle.name.split(/:/)
    // @ts-ignore
    if(arr.length > 0) browser.options.testid = arr[0]
    // @ts-ignore
    if(!browser.options.testid) throw Error(`Error getting testid for current scenario: ${world.pickle.name}`)

  },

  /**
   *
   * Runs before a Cucumber Step.
   * @param {Pickle.IPickleStep} step     step data
   * @param {IPickle}            scenario scenario pickle
   * @param {Object}             context  Cucumber World object
   */
  beforeStep: function (step, scenario, context) {
    if(browser.options.testid) context.testid = browser.options.testid
  },

  /**
   *
   * @param step
   * @param scenario
   * @param result
   */
  afterStep: async (step, scenario, result) => {
    await browser.pause(1000);
    
    if (!result.passed) {
      let path = ".";
      let featureName = step.text;
      let fileName =
        path +
        "/screenshots/" +
        dayjs().format("MM.DD.YYYY_HH.mm.ss") +
        "_" +
        featureName +
        ".png";

      await browser.saveScreenshot(fileName);
    }
  },

  /**
   * Save screenshot in target folder
   * @param test
   * @param context
   * @param error
   * @param result
   * @param duration
   * @param passed
   * @param retries
   */
  afterTest: async (
    test,
    context,
    { error, result, duration, passed, retries }
  ) => {
    if (error) {
      await browser.saveScreenshot(__dirname + "/" + test + ".png");
    }
  },

  /**
   * Report generation and slack message
   * @param error
   */
  onComplete: async (error) => {
    const { stdout, stderr } = await promiseExec(
      "node helper/report_generator.js"
    );
    console.log("JOB_ID");
    console.log(process.env.CI_JOB_ID);
    if (process.env.CI_JOB_ID) {
      let JobId = process.env.CI_JOB_ID;
      let reportPath =
        "https://gitlab.com/app/report/" +
        JobId +
        "/artifacts/browse/report/report/";
      let date = dayjs().format("MM.DD.YYYY_HH.mm.ss");
      const data = {
        text: `Date: ${date} Job ${
          error ? "Failed" : "Succeed"
        }:  ${reportPath}`,
      };
      axios.post(
        "https://hooks.slack.com/services/T0NTY8WLX/B051",
        data,
        { headers: { "Content-Type": "application/json" } }
      );
    }
 },
};
