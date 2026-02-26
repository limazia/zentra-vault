import { DomainException } from '../../../../shared/domain/exceptions/domain.exception'

export class VaultFileNotFoundException extends DomainException {
  constructor() {
    super('Arquivo não encontrado', 404)
  }
}
