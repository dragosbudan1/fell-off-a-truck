const Driver = require('./chromeDriverWrapper')
let driver = new Driver()
const config = require('./config')
const appMode = config.get('mode')

outOfStockUrl = 'https://www.argos.co.uk/vp/oos/ps5.html'

const linkProd = 'https://www.argos.co.uk/list/shop-ps5-games-and-accessories-and-more-now/category:50002575/';
const linkTest = 'https://www.wiggle.co.uk/ns-bikes-synonym-tr-2-suspension-bike-2021';
let linkCurrent = linkProd

if (appMode === 'test') {
    linkCurrent = linkTest
}

async function acceptCookies() {
    try {
        let acceptCookies = await driver.findById('consent_prompt_submit')

        if (acceptCookies !== undefined || acceptCookies !== null) {
            await acceptCookies.click()
        }
    } catch (error) {
        console.log("Ignore: " + error)
    }

}

const sendMessageReady = config.get('minStockIn');
let currentCountStockIn = 0;

async function moreDetails() {
    try {
        await driver.findByCss('#findability > div > div.search > div > div.styles__Container-sc-1h5mbdb-0.gCgRbH.xs-12--none.lg-9--none.xs-stack > div.styles__ProductList-sc-1rzb1sn-0.dPoUkX > div:nth-child(1) > div.ProductCardstyles__ButtonContainer-sc-1fgptbz-8.hZkbnA > a').click()

        setTimeout(function() {
          }, 2000);

        var itemOutOfStock = await driver.findById('h1title').getText()
        var currentUrl = await driver.getCurrentUrl()
        
        if (currentUrl === outOfStockUrl && itemOutOfStock.startsWith('Sorry')) {
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

        await acceptCookies()

        await moreDetails()

        if (currentCountStockIn >= sendMessageReady) {
            emailService.sendEmail(linkCurrent)
            smsService.sendSms(linkCurrent)
        }
        console.log('end')
    } catch (error) {
        console.log("Ignore: " + error)
    }

}

async function start() {
    for (;;) {
        await scalp()
    }

    await driver.quit()
}

start()