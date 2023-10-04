import Key from "./key";

export default class Keymap {
  id;
  keycode;
  keyId;
  layerId;
  key;
  layer;

  constructor(data = {}) {
    this.id = data.id;
    this.keycode = data.keycode;
    this.keyId = data.keyId;
    this.layerId = data.layerId;

    const dataKeys = Object.keys(data);
    if (dataKeys.some((k) => k.startsWith("key."))) {
      const keyData = dataKeys.reduce((acc, k) => {
        if (k.startsWith("key.")) {
          acc[k.replace("key.", "")] = data[k];
        }
      }, {});

      this.key = new Key(keyData);
    }

    if (dataKeys.some((k) => k.startsWith("layer."))) {
      const layerData = dataKeys.reduce((acc, k) => {
        if (k.startsWith("layer.")) {
          acc[k.replace("layer.", "")] = data[k];
        }
      }, {});

      this.layer = new Key(layerData);
    }
  }
}
