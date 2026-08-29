import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/lib/site-url";

const mrUrl = canonicalUrl("/mr/how-ipo-allotment-works");
const enUrl = canonicalUrl("/how-ipo-allotment-works");
const hiUrl = canonicalUrl("/hi/how-ipo-allotment-works");
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: "भारतात IPO वाटप कसे होते? संपूर्ण प्रक्रिया (Retail, HNI, QIB) | IPOCraft",
  description:
    "भारतात IPO वाटप कसे ठरते — रिटेल कोटा, HNI वाटप, ओव्हरसबस्क्रिप्शन नियम, लॉटरी प्रणाली, आणि परतावा प्रक्रिया — मराठीत सविस्तर मार्गदर्शक.",
  alternates: {
    canonical: mrUrl,
    languages: { en: enUrl, hi: hiUrl, mr: mrUrl, "x-default": enUrl },
  },
};

export default function HowIpoAllotmentWorksMarathiPage() {
  return (
    <div
      lang="mr"
      className="min-h-screen scroll-smooth bg-[#f8fafc] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F5F9]"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <p className="text-[11px] tracking-[0.22em] uppercase text-[#1C317A] dark:text-blue-400 font-semibold mb-4">
          IPO मार्गदर्शक
        </p>

        <h1
          className="text-2xl sm:text-3xl lg:text-[2.5rem] font-semibold leading-tight text-[#0f172a] dark:text-[#F1F5F9]"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          भारतात IPO वाटप कसे होते? संपूर्ण प्रक्रिया ({CURRENT_YEAR})
        </h1>

        <p className="mt-6 text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
          IPO वाटप ही प्रक्रिया आहे ज्याद्वारे बोली कालावधी संपल्यानंतर गुंतवणूकदारांना शेअर्स
          वितरित केले जातात. जेव्हा मागणी पुरवठ्यापेक्षा जास्त होते (ओव्हरसबस्क्रिप्शन), तेव्हा
          वाटप स्टॉक एक्सचेंज आणि SEBI च्या नियमांनुसार ठरलेल्या संरचित पद्धतीने होते.
        </p>

        <p className="mt-4 text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
          सबस्क्रिप्शन प्रमाण आणि{" "}
          <Link href="/mr/gmp" className="text-[#1C317A] dark:text-blue-400 underline">
            IPO GMP
          </Link>{" "}
          द्वारे IPO मागणीचा मागोवा घेणाऱ्या गुंतवणूकदारांना अनेकदा हे समजून घ्यायचे असते की
          शेअर्सचे वाटप प्रत्यक्षात कसे होते. हे मार्गदर्शक Retail, HNI आणि QIB श्रेणींसाठी
          संपूर्ण वाटप यंत्रणा स्पष्ट करते.
        </p>

        <p className="mt-3 text-[13px] text-[#64748b] dark:text-[#9AA1AA]">
          Also available in{" "}
          <Link href="/how-ipo-allotment-works" className="text-[#1C317A] dark:text-blue-400 underline">
            English
          </Link>{" "}
          and{" "}
          <Link href="/hi/how-ipo-allotment-works" className="text-[#1C317A] dark:text-blue-400 underline">
            हिंदी
          </Link>
          .
        </p>

        <div className="mt-8 sticky top-24 z-30 bg-white dark:bg-[#111418]/95 backdrop-blur border border-[#e2e8f0] dark:border-[#252A31] rounded-xl p-5 shadow-sm">
          <p className="text-sm font-semibold mb-3">या पानावर</p>
          <div className="grid sm:grid-cols-2 gap-2 text-sm">
            <a href="#timeline" className="text-[#1C317A] dark:text-blue-400 hover:underline">IPO वेळापत्रक</a>
            <a href="#retail" className="text-[#1C317A] dark:text-blue-400 hover:underline">Retail वाटप</a>
            <a href="#hni" className="text-[#1C317A] dark:text-blue-400 hover:underline">HNI वाटप</a>
            <a href="#qib" className="text-[#1C317A] dark:text-blue-400 hover:underline">QIB वाटप</a>
            <a href="#probability" className="text-[#1C317A] dark:text-blue-400 hover:underline">शक्यता उदाहरण</a>
            <a href="#comparison" className="text-[#1C317A] dark:text-blue-400 hover:underline">वाटप विरुद्ध GMP विरुद्ध लिस्टिंग</a>
          </div>
        </div>

        <div className="mt-10 space-y-12">
          <div id="timeline">
            <Section title="IPO वाटप वेळापत्रक">
              <ul className="list-disc pr-6 pl-6 space-y-2">
                <li>IPO सबस्क्रिप्शनसाठी खुला होतो</li>
                <li>बोली कालावधीनंतर IPO बंद होतो</li>
                <li>Basis of Allotment निश्चित होते</li>
                <li>शेअर्स डिमॅट खात्यात जमा होतात</li>
                <li>ज्यांना वाटप मिळाले नाही त्यांचा परतावा सुरू होतो</li>
                <li>स्टॉक एक्सचेंजवर लिस्टिंग होते</li>
              </ul>
              <p>
                तुम्ही{" "}
                <Link href="/ipo-calendar" className="text-[#1C317A] dark:text-blue-400 underline">
                  IPO कॅलेंडर
                </Link>{" "}
                द्वारे आगामी IPO वेळापत्रक ट्रॅक करू शकता.
              </p>
            </Section>
          </div>

          <Section title="IPO वाटप श्रेणी">
            <p>IPO शेअर्स निश्चित श्रेणींमध्ये विभागले जातात:</p>
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>Retail Individual Investors (RII)</li>
              <li>High Net-worth Individuals (HNI / NII)</li>
              <li>Qualified Institutional Buyers (QIB)</li>
              <li>Anchor Investors (काही IPO मध्ये)</li>
            </ul>
          </Section>

          <div id="retail">
            <Section title="Retail IPO वाटप कसे होते">
              <p>
                Retail श्रेणीत, IPO ओव्हरसबस्क्राइब झाल्यास वाटप अनेकदा लॉटरी प्रणालीद्वारे केले
                जाते. वैयक्तिक गुंतवणूकदारांमध्ये समान वितरण सुनिश्चित करणे हे उद्दिष्ट असते.
              </p>
              <p>
                जर एखाद्या IPO ला Retail मध्ये 10 पट सबस्क्रिप्शन मिळाले, तर फक्त काही अर्जदारांनाच
                एक लॉट मिळेल. जास्तीत जास्त गुंतवणूकदारांना किमान एक लॉट मिळावे यालाच प्राधान्य
                दिले जाते.
              </p>
            </Section>
          </div>

          <div id="hni">
            <Section title="HNI (NII) वाटप कसे होते">
              <p>HNI वाटप लॉटरीवर आधारित नसून प्रमाणानुसार असते. अर्ज केलेल्या शेअर्सच्या संख्येच्या प्रमाणात शेअर्स वाटप होतात.</p>
              <p>जर HNI सबस्क्रिप्शन 5 पट असेल, तर अर्जदारांना त्यांच्या मागणी केलेल्या प्रमाणाच्या अंदाजे एक-पंचमांश मिळू शकते.</p>
            </Section>
          </div>

          <div id="qib">
            <Section title="QIB वाटप कसे होते">
              <p>QIB वाटप पूर्णपणे प्रमाणानुसार असते. संस्थात्मक गुंतवणूकदारांना एकूण संस्थात्मक मागणीच्या तुलनेत त्यांच्या अर्जाच्या आकारावर आधारित वाटप मिळते.</p>
            </Section>
          </div>

          <Section title="Basis of Allotment म्हणजे काय?">
            <p>Basis of Allotment हे स्टॉक एक्सचेंजने मंजूर केलेले अंतिम वाटप दस्तऐवज आहे. हे शेअर्सचे वाटप श्रेणींमध्ये कसे झाले हे स्पष्ट करते.</p>
          </Section>

          <Section title="IPO मधील परतावा प्रक्रिया">
            <p>शेअर्स वाटप न झाल्यास, ASBA मध्ये ब्लॉक केलेली रक्कम गुंतवणूकदाराच्या बँक खात्यात परत पाठवली जाते. परतावा सामान्यतः लिस्टिंगपूर्वी होतो.</p>
          </Section>

          <Section title="सामान्य IPO वाटप परिस्थिती">
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>अंडरसबस्क्राइब्ड IPO - पूर्ण वाटप</li>
              <li>मध्यम ओव्हरसबस्क्रिप्शन - आंशिक वाटप</li>
              <li>तीव्र ओव्हरसबस्क्रिप्शन - लॉटरी (Retail)</li>
            </ul>
          </Section>

          <Section title="प्रगत माहिती: ओव्हरसबस्क्राइब्ड IPO मधील शक्यता">
            <p>Retail वाटपाची शक्यता एकूण उपलब्ध Retail लॉट एकूण Retail अर्जांनी भागून अंदाजित करता येते. तथापि, प्रत्यक्ष वाटप वैध बोली आणि श्रेणी नियमांवर अवलंबून असते.</p>
          </Section>

          <Section title="IPO वाटप शक्यता गणनेचे तर्कशास्त्र">
            <p>तुम्ही एका सोप्या सूत्राने Retail वाटप शक्यतेचा अंदाज घेऊ शकता:</p>
            <div className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4 text-sm font-medium">
              शक्यता (%) = (उपलब्ध Retail लॉट ÷ Retail अर्ज) × 100
            </div>
            <p>उदाहरण:</p>
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>Retail लॉट: 15,000</li>
              <li>अर्ज: 1,50,000</li>
              <li>शक्यता ≈ 10%</li>
            </ul>
            <p>हा अंदाज समान लॉट वितरण आणि वैध अर्ज गृहीत धरतो. श्रेणीनुसार बदल झाल्यास प्रत्यक्ष वाटप वेगळे असू शकते.</p>
          </Section>

          <Section title="SME IPO वाटपातील फरक">
            <p>SME IPO मध्ये अनेकदा लॉट आकार मोठा आणि तरलता कमी असते. वाटप तरीही संरचित पद्धतीने होऊ शकते, पण लहान गुंतवणूकदार गटांचा त्यावर परिणाम होऊ शकतो.</p>
          </Section>

          <div id="probability">
            <Section title="तपशीलवार Retail लॉटरी उदाहरण (गणितासह)">
              <p>समजा एका IPO मध्ये Retail गुंतवणूकदारांसाठी 10,00,000 शेअर्स राखीव आहेत, आणि लॉट साइज 50 शेअर्स आहे. म्हणजे 20,000 Retail लॉट उपलब्ध आहेत.</p>
              <p>जर 2,00,000 वैध Retail अर्ज आले, तर IPO Retail श्रेणीत 10 पट ओव्हरसबस्क्राइब झाला.</p>
              <p>फक्त 20,000 लॉट उपलब्ध असताना 2,00,000 अर्जदारांनी अर्ज केला, त्यामुळे एक लॉट मिळण्याची शक्यता अंदाजे इतकी असते:</p>
              <div className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4 text-sm font-medium text-[#0f172a] dark:text-[#F1F5F9]">
                शक्यता ≈ 20,000 ÷ 2,00,000 = 10%
              </div>
              <p>अशा प्रकरणांमध्ये, वाटप स्टॉक एक्सचेंजने मंजूर केलेल्या संगणकीकृत लॉटरी प्रणालीद्वारे केले जाते.</p>
            </Section>
          </div>

          <div id="comparison">
            <Section title="वाटप विरुद्ध GMP विरुद्ध लिस्टिंग - फरक काय आहे?">
              <p>IPO वाटप, Grey Market Premium (GMP), आणि लिस्टिंग नफा अनेकदा गोंधळात टाकतात, पण ते IPO जीवनचक्रातील वेगवेगळे टप्पे दर्शवतात.</p>
              <ul className="list-disc pr-6 pl-6 space-y-2">
                <li><strong>वाटप:</strong> IPO बंद झाल्यानंतर शेअर्सचे वितरण.</li>
                <li><strong>GMP:</strong> लिस्टिंगपूर्वी जाणवणाऱ्या मागणीचे संकेत देणारा अनधिकृत प्रीमियम.</li>
                <li><strong>लिस्टिंग:</strong> स्टॉक एक्सचेंजवरील व्यवहाराचा पहिला दिवस.</li>
              </ul>
              <p>GMP भावना दर्शवते, वाटप वाटप नियम दर्शवते, आणि लिस्टिंग मागणी-पुरवठ्यावर आधारित खरी बाजार किंमत दर्शवते.</p>
            </Section>
          </div>

          <Section title="खरी ओव्हरसबस्क्रिप्शन केस परिस्थिती">
            <p>अनेक लोकप्रिय IPO मध्ये, Retail सबस्क्रिप्शन 30x किंवा 50x पेक्षाही जास्त असू शकते. अशा परिस्थितीत, फक्त थोड्याच अर्जदारांना किमान एक लॉट मिळतो.</p>
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>Retail श्रेणी लॉटरी-आधारित वाटप वापरते</li>
              <li>HNI श्रेणी प्रमाणबद्ध वाटपाचे अनुसरण करते</li>
              <li>QIB श्रेणी पूर्णपणे प्रमाणबद्ध वितरण वापरते</li>
            </ul>
            <p>मजबूत बाजार भावना असूनही, तीव्र ओव्हरसबस्क्राइब्ड IPO मध्ये Retail वाटपाची शक्यता लक्षणीयरीत्या कमी होते.</p>
          </Section>

          <Section title="टप्प्याटप्प्याने ASBA प्रक्रिया">
            <p>ASBA (Application Supported by Blocked Amount) ही भारतातील IPO अर्जांसाठी वापरली जाणारी यंत्रणा आहे.</p>
            <ol className="list-decimal pr-6 pl-6 space-y-2">
              <li>गुंतवणूकदार बँक किंवा ब्रोकरद्वारे IPO साठी अर्ज करतो.</li>
              <li>अर्जाची रक्कम बँक खात्यात ब्लॉक केली जाते.</li>
              <li>शेअर्स वाटप झाल्यास, रक्कम वजा केली जाते.</li>
              <li>वाटप न झाल्यास, ब्लॉक केलेली रक्कम मोकळी केली जाते.</li>
            </ol>
            <p>अंतिम वाटप निश्चित होईपर्यंत गुंतवणूकदाराचा निधी सुरक्षित राहील याची खात्री ही प्रणाली करते.</p>
          </Section>

          <Section title="IPO वाटप स्थिती कशी तपासावी">
            <p>गुंतवणूकदार वाटप तारखेनंतर अधिकृत रजिस्ट्रार वेबसाइट किंवा स्टॉक एक्सचेंज पोर्टलवरून वाटप स्थिती तपासू शकतात.</p>
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>रजिस्ट्रारच्या वेबसाइटला भेट द्या</li>
              <li>IPO चे नाव निवडा</li>
              <li>PAN / अर्ज क्रमांक टाका</li>
              <li>वाटप निकाल पाहा</li>
            </ul>
            <p>
              तुम्ही{" "}
              <Link href="/ipo-calendar" className="text-[#1C317A] dark:text-blue-400 underline">
                IPO कॅलेंडर
              </Link>{" "}
              द्वारे देखील IPO वेळापत्रक ट्रॅक करू शकता.
            </p>
          </Section>

          <Section title="वारंवार विचारले जाणारे प्रश्न (FAQs)">
            <h3 className="font-semibold mt-4">IPO वाटप कसे ठरवले जाते?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">वाटप श्रेणीच्या सबस्क्रिप्शन आणि एक्सचेंज-मंजूर वाटप नियमांच्या आधारे ठरवले जाते.</p>

            <h3 className="font-semibold mt-4">IPO वाटप यादृच्छिक असते का?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">Retail ओव्हरसबस्क्रिप्शनच्या प्रकरणांमध्ये, वाटप संगणकीकृत लॉटरी प्रणालीद्वारे होऊ शकते.</p>

            <h3 className="font-semibold mt-4">IPO वाटप तारीख कधी असते?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">साधारणतः IPO बंद झाल्यानंतर 2-3 कामकाजाच्या दिवसांत.</p>
          </Section>

          <Section title="संबंधित IPO मार्गदर्शक">
            <p>वाटप, सबस्क्रिप्शन, GMP आणि श्रेणी मागणीशी कसे जोडलेले आहे हे समजून घेण्यासाठी पाहा:</p>
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li><Link href="/mr/what-is-ipo-gmp" className="text-[#1C317A] dark:text-blue-400 underline">IPO GMP म्हणजे काय</Link></li>
              <li><Link href="/mr/ipo-grey-market-guide" className="text-[#1C317A] dark:text-blue-400 underline">IPO ग्रे मार्केट मार्गदर्शक</Link></li>
              <li><Link href="/mr/ipo-subscription-meaning" className="text-[#1C317A] dark:text-blue-400 underline">IPO सबस्क्रिप्शन म्हणजे काय</Link></li>
              <li><Link href="/mr/qib-hni-retail-explained" className="text-[#1C317A] dark:text-blue-400 underline">QIB विरुद्ध HNI विरुद्ध Retail</Link></li>
              <li><Link href="/mr/drhp-vs-rhp-difference" className="text-[#1C317A] dark:text-blue-400 underline">DRHP विरुद्ध RHP</Link></li>
              <li><Link href="/ipo-allotment-probability-calculator" className="text-[#1C317A] dark:text-blue-400 underline">IPO वाटप शक्यता कॅल्क्युलेटर</Link></li>
            </ul>
          </Section>
        </div>

        <div className="mt-12 text-xs text-[#64748b] dark:text-[#9AA1AA] bg-[#f1f5f9] dark:bg-[#171B20] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4">
          IPOCraft केवळ माहितीच्या उद्देशाने हा मजकूर पुरवतो आणि SEBI कडे नोंदणीकृत नाही. हे
          मार्गदर्शक शैक्षणिक आणि संशोधन उद्देशासाठी आहे आणि गुंतवणूक सल्ला नाही.
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "IPO वाटप कसे ठरवले जाते?", acceptedAnswer: { "@type": "Answer", text: "वाटप श्रेणीच्या सबस्क्रिप्शन पातळी आणि एक्सचेंज-मंजूर वाटप नियमांच्या आधारे ठरवले जाते." } },
              { "@type": "Question", name: "Retail गुंतवणूकदारांसाठी IPO वाटप यादृच्छिक आहे का?", acceptedAnswer: { "@type": "Answer", text: "ओव्हरसबस्क्राइब्ड IPO मध्ये, निष्पक्षता सुनिश्चित करण्यासाठी Retail वाटप संगणकीकृत लॉटरी प्रणालीद्वारे केले जाते." } },
              { "@type": "Question", name: "IPO वाटप स्थिती कशी तपासावी?", acceptedAnswer: { "@type": "Answer", text: "वाटप तारखेनंतर PAN किंवा अर्ज क्रमांक वापरून अधिकृत रजिस्ट्रार वेबसाइटवर IPO वाटप स्थिती तपासता येते." } },
            ],
          }),
        }}
      />
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="scroll-mt-24">
      <h2
        className="text-xl sm:text-2xl font-semibold mb-4 text-[#0f172a] dark:text-[#F1F5F9]"
        style={{ fontFamily: "var(--font-outfit)" }}
      >
        {title}
      </h2>
      <div className="text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );
}
