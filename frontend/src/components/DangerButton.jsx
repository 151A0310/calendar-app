export default function DangerButton({ children, className = "", ...props }) {
    return (
        <button {...props} className={`btn btn-danger ${className}`}>
            {children}
        </button>
    );
}
