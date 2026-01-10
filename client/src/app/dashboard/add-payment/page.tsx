import AddPaymentForm from '@/components/payment/AddPaymentForm';

export default function AddPaymentPage() {
    return (
        <div className="min-h-screen bg-gray-50/50 p-8 space-y-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">New Transaction</h1>
                    <p className="text-gray-500 mt-2">Create a new beneficiary payment and run instant fraud checks.</p>
                </header>

                <AddPaymentForm />
            </div>
        </div>
    );
}
