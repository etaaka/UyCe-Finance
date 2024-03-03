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
import {Report} from "../../../service/types/report/Report";
import {FileUpload, FileUploadSelectEvent} from "primereact/fileupload";
import {useUser} from "../../../layout/context/usercontext";
import {useTranslation} from "react-i18next";
import {Dropdown} from "primereact/dropdown";
import {ReportStatus} from "../../../service/types/report/ReportStatus";
import {ReportType} from "../../../service/types/report/ReportType";
import {REPORT_BUCKET, ReportService} from '../../../service/ReportService';
import {useRouter} from "next/navigation";
import {StorageService} from "../../../service/StorageService";
import {COMPANY_FILE_BUCKET} from "../../../service/CompanyFileService";
import {Calendar} from "primereact/calendar";

const ReportCrud = () => {

    let emptyReport: Report = {
        type: ReportType.COMPANY_ANALYSIS,
        companyId: "",
        status: ReportStatus.REQUESTED
    };

    const [reports, setReports] = useState<Report[]>();
    const [fileUrl, setFileUrl] = useState<string>();
    const [admin, setAdmin] = useState<boolean>(false);
    const [file, setFile] = useState<File>();
    const [reportDialog, setReportDialog] = useState(false);
    const [deleteReportDialog, setDeleteReportDialog] = useState(false);
    const [deleteReportsDialog, setDeleteReportsDialog] = useState(false);
    const [report, setReport] = useState<Report>(emptyReport);
    const [selectedReports, setSelectedReports] = useState<Report[]>();
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Map<string, string>>(new Map());
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const user = useUser();
    const {t} = useTranslation();
    const router = useRouter();

    useEffect(() => {
        if (!user.loadingUser && user.current != null) {
            if (user.company == null) {
                router.push('/companies')
            } else {
                ReportService.listByCompanyId(user.company.$id!).then(result => {
                    setReports(result.documents as any)
                })
                setAdmin((user.current as any).labels.includes("admin"))
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
        emptyReport.companyId = user.company!.$id!
        setReport(emptyReport);
        setFile(undefined)
        setFileUrl(undefined)
        setSubmitted(false);
        setReportDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setReportDialog(false);
    };

    const hideDeleteReportDialog = () => {
        setDeleteReportDialog(false);
    };

    const hideDeleteReportsDialog = () => {
        setDeleteReportsDialog(false);
    };

    const onSelect = async (e: FileUploadSelectEvent) => {
        setSubmitted(true)
        if (e.files && e.files[0]) {
            setFile(e.files[0])
        }
    }

    const validate = () => {
        let errors: Map<string, string> = new Map()

        if (!report.type) {
            errors.set("type", t('report.type.required'))
        }
        if (!report.status) {
            errors.set("status", t('report.status.required'))
        }

        return errors;
    };

    const saveReport = () => {
        setSubmitted(true);
        let errors = validate()
        setErrors(errors)
        if (errors.size == 0) {
            let _reports = [...(reports as Report[])];
            let _report = {...report};
            if (report.$id) {
                ReportService.update(report.$id, _report).then(r => {
                    let index = findIndexById(report.$id as string);
                    _reports[index] = _report;
                    if(file){
                        StorageService.add(file, REPORT_BUCKET, r.$id).then(fileResult => {
                            setFile(undefined)
                            toast.current?.show({severity: 'success', summary: t('successful'), detail: t('successful_updated'), life: 3000})
                        })
                    }else {
                        toast.current?.show({severity: 'success', summary: t('successful'), detail: t('successful_updated'), life: 3000})
                    }
                    setReports(_reports as any);
                    setReport(emptyReport);
                    setReportDialog(false);
                }).finally(() => {
                    setSubmitted(false)
                })
            } else {
                ReportService.add(_report).then(r => {
                    _reports.push(r as any);
                    toast.current?.show({severity: 'success', summary: t('successful'), detail: t('successful_created'), life: 3000});
                    setReports(_reports as any);
                    setReportDialog(false);
                    setReport(emptyReport);
                }).catch(e => {
                    debugger
                    console.log(e)
                }).finally(() => {
                    setSubmitted(false)
                })
            }
        }
    };

    const editReport = (report: Report) => {
        setReport({...report} as Report);
        let url = StorageService.getResourceUrl(report.$id!, COMPANY_FILE_BUCKET)
        setFileUrl(url.href)
        setReportDialog(true);
    };

    const confirmDeleteReport = (report: Report) => {
        setReport(report);
        setDeleteReportDialog(true);
    };

    const deleteReport = () => {
        let _reports = (reports as any)?.filter((val: any) => val.$id !== report.$id);
        setSubmitted(true)
        ReportService.remove(report.$id as string).then(r => {
            setReports(_reports);
            toast.current?.show({severity: 'success', summary: t('successful'), detail: t('successful_deleted'), life: 3000});
            setDeleteReportDialog(false);
            setReport(emptyReport);
        }).finally(() => {
            setSubmitted(false)
        })
    };

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (reports as any)?.length; i++) {
            if ((reports as any)[i].$id === id) {
                index = i;
                break;
            }
        }
        return index;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteReportsDialog(true);
    };

    const deleteSelectedReports = () => {
        let _reports = (reports as any)?.filter((val: any) => !(selectedReports as Report[])?.includes(val));
        setSubmitted(true)
        ReportService.removeAll((selectedReports as Report[]).map((val: any) => val.$id)).then(r => {
            setReports(_reports);
            setDeleteReportsDialog(false);
            setSelectedReports([]);
            toast.current?.show({severity: 'success', summary: t('successful'), detail: t('successful_deleted'), life: 3000});
        }).finally(() => {
            setSubmitted(false)
        })
    };

    const onInputChange = (e: any, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _report = {...report};
        (_report as any)[`${name}`] = val;
        setReport(_report);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label={t('new')} icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew}/>
                    <Button label={t('delete')} icon="pi pi-trash" severity="danger" className=" mr-2"
                            onClick={confirmDeleteSelected}
                            disabled={!selectedReports || !(selectedReports as any).length}/>
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
    const dateBodyTemplate = (rowData: Report) => {
        return (
            <>
                <span className="p-column-title">{t('report.date')}</span>
                {rowData.reportDate}
            </>
        );
    };
    const createDateBodyTemplate = (rowData: Report) => {
        return (
            <>
                <span className="p-column-title">{t('report.create.date')}</span>
                {rowData.$createdAt}
            </>
        );
    };

    const typeBodyTemplate = (rowData: Report) => {
        return (
            <>
                <span className="p-column-title">{t('report.type')}</span>
                {t('ReportType.'+ rowData.type)}
            </>
        );
    };

    const statusBodyTemplate = (rowData: Report) => {
        return (
            <>
                <span className="p-column-title">{t('report.status')}</span>
                {t('ReportStatus.'+ rowData.status)}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Report) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2"
                        onClick={() => editReport(rowData)}/>
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteReport(rowData)}/>
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">{t('report.manage')}</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search"/>
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                           placeholder={t('search' )+ '...'}/>
            </span>
        </div>
    );

    const reportDialogFooter = (
        <>
            <Button label={t('cancel')} icon="pi pi-times" text onClick={hideDialog}/>
            <Button label={t('save')} icon="pi pi-check" text onClick={saveReport}/>
        </>
    );
    const deleteReportDialogFooter = (
        <>
            <Button label={t('no')} icon="pi pi-times" text onClick={hideDeleteReportDialog} disabled={submitted}/>
            <Button label={t('yes')} icon="pi pi-check" text onClick={deleteReport} disabled={submitted}/>
        </>
    );
    const deleteReportsDialogFooter = (
        <>
            <Button label={t('no')} icon="pi pi-times" text onClick={hideDeleteReportsDialog} disabled={submitted}/>
            <Button label={t('yes')} icon="pi pi-check" text onClick={deleteSelectedReports} disabled={submitted}/>
        </>
    );

    function getReportDialog() {
        return <Dialog visible={reportDialog} style={{width: '650px'}} header={t('report.details')} modal
                       className="p-fluid" footer={reportDialogFooter} onHide={hideDialog}>
            <div className="grid p-fluid mt-3">
                <div className="field col-12">
                <span className="p-float-label">
                    <Dropdown id="reportType" value={report.type} options={ReportService.getTypes(t)}
                              placeholder={t('report.type.select')} optionLabel="name" optionValue="code"
                              onChange={(e) => onInputChange(e, 'reportType')}
                              className={classNames({'p-invalid': isFormFieldValid('reportType')})}/>
                    <label htmlFor="fileType" className={classNames({'p-error': isFormFieldValid('reportType')})}>
                        {t('report.type')}*
                    </label>
                </span>
                    {getFormErrorMessage('type')}
                </div>
                { fileUrl? (
                    <div className="field col-12 md:col-3">
                        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="p-button font-bold">
                            {t('report.download')}
                        </a>
                    </div>
                ) : <></>}

                { admin ? (
                    <>
                    <div className="field col-12">
                        <span className="p-float-label">
                            <Dropdown id="status" value={report.status} options={ReportService.getStatus(t)}
                                      disabled={!admin}
                                      placeholder={t('report.status.select')} optionLabel="name" optionValue="code"
                                      onChange={(e) => onInputChange(e, 'status')}
                                      className={classNames({'p-invalid': isFormFieldValid('status')})}/>
                            <label htmlFor="status" className={classNames({'p-error': isFormFieldValid('status')})}>
                                {t('report.status')}*
                            </label>
                        </span>
                        {getFormErrorMessage('type')}
                    </div>

                    <div className="field col-12 md:col-6">
                        <span className="p-float-label">
                            <Calendar inputId="reportDate" value={report.reportDate}
                                      onChange={(e) => onInputChange(e, 'reportDate')}
                                      className={classNames({'p-error': isFormFieldValid('reportDate')})}/>
                            <label htmlFor="reportDate"
                                   className={classNames({'p-error': isFormFieldValid('reportDate')})}>{t('report.date')}*</label>
                        </span>
                        {getFormErrorMessage('reportDate')}
                    </div>
                    <div className="field col-12 md:col-6">
                        <FileUpload mode="basic" accept="pdf" maxFileSize={1000000} chooseLabel={t('report.import')}
                                    className="mr-2 inline-block" onSelect={onSelect} disabled={file != null}/>

                        {getFormErrorMessage('file')}
                    </div>
                    </>
                    ) : <></>}

            </div>
        </Dialog>;
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast}/>
                    <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
                    <DataTable
                        ref={dt}
                        value={reports}
                        selection={selectedReports}
                        onSelectionChange={(e) => setSelectedReports(e.value as any)}
                        dataKey="$id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate={t('currentPageReportTemplate', {objects: t('report.reports')})}
                        globalFilter={globalFilter}
                        emptyMessage={t('dataNotFound', {objects: t('report.reports')})}
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{width: '4rem'}}></Column>
                        <Column field="createDate" header={t('report.create.date')} sortable body={createDateBodyTemplate} headerStyle={{minWidth: '15rem'}}/>
                        <Column field="reportDate" header={t('report.date')} sortable body={dateBodyTemplate} headerStyle={{minWidth: '15rem'}}/>
                        <Column field="type" header={t('report.type')} sortable body={typeBodyTemplate} headerStyle={{minWidth: '10rem'}}/>
                        <Column field="status" header={t('report.status')} sortable body={statusBodyTemplate} headerStyle={{minWidth: '10rem'}}/>
                        <Column body={actionBodyTemplate} headerStyle={{minWidth: '10rem'}}/>
                    </DataTable>

                    {getReportDialog()}

                    <Dialog visible={deleteReportDialog} style={{width: '450px'}} header={t('confirm')} modal
                            footer={deleteReportDialogFooter} onHide={hideDeleteReportDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                            {report && (
                                <span>{t('areSureDelete')} <b>{report.type}</b>?</span>
                            )}
                        </div>
                    </Dialog>


                    <Dialog visible={deleteReportsDialog} style={{width: '450px'}} header={t('confirm')} modal
                            footer={deleteReportsDialogFooter} onHide={hideDeleteReportsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                            {report && (
                                <span>{t('report.areSureDelete')}</span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteReportsDialog} style={{width: '450px'}} header={t('confirm')} modal
                            footer={deleteReportsDialogFooter} onHide={hideDeleteReportsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                            {report && (
                                <span>{t('report.areSureDelete')}</span>
                            )}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    );
};

export default ReportCrud;
