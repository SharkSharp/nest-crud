import { IDtoRecipe } from "@Interfaces/i-dto-recipe.interface";
import { CrudModule } from "@/crud.module";
import { applyDecorators, Type } from "@nestjs/common";

export const CrudDto = <Entity>(target: Type<Entity>, type: keyof IDtoRecipe) =>
  applyDecorators((dto) => CrudModule.incrementRecipe(target, { [type]: dto }));
