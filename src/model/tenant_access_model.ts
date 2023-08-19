export interface TenantTokenResponse{
    data: {
        code: number,
        msg: string,
        tenant_access_token: string,
        expire: number
      }
}