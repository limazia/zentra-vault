import { DomainException } from '../../../../shared/domain/exceptions/domain.exception'

export class FolderNotFoundException extends DomainException {
  constructor() {
    super('Pasta não encontrada', 404)
  }
}
