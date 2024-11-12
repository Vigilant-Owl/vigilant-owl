import Link from "next/link";

const PrivacyPolicy = () => {
  return (
    <div className="space-y-4 min-h-screen w-full p-4">
      <h1 className="text-2xl font-bold text-white">Terms of Service</h1>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">1. Introduction</h2>
        <p className="text-gray-300 text-base">
          {`Welcome to Vigilant Owl, an AI-powered digital safety service designed to help parents understand their children's online group interactions. These Terms of Service ("Terms") govern your use of Vigilant Owl's website and services. By using Vigilant Owl, you agree to these terms and our commitment to balancing digital safety with privacy and independence.`}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">2. Service Description</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-300 text-base">
          <li>
            <span className="font-medium text-gray-200">AI Monitoring:</span> Vigilant Owl provides AI-driven insights into group conversations on platforms like WhatsApp, Discord, Roblox, and other supported platforms.
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
          <li>Use the service for unauthorized surveillance or monitoring without consent</li>
          <li>Attempt to bypass or compromise our privacy protection measures</li>
          <li>Share access to your account with unauthorized users</li>
          <li>Use the service for any illegal or harmful purposes</li>
          <li>Attempt to reverse engineer or extract data from our AI systems</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">6. Service Limitations</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-300 text-base">
          <li>
            <span className="font-medium text-gray-200">AI Analysis:</span> Our service provides insights based on AI analysis and may not capture every nuance of human communication.
          </li>
          <li>
            <span className="font-medium text-gray-200">Platform Support:</span> We support specific platforms and may not be compatible with all messaging services.
          </li>
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
        <h2 className="text-xl font-semibold text-gray-100">10. Contact Information</h2>
        <p className="text-gray-300 text-base">
          For questions about these Terms of Service or our privacy practices, please contact us at <Link className="underline text-blue-400 hover:text-blue-600 transition-all" href=" mailto:marco@vigilant-owl.org">marco@vigilant-owl.org</Link>
        </p>
      </section>
    </div >
  );
}

export default PrivacyPolicy;