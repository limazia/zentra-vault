import { DomainException } from '../../../../shared/domain/exceptions/domain.exception'

export class VaultPasswordAlreadySetException extends DomainException {
  constructor() {
    super('A senha do vault já foi configurada e não pode ser alterada', 409)
  }
}
