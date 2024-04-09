import {Contact} from "../contact/Contact";
import {PartnershipDuty} from "./PartnershipDuty";
import { BoardOfDirectorType } from "./BoardOfDirectorType";
import { SeniorManagementType } from "./SeniorManagementType";
import { Education } from "./Education";

export class Partnership {
    $id?: string;
    $createdAt?: string;
    $updatedAt?: string;
    companyId? : string;
    name: string = ""
    surname: string = ""
    tckn?: string
    passport?: string
    shareRatio?: number
    duties : PartnershipDuty[] = []
    education?: Education
    experienceYear?: number
    boardOfDirectorType? : BoardOfDirectorType
    seniorManagementType? : SeniorManagementType
    contact : Contact = new Contact()
}

