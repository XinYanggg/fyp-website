'use client'

import { useState } from 'react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email) {
            setError('Please enter your email.');
            return;
        }

        try {
            const res = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                const { error } = await res.json();
                setError(error);
            } else {
                setSuccess('Check your email for the reset link.');
            }
        } catch (err) {
            setError('Something went wrong. Please try again later.');
        }
    };

    return (
        <div>
            <h1>Forgot Password</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <button type="submit">Send Reset Link</button>
            </form>
        </div>
    );
};

export default ForgotPassword;
