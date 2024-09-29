import { GetStaticProps, NextPage } from "next";
import { useState } from "react";
import SortableTable from "../../components/table/SortableTable";
import data from "../../utils/dummydata";
import { ArticleInterface } from "@/utils/article.interface";

type ArticlesProps = {
	articles: ArticleInterface[];
};

const Articles: NextPage<ArticlesProps> = ({ articles }) => {
	const [sortConfig, setSortConfig] = useState<{
		key: keyof ArticleInterface;
		direction: string;
	} | null>(null);

	// Sorting logic
	const sortedArticles = [...articles].sort((a, b) => {
		if (!sortConfig) return 0;
		const { key, direction } = sortConfig;
		if (a[key] < b[key]) {
			return direction === "ascending" ? -1 : 1;
		}
		if (a[key] > b[key]) {
			return direction === "ascending" ? 1 : -1;
		}
		return 0;
	});

	const handleSort = (column: keyof ArticleInterface) => {
		let direction = "ascending";
		if (sortConfig?.key === column && sortConfig.direction === "ascending") {
			direction = "descending";
		}
		setSortConfig({ key: column, direction });
	};

	const headers: { key: keyof ArticleInterface; label: string }[] = [
		{ key: "title", label: "Title" },
		{ key: "authors", label: "Authors" },
		{ key: "source", label: "Source" },
		{ key: "pubyear", label: "Publication Year" },
		{ key: "doi", label: "DOI" },
		{ key: "claim", label: "Claim" },
		{ key: "evidence", label: "Evidence" },
	];

	return (
		<div className="container">
			<h1>Articles Index Page</h1>
			<p>Page containing a table of articles:</p>
			<SortableTable
				headers={headers}
				data={sortedArticles}
				onSort={handleSort}
				sortConfig={sortConfig}
			/>
		</div>
	);
};

export const getStaticProps: GetStaticProps<ArticlesProps> = async () => {
	// Map the data to ensure all articles have consistent property names
	const articles = data.map((article) => ({
		id: article.id ?? article.id,
		title: article.title,
		authors: article.authors,
		source: article.source,
		pubyear: article.pubyear,
		doi: article.doi,
		claim: article.claim,
		evidence: article.evidence,
	}));

	return {
		props: {
			articles,
		},
	};
};

export default Articles;
