function readRelation<T extends Record<string, any>, M extends typeof Model>(
  data: T,
  { model, type }: { model: M; type: "hasMany" | "belongsTo" | "hasOne" },
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

export interface Relation<T extends Model> {
  name: keyof T;
  model: typeof Model;
  type: "hasMany" | "belongsTo" | "hasOne";
}

export default class Model {
  static table = `${Model.constructor.name.toLowerCase()}s`;
  constructor(_data?: Record<string, any>) {}

  // loadRelations(data: Record<string, any>) {
  //   this.relations.forEach((relation) => {
  //     // @ts-ignore
  //     this[relation.name] = readRelation(data, relation);
  //   });
  // }

  static get relations(): Relation<any>[] {
    return [];
  }
}

export function loadRelations<T extends Record<string, any>, I extends Model>(
  instance: I,
  data: T,
) {
  const model = instance.constructor as typeof Model;
  const relations = model.relations;
  relations.forEach((relation: Relation<I>) => {
    const key = relation.name;
    const relationData = readRelation(data, relation);
    if (relationData) {
      instance[key] = relationData as I[typeof key];
    }
  });
}
