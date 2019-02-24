const fs = requrie('fs');

const customlogger = (req, res, next) => {
  const logFile = fs.openSync('./public/log.txt', 'a');
  fs.writeSync(logFile, `${req.protocol}://${req.get('host')}${req.originalUrl}`, null, null);
  next();
};

module.exports = customlogger;