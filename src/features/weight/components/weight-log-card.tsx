import { useState } from "react"
import { format, isToday, isYesterday, parseISO } from "date-fns"
import { Trash2, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWeightStore, type BodyWeightLog } from "@/store/weight-store"

interface WeightLogCardProps {
  log: BodyWeightLog
  onEdit: (log: BodyWeightLog) => void
}

export function WeightLogCard({ log, onEdit }: WeightLogCardProps) {
  const { deleteLog } = useWeightStore()
  const [isDeleting, setIsDeleting] = useState(false)

  const date = parseISO(log.recordedAt)
  let dateString = format(date, "dd MMM yyyy")
  if (isToday(date)) dateString = "Today"
  else if (isYesterday(date)) dateString = "Yesterday"

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this weight record?")) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteLog(log.id)
    } catch (error) {
      console.error(error)
      setIsDeleting(false)
    }
  }

  return (
    <div className="bg-card flex flex-col gap-2 rounded-xl border p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xl font-bold tracking-tight">{Number(log.weight).toFixed(2)} kg</div>
          <div className="text-muted-foreground text-sm">{dateString}</div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(log)}
            className="text-muted-foreground h-8 w-8"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {log.note && (
        <div className="text-foreground/80 pt-2 text-sm whitespace-pre-wrap">{log.note}</div>
      )}
    </div>
  )
}
