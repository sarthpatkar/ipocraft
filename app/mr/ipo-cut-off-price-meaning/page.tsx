import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/lib/site-url";

const mrUrl = canonicalUrl("/mr/ipo-cut-off-price-meaning");
const enUrl = canonicalUrl("/ipo-cut-off-price-meaning");
const hiUrl = canonicalUrl("/hi/ipo-cut-off-price-meaning");
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: "IPO Cut-off Price म्हणजे काय? कोण वापरू शकतो | IPOCraft",
  description:
    "IPO मधील cut-off price पर्यायाचा अर्थ, तो कोण वापरू शकतो, पैसे ब्लॉक होणे आणि परताव्याची पद्धत, आणि गुंतवणूकदार तो का निवडतात — मराठीत समजून घ्या.",
  alternates: {
    canonical: mrUrl,
    languages: { en: enUrl, hi: hiUrl, mr: mrUrl, "x-default": enUrl },
  },
};

export default function CutOffPriceMarathiPage() {
  return (
    <div
      lang="mr"
      className="min-h-screen bg-[#f8fafc] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F5F9]"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <p className="text-sm uppercase text-blue-600 font-semibold mb-4">IPO मार्गदर्शक</p>

        <h1
          className="text-2xl sm:text-3xl lg:text-[2.5rem] font-semibold leading-tight text-[#0f172a] dark:text-[#F1F5F9]"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          IPO Cut-off Price म्हणजे काय? कोण वापरू शकतो ({CURRENT_YEAR})
        </h1>

        <p className="mt-6 text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
          <strong>Cut-off price</strong> हा पर्याय गुंतवणूकदाराला किंमत बँडमधील एखादी विशिष्ट
          किंमत निवडण्याऐवजी, जी अंतिम IPO किंमत ठरेल त्यावर बोली लावण्याची सुविधा देतो. हा पर्याय
          फक्त Retail Individual Investors (RII) साठी उपलब्ध आहे आणि खूप कमी किंमतीमुळे तुमची
          बोली नाकारली जाण्यापासून वाचण्याचा सर्वात सोपा मार्ग आहे.
        </p>

        <p className="mt-3 text-[13px] text-[#64748b] dark:text-[#9AA1AA]">
          Also available in{" "}
          <Link href="/ipo-cut-off-price-meaning" className="text-[#1C317A] dark:text-blue-400 underline">English</Link>{" "}
          and{" "}
          <Link href="/hi/ipo-cut-off-price-meaning" className="text-[#1C317A] dark:text-blue-400 underline">हिंदी</Link>.
        </p>

        <div className="mt-10 space-y-12">
          <Section id="what-is-cutoff" title="Cut-off वर बोली लावण्याचा अर्थ काय आहे?">
            <p>
              प्रत्येक IPO ला एक किंमत बँड असतो — उदाहरणार्थ ₹100 ते ₹110. त्या बँडमधील एखादी
              किंमत निवडण्याऐवजी, गुंतवणूकदार Cut-off Price निवडू शकतो, जी कंपनीने बुक-बिल्डिंगद्वारे
              ठरवलेल्या अंतिम किंमतीवर खरेदी करण्याची सूचना आहे — जरी ती किंमत बँडच्या वरच्या
              टोकाला, ₹110 पर्यंत, असली तरीही.
            </p>
          </Section>

          <Section title="Cut-off पर्याय कोण वापरू शकतो?">
            <p>
              फक्त <strong>Retail Individual Investors</strong> (₹2 लाखांपर्यंत अर्ज) cut-off
              price वर बोली लावू शकतात. QIB आणि NII/HNI गुंतवणूकदारांना बँडमधील निश्चित किंमतीला
              बोली लावावी लागते — ते cut-off पर्याय वापरू शकत नाहीत. संपूर्ण श्रेणी रचना{" "}
              <Link href="/mr/qib-hni-retail-explained" className="text-[#1C317A] dark:text-blue-400 underline">
                येथे पाहा
              </Link>
              .
            </p>
          </Section>

          <Section title="पैसे ब्लॉक होणे आणि परताव्याची पद्धत">
            <p>
              जेव्हा तुम्ही cut-off वर बोली लावता, तेव्हा तुमच्या बँक खात्यात (ASBA द्वारे) ब्लॉक
              केलेली रक्कम किंमत बँडच्या <strong>वरच्या टोकाला</strong>, म्हणजे सर्वात वाईट
              स्थिती गृहीत धरून, मोजली जाते. जर अंतिम इश्यू किंमत त्यापेक्षा कमी ठरली, तर वाटपानंतर
              फरकाची रक्कम आपोआप अनब्लॉक किंवा परत केली जाते.
            </p>
            <p>
              उदाहरण: किंमत बँड ₹100–₹110, लॉट साइज 100 शेअर्स. Cut-off वर बोली ₹11,000 ब्लॉक
              करते. अंतिम किंमत ₹105 निश्चित झाल्यास, प्रत्यक्षात फक्त ₹10,500 वजा होतील आणि ₹500
              परत मिळतील.
            </p>
          </Section>

          <Section title="गुंतवणूकदार Cut-off Price का निवडतात">
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>खूप कमी किंमतीमुळे बोली नाकारली जाण्याचा धोका दूर होतो</li>
              <li>अर्ज सोपा होतो — मागणी कुठे स्थिर होईल याचा अंदाज घेण्याची गरज नाही</li>
              <li>फक्त लिस्टिंग नफ्यासाठी अर्ज करणाऱ्या Retail अर्जदारांना सहसा हीच शिफारस केली जाते</li>
            </ul>
          </Section>

          <Section id="faqs" title="वारंवार विचारले जाणारे प्रश्न">
            <h3 className="font-semibold mt-4">HNI किंवा QIB cut-off price वर बोली लावू शकतात का?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">नाही. Cut-off पर्याय फक्त Retail Individual Investors साठी राखीव आहे.</p>
            <h3 className="font-semibold mt-4">अंतिम किंमत बँडच्या वरच्या टोकापेक्षा कमी ठरली तर काय होते?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">अंतिम इश्यू किंमत आणि वाटप निश्चित झाल्यावर अतिरिक्त ब्लॉक केलेली रक्कम आपोआप परत किंवा अनब्लॉक होते.</p>
            <h3 className="font-semibold mt-4">Cut-off वर बोली लावणे आणि बँडमधील सर्वोच्च किंमतीवर बोली लावणे सारखेच आहे का?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">फंड-ब्लॉकिंगच्या दृष्टीने दोन्ही सारखेच आहेत, पण cut-off म्हणजे &ldquo;जी अंतिम किंमत ठरेल ती&rdquo;, तर सर्वोच्च किंमत स्वतः निवडणे म्हणजे त्याच निश्चित आकड्यावरील एक फिक्स्ड बोली.</p>
          </Section>

          <Section id="related-resources" title="संबंधित IPO मार्गदर्शक">
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li><Link href="/mr/qib-hni-retail-explained" className="text-[#1C317A] dark:text-blue-400 underline">QIB विरुद्ध HNI विरुद्ध Retail</Link></li>
              <li><Link href="/mr/how-ipo-allotment-works" className="text-[#1C317A] dark:text-blue-400 underline">IPO वाटप कसे होते</Link></li>
              <li><Link href="/ipo-allotment-probability-calculator" className="text-[#1C317A] dark:text-blue-400 underline">IPO वाटप शक्यता कॅल्क्युलेटर</Link></li>
            </ul>
          </Section>
        </div>

        <div className="mt-12 text-xs text-[#64748b] dark:text-[#9AA1AA] bg-[#f1f5f9] dark:bg-[#171B20] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4">
          IPOCraft केवळ माहितीच्या उद्देशाने हा मजकूर पुरवतो आणि SEBI कडे नोंदणीकृत नाही. अचूक
          बिडिंग प्रक्रियेसाठी अधिकृत RHP आणि तुमच्या ब्रोकरचे अ‍ॅप पाहा.
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "IPO Cut-off Price म्हणजे काय? कोण वापरू शकतो",
            description: "IPO cut-off price पर्याय, फक्त Retail साठी उपलब्धता, आणि अंतिम किंमत कमी असल्यास परतावा कसा मिळतो हे स्पष्ट केले आहे.",
            author: { "@type": "Organization", name: "IPOCraft Research Team" },
            publisher: { "@type": "Organization", name: "IPOCraft", logo: { "@type": "ImageObject", url: "https://ipocraft.com/logo2.png" } },
            datePublished: `${CURRENT_YEAR}-01-01`,
            dateModified: new Date().toISOString(),
            mainEntityOfPage: { "@type": "WebPage", "@id": mrUrl },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "IPO Cut-off Price म्हणजे काय?", acceptedAnswer: { "@type": "Answer", text: "Cut-off price हा एक बिडिंग पर्याय आहे ज्यात गुंतवणूकदार बुक-बिल्डिंगमधून जी अंतिम किंमत ठरेल त्यावर शेअर्स वाटप होण्याची सूचना देतो, विशिष्ट किंमत निवडण्याऐवजी." } },
              { "@type": "Question", name: "Cut-off price वर कोण बोली लावू शकतो?", acceptedAnswer: { "@type": "Answer", text: "फक्त Retail Individual Investors (₹2 लाखांपर्यंत अर्ज) cut-off price वर बोली लावू शकतात. QIB आणि NII/HNI ला निश्चित किंमतीला बोली लावावी लागते." } },
            ],
          }),
        }}
      />
    </div>
  );
}

function Section({ id, title, children }: any) {
  return (
    <div id={id} className="scroll-mt-40 sm:scroll-mt-44">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-[#0f172a] dark:text-[#F1F5F9]" style={{ fontFamily: "var(--font-outfit)" }}>
        {title}
      </h2>
      <div className="text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );
}
