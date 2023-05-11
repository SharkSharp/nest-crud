import { IPaginatedResult } from "@Interfaces/i-paginated-result.interface";
import { IPagination } from "@Interfaces/i-pagination.interface";
import { Injectable, Type } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOptionsWhere, Repository } from "typeorm";
import { ICrudRepository } from "./interfaces/i-crud-repository.interface";

export function crudRepositoryFor<Entity = any>(target: Type<Entity>) {
  @Injectable()
  class BaseRepository implements ICrudRepository<Entity> {
    @InjectRepository(target)
    readonly entityRepository: Repository<Entity>;

    async create(model: Entity): Promise<Entity> {
      return await this.entityRepository.save(model);
    }

    async findById(id: number): Promise<Entity> {
      return await this.entityRepository.findOneBy(<any>{ id });
    }

    async findOneBy(entity: Partial<Entity>) {
      return await this.entityRepository.findOneBy(
        <FindOptionsWhere<Entity>>entity
      );
    }

    async findBy(entity: Partial<Entity>) {
      return await this.entityRepository.findBy(
        <FindOptionsWhere<Entity>>entity
      );
    }

    async findAll({
      take,
      skip,
    }: IPagination): Promise<IPaginatedResult<Entity>> {
      const [data, count] = await this.entityRepository.findAndCount({
        take,
        skip,
      });
      return { data, count };
    }

    async update(
      mergeIntoEntity: Entity,
      model: DeepPartial<Entity>
    ): Promise<Entity> {
      this.entityRepository.merge(mergeIntoEntity, model);
      return await this.entityRepository.save(mergeIntoEntity);
    }

    async softDelete(id: number): Promise<void> {
      await this.entityRepository.softDelete(id);
    }
  }
  return BaseRepository;
}
