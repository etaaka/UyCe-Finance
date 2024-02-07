import {databases} from "./appwrite";
import {ID, Query} from "appwrite";
import {CompanyFile} from "./types/file/CompanyFile";
import {CompanyFileType} from "./types/file/CompanyFileType";

export const COMPANY_FILE_DATABASE_ID = "654769c9344dffc7dd50";
export const COMPANY_FILE_COLLECTION_ID = "65bde1f453417112b9e6";
export const COMPANY_FILE_BUCKET = "65bde2ba6ea6fcbdf485";

export const CompanyFileService = {
    getTypes(t: any) {
        let list = []
        for (let fileType in CompanyFileType) {
            list.push({ name: t('CompanyFileType.' + fileType), code: fileType })
        }
        return list
    },

    async list(queries: string[] = []) {
        queries.push(Query.orderDesc("$createdAt"), Query.limit(10))
        return await databases.listDocuments(
            COMPANY_FILE_DATABASE_ID,
            COMPANY_FILE_COLLECTION_ID,
            queries
        );
    },

    async listByCompanyId(companyId: string, queries: string[] = []) {
        queries.push(Query.equal("companyId", companyId))
        return await databases.listDocuments(
            COMPANY_FILE_DATABASE_ID,
            COMPANY_FILE_COLLECTION_ID,
            queries
        );
    },

    async add(companyFile: CompanyFile) {
        return databases.createDocument(
            COMPANY_FILE_DATABASE_ID,
            COMPANY_FILE_COLLECTION_ID,
            ID.unique(),
            companyFile
        );
    },

    async update(id: string, data: CompanyFile) {
        delete  data.$databaseId
        delete  data.$collectionId
        return await databases.updateDocument(COMPANY_FILE_DATABASE_ID, COMPANY_FILE_COLLECTION_ID, id, {...data})
    },

    async remove(id: string) {
        return await databases.deleteDocument(COMPANY_FILE_DATABASE_ID, COMPANY_FILE_COLLECTION_ID, id);
    },

    async removeAll(ids: string[]) {
        for (const id of ids) {
            await this.remove(id)
        }
    },
}


