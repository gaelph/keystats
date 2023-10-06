import Path from "path";
import fs from "fs/promises";

export interface DeviceConfig {
  vendorId: number;
  productId: number;
  usagePage: number;
  usage: number;
  name: string;
}

interface ConfigObject {
  devices: DeviceConfig[];
}

function getHomedir(): string | undefined {
  return process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
}

function hexStringToInt(hexString: string): number {
  const hex = hexString.replace("0x", "");
  return parseInt(hex, 16);
}

function coerceHexStringToNumber(hexString: string | number): number {
  if (typeof hexString == "string") {
    return hexStringToInt(hexString);
  } else if (typeof hexString == "number") {
    if (Math.floor(hexString) == hexString) {
      return hexString;
    }
  }
  throw new Error("Invalid hex string or integer");
}

function coerceString(candidate: any): string {
  if (!candidate) {
    throw new Error("Invalid string");
  }
  const str = candidate.toString();
  if (str.length == 0) {
    throw new Error("Invalid string");
  }

  return str;
}

function coerceProperty<I, O>(
  object: Record<string, I>,
  key: string,
  coercion: (_value: any) => O,
): O {
  if (Object.prototype.hasOwnProperty.call(object, key)) {
    return coercion(object[key]);
  }

  throw new Error(`Property ${key} not found in object`);
}

type Schema<O> = {
  [key in keyof O]?: (_value: any) => O[key];
};

function coerceObject<I extends Record<string, any>, O extends Object>(
  object: I,
  coercion: Schema<O>,
): O {
  return Object.entries(coercion)
    .map(([key, coercionFunction]) => {
      try {
        const value = object[key];
        return [key, coercionFunction(value)];
      } catch (e: any) {
        throw new Error(`${key}: ${e.message}`);
      }
    })
    .reduce(
      (acc, [key, value]) => ({ ...acc, [key]: value }),
      {},
    ) as unknown as O;
}

function coerceArray<I, O>(coercion: (_value: I) => O): (_object: I[]) => O[] {
  return (object: I[]) => object.map(coercion);
}

function coerceDeviceConfig(object: Record<string, any>): DeviceConfig {
  return coerceObject(object, {
    name: coerceString,
    vendorId: coerceHexStringToNumber,
    productId: coerceHexStringToNumber,
    usagePage: coerceHexStringToNumber,
    usage: coerceHexStringToNumber,
  });
}

function coerceConfigObject(object: Record<string, any>): ConfigObject {
  return coerceObject(object, {
    devices: coerceArray(coerceDeviceConfig),
  });
}

export default class Config {
  protected configPath: string;
  devices: DeviceConfig[] = [];

  constructor(configPath?: string) {
    let actualPath = configPath;
    if (!actualPath) {
      actualPath = Path.join(
        getHomedir() || "",
        ".config",
        "keystats",
        "keystats.json",
      );
    } else if (configPath && !Path.isAbsolute(actualPath)) {
      actualPath = Path.join(process.cwd(), configPath);
    }

    this.configPath = actualPath;
  }

  private validateConfig(config: any): ConfigObject {
    return coerceConfigObject(config);
  }

  async load(): Promise<Config> {
    if (!(await fs.stat(this.configPath)).isFile()) {
      throw new Error(`Config file not found: ${this.configPath}`);
    }

    const json = await fs.readFile(this.configPath, "utf8");
    const config = this.validateConfig(JSON.parse(json));
    this.devices = config.devices;

    return this;
  }
}
