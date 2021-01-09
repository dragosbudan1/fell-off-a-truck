const {
    Builder,
    By
} = require("selenium-webdriver")
const chrome = require('selenium-webdriver/chrome')
const config = require('./config')

var Driver = function () {
    const options = new chrome.Options()
        .addArguments('--no-sandbox')

    if(config.get('headless')) {
        options.addArguments('--headless')
    }
    
    this.driver = new Builder()
        .forBrowser('chrome')
        .withCapabilities(options)
        .build()
}

Driver.prototype.findById = function (id) {
    return this.driver.findElement(By.id(id))
}

Driver.prototype.findByCss = function (css) {
    return this.driver.findElement(By.css(css))
}

Driver.prototype.get = function(link) {
    return this.driver.get(link)
}

Driver.prototype.getCookie = function(name) {
    return this.driver.manage().getCookie(name)
}

Driver.prototype.getCurrentUrl = function() {
    return this.driver.getCurrentUrl();
}

module.exports = Driver;
