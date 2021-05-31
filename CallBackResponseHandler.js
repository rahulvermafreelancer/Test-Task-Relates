const HandleData = (success, message = null, size = 256, data) => {
    return {
        success,
        message,
        size,
        data,
    };
};

module.exports = HandleData;