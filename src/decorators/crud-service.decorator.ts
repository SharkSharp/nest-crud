import { CrudModule } from "@/crud.module";
import { applyDecorators, Injectable, Type } from "@nestjs/common";

export const CrudService = <Entity>(target: Type<Entity>) =>
  applyDecorators(Injectable, (service) =>
    CrudModule.incrementRecipe(target, { service })
  );
