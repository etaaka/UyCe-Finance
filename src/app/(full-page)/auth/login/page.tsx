/* eslint-disable @next/next/no-img-element */
'use client';
import React, {useContext, useEffect, useRef, useState} from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import {LayoutContext} from "../../../../layout/context/layoutcontext";
import {useUser} from "../../../../layout/context/usercontext";
import Link from "next/link";
import { Toast } from 'primereact/toast';
import {useRouter} from "next/navigation";
import {account} from "../../../../service/appwrite";
import {useTranslation} from "react-i18next";

const LoginPage = () => {
    const [email, setEmail] = useState( "");
    const [password, setPassword] = useState( "");
    const [checked, setChecked] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Map<string, string>>(new Map());
    const { layoutConfig } = useContext(LayoutContext);

    const {t} = useTranslation();
    const user = useUser();
    const router = useRouter();
    const toast = useRef<Toast>(null);
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    useEffect(() => {
        if(!user.loadingUser){
            if(user.current != null){
                window.location.replace("/")
            }
        }
        setEmail(localStorage.getItem("email") as string)
        setPassword(localStorage.getItem("password") as string)
    }, [user.current, user.loadingUser]);

    function validate() {
        if (!email) {
            errors.set("email", t('email.required'))
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            errors.set("email", t('email.invalid'))
        }
        if(!password){
            errors.set("password", t('password.required'))
        }
        return errors;
    }
    function isFormFieldValid (name: string)  {
        return !!(submitted && errors.get(name));
    }

    function getFormErrorMessage (name: string)  {
        return isFormFieldValid(name) && <small className="p-error block">{errors.get(name)}</small>;
    }
    function login() {
        setSubmitted(true);
        let errors = validate()
        setErrors(errors)
        if (errors.size == 0) {

            user.login(email, password).then(function (response) {
                account.get().then(function (response) {
                    user.current = response as any

                    if (checked) {
                        localStorage.setItem("email", email);
                        localStorage.setItem("password", password)
                    }
                    router.push('/');
                }, function (error) {
                    toast.current?.show({severity: 'warn', summary: 'Error', detail: error.message, life: 3000})
                });

            }, function (error) {
                if (error.type == 'user_invalid_credentials') {
                    toast.current?.show({severity: 'warn', summary: 'Error', detail: t('login.credential.invalid'), life: 3000})
                } else {
                    toast.current?.show({severity: 'warn', summary: 'Error', detail: error.message, life: 3000})
                }
            });
        }
    }

    return (
        <div className={containerClassName}>
            <Toast ref={toast} />
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                <div style={{borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'}}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <img src="/demo/images/login/avatar.png" alt="Image" height="50" className="mb-3" style={{ display: "none" }}/>
                            <div className="text-900 text-3xl font-medium mb-3" style={{ display: "none" }}>Welcome, Isabel!</div>
                            <span className="text-600 font-medium">{t('login.signcontinue')}</span>
                        </div>

                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                {t('email')}
                            </label>
                            {getFormErrorMessage('email')}
                            <InputText id="email1" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('email.address')} required={true} className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                {t('password')}
                            </label>
                            {getFormErrorMessage('password')}
                            <Password inputId="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('password')} required={true} toggleMask className="w-full mb-5 p-invalid" inputClassName="w-full p-3 md:w-30rem"/>

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"/>
                                    <label htmlFor="rememberme1">{t('login.rememberme')}</label>
                                </div>
                                <a href="/auth/forgotpassword" className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    {t('login.forgot')}
                                </a>
                            </div>
                            <Button label={t('login.signin')} className="w-full p-3 text-xl mb-5 gap-5" onClick={ () => {login()}}/>

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    {t('login.newuser')}
                                    <Link href="/auth/register" className="flex align-items-center">
                                        <span className="font-medium no-underline ml-2 text-right cursor-pointer">{t('login.createaccount')}</span>
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

export default LoginPage;
