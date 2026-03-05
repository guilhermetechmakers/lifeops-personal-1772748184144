/**
 * AIIdeaOutlineGenerator - Quick prompts for ideas, outlines, sections, headlines
 */

import { useState } from 'react'
import { Sparkles, Loader2, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useContentEditor } from '@/context/content-editor-context'
import { useAiIdeaOutline } from '@/hooks/use-ai-idea-outline'
import type { AIOutlineContext } from '@/types/content'

export function AIIdeaOutlineGenerator() {
  const { setOutline, setAiIdeas, setIsGenerating } = useContentEditor()
  const { ideas, outline, isLoading, generate, cancel } = useAiIdeaOutline()

  const [topic, setTopic] = useState('')
  const [persona, setPersona] = useState('')
  const [audience, setAudience] = useState('')
  const [tone, setTone] = useState('')

  const handleGenerate = () => {
    const context: AIOutlineContext = {
      topic: topic.trim() || 'your topic',
      persona: persona.trim() || undefined,
      audience: audience.trim() || undefined,
      tone: tone.trim() || undefined,
    }
    setIsGenerating(true)
    generate(context).finally(() => setIsGenerating(false))
  }

  const handleApplyOutline = () => {
    setOutline(outline)
    setAiIdeas(ideas)
  }

  const safeIdeas = Array.isArray(ideas) ? ideas : []
  const safeOutline = Array.isArray(outline) ? outline : []

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Sparkles className="h-5 w-5 text-primary" aria-hidden />
        <CardTitle className="text-base">AI Idea & Outline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="ai-topic">Topic</Label>
          <Input
            id="ai-topic"
            placeholder="e.g. Productivity tips for remote workers"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ai-persona">Target persona</Label>
          <Input
            id="ai-persona"
            placeholder="e.g. Busy professionals"
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ai-audience">Audience</Label>
          <Input
            id="ai-audience"
            placeholder="e.g. B2B, tech-savvy"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ai-tone">Tone</Label>
          <Input
            id="ai-tone"
            placeholder="e.g. Professional, friendly"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1 gradient-primary text-primary-foreground"
            onClick={handleGenerate}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate
              </>
            )}
          </Button>
          {isLoading && (
            <Button variant="outline" size="icon" onClick={cancel} aria-label="Cancel">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {safeIdeas.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Ideas</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {safeIdeas.slice(0, 4).map((idea, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  {idea}
                </li>
              ))}
            </ul>
          </div>
        )}

        {safeOutline.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Outline</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {safeOutline.slice(0, 5).map((block) => (
                <li key={block.id}>{block.title}</li>
              ))}
            </ul>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleApplyOutline}
            >
              Apply outline to editor
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
