const nconf = require('nconf')

let configInit = false

let init = () => {
    const getAppConfigPath = () => {
        const path = nconf.get('configPath')
        console.log(path)
        if(path !== undefined) {
            return `${path}/appconfig.json`
        }
        return 'appconfig.json'
    }
    console.log(`ConfigPath: ${getAppConfigPath()}`)

    nconf.file({file: getAppConfigPath()})
    const appMode = nconf.get('mode')
    console.log(`AppMode: ${appMode}`)

    configInit = true
}

exports.get = (key) => {
    if(!configInit) {
        init()
    }
    return nconf.get(key)
}
