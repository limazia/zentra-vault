export interface GitHubUserInfo {
  id: number
  login: string
  avatarUrl: string
  name: string
}

export interface CheckOrganizationMemberParams {
  accessToken: string
  organization: string
}

export abstract class GitHubAuthPort {
  abstract exchangeCodeForToken(code: string): Promise<string>
  abstract getUser(accessToken: string): Promise<GitHubUserInfo>
  abstract isOrganizationMember(
    params: CheckOrganizationMemberParams
  ): Promise<boolean>
}
