"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Upload, RefreshCcw, Search, Loader2, ImageIcon, Sparkles } from "lucide-react"
import { recognizePokemonAction } from "@/app/actions/recognition"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"

export function WhosThatPokemonView() {
    const [image, setImage] = useState<string | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [result, setResult] = useState<{ id: number, name: string, isSimulation?: boolean } | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isCameraActive, setIsCameraActive] = useState(false)

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImage(reader.result as string)
                setResult(null)
            }
            reader.readAsDataURL(file)
        }
    }

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                setIsCameraActive(true)
                setResult(null)
                setImage(null)
            }
        } catch (err) {
            console.error("Error accessing camera:", err)
            toast.error("Could not access camera. Please check permissions.")
        }
    }

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
            tracks.forEach(track => track.stop())
            setIsCameraActive(false)
        }
    }

    const capturePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas')
            canvas.width = videoRef.current.videoWidth
            canvas.height = videoRef.current.videoHeight
            const ctx = canvas.getContext('2d')
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0)
                const dataUrl = canvas.toDataURL('image/jpeg')
                setImage(dataUrl)
                stopCamera()
            }
        }
    }

    const analyzeImage = async () => {
        if (!image) return

        setIsAnalyzing(true)
        try {
            const res = await recognizePokemonAction(image)
            if (res.success && res.pokemonId && res.pokemonName) {
                setResult({
                    id: res.pokemonId,
                    name: res.pokemonName,
                    isSimulation: res.isSimulation
                })
                toast.success(`It\'s ${res.pokemonName}!`)
            } else {
                toast.error(res.error || "Could not recognize Pokemon")
            }
        } catch (err) {
            console.error("Error during analysis:", err)
            toast.error("An error occurred during analysis")
        } finally {
            setIsAnalyzing(false)
        }
    }

    const reset = () => {
        setImage(null)
        setResult(null)
        stopCamera()
    }

    return (
        <div className="space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                    Who&apos;s That Pokémon?
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Upload an image or use your camera to identify any Pokémon using AI!
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                <Card className="border-2 overflow-hidden">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="w-5 h-5" />
                            Image Input
                        </CardTitle>
                        <CardDescription>
                            Upload a screenshot or take a photo of a Pokémon.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative aspect-video bg-secondary/50 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-muted-foreground/25">
                            {isCameraActive ? (
                                <div className="relative w-full h-full">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                        <Button onClick={capturePhoto} size="lg" className="rounded-full w-14 h-14 p-0">
                                            <Camera className="w-6 h-6" />
                                        </Button>
                                        <Button variant="destructive" onClick={stopCamera} size="lg" className="rounded-full w-14 h-14 p-0">
                                            <RefreshCcw className="w-6 h-6 rotate-180" />
                                        </Button>
                                    </div>
                                </div>
                            ) : image ? (
                                <div className="relative w-full h-full">
                                    <Image
                                        src={image}
                                        alt="Selected Pokémon"
                                        fill
                                        className="object-contain"
                                    />
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="absolute top-2 right-2 rounded-full"
                                        onClick={reset}
                                    >
                                        <RefreshCcw className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center space-y-4 p-8">
                                    <div className="bg-background/50 p-4 rounded-full inline-block">
                                        <Camera className="w-12 h-12 text-muted-foreground" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Button onClick={startCamera} className="gap-2">
                                            <Camera className="w-4 h-4" />
                                            Use Camera
                                        </Button>
                                        <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2">
                                            <Upload className="w-4 h-4" />
                                            Upload Image
                                        </Button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {image && !isAnalyzing && !result && (
                            <Button className="w-full h-12 text-lg gap-2" onClick={analyzeImage}>
                                <Sparkles className="w-5 h-5" />
                                Identify Pokémon
                            </Button>
                        )}

                        {isAnalyzing && (
                            <Button disabled className="w-full h-12 text-lg gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Analyzing...
                            </Button>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    {result ? (
                        <Card className="border-2 border-primary animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <CardHeader className="text-center pb-2">
                                <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-2">
                                    <Sparkles className="w-8 h-8 text-primary" />
                                </div>
                                <CardTitle className="text-3xl capitalize">It&apos;s {result.name}!</CardTitle>
                                <CardDescription>
                                    {result.isSimulation ? "(AI Simulation Result)" : "Match found in database!"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="relative aspect-square bg-secondary/30 rounded-xl overflow-hidden max-w-[250px] mx-auto">
                                    <Image
                                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${result.id}.png`}
                                        alt={result.name}
                                        fill
                                        className="object-contain p-4"
                                        unoptimized
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Button asChild size="lg" className="w-full text-lg">
                                        <Link href={`/pokemon/${result.id}`}>
                                            View Pokedex Entry
                                        </Link>
                                    </Button>
                                    <Button variant="outline" onClick={reset} className="w-full">
                                        Identify Another
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-2 border-dashed bg-muted/50">
                            <CardContent className="p-12 text-center space-y-4">
                                <div className="bg-background p-4 rounded-full inline-block shadow-sm">
                                    <Search className="w-12 h-12 text-muted-foreground/50" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-bold text-xl">Recognition Result</h3>
                                    <p className="text-muted-foreground">
                                        Upload or take a photo to see the AI magic happen!
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">How it works</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-4">
                            <div className="flex gap-3">
                                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold">1</div>
                                <p>Provide a clear image of a single Pokémon.</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold">2</div>
                                <p>Our AI analyzes the visual features (colors, shapes, patterns).</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold">3</div>
                                <p>We match the features against our database of over 1000 Pokémon.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
