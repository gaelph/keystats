import Fs from "fs";

export function instanceOfNodeError<T extends new (...args: any) => Error>(
  value: Error,
  errorType: T,
): value is InstanceType<T> & NodeJS.ErrnoException {
  return value instanceof errorType;
}

export function existSync(path: string): boolean {
  let doesExist = false;
  try {
    Fs.statSync(path);
    doesExist = true;
  } catch (error: any) {
    if (instanceOfNodeError(error, TypeError)) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
  }

  return doesExist;
}
