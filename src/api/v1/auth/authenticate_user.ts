import axios from "axios";
import NodeCache from 'node-cache';
import { RefreshAccessTokenModel } from "../../../model/refresh_user_token_model";
import { TenantTokenResponse } from "../../../model/tenant_access_model";
import { TokenErrorHandle } from "../../../model/error_handle_model";

const cache_refresh_token = new NodeCache({ stdTTL: 7200 });
const cache_tenant_token = new NodeCache({ stdTTL: 6200 });

export class RefreshToken {

    private async getTenantAccessToken() {
        const app_id: string = process.env['app_id'] as string;  // This needs to be hidden
        const app_secret: string = process.env['app_secret'] as string; // This needs to be hidden

        try {
            const tenantTokenResponse: TenantTokenResponse = await axios({
                method: "POST",
                url: "https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal",
                data: {
                    app_id: app_id,
                    app_secret: app_secret
                }
            });

            cache_tenant_token.set("tenant_token", tenantTokenResponse.data.tenant_access_token);
            return cache_tenant_token.get("tenant_token");

        } catch (error: unknown) {
            const err = error as TokenErrorHandle;
            return err.response.data
        }

    }

    public async refreshToken(user_token: string) {
        try {
            const responseData: RefreshAccessTokenModel = await axios({
                method: "POST",
                url: "https://open.larksuite.com/open-apis/authen/v1/refresh_access_token",
                headers: {
                    "Authorization": `Bearer ${await this.getTenantAccessToken()}`
                },
                data: {
                    "grant_type": "refresh_token",
                    "refresh_token": user_token
                }

            });

            if (!responseData.data || !responseData.data == undefined) {
                cache_refresh_token.set('access_token', responseData.data.data.access_token);
                cache_refresh_token.set('name', responseData.data.data.name);
                cache_refresh_token.set('user_id', responseData.data.data.user_id);
                cache_refresh_token.set('refresh_token', responseData.data.data.refresh_token);
                return {
                    "code": 200,
                    data: {
                        "user": cache_refresh_token.get("name"),
                        "user_id": cache_refresh_token.get("user_id"),
                        "access_token": cache_refresh_token.get("access_token"),
                        "refresh_token": cache_refresh_token.get("refresh_token"),
                    },
                    "msg": "success"
                }
            } else {
                return { code: 20001, msg: 'invalid request' }
            }

        } catch (error) {
            const err = error as TokenErrorHandle;
            return err.response
        }
    }


}

