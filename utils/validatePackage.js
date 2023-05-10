exports.validatePackage = (pkgMetaData) => {
    let {package_name, machine_name, path, date, time} = pkgMetaData
    if(!package_name || !machine_name || !path || !date || !time){
        return false
    }
    //validate date and time
    return true
}