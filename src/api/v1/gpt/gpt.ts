import OpenAI from "openai";
import fs from 'fs';
import { TokenErrorHandle } from "../../../model/error_handle_model";


export class GPTDataAnalyzer {
    api_key = process.env['api_key']
    openai = new OpenAI({
        apiKey: this.api_key,
    })

    public async chatCompletion(prompt: string) {
        try {
            const completion = await this.openai.chat.completions.create({
                messages: [{ role: 'user', content: `Please refer from this context
                "endorsement": is the total accumulated accounts of campaign.
                "bp": stands for broken promise it is a context where client promised to pay for certain date but did not proceed.
                "campaign": is categorize from where data being pulled from.
                "cold":  are the accounts that was paid their debt more than 30 days ago.
                "datetime": is a unixtimesamp value, values are daily, you can determine if the data is today or yesterday
                "kept": is payment count, per campaign there are accounts that is paying their debt on time as they promised.
                "amount": kept amount
                "missed": it is an account that has been pulled out from the agency but has paid partially.
                "ptp": or promise to pay this is the accounts that said to pay within that day, the difference between bp and ptp is bp is already past due to the date where they promise to pay.
                "rpc": is right party contact meaning it is an account identified as positive or contactable
                "worked": or worked accounts it is a breakdown from endorsement but has been worked out or being touched

                Please take note that the numbers indicated is count except for amount which currency is pesos or php
                
                act as a data analyst to create atleast 2 paragraphs of summary and highlights to this data and compare this data from yesterday, you can refer to "datetime" value for comparison.
                please act like you're discussing it, and refrain from adding uneccessary reply like sure thing etc...
                
                This is the data:  ${prompt}` }],
                model: 'gpt-4',
                temperature: 0.7
            });

            return {
                "code": 200,
                "content": completion.choices[0].message.content,
                "status": false
            }

        } catch (error:unknown) {
            if(error instanceof OpenAI.APIError){
                return {
                    "code": error.status,
                    "msg": error.message,
                    "status":"false"
                }
            }else{
                const err = error as TokenErrorHandle
                return err.response
            }
        }

    }
}