/* eslint-disable @next/next/no-img-element */
'use client';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {Toast} from 'primereact/toast';
import {classNames} from 'primereact/utils';
import React, {useEffect, useRef, useState} from 'react';
import {CompanyService} from '../../../service/CompanyService';
import {Company} from "../../../service/types/company/Company";
import {Contact} from "../../../service/types/contact/Contact";
import {Calendar} from "primereact/calendar";
import {InputTextarea} from "primereact/inputtextarea";
import {InputMask} from "primereact/inputmask";
import {useUser} from "../../../layout/context/usercontext";
import {useTranslation} from "react-i18next";
import {useRouter} from "next/navigation";
import {Dropdown} from "primereact/dropdown";
import {InputNumber} from "primereact/inputnumber";
import {BookkeepingFormat} from "../../../service/types/company/BookkeepingFormat";
import {InvestmentStatus} from "../../../service/types/company/InvestmentStatus";
import {Sector} from "../../../service/types/company/Sector";

const CompanyComponent = () => {

    let emptyCompany: Company = {
        bookkeepingFormat: BookkeepingFormat.VUK,
        employeeNumber: 0,
        investmentStatus: InvestmentStatus.NO_INVESTMENT,
        sector: Sector.A,
        taxNo: "",
        tradeRegisterNo: "",
        turnover: 0,
        contact: new Contact(),
        name: ''
    };

    const [company, setCompany] = useState<Company>(emptyCompany);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Map<string, string>>(new Map());
    const toast = useRef<Toast>(null);
    const user = useUser();
    const router = useRouter();
    const {t} = useTranslation();

    useEffect(() => {
        if (!user.loadingUser) {
            if (user.company == null) {
                router.push('/companies')
            } else {
                CompanyService.get(user.company.$id!).then(c => {
                    let company1 = c as any
                    if(company1.contact == null){
                        company1.contact = new Contact()
                    }
                    setCompany({...company1});
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

    const saveCompany = () => {
        setSubmitted(true);
        let errors = validate()
        setErrors(errors)
        if (errors.size == 0) {
            let _company = {...company};
            if (company.$id) {
                CompanyService.update(company.$id, _company).then(r => {
                    toast.current?.show({severity: 'success', summary: t('successful'), detail: t('successful_updated'), life: 3000})
                }).catch(e => {
                    debugger
                    console.log(e)
                }).finally(() => {
                    setSubmitted(false)
                })
            } else {
                CompanyService.add(_company).then(r => {
                    toast.current?.show({severity: 'success', summary: t('successful'), detail: t('successful_created'), life: 3000});
                }).catch(e => {
                    debugger
                    console.log(e)
                }).finally(() => {
                    setSubmitted(false)
                })
            }
        }
    };

    const validate = () => {
        let errors: Map<string, string> = new Map()

        if (!company.name) {
            errors.set("name", t('name.required'))
        }
        if (!company.taxNo) {
            errors.set("taxNo", t('company.taxNo.required'))
        }
        if (!company.taxAdministration) {
            errors.set("taxAdministration", t('company.taxAdministration.required'))
        }
        if (!company.establishmentDate) {
            errors.set("establishmentDate", t('company.establishmentDate.required'))
        }
        if (!company.bookkeepingFormat) {
            errors.set("bookkeepingFormat", t('company.bookkeepingFormat.required'))
        }
        if (!company.investmentStatus) {
            errors.set("investmentStatus", t('company.investmentStatus.required'))
        }
        if (!company.turnover) {
            errors.set("turnover", t('company.turnover.required'))
        }
        if (!company.sector) {
            errors.set("sector", t('company.sector.required'))
        }
        if (!company.employeeNumber) {
            errors.set("employeeNumber", t('company.employeeNumber.required'))
        }

        if (!company.contact.email) {
            errors.set("email", t('email.required'))
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(company.contact.email)) {
            errors.set("email", t('email.invalid'))
        }
        return errors;
    };

    const onInputChange = (e: any, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _company = {...company};
        (_company as any)[`${name}`] = val;
        setCompany(_company);
    };
    const onContactInputChange = (e: any, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _company = {...company};
        (_company.contact as any)[`${name}`] = val;
        setCompany(_company);
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast}/>
                    <div className="grid p-fluid mt-3">

                        <div className="field col-12">
                            <span className="p-float-label">
                                <InputText id="name" value={company.name || ""} required 
                                           onChange={(e) => onInputChange(e, 'name')}
                                           className={classNames({'p-invalid': isFormFieldValid('name')})}/>
                                <label htmlFor="name"
                                       className={classNames({'p-error': isFormFieldValid('name')})}>{t('name')}*</label>
                            </span>
                            {getFormErrorMessage('name')}
                        </div>
                        <div className="field col-12 md:col-6">
                            <span className="p-float-label">
                                <Calendar inputId="establishmentDate" value={company.establishmentDate} required
                                          onChange={(e) => onInputChange(e, 'establishmentDate')}
                                          className={classNames({'p-error': isFormFieldValid('establishmentDate')})}/>
                                <label htmlFor="establishmentDate"
                                       className={classNames({'p-error': isFormFieldValid('establishmentDate')})}>{t('company.establishmentDate')}*</label>
                            </span>
                            {getFormErrorMessage('establishmentDate')}
                        </div>
                        <div className="field col-12 md:col-6">
                            <span className="p-float-label">
                                <InputText id="tradeRegisterNo" value={company.tradeRegisterNo || ""} 
                                           onChange={(e) => onInputChange(e, 'tradeRegisterNo')}/>
                                <label htmlFor="tradeRegisterNo"
                                       className={classNames({'p-error': isFormFieldValid('tradeRegisterNo')})}>{t('company.tradeRegisterNo')}</label>
                            </span>
                        </div>

                        <div className="field col-12 md:col-6">
                            <span className="p-float-label ">
                                <InputText id="taxAdministration" value={company.taxAdministration || ""} required 
                                           onChange={(e) => onInputChange(e, 'taxAdministration')}
                                           className={classNames({'p-error': isFormFieldValid('taxAdministration')})}/>
                                <label htmlFor="taxAdministration"
                                       className={classNames({'p-error': isFormFieldValid('taxAdministration')})}>{t('company.taxAdministration')}*</label>
                            </span>
                            {getFormErrorMessage('taxAdministration')}
                        </div>

                        <div className="field col-12 md:col-6">
                            <span className="p-float-label">
                                <InputText id="taxNo" value={company.taxNo || ""} required 
                                           onChange={(e) => onInputChange(e, 'taxNo')}
                                           className={classNames({'p-error': isFormFieldValid('taxNo')})}/>
                                <label htmlFor="taxNo"
                                       className={classNames({'p-error': isFormFieldValid('taxNo')})}>{t('company.taxNo')}*</label>
                            </span>
                            {getFormErrorMessage('taxNo')}
                        </div>

                        <div className="field col-12 md:col-6">
                            <span className="p-float-label ">
                                <Dropdown id="sector" value={company.sector} options={CompanyService.getSectors(t)}
                                          placeholder={t('company.sector.select')} optionLabel="name" optionValue="code"
                                          onChange={(e) => onInputChange(e, 'sector')}
                                          className={classNames({'p-invalid': isFormFieldValid('sector')})}/>
                                <label htmlFor="sector"
                                       className={classNames({'p-error': isFormFieldValid('sector')})}>{t('company.sector')}*</label>
                            </span>
                            {getFormErrorMessage('sector')}
                        </div>

                        <div className="field col-12 md:col-6">
                            <span className="p-float-label">
                                <Dropdown id="bookkeepingFormat" value={company.bookkeepingFormat} options={CompanyService.getBookkeepingFormats(t)}
                                             placeholder={t('company.bookkeepingFormat.select')} optionLabel="name" optionValue="code"
                                             onChange={(e) => onInputChange(e, 'bookkeepingFormat')}
                                             className={classNames({'p-invalid': isFormFieldValid('bookkeepingFormat')})}/>

                                <label htmlFor="bookkeepingFormat" className={classNames({'p-error': isFormFieldValid('bookkeepingFormat')})}>
                                    {t('company.bookkeepingFormat')}*
                                </label>
                            </span>
                            {getFormErrorMessage('bookkeepingFormat')}
                        </div>

                        <div className="field col-12 md:col-6">
                            <span className="p-float-label">
                                <Dropdown id="investmentStatus" value={company.investmentStatus} options={CompanyService.getInvestmentStatutes(t)}
                                          placeholder={t('company.investmentStatus.select')} optionLabel="name" optionValue="code"
                                          onChange={(e) => onInputChange(e, 'investmentStatus')}
                                          className={classNames({'p-invalid': isFormFieldValid('investmentStatus')})}/>

                                <label htmlFor="investmentStatus" className={classNames({'p-error': isFormFieldValid('investmentStatus')})}>
                                    {t('company.investmentStatus')}*
                                </label>
                            </span>
                            {getFormErrorMessage('investmentStatus')}
                        </div>

                        <div className="field col-12 md:col-6">
                            <span className="p-float-label ">
                                <InputNumber id="turnover" value={company.turnover || 0} required
                                             onValueChange={(e) => onInputChange(e, 'turnover')}
                                             className={classNames({'p-error': isFormFieldValid('turnover')})}/>
                                <label htmlFor="turnover"
                                       className={classNames({'p-error': isFormFieldValid('turnover')})}>{t('company.turnover')}*</label>
                            </span>
                            {getFormErrorMessage('turnover')}
                        </div>

                        <div className="field col-12 md:col-6">
                            <span className="p-float-label ">
                                <InputNumber id="employeeNumber" value={company.employeeNumber || 0} required
                                             onValueChange={(e) => onInputChange(e, 'employeeNumber')}
                                             className={classNames({'p-error': isFormFieldValid('employeeNumber')})}/>
                                <label htmlFor="employeeNumber"
                                       className={classNames({'p-error': isFormFieldValid('employeeNumber')})}>{t('company.employeeNumber')}*</label>
                            </span>
                            {getFormErrorMessage('employeeNumber')}
                        </div>

                        <div className="field col-12">
                            <span className="p-float-label">
                                <InputTextarea id="address" value={company.contact.address || ""} rows={4} 
                                               onChange={(e) => onContactInputChange(e, 'address')}/>
                                <label htmlFor="address">{t('company.address')}</label>
                            </span>
                        </div>
                        <div className="field col-12 md:col-6">
                            <span className="p-float-label">
                                <InputText id="city" type="text" value={company.contact.city || ""} 
                                           onChange={(e) => onContactInputChange(e, 'city')}/>
                                <label htmlFor="city">{t('company.city')}</label>
                            </span>
                        </div>
                        <div className="field col-12 md:col-6">
                            <span className="p-float-label">
                                <InputMask id="faxNo" mask="(999) 999-9999" value={company.contact.faxNo|| ""}
                                           onChange={(e) => onContactInputChange(e, 'faxNo')}/>
                                <label htmlFor="faxNo">{t('company.faxNo')}</label>
                            </span>
                        </div>
                        <div className='field col-12 md:col-6'>
                        <span className='p-float-label'>
                            <InputMask id='fax' mask='(999) 999-9999' value={company.contact}
                                       onChange={(e) => onContactInputChange(e, 'faxNo')} />
                            <label htmlFor='fax'>{t('partnership.faxNo')}</label>
                        </span>
                        </div>
                        <div className="field col-12 md:col-6">
                            <span className="p-float-label">
                                <InputText id="email" type="text" value={company.contact.email || ""} 
                                           onChange={(e) => onContactInputChange(e, 'email')}
                                           className={classNames({'p-error': isFormFieldValid('email')})}/>
                                <label htmlFor="email"
                                       className={classNames({'p-error': isFormFieldValid('email')})}>{t('email')}*</label>
                            </span>
                            {getFormErrorMessage('email')}
                        </div>
                        <div className="field col-12 md:col-6">
                            <span className="p-float-label">
                                <InputText id="website" type="text" value={company.contact.website || ""} 
                                           onChange={(e) => onContactInputChange(e, 'website')}/>
                                <label htmlFor="website">{t('company.website')}</label>
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button label={t('save')} onClick={saveCompany} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CompanyComponent;
