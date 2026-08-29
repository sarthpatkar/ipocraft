import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/lib/site-url";

const mrUrl = canonicalUrl("/mr/qib-hni-retail-explained");
const enUrl = canonicalUrl("/qib-hni-retail-explained");
const hiUrl = canonicalUrl("/hi/qib-hni-retail-explained");
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: "QIB विरुद्ध HNI विरुद्ध Retail गुंतवणूकदार - संपूर्ण IPO श्रेणी विभाजन | IPOCraft",
  description:
    "QIB, HNI (NII), आणि Retail गुंतवणूकदार श्रेणी, त्यांचा वाटप कोटा, सबस्क्रिप्शनवर परिणाम, आणि वाटपातील फरक — मराठीत सविस्तर मार्गदर्शक.",
  alternates: {
    canonical: mrUrl,
    languages: { en: enUrl, hi: hiUrl, mr: mrUrl, "x-default": enUrl },
  },
};

export default function QibHniRetailMarathiPage() {
  return (
    <div
      lang="mr"
      className="min-h-screen scroll-smooth bg-[#f8fafc] dark:bg-[#090B0F] text-[#0f172a] dark:text-[#F1F5F9]"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#1C317A] dark:text-blue-400">
          IPO मार्गदर्शक
        </p>

        <h1
          className="mt-3 text-2xl sm:text-3xl lg:text-[2.2rem] font-semibold leading-tight text-[#0f172a] dark:text-[#F1F5F9]"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          QIB विरुद्ध HNI विरुद्ध Retail गुंतवणूकदार - संपूर्ण IPO श्रेणी विभाजन ({CURRENT_YEAR})
        </h1>

        <p className="mt-6 text-[15px] text-[#475569] dark:text-[#9AA1AA] leading-relaxed">
          Initial Public Offering (IPO) मध्ये, शेअर्सचे विभाजन वेगवेगळ्या गुंतवणूकदार
          श्रेणींमध्ये केले जाते: Qualified Institutional Buyers (QIB), High Net-worth
          Individuals (HNI/NII), आणि Retail Individual Investors (RII). प्रत्येक श्रेणीसाठी एक
          विशिष्ट कोटा, वाटप पद्धत आणि सदस्यता गतीशीलता असते. हे फरक समजून घेतल्याने
          गुंतवणूकदारांना वाटपाच्या संधी आणि मागणीच्या ट्रेंडचे अधिक अचूकपणे मूल्यांकन
          करण्यात मदत होते.
        </p>

        <p className="mt-3 text-[13px] text-[#64748b] dark:text-[#9AA1AA]">
          Also available in{" "}
          <Link href="/qib-hni-retail-explained" className="text-[#1C317A] dark:text-blue-400 underline">
            English
          </Link>{" "}
          and{" "}
          <Link href="/hi/qib-hni-retail-explained" className="text-[#1C317A] dark:text-blue-400 underline">
            हिंदी
          </Link>
          .
        </p>

        <div className="mt-6 bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
            त्वरित तुलना: QIB विरुद्ध HNI विरुद्ध Retail
          </h3>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-[#f8fafc] dark:bg-[#090B0F] rounded-lg p-3 border border-[#e2e8f0] dark:border-[#252A31]">
              <p className="font-semibold text-[#0f172a] dark:text-[#F1F5F9]">Retail (RII)</p>
              <ul className="mt-2 list-disc pr-4 pl-4 space-y-1 text-[#475569] dark:text-[#9AA1AA]">
                <li>₹2 लाखांपर्यंत अर्ज</li>
                <li>सुमारे 35% वाटप</li>
                <li>लॉटरीवर आधारित वाटप</li>
              </ul>
            </div>
            <div className="bg-[#f8fafc] dark:bg-[#090B0F] rounded-lg p-3 border border-[#e2e8f0] dark:border-[#252A31]">
              <p className="font-semibold text-[#0f172a] dark:text-[#F1F5F9]">HNI / NII</p>
              <ul className="mt-2 list-disc pr-4 pl-4 space-y-1 text-[#475569] dark:text-[#9AA1AA]">
                <li>₹2 लाखांपेक्षा जास्त</li>
                <li>सुमारे 15% वाटप</li>
                <li>प्रमाणानुसार वाटप</li>
              </ul>
            </div>
            <div className="bg-[#f8fafc] dark:bg-[#090B0F] rounded-lg p-3 border border-[#e2e8f0] dark:border-[#252A31]">
              <p className="font-semibold text-[#0f172a] dark:text-[#F1F5F9]">QIB</p>
              <ul className="mt-2 list-disc pr-4 pl-4 space-y-1 text-[#475569] dark:text-[#9AA1AA]">
                <li>संस्थात्मक गुंतवणूकदार</li>
                <li>सुमारे 50% वाटप</li>
                <li>बुक-बिल्डिंगवर आधारित</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 sticky top-24 z-30 bg-white dark:bg-[#111418]/95 backdrop-blur border border-[#e2e8f0] dark:border-[#252A31] rounded-xl p-5 shadow-sm">
          <p className="text-sm font-semibold mb-3">या पानावर</p>
          <div className="grid sm:grid-cols-2 gap-2 text-sm">
            <a href="#overview" className="text-[#1C317A] dark:text-blue-400 hover:underline">श्रेणी विहंगावलोकन</a>
            <a href="#retail" className="text-[#1C317A] dark:text-blue-400 hover:underline">Retail गुंतवणूकदार</a>
            <a href="#hni" className="text-[#1C317A] dark:text-blue-400 hover:underline">HNI / NII</a>
            <a href="#qib" className="text-[#1C317A] dark:text-blue-400 hover:underline">QIB</a>
            <a href="#allocation" className="text-[#1C317A] dark:text-blue-400 hover:underline">वाटप नियम</a>
            <a href="#impact" className="text-[#1C317A] dark:text-blue-400 hover:underline">लिस्टिंगवर परिणाम</a>
          </div>
        </div>

        <div className="mt-10 space-y-16">
          <Section id="overview" title="IPO गुंतवणूकदार श्रेणींचे विहंगावलोकन (मेनबोर्ड विरुद्ध SME)">
            <p>
              भारतातील IPO वाटप संस्थात्मक आणि गैर-संस्थात्मक गुंतवणूकदारांमध्ये योग्य सहभाग
              सुनिश्चित करण्यासाठी संरचित गुंतवणूकदार गटांमध्ये विभागलेले असते. एका सामान्य
              मेनबोर्ड IPO मध्ये, वाटप साधारणपणे खालीलप्रमाणे असते:
            </p>
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li><strong>QIB (Qualified Institutional Buyers):</strong> सुमारे 50%</li>
              <li><strong>Retail Individual Investors (RII):</strong> सुमारे 35%</li>
              <li><strong>HNI / NII (Non-Institutional Investors):</strong> सुमारे 15%</li>
            </ul>
            <p>
              तथापि, SME IPO मध्ये ही रचना लक्षणीयरीत्या वेगळी असते. SME इश्यूंमध्ये बहुतेकदा
              खूप जास्त Retail वाटप आणि स्वतंत्र Market Maker हिस्सा असतो. मेनबोर्ड IPO च्या
              तुलनेत संस्थात्मक सहभाग कमी असू शकतो.
            </p>
            <p>सबस्क्रिप्शन डेटाचा अर्थ लावण्यापूर्वी IPO SME आहे की मेनबोर्ड हे समजून घेणे महत्त्वाचे आहे.</p>
          </Section>

          <Section id="retail" title="Retail Individual Investors (RII) - लॉटरी आधारित वाटप">
            <p>Retail गुंतवणूकदार मेनबोर्ड IPO मध्ये ₹2 लाखांपर्यंत अर्ज करू शकतात. Retail श्रेणी जास्त सबस्क्राइब झाल्यास, संगणकीकृत लॉटरी प्रणालीद्वारे वाटप केले जाते.</p>
            <p>उदाहरण: समजा, Retail कोट्यात 10 लाख शेअर्स उपलब्ध आहेत आणि 1 कोटी शेअर्ससाठी अर्ज येतात. याचा अर्थ Retail 10 पट सबस्क्राइब झाला.</p>
            <p>जर 5 लाख वैध Retail अर्ज असतील आणि फक्त 1 लाख अर्जांना किमान लॉट वाटप होऊ शकत असेल, तर प्रत्यक्ष शक्यता अशी असते:</p>
            <p className="font-medium">1,00,000 ÷ 5,00,000 = 20% वाटप शक्यता</p>
            <p>म्हणूनच मजबूत IPO मध्येही बहुतेक Retail गुंतवणूकदारांना वाटप मिळत नाही.</p>
          </Section>

          <Section id="hni" title="HNI / NII - लीव्हरेज परिणामासह प्रमाणबद्ध वाटप">
            <p>HNI गुंतवणूकदार ₹2 लाखांपेक्षा जास्त अर्ज करतात. Retail च्या विपरीत, HNI वाटप प्रमाणानुसार असते.</p>
            <p>उदाहरण: जर HNI श्रेणी 30 पट सबस्क्राइब झाली आणि गुंतवणूकदाराने 300 लॉटसाठी अर्ज केला, तर प्रत्यक्ष वाटप प्रमाणशीर घटून सुमारे 10 लॉट होऊ शकते.</p>
            <p>मजबूत IPO मध्ये, HNI सबस्क्रिप्शन बहुतेकदा लीव्हरेज्ड फंडिंगमुळे वाढलेले असते. यामुळे मागणीचा चुकीचा अंदाज येऊ शकतो.</p>
          </Section>

          <Section id="qib" title="QIB - विश्वासाचा निर्देशक म्हणून संस्थात्मक मागणी">
            <p>QIB मध्ये म्युच्युअल फंड, विमा कंपन्या, बँका आणि परदेशी संस्थात्मक गुंतवणूकदारांचा समावेश होतो. त्यांना मेनबोर्ड IPO मध्ये सामान्यतः 50% वाटप मिळते.</p>
            <p>विशेषतः दुसऱ्या आणि तिसऱ्या दिवशी मजबूत QIB सबस्क्रिप्शन, अनेकदा संस्थात्मक विश्वासाचे संकेत देते. लिस्टिंगची ताकद तपासताना अनेक विश्लेषक Retail ओव्हरसबस्क्रिप्शनपेक्षा QIB सहभागाला अधिक विश्वसनीय मानतात.</p>
          </Section>

          <Section id="allocation" title="तपशीलवार वाटप गणिताचे उदाहरण">
            <p>असे समजा की IPO चा एकूण इश्यू आकार 1 कोटी शेअर्स आहे.</p>
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>QIB: 50 लाख शेअर्स</li>
              <li>Retail: 35 लाख शेअर्स</li>
              <li>HNI: 15 लाख शेअर्स</li>
            </ul>
            <p>सबस्क्रिप्शन पातळी खालीलप्रमाणे असल्यास:</p>
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>QIB: 8x</li>
              <li>Retail: 20x</li>
              <li>HNI: 50x</li>
            </ul>
            <p>तेव्हा प्रत्यक्ष स्पर्धा श्रेणींमध्ये मोठ्या प्रमाणात वेगळी असते. जास्त गुणक असूनही Retail ची शक्यता QIB पेक्षा कमी असू शकते.</p>
          </Section>

          <Section id="case-study" title="खऱ्या ओव्हरसबस्क्रिप्शन केस स्टडीचे तर्कशास्त्र">
            <p>एका मजबूत मेनबोर्ड IPO चा विचार करा, जिथे Retail सबस्क्रिप्शन 25 पट, HNI 120 पट आणि QIB 15 पट पर्यंत पोहोचले.</p>
            <p>जरी HNI 120x दाखवत असले, तरी त्यापैकी बहुतेक भाग अल्प-मुदतीच्या लीव्हरेजने वित्तपुरवठा केलेला असू शकतो. 15x वरील QIB सहभाग अनेकदा दीर्घकालीन संस्थात्मक स्वारस्याचा अधिक मजबूत संकेत देतो.</p>
            <p>अशा IPO मध्ये लिस्टिंग नफा अनेकदा तेव्हाच टिकतो जेव्हा QIB ची मागणी मजबूत राहते.</p>
          </Section>

          <Section id="probability" title="श्रेणींनुसार शक्यतेची तुलना">
            <p>Retail ची शक्यता लॉटरीवर आधारित आहे. HNI ची शक्यता प्रमाणानुसार कमी होते. QIB वाटप बुक बिल्डिंग आणि संस्थात्मक बोली पद्धतींवर अवलंबून असते.</p>
            <p>अत्यंत जास्त मागणी असलेल्या IPO मध्ये Retail शक्यता 5% पेक्षा कमी होऊ शकते, तर HNI ला आंशिक वाटप मिळू शकते.</p>
          </Section>

          <Section id="flow-diagram" title="IPO सबस्क्रिप्शन श्रेणींमध्ये कसे प्रवाहित होते (दृश्य मार्गदर्शक)">
            <p>सबस्क्रिप्शन प्रक्रिया एका संरचित पद्धतीने चालते — श्रेणीनुसार बोली गोळा केल्या जातात, दररोज मोजल्या जातात, आणि वाटप तर्कशास्त्र लागू करण्यापूर्वी इश्यू बंद झाल्यावर अंतिम केल्या जातात.</p>
            <div className="mt-6 bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-xl p-6 overflow-x-auto">
              <svg viewBox="0 0 800 200" className="min-w-[600px] w-full h-auto">
                <defs>
                  <marker id="arrow-mr" markerWidth="10" markerHeight="10" refX="10" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L9,3 z" fill="#1C317A" />
                  </marker>
                </defs>
                <rect x="20" y="70" width="180" height="50" rx="8" fill="#eef2ff" stroke="#1C317A" />
                <text x="110" y="100" textAnchor="middle" fontSize="14" fill="#0f172a">गुंतवणूकदार बोली</text>
                <line x1="200" y1="95" x2="320" y2="95" stroke="#1C317A" strokeWidth="2" markerEnd="url(#arrow-mr)" />
                <rect x="320" y="70" width="180" height="50" rx="8" fill="#f1f5f9" stroke="#1C317A" />
                <text x="410" y="90" textAnchor="middle" fontSize="13" fill="#0f172a">श्रेणीनुसार</text>
                <text x="410" y="108" textAnchor="middle" fontSize="13" fill="#0f172a">मोजणी (QIB / HNI / Retail)</text>
                <line x1="500" y1="95" x2="620" y2="95" stroke="#1C317A" strokeWidth="2" markerEnd="url(#arrow-mr)" />
                <rect x="620" y="70" width="160" height="50" rx="8" fill="#eef2ff" stroke="#1C317A" />
                <text x="700" y="100" textAnchor="middle" fontSize="14" fill="#0f172a">वाटप तर्कशास्त्र</text>
              </svg>
            </div>
            <p className="mt-4">बोली प्रक्रिया संपल्यावर, प्रत्येक श्रेणीचे स्वतंत्रपणे मूल्यांकन केले जाते. Retail लॉटरी वाटपाचे अनुसरण करते, HNI प्रमाणबद्ध वाटपाचे अनुसरण करते, आणि QIB वाटप संस्थात्मक बुक बिल्डिंगवर अवलंबून असते.</p>
          </Section>

          <Section id="impact" title="प्रगत अर्थ लावण्याची रणनीती">
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li>बोली विंडोच्या शेवटी मजबूत QIB मागणी हा सकारात्मक संकेत आहे.</li>
              <li>QIB च्या ताकदीशिवाय केवळ Retail ओव्हरसबस्क्रिप्शन अंदाजावर आधारित आवड दर्शवू शकते.</li>
              <li>कमी तरलता आणि मार्केट मेकर संरचनेमुळे SME IPO वेगळ्या पद्धतीने वागतात.</li>
              <li>सबस्क्रिप्शनची तुलना आमच्या <Link href="/mr/gmp" className="text-[#1C317A] dark:text-blue-400 underline">IPO GMP ट्रॅकरवर</Link> Grey Market Premium ट्रेंडसह करा.</li>
            </ul>
          </Section>

          <Section id="institutional" title="संस्थात्मक वर्तनाची माहिती">
            <p>संस्था बहुतेकदा सुरुवातीला जपून आणि शेवटच्या टप्प्यात आक्रमकपणे बोली लावतात. दररोजच्या सबस्क्रिप्शन विभागणीचे निरीक्षण केल्याने संस्थात्मक हेतू समजण्यास मदत होते.</p>
            <p>IPO उघडण्यापूर्वीचे QIB अँकर वाटप लिस्टिंगनंतरच्या स्थिरतेवरही परिणाम करते.</p>
          </Section>

          <Section id="data" title="डेटा पारदर्शकता आणि स्रोत संदर्भ">
            <p>IPO सबस्क्रिप्शन आकडेवारी एक्सचेंजच्या खुलाशांमधून आणि IPO बोलीच्या काळात जारी केलेल्या अधिकृत बोली डेटावरून घेतली जाते. गुंतवणूकदारांनी निर्णय घेण्यापूर्वी नेहमी अधिकृत फाइलिंगद्वारे सबस्क्रिप्शन आकडे पडताळावेत.</p>
            <p>IPOCraft केवळ माहिती आणि संशोधन हेतूंसाठी सार्वजनिकरित्या उपलब्ध डेटा एकत्रित करते.</p>
          </Section>

          <Section id="comparison-table" title="मेनबोर्ड विरुद्ध SME IPO कोटा तुलना तक्ता">
            <p>मेनबोर्ड आणि SME IPO मध्ये वाटप रचना लक्षणीयरीत्या वेगळी असते. सबस्क्रिप्शन डेटाचे विश्लेषण करताना हा संरचनात्मक फरक समजून घेणे आवश्यक आहे.</p>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full text-sm border border-[#e2e8f0] dark:border-[#252A31]">
                <thead className="bg-[#f1f5f9] dark:bg-[#171B20]">
                  <tr>
                    <th className="text-left px-4 py-2 border">श्रेणी</th>
                    <th className="text-left px-4 py-2 border">मेनबोर्ड IPO</th>
                    <th className="text-left px-4 py-2 border">SME IPO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="px-4 py-2 border font-medium">QIB</td><td className="px-4 py-2 border">सुमारे 50%</td><td className="px-4 py-2 border">कमी किंवा वैकल्पिक</td></tr>
                  <tr><td className="px-4 py-2 border font-medium">Retail</td><td className="px-4 py-2 border">सुमारे 35%</td><td className="px-4 py-2 border">अनेकदा 40%+</td></tr>
                  <tr><td className="px-4 py-2 border font-medium">HNI / NII</td><td className="px-4 py-2 border">सुमारे 15%</td><td className="px-4 py-2 border">उपलब्ध</td></tr>
                  <tr><td className="px-4 py-2 border font-medium">Market Maker</td><td className="px-4 py-2 border">लागू नाही</td><td className="px-4 py-2 border">अनिवार्य भाग</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">SME IPO मध्ये सामान्यतः लॉट आकार मोठा आणि लिस्टिंगनंतर तरलता कमी असते, ज्यामुळे मेनबोर्ड IPO च्या तुलनेत श्रेणीचा अर्थ लावणे वेगळे ठरते.</p>
          </Section>

          <Section id="historical-example" title="ऐतिहासिक IPO उदाहरण - संस्थात्मक विरुद्ध Retail मागणी">
            <p>Tempsens Instruments (2026) सारख्या अलीकडील मेनबोर्ड IPO चा विचार करा. या IPO ला QIB चे 300x पेक्षा जास्त सबस्क्रिप्शन मिळाले, जे त्याच्या सुमारे 61x च्या Retail सबस्क्रिप्शनपेक्षा खूप जास्त होते, आणि अंतिम बोलीच्या दिवशी सर्व श्रेणींमध्ये जोरदार सहभाग होता.</p>
            <p>मोठ्या Retail ओव्हरसबस्क्रिप्शन असूनही, संस्थात्मक सहभागामुळे लिस्टिंग भावनेबद्दल अधिक विश्वास मिळाला. हे उदाहरण दाखवते की विश्लेषक अनेकदा केवळ Retail गुणकांपेक्षा QIB मागणीला प्राधान्य का देतात.</p>
            <p>ऐतिहासिक उदाहरणे दर्शवतात की QIB आणि Retail श्रेणींमध्ये संतुलित मागणी अधिक स्थिर लिस्टिंग परिणाम देते.</p>
          </Section>

          <Section id="visual-allocation" title="दृश्य वाटप विभाजन उदाहरण">
            <p>समजा एका IPO मध्ये वाटपासाठी एकूण 10 लाख शेअर्स उपलब्ध आहेत:</p>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full text-sm border border-[#e2e8f0] dark:border-[#252A31]">
                <thead className="bg-[#f8fafc] dark:bg-[#090B0F]">
                  <tr>
                    <th className="text-left px-4 py-2 border">श्रेणी</th>
                    <th className="text-left px-4 py-2 border">वाटप केलेले शेअर्स</th>
                    <th className="text-left px-4 py-2 border">सबस्क्रिप्शन</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="px-4 py-2 border font-medium">QIB</td><td className="px-4 py-2 border">5,00,000</td><td className="px-4 py-2 border">12x</td></tr>
                  <tr><td className="px-4 py-2 border font-medium">Retail</td><td className="px-4 py-2 border">3,50,000</td><td className="px-4 py-2 border">25x</td></tr>
                  <tr><td className="px-4 py-2 border font-medium">HNI</td><td className="px-4 py-2 border">1,50,000</td><td className="px-4 py-2 border">80x</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">हे सोपे विभाजन दृश्यरूपात दाखवते की वाटप टक्केवारी निश्चित असूनही श्रेणींमध्ये ओव्हरसबस्क्रिप्शनची पातळी कशी वेगळी असते.</p>
          </Section>

          <Section id="faqs" title="वारंवार विचारले जाणारे प्रश्न (गुंतवणूकदार श्रेणी)">
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-xl p-5">
                <h3 className="font-semibold text-[#0f172a] dark:text-[#F1F5F9]">जास्त QIB सबस्क्रिप्शनने लिस्टिंग नफ्याची हमी मिळते का?</h3>
                <p className="mt-2 text-[#475569] dark:text-[#9AA1AA]">नाही. मजबूत QIB मागणी बहुतेकदा संस्थात्मक विश्वास दर्शवते, पण लिस्टिंग कामगिरी मूल्यांकन, बाजार परिस्थिती आणि एकूण मागणी संतुलनावर अवलंबून असते.</p>
              </div>
              <div className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-xl p-5">
                <h3 className="font-semibold text-[#0f172a] dark:text-[#F1F5F9]">HNI सबस्क्रिप्शन कधीकधी इतके जास्त का असते?</h3>
                <p className="mt-2 text-[#475569] dark:text-[#9AA1AA]">लीव्हरेज्ड फंडिंगमुळे HNI सबस्क्रिप्शन खूप जास्त दिसू शकते, जिथे गुंतवणूकदार मोठ्या प्रमाणात अर्ज करण्यासाठी भांडवल उधार घेतात.</p>
              </div>
              <div className="bg-white dark:bg-[#111418] border border-[#e2e8f0] dark:border-[#252A31] rounded-xl p-5">
                <h3 className="font-semibold text-[#0f172a] dark:text-[#F1F5F9]">Retail वाटप पूर्णपणे लॉटरीवर आधारित आहे का?</h3>
                <p className="mt-2 text-[#475569] dark:text-[#9AA1AA]">होय. जास्त मागणी असलेल्या IPO मध्ये, वैध Retail अर्ज संगणकीकृत लॉटरी प्रणालीत जातात जिथे किमान लॉट अर्जदारांमध्ये योग्यरित्या वितरित केले जातात.</p>
              </div>
            </div>
          </Section>

          <Section id="cross-links" title="संबंधित IPO मार्गदर्शक">
            <p>सबस्क्रिप्शन इतर IPO मेट्रिक्सशी कसे जोडले जाते हे समजून घेण्यासाठी पाहा:</p>
            <ul className="list-disc pr-6 pl-6 space-y-2">
              <li><Link href="/mr/ipo-subscription-meaning" className="text-[#1C317A] dark:text-blue-400 underline">IPO सबस्क्रिप्शन म्हणजे काय</Link></li>
              <li><Link href="/mr/how-ipo-allotment-works" className="text-[#1C317A] dark:text-blue-400 underline">IPO वाटप कसे होते</Link></li>
              <li><Link href="/mr/what-is-ipo-gmp" className="text-[#1C317A] dark:text-blue-400 underline">IPO GMP म्हणजे काय</Link></li>
              <li><Link href="/mr/ipo-grey-market-guide" className="text-[#1C317A] dark:text-blue-400 underline">IPO ग्रे मार्केट मार्गदर्शक</Link></li>
              <li><Link href="/mr/anchor-investor-lock-in-period" className="text-[#1C317A] dark:text-blue-400 underline">अँकर गुंतवणूकदार लॉक-इन कालावधी</Link></li>
              <li><Link href="/mr/ipo-cut-off-price-meaning" className="text-[#1C317A] dark:text-blue-400 underline">Cut-off Price म्हणजे काय</Link></li>
              <li><Link href="/ipo-allotment-probability-calculator" className="text-[#1C317A] dark:text-blue-400 underline">IPO वाटप शक्यता कॅल्क्युलेटर</Link></li>
            </ul>
          </Section>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "QIB आणि Retail गुंतवणूकदारांमध्ये फरक काय आहे?", acceptedAnswer: { "@type": "Answer", text: "QIB हे संस्थात्मक गुंतवणूकदार असतात ज्यांना 50% वाटप मिळते, तर Retail गुंतवणूकदार ₹2 लाखांपर्यंत अर्ज करतात आणि त्यांना 35% वाटप मिळते." } },
              { "@type": "Question", name: "HNI वाटप लॉटरीवर आधारित आहे का?", acceptedAnswer: { "@type": "Answer", text: "नाही. HNI वाटप अर्ज केलेल्या शेअर्सच्या संख्येनुसार प्रमाणबद्ध असते." } },
              { "@type": "Question", name: "IPO मध्ये 20x सबस्क्रिप्शन म्हणजे काय?", acceptedAnswer: { "@type": "Answer", text: "20x सबस्क्रिप्शन म्हणजे गुंतवणूकदारांनी त्या श्रेणीत उपलब्ध शेअर्सच्या 20 पट जास्त शेअर्ससाठी अर्ज केला आहे." } },
              { "@type": "Question", name: "जास्त QIB सबस्क्रिप्शन मजबूत लिस्टिंगचे संकेत आहे का?", acceptedAnswer: { "@type": "Answer", text: "जास्त QIB सबस्क्रिप्शन अनेकदा संस्थात्मक विश्वास दर्शवते, जे लिस्टिंग भावनेला आधार देऊ शकते, पण ते लिस्टिंग नफ्याची हमी देत नाही." } },
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
