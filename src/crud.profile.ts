import { createMap, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { IDtoRecipe } from '@Interfaces/i-dto-recipe.interface';
import { Injectable, Type } from '@nestjs/common';

export function crudProfileFor<Entity>(
  target: Type<Entity>,
  { createDto, returnDto }: IDtoRecipe,
) {
  @Injectable()
  class CrudProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
      super(mapper);
    }

    override get profile() {
      return (mapper) => {
        createMap(mapper, createDto, target);
        createMap(mapper, target, returnDto);
      };
    }
  }
  return CrudProfile;
}
