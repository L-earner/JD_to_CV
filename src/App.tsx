import { useState } from "react";
import { CloudUpload } from "lucide-react";

interface CV {
  file: File | null;
  text: string;
}

interface JD {
  text: string;
}

interface Feedback {
  score: number;
  suggestions: string[];
}

const App = () => {
  const [cv, setCV] = useState<CV>({ file: null, text: "" });
  const [jd, setJD] = useState<JD>({ text: "" });
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCVChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setCV({ file, text: reader.result as string });
      };
      reader.readAsText(file);
    }
  };

  const handleJDChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJD({ text: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv: cv.text, jd: jd.text }),
      });
      const data = await response.json();
      setFeedback(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Job Description Comparison</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cv">
            Upload your CV (Word format)
          </label>
          <input
            className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none focus:border-transparent"
            id="cv"
            type="file"
            accept=".docx"
            onChange={handleCVChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jd">
            Paste the Job Description
          </label>
          <textarea
            className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:border-transparent"
            id="jd"
            rows={10}
            value={jd.text}
            onChange={handleJDChange}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <div className="flex justify-center">
              <CloudUpload className="animate-spin" size={24} />
            </div>
          ) : (
            "Compare"
          )}
        </button>
      </form>
      {feedback && (
        <div className="mt-4">
          <h2 className="text-2xl font-bold mb-2">Feedback</h2>
          <p className="text-lg mb-2">Score: {feedback.score}%</p>
          <ul>
            {feedback.suggestions.map((suggestion, index) => (
              <li key={index} className="text-lg mb-2">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;