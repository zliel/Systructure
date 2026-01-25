import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"

export function SpinnerBadge({ text }: { text: string }) {
  return (
    <Badge variant="secondary">
      <Spinner data-icon="inline-start" />
      {text}
    </Badge>
  )
}

