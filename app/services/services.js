// const TREE_TV_CODE = 115;
// module.exports.TREE_TV_CODE = TREE_TV_CODE;

const ex_fs = require('./ex-fs/ex-fs');

const codes = {
    // TREE_TV_CODE: TREE_TV_CODE,
    EX_FS_CODE: ex_fs.code
};

const services = {
    // [TREE_TV_CODE]: require('./treeTV/treeTV'),
    [codes.EX_FS_CODE]: ex_fs.service,
};

const servicesList = Object.keys(services).map(key => services[key]);


module.exports.codes = codes;

module.exports.getService = (code) => {
    return code ? services[code] : servicesList;
}
