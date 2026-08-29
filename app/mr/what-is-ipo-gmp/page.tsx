import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/lib/site-url";

const mrUrl = canonicalUrl("/mr/what-is-ipo-gmp");
const enUrl = canonicalUrl("/what-is-ipo-gmp");
const hiUrl = canonicalUrl("/hi/what-is-ipo-gmp");
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: "IPO GMP म्हणजे काय? Grey Market Premium अर्थ, गणना आणि धोके | IPOCraft",
  description:
    "IPO GMP (Grey Market Premium) म्हणजे काय, त्याची गणना कशी होते, तो दररोज का बदलतो, आणि गुंतवणूकदार त्यावरून लिस्टिंग गेनचा अंदाज कसा घेतात — मराठीत सविस्तर मार्गदर्शक.",
  alternates: {
    canonical: mrUrl,
    languages: { en: enUrl, hi: hiUrl, mr: mrUrl, "x-default": enUrl },
  },
};

export default function WhatIsIpoGmpMarathiPage() {
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
          IPO GMP म्हणजे काय? Grey Market Premium अर्थ, गणना आणि धोके ({CURRENT_YEAR})
        </h1>

        <p className="mt-6 text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
          IPO GMP म्हणजे ग्रे मार्केट प्रीमियम. IPO शेअर्स स्टॉक एक्सचेंजमध्ये सूचीबद्ध
          होण्यापूर्वी ज्या प्रीमियमवर अनधिकृतपणे ट्रेड केले जातात, त्याला हे संदर्भित करते.
          संभाव्य लिस्टिंग फायद्यांचा अंदाज घेण्यासाठी गुंतवणूकदार IPO GMP चा मागोवा घेतात, परंतु
          हे समजून घेणे महत्त्वाचे आहे की ग्रे मार्केट नियंत्रित नाही आणि अधिकृत एक्सचेंजेसच्या
          बाहेर कार्य करते.
        </p>

        <p className="mt-4 text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
          IPOCraft वर, गुंतवणूकदार सदस्यता डेटा आणि{" "}
          <Link href="/ipo-calendar" className="text-[#1C317A] dark:text-blue-400 underline">
            IPO कॅलेंडर
          </Link>{" "}
          टाइमलाइनसह{" "}
          <Link href="/mr/gmp" className="text-[#1C317A] dark:text-blue-400 underline">
            GMP डेटा
          </Link>{" "}
          पाहू शकतात. तथापि, GMP चा अर्थ नेहमी सावधगिरीने लावला पाहिजे आणि लिस्टिंगच्या
          कामगिरीची हमी म्हणून घेतला जाऊ नये.
        </p>

        <p className="mt-4 text-[13px] text-[#64748b] dark:text-[#9AA1AA]">
          Also available in{" "}
          <Link href="/what-is-ipo-gmp" className="text-[#1C317A] dark:text-blue-400 underline">
            English
          </Link>{" "}
          and{" "}
          <Link href="/hi/what-is-ipo-gmp" className="text-[#1C317A] dark:text-blue-400 underline">
            हिंदी
          </Link>
          .
        </p>

        <div className="mt-8 sticky top-24 z-30 bg-white dark:bg-[#111418]/95 backdrop-blur border border-[#e2e8f0] dark:border-[#252A31] rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-[#0f172a] dark:text-[#F1F5F9] mb-3 uppercase tracking-wide">
            या पानावर
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            <a href="#what-is-gmp" className="text-[#1C317A] dark:text-blue-400 hover:underline">IPO GMP म्हणजे काय</a>
            <a href="#calculation" className="text-[#1C317A] dark:text-blue-400 hover:underline">GMP ची गणना कशी होते</a>
            <a href="#reliability" className="text-[#1C317A] dark:text-blue-400 hover:underline">GMP विश्वसनीय आहे का?</a>
            <a href="#mainboard-vs-sme" className="text-[#1C317A] dark:text-blue-400 hover:underline">मेनबोर्ड विरुद्ध SME</a>
            <a href="#strategies" className="text-[#1C317A] dark:text-blue-400 hover:underline">प्रगत रणनीती</a>
            <a href="#faqs" className="text-[#1C317A] dark:text-blue-400 hover:underline">FAQs</a>
          </div>
        </div>

        <div className="mt-10 space-y-12">
          <Section id="what-is-gmp" title="IPO GMP म्हणजे काय?">
            <p>
              IPO GMP म्हणजे अनधिकृत ग्रे मार्केटमध्ये गुंतवणूकदार IPO इश्यू किंमतीपेक्षा जास्त
              जी रक्कम देण्यास तयार असतात ती. उदाहरणार्थ, जर IPO किंमत बँड ₹100 ते ₹110 असेल आणि
              GMP ₹25 असेल, तर अपेक्षित लिस्टिंग किंमत सुमारे ₹135 असू शकते.
            </p>
            <p>
              ग्रे मार्केट व्यवहार लिस्टिंगपूर्वी होतात आणि मागणी, अंदाज आणि बाजारातील
              भावनांवर आधारित असतात. हे व्यवहार खरेदीदार आणि विक्रेत्यांमधील खाजगी व्यवस्था
              असतात.
            </p>
          </Section>

          <Section id="calculation" title="IPO GMP ची गणना कशी केली जाते">
            <p>अंदाजित लिस्टिंग किंमत काढण्याचे सूत्र असे आहे:</p>
            <div className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4 text-sm font-medium text-[#0f172a] dark:text-[#F1F5F9]">
              अंदाजित लिस्टिंग किंमत = इश्यू किंमत + GMP
            </div>
            <p className="mt-4">
              उदाहरण: इश्यू किंमत ₹110, GMP ₹25, अंदाजित लिस्टिंग किंमत सुमारे ₹135 आहे.
            </p>
            <p>हे सूत्र केवळ एक सूचक अंदाज देते, खात्रीशीर परिणाम नाही.</p>
          </Section>

          <Section title="IPO GMP दररोज का बदलतो">
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>बाजारातील भावना आणि एकूण निर्देशांकाची हालचाल</li>
              <li>सदस्यता स्तर (Retail, HNI, QIB मागणी)</li>
              <li>अँकर गुंतवणूकदारांचा सहभाग</li>
              <li>कंपनीची मूलभूत तत्त्वे आणि क्षेत्राचा दृष्टिकोन</li>
              <li>बातम्या आणि व्यापक आर्थिक घटक</li>
            </ul>
            <p>
              उच्च सदस्यता, विशेषतः QIB किंवा HNI कडून, GMP वर सकारात्मक परिणाम करू शकते. तथापि,
              व्यापक बाजार नकारात्मक झाल्यास GMP लवकर उलटू शकतो.
            </p>
          </Section>

          <Section title="गुंतवणूकदार IPO GMP चा वापर कसा करतात">
            <p>
              गुंतवणूकदार अर्ज करण्यापूर्वी अनेकदा GMP ची अधिकृत सदस्यता डेटाशी तुलना करतात.
              तुम्ही{" "}
              <Link href="/ipo-calendar" className="text-[#1C317A] dark:text-blue-400 underline">
                IPO कॅलेंडर
              </Link>{" "}
              वापरून आगामी IPO वेळापत्रक ट्रॅक करू शकता आणि वैयक्तिक IPO पृष्ठांद्वारे IPO
              तपशीलांचे विश्लेषण करू शकता.
            </p>
            <p>
              GMP चा उपयोग साधारणपणे अल्पकालीन लिस्टिंग फायद्यांचा अंदाज लावण्यासाठी केला जातो.
              दीर्घकालीन गुंतवणूकदार सहसा ग्रे मार्केट ट्रेंडपेक्षा कंपनीच्या मूलभूत गोष्टींवर
              अधिक लक्ष केंद्रित करतात.
            </p>
          </Section>

          <Section id="reliability" title="IPO GMP विश्वसनीय आहे का?">
            <p>
              IPO GMP अनधिकृत आणि अंदाजावर आधारित आहे. हे SEBI किंवा स्टॉक एक्सचेंजद्वारे
              नियंत्रित केले जात नाही. हे भावना दर्शवू शकते, परंतु प्रत्यक्ष लिस्टिंग किंमती
              लक्षणीयरीत्या भिन्न असू शकतात.
            </p>
            <ul className="list-disc pr-6 pl-6 space-y-2 mt-3">
              <li>ग्रे मार्केट व्यवहार खाजगी आणि अनियंत्रित असतात</li>
              <li>कोणतेही अधिकृत अहवाल किंवा हमी अस्तित्वात नाही</li>
              <li>लिस्टिंगपूर्वी किंमतींमध्ये तीव्र चढ-उतार होऊ शकतात</li>
            </ul>
          </Section>

          <Section title="IPO GMP आणि सबस्क्रिप्शन डेटा यांतील फरक">
            <p>
              सबस्क्रिप्शन डेटा Retail गुंतवणूकदार, HNI आणि QIB यांच्या अधिकृत मागणीचे प्रतिबिंब
              आहे. हे IPO बोलीच्या काळात एक्सचेंजद्वारे जारी केले जाते.
            </p>
            <p>
              दुसरीकडे, GMP अनधिकृत बाजारातील भावना दर्शवतो. दोघांचे मिश्रण मागणीचे ट्रेंड
              समजून घेण्यासाठी अधिक चांगला संदर्भ देते.
            </p>
          </Section>

          <Section title="ग्रे मार्केट प्रीमियमचे धोके">
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>अनियंत्रित व्यापार वातावरण</li>
              <li>खाजगी व्यवहारांमधील प्रतिपक्ष जोखीम</li>
              <li>किंमतीत अचानक सुधारणा होण्याची शक्यता</li>
              <li>अल्पकालीन अंदाजांवर जास्त अवलंबित्व</li>
            </ul>
          </Section>

          <Section title="वास्तविक जगातील IPO GMP केस स्टडी">
            <p>
              ₹150 किंमतीचा एक काल्पनिक IPO विचारात घ्या, ज्याची लिस्टिंगपूर्वी ग्रे मार्केट
              प्रीमियम ₹40 आहे. बाजारातील भावना मजबूत होती, सबस्क्रिप्शन 50x च्या पुढे गेले आणि
              संस्थात्मक सहभाग उच्च होता.
            </p>
            <div className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4 text-sm font-medium text-[#0f172a] dark:text-[#F1F5F9]">
              अंदाजित लिस्टिंग किंमत = ₹150 + ₹40 = ₹190
            </div>
            <p className="mt-4">
              लिस्टिंगच्या दिवशी, स्टॉक ₹185 वर उघडला, जो अपेक्षित GMP किमतीपेक्षा थोडा कमी होता.
              हे दर्शवते की GMP भावना दर्शवतो, पण प्रत्यक्ष लिस्टिंग किंमत व्यापक बाजार तरलता
              आणि किंमत शोध प्रक्रियेतील अंतिम मागणीवर अवलंबून असते.
            </p>
          </Section>

          <Section title="ऐतिहासिक GMP विरुद्ध प्रत्यक्ष लिस्टिंग तुलना">
            <p>
              ऐतिहासिकदृष्ट्या, IPO GMP ने अनेकदा लिस्टिंगच्या गतीचा मागोवा घेतला आहे, परंतु
              पूर्ण अचूकतेने नाही. तेजीच्या बाजारात, मजबूत GMP असलेले IPO बहुतेकदा GMP-समायोजित
              अपेक्षांच्या जवळपास किंवा त्याहून थोडे खाली सूचीबद्ध होतात.
            </p>
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>प्रबळ QIB मागणी GMP ट्रेंडला मान्यता देते</li>
              <li>दुय्यम बाजारातील कमकुवत भावनांमुळे लिस्टिंगमधील वाढ कमी होऊ शकते</li>
              <li>जास्त तापलेला GMP लिस्टिंगच्या दिवशी सामान्य होऊ शकतो</li>
            </ul>
            <p>
              त्यामुळे GMP चा अर्थ सदस्यता गुणोत्तर आणि क्षेत्राच्या दृष्टिकोनासोबत लावला पाहिजे,
              केवळ स्वतंत्रपणे नाही.
            </p>
          </Section>

          <Section id="mainboard-vs-sme" title="मेनबोर्ड आणि SME IPO GMP मधील फरक">
            <p>
              SME IPO चा इश्यू आकार सामान्यतः मेनबोर्ड IPO च्या तुलनेत कमी असतो आणि तरलता
              मर्यादित असते. परिणामी, SME IPO GMP अधिक अस्थिर आणि भावना-आधारित असू शकतो.
            </p>
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>SME IPO GMP लिस्टिंगच्या जवळ तीव्रतेने बदलू शकतो</li>
              <li>SME IPO मध्ये लॉटचा आकार सहसा मोठा असतो</li>
              <li>लिस्टिंगनंतरची तरलता किंमत स्थिरतेवर परिणाम करू शकते</li>
            </ul>
            <p>
              SME IPO GMP चा मागोवा घेणाऱ्या गुंतवणूकदारांनी मेनबोर्ड IPO च्या तुलनेत कमी तरलता
              आणि विस्तृत स्प्रेडचा विचार केला पाहिजे.
            </p>
          </Section>

          <Section id="strategies" title="प्रगत अर्थ लावण्याची रणनीती">
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>एका मूल्याऐवजी अनेक दिवसांतील GMP ट्रेंडची तुलना करा</li>
              <li>सदस्यता गतीसह पुन्हा तपासा (Retail विरुद्ध QIB)</li>
              <li>अँकर गुंतवणूकदारांच्या वाटपावर लक्ष ठेवा</li>
              <li>लिस्टिंगपूर्वी व्यापक बाजार दिशेचे मूल्यांकन करा</li>
            </ul>
            <p>व्यावसायिक गुंतवणूकदार GMP ला मूल्यांकन मॉडेल नव्हे तर भावना निर्देशक म्हणून मानतात.</p>
          </Section>

          <Section title="डेटा स्रोत पारदर्शकता">
            <p>
              IPOCraft सार्वजनिकरित्या उपलब्ध एक्सचेंज फाइलिंग आणि रजिस्ट्रार प्रकटीकरणातून IPO
              वेळापत्रक, सदस्यता अद्यतने आणि लिस्टिंग माहिती एकत्रित करते. ग्रे मार्केट प्रीमियम
              आकडेवारी अनधिकृत बाजारातील भावना दर्शवते आणि केवळ माहितीच्या उद्देशाने सादर केली
              जाते.
            </p>
            <p>
              आर्थिक निर्णय घेण्यापूर्वी वापरकर्त्यांना अधिकृत स्टॉक एक्सचेंज घोषणांमधून तपशील
              पडताळून पाहण्यासाठी प्रोत्साहित केले जाते.
            </p>
          </Section>

          <Section title="सध्याचे IPO जिथे GMP चा मागोवा घेतला जात आहे">
            <p>
              ग्रे मार्केट प्रीमियम तेव्हाच अर्थपूर्ण ठरतो जेव्हा तो लाइव्ह IPO डेटासोबत पाहिला
              जातो. तुम्ही{" "}
              <Link href="/ipo" className="text-[#1C317A] dark:text-blue-400 underline">
                IPO लिस्टिंग पेज
              </Link>{" "}
              वर सध्या सक्रिय असलेल्या सार्वजनिक इश्यूंचे पुनरावलोकन करू शकता आणि{" "}
              <Link href="/mr/gmp" className="text-[#1C317A] dark:text-blue-400 underline">
                IPO GMP ट्रॅकर
              </Link>{" "}
              द्वारे रिअल-टाइम भावनांचे निरीक्षण करू शकता.
            </p>
            <p>
              GMP स्वतंत्रपणे पाहण्यापेक्षा, लाइव्ह सबस्क्रिप्शन मागणी, किंमत बँड आणि ग्रे मार्केट
              हालचालींची एकत्रित तुलना करणे अधिक चांगला संदर्भ देते.
            </p>
          </Section>

          <Section id="faqs" title="वारंवार विचारले जाणारे प्रश्न (FAQs)">
            <h3 className="font-semibold mt-4">पॉझिटिव्ह GMP काय दर्शवतो?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">
              पॉझिटिव्ह GMP सूचित करतो की गुंतवणूकदारांना IPO इश्यू किंमतीच्या वर सूचीबद्ध
              होण्याची अपेक्षा आहे.
            </p>

            <h3 className="font-semibold mt-4">IPO GMP नकारात्मक असू शकतो का?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">
              होय. निगेटिव्ह GMP इश्यू किंमतीच्या खाली अपेक्षित लिस्टिंग दर्शवतो.
            </p>

            <h3 className="font-semibold mt-4">IPO GMP कायदेशीर आहे का?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">
              ग्रे मार्केट क्रिया अनधिकृतपणे अस्तित्वात आहे. ती अधिकृत एक्स्चेंज यंत्रणेचा भाग
              नाही.
            </p>

            <h3 className="font-semibold mt-4">GMP चे लाइव्ह अपडेट्स कुठे पाहता येतील?</h3>
            <p className="text-[#475569] dark:text-[#9AA1AA] mt-1">
              तुम्ही{" "}
              <Link href="/mr/gmp" className="text-[#1C317A] dark:text-blue-400 underline">
                IPO GMP ट्रॅकर
              </Link>{" "}
              वर अद्ययावत मूल्ये पाहू शकता.
            </p>
          </Section>

          <Section id="related-resources" title="संबंधित IPO मार्गदर्शक">
            <p>GMP हे सबस्क्रिप्शन, वाटप आणि श्रेणी मागणीशी कसे जोडले जाते हे अधिक सविस्तर समजून घेण्यासाठी पाहा:</p>
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li><Link href="/mr/ipo-grey-market-guide" className="text-[#1C317A] dark:text-blue-400 underline">IPO ग्रे मार्केट मार्गदर्शक</Link></li>
              <li><Link href="/mr/ipo-subscription-meaning" className="text-[#1C317A] dark:text-blue-400 underline">IPO सबस्क्रिप्शन म्हणजे काय</Link></li>
              <li><Link href="/mr/how-ipo-allotment-works" className="text-[#1C317A] dark:text-blue-400 underline">IPO वाटप कसे होते</Link></li>
              <li><Link href="/mr/qib-hni-retail-explained" className="text-[#1C317A] dark:text-blue-400 underline">QIB विरुद्ध HNI विरुद्ध Retail</Link></li>
              <li><Link href="/mr/kostak-rate-meaning" className="text-[#1C317A] dark:text-blue-400 underline">कोस्तक दर म्हणजे काय</Link></li>
              <li><Link href="/ipo-profit-calculator" className="text-[#1C317A] dark:text-blue-400 underline">IPO लिस्टिंग नफा कॅल्क्युलेटर</Link></li>
            </ul>
          </Section>
        </div>

        <div className="mt-12 text-xs text-[#64748b] dark:text-[#9AA1AA] bg-[#f1f5f9] dark:bg-[#171B20] border border-[#e2e8f0] dark:border-[#252A31] rounded-lg p-4">
          IPOCraft केवळ माहितीपूर्ण सामग्री पुरवते आणि SEBI कडे नोंदणीकृत नाही. IPO GMP ही
          अनधिकृत बाजार माहिती आहे आणि ती गुंतवणूक सल्ला मानली जाऊ नये. गुंतवणूकदारांनी अधिकृत
          एक्सचेंज फाइलिंगमधून तपशील पडताळावेत आणि पात्र सल्लागारांचा सल्ला घ्यावा.
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "IPO GMP म्हणजे काय? Grey Market Premium अर्थ, गणना आणि धोके",
            description:
              "IPO Grey Market Premium ची संपूर्ण माहिती, गणना, ऐतिहासिक तुलना, SME फरक आणि धोके — मराठीत.",
            inLanguage: "mr",
            author: { "@type": "Organization", name: "IPOCraft Research Team" },
            publisher: {
              "@type": "Organization",
              name: "IPOCraft",
              logo: { "@type": "ImageObject", url: "https://ipocraft.com/logo2.png" },
            },
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
              {
                "@type": "Question",
                name: "पॉझिटिव्ह GMP काय दर्शवतो?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "पॉझिटिव्ह GMP सूचित करतो की गुंतवणूकदारांना IPO इश्यू किंमतीच्या वर सूचीबद्ध होण्याची अपेक्षा आहे.",
                },
              },
              {
                "@type": "Question",
                name: "IPO GMP नकारात्मक असू शकतो का?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "होय. निगेटिव्ह GMP इश्यू किंमतीच्या खाली अपेक्षित लिस्टिंग दर्शवतो.",
                },
              },
              {
                "@type": "Question",
                name: "IPO GMP कायदेशीर आहे का?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "ग्रे मार्केट क्रिया अनधिकृतपणे अस्तित्वात आहे आणि ती अधिकृत एक्स्चेंज यंत्रणेचा भाग नाही.",
                },
              },
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
