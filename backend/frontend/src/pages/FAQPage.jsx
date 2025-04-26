import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const faqs = [
  {
    question: "What is Creator Platform?",
    answer: "Creator Platform is a Web3-based platform that enables creators to receive direct support from their audience using cryptocurrency. It provides a decentralized way for creators to monetize their content and build stronger connections with their community."
  },
  {
    question: "How do I get started as a creator?",
    answer: "Getting started is easy! First, connect your MetaMask wallet, then complete your creator profile with your details. Once your profile is set up, you can start receiving support from your audience."
  },
  {
    question: "What cryptocurrencies do you support?",
    answer: "Currently, we support ETH (Ethereum) for transactions. We plan to add support for more cryptocurrencies in the future to provide more options for our users."
  },
  {
    question: "Are there any fees?",
    answer: "Creating a profile and receiving support is free on our platform. The only fees involved are the standard network transaction fees (gas fees) when sending or receiving funds through the Ethereum network."
  },
  {
    question: "How secure is the platform?",
    answer: "Security is our top priority. We never store private keys or sensitive wallet information. All transactions are handled securely through MetaMask, and we use industry-standard security practices to protect user data."
  },
  {
    question: "Can I withdraw my funds at any time?",
    answer: "Yes! Since you're using your own wallet, you have full control over your funds at all times. There are no lockup periods or withdrawal restrictions."
  },
  {
    question: "How do I update my creator profile?",
    answer: "You can update your profile information at any time through your dashboard. This includes your name, bio, profile picture, and other details."
  },
  {
    question: "What happens if I lose access to my wallet?",
    answer: "Your wallet is managed by MetaMask, not by us. Make sure to keep your MetaMask seed phrase safe, as it's the only way to recover your wallet if you lose access."
  },
  {
    question: "Can I use the platform in my country?",
    answer: "The platform is accessible worldwide. However, please ensure that cryptocurrency transactions are legal in your jurisdiction and comply with local regulations."
  },
  {
    question: "How can I contact support?",
    answer: "For any questions or issues, you can reach our support team through the contact form on our website. We aim to respond to all inquiries within 24 hours."
  }
];

export default function FAQPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Find answers to common questions about Creator Platform
          </p>
        </div>

        <div className="mt-12">
          <dl className="space-y-6 divide-y divide-gray-200">
            {faqs.map((faq) => (
              <Disclosure as="div" key={faq.question} className="pt-6">
                {({ open }) => (
                  <>
                    <dt className="text-lg">
                      <Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-400">
                        <span className="font-medium text-gray-900">
                          {faq.question}
                        </span>
                        <span className="ml-6 h-7 flex items-center">
                          <ChevronDownIcon
                            className={`${open ? '-rotate-180' : 'rotate-0'} h-6 w-6 transform transition-transform duration-200`}
                            aria-hidden="true"
                          />
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                      <p className="text-base text-gray-500">{faq.answer}</p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Still have questions?
          </h2>
          <p className="mt-4 text-gray-600">
            Can't find the answer you're looking for? Please reach out to our customer support team.
          </p>
          <button className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
