//const fs = require('fs')

var AntProver = artifacts.require("AntProver")
module.exports = function (deployer) {
    deployer.deploy(AntProver)
        /*.then(() => {
            const deplInfo = JSON.stringify({
                address: AntProver.address
            })
            let deplInfoDir = 'build/deployment'
            if (!fs.existsSync(deplInfoDir)) {
                fs.mkdirSync(deplInfoDir)
            }
            fs.writeFileSync(deplInfoDir + '/AntProver.json', deplInfo)
        })*/
}
