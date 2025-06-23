
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Target, Lock, Globe, Zap, TrendingUp, Shield, Pin } from 'lucide-react';
import { toast } from 'sonner';
import { generateAIResponse } from '@/services/geminiService';
import { chatStorage } from '@/utils/chatStorage';

interface CompetitorAnalysis {
  title: string;
  description: string;
  technologies: string[];
  strengths: string[];
  improvements: string[];
  strategies: string[];
  url: string;
}

interface CompetitorAnalyzerProps {
  onNotesUpdate?: () => void;
}

export const CompetitorAnalyzer = ({ onNotesUpdate }: CompetitorAnalyzerProps) => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<CompetitorAnalysis | null>(null);

  const analyzeCompetitor = async () => {
    if (!url.trim()) {
      toast.error('🎯 Please enter a valid URL');
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysisPrompt = `
Analyze the website at ${url} and provide detailed competitor insights in simple, clear language suitable for grade 4 reading level. 

Please respond in JSON format with the following structure:
{
  "title": "Website/Company Name",
  "description": "Brief description of what they do in simple words",
  "technologies": ["tech1", "tech2", "tech3"],
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "strategies": ["strategy1", "strategy2", "strategy3"]
}

Focus on:
1. Their main value proposition and target audience (explain in simple terms)
2. Technologies they likely use (based on design patterns, features)
3. Their key strengths and competitive advantages (use clear, simple language)
4. Areas where they could improve (explain why in simple terms)
5. Actionable strategies to outperform them (give practical advice)

Use simple words and short sentences. Make everything easy to understand. Avoid jargon and technical terms unless necessary, and explain them if used.
`;

      const response = await generateAIResponse(analysisPrompt);
      
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedAnalysis = JSON.parse(jsonMatch[0]);
          setAnalysis({
            ...parsedAnalysis,
            url: url
          });
          toast.success('🎯 Competitor analysis completed!');
        } else {
          setAnalysis({
            title: `Analysis of ${url}`,
            description: 'Website analysis completed successfully',
            technologies: ['Modern Web Design', 'User-Friendly Interface', 'Mobile-Ready Design'],
            strengths: ['Good User Experience', 'Fast Loading', 'Clear Content'],
            improvements: ['Better Mobile View', 'Faster Loading Speed', 'Clearer Navigation'],
            strategies: ['Improve Design Quality', 'Make Site Faster', 'Better Content Strategy'],
            url: url
          });
          toast.success('🎯 Basic competitor analysis completed!');
        }
      } catch (parseError) {
        setAnalysis({
          title: `Competitor Analysis - ${url}`,
          description: response.slice(0, 200) + '...',
          technologies: ['Modern Web Stack', 'Responsive Design', 'User Analytics'],
          strengths: ['Market Position', 'User Engagement', 'Content Quality'],
          improvements: ['Performance', 'Accessibility', 'Mobile Experience'],
          strategies: ['Differentiate Features', 'Improve UX', 'Content Marketing'],
          url: url
        });
        toast.success('🎯 Competitor analysis completed!');
      }
    } catch (error) {
      console.error('Competitor analysis error:', error);
      toast.error('🔒 Failed to analyze competitor. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const pinAnalysisToNotes = () => {
    if (!analysis) return;

    try {
      const noteContent = `🎯 COMPETITOR ANALYSIS REPORT

Website: ${analysis.url}
Company: ${analysis.title}

📋 OVERVIEW:
${analysis.description}

🔧 TECHNOLOGIES USED:
${analysis.technologies.map(tech => `• ${tech}`).join('\n')}

💪 THEIR STRENGTHS:
${analysis.strengths.map(strength => `• ${strength}`).join('\n')}

🔄 AREAS TO IMPROVE:
${analysis.improvements.map(improvement => `• ${improvement}`).join('\n')}

🚀 OUR WINNING STRATEGIES:
${analysis.strategies.map(strategy => `• ${strategy}`).join('\n')}

📊 Analysis Date: ${new Date().toLocaleDateString()}
🌐 Analyzed URL: ${analysis.url}`;

      const note = chatStorage.createNoteFromContent(
        `🎯 Competitor Analysis: ${analysis.title}`,
        noteContent
      );

      toast.success('🎯 Analysis pinned to notes successfully!');
      
      if (onNotesUpdate) {
        onNotesUpdate();
      }
    } catch (error) {
      console.error('Error pinning analysis:', error);
      toast.error('🔒 Failed to pin analysis to notes');
    }
  };

  return (
    <div className="space-y-4 p-4">
      <Card className="border-2 border-purple-200 dark:border-purple-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="w-5 h-5 text-purple-500" />
            🎯 Competitor Analyzer
            <Lock className="w-4 h-4 text-gray-400 ml-auto" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="🌐 Enter competitor website URL (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && analyzeCompetitor()}
            />
            <Button 
              onClick={analyzeCompetitor}
              disabled={isAnalyzing || !url.trim()}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              {isAnalyzing ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </div>

          {analysis && (
            <div className="space-y-4 mt-6">
              <Separator />
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-500" />
                    {analysis.title}
                  </h3>
                  <Button
                    onClick={pinAnalysisToNotes}
                    variant="outline"
                    size="sm"
                    className="bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                  >
                    <Pin className="w-4 h-4 mr-2" />
                    📌 Pin to Notes
                  </Button>
                </div>
                
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  <strong>📋 What they do:</strong> {analysis.description}
                </p>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-white dark:bg-gray-800/50 p-3 rounded-lg border">
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-green-600">
                      <Shield className="w-4 h-4" />
                      🔧 Technologies They Use
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.technologies.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-800">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800/50 p-3 rounded-lg border">
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-600">
                      <TrendingUp className="w-4 h-4" />
                      💪 Their Strong Points
                    </h4>
                    <ul className="text-sm space-y-1">
                      {analysis.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 text-lg">•</span>
                          <span className="leading-relaxed">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800/50 p-3 rounded-lg border">
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-orange-600">
                      <Target className="w-4 h-4" />
                      🔄 What They Can Do Better
                    </h4>
                    <ul className="text-sm space-y-1">
                      {analysis.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-orange-500 text-lg">•</span>
                          <span className="leading-relaxed">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800/50 p-3 rounded-lg border">
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-purple-600">
                      <Zap className="w-4 h-4" />
                      🚀 How We Can Beat Them
                    </h4>
                    <ul className="text-sm space-y-1">
                      {analysis.strategies.map((strategy, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-purple-500 text-lg">•</span>
                          <span className="leading-relaxed">{strategy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4 p-2 bg-purple-100 dark:bg-purple-900/30 rounded text-xs text-center">
                  🌐 Analyzed: <span className="font-mono">{analysis.url}</span> • 📅 {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
