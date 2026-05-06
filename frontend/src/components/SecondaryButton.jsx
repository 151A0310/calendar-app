export default function SecondaryButton({ children, className = "", ...props }) {
    return (
        <button {...props} className={`btn btn-secondary ${className}`}>
            {children}
        </button>
    );
}
