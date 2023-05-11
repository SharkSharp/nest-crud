import { ICrudRepository } from "@Interfaces/i-crud-repository.interface";
import { applyDecorators, Inject, Type } from "@nestjs/common";

export const crudRepositoryNameFor = <Entity>(target: Type<Entity>): string =>
  `${ICrudRepository.name}<${target.name}>`;

export const InjectCrudRepository = (entity: Type<any>) =>
  applyDecorators(Inject(crudRepositoryNameFor(entity)));
