import {databases, storage} from "./appwrite";
import {ID, Query} from "appwrite";
import {CompanyFile} from "./types/file/CompanyFile";
import {CompanyFileType} from "./types/file/CompanyFileType";
import {remove} from "immutable";


export const StorageService = {

    async get(id: string, bucket : string) {
        return await storage.getFile(
            bucket,
            id
        );
    },

    getResourceUrl(id: string, bucket : string) {
        return storage.getFileDownload(
            bucket,
            id
        );
    },

    async add(file: File,bucket : string, fileId: string = ID.unique()) {
        return await storage.createFile(
            bucket,
            fileId,
            file
        );

    },

    async update(id: string, file: File, bucket : string) {
        await StorageService.remove(id, bucket)
        return await StorageService.add(file, id)
    },

    async remove(id: string, bucket : string) {
        return await storage.deleteFile(
            bucket,
            id
        );
    },

}


