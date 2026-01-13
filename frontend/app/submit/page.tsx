'use client';

import React from 'react';
import { MessForm } from '../../components/MessForm';
import { createMess } from '../../lib/api';

export default function SubmitMessPage() {
    const handleSubmit = async (formData: FormData) => {
        // createdBy could be added here if we want to track who submitted
        await createMess(formData);
    };

    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-foreground tracking-tight sm:text-5xl">
                        Grow Your <span className="text-primary">Mess</span> Business
                    </h1>
                    <p className="mt-4 text-xl text-foreground-500 max-w-2xl mx-auto">
                        Join the largest mess discovery platform in Kerala. Fill out the form below to list your mess for free.
                    </p>
                </div>

                <MessForm
                    onSubmit={handleSubmit}
                    description="Your submission will be reviewed by our team and published once approved."
                />
            </div>
        </div>
    );
}
