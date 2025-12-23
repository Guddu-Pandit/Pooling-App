"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const supabase = createClient()
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { name },
  },
})

if (error) {
  setError(error.message)
  return
}

router.push("/")
// login page
  }

  return (
    <div className={cn(className)} {...props}>
      <Card className="overflow-hidden py-0">
  <CardContent className="grid md:grid-cols-2 p-0">

    {/* IMAGE SECTION — LEFT */}
    <div className="bg-muted relative hidden md:block">
            <img
              src="/login.webp"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>

    {/* FORM SECTION — RIGHT */}
    <form onSubmit={handleSignup} className="p-6 md:p-8 space-y-4">
      <FieldGroup>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground">
            Sign up to get started with Polling App
          </p>
        </div>

        <Field>
          <FieldLabel>Full Name</FieldLabel>
          <Input
            type="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Field>

        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>

        <Field>
          <FieldLabel>Password</FieldLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </Button>

        <FieldDescription className="text-center">
          Already have an account?{" "}
          <a href="/" className="underline">
            Login
          </a>
        </FieldDescription>
      </FieldGroup>
    </form>

  </CardContent>
</Card>

    </div>
  )
}
