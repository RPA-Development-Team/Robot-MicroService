function validatePackage(pkgMetaData) {
    return new Promise((resolve, reject) => {
        let { Package, Robot, Schedule} = pkgMetaData
        let {package_name, path} = Package
        let {robot_name, robot_address} = Robot
        let {date, time} = Schedule
        if (package_name && path && robot_name && robot_address && date && time) {
            //validate date and time
            resolve(true)
        }
        resolve(false)
    })
}

module.exports = validatePackage;