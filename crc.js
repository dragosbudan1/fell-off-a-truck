let {
    Builder,
    By
} = require("selenium-webdriver")
var driver = new Builder().forBrowser('chrome').build()

const accountSid = 'AC8febae1b15b47a4ab712f960f0c6e0fa';
const authToken = '05c5aca9a86d4103bb0ceb66466a74f2';
const client = require('twilio')(accountSid, authToken);

const itemOutOfStockTemplate = 'Item out of stock. Please select another option';
const linkMyth = 'https://www.chainreactioncycles.com/vitus-mythique-29-vrx-mountain-bike-2021/rp-prod195589';
const linkStock = 'https://www.wiggle.co.uk/ns-bikes-synonym-tr-2-suspension-bike-2021';

async function acceptCookies() {
    try {
        let acceptCookies = await driver.findElement(By.id('truste-consent-button'))

        if (acceptCookies !== undefined || acceptCookies !== null) {
            acceptCookies.click()
        }
    } catch (error) {
        console.log("Ignore: " + error)
    }
}

async function logIn() {
    await driver.findElement(By.id('accountLink')).click()

    await driver.findElement(By.css(".bem-forms__form-control.js-username")).sendKeys("dragos.budan@gmail.com");
    await driver.findElement(By.css(".bem-forms__form-control.js-password")).sendKeys("");

    await driver.findElement(By.id('qa-login')).click()
}

async function checkStock() {
    await driver.findElement(By.css('#quickBuyBox > form > div.bem-sku-selector > div.bem-sku-selector__option.sku-items-children.js-size-selections.active')).click()
    await driver.findElement(By.css('#quickBuyBox > form > div.bem-sku-selector > div.bem-sku-selector__option.sku-items-children.js-size-selections.active > div > ul > li:nth-child(4)')).click();

    try {
        var outOfStock = await driver.findElement(By.id('additionalMessage'))
        if (outOfStock !== null) {
            console.log('out of stock')
            return false
        }
        
        return true

    } catch (error) {
        console.log(error)
        return true 
    } 
}

async function addToBasket() {
    try {
        await driver.findElement(By.css('#quickBuyBox > form > div.bem-sku-selector > div.bem-sku-selector__option.sku-items-children.js-size-selections.active')).click()
        await driver.findElement(By.css('#quickBuyBox > form > div.bem-sku-selector > div.bem-sku-selector__option.sku-items-children.js-size-selections.active > div > ul > li:nth-child(4)')).click();

        await driver.findElement(By.id('quickBuyButton')).click()

        var itemOutOfStock = await driver.findElement(By.css('.bem-pdp__add-to-basket--sku-error')).getText()

        if (itemOutOfStock !== null && itemOutOfStock === itemOutOfStockTemplate) {
            console.log(await itemOutOfStock)
            return false
        } else {
            console.log('stock in')
            client.messages
            .create({
                body: 'Bike available',
                from: '+12069849199',
                to: '+4407984215333'
            })
            .then(message => console.log(message.sid));
            return true
        }
    } catch (error) {

    }

}

async function scalp() {
    try {
        await driver.get(linkMyth)

        // accept cookies
        await acceptCookies()

        //log in
        //await logIn()

        //await addToBasket()

        // var itemOutOfStock = await driver.findElement(By.css('.bem-pdp__add-to-basket--sku-error'))

        // if (itemOutOfStock !== null) {
        //     var itemOutOfStockText = await itemOutOfStock.getText()
        //     console.log(itemOutOfStockText)
        // }
    } catch (error) {
        console.log(error)
    }
}

async function start() {
    for (; ;) {
        await scalp()
    }

    await driver.quit()
}

start()