import { nameProxyFor } from "@Helpers/dto.helper";
import { applyDecorators, Type } from "@nestjs/common";
import { ApiResponse, ApiResponseOptions } from "@nestjs/swagger";

export const CrudApiResponse = <Entity, PaginatedResultDto>(
  target: Type<Entity>,
  paginatedResultDto: Type<PaginatedResultDto>,
  options: ApiResponseOptions = {}
) =>
  applyDecorators(
    ApiResponse({
      status: 200,
      ...options,
      type: nameProxyFor(
        paginatedResultDto,
        `Pagianted${target.name}ResultDto`
      ),
    })
  );
