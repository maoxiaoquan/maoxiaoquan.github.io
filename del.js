const rimraf = require("rimraf");
const path = require("path");

const delFileArr = [
  path.join(__dirname, "/docs/assets"),
  path.join(__dirname, "/docs/article"),
  path.join(__dirname, "/docs/404.index"),
  path.join(__dirname, "/docs/index.html"),
];

delFileArr.map((item) => {
  rimraf(item, function (err) {
    // 删除当前目录下的 test.txt
    if (err) throw err;
  });
});
