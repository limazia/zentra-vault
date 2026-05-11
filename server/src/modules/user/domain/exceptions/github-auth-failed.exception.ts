import { DomainException } from '../../../../shared/domain/exceptions/domain.exception'

export class GitHubAuthFailedException extends DomainException {
  constructor() {
    super('Falha na autenticação com o GitHub', 401)
  }
}
