import Link from "next/link";

const PrivacyPolicy = () => {
  return (
    <div className="space-y-4 min-h-screen w-full p-4">
      <h1 className="text-2xl font-bold text-white">Terms of Service</h1>
      <p className="text-gray-300 text-base">{`Welcome to Vigilant Owl, an AI-powered digital safety service designed to help parents understand their children's online group interactions. By accessing or using our website and services, you agree to comply with and be bound by these Terms of Service ("Terms").`}</p>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">1. Introduction</h2>
        <p className="text-gray-300 text-base">
          {`Vigilant Owl is a brand of Andrea Cintra Stelin D'Ambrosio, operating as a sole proprietorship registered in Switzerland. Our mission is to provide parents with insights into their children's online interactions while prioritizing privacy and independence.`}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">2. Services Provided</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-300 text-base">
          <li>
            <span className="font-medium text-gray-200">AI Monitoring:</span> We offer AI-driven insights into group conversations on platforms such as WhatsApp, Discord, and Roblox.
          </li>
          <li>
            <span className="font-medium text-gray-200">Privacy-First Approach:</span> Our service captures only conversation sentiment and general trends, not specific messages or personal communications.
          </li>
          <li>
            <span className="font-medium text-gray-200">Consent Requirements:</span> All group members must provide explicit consent before monitoring begins.
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">3. User Eligibility and Registration</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-300 text-base">
          <li>
            <span className="font-medium text-gray-200">Age Requirements:</span> Parents or legal guardians must be at least 18 years old to register for Vigilant Owl.
          </li>
          <li>
            <span className="font-medium text-gray-200">Account Creation:</span> You must provide accurate, current, and complete information during registration.
          </li>
          <li>
            <span className="font-medium text-gray-200">Account Security:</span> You are responsible for maintaining the confidentiality of your account credentials.
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">4. Consent and Privacy</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-300 text-base">
          <li>
            <span className="font-medium text-gray-200">Group Member Consent:</span> You must obtain explicit consent from all group members (or their legal guardians) before enabling monitoring.
          </li>
          <li>
            <span className="font-medium text-gray-200">Data Collection:</span> We only collect and analyze general sentiment data, not individual messages or personal information.
          </li>
          <li>
            <span className="font-medium text-gray-200">Data Security:</span> All sentiment summaries are encrypted and stored according to industry security standards.
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">5. Acceptable Use</h2>
        <p className="text-gray-300 text-base">
          Users agree not to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-300 text-base">
          <li>Use the service for unauthorized surveillance or monitoring without consent.</li>
          <li>Attempt to bypass or compromise our privacy protection measures.</li>
          <li>Share access to your account with unauthorized users.</li>
          <li>Use the service for any illegal or harmful purposes.</li>
          <li>Attempt to reverse engineer or extract data from our AI systems.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">6. Service Limitations</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-300 text-base">
          <li>
            <span className="font-medium text-gray-200">AI Analysis:</span> Our service provides insights based on AI analysis and may not capture every nuance of human communication.
          </li>
          <li>
            <span className="font-medium text-gray-200">Platform Support:</span> We support specific platforms and may not be compatible with all messaging services.</li>
          <li>
            <span className="font-medium text-gray-200">No Guarantee:</span> While we strive for accuracy, we cannot guarantee the detection of all concerning content or behaviors.
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">7. Changes to Service</h2>
        <p className="text-gray-300 text-base">
          We reserve the right to modify or discontinue any part of our service with notice to users. Major changes will be communicated via email and require renewed consent if they affect privacy or monitoring capabilities.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold text-gray-100">8. Termination</h2>
        <p className="text-gray-300">
          We may terminate or suspend access to our service immediately, without prior notice, for conduct that we believe violates these Terms or puts users at risk.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">9. Disclaimer of Warranties</h2>
        <p className="text-gray-300 text-base">
          {`While we strive to provide reliable digital safety insights, our service is provided "as is" without warranties of any kind, either express or implied. We do not guarantee that our service will prevent all online risks or capture all concerning interactions.`}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">10. Business Information</h2>
        <p className="text-gray-300 text-base">
          {`Vigilant Owl is a brand of Andrea Cintra Stelin D'Ambrosio, operating as a sole proprietorship registered in Switzerland.`}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">11. Customer Service Contact Details</h2>
        <p className="text-gray-300 text-base">
          For any inquiries or support, please contact us at: <Link className="underline text-blue-400 hover:text-blue-600 transition-all" href="mailto:info@vigilant-owl.org">info@vigilant-owl.org</Link>
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">12. Policies</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-300 text-base">
          <li>
            <span className="font-medium text-gray-200">Refund Policy:</span> Refunds are available within 30 days of purchase if you are not satisfied with our service.
          </li>
          <li>
            <span className="font-medium text-gray-200">Cancellation Policy:</span> You may cancel your subscription at any time through your account settings.</li>
          <li>
            <span className="font-medium text-gray-200">Legal Restrictions:</span> Our services comply with Swiss laws and are not available in regions where such services are prohibited.
          </li>
          <li>
            <span className="font-medium text-gray-200">Promotional Terms:</span> Promotional offers are subject to change and are valid for new customers only.
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">13. Privacy Policy</h2>
        <p className="text-gray-300 text-base">
          Please refer to our Privacy Policy for information on how we collect, use, and protect your personal information.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">14. Cookie Policy</h2>
        <p className="text-gray-300 text-base">
          This website uses cookies to enhance your browsing experience. For more information, please see our <Link className="underline text-blue-400 hover:text-blue-600 transition-all" href="/cookie-policy">Cookie Policy</Link>.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">15. Changes to These Terms</h2>
        <p className="text-gray-300 text-base">
          We may update these Terms periodically. If we make material changes, we will notify you by updating the effective date and posting the revised Terms on this page.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">16. Governing Law</h2>
        <p className="text-gray-300 text-base">
          These Terms are governed by the laws of Switzerland.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">17. Contact Information</h2>
        <p className="text-gray-300 text-base">
          For questions about these Terms of Service or our privacy practices, please contact us at <Link className="underline text-blue-400 hover:text-blue-600 transition-all" href="mailto:info@vigilant-owl.org">info@vigilant-owl.org</Link>.
        </p>
      </section>

      <section className="space-y-2">
        <p className="text-gray-300 text-base">
          By using Vigilant Owl, you acknowledge that you have read, understood, and agree to be bound by these Terms.
        </p>
      </section>

    </div >
  );
}

export default PrivacyPolicy;