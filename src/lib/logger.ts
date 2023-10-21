import log, { LogLevelDesc } from "loglevel";
// @ts-ignore
import logPrefix from "loglevel-plugin-prefix";

logPrefix.reg(log);
logPrefix.apply(log, {
  template: "%n [%t]: %l:",
});

// TODO: move to config
function isLogLevel(level: string): level is keyof typeof log.levels {
  return level in log.levels;
}

// TODO: move to config
function getLogLevel(): LogLevelDesc {
  const level: string | undefined = process.env.LOG_LEVEL;
  if (level && isLogLevel(level)) {
    return log.levels[level as keyof typeof log.levels];
  } else {
    return log.levels.INFO;
  }
}

export default {
  getLogger(name?: string): log.Logger {
    let logger = log as log.Logger;
    if (name) {
      logger = log.getLogger(name);
    }

    logger.setLevel(getLogLevel());

    return logger;
  },
};
