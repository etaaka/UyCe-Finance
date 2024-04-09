import {databases} from "./appwrite";
import {ID, Query} from "appwrite";
import {FinancialLine} from "./types/financial/line/FinancialLine";
import { FINANCIALS_COLLECTION_ID, FINANCIALS_DATABASE_ID } from "./FinancialService";

export const FINANCIAL_LINES_DATABASE_ID = "654769c9344dffc7dd50";
export const FINANCIAL_LINES_COLLECTION_ID = "65476be4ee6387964adb";

export const FinancialLineService = {

    async list() {
        return await databases.listDocuments(
            FINANCIAL_LINES_DATABASE_ID,
            FINANCIAL_LINES_COLLECTION_ID,
            [Query.orderDesc("$createdAt"), Query.limit(10)]
        );
    },

    async listByCompanyId(companyId: string, queries: string[] = []) {
        queries.push(Query.equal("companyId", companyId))
        return await databases.listDocuments(
          FINANCIALS_DATABASE_ID,
          FINANCIALS_COLLECTION_ID,
          queries
        );
    },

    async add(financialLine: FinancialLine) {
        return await databases.createDocument(
            FINANCIAL_LINES_DATABASE_ID,
            FINANCIAL_LINES_COLLECTION_ID,
            ID.unique(),
            financialLine
        );
    },

    async update(id: string, data: FinancialLine) {
        return await databases.updateDocument(FINANCIAL_LINES_DATABASE_ID, FINANCIAL_LINES_COLLECTION_ID, id, {...data})
    },

    async upsert(data: FinancialLine) {
        debugger
        if(data.$id == null){
            return await databases.createDocument(FINANCIAL_LINES_DATABASE_ID, FINANCIAL_LINES_COLLECTION_ID, ID.unique(), data);
        }else{
            return await databases.updateDocument(FINANCIAL_LINES_DATABASE_ID, FINANCIAL_LINES_COLLECTION_ID, data.$id, {...data})
        }
    },

    async remove(id: string) {
        return await databases.deleteDocument(FINANCIAL_LINES_DATABASE_ID, FINANCIAL_LINES_COLLECTION_ID, id);
    },

    async removeAll(ids: string[]) {
        for (const id of ids) {
            await this.remove(id)
        }
    },
}
