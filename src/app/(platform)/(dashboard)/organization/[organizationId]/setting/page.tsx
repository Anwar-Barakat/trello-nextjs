import { OrganizationProfile } from '@clerk/nextjs';
import React from 'react';

const OrganizationSettingPage = () => {
    return (
        <div className="w-full max-w-5xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6">Organization Settings</h1>
            <OrganizationProfile
                appearance={{
                    elements: {
                        rootBox: {
                            width: '100%',
                            boxShadow: 'none',
                            shadow: 'none',
                            padding: '0',
                        },
                        card: {
                            width: '100%',
                            border: '1px solid #e5e5e5',
                            boxShadow: 'none',
                            borderRadius: '0.5rem',
                            overflow: 'hidden',
                        },
                    
                    },
                }}
            />
        </div>
    );
};

export default OrganizationSettingPage;