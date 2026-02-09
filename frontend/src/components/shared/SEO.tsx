import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
}

export const SEO = ({
    title = "MelodyHub - Stream Your Vibe",
    description = "The ultimate music streaming platform for modern listeners. Discover, share, and vibe together.",
    image = "/og-image.png",
    type = "website"
}: SEOProps) => {
    const siteTitle = title === "MelodyHub - Stream Your Vibe" ? title : `${title} | MelodyHub`;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{siteTitle}</title>
            <meta name="description" content={description} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
};
