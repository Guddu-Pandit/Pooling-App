"use client"

import SignupForm from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div className="bg-muted min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <SignupForm />
      </div>
    </div>
  )
}
