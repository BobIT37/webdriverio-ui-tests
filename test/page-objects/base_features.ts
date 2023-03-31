import {error} from "winston";

export default class baseFeatures{

    static getUrl(){
        return browser.getUrl();
    }
    static async getText(text:string){
        return await $(`div=${text}`)
    }
    static getHeader(text:string){
        return $(`h3=${text}`)
    }
}