export default function PricingSection() {
    const plans = [
        {
            name: "Starter",
            price: "Free",
            period: "",
            description: "Try Resume AI with core ATS checks.",
            highlight: false,
            features: [
                "3 resume reviews per month",
                "Basic ATS compatibility scoring",
                "Single modern resume layout",
            ],
        },
        {
            name: "Pro",
            price: "$9",
            period: "/month",
            description: "For active job seekers applying weekly.",
            highlight: true,
            features: [
                "Unlimited resume reviews",
                "AI bullet rewrites & keyword suggestions",
                "Access to all templates",
                "Cover letter generation included",
            ],
            badge: "Most popular",
        },
        {
            name: "Elite",
            price: "$29",
            period: "/month",
            description: "For power users and career coaches.",
            highlight: false,
            features: [
                "Everything in Pro",
                "Priority support",
                "Best for career coaches & bootcamps",
            ],
        },
    ];

    return (
        <section
            id="pricing"
            className="border-y border-slate-200 bg-slate-50/60 py-14 sm:py-20"
        >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 sm:mb-14">
                    <p className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 mb-3">
                        Simple, transparent pricing
                    </p>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
                        Choose the plan that fits your search
                    </h2>
                    <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-600">
                        Start free, then upgrade when you are sending applications every week.
                        No hidden fees, cancel anytime.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`flex flex-col rounded-2xl border bg-white shadow-sm p-6 sm:p-7 ${
                                plan.highlight
                                    ? "border-blue-500 shadow-blue-100 scale-[1.01]"
                                    : "border-slate-200"
                            }`}
                        >
                            {plan.badge && (
                                <span className="self-start rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 mb-4">
                                    {plan.badge}
                                </span>
                            )}
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">
                                {plan.name}
                            </h3>
                            <p className="text-sm text-slate-500 mb-5">
                                {plan.description}
                            </p>
                            <div className="flex items-baseline gap-1 mb-5">
                                <span className="text-3xl font-extrabold text-slate-900">
                                    {plan.price}
                                </span>
                                {plan.period && (
                                    <span className="text-sm text-slate-500">
                                        {plan.period}
                                    </span>
                                )}
                            </div>
                            <ul className="mb-6 space-y-2 text-sm text-slate-700">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-2">
                                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                className={`mt-auto w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                                    plan.highlight
                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                        : "bg-slate-900 text-white hover:bg-slate-800"
                                }`}
                            >
                                {plan.price === "Free" ? "Get started" : "Start 7‑day trial"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

