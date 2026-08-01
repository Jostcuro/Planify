import { SignIn } from '@clerk/clerk-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

const REDIRECT_KEY = 'planify:redirect-after-login'

export default function SignInPage() {
  const [redirectUrl] = useState(() => {
    const saved = sessionStorage.getItem(REDIRECT_KEY)
    sessionStorage.removeItem(REDIRECT_KEY)
    return saved ?? '/dashboard'
  })

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-4">
      <SignIn routing="path" path="/login" afterSignInUrl={redirectUrl} afterSignUpUrl="/dashboard" signUpUrl="/sign-up" />
      <Button asChild variant="link">
        <Link to="/">Volver al inicio</Link>
      </Button>
    </main>
  )
}
