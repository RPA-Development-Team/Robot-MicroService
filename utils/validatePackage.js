function validatePackage(pkgMetaData) {
    return new Promise((resolve, reject) => {
        let { package_name, robot_name, robot_address, path, date, time } = pkgMetaData
        if (package_name && robot_name && robot_address && path && date && time) {
            //validate date and time
            resolve(true)
        }
        resolve(false)
    })
}

module.exports = validatePackage;