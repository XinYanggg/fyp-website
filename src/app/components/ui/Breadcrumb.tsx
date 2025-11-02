interface BreadcrumbItem {
    label: string;
    onClick?: () => void;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    {index > 0 && <span>/</span>}
                    {item.onClick ? (
                        <button
                            onClick={item.onClick}
                            className="hover:text-gray-700 transition-colors cursor-pointer"
                        >
                            {item.label}
                        </button>
                    ) : (
                        <span className="text-gray-700">{item.label}</span>
                    )}
                </div>
            ))}
        </div>
    );
}