import { Type } from '@nestjs/common';

export interface IDtoRecipe<
  CreateDto = any,
  UpdateDto = any,
  ReturnDto = any,
  PaginatedResultDto = any,
> {
  createDto: Type<CreateDto>;
  updateDto: Type<UpdateDto>;
  returnDto: Type<ReturnDto>;
  paginatedResultDto: Type<PaginatedResultDto>;
}
