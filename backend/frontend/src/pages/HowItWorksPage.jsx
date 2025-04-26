import { WalletIcon, UserPlusIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const steps = [
  {
    title: 'Connect Your Wallet',
    description: 'Connect your MetaMask wallet to get started. This will be your key to interacting with the platform.',
    icon: WalletIcon,
  },
  {
    title: 'Create Your Profile',
    description: 'Set up your creator profile with your details, bio, and profile picture.',
    icon: UserPlusIcon,
  },
  {
    title: 'Start Receiving Support',
    description: 'Share your profile with your audience and start receiving support through cryptocurrency.',
    icon: CurrencyDollarIcon,
  },
];

export default function HowItWorksPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            How It Works
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Get started with Creator Platform in three simple steps. Our platform makes it easy to connect with your audience and receive support.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                {index !== steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 right-0 h-0.5 w-full transform translate-x-1/2 bg-gray-200" />
                )}
                <div className="relative">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600">
                      <step.icon className="h-8 w-8" aria-hidden="true" />
                    </div>
                    <h3 className="mt-6 text-xl font-medium text-gray-900">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-base text-gray-500 text-center">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <div className="bg-indigo-50 rounded-lg px-6 py-8 sm:p-10">
            <div className="max-w-xl mx-auto text-center">
              <h2 className="text-2xl font-semibold text-gray-900">
                Ready to get started?
              </h2>
              <p className="mt-4 text-gray-600">
                Join our growing community of creators and start receiving support from your audience today.
              </p>
              <div className="mt-8">
                <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Become a Creator
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            Frequently Asked Questions
          </h2>
          <dl className="mt-8 space-y-6 divide-y divide-gray-200">
            <div className="pt-6">
              <dt className="text-lg font-medium text-gray-900">
                What cryptocurrencies do you support?
              </dt>
              <dd className="mt-2 text-base text-gray-500">
                Currently, we support ETH through the Ethereum network. More cryptocurrencies will be added in the future.
              </dd>
            </div>
            <div className="pt-6">
              <dt className="text-lg font-medium text-gray-900">
                How much does it cost to use the platform?
              </dt>
              <dd className="mt-2 text-base text-gray-500">
                Creating a profile and receiving support is free. There are only standard network transaction fees when sending or receiving funds.
              </dd>
            </div>
            <div className="pt-6">
              <dt className="text-lg font-medium text-gray-900">
                Is my wallet information secure?
              </dt>
              <dd className="mt-2 text-base text-gray-500">
                Yes, we never store your private keys. All transactions are handled securely through MetaMask.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
