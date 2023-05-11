import { IPaginatedResult } from "@Interfaces/i-paginated-result.interface";
import { IPagination } from "@Interfaces/i-pagination.interface";
import { DeepPartial } from "typeorm";

export abstract class ICrudService<
  Entity,
  CreateDto = any,
  UpdateDto extends DeepPartial<Entity> = any,
  ReturnDto = Entity,
  PaginatedResultDto extends IPaginatedResult<ReturnDto> = IPaginatedResult<ReturnDto>
> {
  abstract findById(id: number): Promise<ReturnDto>;
  abstract findAll(pagination: IPagination): Promise<PaginatedResultDto>;
  abstract create(model: CreateDto): Promise<ReturnDto>;
  abstract update(id: number, model: UpdateDto): Promise<ReturnDto>;
  abstract softDelete(id: number): Promise<void>;
}
