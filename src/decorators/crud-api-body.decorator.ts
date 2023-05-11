import { nameProxyFor } from "@Helpers/dto.helper";
import { applyDecorators, Type } from "@nestjs/common";
import { ApiBody } from "@nestjs/swagger";

export const CrudApiBody = <CreateDto>(
  newName: string,
  createDto: Type<CreateDto>
) =>
  applyDecorators(
    ApiBody({
      type: nameProxyFor(createDto, newName),
      required: true,
    })
  );
