import { GetStaticProps, NextPage } from "next";
import { useState } from "react";
import SortableTable from "../../components/table/SortableTable";
import ArticleDetail from "../../components/ArticleDetail";
import { ArticleInterface } from "@/utils/article.interface";

type ArticlesProps = {
	articles: ArticleInterface[];
};

const Articles: NextPage<ArticlesProps> = ({ articles }) => {
	const [sortConfig, setSortConfig] = useState<{
		key: keyof ArticleInterface;
		direction: string;
	} | null>(null);

	const [selectedArticle, setSelectedArticle] =
		useState<ArticleInterface | null>(null);

	// Sorting logic
	const sortedArticles = [...articles].sort((a, b) => {
		if (!sortConfig) return 0;
		const { key, direction } = sortConfig;

		if (
			a === undefined ||
			b === undefined ||
			a?.[key] === undefined ||
			b?.[key] === undefined
		) {
			return 0;
		}

		if (a?.[key] < b?.[key]) {
			return direction === "ascending" ? -1 : 1;
		}
		if (a?.[key] > b?.[key]) {
			return direction === "ascending" ? 1 : -1;
		}
		return 0;
	});

	// Handle sorting
	const handleSort = (column: keyof ArticleInterface) => {
		let direction = "ascending";
		if (sortConfig?.key === column && sortConfig.direction === "ascending") {
			direction = "descending";
		}
		setSortConfig({ key: column, direction });
	};

	// Handle article selection for detail view
	const handleArticleClick = (article: ArticleInterface) => {
		setSelectedArticle(article);
	};

	// Close article detail view
	const handleCloseDetail = () => {
		setSelectedArticle(null);
	};

	// Table headers
	const headers: { key: keyof ArticleInterface; label: string }[] = [
		{ key: "title", label: "Title" },
		// Add other headers if needed
	];

	return (
		<div className="container mx-auto px-4">
			<h1 className="text-2xl font-bold my-4">Articles Index Page</h1>
			<p className="mb-4">
				Click on an article title to view details or sort the columns:
			</p>

			{/* If an article is selected, display the detail view */}
			{selectedArticle ? (
				<ArticleDetail article={selectedArticle} onClose={handleCloseDetail} />
			) : (
				// Otherwise, show the sortable table
				<SortableTable
					headers={headers}
					data={sortedArticles}
					onSort={handleSort}
					sortConfig={sortConfig}
					onRowClick={handleArticleClick} // Enable clicking to view article details
				/>
			)}
		</div>
	);
};

// Fetch articles as static props
export const getStaticProps: GetStaticProps<ArticlesProps> = async () => {
	try {
		// Fetch data from your backend API
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/articles`
		);

		// Check if the response was successful
		if (!response.ok) {
			throw new Error("Failed to fetch articles");
		}

		const articles: ArticleInterface[] = await response.json();

		return {
			props: {
				articles,
			},
		};
	} catch (error) {
		console.error(error);

		// Return empty array if an error occurs
		return {
			props: {
				articles: [],
			},
		};
	}
};

export default Articles;
