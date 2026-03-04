import pandas as pd

# gene expression
gene_file = "src/data/expression/pbmc_hani.pantranscriptome.tpm.gene_id.unfiltered.TPM.tsv"
gene_df = pd.read_csv(gene_file, sep="\t", index_col=0)

gene_long = gene_df.reset_index().melt( # 把 geneID 从“行名”变成“列”；保留 index 这列（geneId），其他压扁，把宽表变成长表
    id_vars="index",
    var_name="sampleId",
    value_name="expression"
)

gene_long = gene_long.rename(columns={"index": "geneId"}) # 最终得到列名：geneId | sampleId | expression

gene_long.to_csv("src/data/expression/gene_expression_long.csv", index=False)

# transcript expression
tx_file = "src/data/expression/pbmc_hani.pantranscriptome.tpm.transcript_id.unfiltered.TPM.tsv"
tx_df = pd.read_csv(tx_file, sep="\t", index_col=0)

tx_long = tx_df.reset_index().melt(
    id_vars="index",
    var_name="sampleId",
    value_name="expression"
)

tx_long = tx_long.rename(columns={"index": "transcriptId"})

tx_long.to_csv("src/data/expression/transcript_expression_long.csv", index=False)

print("Done.")
