import { Metadata } from 'next';
import RootLayout from './components/layout/RootLayout'; // Assuming your RootLayout is here

// Metadata is handled in the layout (server-side)
export const metadata: Metadata = {
    title: 'durian.health',
    description: 'AI-powered durian leaf disease detection for Malaysian farmers',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <RootLayout>{children}</RootLayout>
    );
}
