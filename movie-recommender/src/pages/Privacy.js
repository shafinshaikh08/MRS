import React from 'react';

function Privacy() {
  return (
    <div className="text-white p-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-gray-400 italic mt-2">How we handle and protect your data</p>
      </div>
      
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-400 mb-4">Introduction</h2>
          <p className="text-gray-300">
            At MovieMate, we respect your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and safeguard your information.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-400 mb-4">Information We Collect</h2>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li>Your name and contact details when you interact with us.</li>
            <li>Information about your usage of our website (e.g., IP address, browser type).</li>
            <li>Cookies and tracking data to enhance your user experience.</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-400 mb-4">How We Use Your Information</h2>
          <p className="text-gray-300">
            We use your information to improve our services, communicate with you, and personalize your experience on MovieMate. We do not share your personal information with third parties without your consent.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-400 mb-4">Security</h2>
          <p className="text-gray-300">
            We implement industry-standard security measures to protect your personal information. However, no data transmission over the internet is entirely secure, and we cannot guarantee its absolute security.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-blue-400 mb-4">Contact Us</h2>
          <p className="text-gray-300">
            If you have any questions or concerns about our Privacy Policy, please contact us through our Contact Us page.
          </p>
        </section>
      </div>
    </div>
  );
}

export default Privacy;