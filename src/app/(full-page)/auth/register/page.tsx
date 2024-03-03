/* eslint-disable @next/next/no-img-element */
'use client';
import React, {useContext, useRef, useState} from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import {LayoutContext} from "../../../../layout/context/layoutcontext";
import {useUser} from "../../../../layout/context/usercontext";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {Toast} from "primereact/toast";
import {useTranslation} from "react-i18next";

const RegisterPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);

    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Map<string, string>>(new Map());
    const router = useRouter();
    const {t} = useTranslation();
    const toast = useRef<Toast>(null);
    const user = useUser();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    function validate() {
        if (!email) {
            errors.set("email", t('email.required'))
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            errors.set("email", t('email.invalid'))
        }
        if(!password){
            errors.set("password", t('password.required'))
        }
        if(!checked){
            errors.set("checked", t('register.checked.required'))
        }
        return errors;
    }

    function isFormFieldValid (name: string)  {
        return !!(submitted && errors.get(name));
    }

    function getFormErrorMessage (name: string)  {
        return isFormFieldValid(name) && <small className="p-error block">{errors.get(name)}</small>;
    }

    function register() {
        setSubmitted(true);
        let errors = validate()
        setErrors(errors)
        if (errors.size == 0) {
            user.register(email, password).then(function (response) {
                user.current = response as any
                router.push('/');
            }, function (error) {
                toast.current?.show({severity: 'warn', summary: 'Error', detail: error.message, life: 3000})
            });
        }
    }

    return (
        <div className={containerClassName}>
            <Toast ref={toast} />
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                <div style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">{t('register.register')}</div>
                            <span className="text-600 font-medium">{t('register.letstarted')}</span>
                        </div>

                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                {t('email')}
                            </label>
                            {getFormErrorMessage('email')}
                            <InputText id="email1" type="text" required={true} value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('email.address')} className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                {t('password')}
                            </label>
                            {getFormErrorMessage('password')}
                            <Password inputId="password1" required={true} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('password')} toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"/>

                            {getFormErrorMessage('checked')}
                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox inputId="readTerms" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"/>
                                    <label htmlFor="readTerms">{t('register.haveread')}</label>
                                    <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                        {t('register.termscondition')}
                                    </a>
                                </div>
                            </div>

                            <Button label={t('register.signup')} className="w-full p-3 text-xl mb-5" onClick={() => register()}/>

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    {t('register.alreadhaveaccount')}
                                    <Link href="/auth/login" className="flex align-items-center">
                                        <span className="font-medium no-underline ml-2 text-right cursor-pointer">{t('register.login')}</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
