import { crudRepositoryNameFor } from "@Decorators/inject-crud-repository.decorator";
import { crudServiceNameFor } from "@Decorators/inject-crud-service.decorator";
import { IDictionary } from "@Interfaces/i-dictionary.interface";
import { IEndpointsRecipe } from "@Interfaces/i-endpoints-recipe.interface";
import { IEntityRecipe } from "@Interfaces/i-entity-recipe.interface";
import { IPaginatedResult } from "@Interfaces/i-paginated-result.interface";
import {
  DynamicModule,
  ForwardReference,
  Logger,
  Module,
  Provider,
  Type,
} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DeepPartial } from "typeorm";
import {
  createDtoFor,
  paginatedResultDtoFor,
  updateDtoFor,
} from "@/helpers/dto.helper";
import { crudServiceFor } from "@/crud.service";
import { ICrudService } from "./interfaces/i-crud-service.interface";
import { crudControllerFor } from "@/crud.controller";
import { crudProfileFor } from "@/crud.profile";
import { crudRepositoryFor } from "@/crud.repository";
import { ICrudRepository } from "./interfaces/i-crud-repository.interface";
import { isScript, listFiles } from "@/helpers/function.helper";

const logger = new Logger("CrudModule", { timestamp: true });

export interface CrudModuleMetadata {
  entities: Array<Type<any>>;
  imports?: Array<
    Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
  >;
  providers?: Provider[];
}

@Module({})
export class CrudModule {
  private static readonly recipes: IDictionary<IEntityRecipe> = {};

  private static initializeRecipe(target: Type<any>) {
    const dtoRecipe = {
      createDto: createDtoFor(target),
      updateDto: updateDtoFor(target),
      returnDto: target as Type<any>,
      paginatedResultDto: paginatedResultDtoFor(target),
    };
    this.recipes[target.name] = {
      dtoRecipe,
      controller: crudControllerFor(target, dtoRecipe),
      service: crudServiceFor(target, dtoRecipe),
      mapperProfile: crudProfileFor(target, dtoRecipe),
      repository: this.crudRepositoryFor(target),
    };
  }

  private static recipeFor(target: Type<any>): IEntityRecipe {
    if (!this.recipes[target.name]) {
      this.initializeRecipe(target);
    }
    return this.recipes[target.name];
  }

  public static incrementRecipe(
    target: Type<any>,
    recipe: Partial<IEntityRecipe>
  ) {
    if (!this.recipes[target.name]) {
      CrudModule.initializeRecipe(target);
    }
    this.recipes[target.name] = { ...this.recipes[target.name], ...recipe };
  }

  public static crudControllerFor<
    Entity,
    CreateDto = any,
    UpdateDto extends DeepPartial<Entity> = any,
    ReturnDto = Entity,
    PaginatedResultDto extends IPaginatedResult<ReturnDto> = IPaginatedResult<ReturnDto>,
    Service extends ICrudService<
      Entity,
      CreateDto,
      UpdateDto,
      ReturnDto,
      PaginatedResultDto
    > = ICrudService<
      Entity,
      CreateDto,
      UpdateDto,
      ReturnDto,
      PaginatedResultDto
    >
  >(target: Type<Entity>, endpointsRecipe: IEndpointsRecipe = {}) {
    this.autoload([target]);
    return crudControllerFor<
      Entity,
      CreateDto,
      UpdateDto,
      ReturnDto,
      PaginatedResultDto,
      Service
    >(target, this.recipeFor(target).dtoRecipe, endpointsRecipe);
  }

  public static crudServiceFor<
    Entity,
    TRepository extends ICrudRepository<Entity> = ICrudRepository<Entity>,
    CreateDto = any,
    UpdateDto extends DeepPartial<Entity> = any,
    ReturnDto = Entity,
    PaginatedResultDto extends IPaginatedResult<ReturnDto> = IPaginatedResult<ReturnDto>
  >(target: Type<Entity>) {
    this.autoload([target]);
    return crudServiceFor<
      Entity,
      TRepository,
      CreateDto,
      UpdateDto,
      ReturnDto,
      PaginatedResultDto
    >(target, this.recipeFor(target).dtoRecipe);
  }

  public static crudRepositoryFor<Entity>(target: Type<Entity>) {
    return crudRepositoryFor<Entity>(target);
  }

  private static autoload(entities: Array<Type<any>>) {
    logger.log(`Starting ${entities.map((x) => x.name).join(",")} Autoload`);

    entities.forEach((target) => {
      const folderPath = Object.values(require.cache).find((x) =>
        Object.keys(x.exports ?? []).includes(target.name)
      ).path;
      const loadedFiled = Object.keys(require.cache).filter((x) =>
        x.includes(folderPath)
      );
      const actualFiles = listFiles(folderPath).filter(isScript);
      const unloadedFiles = actualFiles.filter((x) => !loadedFiled.includes(x));
      unloadedFiles.forEach((x) => {
        logger.log(`Loading ${x}`);
        require(x);
      });
    });

    logger.log("Finished Autoload");
  }

  static forFeature({
    entities,
    imports = [],
    providers = [],
  }: CrudModuleMetadata): DynamicModule {
    this.autoload(entities);
    const builtProviders = this.providersFor(entities);
    const profiles = this.profilesFor(entities);
    return {
      imports: [TypeOrmModule.forFeature(entities), ...imports],
      module: CrudModule,
      providers: [...builtProviders, ...profiles, ...providers],
      controllers: this.controllersFor(entities),
      exports: [...builtProviders, ...profiles, TypeOrmModule],
    };
  }

  // static forRoot(entities: Array<Type<any>>): DynamicModule {
  //   return {
  //     imports: [TypeOrmModule.forFeature(entities)],
  //     module: CrudModule,
  //     providers: [
  //       ...this.providersFor(entities),
  //       ...this.profilesFor(entities),
  //       ...this.controllersFor(entities),
  //     ],
  //     controllers: this.controllersFor(entities),
  //   };
  // }

  // static forApiRoot(entities: Array<Type<any>>): DynamicModule {
  //   return {
  //     imports: [TypeOrmModule.forFeature(entities)],
  //     module: CrudModule,
  //     providers: [
  //       ...this.providersFor(entities),
  //       ...this.profilesFor(entities),
  //     ],
  //     controllers: this.controllersFor(entities),
  //   };
  // }

  // static forGraphQlRoot(entities: Array<Type<any>>): DynamicModule {
  //   return {
  //     imports: [TypeOrmModule.forFeature(entities)],
  //     module: CrudModule,
  //     providers: [
  //       ...this.providersFor(entities),
  //       ...this.profilesFor(entities),
  //       ...this.controllersFor(entities),
  //     ],
  //   };
  // }

  private static providersFor(entities: Array<Type<any>>) {
    return entities.flatMap((target) => [
      this.repositoryFor(target),
      this.serviceFor(target),
    ]);
  }

  private static profilesFor(entities: Array<Type<any>>) {
    return entities.map((target) => this.profileFor(target));
  }

  private static controllersFor(entities: Array<Type<any>>) {
    return entities.map((target) => this.controllerFor(target));
  }

  private static controllerFor(target: Type<any>) {
    const targetRecipe = this.recipeFor(target);
    return targetRecipe.controller;
  }

  private static repositoryFor<Entity>(target: Type<Entity>) {
    const repositoryType = this.recipeFor(target).repository;
    return {
      provide: crudRepositoryNameFor(target),
      useClass: repositoryType,
    };
  }

  private static serviceFor<Entity>(target: Type<Entity>) {
    const serviceType = this.recipeFor(target).service;
    return {
      provide: crudServiceNameFor(target),
      useClass: serviceType,
    };
  }

  private static profileFor<Entity>(target: Type<Entity>) {
    const profileClass = this.recipeFor(target).mapperProfile;
    return {
      provide: `CrudProfile<${target.name}>`,
      useClass: profileClass,
    };
  }
}
