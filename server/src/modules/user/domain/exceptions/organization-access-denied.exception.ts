import { DomainException } from '../../../../shared/domain/exceptions/domain.exception'

interface OrganizationAccessDeniedProps {
  username: string
  organization: string
}

export class OrganizationAccessDeniedException extends DomainException {
  constructor(props: OrganizationAccessDeniedProps) {
    super(
      `Usuário "${props.username}" não é membro da organização "${props.organization}"`,
      403
    )
  }
}
