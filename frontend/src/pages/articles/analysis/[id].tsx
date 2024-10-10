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

    //fetch article from api
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
            <h2>Submission details</h2>
            <p>
                <strong>Title: </strong>{article.title}<br />
                <strong>Authors: </strong> {article.authors}<br />
                <strong>Source: </strong> {article.source}<br />
                <strong>Publication Year: </strong> {article.pubyear}<br />
                <strong>DOI: </strong> {article.doi}<br />
                <strong>Claim: </strong> {article.claim}<br />
                <strong>Evidence: </strong> {article.evidence}
            </p>
        </div>
    );

    const analysisForm = () => (
        <div>
            <h2>Analysis Form</h2>
            <form>
                Claim:<br></br>
                <textarea
                style={{ width: '300px', height: '40px',  resize: 'none' }}/><br></br>
                <br></br>Evidence:<br></br>   
                <textarea
                style={{ width: '300px', height: '40px',  resize: 'none' }}/><br></br>
                <br></br>
                <button type="submit">Submit Article</button>
            </form>
        </div>
    );
    
    return (
        <div className="container">
            <h1>Article Analysis</h1>
            {article ? displayArticle(article) : <p>Loading...</p>}
            {analysisForm()}
        </div>
    );
    
};

export default AnalysisForm;
