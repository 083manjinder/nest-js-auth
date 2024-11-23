import { Transaction } from '../../domain/transaction.entity';
import { TransactionDTO } from '../dto/transaction.dto';

/**
 * A Transaction mapper object.
 */
export class TransactionMapper {
  static fromDTOtoEntity(entityDTO: TransactionDTO): Transaction {
    if (!entityDTO) {
      return;
    }
    let entity = new Transaction();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Transaction): TransactionDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new TransactionDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
