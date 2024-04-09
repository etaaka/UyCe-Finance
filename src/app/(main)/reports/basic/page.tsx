"use client";

import React, { useState } from "react";
import { Panel } from "primereact/panel";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { Partnership } from "../../../../service/types/partnership/Partnership";
import { FinancialLine } from "../../../../service/types/financial/line/FinancialLine";
import { Affiliate } from "../../../../service/types/affiliate/Affiliate";
import { AffiliateType } from "../../../../service/types/affiliate/AffiliateType";
import { Bank } from "../../../../service/types/bank/Bank";

const PanelDemo = () => {

  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [ithalat, setIthalat] = useState<FinancialLine[]>([]);

  const formatCurrency = (value: number) => {
    return value?.toLocaleString("en-US", {
      style: "currency",
      currency: "USD"
    });
  };
  const toplam = () => {
    let total = 0;

    for (let partner of partnerships) {
      total += partner.shareRatio;
    }

    return formatCurrency(total);
  };

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="TOPLAM:" footerStyle={{ textAlign: "left" }} />
        <Column footer={toplam} />
      </Row>
    </ColumnGroup>
  );

  function retrieveYears() {
    let year = new Date().getFullYear();
    let yy = []
    for (let i = 0; i < 5; i++) {
      yy.push({ field: year - i, header: year - i });
    }
    return yy;
  }

  const yearColumns = retrieveYears()


  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <h5>ŞİRKET DEĞERLENDİRME RAPORU</h5>
          <Panel header="ŞİRKET ÜNVANI VE İLETİŞİM BİLGİLERİ" toggleable>
            <div className="grid formgrid">
              <div className="col-12 mb-2 lg:col-3 lg:mb-0">
                                <span className="text-900 line-height-3">
                                    Şirket Ünvanı
                                </span>
              </div>
              <div className="col-12 mb-2 lg:col-9 lg:mb-0">
                                <span className="text-700 line-height-3">
                                    : XYZ Anonim Şirketi
                                </span>
              </div>
            </div>
            <div className="grid formgrid">
              <div className="col-12 mb-2 lg:col-3 lg:mb-0">
                <span className="text-900 line-height-3">
                    Adres
                </span>
              </div>
              <div className="col-12 mb-2 lg:col-9 lg:mb-0">
                <span className="text-700 line-height-3">
                    : ……………………… Cad. No: 12 …………….. / İstanbul
                </span>
              </div>
            </div>
            <div className="grid formgrid">
              <div className="col-12 mb-2 lg:col-3 lg:mb-0">
                <span className="text-900 line-height-3">
                    Telefon
                </span>
              </div>
              <div className="col-12 mb-2 lg:col-9 lg:mb-0">
                <span className="text-700 line-height-3">
                    : 0216 000 00 00
                </span>
              </div>
            </div>
            <div className="grid formgrid">
              <div className="col-12 mb-2 lg:col-3 lg:mb-0">
                <span className="text-900 line-height-3">
                    Faks
                </span>
              </div>
              <div className="col-12 mb-2 lg:col-9 lg:mb-0">
                                <span className="text-700 line-height-3">
                                    : 0216 000 00 00
                                </span>
              </div>
            </div>
            <div className="grid formgrid">
              <div className="col-12 mb-2 lg:col-3 lg:mb-0">
                                <span className="text-900 line-height-3">
                                    E-mail
                                </span>
              </div>
              <div className="col-12 mb-2 lg:col-9 lg:mb-0">
                                <span className="text-700 line-height-3">
                                    : maliXYZ@XYZ.com.tr
                                </span>
              </div>
            </div>
            <div className="grid formgrid">
              <div className="col-12 mb-2 lg:col-3 lg:mb-0">
                                <span className="text-900 line-height-3">
                                    Web Sayfası
                                </span>
              </div>
              <div className="col-12 mb-2 lg:col-9 lg:mb-0">
                                <span className="text-700 line-height-3">
                                    : www.XYZ kurumsal.com
                                </span>
              </div>
            </div>
          </Panel>
          <Panel header="SKOR PUANI" toggleable>
            <div className="grid formgrid">
              <div className="col-12 mb-2 lg:col-3 lg:mb-0">
                                <span className="text-900 line-height-3">
                                    Değerleme Yorumu
                                </span>
              </div>
              <div className="col-12 mb-2 lg:col-9 lg:mb-0">
                                <span className="text-700 line-height-3">
                                    : XYZ Ticaret A.Ş.’nin 2011 yılında zarar etmiş olması, borçlanma oranlarının yüksek olması, buna rağmen net faaliyet marjının ve likidite oranlarının pozitif görünümde olması nedeni ile Orta Risk Grubunda değerlendirmemize neden olmuştur.
                                </span>
              </div>
            </div>
            <div className="grid formgrid">
              <div className="col-12 mb-2 lg:col-3 lg:mb-0">
                                <span className="text-900 line-height-3">
                                    Finansal Gücü
                                </span>
              </div>
              <div className="col-12 mb-2 lg:col-9 lg:mb-0">
                                <span className="text-700 line-height-3">
                                    : Orta
                                </span>
              </div>
            </div>
            <div className="grid formgrid">
              <div className="col-12 mb-2 lg:col-3 lg:mb-0">
                                <span className="text-900 line-height-3">
                                    UyCe Finance Skoru
                                </span>
              </div>
              <div className="col-12 mb-2 lg:col-9 lg:mb-0">
                                <span className="text-700 line-height-3">
                                    : 3
                                </span>
              </div>
            </div>
            <div className="grid formgrid">
              <div className="col-12 mb-2 lg:col-3 lg:mb-0">
                                <span className="text-900 line-height-3">
                                    Önceki UyCe Finance Skoru
                                </span>
              </div>
              <div className="col-12 mb-2 lg:col-9 lg:mb-0">
                                <span className="text-700 line-height-3">
                                    : -
                                </span>
              </div>
            </div>
            <div className="grid formgrid">
              <div className="col-12 mb-2 lg:col-3 lg:mb-0">
                                <span className="text-900 line-height-3">
                                    Geçerlilik Süresi
                                </span>
              </div>
              <div className="col-12 mb-2 lg:col-9 lg:mb-0">
                                <span className="text-700 line-height-3">
                                    : 1 Yıl
                                </span>
              </div>
            </div>
            <div className="grid formgrid">
              <div className="col-12 mb-2 lg:col-3 lg:mb-0">
                                <span className="text-900 line-height-3">
                                    Kredi Limiti
                                </span>
              </div>
              <div className="col-12 mb-2 lg:col-9 lg:mb-0">
                                <span className="text-700 line-height-3">
                                    : Firmanın sektöründeki öneminden dolayı kredi limiti belirlenemez
                                </span>
              </div>
            </div>
            <div className="grid formgrid">
              <div className="col-12 mb-2 lg:col-3 lg:mb-0">
                                <span className="text-900 line-height-3">
                                    Risk Grubu
                                </span>
              </div>
              <div className="col-12 mb-2 lg:col-9 lg:mb-0">
                                <span className="text-700 line-height-3">
                                    : 5
                                </span>
              </div>
            </div>
            <div className="grid formgrid">
              <div className="col-12 mb-2 lg:col-3 lg:mb-0">
                                <span className="text-900 line-height-3">
                                    Finansal Görünüm
                                </span>
              </div>
              <div className="col-12 mb-2 lg:col-9 lg:mb-0">
                                <span className="text-700 line-height-3">
                                    : Durağan
                                </span>
              </div>
            </div>
          </Panel>
          <Panel header="ŞİRKET BİLGİLERİ" toggleable>
            <div className="grid formgrid">
              <div className="col-12 mb-2 lg:col-3 lg:mb-0">
                                <span className="text-900 line-height-3">
                                    Kuruluş Tarihi
                                </span>
              </div>
              <div className="col-12 mb-2 lg:col-9 lg:mb-0">
                <span className="text-700 line-height-3">
                    : 19/03/2008
                </span>
              </div>
            </div>
            <div className="grid formgrid">
              <div className="col-12 mb-2 lg:col-3 lg:mb-0">
                <span className="text-900 line-height-3">
                    Yasal Şekil
                </span>
              </div>
              <div className="col-12 mb-2 lg:col-9 lg:mb-0">
                <span className="text-700 line-height-3">
                    : Anonim Şirket
                </span>
              </div>
            </div>
            <div className="grid formgrid">
              <div className="col-12 mb-2 lg:col-3 lg:mb-0">
                <span className="text-900 line-height-3">
                    Ticaret Sicil No
                </span>
              </div>
              <div className="col-12 mb-2 lg:col-9 lg:mb-0">
                <span className="text-700 line-height-3">
                    : -5-8-6
                </span>
              </div>
            </div>
            <div className="grid formgrid">
              <div className="col-12 mb-2 lg:col-3 lg:mb-0">
                <span className="text-900 line-height-3">
                    Vergi Dairesi/No
                </span>
              </div>
              <div className="col-12 mb-2 lg:col-9 lg:mb-0">
                <span className="text-700 line-height-3">
                    : Büyük Mükellefler Vergi Dairesi / -2-0-2-5-3
                </span>
              </div>
            </div>
            <div className="grid formgrid">
              <div className="col-12 mb-2 lg:col-3 lg:mb-0">
                <span className="text-900 line-height-3">
                    Çalışan Sayısı
                </span>
              </div>
              <div className="col-12 mb-2 lg:col-9 lg:mb-0">
                <span className="text-700 line-height-3">
                    : 17.478
                </span>
              </div>
            </div>
            <div className="grid formgrid">
              <div className="col-12 mb-2 lg:col-3 lg:mb-0">
                <span className="text-900 line-height-3">
                    Satışlar
                </span>
              </div>
              <div className="col-12 mb-2 lg:col-9 lg:mb-0">
                <span className="text-700 line-height-3">
                    : 5,8 Milyar TL
                </span>
              </div>
            </div>
            <div className="grid formgrid">
              <div className="col-12 mb-2 lg:col-3 lg:mb-0">
                <span className="text-900 line-height-3">
                    Kar/Zarar
                </span>
              </div>
              <div className="col-12 mb-2 lg:col-9 lg:mb-0">
                <span className="text-700 line-height-3">
                    : -163 Milyon TL
                </span>
              </div>
            </div>
            <div className="grid formgrid">
              <div className="col-12 mb-2 lg:col-3 lg:mb-0">
                <span className="text-900 line-height-3">
                    Özkaynaklar
                </span>
              </div>
              <div className="col-12 mb-2 lg:col-9 lg:mb-0">
                <span className="text-700 line-height-3">
                    : 1,2 Milyar TL
                </span>
              </div>
            </div>
            <div className="grid formgrid">
              <div className="col-12 mb-2 lg:col-3 lg:mb-0">
                <span className="text-900 line-height-3">
                    Kayıtlı Sermaye
                </span>
              </div>
              <div className="col-12 mb-2 lg:col-9 lg:mb-0">
                <span className="text-700 line-height-3">
                    : -
                </span>
              </div>
            </div>
            <div className="grid formgrid">
              <div className="col-12 mb-2 lg:col-3 lg:mb-0">
                <span className="text-900 line-height-3">
                    Ödenmiş Sermaye
                </span>
              </div>
              <div className="col-12 mb-2 lg:col-9 lg:mb-0">
                <span className="text-700 line-height-3">
                    : 178 Milyon TL
                </span>
              </div>
            </div>
          </Panel>
          <Panel header="ORTAKLIK YAPISI VE YÖNETİM KADROSU" toggleable>
                        <span className="text-900 line-height-3">
                            1 Aralık 2011 itibariyle Ortaklık Yapısı:
                        </span>
            <DataTable value={partnerships.filter(value => value.shareRatio != null && value.shareRatio != 0)}
                       footerColumnGroup={footerGroup}>
              <Column field="name" header="Adı Soyadı-Ticari Ünvanı" style={{ width: "50%" }} />
              <Column field="price" header="(%)" style={{ width: "50%" }} body={(data) => formatCurrency(data.price)} />
            </DataTable>

            <DataTable value={partnerships.filter(value => value.boardOfDirectorType != null)} header="YÖNETİM KURULU">
              <Column field="name" header="Adı" style={{ width: "20%" }} />
              <Column field="surname" header="Soyadı" style={{ width: "20%" }} />
              <Column field="boardOfDirectorType" header="Ünvan" style={{ width: "60%" }} />
            </DataTable>

            <DataTable value={partnerships.filter(value => value.seniorManagementType != null)} header="ÜST YÖNETİM">
              <Column field="name" header="Adı" style={{ width: "20%" }} />
              <Column field="surname" header="Soyadı" style={{ width: "20%" }} />
              <Column field="seniorManagementType" header="Ünvan" style={{ width: "20%" }} />
              <Column field="education" header="Eğitim" style={{ width: "20%" }} />
              <Column field="experienceYear" header="Deneyim (Yıl)" style={{ width: "20%" }} />
            </DataTable>
          </Panel>
          <Panel header="FAALİYET İLE İLGİLİ BİLGİLER" toggleable>
            <div className="grid formgrid">
              <div className="col-12 mb-2 lg:col-3 lg:mb-0">
                <span className="text-900 line-height-3">
                    Faaliyet Konusu
                </span>
              </div>
              <div className="col-12 mb-2 lg:col-9 lg:mb-0">
                <span className="text-700 line-height-3">
                    : xxxxxxxxxxxxxxxxxxxxxxxxxxxxx perakende ve perakende tüketimine yönelik toptan satışını yapmak
                </span>
              </div>
            </div>
            <div className="grid formgrid">
              <div className="col-12 mb-2 lg:col-3 lg:mb-0">
                <span className="text-900 line-height-3">
                    Sunduğu Hizmetler
                </span>
              </div>
              <div className="col-12 mb-2 lg:col-9 lg:mb-0">
                <span className="text-700 line-height-3">
                    : Gıda ve ihtiyaç maddeleri, kırtasiye, züccaciye, beyaz eşya, kitap, kaset ve konfeksiyon ürünleri perakende satışı
                </span>
              </div>
            </div>

            <DataTable value={ithalat}>
              <Column field="name" style={{ width: "20%" }} />
              {yearColumns.map((col, i) => (
                <Column key={col.field} field={col.field} header={col.header} />
              ))}
            </DataTable>

            <DataTable value={affiliates.filter(value => value.affiliateType == AffiliateType.AFFILIATE)} header="İştirakler">
              <Column field="name" header="Unvan" style={{ width: "20%" }} />
              <Column field="country" header="Ülke" style={{ width: "20%" }} />
              <Column field="activity" header="Faaliyet Konusu" style={{ width: "60%" }} />
            </DataTable>
            <DataTable value={affiliates.filter(value => value.affiliateType == AffiliateType.AFFILIATE_PARTNERSHIP)} header="Bağlı Ortaklıklar">
              <Column field="name" header="Unvan" style={{ width: "20%" }} />
              <Column field="country" header="Ülke" style={{ width: "20%" }} />
              <Column field="activity" header="Faaliyet Konusu" style={{ width: "60%" }} />
            </DataTable>
          </Panel>
          <Panel header="ÇALIŞTIĞI BANKALAR" toggleable>
            <DataTable value={banks}>
              <Column field="name" header="Banka Adı"  />
              <Column field="country" header="Kredi Limiti" />
              <Column field="activity" header="Nakit Kredi" />
              <Column field="activity" header="Gayrinakdi Kredi"  />
              <Column field="activity" header="Teminat"  />
              <Column field="activity" header="Mevduat" />
            </DataTable>
          </Panel>
          <Panel header="TİCARİ ÖDEMELER" toggleable>
            <p>
              Protestolu Senetleri ve Karşılıksız Çekleri varsa, bunlara ilişkin görüş bildirilecektir.
            </p>
          </Panel>
          <Panel header="ADLİ SÜREÇLER" toggleable>
            <p>
              Tespit edilen dava ve mahkemeleri varsa burada belirtilecektir.
            </p>
          </Panel>
          <Panel header="ŞİRKET PROFİLİ" toggleable>
            <p>
              19XX yılında XYZ Kooperatifler Birliği ve İstanbul Belediyesi’nin ortak girişimi ile İstanbul’da kurulmuştur. İlk mağazasını ……………..’nda açan XYZ ’un çoğunluk hisseleri 19XX yılında KLM Grubu tarafından devralınmış ve bu tarihten itibaren mağazalarının sayısı ve marka değeri hızla artmıştır. XYZ 19XX yılında halka açılmıştır. XYZ , 20XX yılında ulusal perakende zinciri MNO’yu satın alarak sektördeki payını arttırmıştır. 2008 yılında KLM grubunun perakende sektöründen çıkma kararı neticesinde KLM grubu sahip olduğu hisseleri yaklaşık 2 Milyar TL karşılığında Uluslararası bir girişim sermayesi şirketi olan -- Partners tarafından yönetilen fonların kontrol ettiği ABC Capital S.A ‘ya satılmıştır. Satış sonucunda XYZ Ticaret A.Ş. (Eski Unvanı:ABC Perakendecilik ve T.A.Ş.) ve XYZ Türk T.A.Ş. 30 Nisan 2009’da birleşmiştir.
            </p>
            <p>
              2011 yılsonu itibarıyla yurt içinde 7 coğrafi bölgede 262 M, 190 MM, 59 MMM, 16 5M, 177 Tansaş, 13 Macrocenter ve yurt dışında iştirakleri aracılığıyla Kazakistan’da 23 ve Makedonya’da 5 Ramstore olmak üzere toplam 745 mağazası bulunmaktadır.
            </p>
          </Panel>
          <Panel header="ŞİRKET HAKKINDA ÖNEMLİ DEĞİŞİKLİKLER" toggleable>
            <p>
              Şubat 2008’de KLM Holding A.Ş. tarafından XYZ ’un %50,83 oranındaki hissesinin, ABC Perakendecilik ve T.A.Ş.’ye devredilmesine ilişkin hisse devir sözleşmesi imzalanmış ve hisse devri 30 Mayıs 2008’de tamamlanmıştır. XYZ Ticaret A.Ş. (Eski Unvanı:ABC Perakendecilik ve T.A.Ş.) ve XYZ Türk T.A.Ş. 30 Nisan 2009’da birleşmiştir.
            </p>
            <p>
              ABC Perakendecilik ve T.A.Ş. ünvanı 30 Nisan 2009’da XYZ Ticaret A.Ş. olarak değiştirilmiştir.
            </p>
          </Panel>

          <Panel header="FİNANSAL BİLGİLER" toggleable>
            <p>
              Şubat 2008’de KLM Holding A.Ş. tarafından XYZ ’un %50,83 oranındaki hissesinin, ABC Perakendecilik ve T.A.Ş.’ye devredilmesine ilişkin hisse devir sözleşmesi imzalanmış ve hisse devri 30 Mayıs 2008’de tamamlanmıştır. XYZ Ticaret A.Ş. (Eski Unvanı:ABC Perakendecilik ve T.A.Ş.) ve XYZ Türk T.A.Ş. 30 Nisan 2009’da birleşmiştir.
            </p>
          </Panel>

          <Panel header="RASYOLAR" toggleable>
            <p>
              Şubat 2008’de KLM Holding A.Ş. tarafından XYZ ’un %50,83 oranındaki hissesinin, ABC Perakendecilik ve T.A.Ş.’ye devredilmesine ilişkin hisse devir sözleşmesi imzalanmış ve hisse devri 30 Mayıs 2008’de tamamlanmıştır. XYZ Ticaret A.Ş. (Eski Unvanı:ABC Perakendecilik ve T.A.Ş.) ve XYZ Türk T.A.Ş. 30 Nisan 2009’da birleşmiştir.
            </p>
          </Panel>

          <Panel header="ŞİRKETİN RİSK PROFİLİ" toggleable>
            <p>
              Şubat 2008’de KLM Holding A.Ş. tarafından XYZ ’un %50,83 oranındaki hissesinin, ABC Perakendecilik ve T.A.Ş.’ye devredilmesine ilişkin hisse devir sözleşmesi imzalanmış ve hisse devri 30 Mayıs 2008’de tamamlanmıştır. XYZ Ticaret A.Ş. (Eski Unvanı:ABC Perakendecilik ve T.A.Ş.) ve XYZ Türk T.A.Ş. 30 Nisan 2009’da birleşmiştir.
            </p>
          </Panel>

          <Panel header="Rapor ile ilgili olarak İrtibat Kurulacak Kişiler" toggleable>
            <p>
              Şubat 2008’de KLM Holding A.Ş. tarafından XYZ ’un %50,83 oranındaki hissesinin, ABC Perakendecilik ve T.A.Ş.’ye devredilmesine ilişkin hisse devir sözleşmesi imzalanmış ve hisse devri 30 Mayıs 2008’de tamamlanmıştır. XYZ Ticaret A.Ş. (Eski Unvanı:ABC Perakendecilik ve T.A.Ş.) ve XYZ Türk T.A.Ş. 30 Nisan 2009’da birleşmiştir.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default PanelDemo;
