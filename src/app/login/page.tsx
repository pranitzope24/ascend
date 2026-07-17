import { signIn } from "@/auth"
import { ModeToggle } from "@/components/ModeToggle"
import { Button } from "@/components/ui/button"
import { CircleFadingArrowUp } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="bg-background relative flex min-h-screen w-full items-center justify-center overflow-hidden p-6">
      {/* Subtle background glow effect */}
      <div className="bg-primary/10 pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]" />

      <div className="absolute top-4 right-4 md:top-6 md:right-6">
        <ModeToggle />
      </div>

      <div className="relative z-10 flex w-full max-w-[340px] flex-col gap-10 text-center">
        <div className="flex flex-col items-center">
          <h1 className="mb-3 flex items-center justify-center gap-3 text-4xl font-bold tracking-wide">
            <CircleFadingArrowUp className="size-9" fill="#0071e3" />
            Ascend
          </h1>
          <p className="from-primary to-primary/60 mb-5 bg-gradient-to-r bg-clip-text text-sm font-semibold text-transparent">
            Small Habits. Greater Heights.
          </p>
          <p className="text-muted-foreground px-4 text-sm leading-relaxed">
            Sign in to start tracking your habits and building better routines.
          </p>
        </div>

        <form
          action={async () => {
            "use server"
            await signIn("google", { redirectTo: "/" })
          }}
        >
          <Button type="submit" variant="secondary" size="lg" className="w-full">
            <Image src="/google.svg" alt="Google" width={20} height={20} className="size-5" />
            Sign in with Google
          </Button>
        </form>
      </div>
    </div>
  )
}
