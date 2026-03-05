import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";

const plans = [
    {
        name: "Starter",
        price: "Free",
        description: "Perfect for trying out Resume AI.",
        highlight: false,
        features: [
            "3 resume reviews per month",
            "Basic ATS compatibility checks",
            "Access to 1 resume template",
            "Email support within 48 hours",
        ],
    },
    {
        name: "Pro",
        price: "$9",
        period: "/month",
        description: "For active job seekers who want deep insights.",
        highlight: true,
        features: [
            "Unlimited resume reviews",
            "AI bullet rewrites & keyword suggestions",
            "All resume templates unlocked",
            "Cover letter generation included",
            "Priority support",
        ],
        badge: "Most Popular",
    },
    {
        name: "Elite",
        price: "$29",
        period: "/month",
        description: "For power users and career coaches.",
        highlight: false,
        features: [
            "Everything in Pro",
            "Team workspace for up to 5 users",
            "Export to PDF, DOCX & share links",
            "Dedicated success manager",
        ],
    },
];

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/20 to-slate-100">
            <Navbar />

            <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <section className="text-center mb-12 sm:mb-16">
                    <p className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 mb-4">
                        Transparent pricing, cancel anytime
                    </p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">
                        Simple pricing for serious job seekers
                    </h1>
                    <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-600">
                        Start free, then upgrade when you are ready. All plans include ATS-friendly analysis and
                        AI-powered suggestions to help you land more interviews.
                    </p>
                </section>

                <section className="grid gap-6 md:grid-cols-3 mb-12">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`flex flex-col rounded-2xl border bg-white/90 shadow-sm p-6 sm:p-7 ${
                                plan.highlight
                                    ? "border-blue-500 shadow-blue-100 scale-[1.02]"
                                    : "border-slate-200"
                            }`}
                        >
                            {plan.badge && (
                                <span className="self-start rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 mb-4">
                                    {plan.badge}
                                </span>
                            )}
                            <h2 className="text-lg font-semibold text-slate-900 mb-1">{plan.name}</h2>
                            <p className="text-sm text-slate-500 mb-5">{plan.description}</p>
                            <div className="flex items-baseline gap-1 mb-5">
                                <span className="text-3xl font-extrabold text-slate-900">{plan.price}</span>
                                {plan.period && <span className="text-sm text-slate-500">{plan.period}</span>}
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
                                {plan.price === "Free" ? "Get started" : "Start 7-day trial"}
                            </button>
                        </div>
                    ))}
                </section>

                <section className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-6 sm:p-8 text-sm text-slate-600 mb-12">
                    <h3 className="text-base font-semibold text-slate-900 mb-2">Need something custom?</h3>
                    <p>
                        We also work with bootcamps, universities, and career coaches.{" "}
                        <span className="font-semibold text-blue-700">Contact us</span> for a tailored plan that fits your
                        team.
                    </p>
                </section>
            </main>

            <Footer />
        </div>
    );
}

