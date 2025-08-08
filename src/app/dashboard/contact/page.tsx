'use client';
import React, { useState } from 'react';
import { FiMail, FiCopy, FiCheck, FiInstagram, FiGlobe, FiLink } from 'react-icons/fi';

const EMAIL = 'vp.operations@usstm.ca';
const INSTAGRAM = 'https://instagram.com/usstorontomet';
const WEBSITE = 'https://usstm.ca';
const LINKTREE = 'https://linktr.ee/usstorontomet';

function CopyToClipboard({ text, label }: { text: string; label: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // fallback or error handling
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded bg-gray-50 hover:bg-gray-100 transition text-xs font-medium"
            aria-label={`Copy ${label}`}
            type="button"
        >
            {copied ? (
                <>
                    <FiCheck className="text-green-500" />
                    Copied
                </>
            ) : (
                <>
                    <FiCopy className="text-gray-500" />
                    Copy
                </>
            )}
        </button>
    );
}

export default function ContactPage() {
    return (
        <main className="max-w-2xl mx-auto mt-12 p-4 bg-white rounded-2xl shadow-xl">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">Contact Us</h1>
            <p className="text-gray-600 mb-8 text-base sm:text-lg">
                We&apos;re here to help! If you have any questions, feedback, or need assistance, please don&apos;t hesitate to reach out. 
                Our team is dedicated to providing you with the support you need, whether you&apos;re a current member or simply interested in learning more about USSTM. 
                Feel free to connect with us through any of the channels below. We look forward to hearing from you and will respond as soon as possible.
            </p>

            <div className="overflow-x-auto">
                <div className="min-w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Email */}
                        <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
                            <FiMail className="text-blue-600 text-2xl flex-shrink-0" />
                            <div className="flex-1">
                                <div className="font-semibold text-gray-800 text-base sm:text-lg">Email</div>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-700 break-all text-sm sm:text-base">{EMAIL}</span>
                                    <CopyToClipboard text={EMAIL} label="email address" />
                                </div>
                            </div>
                        </div>
                        {/* Instagram */}
                        <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
                            <FiInstagram className="text-pink-500 text-2xl flex-shrink-0" />
                            <div>
                                <div className="font-semibold text-gray-800 text-base sm:text-lg">Instagram</div>
                                <a
                                    href={INSTAGRAM}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm sm:text-base"
                                >
                                    @usstorontomet
                                </a>
                            </div>
                        </div>
                        {/* Website */}
                        <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
                            <FiGlobe className="text-green-600 text-2xl flex-shrink-0" />
                            <div>
                                <div className="font-semibold text-gray-800 text-base sm:text-lg">Website</div>
                                <a
                                    href={WEBSITE}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm sm:text-base"
                                >
                                    usstm.ca
                                </a>
                            </div>
                        </div>
                        {/* Linktree */}
                        <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
                            <FiLink className="text-purple-600 text-2xl flex-shrink-0" />
                            <div>
                                <div className="font-semibold text-gray-800 text-base sm:text-lg">Linktree</div>
                                <a
                                    href={LINKTREE}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm sm:text-base"
                                >
                                    linktr.ee/usstorontomet
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
