import {CompanyFileType} from "./CompanyFileType";

export class CompanyFile {
    $id?: string;
    $createdAt?: string;
    $updatedAt?: string;
    $databaseId?: string;
    $collectionId?: string;
    companyId? : string;

    name: string = ''
    fileType: CompanyFileType = CompanyFileType.DEPOSIT
}