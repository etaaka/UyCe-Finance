import { Metadata } from 'next';
import AppConfig from '../../layout/AppConfig';
import React from 'react';

interface SimpleLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'UyCe Financial - İşletmenizin Finansal Geleceğini Şekillendirin',
    keywords: 'UyCe Financial, finansal danışmanlık, finansal analiz, işletme finansmanı, işletme analizi',
    description: 'UyCe Financial ile işletmenizin finansal geleceğini şekillendirin. Kapsamlı analiz raporları ve uzman danışmanlık hizmetleri ile finansal başarınızı artırın.'
};

export default function SimpleLayout({ children }: SimpleLayoutProps) {
    return (
        <React.Fragment>
            {children}
            <AppConfig simple />
        </React.Fragment>
    );
}
