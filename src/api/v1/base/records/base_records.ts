import axios from 'axios';
import { TokenErrorHandle } from '../../../../model/error_handle_model';

interface BaseRecordsOptions {
  access_token: string;
  app_token: string;
  table_id: string;
  view_id: string;
}

export class GetBaseRecords {

  public async getBaseRecords(options: BaseRecordsOptions) {
    const { access_token, app_token, table_id, view_id } = options;
    if (access_token && app_token && table_id && view_id) {
      try {
        const baseResponseData = await axios({
          method: "GET",
          url: `https://open.larksuite.com/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records?page_size=20&view_id=${view_id}`,
          headers: {
            'Authorization': access_token
          }
        });
        return baseResponseData.data;

      } catch (error: unknown) {
        const err = error as TokenErrorHandle;
        return err.response.data
      }

    } else {
      return "all fields must satisfied";
    }


  }
}