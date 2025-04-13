export default function AuthBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg 
        className="absolute bottom-0 left-0 w-1/2 opacity-10"
        viewBox="0 0 500 500" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          fill="#3B82F6" 
          d="M0,300 Q250,200 500,300 L500,500 L0,500 Z" 
        />
      </svg>
      <svg 
        className="absolute top-0 right-0 w-1/3 opacity-10"
        viewBox="0 0 400 400" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          fill="#60A5FA" 
          d="M0,0 Q200,100 400,0 L400,200 Q200,300 0,200 Z" 
        />
      </svg>
      <div className="absolute top-10 left-10 opacity-20">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="100" 
          height="100" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#3B82F6" 
          strokeWidth="1" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <path d="M20 8v6" />
          <path d="M23 11h-6" />
        </svg>
      </div>
      <div className="absolute bottom-10 right-10 opacity-20">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="100" 
          height="100" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#60A5FA" 
          strokeWidth="1" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      </div>
    </div>
  );
}
