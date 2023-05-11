import { CrudModule } from "@/crud.module";
import { applyDecorators, Injectable, Type } from "@nestjs/common";

export const CrudProfile = <Entity>(target: Type<Entity>) =>
  applyDecorators(Injectable, (mapperProfile) =>
    CrudModule.incrementRecipe(target, { mapperProfile })
  );
