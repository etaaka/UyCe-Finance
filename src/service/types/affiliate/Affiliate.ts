import { AffiliateType } from "./AffiliateType";

export class Affiliate {
    $id?: string;
    $createdAt?: string;
    $updatedAt?: string;
    companyId? : string;
    name: string = ""
    country: string
    activity: string
    shareRatio: number
    affiliateType : AffiliateType
}

