const Driver = require('./chromeDriverWrapper')
let driver = new Driver()

const config = require('./config')

const EmailService = require('./emailService')
let emailService = new EmailService()

const SmsService = require('./smsService')
let smsService = new SmsService()

const appMode = config.get('mode')

const linkMyth = 'https://www.wiggle.co.uk/vitus-mythique-29-vrx-mountain-bike-2021';
const linkStock = 'https://www.wiggle.co.uk/ns-bikes-synonym-tr-2-suspension-bike-2021';
let linkCurrent = linkMyth
let linkIndex = config.get('linkIndex')
if (appMode === 'test') {
    linkCurrent = linkStock
}

const sendMessageReady = config.get('minStockIn');
let currentCountStockIn = 0;

const itemOutOfStockTemplate = 'Item out of stock. Please select another option'

async function acceptCookies() {
    try {
        let acceptCookies = await driver.findById('truste-consent-button')

        if (acceptCookies !== undefined || acceptCookies !== null) {
            acceptCookies.click()
        }
    } catch (error) {
        console.log("Ignore: " + error)
    }
}

async function logIn() {
    await driver.findElement(By.id('accountLink')).click()

    await driver.findElement(By.css(".bem-forms__form-control.js-username")).sendKeys("");
    await driver.findElement(By.css(".bem-forms__form-control.js-password")).sendKeys("!");

    await driver.findElement(By.id('qa-login')).click()
}

async function addToBasket() {
    try {
        await driver.findByCss('#quickBuyBox > form > div.bem-sku-selector > div.bem-sku-selector__option.sku-items-children.js-size-selections.active').click()
        await driver.findByCss(`#quickBuyBox > form > div.bem-sku-selector > div.bem-sku-selector__option.sku-items-children.js-size-selections.active > div > ul > li:nth-child(${linkIndex})`).click();

        await driver.findById('quickBuyButton').click()

        var itemOutOfStock = await driver.findByCss('.bem-pdp__add-to-basket--sku-error').getText()

        if (itemOutOfStock === itemOutOfStockTemplate) {
            console.log(await itemOutOfStock)
            currentCountStockIn = 0;
        } else {
            console.log('stock in')
            currentCountStockIn++;
        }
    } catch (error) {

    }
}

async function scalp() {
    try {
        await driver.get(linkCurrent)

        // accept cookies
        await acceptCookies()

        //log in
        //await logIn()
        await addToBasket()
        console.log(`currentCountStockIn: ${currentCountStockIn}, linkIndex: ${linkIndex}`)
        if (currentCountStockIn >= sendMessageReady) {
            let basketCookie = await driver.getCookie('WiggleBasket2')
            console.log(basketCookie)
            emailService.sendEmail(basketCookie)
            smsService.sendSms(linkCurrent)
        }
    } catch (error) {
        console.log(error)
    }
}

async function start() {
    for (;;) {
        await scalp()
    }

    await driver.quit()
}

start()