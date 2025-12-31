import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function RegisterSuccessPage() {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-6 md:p-10 bg-background">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="text-2xl">Check Your Email</CardTitle>
                        <CardDescription className="text-balance">
                            We've sent you a confirmation email. Please check your inbox and click the confirmation link to activate
                            your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
                            <p className="font-medium mb-1">Next Steps:</p>
                            <ol className="list-decimal list-inside space-y-1">
                                <li>Check your email inbox</li>
                                <li>Click the confirmation link</li>
                                <li>Return here to login</li>
                            </ol>
                        </div>
                        <Button asChild className="w-full">
                            <Link href="/login">Go to Login</Link>
                        </Button>
                        <div className="text-center text-sm text-muted-foreground">
                            Didn't receive the email?{" "}
                            <Link href="/register" className="text-primary hover:underline underline-offset-4">
                                Try again
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
