const rimraf = require("rimraf");
const path = require("path");

const delFileArr = [path.join(__dirname, "/docs")];

delFileArr.map((item) => {
  rimraf(item, function (err) {
    // 删除当前目录下的 test.txt
    if (err) throw err;
  });
});
