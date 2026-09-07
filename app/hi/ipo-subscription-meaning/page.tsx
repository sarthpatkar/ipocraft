import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/lib/site-url";

const hiUrl = canonicalUrl("/hi/ipo-subscription-meaning");
const enUrl = canonicalUrl("/ipo-subscription-meaning");
const mrUrl = canonicalUrl("/mr/ipo-subscription-meaning");
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: "IPO सब्सक्रिप्शन का मतलब क्या है? पूरी व्याख्या | IPOCraft",
  description:
    "IPO सब्सक्रिप्शन का मतलब, ओवरसब्सक्रिप्शन, अंडरसब्सक्रिप्शन, कैटेगरी-वार डिमांड, और यह अलॉटमेंट व लिस्टिंग को कैसे प्रभावित करता है — हिंदी में पूरी गाइड।",
  alternates: {
    canonical: hiUrl,
    languages: { en: enUrl, hi: hiUrl, mr: mrUrl, "x-default": enUrl },
  },
};

export default function IpoSubscriptionMeaningHindiPage() {
  return (
    <div
      lang="hi"
      className="min-h-screen scroll-smooth bg-[#f8fafc] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F5F9]"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#1C317A] dark:text-blue-400">
          IPO लर्निंग गाइड
        </p>

        <h1
          className="mt-3 text-2xl sm:text-3xl lg:text-[2.2rem] font-semibold leading-tight text-[#0f172a] dark:text-[#F1F5F9]"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          IPO सब्सक्रिप्शन का मतलब क्या है? पूरी व्याख्या ({CURRENT_YEAR} गाइड)
        </h1>

        <div className="mt-3 text-xs text-[#64748b] dark:text-[#9AA1AA] flex flex-wrap gap-3">
          <span>करीब 12 मिनट पढ़ें</span>
        </div>

        <p className="mt-6 text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
          IPO सब्सक्रिप्शन से तात्पर्य है कि निवेशकों ने आरंभिक सार्वजनिक निर्गम (IPO) में पेश किए
          गए कुल शेयरों की तुलना में कितनी बार शेयरों के लिए आवेदन किया। यह Retail, HNI (NII), और
          QIB श्रेणियों में मांग के स्तर को दर्शाता है। निवेशक अलॉटमेंट संभावना और संभावित लिस्टिंग
          प्रदर्शन का अनुमान लगाने के लिए रोज़ाना IPO सब्सक्रिप्शन की स्थिति को ट्रैक करते हैं।
        </p>

        <p className="mt-3 text-[13px] text-[#64748b] dark:text-[#9AA1AA]">
          Also available in{" "}
          <Link href="/ipo-subscription-meaning" className="text-[#1C317A] dark:text-blue-400 underline">
            English
          </Link>{" "}
          and{" "}
          <Link href="/mr/ipo-subscription-meaning" className="text-[#1C317A] dark:text-blue-400 underline">
            मराठी
          </Link>
          .
        </p>

        <nav
          aria-label="Jump to Section"
          className="mt-8 bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-xl p-5 sticky top-16 z-10"
        >
          <p className="text-sm font-semibold mb-3">इस पेज पर</p>
          <div className="grid sm:grid-cols-2 gap-2 text-sm">
            <a href="#meaning" className="text-[#1C317A] dark:text-blue-400 hover:underline">IPO सब्सक्रिप्शन का मतलब</a>
            <a href="#oversub" className="text-[#1C317A] dark:text-blue-400 hover:underline">ओवरसब्सक्रिप्शन</a>
            <a href="#undersub" className="text-[#1C317A] dark:text-blue-400 hover:underline">अंडरसब्सक्रिप्शन</a>
            <a href="#categories" className="text-[#1C317A] dark:text-blue-400 hover:underline">कैटेगरी-वार सब्सक्रिप्शन</a>
            <a href="#impact" className="text-[#1C317A] dark:text-blue-400 hover:underline">अलॉटमेंट पर असर</a>
            <a href="#listing" className="text-[#1C317A] dark:text-blue-400 hover:underline">लिस्टिंग पर असर</a>
            <a href="#faq" className="text-[#1C317A] dark:text-blue-400 hover:underline">FAQs</a>
          </div>
        </nav>

        <article className="mt-10 space-y-12">
          <Section id="meaning" title="IPO सब्सक्रिप्शन का क्या मतलब है?">
            <p>
              IPO सब्सक्रिप्शन से पता चलता है कि IPO में उपलब्ध शेयरों के मुक़ाबले कितनी बार
              निवेशकों ने शेयरों के लिए बोली लगाई है। उदाहरण के लिए, यदि किसी IPO में 10 लाख
              शेयर ऑफर हुए और उसके लिए 1 करोड़ शेयरों की बोली आई, तो इसे 10 गुना (10x) सब्सक्राइब
              कहा जाता है।
            </p>
            <p>
              यह सब्सक्रिप्शन अनुपात निवेशक की रुचि का एक महत्वपूर्ण संकेतक है और बाजार में मांग
              की ताकत का आकलन करने में मदद करता है।
            </p>
            <p>
              IPO सब्सक्रिप्शन डेटा को आमतौर पर तीन मुख्य श्रेणियों में बांटा जाता है: Retail
              Individual Investors (RII), High Net-worth Individuals (HNI या NII), और Qualified
              Institutional Buyers (QIB)। हर श्रेणी का अपना अलॉटमेंट कोटा और मांग की गतिशीलता
              होती है।
            </p>
          </Section>

          <Section id="oversub" title="IPO ओवरसब्सक्रिप्शन क्या है?">
            <p>
              ओवरसब्सक्रिप्शन तब होता है जब शेयरों की मांग, ऑफर किए गए शेयरों की संख्या से अधिक हो
              जाती है। उदाहरण के लिए, यदि किसी IPO के रिटेल हिस्से को 20 गुना सब्सक्राइब किया जाता
              है, तो इसका मतलब है निवेशकों ने Retail निवेशकों को आवंटित शेयरों से 20 गुना अधिक
              शेयरों के लिए आवेदन किया।
            </p>
            <p>
              ओवरसब्सक्रिप्शन को आम तौर पर एक सकारात्मक संकेत माना जाता है, जो कंपनी के सार्वजनिक
              होने में मजबूत निवेशक विश्वास और रुचि दर्शाता है। हालाँकि, इसका मतलब यह भी है कि सभी
              निवेशकों को शेयर नहीं मिलेंगे, क्योंकि अलॉटमेंट आनुपातिक रूप से या लॉटरी से होता है।
            </p>
            <p>
              बाजार की स्थितियों, कंपनी की प्रतिष्ठा, सेक्टर की रुचि और मूल्य निर्धारण के आधार पर
              ओवरसब्सक्रिप्शन अनुपात व्यापक रूप से भिन्न हो सकते हैं। उदाहरण के लिए, टेक्नोलॉजी
              IPO में अक्सर अन्य सेक्टरों की तुलना में अधिक ओवरसब्सक्रिप्शन देखने को मिलता है।
            </p>
          </Section>

          <Section id="undersub" title="IPO अंडरसब्सक्रिप्शन क्या है?">
            <p>
              अंडरसब्सक्रिप्शन तब होता है जब शेयरों की मांग, ऑफर किए गए शेयरों की संख्या से कम होती
              है। उदाहरण के लिए, 0.8x का सब्सक्रिप्शन अनुपात मतलब सिर्फ़ 80 प्रतिशत शेयरों के लिए
              ही आवेदन आया था।
            </p>
            <p>
              यह कमज़ोर निवेशक भावना, कंपनी के फंडामेंटल्स, मूल्य निर्धारण या बाज़ार की स्थितियों
              को लेकर चिंता का संकेत दे सकता है। कम सब्सक्राइब हुए IPO को अक्सर लिस्टिंग गेन में
              चुनौतियों का सामना करना पड़ता है और उन्हें प्राइस करेक्शन की ज़रूरत पड़ सकती है।
            </p>
            <p>
              कभी-कभी, अंडरसब्सक्रिप्शन कैटेगरी-विशिष्ट भी हो सकता है, जहाँ एक निवेशक वर्ग (जैसे
              Retail) ओवरसब्सक्राइब होता है जबकि दूसरा (जैसे QIB) अंडरसब्सक्राइब रहता है।
            </p>
          </Section>

          <Section id="categories" title="कैटेगरी-वार IPO सब्सक्रिप्शन समझें">
            <p>IPO शेयर तीन मुख्य निवेशक कैटेगरी में बांटे जाते हैं:</p>
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>
                <strong>Retail Individual Investors (RII):</strong> ₹2 लाख तक के शेयरों के लिए
                आवेदन करने वाले व्यक्तिगत निवेशक। रिटेल निवेशकों को आमतौर पर कुल शेयरों का 35%
                कोटा मिलता है।
              </li>
              <li>
                <strong>High Net-worth Individuals (HNI/NII):</strong> रिटेल सीमा से ऊपर आवेदन
                करने वाले निवेशक। इस कैटेगरी को अक्सर लगभग 15% अलॉटमेंट मिलता है।
              </li>
              <li>
                <strong>Qualified Institutional Buyers (QIB):</strong> म्यूचुअल फंड, बीमा कंपनियाँ
                और विदेशी संस्थागत निवेशकों जैसे संस्थागत निवेशक। QIB को आमतौर पर 50% अलॉटमेंट
                मिलता है।
              </li>
            </ul>
            <p>
              हर कैटेगरी का अलग-अलग सब्सक्रिप्शन अनुपात और मांग स्तर होता है। कैटेगरी-वार
              सब्सक्रिप्शन समझने से निवेशकों को यह अंदाज़ा लगाने में मदद मिलती है कि सबसे ज़्यादा
              रुचि कहाँ है और अलॉटमेंट की संभावना कैसी रहेगी।
            </p>
          </Section>

          <Section id="impact" title="IPO सब्सक्रिप्शन अलॉटमेंट को कैसे प्रभावित करता है">
            <p>
              अलॉटमेंट आवेदकों के बीच शेयरों के बंटवारे की प्रक्रिया है। जब कोई IPO ओवरसब्सक्राइब
              हो जाता है, तो शेयर प्रो-रेटा आधार पर या लॉटरी के ज़रिए आवंटित किए जाते हैं, खासकर
              रिटेल कैटेगरी में।
            </p>
            <p>
              रिटेल निवेशकों के लिए, ओवरसब्सक्रिप्शन से पूरा अलॉटमेंट मिलने की संभावना घट जाती है।
              उदाहरण के लिए, अगर रिटेल हिस्सा 10 गुना सब्सक्राइब हुआ है, तो 100 शेयरों के लिए
              आवेदन करने वाले निवेशक को सिर्फ़ 10 शेयर ही मिल सकते हैं।
            </p>
            <p>
              HNI और QIB कैटेगरी आमतौर पर आनुपातिक अलॉटमेंट का पालन करती हैं, जहाँ शेयर बोली के
              आकार के आधार पर आवंटित होते हैं।
            </p>
            <p>निष्पक्षता और पारदर्शिता सुनिश्चित करने के लिए अलॉटमेंट प्रक्रिया SEBI के नियमों से संचालित होती है।</p>
            <p>
              गहराई से समझने के लिए, हमारी{" "}
              <Link href="/hi/how-ipo-allotment-works" className="text-[#1C317A] dark:text-blue-400 underline">
                IPO अलॉटमेंट कैसे होता है
              </Link>{" "}
              गाइड देखें।
            </p>
          </Section>

          <Section id="listing" title="IPO सब्सक्रिप्शन लिस्टिंग गेन को कैसे प्रभावित करता है">
            <p>
              IPO सब्सक्रिप्शन स्तर अक्सर लिस्टिंग के दिन के प्रदर्शन को प्रभावित करते हैं। भारी
              ओवरसब्सक्राइब्ड IPO मजबूत मांग का संकेत देता है, जिससे संभावित रूप से लिस्टिंग गेन
              होता है क्योंकि निवेशक सेकेंडरी मार्केट में शेयर खरीदने के लिए दौड़ पड़ते हैं।
            </p>
            <p>
              हालाँकि, लिस्टिंग प्रदर्शन व्यापक बाज़ार की स्थितियों, सेक्टर के रुझानों और संस्थागत
              निवेशक की भावना पर भी निर्भर करता है।
            </p>
            <p>अंडरसब्सक्राइब्ड IPO को कमज़ोर लिस्टिंग भाव या इश्यू मूल्य से नीचे लिस्टिंग का सामना करना पड़ सकता है।</p>
            <p>
              निवेशकों को सब्सक्रिप्शन डेटा के साथ-साथ कंपनी के फंडामेंटल्स, वैल्यूएशन और बाज़ार
              के माहौल जैसे अन्य कारकों पर भी विचार करना चाहिए।
            </p>
          </Section>

          <Section id="faq" title="अक्सर पूछे जाने वाले सवाल (FAQs)">
            <dl className="space-y-6">
              <div>
                <dt className="font-semibold text-[#1C317A] dark:text-blue-400">10x IPO सब्सक्रिप्शन का क्या मतलब है?</dt>
                <dd className="mt-1 text-[#475569] dark:text-[#9AA1AA]">इसका मतलब है कि निवेशकों ने IPO में उपलब्ध शेयरों से 10 गुना अधिक शेयरों के लिए आवेदन किया है।</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#1C317A] dark:text-blue-400">क्या ज़्यादा IPO सब्सक्रिप्शन लिस्टिंग गेन की गारंटी देती है?</dt>
                <dd className="mt-1 text-[#475569] dark:text-[#9AA1AA]">नहीं। ज़्यादा सब्सक्रिप्शन मांग दर्शाती है, लेकिन लिस्टिंग बाज़ार की स्थितियों और संस्थागत रुचि पर निर्भर करती है।</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#1C317A] dark:text-blue-400">क्या IPO सब्सक्रिप्शन कैटेगरी के हिसाब से अलग-अलग हो सकता है?</dt>
                <dd className="mt-1 text-[#475569] dark:text-[#9AA1AA]">हाँ, अलग-अलग निवेशक आधार और कोटा की वजह से Retail, HNI और QIB कैटेगरी में सब्सक्रिप्शन अनुपात अक्सर भिन्न होते हैं।</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#1C317A] dark:text-blue-400">ओवरसब्सक्राइब्ड IPO में अलॉटमेंट कैसे तय होता है?</dt>
                <dd className="mt-1 text-[#475569] dark:text-[#9AA1AA]">Retail अलॉटमेंट आमतौर पर लॉटरी से होता है, जबकि HNI और QIB अलॉटमेंट बोली के अनुपात में होता है।</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#1C317A] dark:text-blue-400">IPO सब्सक्रिप्शन स्टेटस कहाँ चेक करें?</dt>
                <dd className="mt-1 text-[#475569] dark:text-[#9AA1AA]">IPO सब्सक्रिप्शन स्टेटस IPO अवधि के दौरान स्टॉक एक्सचेंज की वेबसाइट और फाइनेंशियल पोर्टल पर रोज़ाना प्रकाशित होता है।</dd>
              </div>
            </dl>
          </Section>

          <Section id="related-resources" title="संबंधित IPO लर्निंग रिसोर्स">
            <p>सब्सक्रिप्शन डेटा को GMP, अलॉटमेंट और निवेशक कैटेगरी के नियमों से जोड़कर समझने के लिए देखें:</p>
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li><Link href="/hi/what-is-ipo-gmp" className="text-[#1C317A] dark:text-blue-400 underline">IPO GMP क्या है</Link></li>
              <li><Link href="/hi/ipo-grey-market-guide" className="text-[#1C317A] dark:text-blue-400 underline">IPO ग्रे मार्केट गाइड</Link></li>
              <li><Link href="/hi/how-ipo-allotment-works" className="text-[#1C317A] dark:text-blue-400 underline">IPO अलॉटमेंट कैसे होता है</Link></li>
              <li><Link href="/hi/qib-hni-retail-explained" className="text-[#1C317A] dark:text-blue-400 underline">QIB बनाम HNI बनाम Retail</Link></li>
              <li><Link href="/hi/ipo-cut-off-price-meaning" className="text-[#1C317A] dark:text-blue-400 underline">Cut-off Price का मतलब</Link></li>
              <li><Link href="/ipo-allotment-probability-calculator" className="text-[#1C317A] dark:text-blue-400 underline">IPO अलॉटमेंट प्रोबेबिलिटी कैलकुलेटर</Link></li>
            </ul>
          </Section>
        </article>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "10x IPO सब्सक्रिप्शन का क्या मतलब है?", acceptedAnswer: { "@type": "Answer", text: "इसका मतलब है कि निवेशकों ने IPO में उपलब्ध शेयरों से 10 गुना अधिक शेयरों के लिए आवेदन किया है।" } },
              { "@type": "Question", name: "क्या ज़्यादा IPO सब्सक्रिप्शन लिस्टिंग गेन की गारंटी देती है?", acceptedAnswer: { "@type": "Answer", text: "नहीं। ज़्यादा सब्सक्रिप्शन मांग दर्शाती है, लेकिन लिस्टिंग बाज़ार की स्थितियों और संस्थागत रुचि पर निर्भर करती है।" } },
              { "@type": "Question", name: "ओवरसब्सक्राइब्ड IPO में अलॉटमेंट कैसे तय होता है?", acceptedAnswer: { "@type": "Answer", text: "Retail अलॉटमेंट आमतौर पर लॉटरी से होता है, जबकि HNI और QIB अलॉटमेंट बोली के अनुपात में होता है।" } },
            ],
          }),
        }}
      />
    </div>
  );
}

function Section({ id, title, children }: any) {
  return (
    <div id={id} className="scroll-mt-24">
      <h2
        className="text-xl sm:text-2xl font-semibold mb-4 text-[#0f172a] dark:text-[#F1F5F9]"
        style={{ fontFamily: "var(--font-outfit)" }}
      >
        {title}
      </h2>
      <div className="text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed space-y-4">
        {children}
      </div>
    </div>
  );
}
