import { Injectable } from '@nestjs/common'
import axios, { AxiosInstance } from 'axios'
import { EnvService } from '../../../../../shared/infrastructure/env/env.service'
import {
  CheckOrganizationMemberParams,
  GitHubAuthPort,
  GitHubUserInfo,
} from '../../../application/ports/out/github-auth.port'

@Injectable()
export class GitHubApiAdapter implements GitHubAuthPort {
  private readonly githubApi: AxiosInstance
  private readonly githubOAuth: AxiosInstance

  constructor(private readonly env: EnvService) {
    const baseURL = 'https://api.github.com'
    const githubOAuthBaseURL = 'https://github.com'

    this.githubApi = axios.create({ baseURL })
    this.githubOAuth = axios.create({
      baseURL: githubOAuthBaseURL,
      headers: { Accept: 'application/json' },
    })
  }

  async exchangeCodeForToken(code: string): Promise<string> {
    const { data } = await this.githubOAuth.post<{
      access_token?: string
      error?: string
    }>('/login/oauth/access_token', {
      client_id: this.env.get('GITHUB_CLIENT_ID'),
      client_secret: this.env.get('GITHUB_CLIENT_SECRET'),
      code,
    })

    if (!data?.access_token) {
      throw new Error(data.error ?? 'Failed to exchange code for token')
    }

    return data.access_token
  }

  async getUser(accessToken: string): Promise<GitHubUserInfo> {
    const { data } = await this.githubApi.get<{
      id: number
      login: string
      avatar_url: string
      name: string
    }>('/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    return {
      id: data.id,
      login: data.login,
      avatarUrl: data.avatar_url,
      name: data.name,
    }
  }

  async isOrganizationMember(
    params: CheckOrganizationMemberParams
  ): Promise<boolean> {
    try {
      const { data } = await this.githubApi.get<{ login: string }[]>(
        '/user/orgs',
        {
          headers: { Authorization: `Bearer ${params.accessToken}` },
        }
      )

      return data.some(
        (org) => org.login.toLowerCase() === params.organization.toLowerCase()
      )
    } catch {
      return false
    }
  }
}
