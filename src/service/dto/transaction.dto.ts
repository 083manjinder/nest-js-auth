/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { TransactionType } from '../../domain/enumeration/transaction-type';
import { BaseDTO } from './base.dto';

import { UserDTO } from './user.dto';

/**
 * A TransactionDTO object.
 */
export class TransactionDTO extends BaseDTO {
  @IsNotEmpty()
  @ApiProperty({ enum: TransactionType, description: 'type enum field' })
  type: TransactionType;

  @IsNotEmpty()
  @ApiProperty({ description: 'amount field' })
  amount: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'date field' })
  date: any;

  @ApiProperty({ description: 'description field', required: false })
  description: string;

  @ApiProperty({ description: 'recipient field', required: false })
  recipient: string;

  @ApiProperty({ type: () => UserDTO, description: 'user relationship' })
  user: UserDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
