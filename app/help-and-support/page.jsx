"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firestore';
import { collection, addDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { LifeBuoy, CheckCircle2, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import AccessRestricted from '@/components/restricted-access/AccessRestricted';
import LoadingState from '@/components/loading/LoadingState';

const HelpSupportPage = () => {
    const { user, isLoading } = useAuth();

    // Form States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [category, setCategory] = useState('general');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const [isProfileLoading, setIsProfileLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    // 2. Fetch data from your specific Firestore subcollection layout
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user?.uid) {
                setIsProfileLoading(false);
                return;
            }

            setIsProfileLoading(true);
            try {
                // Path: users -> {userId} -> profile -> details
                const profileDocRef = doc(db, 'users', user.uid, 'profile', 'details');
                const docSnap = await getDoc(profileDocRef);

                if (docSnap.exists()) {
                    const profileData = docSnap.data();
                    // Fall back to Firebase auth data or empty strings if fields don't exist yet
                    setName(profileData.name || user.displayName || '');
                    setEmail(profileData.email || user.email || '');
                    setPhone(profileData.phonePrimary || '');
                } else {
                    // Fallback if the firestore profile document doesn't exist yet
                    setName(user.displayName || '');
                    setEmail(user.email || '');
                }
            } catch (err) {
                console.error("Error fetching user profile from Firestore:", err);
            } finally {
                setIsProfileLoading(false);
            }
        };

        if (!isLoading) {
            fetchUserProfile();
        }
    }, [user, isLoading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!name || !email || !phone || !subject || !message) {
            setError('Please fill in all fields.');
            setLoading(false);
            return;
        }

        try {
            const ticketsRef = collection(db, 'support_tickets');

            await addDoc(ticketsRef, {
                userId: user?.uid || 'guest',
                name: name,
                email: email,
                phone: phone,
                category: category,
                subject: subject,
                message: message,
                status: 'open',
                createdAt: serverTimestamp()
            });

            setSubject('');
            setMessage('');
            setSubmitted(true);
        } catch (err) {
            console.error("Error submitting support ticket: ", err);
            setError('Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // 3. Combine both loading flags so the screen stays clean while fetching
    if (isLoading || isProfileLoading) {
        return (
            <LoadingState message="Loading help & support…"/>
        );
    }

    if(!user){
        return (
            <AccessRestricted message="Please log in to access help and support."/>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto">

                {/* Back Link */}
                <div className="mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                        <ArrowLeft size={16} /> Back to dashboard
                    </Link>
                </div>

                {/* Conditional Screen Rendering */}
                {!submitted ? (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl p-6 sm:p-8">

                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                <LifeBuoy size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Help & Support</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Submit a ticket and our team will get back to you.</p>
                            </div>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 flex items-center gap-2 text-sm">
                                <AlertCircle size={16} className="shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                                    required
                                />
                            </div>


                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                                    Contact Number
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    pattern="[6-9][0-9]{9}"
                                    maxLength="10"
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="9876543210"
                                    className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                                    Category
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                                >
                                    <option value="general">General Inquiry</option>
                                    <option value="technical">Technical Issue</option>
                                    <option value="billing">Billing / Account</option>
                                    <option value="feature">Feature Request</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Briefly describe the issue"
                                    className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                                    How can we help?
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Provide as much detail as possible..."
                                    rows={4}
                                    className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-600/50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors duration-150 shadow-md shadow-teal-600/10 flex items-center justify-center gap-2 hover:cursor-pointer"
                            >
                                {loading ? "Submitting request..." : "Submit Support Request"}
                            </button>
                        </form>
                    </div>
                ) : (
                    /* Success Message Screen */
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl p-8 text-center animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-green-50 dark:bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 size={36} />
                        </div>

                        <h2 className="text-xl font-bold mb-2">Your request has been submitted!</h2>

                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
                            Thank you for reaching out. We have received your ticket and our technical team will review your case shortly.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={() => setSubmitted(false)}
                                className="px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Send another message
                            </button>
                            <Link
                                href="/"
                                className="px-4 py-2 text-sm font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors inline-flex items-center justify-center"
                            >
                                Return Dashboard
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HelpSupportPage;