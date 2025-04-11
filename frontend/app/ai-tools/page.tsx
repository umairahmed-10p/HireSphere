import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResumeParser } from "@/components/ai/resume-parser"
import { InterviewQuestionGenerator } from "@/components/ai/interview-question-generator"
import { FitScoreAnalyzer } from "@/components/ai/fit-score-analyzer"

export default function AITools() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI Tools</h2>
        <p className="text-muted-foreground">Leverage AI to streamline your hiring process and make better decisions</p>
      </div>

      <Tabs defaultValue="resume-parser" className="space-y-4">
        <TabsList>
          <TabsTrigger value="resume-parser">Resume Parser</TabsTrigger>
          <TabsTrigger value="question-generator">Interview Questions</TabsTrigger>
          <TabsTrigger value="fit-analyzer">Fit Score Analyzer</TabsTrigger>
        </TabsList>
        <TabsContent value="resume-parser">
          <ResumeParser />
        </TabsContent>
        <TabsContent value="question-generator">
          <InterviewQuestionGenerator />
        </TabsContent>
        <TabsContent value="fit-analyzer">
          <FitScoreAnalyzer />
        </TabsContent>
      </Tabs>
    </div>
  )
}
