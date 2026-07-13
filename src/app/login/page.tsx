import { signIn } from "@/auth"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm flex flex-col gap-8 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">Ascend</h1>
          <p className="text-muted-foreground text-sm">
            Sign in to start tracking your habits and building better routines.
          </p>
        </div>
        <form
          action={async () => {
            "use server"
            await signIn("google", { redirectTo: "/" })
          }}
        >
          <Button type="submit" size="lg" className="w-full h-12 rounded-xl text-base font-medium">
            Sign in with Google
          </Button>
        </form>
      </div>
    </div>
  )
}
