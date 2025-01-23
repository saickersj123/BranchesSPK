import React from 'react';

const CopyButton: React.FC = () => (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask id="mask0_90_151" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="30" height="30">
            <rect width="30" height="30" fill="#D9D9D9"/>
        </mask>
        <g mask="url(#mask0_90_151)">
            <path d="M11.25 22.5C10.5625 22.5 9.97396 22.2552 9.48438 21.7656C8.99479 21.276 8.75 20.6875 8.75 20V5C8.75 4.3125 8.99479 3.72396 9.48438 3.23438C9.97396 2.74479 10.5625 2.5 11.25 2.5H22.5C23.1875 2.5 23.776 2.74479 24.2656 3.23438C24.7552 3.72396 25 4.3125 25 5V20C25 20.6875 24.7552 21.276 24.2656 21.7656C23.776 22.2552 23.1875 22.5 22.5 22.5H11.25ZM11.25 20H22.5V5H11.25V20ZM6.25 27.5C5.5625 27.5 4.97396 27.2552 4.48438 26.7656C3.99479 26.276 3.75 25.6875 3.75 25V7.5H6.25V25H20V27.5H6.25Z" fill="#1C1B1F"/>
        </g>
    </svg>
);

export default CopyButton;
