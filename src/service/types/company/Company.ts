import {Contact} from "../contact/Contact";
import {BookkeepingFormat} from "./BookkeepingFormat";
import {InvestmentStatus} from "./InvestmentStatus";
import {Sector} from "./Sector";

export class Company {
    $id?: string;
    $databaseId?: string;
    $collectionId?: string;
    $createdAt?: string;
    $updatedAt?: string;
    name: string= '';
    establishmentDate?: Date
    taxNo : string = ''
    taxAdministration? : string = ''
    sector? : Sector= Sector.A
    tradeRegisterNo?: string= ''
    bookkeepingFormat : BookkeepingFormat = BookkeepingFormat.VUK
    investmentStatus : InvestmentStatus = InvestmentStatus.NO_INVESTMENT
    turnover : number = 0
    employeeNumber : number = 0

    userId?: string;
    contact: Contact = new Contact();
}