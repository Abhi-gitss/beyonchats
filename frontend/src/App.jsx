import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    // Fetch data from your Laravel API
    axios.get('http://127.0.0.1:8000/api/articles')
      .then(res => setArticles(res.data.data || res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5 fw-bold">BeyondChats Blog Assignment</h1>

      {selectedArticle ? (
        <div className="card shadow">
          <div className="card-header bg-white p-3">
            <button onClick={() => setSelectedArticle(null)} className="btn btn-outline-primary">← Back to List</button>
          </div>
          <div className="card-body p-4">
            <h2 className="mb-4">{selectedArticle.title}</h2>
            <div className="row">
              <div className="col-md-6 border-end">
                <h5 className="text-muted">Original</h5>
                <div dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
              </div>
              <div className="col-md-6">
                <h5 className="text-success"> AI  Version</h5>
                {selectedArticle.generated_content ? (
                  <div dangerouslySetInnerHTML={{ __html: selectedArticle.generated_content }} />
                ) : (
                  <div className="alert alert-warning">Not processed by AI yet. Run the Node script!</div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {articles.map(article => (
            <div key={article.id} className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{article.title}</h5>
                  <p className="card-text text-muted">
                     {article.content ? article.content.substring(0, 80) : ''}...
                  </p>
                  <div className="d-flex justify-content-between mt-3">
                    <button onClick={() => setSelectedArticle(article)} className="btn btn-primary btn-sm">Read More</button>
                    {article.is_processed ? <span className="badge bg-success">AI Ready</span> : <span className="badge bg-secondary">Pending</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;