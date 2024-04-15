'use client';

import React, { useEffect, useState } from 'react';
import { Panel } from 'primereact/panel';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { Partnership } from '../../../../service/types/partnership/Partnership';
import { FinancialLine } from '../../../../service/types/financial/line/FinancialLine';
import { Affiliate } from '../../../../service/types/affiliate/Affiliate';
import { AffiliateType } from '../../../../service/types/affiliate/AffiliateType';
import { Bank } from '../../../../service/types/bank/Bank';
import { CompanyService } from '../../../../service/CompanyService';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../../layout/context/usercontext';
import { useTranslation } from "react-i18next";
import { Company } from '../../../../service/types/company/Company';
import { Financial } from '../../../../service/types/financial/Financial';
import { BookkeepingFormat } from '../../../../service/types/company/BookkeepingFormat';
import { InvestmentStatus } from '../../../../service/types/company/InvestmentStatus';
import { Sector } from '../../../../service/types/company/Sector';
import { Contact } from '../../../../service/types/contact/Contact';
import { PartnershipService } from '../../../../service/PartnershipService';
import { AffiliateService } from '../../../../service/AffiliateService';
import { FinancialService } from '../../../../service/FinancialService';
import { FinancialReportLine } from '../../../../service/types/financial/line/dto/FinancialReportLine';

const BasicReport = () => {
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
    const [ortaklik, setOrtaklik] = useState<Partnership[]>([]);
    const [yonetimKurulu, setYonetimKurulu] = useState<Partnership[]>([]);
    const [ustYonetim, setUstYonetim] = useState<Partnership[]>([]);
    const [istirakler, setIstirakler] = useState<Affiliate[]>([]);
    const [bagliOrtakliklar, setBagliOrtakliklar] = useState<Affiliate[]>([]);

    const [banks, setBanks] = useState<Bank[]>([]);
    const [ithalat, setIthalat] = useState<FinancialLine[]>([]);
    const [company, setCompany] = useState<Company>( emptyCompany);
    const [financials, setFinancials] = useState<Financial[]>();
    const [financialReportLines, setFinancialReportLines] = useState<FinancialReportLine[]>();
    const router = useRouter();
    const user = useUser();
    const {t} = useTranslation();

    const toplam = () => {
        let total = 0;

        for (let partner of ortaklik) {
            total += partner.shareRatio;
        }
        return total;
    };

    const convertToReportLine = () => {
        financials?.forEach(value => {
            value.actualLines
        })
        const rl: FinancialReportLine = new FinancialReportLine()
        rl.key
    };

    useEffect(() => {
        if (!user.loadingUser) {
            if (user.company == null) {
                router.push('/companies')
            } else {
                CompanyService.get(user.company.$id!).then(c => {
                    setCompany({...(c as any)});
                    PartnershipService.listByCompanyId(user.company?.$id).then(value => {
                        setOrtaklik(value.documents.filter(value1 => value1.shareRatio != null && value1.shareRatio != 0))
                        setYonetimKurulu(value.documents.filter(value1 => value1.boardOfDirectorType != null))
                        setUstYonetim(value.documents.filter(value1 => value1.seniorManagementType != null))
                    })
                    AffiliateService.listByCompanyId(user.company?.$id).then(value => {
                        setBagliOrtakliklar(value.documents.filter(value1 => value1.affiliateType == AffiliateType.AFFILIATE_PARTNERSHIP))
                        setIstirakler(value.documents.filter(value1 => value1.affiliateType == AffiliateType.AFFILIATE))
                    })
                    FinancialService.listByCompanyId(user.company?.$id).then(value => {
                        setFinancials(value.documents)
                    })
                })
            }
        }
    }, [user.current, user.loadingUser]);

    const footerGroup = (
        <ColumnGroup>
            <Row>
                <Column footer='TOPLAM:' footerStyle={{ textAlign: 'left' }} />
                <Column footer={toplam} />
            </Row>
        </ColumnGroup>
    );

    function retrieveYears() {
        let year = new Date().getFullYear();
        let yy = [];
        for (let i = 0; i < 5; i++) {
            yy.push({ field: year - i, header: year - i });
        }
        return yy;
    }

    const yearColumns = retrieveYears();


    return (
        <div className='grid'>
            <div className='col-12'>
                <div className='card'>
                    <h5>ŞİRKET DEĞERLENDİRME RAPORU</h5>
                    <Panel header='ŞİRKET ÜNVANI VE İLETİŞİM BİLGİLERİ' toggleable>
                        <div className='grid formgrid'>
                            <div className='col-12 mb-2 lg:col-3 lg:mb-0'>
                                <span className='text-900 line-height-3'>Şirket Ünvanı</span>
                            </div>
                            <div className='col-12 mb-2 lg:col-9 lg:mb-0'>
                                <span className='text-700 line-height-3'>: {company.name}</span>
                            </div>
                        </div>
                        <div className='grid formgrid'>
                            <div className='col-12 mb-2 lg:col-3 lg:mb-0'>
                                <span className='text-900 line-height-3'>Adres</span>
                            </div>
                            <div className='col-12 mb-2 lg:col-9 lg:mb-0'>
                                <span className='text-700 line-height-3'>: {company.contact.address}</span>
                            </div>
                        </div>
                        <div className='grid formgrid'>
                            <div className='col-12 mb-2 lg:col-3 lg:mb-0'>
                                <span className='text-900 line-height-3'>Telefon</span>
                            </div>
                            <div className='col-12 mb-2 lg:col-9 lg:mb-0'>
                                <span className='text-700 line-height-3'>: {company.contact.telNo}</span>
                            </div>
                        </div>
                        <div className='grid formgrid'>
                            <div className='col-12 mb-2 lg:col-3 lg:mb-0'>
                                <span className='text-900 line-height-3'>Faks</span>
                            </div>
                            <div className='col-12 mb-2 lg:col-9 lg:mb-0'>
                                <span className='text-700 line-height-3'>: -</span>
                            </div>
                        </div>
                        <div className='grid formgrid'>
                            <div className='col-12 mb-2 lg:col-3 lg:mb-0'>
                                <span className='text-900 line-height-3'>E-mail</span>
                            </div>
                            <div className='col-12 mb-2 lg:col-9 lg:mb-0'>
                                <span className='text-700 line-height-3'>: {company.contact.email}</span>
                            </div>
                        </div>
                        <div className='grid formgrid'>
                            <div className='col-12 mb-2 lg:col-3 lg:mb-0'>
                                <span className='text-900 line-height-3'>Web Sayfası</span>
                            </div>
                            <div className='col-12 mb-2 lg:col-9 lg:mb-0'>
                                <span className='text-700 line-height-3'>: {company.contact.website}</span>
                            </div>
                        </div>
                    </Panel>
                    <Panel header='SKOR PUANI' toggleable>
                        <div className='grid formgrid'>
                            <div className='col-12 mb-2 lg:col-3 lg:mb-0'>
                                <span className='text-900 line-height-3'>Değerleme Yorumu</span>
                            </div>
                            <div className='col-12 mb-2 lg:col-9 lg:mb-0'>
                                <span className='text-700 line-height-3'>: XYZ Ticaret A.Ş.’nin 2011 yılında zarar etmiş olması, borçlanma oranlarının yüksek olması, buna rağmen net faaliyet marjının ve likidite oranlarının pozitif görünümde olması nedeni ile Orta Risk Grubunda değerlendirmemize neden olmuştur.</span>
                            </div>
                        </div>
                        <div className='grid formgrid'>
                            <div className='col-12 mb-2 lg:col-3 lg:mb-0'>
                                <span className='text-900 line-height-3'>Finansal Gücü</span>
                            </div>
                            <div className='col-12 mb-2 lg:col-9 lg:mb-0'>
                                <span className='text-700 line-height-3'>: Orta</span>
                            </div>
                        </div>
                        <div className='grid formgrid'>
                            <div className='col-12 mb-2 lg:col-3 lg:mb-0'>
                                <span className='text-900 line-height-3'>UyCe Finance Skoru</span>
                            </div>
                            <div className='col-12 mb-2 lg:col-9 lg:mb-0'>
                                <span className='text-700 line-height-3'>: 3</span>
                            </div>
                        </div>
                        <div className='grid formgrid'>
                            <div className='col-12 mb-2 lg:col-3 lg:mb-0'>
                                <span className='text-900 line-height-3'>Önceki UyCe Finance Skoru</span>
                            </div>
                            <div className='col-12 mb-2 lg:col-9 lg:mb-0'>
                                <span className='text-700 line-height-3'>: -</span>
                            </div>
                        </div>
                        <div className='grid formgrid'>
                            <div className='col-12 mb-2 lg:col-3 lg:mb-0'>
                                <span className='text-900 line-height-3'>Geçerlilik Süresi</span>
                            </div>
                            <div className='col-12 mb-2 lg:col-9 lg:mb-0'>
                                <span className='text-700 line-height-3'>: 1 Yıl</span>
                            </div>
                        </div>
                        <div className='grid formgrid'>
                            <div className='col-12 mb-2 lg:col-3 lg:mb-0'>
                                <span className='text-900 line-height-3'>Kredi Limiti</span>
                            </div>
                            <div className='col-12 mb-2 lg:col-9 lg:mb-0'>
                                <span className='text-700 line-height-3'>: Firmanın sektöründeki öneminden dolayı kredi limiti belirlenemez</span>
                            </div>
                        </div>
                        <div className='grid formgrid'>
                            <div className='col-12 mb-2 lg:col-3 lg:mb-0'>
                                <span className='text-900 line-height-3'>Risk Grubu</span>
                            </div>
                            <div className='col-12 mb-2 lg:col-9 lg:mb-0'>
                                <span className='text-700 line-height-3'>: 5</span>
                            </div>
                        </div>
                        <div className='grid formgrid'>
                            <div className='col-12 mb-2 lg:col-3 lg:mb-0'>
                                <span className='text-900 line-height-3'>Finansal Görünüm</span>
                            </div>
                            <div className='col-12 mb-2 lg:col-9 lg:mb-0'>
                                <span className='text-700 line-height-3'>: Durağan</span>
                            </div>
                        </div>
                    </Panel>
                    <Panel header='ŞİRKET BİLGİLERİ' toggleable>
                        <div className='grid formgrid'>
                            <div className='col-12 mb-2 lg:col-3 lg:mb-0'>
                                <span className='text-900 line-height-3'>Kuruluş Tarihi</span>
                            </div>
                            <div className='col-12 mb-2 lg:col-9 lg:mb-0'>
                                <span className='text-700 line-height-3'>: {company.establishmentDate}</span>
                            </div>
                        </div>
                        <div className='grid formgrid'>
                            <div className='col-12 mb-2 lg:col-3 lg:mb-0'>
                                <span className='text-900 line-height-3'>Yasal Şekil</span>
                            </div>
                            <div className='col-12 mb-2 lg:col-9 lg:mb-0'>
                                <span className='text-700 line-height-3'>: Anonim Şirket</span>
                            </div>
                        </div>
                        <div className='grid formgrid'>
                            <div className='col-12 mb-2 lg:col-3 lg:mb-0'>
                                <span className='text-900 line-height-3'>Ticaret Sicil No</span>
                            </div>
                            <div className='col-12 mb-2 lg:col-9 lg:mb-0'>
                                <span className='text-700 line-height-3'>: {company.tradeRegisterNo}</span>
                            </div>
                        </div>
                        <div className='grid formgrid'>
                            <div className='col-12 mb-2 lg:col-3 lg:mb-0'>
                                <span className='text-900 line-height-3'>Vergi Dairesi/No</span>
                            </div>
                            <div className='col-12 mb-2 lg:col-9 lg:mb-0'>
                                <span className='text-700 line-height-3'>: {company.taxAdministration}/{company.taxNo}</span>
                            </div>
                        </div>
                        <div className='grid formgrid'>
                            <div className='col-12 mb-2 lg:col-3 lg:mb-0'>
                                <span className='text-900 line-height-3'>Çalışan Sayısı</span>
                            </div>
                            <div className='col-12 mb-2 lg:col-9 lg:mb-0'>
                                <span className='text-700 line-height-3'>: {company.employeeNumber}</span>
                            </div>
                        </div>
                        <div className='grid formgrid'>
                            <div className='col-12 mb-2 lg:col-3 lg:mb-0'>
                                <span className='text-900 line-height-3'>Satışlar</span>
                            </div>
                            <div className='col-12 mb-2 lg:col-9 lg:mb-0'>
                                <span className='text-700 line-height-3'>: 5,8 Milyar TL</span>
                            </div>
                        </div>
                        <div className='grid formgrid'>
                            <div className='col-12 mb-2 lg:col-3 lg:mb-0'>
                                <span className='text-900 line-height-3'>Kar/Zarar</span>
                            </div>
                            <div className='col-12 mb-2 lg:col-9 lg:mb-0'>
                                <span className='text-700 line-height-3'>: -163 Milyon TL</span>
                            </div>
                        </div>
                        <div className='grid formgrid'>
                            <div className='col-12 mb-2 lg:col-3 lg:mb-0'>
                                <span className='text-900 line-height-3'>Özkaynaklar</span>
                            </div>
                            <div className='col-12 mb-2 lg:col-9 lg:mb-0'>
                                <span className='text-700 line-height-3'>: 1,2 Milyar TL</span>
                            </div>
                        </div>
                        <div className='grid formgrid'>
                            <div className='col-12 mb-2 lg:col-3 lg:mb-0'>
                                <span className='text-900 line-height-3'>Kayıtlı Sermaye</span>
                            </div>
                            <div className='col-12 mb-2 lg:col-9 lg:mb-0'>
                                <span className='text-700 line-height-3'>: -</span>
                            </div>
                        </div>
                        <div className='grid formgrid'>
                            <div className='col-12 mb-2 lg:col-3 lg:mb-0'>
                                <span className='text-900 line-height-3'>Ödenmiş Sermaye</span>
                            </div>
                            <div className='col-12 mb-2 lg:col-9 lg:mb-0'>
                                <span className='text-700 line-height-3'>: 178 Milyon TL</span>
                            </div>
                        </div>
                    </Panel>
                    <Panel header='ORTAKLIK YAPISI VE YÖNETİM KADROSU' toggleable>
                        <span className='text-900 line-height-3'>1 Aralık 2011 itibariyle Ortaklık Yapısı:</span>
                        <DataTable value={ortaklik} footerColumnGroup={footerGroup}>
                            <Column field='name' header='Adı Soyadı-Ticari Ünvanı' />
                            <Column field='shareRatio' header='(%)' />
                        </DataTable>

                        <DataTable value={yonetimKurulu} header='YÖNETİM KURULU'>
                            <Column field='name' header='Adı' style={{ width: '20%' }} />
                            <Column field='surname' header='Soyadı' style={{ width: '20%' }} />
                            <Column field='boardOfDirectorType' header='Ünvan' style={{ width: '60%' }} />
                        </DataTable>

                        <DataTable value={ustYonetim} header='ÜST YÖNETİM'>
                            <Column field='name' header='Adı' />
                            <Column field='surname' header='Soyadı'  />
                            <Column field='seniorManagementType' header='Ünvan' />
                            <Column field='education' header='Eğitim'  />
                            <Column field='experienceYear' header='Deneyim (Yıl)' />
                        </DataTable>
                    </Panel>
                    <Panel header='FAALİYET İLE İLGİLİ BİLGİLER' toggleable>
                        <div className='grid formgrid'>
                            <div className='col-12 mb-2 lg:col-3 lg:mb-0'>
                                <span className='text-900 line-height-3'>Faaliyet Konusu</span>
                            </div>
                            <div className='col-12 mb-2 lg:col-9 lg:mb-0'>
                                <span className='text-700 line-height-3'>: xxxxxxxxxxxxxxxxxxxxxxxxxxxxx perakende ve perakende tüketimine yönelik toptan satışını yapmak</span>
                            </div>
                        </div>
                        <div className='grid formgrid'>
                            <div className='col-12 mb-2 lg:col-3 lg:mb-0'>
                                <span className='text-900 line-height-3'>Sunduğu Hizmetler</span>
                            </div>
                            <div className='col-12 mb-2 lg:col-9 lg:mb-0'>
                                <span className='text-700 line-height-3'>: Gıda ve ihtiyaç maddeleri, kırtasiye, züccaciye, beyaz eşya, kitap, kaset ve konfeksiyon ürünleri perakende satışı</span>
                            </div>
                        </div>

                        <DataTable value={ithalat}>
                            <Column field='name' style={{ width: '20%' }} />
                            {yearColumns.map((col, i) => (
                                <Column key={col.field} field={col.field} header={col.header} />
                            ))}
                        </DataTable>

                        <DataTable value={istirakler} header='İştirakler'>
                            <Column field='name' header='Unvan' style={{ width: '20%' }} />
                            <Column field='country' header='Ülke' style={{ width: '20%' }} />
                            <Column field='activity' header='Faaliyet Konusu' style={{ width: '60%' }} />
                        </DataTable>
                        <DataTable value={bagliOrtakliklar} header='Bağlı Ortaklıklar'>
                            <Column field='name' header='Unvan' style={{ width: '20%' }} />
                            <Column field='country' header='Ülke' style={{ width: '20%' }} />
                            <Column field='activity' header='Faaliyet Konusu' style={{ width: '60%' }} />
                        </DataTable>
                    </Panel>
                    <Panel header='ÇALIŞTIĞI BANKALAR' toggleable>
                        <DataTable value={banks}>
                            <Column field='name' header='Banka Adı' />
                            <Column field='country' header='Kredi Limiti' />
                            <Column field='activity' header='Nakit Kredi' />
                            <Column field='activity' header='Gayrinakdi Kredi' />
                            <Column field='activity' header='Teminat' />
                            <Column field='activity' header='Mevduat' />
                        </DataTable>
                    </Panel>
                    <Panel header='TİCARİ ÖDEMELER' toggleable>
                        <p>
                            Protestolu Senetleri ve Karşılıksız Çekleri varsa, bunlara ilişkin görüş bildirilecektir.
                        </p>
                    </Panel>
                    <Panel header='ADLİ SÜREÇLER' toggleable>
                        <p>
                            Tespit edilen dava ve mahkemeleri varsa burada belirtilecektir.
                        </p>
                    </Panel>
                    <Panel header='ŞİRKET PROFİLİ' toggleable>
                        <p>
                            19XX yılında XYZ Kooperatifler Birliği ve İstanbul Belediyesi’nin ortak girişimi ile
                            İstanbul’da kurulmuştur. İlk mağazasını ……………..’nda açan XYZ ’un çoğunluk hisseleri 19XX
                            yılında KLM Grubu tarafından devralınmış ve bu tarihten itibaren mağazalarının sayısı ve
                            marka değeri hızla artmıştır. XYZ 19XX yılında halka açılmıştır. XYZ , 20XX yılında ulusal
                            perakende zinciri MNO’yu satın alarak sektördeki payını arttırmıştır. 2008 yılında KLM
                            grubunun perakende sektöründen çıkma kararı neticesinde KLM grubu sahip olduğu hisseleri
                            yaklaşık 2 Milyar TL karşılığında Uluslararası bir girişim sermayesi şirketi olan --
                            Partners tarafından yönetilen fonların kontrol ettiği ABC Capital S.A ‘ya satılmıştır. Satış
                            sonucunda XYZ Ticaret A.Ş. (Eski Unvanı:ABC Perakendecilik ve T.A.Ş.) ve XYZ Türk T.A.Ş. 30
                            Nisan 2009’da birleşmiştir.
                        </p>
                        <p>
                            2011 yılsonu itibarıyla yurt içinde 7 coğrafi bölgede 262 M, 190 MM, 59 MMM, 16 5M, 177
                            Tansaş, 13 Macrocenter ve yurt dışında iştirakleri aracılığıyla Kazakistan’da 23 ve
                            Makedonya’da 5 Ramstore olmak üzere toplam 745 mağazası bulunmaktadır.
                        </p>
                    </Panel>
                    <Panel header='ŞİRKET HAKKINDA ÖNEMLİ DEĞİŞİKLİKLER' toggleable>
                        <p>
                            Şubat 2008’de KLM Holding A.Ş. tarafından XYZ ’un %50,83 oranındaki hissesinin, ABC
                            Perakendecilik ve T.A.Ş.’ye devredilmesine ilişkin hisse devir sözleşmesi imzalanmış ve
                            hisse devri 30 Mayıs 2008’de tamamlanmıştır. XYZ Ticaret A.Ş. (Eski Unvanı:ABC
                            Perakendecilik ve T.A.Ş.) ve XYZ Türk T.A.Ş. 30 Nisan 2009’da birleşmiştir.
                        </p>
                        <p>
                            ABC Perakendecilik ve T.A.Ş. ünvanı 30 Nisan 2009’da XYZ Ticaret A.Ş. olarak
                            değiştirilmiştir.
                        </p>
                    </Panel>

                    <Panel header='FİNANSAL BİLGİLER' toggleable>
                        <p>
                            Şubat 2008’de KLM Holding A.Ş. tarafından XYZ ’un %50,83 oranındaki hissesinin, ABC
                            Perakendecilik ve T.A.Ş.’ye devredilmesine ilişkin hisse devir sözleşmesi imzalanmış ve
                            hisse devri 30 Mayıs 2008’de tamamlanmıştır. XYZ Ticaret A.Ş. (Eski Unvanı:ABC
                            Perakendecilik ve T.A.Ş.) ve XYZ Türk T.A.Ş. 30 Nisan 2009’da birleşmiştir.
                        </p>
                    </Panel>

                    <Panel header='RASYOLAR' toggleable>
                        <p>
                            Şubat 2008’de KLM Holding A.Ş. tarafından XYZ ’un %50,83 oranındaki hissesinin, ABC
                            Perakendecilik ve T.A.Ş.’ye devredilmesine ilişkin hisse devir sözleşmesi imzalanmış ve
                            hisse devri 30 Mayıs 2008’de tamamlanmıştır. XYZ Ticaret A.Ş. (Eski Unvanı:ABC
                            Perakendecilik ve T.A.Ş.) ve XYZ Türk T.A.Ş. 30 Nisan 2009’da birleşmiştir.
                        </p>
                    </Panel>

                    <Panel header='ŞİRKETİN RİSK PROFİLİ' toggleable>
                        <p>
                            2011 yılında firmanın bilanço büyüklüğü %1,6 azalış ile 5,5 milyar TL’ye düşmüştür. Dönen varlıkların aktifler
                            içindeki payı 2010 yılında %31,4 iken, 2011 yılında %32,8 olarak gerçekleşmiştir. Duran varlıkların aktifler
                            içindeki payı ise 2010 yılında %68,6 iken, 2011 yılında %67,2 olarak gerçekleşmiştir. Duran varlıklar içinde en
                            önemli kalemler 1,1 milyar TL maddi duran varlıklar ve 2,3 Milyar TL ile şerefiye’dir. 2011 yılında firmanın
                            aktiflerinin %21,8’i özkaynaklarla, %78,2’si yabancı kaynaklar ile finanse edilmiştir. Firmanın kaldıraç oranı 2011
                            yılında %65 olan perakende sektörünün üzerindedir. Ayrıca perakende sektörü özkaynaklarının 1,8 katı kadar
                            borçlanırken XYZ ’ta bu oran 3,5 katıdır. Firmanın borçlanma katsayısı yıllar itibari ile artma trendindeyken,
                            özkaynak karlılığı ise azalış trendindedir. Bu durum firmanın finansal kaldıraç oranının olumsuz etkilemektedir.
                            Firma 2011 yılında aktiflerinin %47,2’sini banka kredileri ile finanse etmiştir.
                        </p>
                        <p>
                            Firma 2011 yılında satış gelirlerini %11,5 arttırarak 5,8 milyar TL’ye yükselmesine rağmen, firmanın net kambiyo
                            zararının %600 artması nedeni ile firma 2011 yılını zarar ile kapatmıştır. Firmanın gelirlerinin %93,8’ini
                            Türkiye’den sağlamasına rağmen finansal borçlarının yabancı para cinsinden olması kur riskine maruz kalmasına
                            neden olmaktadır. Firmanın likidite oranında bir önceki yıla göre artış göstermektedir. 2011 yılında asit test
                            oranı %0,71, cari oranı ise %1,19 olarak gerçekleşmiştir. Firmanın net faaliyet marjı ise sektörün çok üstündedir.
                            Firma pozitif net işletme sermayesi ile faaliyetlerini devam ettirmektedir. Ancak sektörde net işletme
                            sermayesinin aktiflere oranı %13,9 iken firmada bu oran %9’da kalmıştır.
                            Şirket 2011 yılında zarar etmiş olması, borçlanma oranlarının yüksek olması, buna rağmen net faaliyet marjının
                            ve likidite oranlarının pozitif görünümde olması nedeni ile Orta Risk Grubunda değerlendirmemize neden
                            olmuştur.
                        </p>
                    </Panel>

                    <Panel header='Rapor ile ilgili olarak İrtibat Kurulacak Kişiler' toggleable>
                        <p>
                            Şubat 2008’de KLM Holding A.Ş. tarafından XYZ ’un %50,83 oranındaki hissesinin, ABC
                            Perakendecilik ve T.A.Ş.’ye devredilmesine ilişkin hisse devir sözleşmesi imzalanmış ve
                            hisse devri 30 Mayıs 2008’de tamamlanmıştır. XYZ Ticaret A.Ş. (Eski Unvanı:ABC
                            Perakendecilik ve T.A.Ş.) ve XYZ Türk T.A.Ş. 30 Nisan 2009’da birleşmiştir.
                        </p>
                    </Panel>
                </div>
            </div>
        </div>
    );
};

export default BasicReport;
