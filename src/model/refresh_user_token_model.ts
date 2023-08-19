export interface RefreshAccessTokenModel{
    data:{
      code: number,
      data: {
          access_token: string,
          avatar_big: string,
          avatar_middle: string,
          avatar_thumb: string,
          avatar_url: string,
          email: string,
          en_name: string,
          enterprise_email: string,
          expires_in: number,
          mobile: number,
          name: string,
          open_id: string,
          refresh_expires_in: number,
          refresh_token: string,
          sid: string,
          tenant_key: string,
          token_type: string,
          union_id: string,
          user_id: string
      },
      msg: string
  
    },
    error:{
        data:object
    },
    request:{
        data:object
    }
  }