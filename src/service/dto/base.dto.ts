import { Transform } from 'class-transformer';

/**
 * A DTO base object.
 */
export class BaseDTO {
  @Transform(({ value }) => (value?.toHexString ? value?.toHexString() : value), { toPlainOnly: true }) id?: string;

  createdBy?: string;

  createdDate?: Date;

  lastModifiedBy?: string;

  lastModifiedDate?: Date;
}
