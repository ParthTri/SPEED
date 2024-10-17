import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { ArticleInterface } from "@/utils/article.interface";

const AnalysisForm = () => {
    const [article, setArticle] = useState<ArticleInterface>();
    const router = useRouter();
    const { id } = router.query; // Get the dynamic ID from the URL
    const [claim, setClaim] = useState('');
    const [evidence, setEvidence] = useState('');

    useEffect(() => {
        const fetchArticle = async () => {
            if (id && typeof id === 'string') {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}`);
                    if (!response.ok) {
                        throw new Error("Failed to fetch article");
                    }
                    const data = await response.json();

                    // Redirect to home page if article does not have the correct state
                    if (data.state !== 'approved') {
                        router.push('/'); // Use router.push instead of window.location.href
                    } else {
                        setArticle(data); // Set the fetched article
                    }
                } catch (error) {
                    console.error("Error fetching article:", error);
                }
            }
        };

        fetchArticle();
    }, [id, router]); // Add router to dependencies

    const handleClaimChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setClaim(event.target.value);
    };

    const handleEvidenceChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setEvidence(event.target.value);
    };

    const updateArticle = async (id: string, claim: string, evidence: string) => {
        try {
            const requestBody = { claim, evidence };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}/update-claim-evidence`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                console.log('Article updated successfully');
                // Proceed to submit the article
                const submitResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}/submitted`, {
                    method: 'PATCH',
                });
                if (submitResponse.ok) {
                    router.push('/articles/analysis'); // Use router.push instead of window.location.href
                } else {
                    console.error('Failed to approve article');
                }
            } else {
                console.error('Failed to update article');
            }
        } catch (error) {
            console.error('Error updating article:', error);
        }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (typeof id === 'string') {
            updateArticle(id, claim, evidence);
        } else {
            console.error("ID is not a valid string");
        }

        console.log("Submitted query:", claim, evidence);
    };

    const displayArticle = (article: ArticleInterface) => (
        <div key={(article as any)._id}>
            <h2>Submission Details</h2>
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
            <form onSubmit={handleSubmit}>
                Claim:<br />
                <textarea
                    style={{ width: '300px', height: '40px', resize: 'none' }}
                    onChange={handleClaimChange}
                    required
                /><br />
                <br />
                Evidence:<br />
                <textarea
                    style={{ width: '300px', height: '40px', resize: 'none' }}
                    onChange={handleEvidenceChange}
                    required
                /><br />
                <br />
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
