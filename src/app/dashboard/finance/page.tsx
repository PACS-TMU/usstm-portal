const forms = [
    {
        name: "Reimbursement Request Form",
        url: "https://form.asana.com/?k=ai-l-z8VFWXA5p6GWsjGnA&d=1207498115170020",
    },
    {
        name: "Budget Request Form",
        url: "https://asana.com/budget-request-form-link",
    },
    {
        name: "Internal Invoices Form",
        url: "https://form.asana.com/?k=1NQgBEjWG1VBGSkzSBK0hA&d=1207498115170020",
    },
    {
        name: "External Invoices Form",
        url: "https://form.asana.com/?k=PzlZ-m9kEK2CvwGxs6Y0cg&d=1207498115170020",
    },
    {
        name: "P-Card Request Form",
        url: "https://form.asana.com/?k=QT1kvTNB3yNyBEZY0wDjUA&d=1207498115170020",
    },
];

export default function FinancePage() {
    return (
        <div className="w-full max-w-xl bg-background rounded-xl shadow-lg p-8 flex flex-col items-center mx-auto mt-10">
            <h1 className="text-3xl font-bold text-highlight-dark mb-6 text-center">
                USSTM Finance Forms (2025-2026)
            </h1>
            <ul id="finance" className="space-y-4 flex flex-col w-full">
                {forms.map((form) => (
                    <li key={form.name}>
                        <a
                            href={form.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-center px-6 py-4 rounded-lg bg-highlight text-background font-semibold text-lg shadow hover:scale-105 transition-transform ease-in-out duration-300"
                        >
                            {form.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
