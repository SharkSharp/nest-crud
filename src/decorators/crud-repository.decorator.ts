import { CrudModule } from "@/crud.module";
import { applyDecorators, Injectable, Type } from "@nestjs/common";

export const CrudRepository = <Entity>(target: Type<Entity>) =>
  applyDecorators(Injectable, (repository) =>
    CrudModule.incrementRecipe(target, { repository })
  );
