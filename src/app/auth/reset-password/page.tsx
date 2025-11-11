'use client'

import { useState, useEffect } from 'react';
import {useSearchParams, useRouter} from "next/navigation";

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const searchParams = useSearchParams();

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        if (tokenParam) {
            setToken(tokenParam);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!password || !confirmPassword) {
            setError('Please fill in both password fields.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        const res = await fetch('/api/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, password }),
        });

        const data = await res.json();

        if (res.ok) {
            setSuccess('Your password has been reset successfully!');
            setTimeout(() => {
                router.push('/auth'); // Redirect to login page
            }, 3000);
        } else {
            setError(data.error);
        }
    };

    return (
        <div>
            <h1>Reset Your Password</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    New Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Confirm New Password:
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </label>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;
