import { setWorldConstructor } from "@cucumber/cucumber";
import chai from "chai"

class CustomWorld {
    testid: string
    appid: string
    constructor() {
        this.appid = process.env.APP_ID,
        this.testid = ""
    }
}
setWorldConstructor(CustomWorld)