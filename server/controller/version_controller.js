exports.getVersionUpdateByPackageName = function (req, res) {
    let packageName = req.params.packageName;
    if (packageName == "" || packageName == undefined) {
        res.json({message: 'package undefined'});
    } else {
        res.json({
            isUpdate: true,
            packageName: 'com.anhvvt.qrcodescan',
            version: '1.0.0',
            url: 'https://appgallery.cloud.huawei.com/ag/n/app/C102171019?locale=en_US&source=appshare&subsource=C102171019',
            name: 'Professional QRCode'
        });
    }

}
