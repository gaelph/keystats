function readRelation<T extends Record<string, any>, M extends typeof Model>(
  data: T,
  { model, type }: { model: M; type: "hasMany" | "belongsTo" },
) {
  const dataKeys = Object.keys(data);
  const prefix = `${model.table}.`;
  const keyData = dataKeys.reduce(
    (acc, key: string) => {
      if (key.startsWith(prefix)) {
        acc[key.replace(prefix, "")] = data[key];
      }
      return acc;
    },
    {} as Record<string, any>,
  );

  if (Object.keys(keyData).length > 0) {
    const instance = new model(keyData);
    if (type === "hasMany") {
      return [instance];
    }

    return instance;
  }
}

export interface Relation {
  name: string;
  model: typeof Model;
  type: "hasMany" | "belongsTo";
}

export default class Model {
  static table = `${Model.constructor.name.toLowerCase()}s`;
  constructor(_data?: Record<string, any>) {}

  loadRelations(data: Record<string, any>) {
    this.relations.forEach((relation) => {
      // @ts-ignore
      this[relation.name] = readRelation(data, relation);
    });
  }

  get relations(): Relation[] {
    return [];
  }
}
