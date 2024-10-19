import { useEffect, useState } from "react";
import SortableTable from "../components/table/SortableTable";
import data from "../utils/dummydata"; // Dummy data for fallback
import { ArticleInterface } from "@/utils/article.interface";

// API call function
const fetchArticles = async () => {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/articles/submitted`
		); // Full API URL for backend
		if (!response.ok) {
			throw new Error("Failed to fetch");
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching articles:", error);
		return null; // Return null if there's an error, this tells us it is using the dummy data
	}
};

export default function Home() {
	const [articles, setArticles] = useState<ArticleInterface[]>([]);
	const [sortConfig, setSortConfig] = useState<{
		key: keyof ArticleInterface;
		direction: string;
	} | null>(null);

	useEffect(() => {
		const getArticles = async () => {
			const fetchedArticles = await fetchArticles();
			if (fetchedArticles) {
				setArticles(fetchedArticles);
			} else {
				// Fallback to dummy data if the API call fails
				console.log("Falling back to dummy data");
				setArticles(data);
			}
		};
		getArticles();
	}, []);

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

		if (a[key] < b[key]) {
			return direction === "ascending" ? -1 : 1;
		}
		if (a[key] > b[key]) {
			return direction === "ascending" ? 1 : -1;
		}
		return 0;
	});

	const handleSort = (column: keyof ArticleInterface) => {
		console.log("Sorting by:", column); // Check if the sort function is triggered
		let direction = "ascending";
		if (sortConfig?.key === column && sortConfig.direction === "ascending") {
			direction = "descending";
		}
		setSortConfig({ key: column, direction });
		console.log("New sort config:", { key: column, direction });
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
			<h1>Software Practice Empirical Evidence Database (SPEED)</h1>
			<SortableTable
				headers={headers}
				data={sortedArticles}
				onSort={handleSort}
				sortConfig={sortConfig}
			/>
		</div>
	);
}
