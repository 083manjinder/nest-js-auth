import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { TransactionDTO } from '../service/dto/transaction.dto';
import { TransactionMapper } from '../service/mapper/transaction.mapper';
import { TransactionRepository } from '../repository/transaction.repository';

const relationshipNames = [];
relationshipNames.push('user');

@Injectable()
export class TransactionService {
  logger = new Logger('TransactionService');

  constructor(@InjectRepository(TransactionRepository) private transactionRepository: TransactionRepository) {}

  async findById(id: string): Promise<TransactionDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.transactionRepository.findOne(id, options);
    return TransactionMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<TransactionDTO>): Promise<TransactionDTO | undefined> {
    const result = await this.transactionRepository.findOne(options);
    return TransactionMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<TransactionDTO>): Promise<[TransactionDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.transactionRepository.findAndCount(options);
    const transactionDTO: TransactionDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(transaction => transactionDTO.push(TransactionMapper.fromEntityToDTO(transaction)));
      resultList[0] = transactionDTO;
    }
    return resultList;
  }

  async save(transactionDTO: TransactionDTO, creator?: string): Promise<TransactionDTO | undefined> {
    const entity = TransactionMapper.fromDTOtoEntity(transactionDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.transactionRepository.save(entity);
    return TransactionMapper.fromEntityToDTO(result);
  }

  async update(transactionDTO: TransactionDTO, updater?: string): Promise<TransactionDTO | undefined> {
    const entity = TransactionMapper.fromDTOtoEntity(transactionDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    await this.transactionRepository.update(entity.id, entity);
    return transactionDTO;
  }

  async deleteById(id: string): Promise<void | undefined> {
    await this.transactionRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
