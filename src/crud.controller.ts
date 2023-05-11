import { PaginationDto } from "@/dtos/pagination.dto";
import { InjectCrudService } from "@Decorators/inject-crud-service.decorator";
import { Optional } from "@Decorators/optional.decorator";
import { IDtoRecipe } from "@Interfaces/i-dto-recipe.interface";
import { IEndpointsRecipe } from "@Interfaces/i-endpoints-recipe.interface";
import { IPaginatedResult } from "@Interfaces/i-paginated-result.interface";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Type,
} from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { capitalCase, paramCase } from "change-case";
import { DeepPartial } from "typeorm";
import { ICrudService } from "./interfaces/i-crud-service.interface";
import { UnauthorizedDto } from "./dtos/errors.dto";
import { CrudApiBody } from "./decorators/crud-api-body.decorator";
import { CrudApiResponse } from "./decorators/crud-api-response.decorator";

export function crudControllerFor<
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
  > = ICrudService<Entity, CreateDto, UpdateDto, ReturnDto, PaginatedResultDto>
>(
  target: Type<Entity>,
  {
    createDto,
    updateDto,
    returnDto,
    paginatedResultDto,
  }: IDtoRecipe<CreateDto, UpdateDto, ReturnDto, PaginatedResultDto>,
  {
    createEndpoint = true,
    findAllEndpoint = true,
    findByIdEndpoint = true,
    updateEndpoint = true,
    deleteEndpoint = true,
  }: IEndpointsRecipe = {}
) {
  @ApiTags(capitalCase(target.name))
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
    type: UnauthorizedDto,
  })
  @Controller(paramCase(target.name))
  class BaseController {
    @InjectCrudService(target)
    readonly crudService: Service;

    @Optional(Post(), createEndpoint)
    @CrudApiBody(`Create${target.name}Dto`, createDto)
    @CrudApiResponse(target, returnDto, { status: 201 })
    async create(@Body() modelDto: CreateDto): Promise<ReturnDto> {
      return await this.crudService.create(modelDto);
    }

    @Optional(Get(), findAllEndpoint)
    @CrudApiResponse(target, paginatedResultDto)
    async findAll(
      @Query() pagination: PaginationDto
    ): Promise<PaginatedResultDto> {
      return await this.crudService.findAll(pagination);
    }

    @Optional(Get(":id"), findByIdEndpoint)
    @CrudApiResponse(target, returnDto)
    async findById(@Param("id") id: number): Promise<ReturnDto> {
      return await this.crudService.findById(id);
    }

    @Optional(Put(":id"), updateEndpoint)
    @CrudApiBody(`Update${target.name}Dto`, updateDto)
    @CrudApiResponse(target, returnDto)
    async update(
      @Param("id") id: number,
      @Body() updateDto: UpdateDto
    ): Promise<ReturnDto> {
      return await this.crudService.update(id, updateDto);
    }

    @Optional(Delete(":id"), deleteEndpoint)
    async delete(@Param("id") id: number) {
      return await this.crudService.softDelete(id);
    }
  }
  return BaseController;
}
