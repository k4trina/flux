import { useState } from 'react';
import { motion } from 'framer-motion';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Oops! Something went wrong, please try again');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const time = new Date();
    const timestamp = time.valueOf();
    const previousTimestamp = localStorage.getItem('loops-form-timestamp');

    if (previousTimestamp && Number(previousTimestamp) + 60000 > timestamp) {
      setErrorMessage('Too many signups, please try again in a little while');
      setShowError(true);
      return;
    }

    localStorage.setItem('loops-form-timestamp', timestamp.toString());
    setIsSubmitting(true);

    const formBody = `userGroup=&mailingLists=&email=${encodeURIComponent(email)}`;

    try {
      const res = await fetch('https://app.loops.so/api/newsletter-form/cmhzhsa9t03cfyi0i5d1u7aaa', {
        method: 'POST',
        body: formBody,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (res.ok) {
        setShowSuccess(true);
        setEmail('');
      } else {
        const data = await res.json();
        setErrorMessage(data.message || res.statusText);
        setShowError(true);
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'Failed to fetch') {
        setErrorMessage('Too many signups, please try again in a little while');
      } else if (error instanceof Error && error.message) {
        setErrorMessage(error.message);
      }
      setShowError(true);
      localStorage.setItem('loops-form-timestamp', '');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setShowSuccess(false);
    setShowError(false);
    setErrorMessage('Oops! Something went wrong, please try again');
  };

  return (
    <div className="container">
      <motion.div 
        className="content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="headline">
            End the streaming <span className="highlight">nightmare</span> for good
          </h1>
        </motion.div>

        <motion.p 
          className="subheading"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Flux lets you activate a 24-hour pass to any major streaming service. Binge guilt-free. Cancel nothing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="form-container"
        >
          {!showSuccess && !showError && (
            <form onSubmit={handleSubmit} className="waitlist-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={isSubmitting}
                className="email-input"
              />
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="submit-button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? 'Joining...' : 'Join Waitlist'}
              </motion.button>
            </form>
          )}

          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="success-message"
            >
              <p>You're on the list.</p>
              <button onClick={resetForm} className="back-button">
                ← Back
              </button>
            </motion.div>
          )}

          {showError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="error-message"
            >
              <p>{errorMessage}</p>
              <button onClick={resetForm} className="back-button">
                ← Try again
              </button>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="footer-text"
        >
          Early access • Discounted day-passes
        </motion.div>
      </motion.div>
    </div>
  );
}

export default App;
