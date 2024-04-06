import { Metadata } from 'next';
import Layout from '../../layout/layout';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'UyCe Financial - İşletmenizin Finansal Geleceğini Şekillendirin',
    keywords: 'UyCe Financial, finansal danışmanlık, finansal analiz, işletme finansmanı, işletme analizi',
    description: 'UyCe Financial ile işletmenizin finansal geleceğini şekillendirin. Kapsamlı analiz raporları ve uzman danışmanlık hizmetleri ile finansal başarınızı artırın.',
    robots: { index: false, follow: false },
    viewport: { initialScale: 1, width: 'device-width' },
    openGraph: {
        type: 'website',
        title: 'UyCe Financial - İşletmenizin Finansal Geleceğini Şekillendirin',
        keywords: 'UyCe Financial, finansal danışmanlık, finansal analiz, işletme finansmanı, işletme analizi',
        url: 'https://www.uyce-finance.com/',
        description: 'UyCe Financial ile işletmenizin finansal geleceğini şekillendirin. Kapsamlı analiz raporları ve uzman danışmanlık hizmetleri ile finansal başarınızı artırın.',
        images: ['https://www.primefaces.org/static/social/sakai-react.png'],
        ttl: 604800
    },
    icons: {
        icon: '/favicon.ico'
    }
};

export default function AppLayout({ children }: AppLayoutProps) {
    return <Layout>{children}</Layout>;
}
