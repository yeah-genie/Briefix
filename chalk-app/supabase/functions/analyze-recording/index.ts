import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { recordingId } = await req.json()

        if (!recordingId) {
            throw new Error('recordingId is required')
        }

        // Initialize Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        const supabase = createClient(supabaseUrl, supabaseKey)

        // Get recording info
        const { data: recording, error: fetchError } = await supabase
            .from('lesson_logs')
            .select('*')
            .eq('id', recordingId)
            .single()

        if (fetchError || !recording) {
            throw new Error('Recording not found')
        }

        // Get Gemini API key
        const geminiApiKey = Deno.env.get('GEMINI_API_KEY')

        if (!geminiApiKey || !recording.recording_url) {
            // If no API key or no recording URL, create mock analysis
            const mockAnalysis = {
                transcription: '[분석 대기 중] Gemini API 키가 설정되지 않았습니다.',
                pds_tags: {
                    problem: ['분석 대기'],
                    diagnosis: ['분석 대기'],
                    solution: ['분석 대기'],
                },
                summary: '녹음이 완료되었습니다. 실제 분석을 위해 GEMINI_API_KEY를 설정해주세요.',
                rating_suggestion: 'okay',
            }

            await supabase
                .from('lesson_logs')
                .update({
                    ai_insights: mockAnalysis,
                    recording_status: 'analyzed',
                })
                .eq('id', recordingId)

            return new Response(
                JSON.stringify({ success: true, mock: true }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Call Gemini API for transcription and analysis
        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            {
                                text: `다음 수업 녹음을 분석해주세요 (URL: ${recording.recording_url}).

분석 항목:
1. 전사 (transcription): 녹음 내용을 텍스트로
2. PDS 태그: 
   - Problem (문제점): 학생이 어려워한 부분
   - Diagnosis (진단): 왜 어려워했는지
   - Solution (해결책): 어떻게 해결했는지
3. 요약 (summary): 수업 핵심 내용 2-3문장
4. 평가 제안 (rating): good/okay/struggled 중 하나

JSON 형식으로 응답해주세요:
{
  "transcription": "...",
  "pds_tags": {
    "problem": ["태그1", "태그2"],
    "diagnosis": ["태그1"],
    "solution": ["태그1", "태그2"]
  },
  "summary": "...",
  "rating_suggestion": "okay"
}`
                            }
                        ]
                    }],
                    generationConfig: {
                        temperature: 0.3,
                        maxOutputTokens: 2048,
                    }
                })
            }
        )

        if (!geminiResponse.ok) {
            throw new Error('Gemini API error')
        }

        const geminiResult = await geminiResponse.json()
        const analysisText = geminiResult.candidates?.[0]?.content?.parts?.[0]?.text || ''

        // Parse JSON from response
        let analysis
        try {
            const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
            analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : {
                transcription: analysisText,
                pds_tags: { problem: [], diagnosis: [], solution: [] },
                summary: '분석 완료',
                rating_suggestion: 'okay',
            }
        } catch {
            analysis = {
                transcription: analysisText,
                pds_tags: { problem: [], diagnosis: [], solution: [] },
                summary: '분석 완료',
                rating_suggestion: 'okay',
            }
        }

        // Update lesson log with analysis
        await supabase
            .from('lesson_logs')
            .update({
                ai_insights: analysis,
                recording_status: 'analyzed',
                topic: analysis.summary?.substring(0, 100) || recording.topic,
                rating: analysis.rating_suggestion || 'okay',
            })
            .eq('id', recordingId)

        return new Response(
            JSON.stringify({ success: true, analysis }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error('Error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
