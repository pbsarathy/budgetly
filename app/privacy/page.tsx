export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 sm:p-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-600 text-sm">
            <strong>Effective Date:</strong> October 16, 2025
          </p>
          <p className="text-slate-600 text-sm">
            <strong>Last Updated:</strong> October 16, 2025
          </p>
        </div>

        {/* Introduction */}
        <section className="mb-8">
          <p className="text-slate-700 leading-relaxed mb-4">
            Welcome to Monetly (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy
            and ensuring the security of your personal and financial information. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your information when you use our
            expense tracking application.
          </p>
        </section>

        {/* Information We Collect */}
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            1. Information We Collect
          </h2>

          <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">
            1.1 Information You Provide
          </h3>
          <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
            <li><strong>Account Information:</strong> Email address and name via Google OAuth</li>
            <li><strong>Expense Data:</strong> Amount, category, description, date, and notes for each expense</li>
            <li><strong>Budget Information:</strong> Budget limits and categories you set</li>
            <li><strong>Recurring Expenses:</strong> Frequency and details of recurring transactions</li>
          </ul>

          <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">
            1.2 Automatically Collected Information
          </h3>
          <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
            <li><strong>Device Information:</strong> Browser type, operating system, device type</li>
            <li><strong>Usage Data:</strong> Pages visited, features used, time spent in the app</li>
            <li><strong>Log Data:</strong> IP address, access times, error logs</li>
          </ul>
        </section>

        {/* How We Use Your Information */}
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            2. How We Use Your Information
          </h2>
          <p className="text-slate-700 mb-3">We use your information to:</p>
          <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
            <li>Provide, maintain, and improve our expense tracking services</li>
            <li>Process and store your expense data securely</li>
            <li>Calculate budgets, trends, and spending insights</li>
            <li>Send service-related notifications and updates</li>
            <li>Respond to your support requests and inquiries</li>
            <li>Detect, prevent, and address technical issues or security threats</li>
            <li>Comply with legal obligations and enforce our terms</li>
          </ul>
        </section>

        {/* Data Storage and Security */}
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            3. Data Storage and Security
          </h2>
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-4">
            <p className="text-slate-700 leading-relaxed">
              <strong className="text-green-700">🔒 Your data is secure:</strong> We use Supabase,
              a trusted cloud database provider, to store your information. All data is:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4 mt-3">
              <li>Encrypted at rest using AES-256 encryption</li>
              <li>Encrypted in transit using SSL/TLS protocols</li>
              <li>Protected by Row-Level Security (RLS) policies</li>
              <li>Backed up automatically with 99.9% uptime SLA</li>
              <li>Stored in secure data centers with physical security</li>
            </ul>
          </div>
        </section>

        {/* Data Sharing */}
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            4. Information Sharing and Disclosure
          </h2>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-4">
            <p className="text-slate-700 leading-relaxed">
              <strong className="text-blue-700">We never sell your data.</strong> We only share your
              information in these limited circumstances:
            </p>
          </div>
          <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
            <li><strong>Service Providers:</strong> Supabase (database hosting), Vercel (application hosting)</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            <li><strong>Business Transfers:</strong> In case of merger, acquisition, or asset sale (with notice)</li>
            <li><strong>With Your Consent:</strong> Any other sharing will require your explicit permission</li>
          </ul>
        </section>

        {/* Your Rights */}
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            5. Your Rights and Choices
          </h2>
          <p className="text-slate-700 mb-3">You have the right to:</p>
          <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
            <li><strong>Access:</strong> View all your data at any time in the app</li>
            <li><strong>Export:</strong> Download your expense data in CSV or PDF format</li>
            <li><strong>Delete:</strong> Remove individual expenses or your entire account</li>
            <li><strong>Correct:</strong> Edit or update any of your information</li>
            <li><strong>Opt-Out:</strong> Disable email notifications in settings</li>
            <li><strong>Account Deletion:</strong> Request complete account deletion (contact us)</li>
          </ul>
        </section>

        {/* Data Retention */}
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            6. Data Retention
          </h2>
          <p className="text-slate-700 leading-relaxed">
            We retain your data for as long as your account is active or as needed to provide services.
            If you delete your account, we will delete your data within 30 days, except where retention
            is required by law.
          </p>
        </section>

        {/* Children's Privacy */}
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            7. Children&apos;s Privacy
          </h2>
          <p className="text-slate-700 leading-relaxed">
            Our service is not intended for children under 13 years of age. We do not knowingly collect
            personal information from children under 13. If you believe we have collected information
            from a child under 13, please contact us immediately.
          </p>
        </section>

        {/* International Users */}
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            8. International Data Transfers
          </h2>
          <p className="text-slate-700 leading-relaxed">
            Your data may be transferred to and processed in countries other than your own. We ensure
            that such transfers comply with applicable data protection laws and that your data receives
            an adequate level of protection.
          </p>
        </section>

        {/* Changes to Policy */}
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            9. Changes to This Privacy Policy
          </h2>
          <p className="text-slate-700 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any changes by
            posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date. You are
            advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>

        {/* Contact */}
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            10. Contact Us
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6">
            <p className="text-slate-700">
              <strong>Email:</strong> support@monetly.app<br/>
              <strong>Website:</strong> https://monetly.vercel.app
            </p>
          </div>
        </section>

        {/* Compliance */}
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            11. Legal Compliance
          </h2>
          <p className="text-slate-700 leading-relaxed">
            This Privacy Policy is designed to comply with:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4 mt-3">
            <li><strong>GDPR</strong> (General Data Protection Regulation) - EU</li>
            <li><strong>CCPA</strong> (California Consumer Privacy Act) - California, USA</li>
            <li><strong>PIPEDA</strong> (Personal Information Protection and Electronic Documents Act) - Canada</li>
          </ul>
        </section>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t-2 border-slate-200">
          <p className="text-center text-slate-500 text-sm">
            © 2025 Monetly. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
