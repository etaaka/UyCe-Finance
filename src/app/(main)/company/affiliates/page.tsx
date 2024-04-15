/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { AffiliateService } from '../../../../service/AffiliateService';
import { Affiliate } from '../../../../service/types/affiliate/Affiliate';
import { Slider } from 'primereact/slider';
import { MultiSelect } from 'primereact/multiselect';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputMask } from 'primereact/inputmask';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../../layout/context/usercontext';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'primereact/dropdown';
import { Affiliate } from '../../../../service/types/affiliate/Affiliate';
import { AffiliateType } from '../../../../service/types/affiliate/AffiliateType';
import { CountryService } from '../../../../service/CountryService';
import { Demo } from '../../../../service/types/demo';

const AffiliateCrud = () => {

    let emptyAffiliate: Affiliate = {
        name: '',
        activity: '',
        country: 'TR',
        shareRatio: 0,
        affiliateType: AffiliateType.AFFILIATE
    };

    const [countries, setCountries] = useState<Demo.Country[]>([]);
    const [affiliates, setAffiliates] = useState<Affiliate[]>();
    const [affiliateDialog, setAffiliateDialog] = useState(false);
    const [deleteAffiliateDialog, setDeleteAffiliateDialog] = useState(false);
    const [deleteAffiliatesDialog, setDeleteAffiliatesDialog] = useState(false);
    const [affiliate, setAffiliate] = useState<Affiliate>(emptyAffiliate);
    const [selectedAffiliates, setSelectedAffiliates] = useState<Affiliate[]>();
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Map<string, string>>(new Map());
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const router = useRouter();
    const user = useUser();
    const { t } = useTranslation();

    useEffect(() => {
        if (!user.loadingUser) {
            if (user.company == null) {
                router.push('/companies');
            } else {
                AffiliateService.listByCompanyId(user.company.$id!).then(result => {
                    setAffiliates(result.documents as any);
                });
            }
        }
    }, [user.current, user.loadingUser]);

    useEffect(() => {
        CountryService.getCountries().then((countries) => {
            setCountries(countries);
        });
    }, []);

    const isFormFieldValid = (name: string) => {
        return !!(submitted && errors.get(name));
    };

    const getFormErrorMessage = (name: string) => {
        return isFormFieldValid(name) && <small className='p-error'>{errors.get(name)}</small>;
    };

    const openNew = () => {
        emptyAffiliate.companyId = user.company!.$id;
        setAffiliate(emptyAffiliate);
        setSubmitted(false);
        setAffiliateDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setAffiliateDialog(false);
    };

    const hideDeleteAffiliateDialog = () => {
        setDeleteAffiliateDialog(false);
    };

    const hideDeleteAffiliatesDialog = () => {
        setDeleteAffiliatesDialog(false);
    };

    const validate = () => {
        let errors: Map<string, string> = new Map();

        if (!affiliate.name) {
            errors.set('name', t('name.required'));
        }
        if (!affiliate.activity) {
            errors.set('activity', t('affiliate.activity.required'));
        }
        if (!affiliate.shareRatio) {
            errors.set('shareRatio', t('affiliate.shareRatio.required'));
        }
        if (!affiliate.country) {
            errors.set('country', t('affiliate.country.required'));
        }
        if (!affiliate.affiliateType) {
            errors.set('affiliateType', t('affiliate.affiliateType.required'));
        }
        return errors;
    };

    const saveAffiliate = () => {
        setSubmitted(true);
        let errors = validate();
        setErrors(errors);
        debugger
        if (errors.size == 0) {
            let _affiliates = [...(affiliates as Affiliate[])];
            let _affiliate = { ...affiliate };
            if (affiliate.$id) {
                AffiliateService.update(affiliate.$id, _affiliate as Affiliate).then(r => {
                    let index = findIndexById(affiliate.$id as string);
                    affiliates![index] = _affiliate;
                    toast.current?.show({
                        severity: 'success',
                        summary: t('successful'),
                        detail: t('successful_updated'),
                        life: 3000
                    });
                    setAffiliateDialog(false);
                    setAffiliate(emptyAffiliate);
                }).catch(e => {
                    debugger
                    console.log(e);
                }).finally(() => {
                    setSubmitted(false);
                });
            } else {
                debugger
                AffiliateService.add(_affiliate as Affiliate).then(r => {
                    toast.current?.show({
                        severity: 'success',
                        summary: t('successful'),
                        detail: t('successful_created'),
                        life: 3000
                    });
                    _affiliates.push(r as unknown as Affiliate);
                    setAffiliates(_affiliates);
                    setAffiliateDialog(false);
                    setAffiliate(emptyAffiliate);
                }).catch(e => {
                    debugger
                    console.log(e);
                }).finally(() => {
                    setSubmitted(false);
                });
            }
        }
    };

    const editAffiliate = (affiliate: Affiliate) => {
        setAffiliate({ ...affiliate } as Affiliate);
        setAffiliateDialog(true);
    };

    const confirmDeleteAffiliate = (affiliate: Affiliate) => {
        setAffiliate(affiliate);
        setDeleteAffiliateDialog(true);
    };

    const deleteAffiliate = () => {
        setSubmitted(true);
        let _affiliates = affiliates?.filter((val: Affiliate) => val.$id !== affiliate.$id);
        AffiliateService.remove(affiliate.$id as string).then(r => {
            setAffiliates(_affiliates as Affiliate[]);
            setDeleteAffiliateDialog(false);
            setAffiliate(emptyAffiliate);
            toast.current?.show({
                severity: 'success',
                summary: t('successful'),
                detail: t('successful_deleted'),
                life: 3000
            });
        }).finally(() => {
            setSubmitted(false);
        });
    };

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < affiliates!.length; i++) {
            if (affiliates![i].$id === id) {
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
        setDeleteAffiliatesDialog(true);
    };

    const deleteSelectedAffiliates = () => {
        let _affiliates = affiliates?.filter((val: Affiliate) => !selectedAffiliates?.includes(val));
        setSubmitted(true);
        AffiliateService.removeAll(selectedAffiliates!.map((val: Affiliate) => val.$id!)).then(r => {
            setAffiliates(_affiliates as Affiliate[]);
            setDeleteAffiliatesDialog(false);
            setSelectedAffiliates([]);
            toast.current?.show({
                severity: 'success',
                summary: t('successful'),
                detail: t('successful_deleted'),
                life: 3000
            });
        }).finally(() => {
            setSubmitted(false);
        });
    };

    const onInputChange = (e: any, name: string) => {
        const val = (e.target && e.target.value) || (e.value) || '';
        let _affiliate = { ...affiliate };
        (_affiliate as any)[`${name}`] = val;
        setAffiliate(_affiliate);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className='my-2'>
                    <Button label={t('new')} icon='pi pi-plus' severity='success' className=' mr-2' onClick={openNew} />
                    <Button label={t('delete')} icon='pi pi-trash' severity='danger' className=' mr-2'
                            onClick={confirmDeleteSelected}
                            disabled={!selectedAffiliates || !selectedAffiliates.length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label={t('export')} icon='pi pi-upload' severity='help' onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const nameBodyTemplate = (rowData: Affiliate) => {
        return (
            <>
                <span className='p-column-title'>{t('name')}</span>
                {rowData.name}
            </>
        );
    };
    const activityBodyTemplate = (rowData: Affiliate) => {
        return (
            <>
                <span className='p-column-title'>{t('affiliate.activity')}</span>
                {rowData.activity}
            </>
        );
    };

    const shareRatioBodyTemplate = (rowData: Affiliate) => {
        return (
            <>
                <span className='p-column-title'>{t('affiliate.shareRatio')}</span>
                {rowData.shareRatio}
            </>
        );
    };

    const countryBodyTemplate = (rowData: Affiliate) => {
        return (
            <>
                <span className='p-column-title'>{t('affiliate.country')}</span>
                <Dropdown value={rowData.country} options={countries} disabled={true}
                          readOnly={true} optionLabel='name' optionValue='code' />
            </>
        );
    };

    const typeBodyTemplate = (rowData: Affiliate) => {
        return (
            <>
                <span className='p-column-title'>{t('affiliate.affiliateType')}</span>
                <Dropdown value={rowData.affiliateType} options={AffiliateService.getAffiliateTypes(t)} disabled={true}
                             readOnly={true} optionLabel='name' optionValue='code' />
            </>
        );
    };

    const actionBodyTemplate = (rowData: Affiliate) => {
        return (
            <>
                <Button icon='pi pi-pencil' rounded severity='success' className='mr-2'
                        onClick={() => editAffiliate(rowData)} />
                <Button icon='pi pi-trash' rounded severity='warning'
                        onClick={() => confirmDeleteAffiliate(rowData)} />
            </>
        );
    };

    const header = (
        <div className='flex md:flex-row md:justify-content-between md:align-items-center'>
            <h5 className='m-0'>{t('affiliate.manage')}</h5>
        </div>
    );

    const affiliateDialogFooter = (
        <>
            <Button label={t('cancel')} icon='pi pi-times' text onClick={hideDialog} />
            <Button label={t('save')} icon='pi pi-check' text onClick={saveAffiliate} />
        </>
    );
    const deleteAffiliateDialogFooter = (
        <>
            <Button label={t('no')} icon='pi pi-times' text onClick={hideDeleteAffiliateDialog} />
            <Button label={t('yes')} icon='pi pi-check' text onClick={deleteAffiliate} />
        </>
    );
    const deleteAffiliatesDialogFooter = (
        <>
            <Button label={t('no')} icon='pi pi-times' text onClick={hideDeleteAffiliatesDialog} />
            <Button label={t('yes')} icon='pi pi-check' text onClick={deleteSelectedAffiliates} />
        </>
    );

    function getAffiliateDialog() {
        return <Dialog visible={affiliateDialog} style={{ width: '650px' }} header={t('affiliate.detail')} modal
                       className='p-fluid' footer={affiliateDialogFooter} onHide={hideDialog}>

            <div className='grid p-fluid mt-3'>
                <div className='field col-12 md:col-12'>
                <span className='p-float-label'>
                    <InputText id='name' value={affiliate.name} required onChange={(e) => onInputChange(e, 'name')}
                               className={classNames({ 'p-invalid': isFormFieldValid('name') })} />
                    <label htmlFor='name'
                           className={classNames({ 'p-error': isFormFieldValid('name') })}>{t('name')}*</label>
                </span>
                    {getFormErrorMessage('name')}
                </div>
                <div className='field col-12 md:col-12'>
                <span className='p-float-label'>
                    <InputText id='activity' value={affiliate.activity} required
                               onChange={(e) => onInputChange(e, 'activity')}
                               className={classNames({ 'p-invalid': isFormFieldValid('activity') })} />
                    <label htmlFor='activity'
                           className={classNames({ 'p-error': isFormFieldValid('activity') })}>{t('affiliate.activity')}*</label>
                </span>
                    {getFormErrorMessage('activity')}
                </div>
                <div className='field col-12'>
                <span className='p-float-label'>
                    <InputNumber id='shareRatio' value={affiliate.shareRatio} min={0} max={100} inputMode={'numeric'}
                                 onChange={(e) => onInputChange(e, 'shareRatio')}
                                 className={classNames({ 'p-invalid': isFormFieldValid('shareRatio') })} />
                    <Slider value={affiliate.shareRatio} min={0} max={100}
                            onChange={(e) => onInputChange(e, 'shareRatio')} />
                    <label htmlFor='shareRatio'
                           className={classNames({ 'p-error': isFormFieldValid('shareRatio') })}>{t('affiliate.shareRatio')}*</label>
                </span>
                    {getFormErrorMessage('shareRatio')}
                </div>
                <div className='field col-12'>
                <span className='p-float-label'>
                    <Dropdown id='affiliateType' value={affiliate.affiliateType}
                              options={AffiliateService.getAffiliateTypes(t)}
                              placeholder={t('affiliate.selectAffiliateType')} display='chip'
                              optionLabel='name' optionValue='code'
                              onChange={(e) => onInputChange(e, 'affiliateType')}
                              className={classNames({ 'p-invalid': isFormFieldValid('affiliateType') })} />
                    <label htmlFor='affiliateType'
                           className={classNames({ 'p-error': isFormFieldValid('affiliateType') })}>
                        {t('affiliate.affiliateType')}*
                    </label>
                </span>
                    {getFormErrorMessage('affiliateType')}
                </div>
                <div className='field col-12'>
                <span className='p-float-label'>
                    <Dropdown id='country' value={affiliate.country}
                              options={countries}
                              placeholder={t('affiliate.selectCountry')} display='chip'
                              optionLabel='name' optionValue='code'
                              onChange={(e) => onInputChange(e, 'country')}
                              className={classNames({ 'p-invalid': isFormFieldValid('country') })} />
                    <label htmlFor='country'
                           className={classNames({ 'p-error': isFormFieldValid('country') })}>
                        {t('affiliate.country')}*
                    </label>
                </span>
                    {getFormErrorMessage('country')}
                </div>


            </div>

        </Dialog>;
    }

    return (
        <div className='grid crud-demo'>
            <div className='col-12'>
                <div className='card'>
                    <Toast ref={toast} />
                    <Toolbar className='mb-4' start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={affiliates} selection={selectedAffiliates}
                               onSelectionChange={(e) => setSelectedAffiliates(e.value as any)}
                               dataKey='$id' paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                               className='datatable-responsive'
                               paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
                               currentPageReportTemplate={t('currentPageReportTemplate', { objects: t('affiliate.affiliates') })}
                               globalFilter={globalFilter}
                               emptyMessage={t('dataNotFound', { objects: t('affiliate.affiliates') })}
                               header={header} responsiveLayout='scroll'>
                        <Column selectionMode='multiple' headerStyle={{ width: '4rem' }}/>
                        <Column field='name' header={t('name')} sortable body={nameBodyTemplate}
                                headerStyle={{ minWidth: '15rem' }}/>
                        <Column field='country' header={t('affiliate.country')} sortable body={countryBodyTemplate}
                                headerStyle={{ minWidth: '15rem' }}/>
                        <Column field='activity' header={t('affiliate.activity')} sortable body={activityBodyTemplate}
                                headerStyle={{ minWidth: '15rem' }}/>
                        <Column field='shareRatio' header={t('affiliate.shareRatio')} sortable
                                body={shareRatioBodyTemplate}
                                headerStyle={{ minWidth: '15rem' }}/>
                        <Column field='type' header={t('affiliate.affiliateType')} body={typeBodyTemplate} sortable
                                headerStyle={{ minWidth: '10rem' }}/>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}/>
                    </DataTable>

                    {getAffiliateDialog()}

                    <Dialog visible={deleteAffiliateDialog} style={{ width: '450px' }} header={t('confirm')} modal
                            footer={deleteAffiliateDialogFooter} onHide={hideDeleteAffiliateDialog}>
                        <div className='flex align-items-center justify-content-center'>
                            <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem' }} />
                            {affiliate && (
                                <span>
                                    {t('areSureDelete')} <b>{affiliate.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteAffiliatesDialog} style={{ width: '450px' }} header={t('confirm')} modal
                            footer={deleteAffiliatesDialogFooter} onHide={hideDeleteAffiliatesDialog}>
                        <div className='flex align-items-center justify-content-center'>
                            <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem' }} />
                            {affiliate && <span>{t('affiliate.areSureDelete')}</span>}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    );
};

export default AffiliateCrud;
