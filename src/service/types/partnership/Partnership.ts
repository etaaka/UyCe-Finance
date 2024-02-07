import {Contact} from "../contact/Contact";
import {PartnershipDuty} from "./PartnershipDuty";

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
    duty? : PartnershipDuty
    contact : Contact = new Contact()
}

