exports.validatePackage = (pkgMetaData) => {
    let {package_name, robot_name, robot_address, path, date, time} = pkgMetaData
    if(!package_name || !robot_name || !robot_address || !path || !date || !time){
        return false
    }
    //validate date and time
    return true
}