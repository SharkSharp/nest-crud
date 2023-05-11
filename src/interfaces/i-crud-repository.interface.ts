import { IPaginatedResult } from "@Interfaces/i-paginated-result.interface";
import { IPagination } from "@Interfaces/i-pagination.interface";
import { DeepPartial } from "typeorm";

export abstract class ICrudRepository<Entity> {
  abstract findById(id: number): Promise<Entity>;
  abstract findOneBy(entity: Partial<Entity>);
  abstract findBy(entity: Partial<Entity>);
  abstract findAll(pagination: IPagination): Promise<IPaginatedResult<Entity>>;
  abstract create(model: Entity): Promise<Entity>;
  abstract update(
    mergeIntoEntity: Entity,
    model: DeepPartial<Entity>
  ): Promise<Entity>;
  abstract softDelete(id: number): Promise<void>;
}
