import Link from "next/link";

const Help = () => {
  return (
    <div className="space-y-4 min-h-screen w-full p-4">
      <h1 className="text-2xl font-bold text-white">Help & Support</h1>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">Frequently Asked Questions</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-300 text-base">
          <li>
            <span className="font-medium text-gray-200">How do I contact customer support?</span>
            <p>You can reach our customer support team by emailing us at <Link className="underline text-blue-400 hover:text-blue-600 transition-all" href="mailto:info@vigilant-owl.org">info@vigilant-owl.org</Link>.</p>
          </li>
          <li>
            <span className="font-medium text-gray-200">What platforms are supported?</span>
            <p>We currently support monitoring for platforms like WhatsApp, Discord, and Roblox. Check our website for updates on newly supported platforms.</p>
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">Technical Support</h2>
        <p className="text-gray-300 text-base">
          {`If you're experiencing technical issues, please try the following troubleshooting steps:`}
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-300 text-base">
          <li>Ensure you have a stable internet connection.</li>
          <li>{`Clear your browser's cache and cookies.`}</li>
          <li>Try accessing the website from a different browser or device.</li>
        </ul>
        <p className="text-gray-300 text-base">
          If the problem persists, contact our support team with a detailed description of the issue.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-100">Contact Us</h2>
        <p className="text-gray-300 text-base">
          For further assistance, please reach out to us at: <Link className="underline text-blue-400 hover:text-blue-600 transition-all" href="mailto:info@vigilant-owl.org">info@vigilant-owl.org</Link>.
        </p>
      </section>
    </div>
  );
}

export default Help;