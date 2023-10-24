import Path from "path";
import fs from "fs/promises";

import { z } from "zod";

const deviceConfigSchema = z.object({
  vendorId: z.coerce.string().transform(coerceHexStringToNumber),
  productId: z.coerce.string().transform(coerceHexStringToNumber),
  usagePage: z.coerce.string().transform(coerceHexStringToNumber),
  usage: z.coerce.string().transform(coerceHexStringToNumber),
  name: z.string().min(1),
  fingerMap: z.array(z.array(z.number().min(0).max(9)).min(1)).min(1),
});
export type DeviceConfig = z.infer<typeof deviceConfigSchema>;

const configSchema = z.object({
  devices: z.array(deviceConfigSchema).min(1),
});
export type ConfigObject = z.infer<typeof configSchema>;

function getHomedir(): string | undefined {
  return process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
}

function hexStringToInt(hexString: string): number {
  if (hexString.startsWith("0x")) {
    const hex = hexString.replace("0x", "");
    return parseInt(hex, 16);
  } else {
    return parseInt(hexString, 10);
  }
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

  #validateConfig(config: any): ConfigObject {
    const validConfig = configSchema.parse(config);

    for (const deviceConfig of validConfig.devices) {
      const rowLengths = new Set(
        deviceConfig.fingerMap.map((row) => row.length),
      );
      if (rowLengths.size != 1) {
        throw new Error(
          "Each row of finger map must have the same number of columns",
        );
      }
    }

    return validConfig;
  }

  async load(): Promise<Config> {
    if (!(await fs.stat(this.configPath)).isFile()) {
      throw new Error(`Config file not found: ${this.configPath}`);
    }

    const json = await fs.readFile(this.configPath, "utf8");
    const config = this.#validateConfig(JSON.parse(json));
    this.devices = config.devices;

    return this;
  }
}
