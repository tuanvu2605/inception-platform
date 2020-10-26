const mongoose = require("mongoose");

const version = mongoose.model('Version');
const versionDependency = mongoose.model('VersionDependency');


exports.getVersionUpdateByPackageName = function (req, res) {
    let packageName = req.params.packageName;

    if (packageName == "" || packageName == undefined) {
        res.json({message: 'package undefined'});
    } else {
        versionDependency.findOne({dependencies: packageName}, function(err,dependency) {
            console.log('err',err);
            console.log('dependency',dependency);
            if (!dependency) {
                res.json({message: 'Some error found!'});
            }else {
                version.findOne({packageName: dependency.packageName}, function(err,version) {
                    if (!version){
                        res.json({message: 'No app need update'});
                    }else{
                        res.json(version)
                    }
                })

            }
        })
    }
}


// exports.createModel = function (req, res) {
//
//     let vd = new versionDependency({isUpdate: true, packageName: 'com.anhvvt.scan', dependencies: ['com.gamma.scan']});
//     let v = new version({
//         version: '1.1.1',
//         name: 'QR & Barcode',
//         packageName: 'com.anhvvt.scan',
//         url: 'https://appgallery.cloud.huawei.com/ag/n/app/C102171019?locale=en_US&source=appshare&subsource=C102171019'
//     });
//
//     v.save().then()
//     vd.save().then()
// }

