/* eslint-disable @next/next/no-img-element */
'use client';
import React, {useContext, useRef, useState} from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import {LayoutContext} from "../../../../layout/context/layoutcontext";
import {useUser} from "../../../../layout/context/usercontext";
import {useTranslation} from "react-i18next";
import {Toast} from "primereact/toast";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const { layoutConfig } = useContext(LayoutContext);

    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Map<string, string>>(new Map());
    const user = useUser();
    const {t} = useTranslation();
    const toast = useRef<Toast>(null);
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });
    function validate() {
        if (!email) {
            errors.set("email", t('email.required'))
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            errors.set("email", t('email.invalid'))
        }
        return errors;
    }

    function isFormFieldValid (name: string)  {
        return !!(submitted && errors.get(name));
    }

    function getFormErrorMessage (name: string)  {
        return isFormFieldValid(name) && <small className="p-error block">{errors.get(name)}</small>;
    }

    function createRecovery() {

        setSubmitted(true);
        let errors = validate()
        setErrors(errors)
        if (errors.size == 0) {
            user.createRecovery(email).then(function (response) {
            }, function (error) {
                toast.current?.show({severity: 'warn', summary: 'Error', detail: error.message, life: 3000})
            });
        }
    }

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                <div style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">{t('forgotpassword.forgotpassword')}</div>
                            <span className="text-600 font-medium">{t('forgotpassword.enteremail')}</span>
                        </div>
                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                {t('email')}
                            </label>
                            <InputText id="email1" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('email.address')} className="w-full mb-5" style={{ padding: '1rem' }} />
                            <Button label={t('submit')} className="w-full p-3 text-xl" onClick={() => createRecovery()}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
