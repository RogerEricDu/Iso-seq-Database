import pandas as pd
from pathlib import Path

base = Path(__file__).resolve().parent.parent # base = src 目录 (当前文件绝对路径的上两级)

gene_file = base / "data/transcriptome/gene_infos.tsv" # 等价于 src/data/transcriptome/xxx
tx_file = base / "data/transcriptome/transcript_infos.tsv"

out_dir = base / "data/transcriptome"
# out_dir.mkdir(exist_ok=True)

# Gene info
gene_df = pd.read_csv(gene_file, sep="\t")

gene_df = gene_df.rename(columns={ # TSV：snake_case；前端：camelCase
    "gene_id": "geneId",
    "gene_name": "geneName",
    "Chromosome": "chromosome",
    "Start": "start",
    "End": "end",
    "Strand": "strand",
    "gene_type": "geneType"
})

gene_df["exonNumber"] = 0 # 创建一列 exonNumber，每行默认值为 0（前端需要，但是gene_infos.tsv文件里没有，要从gtf弄过来）
gene_df["associatedTranscript"] = "" # 同上，要从transcript_infos.tsv里弄过来

gene_df.to_json(out_dir / "gene_info.json", orient="records", indent=2)

# Transcript info
tx_df = pd.read_csv(tx_file, sep="\t")

tx_df = tx_df.rename(columns={
    "transcript_id": "transcriptId",
    "gene_id": "geneId",
    "gene_name": "geneName",
    "Chromosome": "chromosome",
    "Start": "start",
    "End": "end",
    "Strand": "strand",
    "gene_type": "geneType"
})

tx_df.to_json(out_dir / "transcript_info.json", orient="records", indent=2)

print("✅ .json generated")
