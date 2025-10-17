export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 sm:p-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Terms of Service
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
            Welcome to Monetly. These Terms of Service (&quot;Terms&quot;) govern your access to and use of
            our expense tracking application and services. By accessing or using Monetly, you agree
            to be bound by these Terms. If you do not agree to these Terms, please do not use our service.
          </p>
        </section>

        {/* Acceptance of Terms */}
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            By creating an account or using Monetly, you acknowledge that you have read, understood,
            and agree to be bound by these Terms and our Privacy Policy. You must be at least 13 years
            old to use our service.
          </p>
        </section>

        {/* Description of Service */}
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            2. Description of Service
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Monetly provides a web-based expense tracking and budgeting application that allows you to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
            <li>Track and categorize your expenses</li>
            <li>Set and manage budgets</li>
            <li>View spending insights and analytics</li>
            <li>Create recurring expenses</li>
            <li>Export your financial data</li>
            <li>Access your data across multiple devices</li>
          </ul>
          <p className="text-slate-700 leading-relaxed mt-4">
            We reserve the right to modify, suspend, or discontinue any aspect of the service at any
            time with or without notice.
          </p>
        </section>

        {/* User Accounts */}
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            3. User Accounts and Registration
          </h2>
          <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">
            3.1 Account Creation
          </h3>
          <p className="text-slate-700 leading-relaxed mb-4">
            To use Monetly, you must sign in with a valid Google account. You are responsible for:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
            <li>Maintaining the security of your Google account</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized access</li>
          </ul>

          <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">
            3.2 Account Restrictions
          </h3>
          <p className="text-slate-700 leading-relaxed mb-4">
            You may not:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
            <li>Create multiple accounts to abuse or circumvent our policies</li>
            <li>Share your account credentials with others</li>
            <li>Use another user&apos;s account without permission</li>
            <li>Attempt to gain unauthorized access to our systems</li>
          </ul>
        </section>

        {/* Acceptable Use */}
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            4. Acceptable Use Policy
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            You agree not to use Monetly to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe upon the rights of others</li>
            <li>Upload malicious code, viruses, or harmful software</li>
            <li>Attempt to reverse engineer or decompile our application</li>
            <li>Scrape, crawl, or use automated tools to access our service</li>
            <li>Interfere with or disrupt the service or servers</li>
            <li>Impersonate any person or entity</li>
            <li>Engage in fraudulent or deceptive practices</li>
          </ul>
        </section>

        {/* Data and Privacy */}
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            5. Your Data and Privacy
          </h2>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-4">
            <p className="text-slate-700 leading-relaxed">
              <strong className="text-blue-700">You own your data.</strong> All expense information,
              budgets, and financial data you input into Monetly remains your property.
            </p>
          </div>
          <p className="text-slate-700 leading-relaxed mb-4">
            By using Monetly, you grant us a limited license to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
            <li>Store and process your data to provide the service</li>
            <li>Display your data to you across devices</li>
            <li>Create backups of your data for disaster recovery</li>
          </ul>
          <p className="text-slate-700 leading-relaxed mt-4">
            For more details, please see our <a href="/privacy" className="text-indigo-600 hover:underline font-semibold">Privacy Policy</a>.
          </p>
        </section>

        {/* Intellectual Property */}
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            6. Intellectual Property Rights
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Monetly and its original content, features, and functionality are owned by us and are
            protected by international copyright, trademark, and other intellectual property laws.
          </p>
          <p className="text-slate-700 leading-relaxed">
            You may not copy, modify, distribute, sell, or lease any part of our service without
            our prior written permission.
          </p>
        </section>

        {/* Disclaimers */}
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            7. Disclaimers and Limitations
          </h2>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-4">
            <p className="text-slate-700 leading-relaxed">
              <strong className="text-yellow-700">⚠️ Important:</strong> Monetly is provided &quot;as is&quot;
              and &quot;as available&quot; without warranties of any kind, either express or implied.
            </p>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">
            7.1 No Financial Advice
          </h3>
          <p className="text-slate-700 leading-relaxed mb-4">
            Monetly is a tool for tracking expenses and managing budgets. It does not provide
            financial, investment, tax, or legal advice. All financial decisions are your sole
            responsibility.
          </p>

          <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">
            7.2 Accuracy of Information
          </h3>
          <p className="text-slate-700 leading-relaxed mb-4">
            While we strive for accuracy, we do not guarantee that:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
            <li>The service will be error-free or uninterrupted</li>
            <li>Defects will be corrected immediately</li>
            <li>Calculations, analytics, or insights are completely accurate</li>
            <li>The service will meet your specific requirements</li>
          </ul>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            8. Limitation of Liability
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            To the maximum extent permitted by law, Monetly and its affiliates shall not be liable for:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
            <li>Any indirect, incidental, special, or consequential damages</li>
            <li>Loss of profits, data, or goodwill</li>
            <li>Service interruptions or data loss</li>
            <li>Financial decisions made using our service</li>
            <li>Damages resulting from unauthorized access to your account</li>
          </ul>
          <p className="text-slate-700 leading-relaxed mt-4">
            Our total liability shall not exceed the amount you paid to us in the past 12 months
            (currently $0 for free service).
          </p>
        </section>

        {/* Indemnification */}
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            9. Indemnification
          </h2>
          <p className="text-slate-700 leading-relaxed">
            You agree to indemnify and hold harmless Monetly from any claims, damages, losses, or
            expenses arising from your use of the service, violation of these Terms, or infringement
            of any third-party rights.
          </p>
        </section>

        {/* Termination */}
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            10. Termination
          </h2>
          <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">
            10.1 By You
          </h3>
          <p className="text-slate-700 leading-relaxed mb-4">
            You may terminate your account at any time by contacting us or using account deletion
            features in the app.
          </p>

          <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">
            10.2 By Us
          </h3>
          <p className="text-slate-700 leading-relaxed mb-4">
            We may suspend or terminate your account if you:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
            <li>Violate these Terms</li>
            <li>Engage in fraudulent or abusive behavior</li>
            <li>Remain inactive for an extended period</li>
            <li>Request account deletion</li>
          </ul>
          <p className="text-slate-700 leading-relaxed mt-4">
            Upon termination, your data will be deleted within 30 days.
          </p>
        </section>

        {/* Changes to Terms */}
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            11. Changes to Terms
          </h2>
          <p className="text-slate-700 leading-relaxed">
            We reserve the right to modify these Terms at any time. We will notify you of material
            changes by posting the updated Terms and changing the &quot;Last Updated&quot; date. Your continued
            use of Monetly after changes constitutes acceptance of the new Terms.
          </p>
        </section>

        {/* Governing Law */}
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            12. Governing Law and Dispute Resolution
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            These Terms shall be governed by and construed in accordance with the laws of your
            jurisdiction, without regard to its conflict of law provisions.
          </p>
          <p className="text-slate-700 leading-relaxed">
            Any disputes arising from these Terms or your use of Monetly shall be resolved through
            good faith negotiation. If negotiation fails, disputes may be submitted to binding
            arbitration or small claims court.
          </p>
        </section>

        {/* Contact Information */}
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            13. Contact Information
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            For questions about these Terms, please contact us:
          </p>
          <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6">
            <p className="text-slate-700">
              <strong>Email:</strong> support@monetly.app<br/>
              <strong>Website:</strong> https://monetly.vercel.app
            </p>
          </div>
        </section>

        {/* Severability */}
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            14. Severability
          </h2>
          <p className="text-slate-700 leading-relaxed">
            If any provision of these Terms is found to be unenforceable or invalid, that provision
            shall be limited or eliminated to the minimum extent necessary, and the remaining provisions
            shall remain in full force and effect.
          </p>
        </section>

        {/* Entire Agreement */}
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            15. Entire Agreement
          </h2>
          <p className="text-slate-700 leading-relaxed">
            These Terms, along with our Privacy Policy, constitute the entire agreement between you
            and Monetly regarding your use of the service and supersede any prior agreements.
          </p>
        </section>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t-2 border-slate-200">
          <p className="text-center text-slate-500 text-sm">
            © 2025 Monetly. All rights reserved.
          </p>
          <p className="text-center text-slate-500 text-xs mt-2">
            By using Monetly, you agree to these Terms of Service and our <a href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
