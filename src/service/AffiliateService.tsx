import {databases} from "./appwrite";
import {ID, Query} from "appwrite";
import {Partnership} from "./types/partnership/Partnership";
import {PartnershipDuty} from "./types/partnership/PartnershipDuty";
import {useTranslation} from "react-i18next";
import { SeniorManagementType } from './types/partnership/SeniorManagementType';
import { Education } from './types/partnership/Education';
import { BoardOfDirectorType } from './types/partnership/BoardOfDirectorType';
import { Affiliate } from './types/affiliate/Affiliate';
import { AffiliateType } from './types/affiliate/AffiliateType';

export const AFFILIATE_DATABASE_ID = "654769c9344dffc7dd50";
export const AFFILIATE_COLLECTION_ID = "661657b703f24c8cf1e9";

export const AffiliateService = {
    getAffiliateTypes(t: any) {
        let list = []
        for (let affiliateType in AffiliateType) {
            list.push({ name: t('AffiliateType.' + affiliateType), code: affiliateType })
        }
        return list
    },
    async list(queries: string[] = []) {
        queries.push(Query.orderDesc("$createdAt"), Query.limit(10))
        return await databases.listDocuments(
            AFFILIATE_DATABASE_ID,
            AFFILIATE_COLLECTION_ID,
            queries
        );
    },

    async listByCompanyId(companyId: string, queries: string[] = []) {
        queries.push(Query.equal("companyId", companyId))
        return await databases.listDocuments(
            AFFILIATE_DATABASE_ID,
            AFFILIATE_COLLECTION_ID,
            queries
        );
    },

    async add(financial: Partnership) {
        return await databases.createDocument(
            AFFILIATE_DATABASE_ID,
            AFFILIATE_COLLECTION_ID,
            ID.unique(),
            financial
        );
    },

    async update(id: string, data: Affiliate) {
        return await databases.updateDocument(AFFILIATE_DATABASE_ID, AFFILIATE_COLLECTION_ID, id, {...data})
    },

    async remove(id: string) {
        return await databases.deleteDocument(AFFILIATE_DATABASE_ID, AFFILIATE_COLLECTION_ID, id);
    },

    async removeAll(ids: string[]) {
        for (const id of ids) {
            await this.remove(id)
        }
    },
}


