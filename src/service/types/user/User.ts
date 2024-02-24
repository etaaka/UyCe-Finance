import {Contact} from "../contact/Contact";
import { Language } from "./Language";

export class User {
    $id?: string;
    $databaseId?: string;
    $collectionId?: string;
    $createdAt?: string;
    $updatedAt?: string;
    name: string= '';
    surname: string= '';
    status: boolean = true;
    language: Language = Language.TR;
    contact : Contact = new Contact()
}