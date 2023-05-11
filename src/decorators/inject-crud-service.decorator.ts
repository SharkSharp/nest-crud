import { ICrudService } from "@Interfaces/i-crud-service.interface";
import { Inject, Type } from "@nestjs/common";

export const crudServiceNameFor = <Entity>(target: Type<Entity>): string =>
  `${ICrudService.name}<${target.name}>`;

export const InjectCrudService = (entity: Type<any>) =>
  Inject(crudServiceNameFor(entity));
