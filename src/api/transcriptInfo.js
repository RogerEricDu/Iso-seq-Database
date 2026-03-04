import transcriptData from '@/data/transcriptome/transcript_info.json'

export function getTranscriptInfo() {
  return new Promise((resolve) => {
    resolve({
      code: 20000,
      data: {
        total: transcriptData.length,
        items: transcriptData
      }
    })
  })
}