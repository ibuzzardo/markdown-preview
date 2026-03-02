import { MarkdownEditor } from '@/components/MarkdownEditor'

export default function HomePage(): JSX.Element {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <MarkdownEditor />
    </div>
  )
}