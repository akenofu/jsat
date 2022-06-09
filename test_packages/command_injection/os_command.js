// var cp = require("child_process");

function expolit(string, input, val) {
    var endo = mid;
    var inner = string + "123" + "wow" + input;
    inner = ""
    var base = { "basekey": inner };
    var mid = "123";
    var end = mid + "";
    for (var key in base) {
        var nothing = key + base[key];
    }

    if (inner == "bad") {
        var nothing = base['basekey'] + "abc";
    }
    if (inner != 'bad') {
        var link = inner + "123";
    }
    cp.exec(link);
    cp.exec(end);

    mid = base;

}
module.exports = {
    expolit
};