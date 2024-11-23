/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { TransactionType } from './enumeration/transaction-type';

import { User } from './user.entity';

/**
 * A Transaction.
 */
@Entity('transaction')
export class Transaction extends BaseEntity {
  @Column({ type: 'simple-enum', name: 'type', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'decimal', name: 'amount', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'timestamp', name: 'date' })
  date: any;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'recipient', nullable: true })
  recipient: string;

  @ManyToOne(type => User)
  user: User;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
