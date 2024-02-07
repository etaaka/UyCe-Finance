import {databases} from "./appwrite";
import {ID, Query} from "appwrite";
import {ReportType} from "./types/report/ReportType";
import {Report} from "./types/report/Report";
import {ReportStatus} from "./types/report/ReportStatus";

export const REPORT_DATABASE_ID = "654769c9344dffc7dd50";
export const REPORT_COLLECTION_ID = "6575e53c28fad9559c64";
export const REPORT_BUCKET = "65bfa13dc43a8d7df6ab";

export const ReportService = {
    getTypes(t: any) {
        let list = []
        for (let reportType in ReportType) {
            list.push({ name: t('ReportType.' + reportType), code: reportType })
        }
        return list
    },
    getStatus(t: any) {
        let list = []
        for (let reportStatus in ReportStatus) {
            list.push({ name: t('ReportStatus.' + reportStatus), code: reportStatus })
        }
        return list
    },

    async list(queries: string[] = []) {
        queries.push(Query.orderDesc("$createdAt"), Query.limit(10))
        return await databases.listDocuments(
            REPORT_DATABASE_ID,
            REPORT_COLLECTION_ID,
            queries
        );
    },

    async listByCompanyId(companyId: string, queries: string[] = []) {
        queries.push(Query.equal("companyId", companyId))
        return await databases.listDocuments(
            REPORT_DATABASE_ID,
            REPORT_COLLECTION_ID,
            queries
        );
    },

    async add(companyFile: Report) {
        return databases.createDocument(
            REPORT_DATABASE_ID,
            REPORT_COLLECTION_ID,
            ID.unique(),
            companyFile
        );
    },

    async update(id: string, data: Report) {
        delete  data.$databaseId
        delete  data.$collectionId
        return await databases.updateDocument(REPORT_DATABASE_ID, REPORT_COLLECTION_ID, id, {...data})
    },

    async remove(id: string) {
        return await databases.deleteDocument(REPORT_DATABASE_ID, REPORT_COLLECTION_ID, id);
    },

    async removeAll(ids: string[]) {
        for (const id of ids) {
            await this.remove(id)
        }
    },
}


