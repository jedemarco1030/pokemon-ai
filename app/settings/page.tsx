"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { createOrUpdateProfile, getProfile } from "@/app/actions/pokemon"
import { updateUserPassword } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { User, Lock, Save, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    
    const [isProfileLoading, setIsProfileLoading] = useState(false)
    const [isPasswordLoading, setIsPasswordLoading] = useState(false)
    const [isInitialLoading, setIsInitialLoading] = useState(true)

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login")
            return
        }

        const fetchProfile = async () => {
            if (user) {
                try {
                    const profile = await getProfile(user.id)
                    if (profile) {
                        setFirstName(profile.first_name || "")
                        setLastName(profile.last_name || "")
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error)
                    toast.error("Failed to load profile details")
                } finally {
                    setIsInitialLoading(false)
                }
            }
        }

        if (user) {
            fetchProfile()
        }
    }, [user, authLoading, router])

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setIsProfileLoading(true)
        try {
            const result = await createOrUpdateProfile(user.id, {
                first_name: firstName,
                last_name: lastName,
            })

            if (result) {
                toast.success("Profile updated successfully")
            } else {
                toast.error("Failed to update profile")
            }
        } catch (error) {
            console.error("Error updating profile:", error)
            toast.error("An error occurred while updating profile")
        } finally {
            setIsProfileLoading(false)
        }
    }

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!password) {
            toast.error("Please enter a new password")
            return
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long")
            return
        }

        setIsPasswordLoading(true)
        try {
            const result = await updateUserPassword(password)
            if (result.success) {
                toast.success("Password updated successfully")
                setPassword("")
                setConfirmPassword("")
            } else {
                toast.error(result.error || "Failed to update password")
            }
        } catch (error) {
            console.error("Error updating password:", error)
            toast.error("An error occurred while updating password")
        } finally {
            setIsPasswordLoading(false)
        }
    }

    if (authLoading || isInitialLoading) {
        return (
            <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
            
            <div className="space-y-8">
                {/* Profile Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            Profile Information
                        </CardTitle>
                        <CardDescription>
                            Update your personal details.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleUpdateProfile}>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input 
                                        id="firstName" 
                                        value={firstName} 
                                        onChange={(e) => setFirstName(e.target.value)} 
                                        placeholder="Enter your first name"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input 
                                        id="lastName" 
                                        value={lastName} 
                                        onChange={(e) => setLastName(e.target.value)} 
                                        placeholder="Enter your last name"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input 
                                    id="email" 
                                    value={user?.email || ""} 
                                    disabled 
                                    className="bg-muted"
                                />
                                <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={isProfileLoading} className="w-full sm:w-auto">
                                {isProfileLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Save Changes
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                {/* Password Change */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-primary" />
                            Security
                        </CardTitle>
                        <CardDescription>
                            Change your password to keep your account secure.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleUpdatePassword}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <Input 
                                    id="password" 
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input 
                                    id="confirmPassword" 
                                    type="password" 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" variant="outline" disabled={isPasswordLoading} className="w-full sm:w-auto">
                                {isPasswordLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
                                Update Password
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}
