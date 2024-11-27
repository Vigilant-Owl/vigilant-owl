import Link from "next/link";

const PrivacyPolicy = () => {
  return (
    <div className="space-y-4 min-h-screen w-full p-4">
      <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">Introduction</h2>
        <p className="text-gray-300 text-base">
          Welcome to the Vigilant Owl website. This privacy policy explains how we collect, use, and protect your personal information when you visit our website and sign up with your email. This policy applies only to data collected through our website and not to any data collected through the Vigilant Owl product itself, which will have a separate privacy policy upon its launch.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">1. Information We Collect</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-300 text-base">
          <li>
            <span className="font-medium text-gray-200">Personal Information:</span> When you sign up with your email, we collect and store your email address to send updates, news, and relevant information about Vigilant Owl.
          </li>
          <li>
            <span className="font-medium text-gray-200">Usage Data:</span> We may automatically collect non-personal data such as your IP address, browser type, pages visited, and the date and time of visits. This data helps us improve the website and understand user interactions.
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">2. How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-300 text-base">
          <li>
            <span className="font-medium text-gray-200">Communication:</span> We use your email address to send you periodic updates and information about Vigilant Owl.
          </li>
          <li>
            <span className="font-medium text-gray-200">Website Improvement:</span> Usage data helps us improve the website experience by analyzing how visitors interact with the site.
          </li>
          <li>
            <span className="font-medium text-gray-200">Legal Compliance:</span> We may process your information as required by law or to fulfill legitimate business interests.
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">3. Data Security</h2>
        <p className="text-gray-300 text-base">
          We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or disclosure. These include encryption of data in transit and at rest, secure servers, and access controls.
          <br />
          While we strive to secure your data, no method of transmission over the internet is entirely secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">4. Sharing of Information</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-300 text-base">
          <li>
            <span className="font-medium text-gray-200">Third-Party Service Providers:</span> We may share your data with trusted third-party providers who assist us with website operations, email management, and analytics. These providers are obligated to protect your information and only use it for the services we specify.
          </li>
          <li>
            <span className="font-medium text-gray-200">Legal Requirements:</span> We may disclose your information to comply with legal obligations or to protect the rights, property, or safety of Vigilant Owl, our users, or others.
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">5. Data Retention</h2>
        <p className="text-gray-300 text-base">
          We will retain your email address and usage data as long as necessary to fulfill the purposes outlined in this policy or as required by law. <Link className="underline text-blue-400 hover:text-blue-600 transition-all" href="mailto:info@vigilant-owl.org">info@vigilant-owl.org</Link>.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-300 text-base">
          <li>
            <span className="font-medium text-gray-200">Deletion Requests:</span> You may request the deletion of your data by contacting us at <Link className="underline text-blue-400 hover:text-blue-600 transition-all" href="mailto:info@vigilant-owl.org">info@vigilant-owl.org</Link>. Please note that some data may need to be retained to comply with legal obligations.
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">6. Your Rights</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-300 text-base">
          <li>
            <span className="font-medium text-gray-200">Access:</span> You may request access to the personal information we hold about you.
          </li>
          <li>
            <span className="font-medium text-gray-200">Correction and Deletion:</span> You have the right to request correction or deletion of inaccurate or outdated data.
          </li>
          <li>
            <span className="font-medium text-gray-200">Unsubscribe:</span> If you no longer wish to receive updates, you can unsubscribe by following the link provided in our emails or by contacting us directly at <Link className="underline text-blue-400 hover:text-blue-600 transition-all" href="mailto:info@vigilant-owl.org">info@vigilant-owl.org</Link>.
          </li>
          <li>
            <span className="font-medium text-gray-200">Additional Rights (for EU and Swiss Residents):</span>
            <ul className="list-disc pl-6 space-y-2 text-gray-300 text-base">
              <li>
                <span className="font-medium text-gray-200">Data Portability:</span> You may request that we transfer your personal data to another service provider in a structured, commonly used format.
              </li>
              <li>
                <span className="font-medium text-gray-200">Withdraw Consent:</span> If we process your data based on consent, you may withdraw that consent at any time.
              </li>
              <li>
                <span className="font-medium text-gray-200">Lodge a Complaint:</span> You may lodge a complaint with your local data protection authority if you believe your rights have been violated.
              </li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">7. Cookie Policy</h2>
        <p className="text-gray-300 text-base">
          This website uses cookies to enhance your browsing experience. These include essential cookies for website functionality and analytics cookies for understanding user interactions. For more information, please see our <Link className="underline text-blue-400 hover:text-blue-600 transition-all" href="/cookie-policy">Cookie Policy</Link>.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">8. Changes to This Policy</h2>
        <p className="text-gray-300 text-base">
          We may update this privacy policy periodically. If we make material changes, we will notify you by updating the effective date and posting the revised policy on this page.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">9. Contact Us</h2>
        <p className="text-gray-300 text-base">
          For questions about this privacy policy or requests regarding your data, please contact us at:
          <Link className="underline text-blue-400 hover:text-blue-600 transition-all" href="mailto:info@vigilant-owl.org">info@vigilant-owl.org</Link>
        </p>
      </section>
    </div>
  );
}

export default PrivacyPolicy;