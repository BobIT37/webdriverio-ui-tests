let reporter = require("cucumber-html-reporter");
const dateObj = new Date();
const dayjs = require("dayjs")(dateObj);
// const { sendMail } = require("./mail_sender");
const fs = require("fs");
const fileName = dayjs.format("MM_DD_YYYY(hh_mm_ss_a)");
const path = `report/${fileName}.html`;
require("dotenv").config({ path: "test.config.env" });

console.log(process.argv);

let options = {
  theme: "hierarchy",
  jsonDir: ".tmp/json",
  output: path,
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: true,
  brandTitle: " ",
  name: "Ownbackup Automation Tests Report",
  metadata: {
    Platform: "Macbook Pro",
    Browser: process.env.TARGET_BROWSER,
    Version: "Ventura 13.0",
    Tester: "Bob T.",
    Date: dayjs.format("MM-DD-YYYY hh:mm:ss a"),
  },
};

/**
 * Report generation
 */
reporter.generate(options, () => {
  const data = fs.readFileSync(process.cwd() + "/" + path, "utf-8");
  const replaced = data.replace(
    /<div class="footer-container">\n.+\n.+\n.+\n.+\n.+\n.+/g,
    '<div class="footer-container"><div>Ownbackup - 2023</div></div>'
  );
  fs.writeFileSync(process.cwd() + "/" + path, replaced, {
    flag: "w",
  });
  sendMail(fileName, dateObj);
});
