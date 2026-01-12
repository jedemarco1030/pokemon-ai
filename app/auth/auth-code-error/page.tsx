import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthCodeError() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Authentication Error</CardTitle>
            <CardDescription>
              There was an error verifying your email. This might happen if the link has expired or has already been used.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please try registering again or contact support if the problem persists.
            </p>
            <Button asChild className="w-full">
              <Link href="/register">Back to Register</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
