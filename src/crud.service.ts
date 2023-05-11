import { InjectCrudRepository } from "@Decorators/inject-crud-repository.decorator";
import { throwEx } from "@Helpers/function.helper";
import { IDtoRecipe } from "@Interfaces/i-dto-recipe.interface";
import { IPaginatedResult } from "@Interfaces/i-paginated-result.interface";
import { IPagination } from "@Interfaces/i-pagination.interface";
import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable, NotFoundException, Type } from "@nestjs/common";
import { DeepPartial } from "typeorm";
import { ICrudRepository } from "./interfaces/i-crud-repository.interface";
import { ICrudService } from "./interfaces/i-crud-service.interface";

export function crudServiceFor<
  Entity,
  TRepository extends ICrudRepository<Entity> = ICrudRepository<Entity>,
  CreateDto = any,
  UpdateDto extends DeepPartial<Entity> = any,
  ReturnDto = Entity,
  PaginatedResultDto extends IPaginatedResult<ReturnDto> = IPaginatedResult<ReturnDto>
>(
  target: Type<Entity>,
  {
    createDto,
    returnDto,
  }: IDtoRecipe<CreateDto, UpdateDto, ReturnDto, PaginatedResultDto>
) {
  @Injectable()
  class BaseService extends ICrudService<
    Entity,
    CreateDto,
    UpdateDto,
    ReturnDto,
    PaginatedResultDto
  > {
    @InjectCrudRepository(target)
    readonly crudRepository: TRepository;
    @InjectMapper()
    readonly mapper: Mapper;

    async findById(id: number): Promise<ReturnDto> {
      const result =
        (await this.crudRepository.findById(id)) ??
        throwEx(new NotFoundException());
      return this.mapper.map(result, target, returnDto);
    }

    async findAll(pagination: IPagination): Promise<PaginatedResultDto> {
      const result = await this.crudRepository.findAll(pagination);
      return <PaginatedResultDto>{
        count: result.count,
        data: this.mapper.mapArray(result.data, target, returnDto),
      };
    }

    async create(model: CreateDto): Promise<ReturnDto> {
      const entity = this.mapper.map(model, createDto, target);
      const result = await this.crudRepository.create(entity);
      return this.mapper.map(result, target, returnDto);
    }

    async update(id: number, model: UpdateDto): Promise<ReturnDto> {
      const entity =
        (await this.crudRepository.findById(id)) ??
        throwEx(new NotFoundException());
      const result = await this.crudRepository.update(entity, model);
      return this.mapper.map(result, target, returnDto);
    }

    async softDelete(id: number): Promise<void> {
      await this.crudRepository.softDelete(id);
    }
  }
  return BaseService;
}
