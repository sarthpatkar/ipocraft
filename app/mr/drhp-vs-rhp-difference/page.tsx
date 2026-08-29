import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/lib/site-url";

const mrUrl = canonicalUrl("/mr/drhp-vs-rhp-difference");
const enUrl = canonicalUrl("/drhp-vs-rhp-difference");
const hiUrl = canonicalUrl("/hi/drhp-vs-rhp-difference");
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: "DRHP विरुद्ध RHP: पूर्ण रूप, अर्थ आणि फरक | IPOCraft",
  description:
    "DRHP चे पूर्ण रूप Draft Red Herring Prospectus आहे, RHP चे पूर्ण रूप Red Herring Prospectus आहे. दोघांमधील फरक, प्रत्येकात काय असते — मराठीत समजून घ्या.",
  alternates: {
    canonical: mrUrl,
    languages: { en: enUrl, hi: hiUrl, mr: mrUrl, "x-default": enUrl },
  },
};

export default function DrhpVsRhpMarathiPage() {
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
          DRHP विरुद्ध RHP: पूर्ण रूप, अर्थ आणि फरक ({CURRENT_YEAR})
        </h1>

        <p className="mt-6 text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
          <strong>DRHP चे पूर्ण रूप</strong> आहे Draft Red Herring Prospectus, आणि{" "}
          <strong>RHP चे पूर्ण रूप</strong> आहे Red Herring Prospectus. दोन्ही SEBI आणि स्टॉक
          एक्स्चेंजकडे दाखल केली जाणारी IPO ऑफर कागदपत्रे आहेत, पण वेगवेगळ्या टप्प्यांवर — आणि एक
          मोठा फरक असा की फक्त RHP मध्ये अंतिम किंमत बँड असतो.
        </p>

        <p className="mt-3 text-[13px] text-[#64748b] dark:text-[#9AA1AA]">
          Also available in{" "}
          <Link href="/drhp-vs-rhp-difference" className="text-[#1C317A] dark:text-blue-400 underline">English</Link>{" "}
          and{" "}
          <Link href="/hi/drhp-vs-rhp-difference" className="text-[#1C317A] dark:text-blue-400 underline">हिंदी</Link>.
        </p>

        <div className="mt-10 space-y-12">
          <Section id="drhp" title="DRHP म्हणजे काय?">
            <p>
              Draft Red Herring Prospectus (DRHP) हे IPO ची योजना आखताना कंपनीने SEBI कडे दाखल
              केलेले पहिले ऑफर कागदपत्र आहे. यात कंपनीचा व्यवसाय, आर्थिक स्थिती, जोखीम घटक,
              प्रवर्तक आणि इश्यूचा हेतू यांचा खुलासा असतो — पण त्यात अंतिम किंमत बँड किंवा
              ऑफरवरील शेअर्सची नेमकी संख्या नसते. कंपनी पुढे जाण्यापूर्वी SEBI आणि जनतेला दाखल
              केलेल्या DRHP वर टिप्पणी करण्यासाठी सुमारे 21 दिवस मिळतात.
            </p>
          </Section>

          <Section id="rhp" title="RHP म्हणजे काय?">
            <p>
              Red Herring Prospectus (RHP) IPO बोलीसाठी उघडण्याच्या अगदी आधी दाखल केले जाते. हे
              DRHP चे अद्ययावत, जवळपास अंतिम स्वरूप असते, ज्यामध्ये आता किंमत बँड, लॉट साइज, इश्यू
              साइज, आणि SEBI च्या निरीक्षणांना प्रतिसाद म्हणून केलेले बदल समाविष्ट असतात.
            </p>
          </Section>

          <Section title="DRHP विरुद्ध RHP: मुख्य फरक">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-[#e2e8f0] dark:border-[#252A31] rounded-lg overflow-hidden">
                <thead className="bg-[#f1f5f9] dark:bg-[#171B20] text-left">
                  <tr>
                    <th className="p-3 font-semibold">पैलू</th>
                    <th className="p-3 font-semibold">DRHP</th>
                    <th className="p-3 font-semibold">RHP</th>
                  </tr>
                </thead>
                <tbody className="[&>tr]:border-t [&>tr]:border-[#e2e8f0] dark:[&>tr]:border-[#252A31]">
                  <tr><td className="p-3">कधी दाखल केले जाते</td><td className="p-3">IPO रोडशोपूर्वी, SEBI आणि सार्वजनिक पुनरावलोकनासाठी</td><td className="p-3">IPO बोलीसाठी उघडण्यापूर्वी</td></tr>
                  <tr><td className="p-3">किंमत बँड</td><td className="p-3">समाविष्ट नाही</td><td className="p-3">समाविष्ट</td></tr>
                  <tr><td className="p-3">इश्यू साइज / लॉट साइज</td><td className="p-3">फक्त सूचक</td><td className="p-3">अंतिम</td></tr>
                  <tr><td className="p-3">उद्देश</td><td className="p-3">नियामक आणि सार्वजनिक अभिप्राय</td><td className="p-3">गुंतवणूकदार बोली संदर्भ</td></tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="गुंतवणूकदारांसाठी हे का महत्त्वाचे आहे">
            <p>
              अर्ज करण्यापूर्वी फक्त DRHP नाही तर RHP वाचणे महत्त्वाचे आहे, कारण तेच एकमेव कागदपत्र
              आहे ज्यात तुम्ही प्रत्यक्षात भरणार असलेली किंमत असते. IPOCraft चे{" "}
              <Link href="/drhp-analyzer" className="text-[#1C317A] dark:text-blue-400 underline">
                DRHP Analyzer
              </Link>{" "}
              या ऑफर कागदपत्रांमधील मुख्य मुद्दे आणि जोखीम घटकांचा सारांश देते, जेणेकरून तुम्हाला
              शेकडो पाने स्वतः वाचावी लागू नयेत.
            </p>
          </Section>

          <Section id="faqs" title="वारंवार विचारले जाणारे प्रश्न">
            <h3 className="font-semibold mt-4">DRHP आणि RHP चे पूर्ण रूप काय आहे?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">DRHP म्हणजे Draft Red Herring Prospectus. RHP म्हणजे Red Herring Prospectus.</p>
            <h3 className="font-semibold mt-4">DRHP मध्ये IPO ची किंमत असते का?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">नाही. किंमत बँड फक्त RHP मध्ये अंतिम होऊन येतो, जो IPO उघडण्याच्या तारखेजवळ दाखल केला जातो.</p>
            <h3 className="font-semibold mt-4">RHP दाखल होण्यापूर्वी DRHP मधील तपशील बदलू शकतात का?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">होय. SEBI च्या निरीक्षणांमुळे, बाजार परिस्थितीमुळे किंवा अद्ययावत आर्थिक आकडेवारीमुळे DRHP आणि अंतिम RHP मध्ये बदल होऊ शकतात.</p>
          </Section>

          <Section id="related-resources" title="संबंधित IPO मार्गदर्शक">
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li><Link href="/mr/what-is-ipo-gmp" className="text-[#1C317A] dark:text-blue-400 underline">IPO GMP म्हणजे काय</Link></li>
              <li><Link href="/mr/ipo-subscription-meaning" className="text-[#1C317A] dark:text-blue-400 underline">IPO सबस्क्रिप्शन म्हणजे काय</Link></li>
              <li><Link href="/mr/qib-hni-retail-explained" className="text-[#1C317A] dark:text-blue-400 underline">QIB विरुद्ध HNI विरुद्ध Retail</Link></li>
              <li><Link href="/mr/how-ipo-allotment-works" className="text-[#1C317A] dark:text-blue-400 underline">IPO वाटप कसे होते</Link></li>
            </ul>
          </Section>
        </div>

        <div className="mt-12 text-xs text-[#64748b] dark:text-[#9AA1AA] bg-[#f1f5f9] dark:bg-[#171B20] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4">
          IPOCraft केवळ माहितीच्या उद्देशाने हा मजकूर पुरवतो आणि SEBI कडे नोंदणीकृत नाही. नेहमी
          अधिकृत DRHP/RHP कागदपत्रे SEBI, BSE किंवा NSE च्या वेबसाइटवर पाहा.
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "DRHP विरुद्ध RHP: पूर्ण रूप, अर्थ आणि फरक",
            description: "DRHP (Draft Red Herring Prospectus) आणि RHP (Red Herring Prospectus) यांच्यातील फरक, प्रत्येकात काय असते, आणि ते कधी दाखल होतात.",
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
              { "@type": "Question", name: "DRHP आणि RHP चे पूर्ण रूप काय आहे?", acceptedAnswer: { "@type": "Answer", text: "DRHP म्हणजे Draft Red Herring Prospectus. RHP म्हणजे Red Herring Prospectus." } },
              { "@type": "Question", name: "DRHP मध्ये IPO ची किंमत असते का?", acceptedAnswer: { "@type": "Answer", text: "नाही, किंमत बँड फक्त RHP मध्ये अंतिम होऊन येतो, जो IPO उघडण्याच्या तारखेजवळ दाखल केला जातो." } },
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
