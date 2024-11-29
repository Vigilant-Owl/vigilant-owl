import Link from "next/link";

const CookiePolicy = () => {
  return (
    <div className="space-y-4 min-h-screen w-full p-4">
      <h1 className="text-2xl font-bold text-white">Cookie Policy</h1>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">Introduction</h2>
        <p className="text-gray-300 text-base">
          This Cookie Policy explains how Vigilant Owl uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">1. What are Cookies?</h2>
        <p className="text-gray-300 text-base">
          Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">2. Why Do We Use Cookies?</h2>
        <p className="text-gray-300 text-base">
          We use cookies to enhance your browsing experience by:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-300 text-base">
          <li>Enabling core functionalities of the website.</li>
          <li>Analyzing website traffic and user interactions.</li>
          <li>Providing personalized content and ads.</li>
        </ul>
        <p className="text-gray-300 text-base">
          Additionally, we use cookies to facilitate transactions through our payment processor, Stripe.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">3. Changes to This Cookie Policy</h2>
        <p className="text-gray-300 text-base">
          We may update this Cookie Policy from time to time to reflect changes to the cookies we use or for other operational, legal, or regulatory reasons. Please revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">4. Contact Us</h2>
        <p className="text-gray-300 text-base">
          If you have any questions about our use of cookies or other technologies, please email us at <Link className="underline text-blue-400 hover:text-blue-600 transition-all" href="mailto:info@vigilant-owl.org">info@vigilant-owl.org</Link>.
        </p>
      </section>
    </div>
  );
}

export default CookiePolicy;