export default interface Repository<T> {
  build(data: any): T;

  create(data: T): Promise<T>;
  getById(id: number): Promise<T>;
  getAll(): Promise<T[]>;
  update(data: T): Promise<T>;
  delete(id: number): Promise<void>;
}
