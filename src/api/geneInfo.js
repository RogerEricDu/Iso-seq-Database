import geneData from '@/data/transcriptome/gene_info.json'

export function getGeneInfo() {
  return new Promise((resolve) => {
    resolve({
      code: 20000,
      data: {
        total: geneData.length,
        items: geneData
      }
    })
  })
}
