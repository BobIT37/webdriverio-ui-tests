import { Given, When, Then } from "@wdio/cucumber-framework";
import chai from "chai"
import homepage from "../../page-objects/base_features";
import logger from "../../../helper/logger";
import reporter from "../../../helper/reporter";
import allure from "@wdio/allure-reporter"
import { config as dotenv } from "dotenv";
dotenv({ path: "test.config.env" });

Given(/^I opened DS\-TS web page$/, async function(){
    logger.info('Browser is opening...')
    reporter.addStep(this.testid, "info", "Welcome page to in bobit.us")
    // console.log(`App Id: ${this.appid}`)
    await browser.url("/")
    await browser.setTimeout({ implicit: 15000, pageLoad: 1000})
    await browser.maximizeWindow()
    let getUrl = await browser.getUrl()
    let title = await browser.getTitle()
    await browser.pause(1000)
    console.log(`Url `, getUrl)
    chai.expect(getUrl).to.equal("http://bobit-us-frontend/")
    console.log(title)
    chai.expect(title).to.equal('bobit.us')
    console.log(`After opening the browser`)
});

Then(/^I verified (.*)$/, async function(text){
    console.log(`Then Test ID: ${this.testid}`)
    console.log(` Text: ${text}`);
    let element = await homepage.getText(text);
    chai.expect(await element.getText()).to.include(text)
});

