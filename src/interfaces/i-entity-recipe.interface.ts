import { AutomapperProfile } from '@automapper/nestjs';
import { IDtoRecipe } from '@Interfaces/i-dto-recipe.interface';
import { Type } from '@nestjs/common';

export interface IEntityRecipe {
  repository: Type<any>;
  service: Type<any>;
  controller: Type<any>;
  dtoRecipe: IDtoRecipe;
  mapperProfile: Type<AutomapperProfile>;
}
