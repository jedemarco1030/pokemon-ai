"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface FormData {
    firstName: string
    lastName: string
    email: string
    confirmEmail: string
    password: string
    confirmPassword: string
}

interface FormErrors {
    firstName?: string
    lastName?: string
    email?: string
    confirmEmail?: string
    password?: string
    confirmPassword?: string
}

export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: "",
        confirmEmail: "",
        password: "",
        confirmPassword: "",
    })
    const [errors, setErrors] = useState<FormErrors>({})
    const [isLoading, setIsLoading] = useState(false)
    const [apiError, setApiError] = useState("")

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        // First Name validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required"
        } else if (formData.firstName.trim().length < 2) {
            newErrors.firstName = "First name must be at least 2 characters"
        }

        // Last Name validation
        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required"
        } else if (formData.lastName.trim().length < 2) {
            newErrors.lastName = "Last name must be at least 2 characters"
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.email) {
            newErrors.email = "Email is required"
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        }

        // Confirm Email validation
        if (!formData.confirmEmail) {
            newErrors.confirmEmail = "Please confirm your email"
        } else if (formData.email !== formData.confirmEmail) {
            newErrors.confirmEmail = "Email addresses do not match"
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required"
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters"
        } else if (!/(?=.*[a-z])/.test(formData.password)) {
            newErrors.password = "Password must contain at least one lowercase letter"
        } else if (!/(?=.*[A-Z])/.test(formData.password)) {
            newErrors.password = "Password must contain at least one uppercase letter"
        } else if (!/(?=.*\d)/.test(formData.password)) {
            newErrors.password = "Password must contain at least one number"
        }

        // Confirm Password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password"
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }))
        }
        // Clear API error when user makes changes
        if (apiError) {
            setApiError("")
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setApiError("")

        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            const supabase = createClient()

            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
                    data: {
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                    },
                },
            })

            if (authError) throw authError

            if (authData.user) {
                const { error: profileError } = await supabase.from("profiles").insert({
                    id: authData.user.id,
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                })

                if (profileError) {
                    console.error("Profile creation error:", profileError)
                    // Don't throw - the auth account was created successfully
                }
            }

            // Redirect to success page
            router.push("/register/success")
        } catch (error: unknown) {
            setApiError(error instanceof Error ? error.message : "An error occurred during registration")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-6 md:p-10 bg-background">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Create Account</CardTitle>
                        <CardDescription>Register to start exploring Pokemon with Pokemon AI</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* First Name */}
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={(e) => handleChange("firstName", e.target.value)}
                                    className={errors.firstName ? "border-red-500" : ""}
                                />
                                {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                            </div>

                            {/* Last Name */}
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={(e) => handleChange("lastName", e.target.value)}
                                    className={errors.lastName ? "border-red-500" : ""}
                                />
                                {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    className={errors.email ? "border-red-500" : ""}
                                />
                                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                            </div>

                            {/* Confirm Email */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmEmail">Confirm Email Address</Label>
                                <Input
                                    id="confirmEmail"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.confirmEmail}
                                    onChange={(e) => handleChange("confirmEmail", e.target.value)}
                                    className={errors.confirmEmail ? "border-red-500" : ""}
                                />
                                {errors.confirmEmail && <p className="text-sm text-red-500">{errors.confirmEmail}</p>}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => handleChange("password", e.target.value)}
                                    className={errors.password ? "border-red-500" : ""}
                                />
                                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                                    className={errors.confirmPassword ? "border-red-500" : ""}
                                />
                                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                            </div>

                            {/* API Error Message */}
                            {apiError && <p className="text-sm text-red-500">{apiError}</p>}

                            {/* Submit Button */}
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Creating Account..." : "Create Account"}
                            </Button>

                            {/* Login Link */}
                            <div className="text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link href="/login" className="text-primary hover:underline underline-offset-4">
                                    Login
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
