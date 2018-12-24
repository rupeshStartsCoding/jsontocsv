var json = require('../../GitBit/data-analysis/question topic identification/data2/questionsAll2.js').json         // import your json file
var path_to_write_your_csv = './test2.csv' //path to write your csv
const ObjectsToCsv = require('objects-to-csv');


function doCSV(json) {
    var inArray = arrayFrom(json);
    var outArray = [];
    for (var row in inArray)
        outArray[outArray.length] = parse_object(inArray[row]);
    return outArray
}

async function writeToFile(json, path) {
    var data = doCSV(json)
    let csv = new ObjectsToCsv(data);
    await csv.toDisk(path);
    console.log('done');
};

function parse_object(obj, path) {
    if (path == undefined)
        path = "";
    var type = typeof obj;
    var scalar = (type == "number" || type == "string" || type == "boolean" || type == "null");
    if (type == "array" || type == "object") {
        var d = {};
        for (var i in obj) {
            var newD = parse_object(obj[i], path + i + "/");
            d = { ...d, ...newD }
        }
        return d;
    }
    else if (scalar) {
        var d = {};
        var endPath = path.substr(0, path.length - 1);
        d[endPath] = obj;
        return d;
    }
    else return {};
}


function arrayFrom(json) {
    var queue = [], next = json;
    while (next !== undefined) {
        if (Array.isArray(next)) {
            if (next.length > 0) {
                var type = typeof next[0];
                var scalar = (type == "number" || type == "string" || type == "boolean" || type == "null");
                if (!scalar)
                    return next;
            }
        }
        else {
            for (var key in next)
                queue.push(next[key]);
        }
        next = queue.shift();
    }
    return [json];
}



writeToFile(json, path_to_write_your_csv).then((result)=> {console.log(result)}).catch((err) => {console.log(err)})
