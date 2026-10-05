import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Modern CMYK / Custom Print geometric layers */}
            <rect x="4" y="4" width="10" height="10" rx="3" fill="#E60023" fillOpacity="0.9" />
            <rect x="18" y="4" width="10" height="10" rx="3" fill="#0EA5E9" fillOpacity="0.9" />
            <rect x="4" y="18" width="10" height="10" rx="3" fill="#F59E0B" fillOpacity="0.9" />
            <rect x="18" y="18" width="10" height="10" rx="3" fill="#10B981" fillOpacity="0.9" />
            <circle cx="16" cy="16" r="4" fill="white" />
            <circle cx="16" cy="16" r="2" fill="#1E293B" />
        </svg>
    );
}
