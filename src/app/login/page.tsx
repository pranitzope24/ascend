import { signIn } from "@/auth"
import { ModeToggle } from "@/components/ModeToggle"
import { Button } from "@/components/ui/button"
import { CircleFadingArrowUp } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Subtle background glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      
      <div className="absolute top-4 right-4 md:top-6 md:right-6">
        <ModeToggle />
      </div>
      
      <div className="w-full max-w-[340px] flex flex-col gap-10 text-center relative z-10">
        <div className="flex flex-col items-center">
          
          
          <h1 className="text-4xl font-bold tracking-wide mb-3 flex items-center justify-center gap-3">
            <CircleFadingArrowUp className="size-9" fill="#0071e3"/>
            Ascend
          </h1>
          <p className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 mb-5">
            Small Habits. Greater Heights.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed px-4">
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
            <img src="/google.svg" alt="Google" className="size-5" />
            Sign in with Google
          </Button>
        </form>
      </div>
    </div>
  )
}
