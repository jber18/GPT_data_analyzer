import axios from 'axios';
import { BaseWriteDataModel } from '../../../../model/base_write_data_model'
import { TokenErrorHandle } from '../../../../model/error_handle_model';

export class BaseWriteData {

  public async writeData(user_access_token: string,app_token:string, table_id:string, options: BaseWriteDataModel) {
    try {
      const { endorsements, worked, rpc, ptp, kept, amount, bp, cold, missed } = options;
      const writeDataResponse = await axios({
        method: "POST",
        url: `https://open.larksuite.com/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': user_access_token
        },
        data: {
          "fields": {
            "endorsements": endorsements,
            "worked": worked,
            "rpc": rpc,
            "ptp": ptp,
            "kept": kept,
            "amount": amount,
            "bp": bp,
            "cold": cold,
            "missed": missed

          }
        }
      });
      return writeDataResponse.data
    } catch (error: unknown) {
      const err = error as TokenErrorHandle;
      return err.response

    }

  }
}