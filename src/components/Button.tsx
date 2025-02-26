function Button({ onClick, children, className }: { onClick: () => void; children: React.ReactNode; className?: string }) {
    return (
        <button onClick={onClick} className={`px-4 py-2 rounded ${className}`}>{children}</button>
    );
}

export default Button;
