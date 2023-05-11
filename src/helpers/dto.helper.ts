import { paginatedResultFor } from "@Dtos/paginatedResult.dto";
import { OmitType } from "@Helpers/mapped-types/omit-type.helper";
import { PartialType } from "@Helpers/mapped-types/partial-type.helper";
import { Type } from "@nestjs/common";

export const createDtoFor = (entity: Type<any>): Type<any> =>
  OmitType(entity, ["id"] as const);

export const updateDtoFor = (entity: Type<any>): Type<any> =>
  PartialType(createDtoFor(entity));

export const paginatedResultDtoFor = (entity: Type<any>): Type<any> =>
  paginatedResultFor(entity);

export const nameProxyFor = (entity: Type<any>, newName: string) =>
  new Proxy(PartialType(entity), {
    get(target, prop, receiver) {
      if (prop === "name") {
        return newName;
      }
      return Reflect.get(target, prop, receiver);
    },
  });
