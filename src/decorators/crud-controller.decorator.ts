import { CrudModule } from "@/crud.module";
import { applyDecorators, Controller, Type } from "@nestjs/common";
import { paramCase } from "change-case";

export const CrudController = <Entity>(target: Type<Entity>) =>
  applyDecorators(Controller(paramCase(target.name)), (controller) =>
    CrudModule.incrementRecipe(target, {
      controller,
    })
  );
