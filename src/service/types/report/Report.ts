import {ReportStatus} from "./ReportStatus";
import {ReportType} from "./ReportType";

export class Report {
    $id?: string;
    $createdAt?: string;
    $updatedAt?: string;
    $databaseId?: string;
    $collectionId?: string;

    companyId: string = ''
    status: ReportStatus = ReportStatus.REQUESTED
    type: ReportType= ReportType.COMPANY_ANALYSIS
    assignedUserId? : string
    reportDate?: Date
}