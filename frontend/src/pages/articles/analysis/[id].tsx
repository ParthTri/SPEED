import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ArticleInterface } from "@/utils/article.interface";

const AnalysisForm = () => {
    const [article, setArticle] = useState<ArticleInterface>();
    const router = useRouter();
    const { id } = router.query; // Get the dynamic ID from the URL

    useEffect(() => {
        const getArticle = async () => {
            if (id) {  // Check if id is defined
                const fetchedArticle = await fetchArticle();
                if (fetchedArticle) {
                    setArticle(fetchedArticle); // Set the fetched article
                }
            }
        };
        getArticle();
    }, [id]);

    const fetchArticle = async () => {
        if (id) {
            try {
                const response = await fetch(`http://localhost:3000/api/articles/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch");
                }
                const data = await response.json();

                //redirect to home page if article does not have the correct state
                if (data.state != 'approved') {
                    window.location.href = '/';
                }
                else {
                    return data; // Return single article
                }
                
                
            } catch (error) {
                console.error("Error fetching article:", error);
                return null; // Return null if there's an error
            }
        }
        return null;
    };

    const displayArticle = (article: ArticleInterface) => (
        <div key={(article as any)._id}>
            <h2>{article.title}</h2>
            <button>Submit Article</button>
        </div>
    );

    return (
        <div className="container">
            <h1>Analysis Form</h1>
            <ul>{article ? displayArticle(article) : <li>Loading...</li>}</ul>
        </div>
    );
};

export default AnalysisForm;
