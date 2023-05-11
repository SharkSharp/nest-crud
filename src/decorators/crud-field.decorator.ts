import { AutoMap } from '@automapper/classes';
import { applyDecorators } from '@nestjs/common';
import { Field, ID } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export const CrudDtoField = ({
  type = null,
  nullable = false,
  required = true,
} = {}) =>
  applyDecorators(
    Field(
      ...(<any[]>(
        [type ? () => type : undefined, { nullable }].filter((x) => x)
      )),
    ),
    AutoMap(),
    ApiProperty({ nullable, required, ...(type ? { type: () => type } : {}) }),
  );

export const CrudField = ({ nullable = false, required = true } = {}) =>
  applyDecorators(
    Field({ nullable }),
    Column(),
    AutoMap(),
    ApiProperty({ nullable, required }),
  );

export const CrudPrimaryField = () =>
  applyDecorators(
    AutoMap(),
    ApiProperty(),
    Field(() => ID),
    PrimaryGeneratedColumn(),
  );
