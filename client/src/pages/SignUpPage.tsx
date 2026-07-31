import { SignUp } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-4">
      <SignUp routing="path" path="/sign-up" afterSignInUrl="/dashboard" afterSignUpUrl="/dashboard" />
      <Button asChild variant="link">
        <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
      </Button>
    </main>
  )
}
