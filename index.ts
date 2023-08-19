import express from 'express';
import bodyParser from 'body-parser';
import { RefreshToken } from './src/api/v1/auth/authenticate_user';
import { RefreshAccessTokenModel } from './src/model/refresh_user_token_model';
import { GetBaseRecords } from './src/api/v1/base/records/base_records';
import { ListBaseRecords } from './src/model/base_records_response_model';
import { TokenErrorHandle } from './src/model/error_handle_model';
import { GPTDataAnalyzer } from './src/api/v1/gpt/gpt';
import { BaseWriteData } from './src/api/v1/base/write/base_write_data';
import { BaseWriteDataModel } from './src/model/base_write_data_model';


//Initialize Middleware
const app = express();
const baseRouter = express.Router();
const mainRouter = express.Router();
const gptRouter = express.Router();
app.use(bodyParser.json());
app.use('/api/v1/base', baseRouter);
app.use('/api/v1', mainRouter);


//variables
const port: number = 3000;


//Endpoints
app.use((request, response) => {
  response.send({
    "code": 404,
    "msg": "Request not found",
    "status": "false"
  })
});

baseRouter.post('/write/:app_token/:table_id', async (request, response) => {
  const writeData = new BaseWriteData();
  const queryData = request.body as BaseWriteDataModel;
  // Define an array of field names to check
  const fieldsToCheck: (keyof BaseWriteDataModel)[] = ['endorsements', 'worked', 'rpc', 'ptp', 'kept', 'amount', 'bp', 'cold', 'missed'];

  // Initialize an array to store the names of empty fields
  const emptyFields: (keyof BaseWriteDataModel)[] = [];

  // Check and collect empty fields
  fieldsToCheck.forEach(field => {
    if (!queryData[field]) {
      emptyFields.push(field);
    }
  });

  if (emptyFields.length > 0) {
    response.status(400).json({ error: 'Some fields are empty.', emptyFields });
  } else {
    if (request.get("Authorization") && request.params.app_token && request.params.table_id) {
      const responseData = await writeData.writeData(request.get("Authorization") as string, request.params.app_token, request.params.table_id, {
        endorsements: queryData.endorsements,
        worked: queryData.worked,
        rpc: queryData.rpc,
        ptp: queryData.ptp,
        kept: queryData.kept,
        amount: queryData.amount,
        bp: queryData.bp,
        cold: queryData.bp,
        missed: queryData.missed
      });
      response.status(200).send(responseData);
    } else {
      response.status(401).json({ msg: "Unauthorized access" });
    }
  }


});

baseRouter.post('/records', async (request, response) => {
  const getRecords = new GetBaseRecords();
  if (request.body['app_token'] && request.body['table_id'] && request.get('Authorization')) {
    try {
      const baseRecordsData: ListBaseRecords = await getRecords.getBaseRecords({
        app_token: request.body['app_token'],
        table_id: request.body['table_id'],
        view_id: request.body['view_id'],
        access_token: request.get('Authorization') as string
      });
      response.status(200).send(baseRecordsData.data);
    } catch (error: unknown) {
      const err = error as TokenErrorHandle;
      response.status(403).send({
        "code": 403,
        "msg": err.response,
        "status": "false"
      });
    }

  } else {
    response.status(401).send({
      "code": 401,
      "msg": "Unauthorize access",
      "status": "false"
    })
  }
});


mainRouter.post('/gpt', async (request, response) => {
  const gpt = new GPTDataAnalyzer();
  console.log("Got the request")
  if (request.body['prompt']) {
    console.log("true")
    const responseValue = await gpt.chatCompletion(request.body['prompt']);
    response.status(200).send(responseValue)
  }

});

mainRouter.post('/authenticate/:refresh_token', async (request, response) => {
  const refreshToken = new RefreshToken();
  if (request.params.refresh_token) {
    const refreshTokenValue = await refreshToken.refreshToken(request.params.refresh_token) as RefreshAccessTokenModel;
    response.status(200).send(refreshTokenValue)
    console.log(refreshTokenValue)
  } else {
    response.status(401).send({
      "code": 401,
      "msg": "Unauthorize Access"
    });
  }
});


app.listen(port, () => {
  console.log(`Listening on port localhost:${port}`);
})
