const fs = require("fs");

module.exports = LogFileSize = (filename) => {
    const stats = fs.statSync(filename);
    return stats.size;
};