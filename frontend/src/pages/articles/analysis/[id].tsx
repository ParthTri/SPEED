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

        const getArticle = async () => {
            if (id) {  // Check if id is defined
                const fetchedArticle = await fetchArticle();
                if (fetchedArticle) {
                    setArticle(fetchedArticle); // Set the fetched article
                }
            }
        };
        getArticle();
    }, [id]); // Add fetchArticle to the dependencies

    // Function to handle claim input changes
    const handleClaimChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setClaim(event.target.value);
    };

    // Function to handle evidence input changes
    const handleEvidenceChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setEvidence(event.target.value);
    };

    // Function to handle approve articles with claim and evidence update
    const updateArticle = async (id: string, claim: string, evidence: string) => {
    try {
        // Create the request body
        const requestBody = { claim, evidence };

        const response = await fetch(`http://localhost:3000/api/articles/${id}/update-claim-evidence`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json', // Specify the content type
        },
        body: JSON.stringify(requestBody), // Convert the body to JSON
        });

        //if response is ok, set article state to submitted
        if (response.ok) {
        console.log('Article approved and updated successfully');
        try {
            const response = await fetch(`http://localhost:3000/api/articles/${id}/submitted`, {
              method: 'PATCH',
            });
            if (response.ok) {
              router.push('/articles/analysis')
            } else {
              console.error('Failed to approve article');
            }
          } catch (error) {
            console.error('Error accepting article:', error);
          }
        } else {
        console.error('Failed to approve article');
        }
    } catch (error) {
        console.error('Error approving article:', error);
    }
    };

    //handle form submission
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent the default form submission
    
        // Check if id is a string before passing it to updateArticle
        if (typeof id === 'string') {
            updateArticle(id, claim, evidence); //update article fields
        } else {
            console.error("ID is not a valid string");
        }
    
        console.log("Submitted query:", claim, evidence);
    };

    //display current article details
    const displayArticle = (article: ArticleInterface) => (
        <div key={(article as any)._id}>
            <h2>Submission details</h2>
            <p>
                <strong>Title: </strong>{article.title}<br />
                <strong>Authors: </strong> {article.authors}<br />
                <strong>Source: </strong> {article.source}<br />
                <strong>Publication Year: </strong> {article.pubyear}<br />
                <strong>DOI: </strong> {article.doi}<br />
            </p>
        </div>
    );

    //input form for article analysis
    const analysisForm = () => (
        <div>
            <h2>Analysis Form</h2>
            <form onSubmit={handleSubmit}>
                Claim:<br></br>
                <textarea
                style={{ width: '300px', height: '40px',  resize: 'none' }}
                onChange={handleClaimChange}
                required/><br></br>
                <br></br>Evidence:<br></br>   
                <textarea
                style={{ width: '300px', height: '40px',  resize: 'none' }}
                onChange={handleEvidenceChange}
                required/><br></br>
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
