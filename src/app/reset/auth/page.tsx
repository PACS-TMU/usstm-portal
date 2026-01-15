import { SubmitButton } from '@/components/form/submitButton';
import { sendEmail } from '@/server/passwordManage';

export default function ResetAuth(){

    let defaultContainer = (
        <div className="min-h-screen flex items-center justify-center bg-theme-background">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-theme-primary mb-6 text-center">
                    Account Retrieval
                </h2>
                <form className="space-y-5" method="post">
                    <div>
                        <label 
                            htmlFor="email"
                            className="block text-sm font-medium mb-1"
                        >
                            Enter email:
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="w-full px-4 py-2 border border-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-dark"
                        />
                        <SubmitButton
                            type="submit"
                            formAction={sendEmail}
                            className="w-full cursor-pointer py-2 px-4 bg-highlight-dark text-background font-semibold rounded-md hover:bg-highlight ease-in-out duration-300 transition"
                            pendingText="Processing..."
                        >
                            Submit
                        </SubmitButton>
                    </div>
                </form>
            </div>
        </div>
    )

    return defaultContainer;
}