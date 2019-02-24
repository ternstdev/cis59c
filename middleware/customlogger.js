const fs = require('fs');

const customlogger = (req, res, next) => {
  const logFile = fs.openSync('./public/log.txt', 'a');
  fs.writeSync(logFile, `${req.protocol}://${req.get('host')}${req.originalUrl}\n`, null, null);
  next();
};

module.exports = customlogger;