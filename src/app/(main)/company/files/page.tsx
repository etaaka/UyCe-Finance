/* eslint-disable @next/next/no-img-element */
'use client';
import {Button} from 'primereact/button';
import {Column} from 'primereact/column';
import {DataTable} from 'primereact/datatable';
import {Dialog} from 'primereact/dialog';
import {InputText} from 'primereact/inputtext';
import {Toast} from 'primereact/toast';
import {Toolbar} from 'primereact/toolbar';
import {classNames} from 'primereact/utils';
import React, {useEffect, useRef, useState} from 'react';
import {useRouter} from "next/navigation";
import {useUser} from "../../../../layout/context/usercontext";
import {useTranslation} from "react-i18next";
import {CompanyFile} from "../../../../service/types/file/CompanyFile";
import {CompanyFileType} from "../../../../service/types/file/CompanyFileType";
import {Dropdown} from "primereact/dropdown";
import {COMPANY_FILE_BUCKET, CompanyFileService} from '../../../../service/CompanyFileService';
import {StorageService} from "../../../../service/StorageService";
import {FileUpload, FileUploadSelectEvent} from "primereact/fileupload";

const FileCrud = () => {

    let emptyCompanyFile: CompanyFile = {
        name: "",
        fileType: CompanyFileType.DEPOSIT
    }

    const [companyFiles, setCompanyFiles] = useState<CompanyFile[]>();
    const [companyFileDialog, setCompanyFileDialog] = useState(false);
    const [deleteCompanyFileDialog, setDeleteCompanyFileDialog] = useState(false);
    const [deleteCompanyFilesDialog, setDeleteCompanyFilesDialog] = useState(false);
    const [companyFile, setCompanyFile] = useState<CompanyFile>(emptyCompanyFile);
    const [file, setFile] = useState<File>();
    const [fileUrl, setFileUrl] = useState<string>();
    const [selectedCompanyFiles, setSelectedCompanyFiles] = useState<CompanyFile[]>();
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Map<string, string>>(new Map());
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const router = useRouter();
    const user = useUser();
    const {t} = useTranslation();

    useEffect(() => {
        if (!user.loadingUser) {
            if (user.company == null) {
                router.push('/companies')
            } else {
                CompanyFileService.listByCompanyId(user.company.$id!).then(result => {
                    setCompanyFiles(result.documents as any)
                })
            }
        }
    }, [user.current, user.loadingUser]);

    const isFormFieldValid = (name: string) => {
        return !!(submitted && errors.get(name));
    }

    const getFormErrorMessage = (name: string) => {
        return isFormFieldValid(name) && <small className="p-error">{errors.get(name)}</small>;
    };

    const openNew = () => {
        emptyCompanyFile.companyId = user.company!.$id
        setCompanyFile(emptyCompanyFile);
        setFile(undefined)
        setFileUrl(undefined)
        setSubmitted(false);
        setCompanyFileDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCompanyFileDialog(false);
    };

    const hideDeleteCompanyFileDialog = () => {
        setDeleteCompanyFileDialog(false);
    };

    const hideDeleteCompanyFilesDialog = () => {
        setDeleteCompanyFilesDialog(false);
    };

    const validate = () => {
        let errors: Map<string, string> = new Map()

        if (!file && !fileUrl) {
            errors.set("file", t('company.file.required'))
        }
        if (!companyFile.name) {
            errors.set("name", t('company.file.name.required'))
        }
        if (!companyFile.fileType) {
            errors.set("fileType", t('company.file.type.required'))
        }
        return errors;
    }

    const saveCompanyFile = () => {
        setSubmitted(true);
        let errors = validate()
        setErrors(errors)
        debugger
        if (errors.size == 0) {
            let _companyFiles = [...(companyFiles as CompanyFile[])];
            let _companyFile = {...companyFile};
            if (companyFile.$id) {
                CompanyFileService.update(companyFile.$id, _companyFile as CompanyFile).then(r => {
                    let index = findIndexById(companyFile.$id as string);
                    companyFiles![index] = _companyFile;
                    toast.current?.show({severity: 'success', summary: t('successful'), detail: t('successful_updated'), life: 3000})
                    setCompanyFileDialog(false);
                    setCompanyFile(emptyCompanyFile);
                }).catch(e => {
                    debugger
                    console.log(e)
                })
            } else {
                CompanyFileService.add(_companyFile as CompanyFile).then(r => {
                    toast.current?.show({severity: 'success', summary: t('successful'), detail: t('successful_created'), life: 3000});
                    _companyFiles.push(r as unknown as CompanyFile);
                    setCompanyFiles(_companyFiles)
                    StorageService.add(file!, COMPANY_FILE_BUCKET, r.$id).then(fileResult => {
                        setCompanyFileDialog(false);
                        setCompanyFile(emptyCompanyFile);
                        setFile(undefined)
                        toast.current?.show({severity: 'success', summary: t('successful'), detail: t('successful_updated'), life: 3000})
                    })
                }).catch(e => {
                    debugger
                    console.log(e)
                })
            }
        }
    };

    const editCompanyFile = (companyFile: CompanyFile) => {

        setCompanyFile({...companyFile} as CompanyFile);
        let url = StorageService.getResourceUrl(companyFile.$id!, COMPANY_FILE_BUCKET)
        setFileUrl(url.href)
        setCompanyFileDialog(true);
    };

    const confirmDeleteCompanyFile = (companyFile: CompanyFile) => {
        setCompanyFile(companyFile);
        setDeleteCompanyFileDialog(true);
    };

    const deleteCompanyFile = () => {
        let _companyFiles = companyFiles?.filter((val: CompanyFile) => val.$id !== companyFile.$id);
        CompanyFileService.remove(companyFile.$id as string).then(r => {
            setCompanyFiles(_companyFiles as CompanyFile[]);
            setDeleteCompanyFileDialog(false);
            setCompanyFile(emptyCompanyFile);
            setFile(undefined)
            toast.current?.show({severity: 'success', summary: t('successful'), detail: t('successful_deleted'), life: 3000});
        })
    };

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < companyFiles!.length; i++) {
            if (companyFiles![i].$id === id) {
                index = i;
                break;
            }
        }
        return index;
    };


    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const downloadFile = () => {
        return StorageService.getResourceUrl(companyFile.$id!, COMPANY_FILE_BUCKET)
    };

    const confirmDeleteSelected = () => {
        setDeleteCompanyFilesDialog(true);
    };

    const deleteSelectedCompanyFiles = () => {
        let _companyFiles = companyFiles?.filter((val: CompanyFile) => !selectedCompanyFiles?.includes(val));

        CompanyFileService.removeAll(selectedCompanyFiles!.map((val: CompanyFile) => val.$id!)).then(r => {
            setCompanyFiles(_companyFiles as CompanyFile[])
            setDeleteCompanyFilesDialog(false);
            setSelectedCompanyFiles([]);
            toast.current?.show({severity: 'success', summary: t('successful'), detail: t('successful_deleted'), life: 3000});
        })
    };

    const onInputChange = (e: any, name: string) => {
        const val = (e.target && e.target.value) || (e.value) || '';
        let _companyFile = {...companyFile};
        (_companyFile as any)[`${name}`] = val;
        setCompanyFile(_companyFile);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label={t('new')} icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew}/>
                    <Button label={t('delete')} icon="pi pi-trash" severity="danger" className=" mr-2"
                            onClick={confirmDeleteSelected}
                            disabled={!selectedCompanyFiles || !selectedCompanyFiles.length}/>
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label={t('export')} icon="pi pi-upload" severity="help" onClick={exportCSV}/>
            </React.Fragment>
        );
    };

    const onSelect = async (e: FileUploadSelectEvent) => {
        setSubmitted(true)
        if (e.files && e.files[0]) {
            setFile(e.files[0])
        }
    }

    const nameBodyTemplate = (rowData: CompanyFile) => {
        return (
            <>
                <span className="p-column-title">{t('name')}</span>
                {rowData.name}
            </>
        );
    };

    const typeBodyTemplate = (rowData: CompanyFile) => {
        return (
            <>
                <span className="p-column-title">{t('company.file.type')}</span>
                {t('CompanyFileType.'+ rowData.fileType)}
            </>
        );
    };

    const actionBodyTemplate = (rowData: CompanyFile) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2"
                        onClick={() => editCompanyFile(rowData)}/>
                <Button icon="pi pi-trash" rounded severity="warning"
                        onClick={() => confirmDeleteCompanyFile(rowData)}/>
            </>
        );
    };

    const header = (
        <div className="flex md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">{t('company.file.manage')}</h5>
        </div>
    );

    const companyFileDialogFooter = (
        <>
            <Button label={t('cancel')} icon="pi pi-times" text onClick={hideDialog}/>
            <Button label={t('save')} icon="pi pi-check" text onClick={saveCompanyFile}/>
        </>
    );
    const deleteCompanyFileDialogFooter = (
        <>
            <Button label={t('no')} icon="pi pi-times" text onClick={hideDeleteCompanyFileDialog}/>
            <Button label={t('yes')} icon="pi pi-check" text onClick={deleteCompanyFile}/>
        </>
    );
    const deleteCompanyFilesDialogFooter = (
        <>
            <Button label={t('no')} icon="pi pi-times" text onClick={hideDeleteCompanyFilesDialog}/>
            <Button label={t('yes')} icon="pi pi-check" text onClick={deleteSelectedCompanyFiles}/>
        </>
    );

    function getCompanyFileDialog() {
        return <Dialog visible={companyFileDialog} style={{width: '650px'}} header={t('company.file.detail')} modal
                       className="p-fluid" footer={companyFileDialogFooter} onHide={hideDialog}>

            <div className="grid p-fluid mt-3">
                <div className="field col-12">
                <span className="p-float-label">
                    <Dropdown id="fileType" value={companyFile.fileType} options={CompanyFileService.getTypes(t)}
                              placeholder={t('company.file.type.select')} optionLabel="name" optionValue="code"
                              onChange={(e) => onInputChange(e, 'fileType')}
                              className={classNames({'p-invalid': isFormFieldValid('fileType')})}/>
                    <label htmlFor="fileType" className={classNames({'p-error': isFormFieldValid('fileType')})}>
                        {t('company.file.type')}*
                    </label>
                </span>
                    {getFormErrorMessage('type')}
                </div>

                <div className="field col-12">
                    <span className="p-float-label">
                        <InputText id="name" value={companyFile.name} required
                                   onChange={(e) => onInputChange(e, 'name')}
                                   className={classNames({'p-invalid': isFormFieldValid('name')})}/>
                        <label htmlFor="name"
                               className={classNames({'p-error': isFormFieldValid('name')})}>{t('name')}*</label>
                    </span>
                    {getFormErrorMessage('name')}
                </div>

                {fileUrl ? (
                    <div className="field col-12 md:col-3">
                        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="p-button font-bold">
                            {t('company.file.download')}
                        </a>
                    </div>
                ) : (
                    <div className="field col-12 md:col-6">
                        <FileUpload mode="basic" accept="pdf" maxFileSize={10000000} chooseLabel={t('company.file.import')}
                                    className="mr-2 inline-block" onSelect={onSelect} disabled={file != null}/>

                        {getFormErrorMessage('file')}
                    </div>
                )}

            </div>

        </Dialog>;
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast}/>
                    <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={companyFiles} selection={selectedCompanyFiles}
                               onSelectionChange={(e) => setSelectedCompanyFiles(e.value as any)}
                               dataKey="$id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                               className="datatable-responsive"
                               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                               currentPageReportTemplate={t('currentPageReportTemplate', {objects: t('company.file.files')})}
                               globalFilter={globalFilter}
                               emptyMessage={t('dataNotFound', {objects: t('company.file.files')})}
                               header={header} responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{width: '4rem'}}></Column>
                        <Column field="name" header={t('name')} sortable body={nameBodyTemplate}
                                headerStyle={{minWidth: '15rem'}}></Column>
                        <Column field="fileType" header={t('company.file.type')} body={typeBodyTemplate} sortable
                                headerStyle={{minWidth: '10rem'}}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{minWidth: '10rem'}}></Column>
                    </DataTable>

                    {getCompanyFileDialog()}

                    <Dialog visible={deleteCompanyFileDialog} style={{width: '450px'}} header={t('confirm')} modal
                            footer={deleteCompanyFileDialogFooter} onHide={hideDeleteCompanyFileDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                            {companyFile && (
                                <span>
                                    {t('areSureDelete')} <b>{companyFile.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteCompanyFilesDialog} style={{width: '450px'}} header={t('confirm')} modal
                            footer={deleteCompanyFilesDialogFooter} onHide={hideDeleteCompanyFilesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                            {companyFile && <span>{t('companyFile.areSureDelete')}</span>}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    );
};

export default FileCrud;
